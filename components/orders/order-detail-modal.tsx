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
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  Star, 
  Clock, 
  MessageCircle,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  UserPlus,
  Edit,
  Trash2
} from "lucide-react"
import { Order } from "@/hooks/use-orders"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: (orderId: string, orderData: Partial<Order>) => void
  onDelete?: (orderId: string) => void
  onAssignProvider?: (orderId: string, providerId: string, providerName: string) => void
  onUpdateStatus?: (orderId: string, status: Order['status'], notes?: string) => void
  mode: 'view' | 'edit'
}

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", label: "Pendente", icon: Clock },
  assigned: { color: "bg-blue-100 text-blue-800", label: "Atribuído", icon: UserPlus },
  in_progress: { color: "bg-purple-100 text-purple-800", label: "Em Andamento", icon: Clock },
  completed: { color: "bg-green-100 text-green-800", label: "Concluído", icon: CheckCircle },
  cancelled: { color: "bg-red-100 text-red-800", label: "Cancelado", icon: XCircle }
}

const priorityConfig = {
  low: { color: "bg-gray-100 text-gray-800", label: "Baixa" },
  medium: { color: "bg-blue-100 text-blue-800", label: "Média" },
  high: { color: "bg-orange-100 text-orange-800", label: "Alta" },
  urgent: { color: "bg-red-100 text-red-800", label: "Urgente" }
}

const paymentStatusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", label: "Pendente" },
  paid: { color: "bg-green-100 text-green-800", label: "Pago" },
  refunded: { color: "bg-red-100 text-red-800", label: "Reembolsado" }
}

export function OrderDetailModal({ 
  order, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete, 
  onAssignProvider, 
  onUpdateStatus, 
  mode 
}: OrderDetailModalProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceCategory: '',
    description: '',
    status: 'pending' as Order['status'],
    priority: 'low' as Order['priority'],
    budget: 0,
    location: '',
    address: '',
    city: '',
    state: '',
    notes: '',
    paymentStatus: 'pending' as Order['paymentStatus'],
    paymentMethod: '',
    estimatedDuration: 0
  })

  useEffect(() => {
    if (order && mode === 'edit') {
      setFormData({
        clientName: order.clientName || '',
        clientEmail: order.clientEmail || '',
        clientPhone: order.clientPhone || '',
        serviceCategory: order.serviceCategory || '',
        description: order.description || '',
        status: order.status || 'pending',
        priority: order.priority || 'low',
        budget: order.budget || 0,
        location: order.location || '',
        address: order.address || '',
        city: order.city || '',
        state: order.state || '',
        notes: order.notes || '',
        paymentStatus: order.paymentStatus || 'pending',
        paymentMethod: order.paymentMethod || '',
        estimatedDuration: order.estimatedDuration || 0
      })
    }
  }, [order, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (order && onUpdate) {
      onUpdate(order.id, formData)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isReadOnly = mode === 'view'

  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Pedido {order.id}</span>
            {order.priority === 'urgent' && (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'view' ? 'Detalhes completos do pedido' : 'Editar informações do pedido'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status e Prioridade */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status e Prioridade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  {isReadOnly ? (
                    <Badge className={statusConfig[order.status].color}>
                      {statusConfig[order.status].label}
                    </Badge>
                  ) : (
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  {isReadOnly ? (
                    <Badge className={priorityConfig[order.priority].color}>
                      {priorityConfig[order.priority].label}
                    </Badge>
                  ) : (
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleInputChange('priority', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(priorityConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Pagamento</Label>
                  {isReadOnly ? (
                    <Badge className={paymentStatusConfig[order.paymentStatus].color}>
                      {paymentStatusConfig[order.paymentStatus].label}
                    </Badge>
                  ) : (
                    <Select
                      value={formData.paymentStatus}
                      onValueChange={(value) => handleInputChange('paymentStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(paymentStatusConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações do Cliente</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nome Completo *</Label>
                  <Input
                    id="clientName"
                    value={isReadOnly ? order.clientName : formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={isReadOnly ? order.clientEmail : formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telefone</Label>
                <Input
                  id="clientPhone"
                  value={isReadOnly ? order.clientPhone : formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  readOnly={isReadOnly}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações do Serviço */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações do Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceCategory">Categoria do Serviço *</Label>
                  {isReadOnly ? (
                    <Badge variant="outline">{order.serviceCategory}</Badge>
                  ) : (
                    <Select
                      value={formData.serviceCategory}
                      onValueChange={(value) => handleInputChange('serviceCategory', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Limpeza">Limpeza</SelectItem>
                        <SelectItem value="Manutenção">Manutenção</SelectItem>
                        <SelectItem value="Pintura">Pintura</SelectItem>
                        <SelectItem value="Instalação">Instalação</SelectItem>
                        <SelectItem value="Reparo">Reparo</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Valor (R$) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    step="0.01"
                    value={isReadOnly ? order.budget : formData.budget}
                    onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Serviço *</Label>
                <Textarea
                  id="description"
                  value={isReadOnly ? order.description : formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  readOnly={isReadOnly}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Localização</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Endereço Completo *</Label>
                <Input
                  id="location"
                  value={isReadOnly ? order.location : formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  readOnly={isReadOnly}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Logradouro</Label>
                  <Input
                    id="address"
                    value={isReadOnly ? order.address : formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={isReadOnly ? order.city : formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={isReadOnly ? order.state : formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prestador Atribuído */}
          {order.providerName && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Prestador Atribuído</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.providerName}</p>
                    <p className="text-sm text-gray-600">ID: {order.providerId}</p>
                  </div>
                  {order.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{order.rating}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informações do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Informações do Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Data de Criação</p>
                  <p className="text-sm text-gray-600">
                    {format(order.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                {order.assignedAt && (
                  <div>
                    <p className="text-sm font-medium">Data de Atribuição</p>
                    <p className="text-sm text-gray-600">
                      {format(order.assignedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                )}
                {order.completedAt && (
                  <div>
                    <p className="text-sm font-medium">Data de Conclusão</p>
                    <p className="text-sm text-gray-600">
                      {format(order.completedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={isReadOnly ? order.notes || '' : formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                readOnly={isReadOnly}
                rows={3}
                placeholder="Adicione observações sobre o pedido..."
              />
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === 'view' ? 'Fechar' : 'Cancelar'}
            </Button>
            {mode === 'edit' && (
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                Salvar Alterações
              </Button>
            )}
            {mode === 'view' && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onDelete?.(order.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar
                </Button>
                <Button
                  type="button"
                  onClick={() => onAssignProvider?.(order.id, '', '')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Atribuir Prestador
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
