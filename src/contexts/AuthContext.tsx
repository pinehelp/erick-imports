import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AdminUser, AppRole } from '@/types/admin';

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock admin for dev — replace with Firebase Auth
const MOCK_ADMIN: AdminUser = {
  uid: 'admin-001',
  email: 'admin@erickimports.com',
  displayName: 'Erick Admin',
  role: 'admin',
  active: true,
  createdAt: '2025-01-01T00:00:00Z',
  lastLogin: new Date().toISOString(),
};

const AUTH_KEY = 'admin-auth-session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate Firebase Auth — replace with:
      // const cred = await signInWithEmailAndPassword(auth, email, password);
      await new Promise(r => setTimeout(r, 800));
      if (email === 'admin@erickimports.com' && password === 'admin123') {
        setUser({ ...MOCK_ADMIN, lastLogin: new Date().toISOString() });
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // signOut(auth);
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAuthenticated: !!user }}>
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
