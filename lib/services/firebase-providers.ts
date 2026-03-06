import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore'
import { db } from '../firebase'
import { isProviderActiveStatus } from '@/lib/providers/status'
import { getMockFirebaseProviders } from './firebase-dev-mock-data'
import { shouldUseFirebaseDevMocks } from './firebase-dev-fallback'

type ProviderStatus = 'disponivel' | 'ocupado' | 'online' | 'offline'

export interface FirebaseProvider {
  id: string
  nome: string
  telefone: string
  email: string
  status: ProviderStatus
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
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

function normalizeProvider(raw: Record<string, unknown>, id: string): FirebaseProvider {
  const statusRaw = stringOrEmpty(raw.status ?? raw.situacao ?? raw.state).toLowerCase()
  const status: ProviderStatus =
    statusRaw === 'disponivel' || statusRaw === 'ocupado' || statusRaw === 'online' || statusRaw === 'offline'
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

  private static getFallbackProviders(activeOnly: boolean = false): FirebaseProvider[] {
    if (!shouldUseFirebaseDevMocks()) {
      return []
    }

    const providers = getMockFirebaseProviders()
    if (!activeOnly) {
      return providers
    }

    return providers.filter((provider) => isProviderActiveStatus(provider.status))
  }

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
      return this.getFallbackProviders()
    }

    try {
      const snapshot = await getDocs(collection(db, this.collectionName))
      const mapped = snapshot.docs.map((d) => normalizeProvider(d.data() as Record<string, unknown>, d.id))
      const providers = mapped.filter((p) => p.ativo === true)
      return this.sortByLastUpdate(providers)
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error)
      return this.getFallbackProviders()
    }
  }

  static async getActiveProviders(): Promise<FirebaseProvider[]> {
    if (!db) {
      console.warn('Firebase nao inicializado')
      return this.getFallbackProviders(true)
    }

    try {
      const snapshot = await getDocs(collection(db, this.collectionName))
      const mapped = snapshot.docs.map((d) => normalizeProvider(d.data() as Record<string, unknown>, d.id))
      const providers = mapped.filter((p) => p.ativo === true && isProviderActiveStatus(p.status))
      return this.sortByLastUpdate(providers)
    } catch (error) {
      console.error('Erro ao buscar prestadores ativos:', error)
      return this.getFallbackProviders(true)
    }
  }

  static async updateProviderLocation(providerId: string, lat: number, lng: number): Promise<void> {
    if (!db) {
      console.warn('Firebase nao inicializado')
      return
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
    }
  }

  static async updateProviderStatus(providerId: string, status: FirebaseProvider['status'], servicoAtual?: string): Promise<void> {
    if (!db) {
      console.warn('Firebase nao inicializado')
      return
    }

    try {
      const providerRef = doc(db, this.collectionName, providerId)
      const updateData: any = {
        status,
        ultimaAtualizacao: serverTimestamp(),
      }

      if (servicoAtual !== undefined) {
        updateData.servicoAtual = servicoAtual
      }

      await updateDoc(providerRef, updateData)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  static listenToActiveProviders(callback: (providers: FirebaseProvider[]) => void): () => void {
    if (!db) {
      console.warn('Firebase nao inicializado')
      callback(this.getFallbackProviders(true))
      return () => {}
    }

    try {
      const colRef = collection(db, this.collectionName)

      return onSnapshot(colRef, (snapshot) => {
        const mapped = snapshot.docs.map((d) => normalizeProvider(d.data() as Record<string, unknown>, d.id))
        const providers = this.sortByLastUpdate(mapped.filter((p) => p.ativo === true && isProviderActiveStatus(p.status)))
        callback(providers)
      })
    } catch (error) {
      console.error('Erro ao escutar prestadores:', error)
      callback(this.getFallbackProviders(true))
      return () => {}
    }
  }
}
