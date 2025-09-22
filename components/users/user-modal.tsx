"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  UserCheck, 
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Star,
  Clock
} from "lucide-react"
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
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white dark:bg-slate-900">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center space-x-3 text-2xl font-bold">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              {mode === 'create' && <User className="h-5 w-5 text-white" />}
              {mode === 'edit' && <UserCheck className="h-5 w-5 text-white" />}
              {mode === 'view' && <Shield className="h-5 w-5 text-white" />}
            </div>
            <span className="text-gray-900 dark:text-white">
              {mode === 'create' && 'Novo Usuário'}
              {mode === 'edit' && 'Editar Usuário'}
              {mode === 'view' && 'Detalhes do Usuário'}
            </span>
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600 dark:text-gray-300">
            {mode === 'create' && 'Preencha os dados para criar um novo usuário'}
            {mode === 'edit' && 'Atualize as informações do usuário'}
            {mode === 'view' && 'Visualize as informações completas do usuário'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <Card className="bg-gray-50 dark:bg-slate-800 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="h-5 w-5 text-orange-600" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Nome Completo *
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                    readOnly={isReadOnly}
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Digite o email"
                    required
                    readOnly={isReadOnly}
                    className="h-11 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    readOnly={isReadOnly}
                    className="h-11 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    readOnly={isReadOnly}
                    className="h-11 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Endereço
                </Label>
                <Textarea
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  placeholder="Digite o endereço completo"
                  readOnly={isReadOnly}
                  className="min-h-[80px] text-base"
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Acesso */}
          <Card className="bg-gray-50 dark:bg-slate-800 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Configurações de Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Função *
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger className="h-11 text-base">
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
                  <Label htmlFor="status" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status *
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger className="h-11 text-base">
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
                  <Label htmlFor="rating" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Avaliação
                  </Label>
                  <div className="flex items-center gap-2">
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
                      className="h-11 text-base w-24"
                    />
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= formData.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações do Sistema (apenas visualização) */}
          {mode === 'view' && user && (
            <Card className="bg-gray-50 dark:bg-slate-800 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Informações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-700 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Data de Criação</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format(user.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-700 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Último Login</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
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
                    <Badge className={`${roleConfig[user.role].color} px-3 py-1`}>
                      {roleConfig[user.role].label}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${statusConfig[user.status].color} px-3 py-1`}>
                      {statusConfig[user.status].label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1 sm:flex-none h-11"
              >
                <X className="h-4 w-4 mr-2" />
                {mode === 'view' ? 'Fechar' : 'Cancelar'}
              </Button>
              {mode !== 'view' && (
                <Button 
                  type="submit" 
                  className="flex-1 sm:flex-none bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-11"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
