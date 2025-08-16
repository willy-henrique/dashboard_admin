import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env['NEXT_PUBLIC_FIREBASE_API_KEY'] || 'test-api-key',
  authDomain: process.env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'] || 'test.firebaseapp.com',
  projectId: process.env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'] || 'test-project',
  storageBucket: process.env['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'] || 'test.appspot.com',
  messagingSenderId: process.env['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'] || '123456789',
  appId: process.env['NEXT_PUBLIC_FIREBASE_APP_ID'] || 'test-app-id',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
