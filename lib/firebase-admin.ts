import admin from 'firebase-admin'

const getServiceAccount = () => {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!json) return null
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

if (!admin.apps.length) {
  const serviceAccount = getServiceAccount()
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
  }
}

export const adminApp = admin.apps.length ? admin.app() : null
export const adminStorage = adminApp ? adminApp.storage().bucket() : null


