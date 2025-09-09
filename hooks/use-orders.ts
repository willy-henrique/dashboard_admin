import { useState, useEffect } from 'react'
import { FirebaseOrdersService, FirebaseOrder } from '@/lib/services/firebase-orders'

export interface Order {
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
  dataCriacao: string
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
}

export interface OrdersStats {
  total: number
  pendente: number
  aceito: number
  em_andamento: number
  concluido: number
  cancelado: number
  valorTotal: number
}

export interface UseOrdersReturn {
  orders: Order[]
  stats: OrdersStats | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useOrders(options?: {
  status?: Order['status']
  autoRefresh?: boolean
}): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrdersStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Converter FirebaseOrder para Order
  const convertFirebaseOrder = (fbOrder: FirebaseOrder): Order => ({
    id: fbOrder.id,
    numero: fbOrder.numero,
    cliente: fbOrder.cliente,
    servico: fbOrder.servico,
    valor: fbOrder.valor,
    status: fbOrder.status,
    dataCriacao: fbOrder.dataCriacao?.toDate?.()?.toISOString() || new Date().toISOString(),
    dataAgendamento: fbOrder.dataAgendamento,
    endereco: fbOrder.endereco,
    prestador: fbOrder.prestador,
    observacoes: fbOrder.observacoes,
    avaliacao: fbOrder.avaliacao
  })

  // Calcular estatísticas
  const calculateStats = (ordersList: Order[]): OrdersStats => {
    return {
      total: ordersList.length,
      pendente: ordersList.filter(o => o.status === 'pendente').length,
      aceito: ordersList.filter(o => o.status === 'aceito').length,
      em_andamento: ordersList.filter(o => o.status === 'em_andamento').length,
      concluido: ordersList.filter(o => o.status === 'concluido').length,
      cancelado: ordersList.filter(o => o.status === 'cancelado').length,
      valorTotal: ordersList.reduce((sum, o) => sum + o.valor, 0)
    }
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      let firebaseOrders: FirebaseOrder[]
      
      if (options?.status) {
        firebaseOrders = await FirebaseOrdersService.getOrdersByStatus(options.status)
      } else {
        firebaseOrders = await FirebaseOrdersService.getOrders()
      }

      const convertedOrders = firebaseOrders.map(convertFirebaseOrder)
      setOrders(convertedOrders)
      setStats(calculateStats(convertedOrders))
    } catch (err) {
      setError('Erro ao carregar pedidos')
      console.error('Erro ao buscar pedidos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options?.autoRefresh) {
      // Usar listener em tempo real do Firebase
      const unsubscribe = FirebaseOrdersService.listenToOrders((firebaseOrders) => {
        try {
          let filteredOrders = firebaseOrders
          
          if (options?.status) {
            filteredOrders = filteredOrders.filter(o => o.status === options.status)
          }

          const convertedOrders = filteredOrders.map(convertFirebaseOrder)
          setOrders(convertedOrders)
          setStats(calculateStats(convertedOrders))
          setLoading(false)
          setError(null)
        } catch (err) {
          setError('Erro ao carregar pedidos')
          console.error('Erro ao processar pedidos:', err)
        }
      })

      return unsubscribe
    } else {
      // Buscar uma vez
      fetchOrders()
    }
  }, [options?.status, options?.autoRefresh])

  return {
    orders,
    stats,
    loading,
    error,
    refetch: fetchOrders
  }
}
