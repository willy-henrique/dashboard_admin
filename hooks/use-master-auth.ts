"use client"

import React, { useState, useEffect, createContext, useContext } from "react"
import { getDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { AdminMasterService } from "@/lib/services/admin-master-service"

export interface MasterUser {
  id: string
  email: string
  nome: string
  permissoes: {
    dashboard: boolean
    controle: boolean
    gestaoUsuarios: boolean
    gestaoPedidos: boolean
    financeiro: boolean
    relatorios: boolean
    configuracoes: boolean
  }
}

export interface AdminMaster {
  id: string
  email: string
  senhaHash: string
  nome: string
  permissoes: {
    dashboard: boolean
    controle: boolean
    gestaoUsuarios: boolean
    gestaoPedidos: boolean
    financeiro: boolean
    relatorios: boolean
    configuracoes: boolean
  }
}

interface MasterAuthContextType {
  isMasterAuthenticated: boolean
  masterUser: MasterUser | null
  masterLogin: (email: string, password: string) => Promise<void>
  masterLogout: () => void
  usuarios: MasterUser[]
  loading: boolean
  addUsuario: (usuario: Omit<MasterUser, 'id'>) => Promise<void>
  updateUsuario: (id: string, permissoes: MasterUser['permissoes']) => Promise<void>
  deleteUsuario: (id: string) => Promise<void>
  refreshUsuarios: () => Promise<void>
}

const MasterAuthContext = createContext<MasterAuthContextType>({
  isMasterAuthenticated: false,
  masterUser: null,
  masterLogin: async () => {},
  masterLogout: () => {},
  usuarios: [],
  loading: true,
  addUsuario: async () => {},
  updateUsuario: async () => {},
  deleteUsuario: async () => {},
  refreshUsuarios: () => {},
})

export function MasterAuthProvider({ children }: { children: React.ReactNode }) {
  const [isMasterAuthenticated, setIsMasterAuthenticated] = useState(false)
  const [masterUser, setMasterUser] = useState<MasterUser | null>(null)
  const [usuarios, setUsuarios] = useState<MasterUser[]>([])
  const [loading, setLoading] = useState(true)


  // Verificar se existe AdminMaster na inicialização
  useEffect(() => {
    const checkMasterAuth = async () => {
      try {
        setLoading(true)
        const masterAuthData = localStorage.getItem('masterAuth')
        if (masterAuthData) {
          const { userId } = JSON.parse(masterAuthData)
          const userDoc = await getDoc(doc(db, 'adminmaster', 'master'))
          if (userDoc.exists()) {
            const userData = userDoc.data() as AdminMaster
            setMasterUser({
              id: userDoc.id,
              email: userData.email,
              nome: userData.nome,
              permissoes: userData.permissoes
            })
            setIsMasterAuthenticated(true)
            await loadUsuarios(userDoc.id)
          } else {
            // Limpar dados inválidos
            localStorage.removeItem('masterAuth')
            setMasterUser(null)
            setIsMasterAuthenticated(false)
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação master:', error)
        // Em caso de erro, limpar dados
        localStorage.removeItem('masterAuth')
        setMasterUser(null)
        setIsMasterAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkMasterAuth()
  }, [])

  const masterLogin = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const adminMaster = await AdminMasterService.authenticateMaster(email, password)
      
      if (!adminMaster) {
        throw new Error('Credenciais inválidas')
      }

      // Criar usuário master
      const user: MasterUser = {
        id: adminMaster.id,
        email: adminMaster.email,
        nome: adminMaster.nome,
        permissoes: adminMaster.permissoes
      }

      setMasterUser(user)
      setIsMasterAuthenticated(true)
      
      // Salvar no localStorage
      localStorage.setItem('masterAuth', JSON.stringify({ userId: adminMaster.id }))
      
      // Carregar usuários
      await loadUsuarios(adminMaster.id)
    } catch (error) {
      console.error('Erro no login master:', error)
      setMasterUser(null)
      setIsMasterAuthenticated(false)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const masterLogout = () => {
    setMasterUser(null)
    setIsMasterAuthenticated(false)
    setUsuarios([])
    localStorage.removeItem('masterAuth')
  }

  const loadUsuarios = async (adminId: string) => {
    try {
      const usuariosList = await AdminMasterService.getUsuarios(adminId)
      setUsuarios(usuariosList)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
  }

  const addUsuario = async (usuario: Omit<MasterUser, 'id'>) => {
    try {
      if (!masterUser) throw new Error('Não autenticado como master')
      
      await AdminMasterService.addUsuario(masterUser.id, usuario)
      await refreshUsuarios()
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error)
      throw error
    }
  }

  const updateUsuario = async (id: string, permissoes: MasterUser['permissoes']) => {
    try {
      if (!masterUser) throw new Error('Não autenticado como master')
      
      await AdminMasterService.updateUsuario(masterUser.id, id, { permissoes })
      await refreshUsuarios()
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw error
    }
  }

  const deleteUsuario = async (id: string) => {
    try {
      if (!masterUser) throw new Error('Não autenticado como master')
      
      await AdminMasterService.deleteUsuario(masterUser.id, id)
      await refreshUsuarios()
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      throw error
    }
  }

  const refreshUsuarios = async () => {
    if (masterUser) {
      await loadUsuarios(masterUser.id)
    }
  }

  const contextValue = {
    isMasterAuthenticated,
    masterUser,
    masterLogin,
    masterLogout,
    usuarios,
    loading,
    addUsuario,
    updateUsuario,
    deleteUsuario,
    refreshUsuarios
  }

  return React.createElement(
    MasterAuthContext.Provider,
    { value: contextValue },
    children
  )
}

export const useMasterAuth = () => useContext(MasterAuthContext)
