"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useMasterAuth } from "@/hooks/use-master-auth"
import { Logo } from "@/components/logo"
import {
  Users,
  Plus,
  Save,
  Edit,
  Trash2,
  Shield,
  LogOut,
  User,
  Mail,
  Settings,
  LayoutDashboard,
  MousePointer,
  ShoppingCart,
  DollarSign,
  BarChart3,
  CheckCircle,
  X,
} from "lucide-react"

export function MasterDashboard() {
  const { 
    masterUser, 
    masterLogout, 
    usuarios, 
    addUsuario, 
    updateUsuario, 
    deleteUsuario,
    loading 
  } = useMasterAuth()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({
    nome: "",
    email: "",
    permissoes: {
      dashboard: false,
      controle: false,
      gestaoUsuarios: false,
      gestaoPedidos: false,
      financeiro: false,
      relatorios: false,
      configuracoes: false
    }
  })
  const [tempPermissions, setTempPermissions] = useState<Record<string, any>>({})

  const handleAddUser = async () => {
    try {
      await addUsuario(newUser)
      setNewUser({
        nome: "",
        email: "",
        permissoes: {
          dashboard: false,
          controle: false,
          gestaoUsuarios: false,
          gestaoPedidos: false,
          financeiro: false,
          relatorios: false,
          configuracoes: false
        }
      })
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error)
    }
  }

  const handleUpdateUser = async (userId: string) => {
    try {
      await updateUsuario(userId, tempPermissions[userId])
      setEditingUser(null)
      setTempPermissions({})
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      try {
        await deleteUsuario(userId)
      } catch (error) {
        console.error('Erro ao deletar usuário:', error)
      }
    }
  }

  const startEditing = (user: any) => {
    setEditingUser(user.id)
    setTempPermissions({
      [user.id]: { ...user.permissoes }
    })
  }

  const updatePermission = (userId: string, permission: string, value: boolean) => {
    setTempPermissions(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [permission]: value
      }
    }))
  }

  const permissionLabels = {
    dashboard: "Dashboard",
    controle: "Controle",
    gestaoUsuarios: "Gestão de Usuários",
    gestaoPedidos: "Gestão de Pedidos",
    financeiro: "Financeiro",
    relatorios: "Relatórios",
    configuracoes: "Configurações"
  }

  const permissionIcons = {
    dashboard: LayoutDashboard,
    controle: MousePointer,
    gestaoUsuarios: Users,
    gestaoPedidos: ShoppingCart,
    financeiro: DollarSign,
    relatorios: BarChart3,
    configuracoes: Settings
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/95 dark:bg-slate-900 shadow-sm border-b border-orange-200 dark:border-slate-700 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Logo className="h-8" showText={true} />
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-orange-600" />
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  Área Master
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {masterUser?.nome}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {masterUser?.email}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={masterLogout}
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-300 dark:border-slate-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Gestão de Usuários e Permissões
          </h1>
          <p className="text-slate-700 dark:text-slate-300">
            Configure as permissões de acesso para cada usuário do sistema
          </p>
        </div>

        {/* Add User Button */}
        <div className="mb-6">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-800 shadow-xl backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="text-slate-900 dark:text-white">Adicionar Novo Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome" className="text-slate-700 dark:text-slate-300">Nome</Label>
                  <Input
                    id="nome"
                    value={newUser.nome}
                    onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                    placeholder="Nome completo"
                    className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Permissões Iniciais</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(permissionLabels).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <Checkbox
                          id={`new-${key}`}
                          checked={newUser.permissoes[key as keyof typeof newUser.permissoes]}
                          onCheckedChange={(checked) => 
                            setNewUser({
                              ...newUser,
                              permissoes: {
                                ...newUser.permissoes,
                                [key]: checked
                              }
                            })
                          }
                          className="border-slate-300 dark:border-slate-600"
                        />
                        <Label htmlFor={`new-${key}`} className="text-sm text-slate-700 dark:text-slate-300">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddUser} className="bg-orange-600 hover:bg-orange-700">
                    Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Users List */}
        <div className="grid gap-6">
          {usuarios.map((user) => (
            <Card key={user.id} className="shadow-lg bg-white/95 dark:bg-slate-800 border-slate-200 dark:border-slate-700 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-orange-50 dark:bg-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-900 dark:text-white">{user.nome}</CardTitle>
                      <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-300">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {editingUser === user.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateUser(user.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingUser(null)
                            setTempPermissions({})
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(user)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="bg-white/90 dark:bg-slate-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(permissionLabels).map(([key, label]) => {
                    const Icon = permissionIcons[key as keyof typeof permissionIcons]
                    const isChecked = editingUser === user.id 
                      ? tempPermissions[user.id]?.[key] ?? user.permissoes[key as keyof typeof user.permissoes]
                      : user.permissoes[key as keyof typeof user.permissoes]
                    
                    return (
                      <div key={key} className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <Checkbox
                          id={`${user.id}-${key}`}
                          checked={isChecked}
                          onCheckedChange={editingUser === user.id ? 
                            (checked) => updatePermission(user.id, key, checked as boolean) :
                            undefined
                          }
                          disabled={editingUser !== user.id}
                          className="border-slate-300 dark:border-slate-600"
                        />
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                          <Label 
                            htmlFor={`${user.id}-${key}`} 
                            className="text-sm cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            {label}
                          </Label>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {usuarios.length === 0 && (
          <Card className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white/95 dark:bg-slate-800 shadow-lg backdrop-blur-sm">
            <CardContent>
              <Users className="h-16 w-16 text-slate-500 dark:text-slate-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Nenhum usuário cadastrado
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
                Comece adicionando usuários para gerenciar suas permissões e controlar o acesso ao sistema
              </p>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Primeiro Usuário
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
