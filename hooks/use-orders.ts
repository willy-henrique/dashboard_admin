"use client"

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs, where, Timestamp, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface Order {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  providerId?: string
  providerName?: string
  serviceCategory: string
  description: string
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  budget: number
  location: string
  address: string
  city: string
  state: string
  coordinates?: { lat: number; lng: number }
  createdAt: Date
  assignedAt?: Date
  completedAt?: Date
  rating?: number
  notes?: string
  estimatedDuration?: number
  actualDuration?: number
  paymentStatus: "pending" | "paid" | "refunded"
  paymentMethod?: string
  updatedAt: Date
}

interface OrderStats {
  total: number
  pending: number
  assigned: number
  inProgress: number
  completed: number
  cancelled: number
  totalValue: number
  averageRating: number
  urgentCount: number
  todayOrders: number
  thisWeekOrders: number
  thisMonthOrders: number
}

interface OrderFilters {
  status?: string
  priority?: string
  serviceCategory?: string
  search?: string
  dateFrom?: Date
  dateTo?: Date
  providerId?: string
  clientId?: string
}

export function useOrders(filters?: OrderFilters) {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    totalValue: 0,
    averageRating: 0,
    urgentCount: 0,
    todayOrders: 0,
    thisWeekOrders: 0,
    thisMonthOrders: 0
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    if (!db) {
      setError('Firebase não inicializado')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Construir query base
      let q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))

      // Aplicar filtros se fornecidos
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status))
      }
      if (filters?.priority) {
        q = query(q, where('priority', '==', filters.priority))
      }
      if (filters?.serviceCategory) {
        q = query(q, where('serviceCategory', '==', filters.serviceCategory))
      }
      if (filters?.providerId) {
        q = query(q, where('providerId', '==', filters.providerId))
      }
      if (filters?.clientId) {
        q = query(q, where('clientId', '==', filters.clientId))
      }
      if (filters?.dateFrom) {
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(filters.dateFrom)))
      }
      if (filters?.dateTo) {
        q = query(q, where('createdAt', '<=', Timestamp.fromDate(filters.dateTo)))
      }

      const snapshot = await getDocs(q)
      let ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        assignedAt: doc.data().assignedAt?.toDate() || null,
        completedAt: doc.data().completedAt?.toDate() || null,
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Order[]

      // Aplicar filtro de busca se fornecido
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase()
        ordersData = ordersData.filter(order => 
          order.clientName.toLowerCase().includes(searchTerm) ||
          order.description.toLowerCase().includes(searchTerm) ||
          order.serviceCategory.toLowerCase().includes(searchTerm) ||
          order.location.toLowerCase().includes(searchTerm) ||
          order.id.toLowerCase().includes(searchTerm)
        )
      }

      setOrders(ordersData)
      calculateStats(ordersData)

    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
      setError('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (ordersData: Order[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const newStats: OrderStats = {
      total: ordersData.length,
      pending: 0,
      assigned: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      totalValue: 0,
      averageRating: 0,
      urgentCount: 0,
      todayOrders: 0,
      thisWeekOrders: 0,
      thisMonthOrders: 0
    }

    let totalRating = 0
    let ratedOrders = 0

    ordersData.forEach(order => {
      // Status
      switch (order.status) {
        case 'pending':
          newStats.pending++
          break
        case 'assigned':
          newStats.assigned++
          break
        case 'in_progress':
          newStats.inProgress++
          break
        case 'completed':
          newStats.completed++
          break
        case 'cancelled':
          newStats.cancelled++
          break
      }

      // Valores
      newStats.totalValue += order.budget

      // Prioridade urgente
      if (order.priority === 'urgent') {
        newStats.urgentCount++
      }

      // Datas
      if (order.createdAt >= today) {
        newStats.todayOrders++
      }
      if (order.createdAt >= weekAgo) {
        newStats.thisWeekOrders++
      }
      if (order.createdAt >= monthAgo) {
        newStats.thisMonthOrders++
      }

      // Rating
      if (order.rating && order.rating > 0) {
        totalRating += order.rating
        ratedOrders++
      }
    })

    newStats.averageRating = ratedOrders > 0 ? totalRating / ratedOrders : 0

    setStats(newStats)
  }

  const subscribeToOrders = () => {
    if (!db) return

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    
    return onSnapshot(q, 
      (snapshot) => {
        let ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          assignedAt: doc.data().assignedAt?.toDate() || null,
          completedAt: doc.data().completedAt?.toDate() || null,
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Order[]

        // Aplicar filtros se fornecidos
        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase()
          ordersData = ordersData.filter(order => 
            order.clientName.toLowerCase().includes(searchTerm) ||
            order.description.toLowerCase().includes(searchTerm) ||
            order.serviceCategory.toLowerCase().includes(searchTerm) ||
            order.location.toLowerCase().includes(searchTerm) ||
            order.id.toLowerCase().includes(searchTerm)
          )
        }

        setOrders(ordersData)
        calculateStats(ordersData)
        setLoading(false)
      },
      (error) => {
        console.error('Erro ao escutar pedidos:', error)
        setError('Erro ao carregar pedidos em tempo real')
        setLoading(false)
      }
    )
  }

  useEffect(() => {
    const unsubscribe = subscribeToOrders()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [filters])

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'assignedAt' | 'completedAt'>) => {
    if (!db) return

    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        assignedAt: null,
        completedAt: null
      })
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      throw error
    }
  }

  const updateOrder = async (orderId: string, orderData: Partial<Order>) => {
    if (!db) return

    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        ...orderData,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error)
      throw error
    }
  }

  const deleteOrder = async (orderId: string) => {
    if (!db) return

    try {
      await deleteDoc(doc(db, 'orders', orderId))
    } catch (error) {
      console.error('Erro ao deletar pedido:', error)
      throw error
    }
  }

  const assignProvider = async (orderId: string, providerId: string, providerName: string) => {
    if (!db) return

    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        providerId,
        providerName,
        status: 'assigned',
        assignedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao atribuir prestador:', error)
      throw error
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order['status'], notes?: string) => {
    if (!db) return

    try {
      const orderRef = doc(db, 'orders', orderId)
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      }

      if (status === 'completed') {
        updateData.completedAt = serverTimestamp()
      }

      if (notes) {
        updateData.notes = notes
      }

      await updateDoc(orderRef, updateData)
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error)
      throw error
    }
  }

  const addRating = async (orderId: string, rating: number) => {
    if (!db) return

    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        rating,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error)
      throw error
    }
  }

  return {
    orders,
    stats,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    assignProvider,
    updateOrderStatus,
    addRating
  }
}