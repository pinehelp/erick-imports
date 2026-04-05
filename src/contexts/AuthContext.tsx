import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, signOut, onAuthStateChanged, 
  sendPasswordResetEmail, User as FirebaseUser 
} from 'firebase/auth';
import { AdminUser, AppRole } from '@/types/admin';

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = 'admin-auth-session';

// Fallback mock for when Firebase is not configured
const MOCK_ADMIN: AdminUser = {
  uid: 'admin-001',
  email: 'admin@erickimports.com',
  displayName: 'Erick Admin',
  role: 'admin',
  active: true,
  createdAt: '2025-01-01T00:00:00Z',
  lastLogin: new Date().toISOString(),
};

function firebaseUserToAdmin(fbUser: FirebaseUser): AdminUser {
  return {
    uid: fbUser.uid,
    email: fbUser.email || '',
    displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Admin',
    role: 'admin', // TODO: fetch from Firestore admins collection
    active: true,
    createdAt: fbUser.metadata.creationTime || '',
    lastLogin: fbUser.metadata.lastSignInTime || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    if (firebaseReady && auth) {
      const unsub = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          setUser(firebaseUserToAdmin(fbUser));
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsub;
    } else {
      // Fallback: check localStorage for mock session
      try {
        const saved = localStorage.getItem(AUTH_KEY);
        if (saved) setUser(JSON.parse(saved));
      } catch {}
      setLoading(false);
    }
  }, [firebaseReady]);

  // Persist mock session to localStorage when not using Firebase
  useEffect(() => {
    if (!firebaseReady) {
      if (user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }, [user, firebaseReady]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      if (firebaseReady && auth) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        setUser(firebaseUserToAdmin(cred.user));
      } else {
        // Mock login fallback
        await new Promise(r => setTimeout(r, 600));
        if (email === 'admin@erickimports.com' && password === 'admin123') {
          setUser({ ...MOCK_ADMIN, lastLogin: new Date().toISOString() });
        } else {
          throw new Error('Credenciais inválidas');
        }
      }
    } catch (err: any) {
      const msg = err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found'
        ? 'Credenciais inválidas'
        : err.message || 'Erro ao fazer login';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [firebaseReady]);

  const logout = useCallback(async () => {
    if (firebaseReady && auth) {
      await signOut(auth);
    }
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, [firebaseReady]);

  const resetPassword = useCallback(async (email: string) => {
    if (firebaseReady && auth) {
      await sendPasswordResetEmail(auth, email);
    }
  }, [firebaseReady]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, resetPassword, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useRequireRole(role: AppRole): boolean {
  const { user } = useAuth();
  if (!user) return false;
  const hierarchy: AppRole[] = ['viewer', 'manager', 'admin'];
  return hierarchy.indexOf(user.role) >= hierarchy.indexOf(role);
}
