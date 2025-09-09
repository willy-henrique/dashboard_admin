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

export interface FirebaseOrder {
  id: string
  numero: string
  cliente: {
    id: string
    nome: string
    telefone: string
    email: string
  }
  servico: {
    id: string
    nome: string
    descricao: string
    categoria: string
  }
  valor: number
  status: 'pendente' | 'aceito' | 'em_andamento' | 'concluido' | 'cancelado'
  dataCriacao: any
  dataAgendamento: string
  endereco: {
    rua: string
    numero: string
    bairro: string
    cidade: string
    cep: string
    complemento?: string
    coordenadas?: {
      lat: number
      lng: number
    }
  }
  prestador?: {
    id: string
    nome: string
    telefone: string
  }
  observacoes?: string
  avaliacao?: {
    nota: number
    comentario?: string
  }
  createdAt: any
  updatedAt: any
}

export class FirebaseOrdersService {
  private static collectionName = 'orders'

  // Buscar todos os pedidos
  static async getOrders(): Promise<FirebaseOrder[]> {
    if (!db) {
      console.warn('Firebase não inicializado, retornando dados mock')
      return this.getMockOrders()
    }

    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('dataCriacao', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseOrder[]
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
      return this.getMockOrders()
    }
  }

  // Buscar pedidos por status
  static async getOrdersByStatus(status: FirebaseOrder['status']): Promise<FirebaseOrder[]> {
    if (!db) {
      return this.getMockOrders().filter(o => o.status === status)
    }

    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', status),
        orderBy('dataCriacao', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseOrder[]
    } catch (error) {
      console.error('Erro ao buscar pedidos por status:', error)
      return this.getMockOrders().filter(o => o.status === status)
    }
  }

  // Criar novo pedido
  static async createOrder(orderData: Omit<FirebaseOrder, 'id' | 'numero' | 'dataCriacao' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!db) {
      console.warn('Firebase não inicializado')
      return 'mock-id'
    }

    try {
      const numero = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
      
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...orderData,
        numero,
        dataCriacao: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      throw error
    }
  }

  // Atualizar status do pedido
  static async updateOrderStatus(
    orderId: string, 
    status: FirebaseOrder['status'],
    prestador?: FirebaseOrder['prestador']
  ): Promise<void> {
    if (!db) {
      console.warn('Firebase não inicializado')
      return
    }

    try {
      const orderRef = doc(db, this.collectionName, orderId)
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      }
      
      if (prestador) {
        updateData.prestador = prestador
      }

      await updateDoc(orderRef, updateData)
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error)
      throw error
    }
  }

  // Escutar mudanças em tempo real
  static listenToOrders(
    callback: (orders: FirebaseOrder[]) => void
  ): () => void {
    if (!db) {
      console.warn('Firebase não inicializado, usando dados mock')
      const mockOrders = this.getMockOrders()
      callback(mockOrders)
      return () => {}
    }

    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('dataCriacao', 'desc')
      )

      return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FirebaseOrder[]
        callback(orders)
      })
    } catch (error) {
      console.error('Erro ao escutar pedidos:', error)
      const mockOrders = this.getMockOrders()
      callback(mockOrders)
      return () => {}
    }
  }

  // Dados mock para desenvolvimento
  private static getMockOrders(): FirebaseOrder[] {
    return [
      {
        id: "1",
        numero: "ORD-2025-001",
        cliente: {
          id: "1",
          nome: "João Silva",
          telefone: "(27) 99999-1111",
          email: "joao@email.com"
        },
        servico: {
          id: "1",
          nome: "Limpeza Residencial",
          descricao: "Limpeza completa da casa",
          categoria: "Limpeza"
        },
        valor: 150.0,
        status: "pendente",
        dataCriacao: new Date(),
        dataAgendamento: "2025-01-16",
        endereco: {
          rua: "Rua das Flores",
          numero: "123",
          bairro: "Centro",
          cidade: "Vitória",
          cep: "29000-000",
          coordenadas: { lat: -20.3155, lng: -40.3128 }
        },
        observacoes: "Limpeza completa da casa",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2",
        numero: "ORD-2025-002",
        cliente: {
          id: "2",
          nome: "Maria Santos",
          telefone: "(27) 99999-2222",
          email: "maria@email.com"
        },
        servico: {
          id: "2",
          nome: "Limpeza Comercial",
          descricao: "Limpeza do escritório",
          categoria: "Limpeza"
        },
        valor: 300.0,
        status: "em_andamento",
        dataCriacao: new Date(Date.now() - 2 * 60 * 60 * 1000),
        dataAgendamento: "2025-01-15",
        endereco: {
          rua: "Av. Comercial",
          numero: "456",
          bairro: "Jardim da Penha",
          cidade: "Vitória",
          cep: "29060-000",
          coordenadas: { lat: -20.3255, lng: -40.3228 }
        },
        prestador: {
          id: "2",
          nome: "Maria Santos",
          telefone: "(27) 99999-2222"
        },
        observacoes: "Limpeza do escritório",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: "3",
        numero: "ORD-2025-003",
        cliente: {
          id: "3",
          nome: "Pedro Costa",
          telefone: "(27) 99999-3333",
          email: "pedro@email.com"
        },
        servico: {
          id: "3",
          nome: "Limpeza Pós-Obra",
          descricao: "Limpeza após reforma",
          categoria: "Limpeza"
        },
        valor: 500.0,
        status: "concluido",
        dataCriacao: new Date(Date.now() - 24 * 60 * 60 * 1000),
        dataAgendamento: "2025-01-14",
        endereco: {
          rua: "Rua da Construção",
          numero: "789",
          bairro: "Santa Luíza",
          cidade: "Vitória",
          cep: "29045-000",
          coordenadas: { lat: -20.3055, lng: -40.3028 }
        },
        prestador: {
          id: "3",
          nome: "Carlos Lima",
          telefone: "(27) 99999-3333"
        },
        observacoes: "Limpeza após reforma",
        avaliacao: {
          nota: 5,
          comentario: "Excelente serviço!"
        },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ]
  }
}
