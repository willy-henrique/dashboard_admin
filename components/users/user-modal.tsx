"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Calendar, Shield, UserCheck } from "lucide-react"
import { User as UserType } from "@/types"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface UserModalProps {
  user: UserType | null
  isOpen: boolean
  onClose: () => void
  onSave: (userData: Partial<UserType>) => void
  mode: 'create' | 'edit' | 'view'
}

const roleConfig = {
  admin: { color: "bg-red-100 text-red-800", label: "Administrador" },
  operador: { color: "bg-blue-100 text-blue-800", label: "Operador" },
  prestador: { color: "bg-green-100 text-green-800", label: "Prestador" },
  cliente: { color: "bg-gray-100 text-gray-800", label: "Cliente" }
}

const statusConfig = {
  ativo: { color: "bg-green-100 text-green-800", label: "Ativo" },
  inativo: { color: "bg-gray-100 text-gray-800", label: "Inativo" },
  bloqueado: { color: "bg-red-100 text-red-800", label: "Bloqueado" }
}

export function UserModal({ user, isOpen, onClose, onSave, mode }: UserModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: '',
    role: 'cliente' as const,
    status: 'ativo' as const,
    rating: 0
  })

  useEffect(() => {
    if (user && mode !== 'create') {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        cpf: user.cpf || '',
        endereco: user.endereco || '',
        role: user.role || 'cliente',
        status: user.status || 'ativo',
        rating: user.rating || 0
      })
    } else if (mode === 'create') {
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        endereco: '',
        role: 'cliente',
        status: 'ativo',
        rating: 0
      })
    }
  }, [user, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isReadOnly = mode === 'view'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {mode === 'create' && <User className="h-5 w-5" />}
            {mode === 'edit' && <UserCheck className="h-5 w-5" />}
            {mode === 'view' && <Shield className="h-5 w-5" />}
            <span>
              {mode === 'create' && 'Novo Usuário'}
              {mode === 'edit' && 'Editar Usuário'}
              {mode === 'view' && 'Detalhes do Usuário'}
            </span>
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' && 'Preencha os dados para criar um novo usuário'}
            {mode === 'edit' && 'Atualize as informações do usuário'}
            {mode === 'view' && 'Visualize as informações completas do usuário'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Digite o email"
                    required
                    readOnly={isReadOnly}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    readOnly={isReadOnly}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  placeholder="Digite o endereço completo"
                  readOnly={isReadOnly}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Acesso */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações de Acesso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Função *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.role === 'prestador' && (
                <div className="space-y-2">
                  <Label htmlFor="rating">Avaliação</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', e.target.value)}
                    placeholder="0.0"
                    readOnly={isReadOnly}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações do Sistema (apenas visualização) */}
          {mode === 'view' && user && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Data de Criação</p>
                      <p className="text-sm text-gray-600">
                        {format(user.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Último Login</p>
                      <p className="text-sm text-gray-600">
                        {user.lastLogin 
                          ? format(user.lastLogin, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                          : 'Nunca'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={roleConfig[user.role].color}>
                      {roleConfig[user.role].label}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={statusConfig[user.status].color}>
                      {statusConfig[user.status].label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === 'view' ? 'Fechar' : 'Cancelar'}
            </Button>
            {mode !== 'view' && (
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                {mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
