import {
  collection,
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

  // Buscar todos os prestadores (filtro/ordenação em memória - sem índice composto)
  static async getProviders(): Promise<FirebaseProvider[]> {
    if (!db) {
      console.warn('Firebase não inicializado')
      return []
    }

    try {
      const snapshot = await getDocs(collection(db, this.collectionName))
      const mapped = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as FirebaseProvider[]
      const providers = mapped.filter(p => p.ativo === true)
      return providers.sort((a, b) => {
        const aDate = a.ultimaAtualizacao?.toDate?.() ?? a.ultimaAtualizacao ?? new Date(0)
        const bDate = b.ultimaAtualizacao?.toDate?.() ?? b.ultimaAtualizacao ?? new Date(0)
        return new Date(bDate).getTime() - new Date(aDate).getTime()
      })
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error)
      return []
    }
  }

  // Buscar prestadores ativos (disponível, ocupado, online)
  static async getActiveProviders(): Promise<FirebaseProvider[]> {
    if (!db) {
      console.warn('Firebase não inicializado')
      return []
    }

    try {
      const snapshot = await getDocs(collection(db, this.collectionName))
      const mapped = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as FirebaseProvider[]
      const providers = mapped.filter(p =>
        p.ativo === true && ['disponivel', 'ocupado', 'online'].includes(p.status)
      )
      return providers.sort((a, b) => {
        const aDate = a.ultimaAtualizacao?.toDate?.() ?? a.ultimaAtualizacao ?? new Date(0)
        const bDate = b.ultimaAtualizacao?.toDate?.() ?? b.ultimaAtualizacao ?? new Date(0)
        return new Date(bDate).getTime() - new Date(aDate).getTime()
      })
    } catch (error) {
      console.error('Erro ao buscar prestadores ativos:', error)
      return []
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
      console.warn('Firebase não inicializado')
      callback([])
      return () => { }
    }

    try {
      const colRef = collection(db, this.collectionName)

      return onSnapshot(colRef, (snapshot) => {
        const mapped = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as FirebaseProvider[]
        const allProviders = mapped.filter(p =>
          p.ativo === true && ['disponivel', 'ocupado', 'online'].includes(p.status)
        )
        const providers = allProviders
          .sort((a, b) => {
            const aDate = a.ultimaAtualizacao?.toDate?.() ?? a.ultimaAtualizacao ?? new Date(0)
            const bDate = b.ultimaAtualizacao?.toDate?.() ?? b.ultimaAtualizacao ?? new Date(0)
            return new Date(bDate).getTime() - new Date(aDate).getTime()
          })
        callback(providers)
      })
    } catch (error) {
      console.error('Erro ao escutar prestadores:', error)
      callback([])
      return () => { }
    }
  }

}
