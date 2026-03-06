"use client"

import { useEffect, useState, type MouseEvent } from "react"
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
    icon: <Clock className="h-4 w-4" />
  },
  {
    value: "in_progress",
    label: "Em Andamento",
    icon: <Truck className="h-4 w-4" />
  },
  {
    value: "completed",
    label: "Concluído",
    icon: <CheckCircle className="h-4 w-4" />
  },
  {
    value: "cancelled",
    label: "Cancelado",
    icon: <XCircle className="h-4 w-4" />
  }
]

export function OrderDetailsModalFixed({ order, isOpen, onClose, onOrderUpdated }: OrderDetailsModalProps) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !order) return

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [isOpen, order])

  useEffect(() => {
    if (!isOpen || !order) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, order, onClose])

  if (!isOpen || !order) return null

  const formattedCreatedAt = (() => {
    if (!order?.createdAt) return "N/A"

    try {
      const parsedDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt)
      if (Number.isNaN(parsedDate.getTime())) return "N/A"
      return parsedDate.toLocaleString("pt-BR")
    } catch {
      return "N/A"
    }
  })()

  const selectedStatus = statusOptions.some((status) => status.value === order.status) ? order.status : "pending"
  const statusOption = statusOptions.find((status) => status.value === selectedStatus)
  const shortOrderId = order?.id ? String(order.id).slice(-8) : "N/A"

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
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

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-900/20 backdrop-blur-sm p-4"
      style={{ zIndex: 50 }}
      onClick={handleBackdropClick}
    >
      <div className="mx-auto flex h-full w-full max-w-4xl items-center justify-center">
        <div className="flex w-full max-h-[88vh] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">Detalhes do Serviço</h2>
            <p className="text-sm text-gray-600">Cliente: {order.clientName || "N/A"}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                  <Package className="h-5 w-5" />
                  Detalhes do Serviço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Protocolo</p>
                    <p className="mt-1 font-mono text-sm text-gray-900">{shortOrderId}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Emergência</p>
                    <div className="mt-1">
                      <Badge variant={order.isEmergency ? "destructive" : "secondary"}>
                        {order.isEmergency ? "Sim" : "Não"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-800">Status</p>
                  <Select
                    value={selectedStatus}
                    onValueChange={handleStatusChange}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {statusOption?.icon}
                          <span>{statusOption?.label || "Pendente"}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="z-[9999]" style={{ zIndex: 9999 }}>
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

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-800">Descrição</p>
                  <p className="min-h-24 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">
                    {order.description || "Descrição não disponível"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-green-900">
                  <User className="h-5 w-5" />
                  Cliente e Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <User className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Nome</p>
                    <p className="font-medium text-gray-900">{order.clientName || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <Mail className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Email</p>
                    <p className="font-medium text-gray-900">{order.clientEmail || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Endereço</p>
                    <p className="font-medium text-gray-900">{order.address || "N/A"}</p>
                    {order.complement && (
                      <p className="text-sm text-gray-600">{order.complement}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <Calendar className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Data de criação</p>
                    <p className="font-medium text-gray-900">{formattedCreatedAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>

    </div>
  )
}
