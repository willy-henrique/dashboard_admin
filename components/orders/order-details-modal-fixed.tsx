"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import { 
  X, 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Package, 
  AlertTriangle,
  MessageSquare,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  XCircle
} from "lucide-react"

interface OrderDetailsModalProps {
  order: any
  isOpen: boolean
  onClose: () => void
  onOrderUpdated?: () => void
}

const statusOptions = [
  {
    value: "pending",
    label: "Pendente",
    icon: <Clock className="h-4 w-4" />,
    color: "bg-yellow-100 text-yellow-800"
  },
  {
    value: "in_progress",
    label: "Em Andamento",
    icon: <Truck className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800"
  },
  {
    value: "completed",
    label: "Concluído",
    icon: <CheckCircle className="h-4 w-4" />,
    color: "bg-green-100 text-green-800"
  },
  {
    value: "cancelled",
    label: "Cancelado",
    icon: <XCircle className="h-4 w-4" />,
    color: "bg-red-100 text-red-800"
  }
]

export function OrderDetailsModalFixed({ order, isOpen, onClose, onOrderUpdated }: OrderDetailsModalProps) {
  const [loading, setLoading] = useState(false)

  if (!isOpen || !order) return null

  const handleViewChat = () => {
    const chatUrl = `/dashboard/controle/chat?orderId=${order.id}&protocolo=${order.id.slice(-8)}`
    window.open(chatUrl, '_blank')
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!order?.id || newStatus === order.status) return

    setLoading(true)
    try {
      const orderRef = doc(db, 'orders', order.id)
      const updateData: any = {
        status: newStatus,
        updatedAt: new Date()
      }

      // Adicionar campos específicos baseado no status
      if (newStatus === "cancelled") {
        updateData.cancelledAt = new Date()
        updateData.cancelledBy = "admin"
      } else if (newStatus === "in_progress") {
        updateData.distributionStartedAt = new Date()
      } else if (newStatus === "completed") {
        updateData.completedAt = new Date()
        updateData.completedBy = "admin"
      }

      await updateDoc(orderRef, updateData)

      toast.success("Status atualizado com sucesso!")
      if (onOrderUpdated) {
        onOrderUpdated()
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      toast.error("Erro ao atualizar status do pedido")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{zIndex: 50}}>
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detalhes do Pedido</h2>
            <p className="text-sm text-gray-600 mt-1">Cliente: {order.clientName}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                  <Package className="h-5 w-5" />
                  Informações do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">ID do Pedido:</span>
                  <Badge variant="outline" className="font-mono">
                    {order.id.slice(-8)}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Emergência:</span>
                  <Badge variant={order.isEmergency ? "destructive" : "secondary"}>
                    {order.isEmergency ? "Sim" : "Não"}
                  </Badge>
                </div>

                <div>
                  <span className="font-medium">Descrição:</span>
                  <p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg border">
                    {order.description || 'Descrição não disponível'}
                  </p>
                </div>

                <div>
                  <span className="font-medium">Status:</span>
                  <Select 
                    value={order.status || 'pending'} 
                    onValueChange={handleStatusChange}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {statusOptions.find(s => s.value === (order.status || 'pending'))?.icon}
                          <span>{statusOptions.find(s => s.value === (order.status || 'pending'))?.label}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="z-[9999]" style={{zIndex: 9999}}>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            {status.icon}
                            <span>{status.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
                <CardTitle className="text-lg flex items-center gap-2 text-green-900">
                  <User className="h-5 w-5" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">{order.clientName}</p>
                    <p className="text-sm text-gray-500">Nome do cliente</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">{order.clientEmail}</p>
                    <p className="text-sm text-gray-500">Email de contato</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">{order.address}</p>
                    {order.complement && (
                      <p className="text-sm text-gray-600">{order.complement}</p>
                    )}
                    <p className="text-sm text-gray-500">Endereço de entrega</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">
                      {order.createdAt ? 
                        (order.createdAt.toDate ? 
                          order.createdAt.toDate().toLocaleString('pt-BR') : 
                          new Date(order.createdAt).toLocaleString('pt-BR')
                        ) : 
                        'N/A'
                      }
                    </p>
                    <p className="text-sm text-gray-500">Data de criação</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Imagens */}
          {order.images && order.images.length > 0 && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50">
                <CardTitle className="text-lg flex items-center gap-2 text-purple-900">
                  <Eye className="h-5 w-5" />
                  Imagens do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {order.images.map((image: string, index: number) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00OCA0OEg4MFY4MEg0OFY0OFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTU2IDU2SDcyVjcySDU2VjU2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                        }}
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => window.open(image, '_blank')}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50">
              <CardTitle className="text-lg flex items-center gap-2 text-orange-900">
                <MessageSquare className="h-5 w-5" />
                Ações Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleViewChat} className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Abrir Chat
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Marcar Urgência
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  )
}
