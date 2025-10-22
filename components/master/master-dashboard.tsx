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

  const handleAddUser = async () => {
    try {
      // Chama API para criar usuário com senha no Firebase Auth e salvar permissões
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
      if (!resp.ok) throw new Error('Falha ao criar usuário')
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1F2B3D' }}>
            Gestão de Usuários e Permissões
          </h1>
          <p style={{ color: '#6B7280' }}>
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
            <DialogContent className="sm:max-w-md" style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }}>
              <DialogHeader>
                <DialogTitle style={{ color: '#1F2B3D' }}>Adicionar Novo Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
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
                  <Label style={{ color: '#1F2B3D' }}>Permissões Iniciais</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mt-3">
                    {Object.entries(permissionLabels).map(([key, label]) => {
                      const checked = Boolean(newUser.permissoes[key as keyof typeof newUser.permissoes])
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            const value = !checked
                            setNewUser((prev) => ({
                              ...prev,
                              permissoes: { ...prev.permissoes, [key]: value },
                            }))
                          }}
                          className={`flex w-full items-center justify-between rounded-md px-3 py-2 border text-left focus:outline-none focus:ring-2 transition-colors ${
                            checked ? 'bg-[#FEECDC] border-[#F7931E]' : 'bg-white border-[#E5E7EB]'
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
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)} style={{ borderColor: '#E5E7EB', color: '#1F2B3D' }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddUser} className="text-white" style={{ backgroundColor: '#F7931E' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E67E00')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F7931E')}>
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
            <Card key={user.id} className="shadow-sm" style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }}>
              <CardHeader style={{ background: '#FFFFFF' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEECDC' }}>
                      <User className="h-5 w-5" style={{ color: '#F7931E' }} />
                    </div>
                    <div>
                      <CardTitle className="text-lg" style={{ color: '#1F2B3D' }}>{user.nome}</CardTitle>
                      <div className="flex items-center space-x-1 text-sm" style={{ color: '#6B7280' }}>
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
                          className="text-white"
                          style={{ backgroundColor: '#22C55E' }}
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
                          style={{ borderColor: '#E5E7EB', color: '#1F2B3D' }}
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
                          style={{ borderColor: '#E5E7EB', color: '#1F2B3D' }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          style={{ borderColor: '#FCA5A5' }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                        } ${editingUser !== user.id ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
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
