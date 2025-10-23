"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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

// Força renderização dinâmica dessa árvore
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    password: "",
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleAddUser = async () => {
    if (!newUser.nome || !newUser.email || !newUser.password) {
      setError('Por favor, preencha todos os campos obrigatórios')
      return
    }

    // Verificar se pelo menos uma permissão foi selecionada
    const hasPermissions = Object.values(newUser.permissoes).some(Boolean)
    if (!hasPermissions) {
      setError('Selecione pelo menos uma permissão para o usuário')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const resp = await fetch('/api/adminmaster/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: newUser.nome,
          email: newUser.email,
          password: newUser.password,
          permissoes: newUser.permissoes,
        })
      })

      const data = await resp.json()
      
      if (!resp.ok) {
        throw new Error(data.error || 'Falha ao criar usuário')
      }

      setSuccess('Usuário criado com sucesso!')
      // Recarregar lista de usuários imediatamente
      try {
        await fetch('/master', { cache: 'no-store' })
        // opção preferível: chamar refreshUsuarios do contexto
        if (typeof window !== 'undefined') {
          // forçar revalidação do hook de autenticação master
          const event = new CustomEvent('refresh-master-usuarios')
          window.dispatchEvent(event)
        }
      } catch (_) {}
      setNewUser({
        nome: "",
        email: "",
        password: "",
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
      
      // Fechar modal após 1 segundo
      setTimeout(() => {
        setIsAddModalOpen(false)
        setSuccess(null)
      }, 1000)

    } catch (error: any) {
      console.error('Erro ao adicionar usuário:', error)
      setError(error.message || 'Erro ao criar usuário')
    } finally {
      setIsSubmitting(false)
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

  const updateNewUserPermission = (permission: string, value: boolean) => {
    setNewUser(prev => ({
      ...prev,
      permissoes: {
        ...prev.permissoes,
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

  const permissionTemplates = {
    admin: {
      name: "Administrador Completo",
      description: "Acesso total ao sistema",
      permissions: {
        dashboard: true,
        controle: true,
        gestaoUsuarios: true,
        gestaoPedidos: true,
        financeiro: true,
        relatorios: true,
        configuracoes: true
      }
    },
    manager: {
      name: "Gerente",
      description: "Acesso a gestão e relatórios",
      permissions: {
        dashboard: true,
        controle: true,
        gestaoUsuarios: false,
        gestaoPedidos: true,
        financeiro: true,
        relatorios: true,
        configuracoes: false
      }
    },
    operator: {
      name: "Operador",
      description: "Acesso básico ao sistema",
      permissions: {
        dashboard: true,
        controle: true,
        gestaoUsuarios: false,
        gestaoPedidos: true,
        financeiro: false,
        relatorios: false,
        configuracoes: false
      }
    },
    viewer: {
      name: "Visualizador",
      description: "Apenas visualização",
      permissions: {
        dashboard: true,
        controle: false,
        gestaoUsuarios: false,
        gestaoPedidos: false,
        financeiro: false,
        relatorios: true,
        configuracoes: false
      }
    }
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 mx-auto mb-4" style={{ borderBottom: '2px solid #F7931E', borderLeft: '2px solid #F7931E', borderRight: '2px solid #F7931E', borderTop: '2px solid transparent' }}></div>
          <p style={{ color: '#1F2B3D' }}>Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div className="shadow-sm" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Logo className="h-8" showText={true} />
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" style={{ color: '#F7931E' }} />
                <span className="text-lg font-semibold" style={{ color: '#203864' }}>
                  Área Master
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium" style={{ color: '#1F2B3D' }}>
                  {masterUser?.nome}
                </p>
                <p className="text-xs" style={{ color: '#6B7280' }}>
                  {masterUser?.email}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={masterLogout}
                className="hover:opacity-90"
                style={{ color: '#1F2B3D', borderColor: '#E5E7EB' }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#1F2B3D' }}>
            Gestão de Usuários e Permissões
          </h1>
          <p className="text-sm sm:text-base" style={{ color: '#6B7280' }}>
            Configure as permissões de acesso para cada usuário do sistema
          </p>
        </div>

        {/* Add User Button */}
        <div className="mb-6">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="text-white" style={{ backgroundColor: '#F7931E' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E67E00')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F7931E')}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg" style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }}>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl" style={{ color: '#1F2B3D' }}>Adicionar Novo Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="flex items-center">
                      <X className="h-4 w-4 text-red-400 mr-2" />
                      <span className="text-sm text-red-800">{error}</span>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-sm text-green-800">{success}</span>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="nome" style={{ color: '#1F2B3D' }}>Nome</Label>
                  <Input
                    id="nome"
                    value={newUser.nome}
                    onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                    placeholder="Nome completo"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#1F2B3D' }}
                  />
                </div>
                <div>
                  <Label htmlFor="email" style={{ color: '#1F2B3D' }}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#1F2B3D' }}
                  />
                </div>
                <div>
                  <Label htmlFor="password" style={{ color: '#1F2B3D' }}>Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Defina uma senha segura"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#1F2B3D' }}
                  />
                      </div>
                <div>
                  <Label style={{ color: '#1F2B3D' }}>Tipo de Usuário</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 mb-4">
                    {Object.entries(permissionTemplates).map(([key, template]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setNewUser(prev => ({
                            ...prev,
                            permissoes: template.permissions
                          }))
                        }}
                        className="flex flex-col items-start p-3 rounded-md border text-left focus:outline-none focus:ring-2 transition-colors hover:opacity-90 bg-white border-[#E5E7EB] hover:border-[#F7931E]"
                      >
                        <span className="font-medium text-sm" style={{ color: '#1F2B3D' }}>
                          {template.name}
                        </span>
                        <span className="text-xs" style={{ color: '#6B7280' }}>
                          {template.description}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: '#F0F9FF', border: '1px solid #E0F2FE' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: '#1F2B3D' }}>
                        Permissões Selecionadas
                      </span>
                      <span className="text-xs" style={{ color: '#6B7280' }}>
                        {Object.values(newUser.permissoes).filter(Boolean).length} de {Object.keys(newUser.permissoes).length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(newUser.permissoes)
                        .filter(([_, value]) => value)
                        .map(([key, _]) => (
                          <span
                            key={key}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                            style={{ backgroundColor: '#F7931E', color: '#FFFFFF' }}
                          >
                            {permissionLabels[key as keyof typeof permissionLabels]}
                          </span>
                        ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label style={{ color: '#1F2B3D' }}>Permissões Detalhadas</Label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setNewUser(prev => ({
                            ...prev,
                            permissoes: {
                              dashboard: true,
                              controle: true,
                              gestaoUsuarios: true,
                              gestaoPedidos: true,
                              financeiro: true,
                              relatorios: true,
                              configuracoes: true
                            }
                          }))
                        }}
                        className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                        style={{ borderColor: '#E5E7EB', color: '#1F2B3D' }}
                      >
                        Todas
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewUser(prev => ({
                            ...prev,
                            permissoes: {
                              dashboard: false,
                              controle: false,
                              gestaoUsuarios: false,
                              gestaoPedidos: false,
                              financeiro: false,
                              relatorios: false,
                              configuracoes: false
                            }
                          }))
                        }}
                        className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                        style={{ borderColor: '#E5E7EB', color: '#1F2B3D' }}
                      >
                        Nenhuma
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {Object.entries(permissionLabels).map(([key, label]) => {
                      const checked = Boolean(newUser.permissoes[key as keyof typeof newUser.permissoes])
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => updateNewUserPermission(key, !checked)}
                          className={`flex w-full items-center justify-between rounded-md px-3 py-2 border text-left focus:outline-none focus:ring-2 transition-colors hover:opacity-90 ${
                            checked ? 'bg-[#FEECDC] border-[#F7931E]' : 'bg-white border-[#E5E7EB] hover:border-[#F7931E]'
                          }`}
                          aria-pressed={checked}
                        >
                          <span className="text-sm" style={{ color: '#1F2B3D' }}>{label}</span>
                          <span
                            aria-hidden
                            className={`inline-block h-5 w-9 rounded-full transition-colors ${
                              checked ? 'bg-[#F7931E]' : 'bg-[#E5E7EB]'
                            }`}
                          >
                            <span
                              className={`block h-5 w-5 bg-white rounded-full shadow transform transition-transform ${
                                checked ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAddModalOpen(false)
                      setError(null)
                      setSuccess(null)
                    }} 
                    disabled={isSubmitting}
                    style={{ borderColor: '#E5E7EB', color: '#1F2B3D' }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddUser} 
                    disabled={isSubmitting}
                    className="text-white" 
                    style={{ backgroundColor: isSubmitting ? '#9CA3AF' : '#F7931E' }}
                    onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#E67E00')} 
                    onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#F7931E')}
                  >
                    {isSubmitting ? 'Criando...' : 'Adicionar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Users List */}
        <div className="grid gap-4 sm:gap-6">
          {usuarios.map((user) => (
            <Card key={user.id} className="shadow-sm" style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }}>
              <CardHeader style={{ background: '#FFFFFF' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEECDC' }}>
                      <User className="h-5 w-5" style={{ color: '#F7931E' }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg truncate" style={{ color: '#1F2B3D' }}>{user.nome}</CardTitle>
                      <div className="flex items-center space-x-1 text-xs sm:text-sm" style={{ color: '#6B7280' }}>
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    {editingUser === user.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateUser(user.id)}
                          className="text-white text-xs sm:text-sm"
                          style={{ backgroundColor: '#22C55E' }}
                        >
                          <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Salvar</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingUser(null)
                            setTempPermissions({})
                          }}
                          className="text-xs sm:text-sm"
                          style={{ borderColor: '#E5E7EB', color: '#1F2B3D' }}
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Cancelar</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(user)}
                          className="text-xs sm:text-sm"
                          style={{ borderColor: '#E5E7EB', color: '#1F2B3D' }}
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Editar</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                              style={{ borderColor: '#FCA5A5' }}
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover usuário?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. O usuário será removido da lista de permissões da Área Master.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDeleteUser(user.id)}>
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Resumo das permissões */}
                <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: '#1F2B3D' }}>
                      Permissões Ativas
                    </span>
                    <span className="text-xs" style={{ color: '#6B7280' }}>
                      {Object.values(user.permissoes).filter(Boolean).length} de {Object.keys(user.permissoes).length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(user.permissoes)
                      .filter(([_, value]) => value)
                      .map(([key, _]) => (
                        <span
                          key={key}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                          style={{ backgroundColor: '#F7931E', color: '#FFFFFF' }}
                        >
                          {permissionLabels[key as keyof typeof permissionLabels]}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {Object.entries(permissionLabels).map(([key, label]) => {
                    const Icon = permissionIcons[key as keyof typeof permissionIcons]
                    const isChecked = editingUser === user.id 
                      ? tempPermissions[user.id]?.[key] ?? user.permissoes[key as keyof typeof user.permissoes]
                      : user.permissoes[key as keyof typeof user.permissoes]
                    
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => editingUser === user.id && updatePermission(user.id, key, !isChecked)}
                        className={`flex items-center justify-between rounded-md px-3 py-2 border text-left w-full transition-colors ${
                          isChecked ? 'bg-[#FEECDC] border-[#F7931E]' : 'bg-white border-[#E5E7EB]'
                        } ${editingUser !== user.id ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:opacity-90 hover:border-[#F7931E]'}`}
                        aria-pressed={isChecked}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" style={{ color: '#6B7280' }} />
                          <span className="text-sm" style={{ color: '#1F2B3D' }}>{label}</span>
                        </div>
                        <span
                          aria-hidden
                          className={`inline-block h-5 w-9 rounded-full transition-colors ${
                            isChecked ? 'bg-[#F7931E]' : 'bg-[#E5E7EB]'
                          }`}
                        >
                          <span
                            className={`block h-5 w-5 bg-white rounded-full shadow transform transition-transform ${
                              isChecked ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {usuarios.length === 0 && (
          <Card className="text-center py-12 border-2 border-dashed" style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }}>
            <CardContent>
              <Users className="h-16 w-16 mx-auto mb-6" style={{ color: '#6B7280' }} />
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#1F2B3D' }}>
                Nenhum usuário cadastrado
              </h3>
              <p className="mb-6 max-w-md mx-auto" style={{ color: '#6B7280' }}>
                Comece adicionando usuários para gerenciar suas permissões e controlar o acesso ao sistema
              </p>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="text-white px-6 py-3"
                size="lg"
                style={{ backgroundColor: '#F7931E' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E67E00')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F7931E')}
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
