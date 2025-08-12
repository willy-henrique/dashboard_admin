import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
  type DocumentData,
  type QueryConstraint,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

// Generic Firestore helpers
export const getCollection = async (collectionName: string, ...constraints: QueryConstraint[]) => {
  const q = query(collection(db, collectionName), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
}

export const addDocument = async (collectionName: string, data: any) => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  const docRef = doc(db, collectionName, docId)
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export const deleteDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId)
  await deleteDoc(docRef)
}

export const listenToCollection = (
  collectionName: string,
  callback: (data: DocumentData[]) => void,
  ...constraints: QueryConstraint[]
) => {
  const q = query(collection(db, collectionName), ...constraints)
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(data)
  })
}

export const listenToDocument = (
  collectionName: string,
  docId: string,
  callback: (data: DocumentData | null) => void,
) => {
  const docRef = doc(db, collectionName, docId)
  return onSnapshot(docRef, (doc) => {
    const data = doc.exists() ? { id: doc.id, ...doc.data() } : null
    callback(data)
  })
}
