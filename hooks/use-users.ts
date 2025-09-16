"use client"

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs, where, Timestamp, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { User } from '@/types'

interface UserStats {
  total: number
  ativos: number
  inativos: number
  bloqueados: number
  clientes: number
  prestadores: number
  admins: number
  operadores: number
  novosHoje: number
  onlineHoje: number
}

interface UserFilters {
  role?: string
  status?: string
  search?: string
  dataInicio?: Date
  dataFim?: Date
}

export function useUsers(filters?: UserFilters) {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    ativos: 0,
    inativos: 0,
    bloqueados: 0,
    clientes: 0,
    prestadores: 0,
    admins: 0,
    operadores: 0,
    novosHoje: 0,
    onlineHoje: 0
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    if (!db) {
      setError('Firebase não inicializado')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Construir query base
      let q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))

      // Aplicar filtros se fornecidos
      if (filters?.role) {
        q = query(q, where('role', '==', filters.role))
      }
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status))
      }
      if (filters?.dataInicio) {
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(filters.dataInicio)))
      }
      if (filters?.dataFim) {
        q = query(q, where('createdAt', '<=', Timestamp.fromDate(filters.dataFim)))
      }

      const snapshot = await getDocs(q)
      let usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate() || null,
      })) as User[]

      // Aplicar filtro de busca se fornecido
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase()
        usersData = usersData.filter(user => 
          user.nome.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.telefone?.toLowerCase().includes(searchTerm) ||
          user.cpf?.toLowerCase().includes(searchTerm)
        )
      }

      setUsers(usersData)
      calculateStats(usersData)

    } catch (err) {
      console.error('Erro ao buscar usuários:', err)
      setError('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (usersData: User[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

    const newStats: UserStats = {
      total: usersData.length,
      ativos: 0,
      inativos: 0,
      bloqueados: 0,
      clientes: 0,
      prestadores: 0,
      admins: 0,
      operadores: 0,
      novosHoje: 0,
      onlineHoje: 0
    }

    usersData.forEach(user => {
      // Status
      switch (user.status) {
        case 'ativo':
          newStats.ativos++
          break
        case 'inativo':
          newStats.inativos++
          break
        case 'bloqueado':
          newStats.bloqueados++
          break
      }

      // Roles
      switch (user.role) {
        case 'cliente':
          newStats.clientes++
          break
        case 'prestador':
          newStats.prestadores++
          break
        case 'admin':
          newStats.admins++
          break
        case 'operador':
          newStats.operadores++
          break
      }

      // Novos hoje
      if (user.createdAt >= today) {
        newStats.novosHoje++
      }

      // Online hoje (último login hoje)
      if (user.lastLogin && user.lastLogin >= today) {
        newStats.onlineHoje++
      }
    })

    setStats(newStats)
  }

  const subscribeToUsers = () => {
    if (!db) return

    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
    
    return onSnapshot(q, 
      (snapshot) => {
        let usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          lastLogin: doc.data().lastLogin?.toDate() || null,
        })) as User[]

        // Aplicar filtros se fornecidos
        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase()
          usersData = usersData.filter(user => 
            user.nome.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.telefone?.toLowerCase().includes(searchTerm) ||
            user.cpf?.toLowerCase().includes(searchTerm)
          )
        }

        setUsers(usersData)
        calculateStats(usersData)
        setLoading(false)
      },
      (error) => {
        console.error('Erro ao escutar usuários:', error)
        setError('Erro ao carregar usuários em tempo real')
        setLoading(false)
      }
    )
  }

  useEffect(() => {
    const unsubscribe = subscribeToUsers()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [filters])

  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    if (!db) return

    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
        lastLogin: null
      })
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      throw error
    }
  }

  const updateUser = async (userId: string, userData: Partial<User>) => {
    if (!db) return

    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw error
    }
  }

  const deleteUser = async (userId: string) => {
    if (!db) return

    try {
      await deleteDoc(doc(db, 'users', userId))
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      throw error
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    if (!db) return

    try {
      const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo'
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error)
      throw error
    }
  }

  const blockUser = async (userId: string) => {
    if (!db) return

    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        status: 'bloqueado',
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao bloquear usuário:', error)
      throw error
    }
  }

  const unblockUser = async (userId: string) => {
    if (!db) return

    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        status: 'ativo',
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao desbloquear usuário:', error)
      throw error
    }
  }

  return {
    users,
    stats,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    blockUser,
    unblockUser
  }
}
