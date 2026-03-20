// ─── Firebase Configuration Placeholder ───
// Replace with your Firebase project config when ready.

export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
};

// ─── Firebase Initialization ───
// Uncomment and configure when Firebase SDK is installed:
//
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// import { getAuth } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';
//
// export const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const storage = getStorage(app);
// export const auth = getAuth(app);
// export const analytics = getAnalytics(app);

// ─── Collection References ───
// import { collection } from 'firebase/firestore';
//
// export const collections = {
//   leadSessions: collection(db, 'lead_sessions'),
//   leadQuotes: collection(db, 'lead_quotes'),
//   catalogModels: collection(db, 'catalog_models'),
//   pricingRules: collection(db, 'pricing_rules'),
//   admins: collection(db, 'admins'),
// };

// ─── Storage Paths ───
export const storagePaths = {
  leadPhotos: (sessionId: string) => `lead_photos/${sessionId}`,
};
