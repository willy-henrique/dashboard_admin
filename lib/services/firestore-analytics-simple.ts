import { getCollection } from '../firestore'

export interface OrderData {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  address: string
  complement: string
  description: string
  isEmergency: boolean
  status: string
  createdAt: any
  cancelledAt?: any
  cancelledBy?: string
  cancellationReason?: string
  distributionStartedAt?: any
}

export interface UserData {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: any
  lastLoginAt?: any
}

export interface ProviderVerificationData {
  id: string
  providerId: string
  status: 'pending' | 'approved' | 'rejected'
  documents: string[]
  verifiedAt?: any
  createdAt: any
}

export class FirestoreAnalyticsService {
  // Métricas de Pedidos (simplificadas)
  static async getOrdersMetrics() {
    try {
      const orders = await getCollection('orders')
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      const totalOrders = orders.length
      const activeOrders = orders.filter(order => 
        !order.cancelledAt && 
        order.status !== 'completed' && 
        order.status !== 'cancelled'
      ).length

      const ordersLast30Days = orders.filter(order => 
        order.createdAt?.toDate() >= thirtyDaysAgo
      ).length

      const ordersLast7Days = orders.filter(order => 
        order.createdAt?.toDate() >= sevenDaysAgo
      ).length

      const ordersToday = orders.filter(order => 
        order.createdAt?.toDate() >= today
      ).length

      const cancelledOrders = orders.filter(order => 
        order.cancelledAt || order.status === 'cancelled'
      ).length

      const completedOrders = orders.filter(order => 
        order.status === 'completed'
      ).length

      const emergencyOrders = orders.filter(order => 
        order.isEmergency
      ).length

      return {
        totalOrders,
        activeOrders,
        ordersLast30Days,
        ordersLast7Days,
        ordersToday,
        cancelledOrders,
        completedOrders,
        emergencyOrders
      }
    } catch (error) {
      console.error('Erro ao buscar métricas de pedidos:', error)
      return {
        totalOrders: 0,
        activeOrders: 0,
        ordersLast30Days: 0,
        ordersLast7Days: 0,
        ordersToday: 0,
        cancelledOrders: 0,
        completedOrders: 0,
        emergencyOrders: 0
      }
    }
  }

  // Métricas de Usuários (simplificadas)
  static async getUsersMetrics() {
    try {
      const users = await getCollection('users')
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const totalUsers = users.length
      const activeUsers = users.filter(user => user.isActive).length
      const newUsersLast30Days = users.filter(user => 
        user.createdAt?.toDate() >= thirtyDaysAgo
      ).length
      const newUsersLast7Days = users.filter(user => 
        user.createdAt?.toDate() >= sevenDaysAgo
      ).length
      const usersWithRecentLogin = users.filter(user => 
        user.lastLoginAt?.toDate() >= thirtyDaysAgo
      ).length

      return {
        totalUsers,
        activeUsers,
        newUsersLast30Days,
        newUsersLast7Days,
        usersWithRecentLogin
      }
    } catch (error) {
      console.error('Erro ao buscar métricas de usuários:', error)
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsersLast30Days: 0,
        newUsersLast7Days: 0,
        usersWithRecentLogin: 0
      }
    }
  }

  // Métricas de Prestadores (simplificadas)
  static async getProvidersMetrics() {
    try {
      const verifications = await getCollection('provider_verifications')
      
      const totalVerifications = verifications.length
      const pendingVerifications = verifications.filter(v => v.status === 'pending').length
      const approvedVerifications = verifications.filter(v => v.status === 'approved').length
      const rejectedVerifications = verifications.filter(v => v.status === 'rejected').length
      
      const approvalRate = totalVerifications > 0 ? (approvedVerifications / totalVerifications) * 100 : 0

      return {
        totalVerifications,
        pendingVerifications,
        approvedVerifications,
        rejectedVerifications,
        approvalRate
      }
    } catch (error) {
      console.error('Erro ao buscar métricas de prestadores:', error)
      return {
        totalVerifications: 0,
        pendingVerifications: 0,
        approvedVerifications: 0,
        rejectedVerifications: 0,
        approvalRate: 0
      }
    }
  }

  // Métricas do Dashboard (consolidadas)
  static async getDashboardMetrics() {
    try {
      const [orders, users, providers] = await Promise.all([
        this.getOrdersMetrics(),
        this.getUsersMetrics(),
        this.getProvidersMetrics()
      ])

      return {
        orders,
        users,
        providers
      }
    } catch (error) {
      console.error('Erro ao buscar métricas do dashboard:', error)
      return {
        orders: {
          totalOrders: 0,
          activeOrders: 0,
          ordersLast30Days: 0,
          ordersLast7Days: 0,
          ordersToday: 0,
          cancelledOrders: 0,
          completedOrders: 0,
          emergencyOrders: 0
        },
        users: {
          totalUsers: 0,
          activeUsers: 0,
          newUsersLast30Days: 0,
          newUsersLast7Days: 0,
          usersWithRecentLogin: 0
        },
        providers: {
          totalVerifications: 0,
          pendingVerifications: 0,
          approvedVerifications: 0,
          rejectedVerifications: 0,
          approvalRate: 0
        }
      }
    }
  }
}
