"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UsersTable } from "@/components/users/users-table"
import { UserModal } from "@/components/users/user-modal"
import { useUsers } from "@/hooks/use-users"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  UserCheck, 
  UserX, 
  Search, 
  Filter, 
  Download, 
  Plus,
  RefreshCw,
  Users as UsersIcon,
  TrendingUp,
  Clock
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ClientsPage() {
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  const filters = {
    role: 'cliente',
    searchTerm: search || undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active"
  }

  const { 
    users, 
    loading, 
    refetch, 
    createUser, 
    updateUser, 
    deleteUser, 
    toggleUserStatus, 
    blockUser, 
    unblockUser 
  } = useUsers(filters)

  const selectedUser = useMemo(() => users.find(u => u.id === selectedUserId) || null, [users, selectedUserId])

  const activeUsers = users.filter(u => u.isActive !== false).length
  const blockedUsers = users.filter(u => u.isActive === false).length
  const recentUsers = users.filter(u => {
    if (!u.createdAt) return false
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    return u.createdAt.toDate() >= thirtyDaysAgo
  }).length

  const handleCreateUser = async (data: any) => {
    try {
      await createUser({ 
        ...data, 
        role: 'cliente', 
        isActive: true,
        name: data.nome || data.name || '',
        email: data.email || ''
      })
      toast({
        title: "Sucesso!",
        description: "Cliente criado com sucesso.",
      })
      setModalOpen(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar cliente. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = async (data: any) => {
    if (!selectedUser) return
    try {
      await updateUser(selectedUser.id, data)
      toast({
        title: "Sucesso!",
        description: "Cliente atualizado com sucesso.",
      })
      setModalOpen(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar cliente. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId)
      toast({
        title: "Sucesso!",
        description: "Cliente excluído com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir cliente. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await toggleUserStatus(userId, isActive)
      toast({
        title: "Sucesso!",
        description: `Cliente ${isActive ? 'ativado' : 'desativado'} com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar status do cliente. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3" style={{ color: 'var(--foreground)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'var(--primary)' }}>
                <UsersIcon className="h-6 w-6" style={{ color: 'var(--primary-foreground)' }} />
              </div>
              Gestão de Clientes
            </h1>
            <p className="mt-2 text-lg" style={{ color: 'var(--muted-foreground)' }}>
              Gerencie todos os clientes do aplicativo
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button 
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button 
              onClick={() => { setSelectedUserId(null); setModalOpen(true) }}
              style={{ 
                background: 'var(--primary)', 
                color: 'var(--primary-foreground)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              }}
              className="hover:opacity-90 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--card)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Total de Clientes</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{users.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'var(--chart-1)' }}>
                  <User className="h-6 w-6" style={{ color: 'var(--primary-foreground)' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--card)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Clientes Ativos</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--chart-2)' }}>{activeUsers}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'var(--chart-2)' }}>
                  <UserCheck className="h-6 w-6" style={{ color: 'var(--primary-foreground)' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--card)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Bloqueados</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--destructive)' }}>{blockedUsers}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'var(--destructive)' }}>
                  <UserX className="h-6 w-6" style={{ color: 'var(--destructive-foreground)' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--card)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Novos (30 dias)</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--chart-3)' }}>{recentUsers}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'var(--chart-3)' }}>
                  <TrendingUp className="h-6 w-6" style={{ color: 'var(--primary-foreground)' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                  <Input
                    placeholder="Buscar por nome, email, CPF..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-11 text-base"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  className="h-11"
                >
                  Todos
                </Button>
                <Button
                  variant={statusFilter === "active" ? "default" : "outline"}
                  onClick={() => setStatusFilter("active")}
                  className="h-11"
                >
                  Ativos
                </Button>
                <Button
                  variant={statusFilter === "inactive" ? "default" : "outline"}
                  onClick={() => setStatusFilter("inactive")}
                  className="h-11"
                >
                  Bloqueados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <UsersTable 
          users={users}
          loading={loading}
          onView={(id) => { setSelectedUserId(id); setModalOpen(true) }}
          onEdit={(id) => { setSelectedUserId(id); setModalOpen(true) }}
          onDelete={handleDeleteUser}
          onToggleStatus={(id, isActive) => handleToggleStatus(id, isActive)}
          onBlock={(id) => blockUser(id)}
          onUnblock={(id) => unblockUser(id)}
        />

        {/* User Modal */}
        <UserModal 
          user={selectedUser}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={selectedUser ? handleUpdateUser : handleCreateUser}
          mode={selectedUser ? 'edit' : 'create'}
        />
      </div>
    </div>
  )
}
