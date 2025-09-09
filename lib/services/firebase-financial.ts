import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc,
  updateDoc,
  addDoc,
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
      console.warn('Firebase não inicializado, retornando dados mock')
      return this.getMockTransactions()
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
      return this.getMockTransactions()
    }
  }

  // Buscar transações por período
  static async getTransactionsByPeriod(
    dataInicio: string, 
    dataFim: string
  ): Promise<FirebaseTransaction[]> {
    if (!db) {
      return this.getMockTransactions().filter(t => 
        t.data >= dataInicio && t.data <= dataFim
      )
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
      return this.getMockTransactions().filter(t => 
        t.data >= dataInicio && t.data <= dataFim
      )
    }
  }

  // Criar nova transação
  static async createTransaction(
    transactionData: Omit<FirebaseTransaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    if (!db) {
      console.warn('Firebase não inicializado')
      return 'mock-id'
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
      console.warn('Firebase não inicializado, retornando dados mock')
      return this.getMockAccounts()
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
      return this.getMockAccounts()
    }
  }

  // Criar nova conta
  static async createAccount(
    accountData: Omit<FirebaseAccount, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    if (!db) {
      console.warn('Firebase não inicializado')
      return 'mock-id'
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
      console.warn('Firebase não inicializado, usando dados mock')
      const mockTransactions = this.getMockTransactions()
      callback(mockTransactions)
      return () => {}
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
      const mockTransactions = this.getMockTransactions()
      callback(mockTransactions)
      return () => {}
    }
  }

  // Dados mock para desenvolvimento
  private static getMockTransactions(): FirebaseTransaction[] {
    return [
      {
        id: "1",
        tipo: "receita",
        categoria: "servicos",
        descricao: "Pagamento de serviço #699411371",
        valor: 350.0,
        data: "2025-01-15",
        conta: {
          id: "1",
          nome: "Conta Corrente Principal",
          banco: "Banco do Brasil"
        },
        pedido: {
          id: "1",
          numero: "ORD-2025-001"
        },
        prestador: {
          id: "1",
          nome: "João Silva"
        },
        status: "confirmada",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2",
        tipo: "despesa",
        categoria: "combustivel",
        descricao: "Combustível - Veículo ABC-1234",
        valor: 120.0,
        data: "2025-01-15",
        conta: {
          id: "1",
          nome: "Conta Corrente Principal",
          banco: "Banco do Brasil"
        },
        status: "confirmada",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "3",
        tipo: "despesa",
        categoria: "fornecedores",
        descricao: "Pagamento de fornecedor",
        valor: 850.0,
        data: "2025-01-14",
        conta: {
          id: "1",
          nome: "Conta Corrente Principal",
          banco: "Banco do Brasil"
        },
        status: "pendente",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }

  private static getMockAccounts(): FirebaseAccount[] {
    return [
      {
        id: "1",
        nome: "Conta Corrente Principal",
        banco: "Banco do Brasil",
        agencia: "1234-5",
        conta: "12345-6",
        tipo: "corrente",
        saldo: 15750.5,
        status: "ativa",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2",
        nome: "Conta Poupança",
        banco: "Caixa Econômica",
        agencia: "0987-6",
        conta: "98765-4",
        tipo: "poupanca",
        saldo: 8200.0,
        status: "ativa",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "3",
        nome: "Conta Investimento",
        banco: "Itaú",
        agencia: "5678-9",
        conta: "56789-0",
        tipo: "investimento",
        saldo: 25000.0,
        status: "ativa",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
}
