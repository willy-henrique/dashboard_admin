import * as admin from 'firebase-admin'

const getServiceAccount = () => {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!json) {
    console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT não configurado')
    console.warn('⚠️ Para configurar, adicione a variável FIREBASE_SERVICE_ACCOUNT no arquivo .env.local')
    console.warn('⚠️ Formato: FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}')
    return null
  }
  try {
    const parsed = JSON.parse(json)
    console.log('✅ Firebase Service Account carregado')
    return parsed
  } catch (error) {
    console.error('❌ Erro ao parsear FIREBASE_SERVICE_ACCOUNT:', error)
    console.error('❌ Verifique se o JSON está válido e bem formatado')
    return null
  }
}

if (!admin.apps.length) {
  const serviceAccount = getServiceAccount()
  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'aplicativoservico-143c2.appspot.com',
      })
      console.log('✅ Firebase Admin SDK inicializado com sucesso')
    } catch (error) {
      console.error('❌ Erro ao inicializar Firebase Admin SDK:', error)
    }
  } else {
    console.warn('⚠️ Firebase Admin SDK não inicializado - sem service account')
  }
}

export const adminApp = admin.apps.length ? admin.app() : null
export const adminStorage = adminApp ? adminApp.storage().bucket() : null

console.log('🔍 Firebase Admin Status:', {
  app: !!adminApp,
  storage: !!adminStorage,
  serviceAccount: !!getServiceAccount()
})


