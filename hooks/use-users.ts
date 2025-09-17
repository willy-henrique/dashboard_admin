"use client"

import { useState, useEffect } from 'react'
import { UsersService, type UserFilters, type UserStats } from '@/lib/services/users-service'
import type { UserData } from '@/lib/services/firestore-analytics'

export function useUsers(filters?: UserFilters) {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await UsersService.getUsers(filters)
      setUsers(data)
    } catch (err) {
      console.error('Erro ao buscar usuários:', err)
      setError('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [JSON.stringify(filters)])

  return {
    users,
    loading,
    error,
    refetch: fetchUsers
  }
}

export function useUserStats(filters?: UserFilters) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await UsersService.getUserStats(filters)
      setStats(data)
    } catch (err) {
      console.error('Erro ao buscar estatísticas dos usuários:', err)
      setError('Erro ao carregar estatísticas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [JSON.stringify(filters)])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

export function useRecentUsers(limitCount: number = 10) {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecentUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await UsersService.getRecentUsers(limitCount)
      setUsers(data)
    } catch (err) {
      console.error('Erro ao buscar usuários recentes:', err)
      setError('Erro ao carregar usuários recentes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecentUsers()
  }, [limitCount])

  return {
    users,
    loading,
    error,
    refetch: fetchRecentUsers
  }
}

export function useActiveUsers() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActiveUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await UsersService.getActiveUsers()
      setUsers(data)
    } catch (err) {
      console.error('Erro ao buscar usuários ativos:', err)
      setError('Erro ao carregar usuários ativos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActiveUsers()
  }, [])

  return {
    users,
    loading,
    error,
    refetch: fetchActiveUsers
  }
}

export function useUsersWithRecentLogin() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsersWithRecentLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await UsersService.getUsersWithRecentLogin()
      setUsers(data)
    } catch (err) {
      console.error('Erro ao buscar usuários com login recente:', err)
      setError('Erro ao carregar usuários com login recente')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsersWithRecentLogin()
  }, [])

  return {
    users,
    loading,
    error,
    refetch: fetchUsersWithRecentLogin
  }
}