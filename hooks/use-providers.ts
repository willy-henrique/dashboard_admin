import { useState, useEffect } from 'react'

export interface Provider {
  id: string
  nome: string
  telefone: string
  email: string
  status: 'disponivel' | 'ocupado' | 'online' | 'offline'
  localizacao: {
    lat: number
    lng: number
  }
  ultimaAtualizacao: string
  servicoAtual?: string | null
  especialidades: string[]
  avaliacao: number
  totalServicos: number
}

export interface ProvidersStats {
  total: number
  disponivel: number
  ocupado: number
  online: number
  offline: number
}

export interface UseProvidersReturn {
  providers: Provider[]
  stats: ProvidersStats | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useProviders(options?: {
  status?: string
  ativo?: boolean
  lat?: number
  lng?: number
  raio?: number
  autoRefresh?: boolean
  refreshInterval?: number
}): UseProvidersReturn {
  const [providers, setProviders] = useState<Provider[]>([])
  const [stats, setStats] = useState<ProvidersStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProviders = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options?.status) params.append('status', options.status)
      if (options?.ativo !== undefined) params.append('ativo', options.ativo.toString())
      if (options?.lat) params.append('lat', options.lat.toString())
      if (options?.lng) params.append('lng', options.lng.toString())
      if (options?.raio) params.append('raio', options.raio.toString())

      const response = await fetch(`/api/providers?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setProviders(data.data)
        setStats(data.stats)
      } else {
        setError(data.error || 'Erro ao carregar prestadores')
      }
    } catch (err) {
      setError('Erro de conexão')
      console.error('Erro ao buscar prestadores:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [options?.status, options?.ativo, options?.lat, options?.lng, options?.raio])

  useEffect(() => {
    if (options?.autoRefresh && options?.refreshInterval) {
      const interval = setInterval(fetchProviders, options.refreshInterval)
      return () => clearInterval(interval)
    }
  }, [options?.autoRefresh, options?.refreshInterval])

  return {
    providers,
    stats,
    loading,
    error,
    refetch: fetchProviders
  }
}
