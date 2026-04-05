import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// ─── Firebase Configuration ───
// Fill in your Firebase project config here or set via environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId);
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured()) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
}

export { app, db, auth, storage };

// ─── Collection Names ───
export const COLLECTIONS = {
  LEAD_SESSIONS: 'lead_sessions',
  LEAD_QUOTES: 'lead_quotes',
  CATALOG_TRADE_IN: 'catalog_trade_in',
  CATALOG_SALE: 'catalog_sale',
  PRICING_RULES: 'pricing_rules',
  APP_SETTINGS: 'app_settings',
  ADMINS: 'admins',
  LEAD_NOTES: 'lead_notes',
  LEAD_STATUS_HISTORY: 'lead_status_history',
} as const;

// ─── Storage Paths ───
export const STORAGE_PATHS = {
  leadPhotos: (sessionId: string) => `lead_photos/${sessionId}`,
};
