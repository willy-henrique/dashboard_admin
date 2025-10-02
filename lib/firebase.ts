import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Configuração do Firebase — usa acesso estático para Next injetar no build
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Verificar se estamos em produção e se as variáveis estão configuradas
const isProduction = process.env.NODE_ENV === 'production';
// Validar somente no servidor (SSR) para evitar erro no cliente
const isServer = typeof window === 'undefined';
if (isProduction && isServer) {
  const keyPairs: Array<[string, string | undefined]> = [
    ['NEXT_PUBLIC_FIREBASE_API_KEY', process.env.NEXT_PUBLIC_FIREBASE_API_KEY],
    ['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN],
    ['NEXT_PUBLIC_FIREBASE_PROJECT_ID', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID],
    ['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET],
    ['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID],
    ['NEXT_PUBLIC_FIREBASE_APP_ID', process.env.NEXT_PUBLIC_FIREBASE_APP_ID],
  ];
  const missing = keyPairs.filter(([, v]) => !v).map(([k]) => k);
  if (missing.length > 0) {
    console.warn(`⚠️ Variáveis de ambiente do Firebase ausentes em produção: ${missing.join(', ')}`);
    console.warn('⚠️ Firebase será inicializado com configuração mock para desenvolvimento');
  }
}

// Initialize Firebase
let app, db, auth, storage, analytics;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  
  // Inicializar Analytics apenas no cliente e se suportado
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('📊 Firebase Analytics inicializado com sucesso!');
      } else {
        console.warn('⚠️ Firebase Analytics não é suportado neste navegador');
        analytics = null;
      }
    }).catch((error) => {
      console.warn('⚠️ Erro ao verificar suporte do Analytics:', error);
      analytics = null;
    });
  } else {
    analytics = null;
  }
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error);
  // Em caso de erro, criar instâncias mock para desenvolvimento
  app = null;
  db = null;
  auth = null;
  storage = null;
  analytics = null;
}

export { app, db, auth, storage, analytics };
