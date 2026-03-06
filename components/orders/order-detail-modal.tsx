"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Calendar, User, Star, Clock, MessageCircle, Phone, Mail, AlertTriangle, CheckCircle, XCircle, UserPlus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

type OrderStatus = "pending" | "assigned" | "in_progress" | "completed" | "cancelled"
type OrderPriority = "low" | "medium" | "high" | "urgent"
type PaymentStatus = "pending" | "paid" | "refunded"

interface Order {
  id: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  serviceCategory?: string
  description?: string
  status: OrderStatus
  priority?: OrderPriority
  budget?: number
  location?: string
  address?: string
  city?: string
  state?: string
  notes?: string
  paymentStatus?: PaymentStatus
  paymentMethod?: string
  estimatedDuration?: number
  providerName?: string
  providerId?: string
  rating?: number
  createdAt: unknown
  assignedAt?: unknown
  completedAt?: unknown
}

interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: (orderId: string, orderData: Partial<Order>) => void
  onDelete?: (orderId: string) => void
  onAssignProvider?: (orderId: string, providerId: string, providerName: string) => void
  onUpdateStatus?: (orderId: string, status: OrderStatus, notes?: string) => void
  mode: "view" | "edit"
}

const statusConfig: Record<OrderStatus, { color: string; label: string }> = {
  pending: { color: "bg-yellow-100 text-yellow-800", label: "Pendente" },
  assigned: { color: "bg-blue-100 text-blue-800", label: "Atribuido" },
  in_progress: { color: "bg-purple-100 text-purple-800", label: "Em andamento" },
  completed: { color: "bg-green-100 text-green-800", label: "Concluido" },
  cancelled: { color: "bg-red-100 text-red-800", label: "Cancelado" },
}

const priorityConfig: Record<OrderPriority, { color: string; label: string }> = {
  low: { color: "bg-gray-100 text-gray-800", label: "Baixa" },
  medium: { color: "bg-blue-100 text-blue-800", label: "Media" },
  high: { color: "bg-orange-100 text-orange-800", label: "Alta" },
  urgent: { color: "bg-red-100 text-red-800", label: "Urgente" },
}

const paymentStatusConfig: Record<PaymentStatus, { color: string; label: string }> = {
  pending: { color: "bg-yellow-100 text-yellow-800", label: "Pendente" },
  paid: { color: "bg-green-100 text-green-800", label: "Pago" },
  refunded: { color: "bg-red-100 text-red-800", label: "Reembolsado" },
}

