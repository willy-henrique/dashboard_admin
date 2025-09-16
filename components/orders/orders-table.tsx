"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Star
} from "lucide-react"
import { Order } from "@/hooks/use-orders"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface OrdersTableProps {
  orders: Order[]
  loading: boolean
  onUpdate?: (orderId: string, orderData: Partial<Order>) => void
  onDelete?: (orderId: string) => void
  onAssignProvider?: (orderId: string, providerId: string, providerName: string) => void
  onUpdateStatus?: (orderId: string, status: Order['status'], notes?: string) => void
  onView?: (orderId: string) => void
  onEdit?: (orderId: string) => void
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

export function OrdersTable({ 
  orders, 
  loading, 
  onUpdate, 
  onDelete, 
  onAssignProvider, 
  onUpdateStatus, 
  onView, 
  onEdit 
}: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("")

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || order.status === statusFilter
    const matchesPriority = !priorityFilter || order.priority === priorityFilter
    const matchesServiceCategory = !serviceCategoryFilter || order.serviceCategory === serviceCategoryFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesServiceCategory
  })

  const getStatusIcon = (status: keyof typeof statusConfig) => {
    const IconComponent = statusConfig[status].icon
    return <IconComponent className="h-4 w-4" />
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os Status</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as Prioridades</SelectItem>
                {Object.entries(priorityConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={serviceCategoryFilter} onValueChange={setServiceCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as Categorias</SelectItem>
                <SelectItem value="Limpeza">Limpeza</SelectItem>
                <SelectItem value="Manutenção">Manutenção</SelectItem>
                <SelectItem value="Pintura">Pintura</SelectItem>
                <SelectItem value="Instalação">Instalação</SelectItem>
                <SelectItem value="Reparo">Reparo</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("")
                setPriorityFilter("")
                setServiceCategoryFilter("")
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <p className="text-gray-500">Nenhum pedido encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono">{order.id}</span>
                          {order.priority === 'urgent' && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{order.clientName}</div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Mail className="h-3 w-3" />
                            <span>{order.clientEmail}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Phone className="h-3 w-3" />
                            <span>{order.clientPhone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{order.serviceCategory}</div>
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {order.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[order.status].color}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span>{statusConfig[order.status].label}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityConfig[order.priority].color}>
                          {priorityConfig[order.priority].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium">
                            R$ {order.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <Badge className={paymentStatusConfig[order.paymentStatus].color} variant="outline">
                            {paymentStatusConfig[order.paymentStatus].label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="max-w-xs truncate">{order.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{format(order.createdAt, "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(order.createdAt, "HH:mm", { locale: ptBR })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView?.(order.id)}
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit?.(order.id)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {order.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onAssignProvider?.(order.id, '', '')}
                              title="Atribuir Prestador"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          )}
                          {order.status === 'assigned' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onUpdateStatus?.(order.id, 'in_progress')}
                              title="Iniciar Serviço"
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          )}
                          {order.status === 'in_progress' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onUpdateStatus?.(order.id, 'completed')}
                              title="Concluir Serviço"
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete?.(order.id)}
                            title="Deletar"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Paginação */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando {filteredOrders.length} de {orders.length} pedidos
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled>
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}