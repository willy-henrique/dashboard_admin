"use client"

import React, { useState, useEffect, createContext, useContext } from "react"
import { useAuth } from "@/components/auth-provider"
import { AdminMasterService } from "@/lib/services/admin-master-service"

export interface UserPermissions {
  dashboard: boolean
  controle: boolean
  gestaoUsuarios: boolean
  gestaoPedidos: boolean
  financeiro: boolean
  relatorios: boolean
  configuracoes: boolean
}

interface PermissionsContextType {
  permissions: UserPermissions | null
  loading: boolean
  hasPermission: (permission: keyof UserPermissions) => boolean
  canAccess: (module: string) => boolean
}

const PermissionsContext = createContext<PermissionsContextType>({
  permissions: null,
  loading: true,
  hasPermission: () => false,
  canAccess: () => false,
})

export function PermissionsProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { user } = useAuth()
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserPermissions = async () => {
      if (!user) {
        setPermissions(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Primeiro, verificar se é AdminMaster
        const adminMaster = await AdminMasterService.getAdminMaster()
        
        if (adminMaster && adminMaster.email === user.email) {
          // É AdminMaster - tem todas as permissões
          setPermissions({
            dashboard: true,
            controle: true,
            gestaoUsuarios: true,
            gestaoPedidos: true,
            financeiro: true,
            relatorios: true,
            configuracoes: true
          })
          setLoading(false)
          return
        }

        // Buscar nas subcoleções de usuários
        const userPermissions = await AdminMasterService.getUsuarioByEmail(user.email)
        setPermissions(userPermissions?.permissoes || null)
      } catch (error) {
        console.error('Erro ao carregar permissões:', error)
        setPermissions(null)
      } finally {
        setLoading(false)
      }
    }

    loadUserPermissions()
  }, [user])

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!permissions) return false
    return permissions[permission] === true
  }

  const canAccess = (module: string): boolean => {
    if (!permissions) return false
    
    const moduleMap: Record<string, keyof UserPermissions> = {
      'dashboard': 'dashboard',
      'controle': 'controle',
      'gestao-usuarios': 'gestaoUsuarios',
      'gestao-pedidos': 'gestaoPedidos',
      'financeiro': 'financeiro',
      'relatorios': 'relatorios',
      'configuracoes': 'configuracoes'
    }

    const permission = moduleMap[module]
    return permission ? hasPermission(permission) : false
  }

  const contextValue = {
    permissions,
    loading,
    hasPermission,
    canAccess
  }

  return React.createElement(
    PermissionsContext.Provider,
    { value: contextValue },
    children
  )
}

export const usePermissions = () => useContext(PermissionsContext)
