"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, UserPlus, Clock, AlertTriangle } from "lucide-react"
import { OrderModal } from "./order-modal"
import { AssignProviderModal } from "./assign-provider-modal"

interface Order {
  id: string
  clientId: string
  clientName: string
  providerId?: string
  providerName?: string
  serviceCategory: string
  description: string
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  budget: number
  location: string
  createdAt: string
  assignedAt?: string
  completedAt?: string
  rating?: number
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    clientId: "1",
    clientName: "Maria Silva",
    providerId: "1",
    providerName: "João Silva",
    serviceCategory: "Limpeza",
    description: "Limpeza completa de apartamento 2 quartos",
    status: "in_progress",
    priority: "medium",
    budget: 250.0,
    location: "São Paulo, SP",
    createdAt: "2024-03-10T10:00:00Z",
    assignedAt: "2024-03-10T11:30:00Z",
  },
  {
    id: "ORD-002",
    clientId: "2",
    clientName: "João Santos",
    serviceCategory: "Manutenção",
    description: "Reparo de torneira da cozinha",
    status: "pending",
    priority: "high",
    budget: 150.0,
    location: "Rio de Janeiro, RJ",
    createdAt: "2024-03-11T14:20:00Z",
  },
  {
    id: "ORD-003",
    clientId: "3",
    clientName: "Ana Costa",
    providerId: "2",
    providerName: "Maria Santos",
    serviceCategory: "Jardinagem",
    description: "Poda de árvores e limpeza do jardim",
    status: "completed",
    priority: "low",
    budget: 300.0,
    location: "Belo Horizonte, MG",
    createdAt: "2024-03-08T09:15:00Z",
    assignedAt: "2024-03-08T10:00:00Z",
    completedAt: "2024-03-09T16:30:00Z",
    rating: 5,
  },
  {
    id: "ORD-004",
    clientId: "4",
    clientName: "Carlos Lima",
    serviceCategory: "Pintura",
    description: "Pintura de sala e dois quartos",
    status: "pending",
    priority: "urgent",
    budget: 800.0,
    location: "Salvador, BA",
    createdAt: "2024-03-11T16:45:00Z",
  },
  {
    id: "ORD-005",
    clientId: "1",
    clientName: "Maria Silva",
    providerId: "3",
    providerName: "Carlos Lima",
    serviceCategory: "Manutenção",
    description: "Instalação de chuveiro elétrico",
    status: "assigned",
    priority: "medium",
    budget: 200.0,
    location: "São Paulo, SP",
    createdAt: "2024-03-11T08:30:00Z",
    assignedAt: "2024-03-11T09:15:00Z",
  },
]

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter
    const matchesCategory =
      categoryFilter === "all" || order.serviceCategory.toLowerCase().includes(categoryFilter.toLowerCase())
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pendente</Badge>
      case "assigned":
        return <Badge className="bg-blue-100 text-blue-800">Atribuído</Badge>
      case "in_progress":
        return <Badge className="bg-purple-100 text-purple-800">Em Andamento</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="text-gray-600">
            Baixa
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="text-blue-600">
            Média
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="text-orange-600">
            Alta
          </Badge>
        )
      case "urgent":
        return (
          <Badge variant="outline" className="text-red-600">
            Urgente
          </Badge>
        )
      default:
        return <Badge variant="outline">-</Badge>
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "high":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return null
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderModalOpen(true)
  }

  const handleAssignProvider = (order: Order) => {
    setSelectedOrder(order)
    setIsAssignModalOpen(true)
  }

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const handleProviderAssigned = (orderId: string, providerId: string, providerName: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              providerId,
              providerName,
              status: "assigned",
              assignedAt: new Date().toISOString(),
            }
          : order,
      ),
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>
            {filteredOrders.length} de {orders.length} pedidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por ID, cliente ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="assigned">Atribuído</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Prioridades</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                <SelectItem value="limpeza">Limpeza</SelectItem>
                <SelectItem value="manutenção">Manutenção</SelectItem>
                <SelectItem value="jardinagem">Jardinagem</SelectItem>
                <SelectItem value="pintura">Pintura</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Prestador</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Orçamento</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(order.priority)}
                        <div>
                          <div className="font-medium">{order.id}</div>
                          <div className="text-sm text-gray-500 max-w-32 truncate">{order.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.clientName}</div>
                        <div className="text-sm text-gray-500">{order.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.providerName ? (
                        <div className="font-medium">{order.providerName}</div>
                      ) : (
                        <span className="text-gray-400 text-sm">Não atribuído</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.serviceCategory}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                    <TableCell>R$ {order.budget.toFixed(2)}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {order.status === "pending" && (
                          <Button variant="ghost" size="sm" onClick={() => handleAssignProvider(order)}>
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <OrderModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false)
          setSelectedOrder(null)
        }}
        onStatusChange={handleStatusChange}
      />

      <AssignProviderModal
        order={selectedOrder}
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false)
          setSelectedOrder(null)
        }}
        onProviderAssigned={handleProviderAssigned}
      />
    </>
  )
}
