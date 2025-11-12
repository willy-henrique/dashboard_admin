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
        
        // Debug: Log completo do documento para verificar estrutura
        console.log(`[DEBUG] Provider ${doc.id}:`, {
          email: data.email,
          phone: data.phone,
          hasServices: !!data.services,
          services: data.services,
          servicesType: typeof data.services,
          allKeys: Object.keys(data)
        })
        
        // Filtrar apenas providers ativos (ou que não tenham o campo, assumindo como ativo)
        const isActive = data.isActive !== false // Se não existir, assume true
        
        // Extrair totalEarnings do campo services.totalEarnings
        // Tentar diferentes caminhos possíveis
        const services = data.services || {}
        
        // Debug: Log do objeto services
        console.log(`[DEBUG] Provider ${doc.id} - services object:`, {
          services,
          servicesKeys: services ? Object.keys(services) : [],
          totalEarnings: services?.totalEarnings,
          totalEarningsType: typeof services?.totalEarnings,
          totalEarningsValue: services?.totalEarnings,
          // Verificar também se está no nível raiz
          directTotalEarnings: data.totalEarnings,
          directTotalJobs: data.totalJobs
        })
        
        // Garantir que lemos o valor corretamente, mesmo que seja 0 ou um valor pequeno
        let totalEarnings = 0
        let foundEarnings = false
        
        // Tentar primeiro services.totalEarnings
        if (services && typeof services === 'object' && services !== null) {
          if (services.totalEarnings !== undefined && services.totalEarnings !== null) {
            foundEarnings = true
            const value = services.totalEarnings
            totalEarnings = typeof value === 'number' 
              ? value 
              : (typeof value === 'string' ? parseFloat(value) : Number(value)) || 0
          }
        }
        
        // Se não encontrou em services, tentar no nível raiz (fallback)
        if (!foundEarnings && data.totalEarnings !== undefined && data.totalEarnings !== null) {
          foundEarnings = true
          const value = data.totalEarnings
          totalEarnings = typeof value === 'number' 
            ? value 
            : (typeof value === 'string' ? parseFloat(value) : Number(value)) || 0
          console.log(`[DEBUG] Provider ${doc.id} - Usando totalEarnings do nível raiz:`, totalEarnings)
        }
        
        let totalJobs = 0
        if (services && typeof services === 'object' && services !== null) {
          if (services.totalJobs !== undefined && services.totalJobs !== null) {
            const value = services.totalJobs
            totalJobs = typeof value === 'number' 
              ? value 
              : (typeof value === 'string' ? parseInt(value) : Number(value)) || 0
          }
        }
        
        // Se não encontrou, tentar no nível raiz (fallback)
        if (totalJobs === 0 && data.totalJobs !== undefined && data.totalJobs !== null) {
          const value = data.totalJobs
          totalJobs = typeof value === 'number' 
            ? value 
            : (typeof value === 'string' ? parseInt(value) : Number(value)) || 0
        }

        // Debug: log final do valor extraído
        console.log(`[DEBUG] Provider ${doc.id} - Valores extraídos:`, {
          totalEarnings,
          totalJobs,
          email: data.email
        })

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

