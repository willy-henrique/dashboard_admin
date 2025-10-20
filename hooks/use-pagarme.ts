"use client"

/**
 * HOOKS CUSTOMIZADOS PARA PAGAR.ME
 * Facilita o uso da API do Pagar.me nos componentes React
 */

import { useState, useEffect, useCallback } from 'react'
import {
  PagarmeOrder,
  PagarmeCustomer,
  PagarmeCharge,
  PagarmeSubscription,
  PagarmeBalance,
  PagarmeAnalytics,
} from '@/types/pagarme'

// ==========================================
// HOOK: useP agarmeOrders
// ==========================================
export function usePagarmeOrders(options?: {
  status?: string
  customer_id?: string
  autoRefresh?: boolean
}) {
  const [orders, setOrders] = useState<PagarmeOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options?.status) params.append('status', options.status)
      if (options?.customer_id) params.append('customer_id', options.customer_id)

      const response = await fetch(`/api/pagarme/orders?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.data || [])
      } else {
        setError(data.error || 'Erro ao buscar pedidos')
      }
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
      setError('Erro ao buscar pedidos')
    } finally {
      setLoading(false)
    }
  }, [options?.status, options?.customer_id])

  useEffect(() => {
    fetchOrders()

    if (options?.autoRefresh) {
      const interval = setInterval(fetchOrders, 30000) // Atualiza a cada 30s
      return () => clearInterval(interval)
    }
  }, [fetchOrders, options?.autoRefresh])

  const createOrder = async (orderData: any) => {
    try {
      const response = await fetch('/api/pagarme/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      const data = await response.json()

      if (data.success) {
        await fetchOrders() // Recarrega a lista
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error || data.errors }
      }
    } catch (err) {
      console.error('Erro ao criar pedido:', err)
      return { success: false, error: 'Erro ao criar pedido' }
    }
  }

  const cancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/pagarme/orders/${orderId}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        await fetchOrders() // Recarrega a lista
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error || data.errors }
      }
    } catch (err) {
      console.error('Erro ao cancelar pedido:', err)
      return { success: false, error: 'Erro ao cancelar pedido' }
    }
  }

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    cancelOrder,
  }
}

// ==========================================
// HOOK: usePagarmeCustomers
// ==========================================
export function usePagarmeCustomers() {
  const [customers, setCustomers] = useState<PagarmeCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/pagarme/customers')
      const data = await response.json()

      if (data.success) {
        setCustomers(data.data || [])
      } else {
        setError(data.error || 'Erro ao buscar clientes')
      }
    } catch (err) {
      console.error('Erro ao buscar clientes:', err)
      setError('Erro ao buscar clientes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const createCustomer = async (customerData: Partial<PagarmeCustomer>) => {
    try {
      const response = await fetch('/api/pagarme/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      })
      const data = await response.json()

      if (data.success) {
        await fetchCustomers() // Recarrega a lista
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error || data.errors }
      }
    } catch (err) {
      console.error('Erro ao criar cliente:', err)
      return { success: false, error: 'Erro ao criar cliente' }
    }
  }

  const updateCustomer = async (customerId: string, customerData: Partial<PagarmeCustomer>) => {
    try {
      const response = await fetch(`/api/pagarme/customers/${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      })
      const data = await response.json()

      if (data.success) {
        await fetchCustomers() // Recarrega a lista
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error || data.errors }
      }
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err)
      return { success: false, error: 'Erro ao atualizar cliente' }
    }
  }

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    createCustomer,
    updateCustomer,
  }
}

