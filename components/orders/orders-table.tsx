"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import { useOrders } from "@/hooks/use-orders"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface OrdersTableProps {
  filters?: {
    status?: string
    isEmergency?: boolean
    searchTerm?: string
  }
  onView?: (orderId: string) => void
  onEdit?: (orderId: string) => void
}

export function OrdersTable({ filters, onView, onEdit }: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState(filters?.searchTerm || "")
  const { orders, loading, error, refetch } = useOrders({
    ...filters,
    searchTerm: searchTerm || undefined
  })

  const getStatusBadge = (order: any) => {
    if (order.cancelledAt || order.status === 'cancelled') {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Cancelado
        </Badge>
      )
    }
    
    if (order.status === 'completed') {
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-600">
          <CheckCircle className="h-3 w-3" />
          Concluído
        </Badge>
      )
    }
    
    if (order.isEmergency) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1 bg-red-600">
          <AlertCircle className="h-3 w-3" />
          Emergência
        </Badge>
      )
    }
    
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Em Andamento
      </Badge>
    )
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A'
    return formatDistanceToNow(timestamp.toDate(), { 
      addSuffix: true, 
      locale: ptBR 
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 mx-auto text-red-500 mb-2" />
            <p className="text-red-600">Erro ao carregar pedidos: {error}</p>
            <Button onClick={refetch} className="mt-4">
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Pedidos</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {orders.length} pedidos encontrados
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por ID, cliente, prestador ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Cliente</TableHead>
                    <TableHead className="font-semibold text-gray-700">Serviço</TableHead>
                    <TableHead className="font-semibold text-gray-700">Endereço</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Data</TableHead>
                    <TableHead className="font-semibold text-gray-700">Valor</TableHead>
                    <TableHead className="font-semibold text-gray-700">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, index) => (
                    <TableRow key={order.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <TableCell className="font-mono text-sm font-medium text-gray-700">
                        #{order.id.slice(-8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-gray-900">{order.clientName}</div>
                          <div className="text-sm text-gray-500">{order.clientEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="truncate">{order.address}</div>
                          {order.complement && (
                            <div className="text-sm text-gray-500 truncate">
                              {order.complement}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{formatDate(order.createdAt)}</div>
                          {order.cancelledAt && (
                            <div className="text-xs text-red-600">
                              Cancelado: {formatDate(order.cancelledAt)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-green-600">
                          R$ {order.budget?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView?.(order.id)}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit?.(order.id)}
                            className="h-8 w-8 p-0 hover:bg-orange-100"
                          >
                            <Edit className="h-4 w-4 text-orange-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('Tem certeza que deseja deletar este pedido?')) {
                                // Implementar deleção
                              }
                            }}
                            className="h-8 w-8 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-mono text-sm text-gray-500 mb-1">
                        #{order.id.slice(-8)}
                      </div>
                      <div className="font-medium text-lg">{order.clientName}</div>
                      <div className="text-sm text-gray-500">{order.clientEmail}</div>
                    </div>
                    {getStatusBadge(order)}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Endereço:</div>
                      <div className="text-sm text-gray-600">{order.address}</div>
                      {order.complement && (
                        <div className="text-sm text-gray-500">{order.complement}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">Criado:</div>
                      <div className="text-sm text-gray-600">{formatDate(order.createdAt)}</div>
                      {order.cancelledAt && (
                        <div className="text-sm text-red-600">
                          Cancelado: {formatDate(order.cancelledAt)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}