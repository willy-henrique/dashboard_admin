import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'

export interface FirebaseTransaction {
  id: string
  tipo: 'receita' | 'despesa'
  categoria: string
  descricao: string
  valor: number
  data: string
  conta: {
    id: string
    nome: string
    banco: string
  }
  pedido?: {
    id: string
    numero: string
  }
  prestador?: {
    id: string
    nome: string
  }
  status: 'pendente' | 'confirmada' | 'cancelada'
  observacoes?: string
  createdAt: any
  updatedAt: any
}

export interface FirebaseAccount {
  id: string
  nome: string
  banco: string
  agencia: string
  conta: string
  tipo: 'corrente' | 'poupanca' | 'investimento'
  saldo: number
  status: 'ativa' | 'inativa'
  createdAt: any
  updatedAt: any
}

export class FirebaseFinancialService {
  private static transactionsCollection = 'transactions'
  private static accountsCollection = 'accounts'

  // === TRANSAÇÕES ===

  // Buscar todas as transações
  static async getTransactions(): Promise<FirebaseTransaction[]> {
    if (!db) {
      console.warn('Firebase não inicializado')
      return []
    }

    try {
      const q = query(
        collection(db, this.transactionsCollection),
        orderBy('data', 'desc')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseTransaction[]
    } catch (error) {
      console.error('Erro ao buscar transações:', error)
      return []
    }
  }

  // Buscar transações por período
  static async getTransactionsByPeriod(
    dataInicio: string,
    dataFim: string
  ): Promise<FirebaseTransaction[]> {
    if (!db) {
      console.warn('Firebase não inicializado')
      return []
    }

    try {
      const q = query(
        collection(db, this.transactionsCollection),
        where('data', '>=', dataInicio),
        where('data', '<=', dataFim),
        orderBy('data', 'desc')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseTransaction[]
    } catch (error) {
      console.error('Erro ao buscar transações por período:', error)
      return []
    }
  }

  // Criar nova transação
  static async createTransaction(
    transactionData: Omit<FirebaseTransaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    if (!db) {
      console.warn('Firebase não inicializado')
      return ''
    }

    try {
      const docRef = await addDoc(collection(db, this.transactionsCollection), {
        ...transactionData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      return docRef.id
    } catch (error) {
      console.error('Erro ao criar transação:', error)
      throw error
    }
  }

  // === CONTAS ===

  // Buscar todas as contas
  static async getAccounts(): Promise<FirebaseAccount[]> {
    if (!db) {
      console.warn('Firebase não inicializado')
      return []
    }

    try {
      const q = query(
        collection(db, this.accountsCollection),
        where('status', '==', 'ativa'),
        orderBy('nome')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseAccount[]
    } catch (error) {
      console.error('Erro ao buscar contas:', error)
      return []
    }
  }

  // Criar nova conta
  static async createAccount(
    accountData: Omit<FirebaseAccount, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    if (!db) {
      console.warn('Firebase não inicializado')
      return ''
    }

    try {
      const docRef = await addDoc(collection(db, this.accountsCollection), {
        ...accountData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      return docRef.id
    } catch (error) {
      console.error('Erro ao criar conta:', error)
      throw error
    }
  }

  // Escutar mudanças em tempo real
  static listenToTransactions(
    callback: (transactions: FirebaseTransaction[]) => void
  ): () => void {
    if (!db) {
      console.warn('Firebase não inicializado')
      callback([])
      return () => { }
    }

    try {
      const q = query(
        collection(db, this.transactionsCollection),
        orderBy('data', 'desc')
      )

      return onSnapshot(q, (snapshot) => {
        const transactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FirebaseTransaction[]
        callback(transactions)
      })
    } catch (error) {
      console.error('Erro ao escutar transações:', error)
      callback([])
      return () => { }
    }
  }
}
