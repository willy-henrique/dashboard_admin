import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface ProviderBilling {
  id: string
  uid: string
  nome?: string
  phone?: string
  email?: string
  pixKey?: string
  pixKeyType?: string
  totalEarnings: number
  totalJobs?: number
  isActive?: boolean
  isVerified?: boolean
  verificationStatus?: string
  updatedAt?: any
}

export interface UseProvidersBillingReturn {
  providers: ProviderBilling[]
  loading: boolean
  error: string | null
  refetch: () => void
  totalEarnings: number
}

export function useProvidersBilling(options?: {
  autoRefresh?: boolean
  refreshInterval?: number
}): UseProvidersBillingReturn {
  const [providers, setProviders] = useState<ProviderBilling[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProviders = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!db) {
        throw new Error('Firebase não inicializado')
      }

      // Buscar todos os providers da coleção
      const providersRef = collection(db, 'providers')
      // Buscar todos os providers (filtrar isActive no código para evitar problemas de índice)
      const snapshot = await getDocs(providersRef)
      const providersList: ProviderBilling[] = []

      snapshot.forEach((doc) => {
        const data = doc.data()
        
        // Filtrar apenas providers ativos (ou que não tenham o campo, assumindo como ativo)
        const isActive = data.isActive !== false // Se não existir, assume true
        
        // Extrair totalEarnings do campo services.totalEarnings
        const services = data.services || {}
        // Garantir que lemos o valor corretamente, mesmo que seja 0 ou um valor pequeno
        let totalEarnings = 0
        if (services.totalEarnings !== undefined && services.totalEarnings !== null) {
          totalEarnings = typeof services.totalEarnings === 'number' 
            ? services.totalEarnings 
            : parseFloat(services.totalEarnings) || 0
        }
        
        let totalJobs = 0
        if (services.totalJobs !== undefined && services.totalJobs !== null) {
          totalJobs = typeof services.totalJobs === 'number' 
            ? services.totalJobs 
            : parseInt(services.totalJobs) || 0
        }

        // Debug: log para verificar valores
        if (totalEarnings > 0) {
          console.log(`Provider ${doc.id}: totalEarnings = ${totalEarnings}`, {
            raw: services.totalEarnings,
            type: typeof services.totalEarnings,
            services
          })
        }

        // Incluir apenas providers ativos
        if (isActive) {
          providersList.push({
            id: doc.id,
            uid: data.uid || doc.id,
            nome: data.nome || data.name || 'Sem nome',
            phone: data.phone || '',
            email: data.email || '',
            pixKey: data.pixKey || '',
            pixKeyType: data.pixKeyType || '',
            totalEarnings,
            totalJobs,
            isActive: true,
            isVerified: data.isVerified ?? false,
            verificationStatus: data.verificationStatus || 'pending',
            updatedAt: data.updatedAt,
          })
        }
      })

      // Ordenar por totalEarnings (maior primeiro) após buscar
      providersList.sort((a, b) => b.totalEarnings - a.totalEarnings)
      setProviders(providersList)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar prestadores'
      setError(errorMessage)
      console.error('Erro ao buscar prestadores:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()

    if (options?.autoRefresh && options?.refreshInterval) {
      const interval = setInterval(fetchProviders, options.refreshInterval)
      return () => clearInterval(interval)
    }
  }, [options?.autoRefresh, options?.refreshInterval])

  const totalEarnings = providers.reduce((sum, provider) => sum + provider.totalEarnings, 0)

  return {
    providers,
    loading,
    error,
    refetch: fetchProviders,
    totalEarnings,
  }
}

