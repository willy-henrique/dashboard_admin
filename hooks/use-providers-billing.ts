import { useCallback, useEffect, useState } from 'react'

export interface ProviderBilling {
  id: string
  uid: string
  nome?: string
  phone?: string
  email?: string
  pixKey?: string
  pixKeyType?: string
  totalEarnings: number
  totalEarningsCents?: number
  totalJobs?: number
  eligibleOrdersCount?: number
  pendingOrdersCount?: number
  isActive?: boolean
  isVerified?: boolean
  verificationStatus?: string
  updatedAt?: string
}

export interface UseProvidersBillingReturn {
  providers: ProviderBilling[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  totalEarnings: number
}

interface ProvidersApiResponse {
  success: boolean
  error?: string
  providers?: ProviderBilling[]
}

export function useProvidersBilling(options?: {
  autoRefresh?: boolean
  refreshInterval?: number
}): UseProvidersBillingReturn {
  const [providers, setProviders] = useState<ProviderBilling[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/financial/providers', {
        method: 'GET',
        cache: 'no-store',
      })

      const data = (await response.json()) as ProvidersApiResponse
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao carregar dados de pagamentos')
      }

      const providersList = Array.isArray(data.providers) ? data.providers : []
      setProviders(providersList)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar prestadores'
      setError(errorMessage)
      console.error('Erro ao buscar prestadores:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchProviders()

    if (options?.autoRefresh && options?.refreshInterval) {
      const interval = setInterval(() => {
        void fetchProviders()
      }, options.refreshInterval)
      return () => clearInterval(interval)
    }

    return undefined
  }, [fetchProviders, options?.autoRefresh, options?.refreshInterval])

  const totalEarnings = providers.reduce((sum, provider) => sum + provider.totalEarnings, 0)

  return {
    providers,
    loading,
    error,
    refetch: fetchProviders,
    totalEarnings,
  }
}

