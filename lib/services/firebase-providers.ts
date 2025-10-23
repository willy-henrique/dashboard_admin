import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc,
  updateDoc,
  serverTimestamp,
  getDocs
} from 'firebase/firestore'
import { db } from '../firebase'

export interface FirebaseProvider {
  id: string
  nome: string
  telefone: string
  email: string
  status: 'disponivel' | 'ocupado' | 'online' | 'offline'
  localizacao: {
    lat: number
    lng: number
  }
  ultimaAtualizacao: any
  servicoAtual?: string | null
  especialidades: string[]
  avaliacao: number
  totalServicos: number
  ativo: boolean
  createdAt: any
  updatedAt: any
}

export class FirebaseProvidersService {
  private static collectionName = 'providers'

  // Buscar todos os prestadores
  static async getProviders(): Promise<FirebaseProvider[]> {
    if (!db) {
      console.warn('Firebase não inicializado, retornando dados mock')
      return this.getMockProviders()
    }

    try {
      const q = query(
        collection(db, this.collectionName),
        where('ativo', '==', true),
        orderBy('ultimaAtualizacao', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseProvider[]
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error)
      return this.getMockProviders()
    }
  }

  // Buscar prestadores ativos (disponível, ocupado, online)
  static async getActiveProviders(): Promise<FirebaseProvider[]> {
    if (!db) {
      return this.getMockProviders().filter(p => 
        ['disponivel', 'ocupado', 'online'].includes(p.status)
      )
    }

    try {
      const q = query(
        collection(db, this.collectionName),
        where('ativo', '==', true),
        where('status', 'in', ['disponivel', 'ocupado', 'online']),
        orderBy('ultimaAtualizacao', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseProvider[]
    } catch (error) {
      console.error('Erro ao buscar prestadores ativos:', error)
      return this.getMockProviders().filter(p => 
        ['disponivel', 'ocupado', 'online'].includes(p.status)
      )
    }
  }

  // Atualizar localização de um prestador
  static async updateProviderLocation(
    providerId: string, 
    lat: number, 
    lng: number
  ): Promise<void> {
    if (!db) {
      console.warn('Firebase não inicializado')
      return
    }

    try {
      const providerRef = doc(db, this.collectionName, providerId)
      await updateDoc(providerRef, {
        'localizacao.lat': lat,
        'localizacao.lng': lng,
        ultimaAtualizacao: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao atualizar localização:', error)
    }
  }

  // Atualizar status de um prestador
  static async updateProviderStatus(
    providerId: string, 
    status: FirebaseProvider['status'],
    servicoAtual?: string
  ): Promise<void> {
    if (!db) {
      console.warn('Firebase não inicializado')
      return
    }

    try {
      const providerRef = doc(db, this.collectionName, providerId)
      const updateData: any = {
        status,
        ultimaAtualizacao: serverTimestamp()
      }
      
      if (servicoAtual !== undefined) {
        updateData.servicoAtual = servicoAtual
      }

      await updateDoc(providerRef, updateData)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  // Escutar mudanças em tempo real
  static listenToActiveProviders(
    callback: (providers: FirebaseProvider[]) => void
  ): () => void {
    if (!db) {
      console.warn('Firebase não inicializado, usando dados mock')
      const mockProviders = this.getMockProviders().filter(p => 
        ['disponivel', 'ocupado', 'online'].includes(p.status)
      )
      callback(mockProviders)
      
      // Simular atualizações em tempo real
      const interval = setInterval(() => {
        const updatedProviders = mockProviders.map(p => ({
          ...p,
          ultimaAtualizacao: new Date()
        }))
        callback(updatedProviders)
      }, 30000)
      
      return () => clearInterval(interval)
    }

    try {
      const q = query(
        collection(db, this.collectionName),
        where('ativo', '==', true),
        where('status', 'in', ['disponivel', 'ocupado', 'online']),
        orderBy('ultimaAtualizacao', 'desc')
      )

      return onSnapshot(q, (snapshot) => {
        const providers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FirebaseProvider[]
        callback(providers)
      })
    } catch (error) {
      console.error('Erro ao escutar prestadores:', error)
      const mockProviders = this.getMockProviders().filter(p => 
        ['disponivel', 'ocupado', 'online'].includes(p.status)
      )
      callback(mockProviders)
      return () => {}
    }
  }

  // Dados mock para desenvolvimento
  private static getMockProviders(): FirebaseProvider[] {
    return [
      {
        id: "1",
        nome: "João Silva",
        telefone: "(27) 99999-1111",
        email: "joao.silva@email.com",
        status: "disponivel",
        localizacao: { lat: -20.3155, lng: -40.3128 },
        ultimaAtualizacao: new Date(),
        servicoAtual: null,
        especialidades: ["Limpeza Residencial", "Limpeza Comercial"],
        avaliacao: 4.8,
        totalServicos: 156,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2",
        nome: "Maria Santos",
        telefone: "(27) 99999-2222",
        email: "maria.santos@email.com",
        status: "ocupado",
        localizacao: { lat: -20.3255, lng: -40.3228 },
        ultimaAtualizacao: new Date(Date.now() - 5 * 60 * 1000),
        servicoAtual: "Limpeza Residencial - Centro",
        especialidades: ["Limpeza Residencial", "Pós-Obra"],
        avaliacao: 4.9,
        totalServicos: 203,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "3",
        nome: "Carlos Lima",
        telefone: "(27) 99999-3333",
        email: "carlos.lima@email.com",
        status: "online",
        localizacao: { lat: -20.3055, lng: -40.3028 },
        ultimaAtualizacao: new Date(Date.now() - 2 * 60 * 1000),
        servicoAtual: null,
        especialidades: ["Limpeza Comercial", "Manutenção"],
        avaliacao: 4.7,
        totalServicos: 89,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "4",
        nome: "Ana Costa",
        telefone: "(27) 99999-4444",
        email: "ana.costa@email.com",
        status: "disponivel",
        localizacao: { lat: -20.3355, lng: -40.3328 },
        ultimaAtualizacao: new Date(),
        servicoAtual: null,
        especialidades: ["Limpeza Residencial", "Organização"],
        avaliacao: 4.6,
        totalServicos: 134,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "5",
        nome: "Pedro Oliveira",
        telefone: "(27) 99999-5555",
        email: "pedro.oliveira@email.com",
        status: "offline",
        localizacao: { lat: -20.3455, lng: -40.3428 },
        ultimaAtualizacao: new Date(Date.now() - 45 * 60 * 1000),
        servicoAtual: null,
        especialidades: ["Limpeza Industrial", "Pós-Obra"],
        avaliacao: 4.5,
        totalServicos: 67,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
}
