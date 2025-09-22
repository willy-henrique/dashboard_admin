"use client"

import { useMemo, useState } from "react"
import { UsersTable } from "@/components/users/users-table"
import { UserModal } from "@/components/users/user-modal"
import { useUsers } from "@/hooks/use-users"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  User, 
  UserCheck, 
  Search, 
  Filter, 
  Download, 
  Plus,
  RefreshCw,
  Users as UsersIcon,
  TrendingUp,
  Clock,
  Star,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProvidersPage() {
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [verificationFilter, setVerificationFilter] = useState<string>("all")
  const { toast } = useToast()

  const filters = {
    role: 'prestador',
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
  const verifiedUsers = users.filter((u: any) => u.verificado).length
  const recentUsers = users.filter(u => {
    if (!u.createdAt) return false
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    return u.createdAt.toDate() >= thirtyDaysAgo
  }).length

  const handleCreateUser = async (data: any) => {
    try {
      await createUser({ 
        ...data, 
        role: 'prestador', 
        isActive: true,
        name: data.nome || data.name || '',
        email: data.email || '',
        verificado: false
      })
      toast({
        title: "Sucesso!",
        description: "Prestador criado com sucesso.",
      })
      setModalOpen(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar prestador. Tente novamente.",
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
        description: "Prestador atualizado com sucesso.",
      })
      setModalOpen(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar prestador. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId)
      toast({
        title: "Sucesso!",
        description: "Prestador excluído com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir prestador. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await toggleUserStatus(userId, isActive)
      toast({
        title: "Sucesso!",
        description: `Prestador ${isActive ? 'ativado' : 'desativado'} com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar status do prestador. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleVerifyUser = async (userId: string) => {
    try {
      await updateUser(userId, { verificado: true })
      toast({
        title: "Sucesso!",
        description: "Prestador verificado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao verificar prestador. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              Gestão de Prestadores
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
              Gerencie todos os prestadores de serviços
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button 
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => { setSelectedUserId(null); setModalOpen(true) }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Prestador
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Prestadores</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Prestadores Ativos</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{activeUsers}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verificados</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{verifiedUsers}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Novos (30 dias)</p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{recentUsers}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, email, CPF..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-11 text-base"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
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
                <Button
                  variant={verificationFilter === "verified" ? "default" : "outline"}
                  onClick={() => setVerificationFilter(verificationFilter === "verified" ? "all" : "verified")}
                  className="h-11"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verificados
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
          onVerify={handleVerifyUser}
          showVerification={true}
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
