import { getCollection, getDocument, updateDocument, addDocument, deleteDocument } from '../firestore'
import { where, orderBy, limit, Timestamp } from 'firebase/firestore'
import type { UserData } from './firestore-analytics'

export interface UserFilters {
  role?: string
  isActive?: boolean
  searchTerm?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  byRole: Record<string, number>
  newUsersLast30Days: number
  newUsersLast7Days: number
  usersWithRecentLogin: number
}

export class UsersService {
  // Buscar todos os usuários com filtros opcionais
  static async getUsers(filters?: UserFilters, limitCount?: number) {
    try {
      let users = await getCollection('users')
      
      // Aplicar filtros
      if (filters) {
        if (filters.role) {
          users = users.filter(user => user.role === filters.role)
        }
        
        if (filters.isActive !== undefined) {
          users = users.filter(user => user.isActive === filters.isActive)
        }
        
        if (filters.dateFrom) {
          users = users.filter(user => 
            user.createdAt?.toDate() >= filters.dateFrom!
          )
        }
        
        if (filters.dateTo) {
          users = users.filter(user => 
            user.createdAt?.toDate() <= filters.dateTo!
          )
        }
        
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase()
          users = users.filter(user => 
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower)
          )
        }
      }
      
      // Ordenar por data de criação (mais recentes primeiro)
      users.sort((a, b) => {
        const dateA = a.createdAt?.toDate() || new Date(0)
        const dateB = b.createdAt?.toDate() || new Date(0)
        return dateB.getTime() - dateA.getTime()
      })
      
      // Aplicar limite se especificado
      if (limitCount) {
        users = users.slice(0, limitCount)
      }
      
      return users as UserData[]
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      throw error
    }
  }

  // Buscar usuário específico
  static async getUser(userId: string) {
    try {
      const user = await getDocument('users', userId)
      return user as UserData | null
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      throw error
    }
  }

  // Atualizar usuário
  static async updateUser(userId: string, userData: Partial<UserData>) {
    try {
      await updateDocument('users', userId, userData)
      return true
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw error
    }
  }

  // Ativar/Desativar usuário
  static async toggleUserStatus(userId: string, isActive: boolean) {
    try {
      await this.updateUser(userId, { isActive })
      return true
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error)
      throw error
    }
  }

  // Atualizar último login
  static async updateLastLogin(userId: string) {
    try {
      await this.updateUser(userId, { lastLoginAt: Timestamp.now() })
      return true
    } catch (error) {
      console.error('Erro ao atualizar último login:', error)
      throw error
    }
  }

  // Estatísticas dos usuários
  static async getUserStats(filters?: UserFilters): Promise<UserStats> {
    try {
      const users = await this.getUsers(filters)
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      
      const stats: UserStats = {
        total: users.length,
        active: 0,
        inactive: 0,
        byRole: {},
        newUsersLast30Days: 0,
        newUsersLast7Days: 0,
        usersWithRecentLogin: 0
      }
      
      users.forEach(user => {
        // Contar ativos/inativos
        if (user.isActive !== false) {
          stats.active++
        } else {
          stats.inactive++
        }
        
        // Contar por role
        const role = user.role || 'unknown'
        stats.byRole[role] = (stats.byRole[role] || 0) + 1
        
        // Contar novos usuários
        if (user.createdAt?.toDate() >= thirtyDaysAgo) {
          stats.newUsersLast30Days++
        }
        
        if (user.createdAt?.toDate() >= sevenDaysAgo) {
          stats.newUsersLast7Days++
        }
        
        // Contar usuários com login recente
        if (user.lastLoginAt?.toDate() >= sevenDaysAgo) {
          stats.usersWithRecentLogin++
        }
      })
      
      return stats
    } catch (error) {
      console.error('Erro ao calcular estatísticas dos usuários:', error)
      throw error
    }
  }

  // Buscar usuários recentes
  static async getRecentUsers(limitCount: number = 10) {
    try {
      return await this.getUsers(undefined, limitCount)
    } catch (error) {
      console.error('Erro ao buscar usuários recentes:', error)
      throw error
    }
  }

  // Buscar usuários ativos
  static async getActiveUsers() {
    try {
      return await this.getUsers({ isActive: true })
    } catch (error) {
      console.error('Erro ao buscar usuários ativos:', error)
      throw error
    }
  }

  // Buscar usuários por role
  static async getUsersByRole(role: string) {
    try {
      return await this.getUsers({ role })
    } catch (error) {
      console.error('Erro ao buscar usuários por role:', error)
      throw error
    }
  }

  // Buscar usuários com login recente
  static async getUsersWithRecentLogin() {
    try {
      const users = await this.getUsers()
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      
      return users.filter(user => 
        user.lastLoginAt?.toDate() >= sevenDaysAgo
      )
    } catch (error) {
      console.error('Erro ao buscar usuários com login recente:', error)
      throw error
    }
  }

  // Buscar usuários inativos há muito tempo
  static async getInactiveUsers(daysThreshold: number = 30) {
    try {
      const users = await this.getUsers()
      const thresholdDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000)
      
      return users.filter(user => 
        !user.lastLoginAt || user.lastLoginAt.toDate() < thresholdDate
      )
    } catch (error) {
      console.error('Erro ao buscar usuários inativos:', error)
      throw error
    }
  }
}
