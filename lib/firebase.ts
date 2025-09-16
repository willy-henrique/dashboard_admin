import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Configuração do Firebase com fallbacks para desenvolvimento
const firebaseConfig = {
  apiKey: process.env['NEXT_PUBLIC_FIREBASE_API_KEY'] || 'AIzaSyDEqhKhvclyd-qfo2Hmxg2e44f0cF621CI',
  authDomain: process.env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'] || 'aplicativoservico-143c2.firebaseapp.com',
  projectId: process.env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'] || 'aplicativoservico-143c2',
  storageBucket: process.env['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'] || 'aplicativoservico-143c2.firebasestorage.app',
  messagingSenderId: process.env['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'] || '183171649633',
  appId: process.env['NEXT_PUBLIC_FIREBASE_APP_ID'] || '1:183171649633:web:2cb40dbbdc82847cf8da20',
  measurementId: process.env['NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'] || 'G-TSQBJSN34S',
};

// Verificar se estamos em produção e se as variáveis estão configuradas
const isProduction = process.env.NODE_ENV === 'production';
const hasFirebaseConfig = process.env['NEXT_PUBLIC_FIREBASE_API_KEY'] && 
                         process.env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'];

if (isProduction && !hasFirebaseConfig) {
  console.warn('⚠️ Firebase não configurado para produção. Configure as variáveis de ambiente no Vercel.');
}

// Initialize Firebase
let app, db, auth, analytics;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
  
  // Inicializar Analytics apenas no cliente e se suportado
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('📊 Firebase Analytics inicializado com sucesso!');
      } else {
        console.warn('⚠️ Firebase Analytics não é suportado neste navegador');
      }
    });
  }
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error);
  // Em caso de erro, criar instâncias mock para desenvolvimento
  app = null;
  db = null;
  auth = null;
  analytics = null;
}

export { app, db, auth, analytics };
