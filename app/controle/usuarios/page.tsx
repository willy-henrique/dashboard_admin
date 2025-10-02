"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagementDashboard } from "@/components/users/user-management-dashboard"
import { UsersTable } from "@/components/users/users-table"
import { useUsers } from "@/hooks/use-users"
import { useAnalytics } from "@/hooks/use-analytics"
import { useEffect, useState } from "react"
import { Plus, Users, UserCheck, Shield } from "lucide-react"

export default function UsuariosPage() {
  const { users, stats, loading, error, updateUser, deleteUser, toggleUserStatus, blockUser, unblockUser } = useUsers()
  const { trackPageView, trackUserAction } = useAnalytics()
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    trackPageView('Gestão de Usuários')
  }, [trackPageView])

  const handleUpdate = (userId: string, userData: any) => {
    trackUserAction('atualizar_usuario', 'usuarios', { userId, userData })
    updateUser(userId, userData)
  }

  const handleDelete = (userId: string) => {
    trackUserAction('deletar_usuario', 'usuarios', { userId })
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      deleteUser(userId)
    }
  }

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    trackUserAction('alterar_status_usuario', 'usuarios', { userId, currentStatus })
    toggleUserStatus(userId, currentStatus)
  }

  const handleBlock = (userId: string) => {
    trackUserAction('bloquear_usuario', 'usuarios', { userId })
    if (confirm('Tem certeza que deseja bloquear este usuário?')) {
      blockUser(userId)
    }
  }

  const handleUnblock = (userId: string) => {
    trackUserAction('desbloquear_usuario', 'usuarios', { userId })
    unblockUser(userId)
  }

  const handleView = (userId: string) => {
    trackUserAction('visualizar_usuario', 'usuarios', { userId })
    // Implementar visualização detalhada
  }

  const handleEdit = (userId: string) => {
    trackUserAction('editar_usuario', 'usuarios', { userId })
    // Implementar edição
  }

  const handleNewUser = () => {
    trackUserAction('novo_usuario', 'usuarios')
    // Implementar criação de usuário
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
            <p className="text-gray-600">Gerenciamento completo de usuários do sistema</p>
          </div>
          <Button onClick={handleNewUser} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="clientes" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="prestadores" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Prestadores
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <UserManagementDashboard />
          </TabsContent>

          <TabsContent value="clientes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Clientes</CardTitle>
                <p className="text-sm text-gray-600">
                  Gerenciamento de clientes do sistema
                </p>
              </CardHeader>
            </Card>
            <UsersTable
              users={users.filter(user => user.role === 'cliente')}
              loading={loading}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              onBlock={handleBlock}
              onUnblock={handleUnblock}
              onView={handleView}
              onEdit={handleEdit}
            />
          </TabsContent>

          <TabsContent value="prestadores" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prestadores</CardTitle>
                <p className="text-sm text-gray-600">
                  Gerenciamento de prestadores de serviço
                </p>
              </CardHeader>
            </Card>
            <UsersTable
              users={users.filter(user => user.role === 'prestador')}
              loading={loading}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              onBlock={handleBlock}
              onUnblock={handleUnblock}
              onView={handleView}
              onEdit={handleEdit}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
