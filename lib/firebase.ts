import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase com fallbacks para desenvolvimento
const firebaseConfig = {
  apiKey: process.env['NEXT_PUBLIC_FIREBASE_API_KEY'] || 'demo-api-key',
  authDomain: process.env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'] || 'demo-project.firebaseapp.com',
  projectId: process.env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'] || 'demo-project',
  storageBucket: process.env['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'] || 'demo-project.appspot.com',
  messagingSenderId: process.env['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'] || '123456789',
  appId: process.env['NEXT_PUBLIC_FIREBASE_APP_ID'] || '1:123456789:web:abcdef',
};

// Verificar se estamos em produção e se as variáveis estão configuradas
const isProduction = process.env.NODE_ENV === 'production';
const hasFirebaseConfig = process.env['NEXT_PUBLIC_FIREBASE_API_KEY'] && 
                         process.env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'];

if (isProduction && !hasFirebaseConfig) {
  console.warn('⚠️ Firebase não configurado para produção. Configure as variáveis de ambiente no Vercel.');
}

// Initialize Firebase
let app, db, auth;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error);
  // Em caso de erro, criar instâncias mock para desenvolvimento
  app = null;
  db = null;
  auth = null;
}

export { app, db, auth };