const toDate = (value: unknown): Date | null => {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    return value
  }

  if (typeof (value as { toDate?: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate()
  }

  const parsed = new Date(String(value))
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const formatDateValue = (value: unknown): string => {
  const date = toDate(value)
  if (!date) {
    return "N/A"
  }

  return format(date, "dd/MM/yyyy 'as' HH:mm", { locale: ptBR })
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onAssignProvider,
  mode,
}: OrderDetailModalProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    serviceCategory: "",
    description: "",
    status: "pending" as OrderStatus,
    priority: "low" as OrderPriority,
    budget: 0,
    location: "",
    address: "",
    city: "",
    state: "",
    notes: "",
    paymentStatus: "pending" as PaymentStatus,
    paymentMethod: "",
    estimatedDuration: 0,
  })

  useEffect(() => {
    if (!order || mode !== "edit") {
      return
    }

    setFormData({
      clientName: order.clientName || "",
      clientEmail: order.clientEmail || "",
      clientPhone: order.clientPhone || "",
      serviceCategory: order.serviceCategory || "",
      description: order.description || "",
      status: order.status || "pending",
      priority: order.priority || "low",
      budget: order.budget || 0,
      location: order.location || "",
      address: order.address || "",
      city: order.city || "",
      state: order.state || "",
      notes: order.notes || "",
      paymentStatus: order.paymentStatus || "pending",
      paymentMethod: order.paymentMethod || "",
      estimatedDuration: order.estimatedDuration || 0,
    })
  }, [mode, order])

  if (!order) {
    return null
  }

  const isReadOnly = mode === "view"

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!onUpdate) {
      return
    }

    onUpdate(order.id, formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Pedido {order.id}</span>
            {order.priority === "urgent" ? <AlertTriangle className="h-5 w-5 text-red-500" /> : null}
          </DialogTitle>
          <DialogDescription>{mode === "view" ? "Detalhes do pedido" : "Editar pedido"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status e prioridade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Status</Label>
                  {isReadOnly ? (
                    <Badge className={statusConfig[order.status].color}>{statusConfig[order.status].label}</Badge>
                  ) : (
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
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
                    <Badge className={priorityConfig[order.priority || "low"].color}>{priorityConfig[order.priority || "low"].label}</Badge>
                  ) : (
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
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
                    <Badge className={paymentStatusConfig[order.paymentStatus || "pending"].color}>{paymentStatusConfig[order.paymentStatus || "pending"].label}</Badge>
                  ) : (
                    <Select value={formData.paymentStatus} onValueChange={(value) => handleInputChange("paymentStatus", value)}>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={isReadOnly ? order.clientName || "" : formData.clientName} onChange={(event) => handleInputChange("clientName", event.target.value)} readOnly={isReadOnly} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={isReadOnly ? order.clientEmail || "" : formData.clientEmail} onChange={(event) => handleInputChange("clientEmail", event.target.value)} readOnly={isReadOnly} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={isReadOnly ? order.clientPhone || "" : formData.clientPhone} onChange={(event) => handleInputChange("clientPhone", event.target.value)} readOnly={isReadOnly} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Servico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Input value={isReadOnly ? order.serviceCategory || "" : formData.serviceCategory} onChange={(event) => handleInputChange("serviceCategory", event.target.value)} readOnly={isReadOnly} />
                </div>
                <div className="space-y-2">
                  <Label>Valor</Label>
                  <Input type="number" step="0.01" value={isReadOnly ? order.budget || 0 : formData.budget} onChange={(event) => handleInputChange("budget", Number(event.target.value) || 0)} readOnly={isReadOnly} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descricao</Label>
                <Textarea value={isReadOnly ? order.description || "" : formData.description} onChange={(event) => handleInputChange("description", event.target.value)} readOnly={isReadOnly} rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localizacao
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Endereco completo</Label>
                <Input value={isReadOnly ? order.location || order.address || "" : formData.location} onChange={(event) => handleInputChange("location", event.target.value)} readOnly={isReadOnly} />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Logradouro</Label>
                  <Input value={isReadOnly ? order.address || "" : formData.address} onChange={(event) => handleInputChange("address", event.target.value)} readOnly={isReadOnly} />
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input value={isReadOnly ? order.city || "" : formData.city} onChange={(event) => handleInputChange("city", event.target.value)} readOnly={isReadOnly} />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Input value={isReadOnly ? order.state || "" : formData.state} onChange={(event) => handleInputChange("state", event.target.value)} readOnly={isReadOnly} />
                </div>
              </div>
            </CardContent>
          </Card>

          {order.providerName ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Prestador atribuido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.providerName}</p>
                    <p className="text-sm text-gray-600">ID: {order.providerId || "N/A"}</p>
                  </div>
                  {order.rating ? (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{order.rating}</span>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Datas do sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium">Criacao</p>
                  <p className="text-sm text-gray-600">{formatDateValue(order.createdAt)}</p>
                </div>
                {order.assignedAt ? (
                  <div>
                    <p className="text-sm font-medium">Atribuicao</p>
                    <p className="text-sm text-gray-600">{formatDateValue(order.assignedAt)}</p>
                  </div>
                ) : null}
                {order.completedAt ? (
                  <div>
                    <p className="text-sm font-medium">Conclusao</p>
                    <p className="text-sm text-gray-600">{formatDateValue(order.completedAt)}</p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observacoes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={isReadOnly ? order.notes || "" : formData.notes} onChange={(event) => handleInputChange("notes", event.target.value)} readOnly={isReadOnly} rows={3} placeholder="Sem observacoes registradas." />
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === "view" ? "Fechar" : "Cancelar"}
            </Button>
            {mode === "edit" && onUpdate ? (
              <Button type="submit" className="bg-orange-500 text-white hover:bg-orange-600">
                Salvar alteracoes
              </Button>
            ) : null}
            {mode === "view" && onDelete ? (
              <Button type="button" variant="outline" onClick={() => onDelete(order.id)} className="text-red-600 hover:text-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar
              </Button>
            ) : null}
            {mode === "view" && onAssignProvider ? (
              <Button type="button" onClick={() => onAssignProvider(order.id, "", "")} className="bg-blue-600 text-white hover:bg-blue-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Atribuir prestador
              </Button>
            ) : null}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
