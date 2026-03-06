import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { isProviderActiveStatus } from '@/lib/providers/status'

type ProviderStatus = 'disponivel' | 'ocupado' | 'online' | 'offline'

export interface FirebaseProvider {
  id: string
  nome: string
  telefone: string
  email: string
  status: ProviderStatus
  verificationStatus?: string
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

function stringOrEmpty(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function numberOrZero(value: unknown): number {
  return typeof value === 'number' ? value : 0
}

function arrayOfString(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function normalizeProvider(raw: Record<string, unknown>, id: string): FirebaseProvider {
  const statusRaw = stringOrEmpty(raw.status ?? raw.situacao ?? raw.state).toLowerCase()
  const status: ProviderStatus =
    statusRaw === 'disponivel' ||
    statusRaw === 'ocupado' ||
    statusRaw === 'online' ||
    statusRaw === 'offline'
      ? statusRaw
      : 'offline'

  const loc = raw.localizacao as Record<string, unknown> | undefined
  const latitude = numberOrZero(loc?.lat ?? raw.latitude ?? raw.lat)
  const longitude = numberOrZero(loc?.lng ?? raw.longitude ?? raw.lng)
  const ativoValue = raw.ativo ?? raw.isActive ?? raw.active
  const ativo = typeof ativoValue === 'boolean' ? ativoValue : status !== 'offline'

  return {
    ...(raw as any),
    id,
    nome: stringOrEmpty(raw.nome ?? raw.name ?? raw.fullName ?? raw.displayName) || 'Prestador sem nome',
    telefone: stringOrEmpty(raw.telefone ?? raw.phone ?? raw.phoneNumber),
    email: stringOrEmpty(raw.email),
    status,
    verificationStatus: stringOrEmpty(raw.verificationStatus ?? raw.statusVerificacao ?? raw.verification_status),
    localizacao: {
      lat: latitude,
      lng: longitude,
    },
    ultimaAtualizacao: raw.ultimaAtualizacao ?? raw.updatedAt ?? raw.lastSeenAt ?? raw.lastUpdate ?? null,
    servicoAtual: stringOrEmpty(raw.servicoAtual ?? raw.currentService) || null,
    especialidades: arrayOfString(raw.especialidades ?? raw.serviceCategories ?? raw.categories),
    avaliacao: numberOrZero(raw.avaliacao ?? raw.rating),
    totalServicos: numberOrZero(raw.totalServicos ?? raw.totalOrders),
    ativo,
    createdAt: raw.createdAt ?? null,
    updatedAt: raw.updatedAt ?? null,
  }
}

export class FirebaseProvidersService {
  private static collectionName = 'providers'

  private static sortByLastUpdate(providers: FirebaseProvider[]) {
    return providers.sort((a, b) => {
      const aDate = a.ultimaAtualizacao?.toDate?.() ?? a.ultimaAtualizacao ?? new Date(0)
      const bDate = b.ultimaAtualizacao?.toDate?.() ?? b.ultimaAtualizacao ?? new Date(0)

      return new Date(bDate).getTime() - new Date(aDate).getTime()
    })
  }

  static async getProviders(): Promise<FirebaseProvider[]> {
    if (!db) {
      console.warn('Firebase nao inicializado')
      return []
    }

    try {
      const snapshot = await getDocs(collection(db, this.collectionName))
      const mapped = snapshot.docs.map((currentDoc) =>
        normalizeProvider(currentDoc.data() as Record<string, unknown>, currentDoc.id)
      )

      return this.sortByLastUpdate(mapped)
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error)
      return []
    }
  }

  static async getActiveProviders(): Promise<FirebaseProvider[]> {
    if (!db) {
      console.warn('Firebase nao inicializado')
      return []
    }

    try {
      const snapshot = await getDocs(collection(db, this.collectionName))
      const mapped = snapshot.docs.map((currentDoc) =>
        normalizeProvider(currentDoc.data() as Record<string, unknown>, currentDoc.id)
      )

      return this.sortByLastUpdate(
        mapped.filter((provider) => provider.ativo === true && isProviderActiveStatus(provider.status))
      )
    } catch (error) {
      console.error('Erro ao buscar prestadores ativos:', error)
      return []
    }
  }

  static async updateProviderLocation(providerId: string, lat: number, lng: number): Promise<void> {
    if (!db) {
      throw new Error('Firebase nao inicializado')
    }

    try {
      const providerRef = doc(db, this.collectionName, providerId)
      await updateDoc(providerRef, {
        'localizacao.lat': lat,
        'localizacao.lng': lng,
        ultimaAtualizacao: serverTimestamp(),
      })
    } catch (error) {
      console.error('Erro ao atualizar localizacao:', error)
      throw error
    }
  }

  static async updateProviderStatus(
    providerId: string,
    status: FirebaseProvider['status'],
    servicoAtual?: string
  ): Promise<void> {
    if (!db) {
      throw new Error('Firebase nao inicializado')
    }

    try {
      const providerRef = doc(db, this.collectionName, providerId)
      const updateData: Record<string, unknown> = {
        status,
        ultimaAtualizacao: serverTimestamp(),
      }

      if (servicoAtual !== undefined) {
        updateData.servicoAtual = servicoAtual
      }

      await updateDoc(providerRef, updateData)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      throw error
    }
  }

  static listenToActiveProviders(callback: (providers: FirebaseProvider[]) => void): () => void {
    if (!db) {
      console.warn('Firebase nao inicializado')
      callback([])
      return () => {}
    }

    try {
      const colRef = collection(db, this.collectionName)

      return onSnapshot(colRef, (snapshot) => {
        const mapped = snapshot.docs.map((currentDoc) =>
          normalizeProvider(currentDoc.data() as Record<string, unknown>, currentDoc.id)
        )

        callback(
          this.sortByLastUpdate(
            mapped.filter((provider) => provider.ativo === true && isProviderActiveStatus(provider.status))
          )
        )
      })
    } catch (error) {
      console.error('Erro ao escutar prestadores:', error)
      callback([])
      return () => {}
    }
  }
}