// ==========================================
// HOOK: usePagarmeCharges
// ==========================================
export function usePagarmeCharges(options?: {
  status?: string
  customer_id?: string
  autoRefresh?: boolean
}) {
  const [charges, setCharges] = useState<PagarmeCharge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCharges = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options?.status) params.append('status', options.status)
      if (options?.customer_id) params.append('customer_id', options.customer_id)

      const response = await fetch(`/api/pagarme/charges?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setCharges(data.data || [])
      } else {
        setError(data.error || 'Erro ao buscar cobranças')
      }
    } catch (err) {
      console.error('Erro ao buscar cobranças:', err)
      setError('Erro ao buscar cobranças')
    } finally {
      setLoading(false)
    }
  }, [options?.status, options?.customer_id])

  useEffect(() => {
    fetchCharges()

    if (options?.autoRefresh) {
      const interval = setInterval(fetchCharges, 30000) // Atualiza a cada 30s
      return () => clearInterval(interval)
    }
  }, [fetchCharges, options?.autoRefresh])

  const refundCharge = async (chargeId: string, amount?: number) => {
    try {
      const response = await fetch(`/api/pagarme/charges/${chargeId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })
      const data = await response.json()

      if (data.success) {
        await fetchCharges() // Recarrega a lista
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error || data.errors }
      }
    } catch (err) {
      console.error('Erro ao reembolsar cobrança:', err)
      return { success: false, error: 'Erro ao reembolsar cobrança' }
    }
  }

  const cancelCharge = async (chargeId: string) => {
    try {
      const response = await fetch(`/api/pagarme/charges/${chargeId}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        await fetchCharges() // Recarrega a lista
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error || data.errors }
      }
    } catch (err) {
      console.error('Erro ao cancelar cobrança:', err)
      return { success: false, error: 'Erro ao cancelar cobrança' }
    }
  }

  return {
    charges,
    loading,
    error,
    refetch: fetchCharges,
    refundCharge,
    cancelCharge,
  }
}

// ==========================================
// HOOK: usePagarmeSubscriptions
// ==========================================
export function usePagarmeSubscriptions(options?: {
  status?: string
  customer_id?: string
  autoRefresh?: boolean
}) {
  const [subscriptions, setSubscriptions] = useState<PagarmeSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options?.status) params.append('status', options.status)
      if (options?.customer_id) params.append('customer_id', options.customer_id)

      const response = await fetch(`/api/pagarme/subscriptions?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setSubscriptions(data.data || [])
      } else {
        setError(data.error || 'Erro ao buscar assinaturas')
      }
    } catch (err) {
      console.error('Erro ao buscar assinaturas:', err)
      setError('Erro ao buscar assinaturas')
    } finally {
      setLoading(false)
    }
  }, [options?.status, options?.customer_id])

  useEffect(() => {
    fetchSubscriptions()

    if (options?.autoRefresh) {
      const interval = setInterval(fetchSubscriptions, 60000) // Atualiza a cada 60s
      return () => clearInterval(interval)
    }
  }, [fetchSubscriptions, options?.autoRefresh])

  const createSubscription = async (subscriptionData: any) => {
    try {
      const response = await fetch('/api/pagarme/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriptionData),
      })
      const data = await response.json()

      if (data.success) {
        await fetchSubscriptions() // Recarrega a lista
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error || data.errors }
      }
    } catch (err) {
      console.error('Erro ao criar assinatura:', err)
      return { success: false, error: 'Erro ao criar assinatura' }
    }
  }

  const cancelSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch(`/api/pagarme/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        await fetchSubscriptions() // Recarrega a lista
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error || data.errors }
      }
    } catch (err) {
      console.error('Erro ao cancelar assinatura:', err)
      return { success: false, error: 'Erro ao cancelar assinatura' }
    }
  }

  return {
    subscriptions,
    loading,
    error,
    refetch: fetchSubscriptions,
    createSubscription,
    cancelSubscription,
  }
}

// ==========================================
// HOOK: usePagarmeBalance
// ==========================================
export function usePagarmeBalance(autoRefresh?: boolean) {
  const [balance, setBalance] = useState<PagarmeBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/pagarme/balance')
      const data = await response.json()

      if (data.success) {
        setBalance(data.data)
      } else {
        setError(data.error || 'Erro ao buscar saldo')
      }
    } catch (err) {
      console.error('Erro ao buscar saldo:', err)
      setError('Erro ao buscar saldo')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBalance()

    if (autoRefresh) {
      const interval = setInterval(fetchBalance, 60000) // Atualiza a cada 60s
      return () => clearInterval(interval)
    }
  }, [fetchBalance, autoRefresh])

  return {
    balance,
    loading,
    error,
    refetch: fetchBalance,
  }
}

// ==========================================
// HOOK: usePagarmeAnalytics
// ==========================================
export function usePagarmeAnalytics(startDate: string, endDate: string) {
  const [analytics, setAnalytics] = useState<PagarmeAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      })

      const response = await fetch(`/api/pagarme/analytics?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setAnalytics(data.data)
      } else {
        setError(data.error || 'Erro ao buscar analytics')
      }
    } catch (err) {
      console.error('Erro ao buscar analytics:', err)
      setError('Erro ao buscar analytics')
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    if (startDate && endDate) {
      fetchAnalytics()
    }
  }, [fetchAnalytics, startDate, endDate])

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  }
}

