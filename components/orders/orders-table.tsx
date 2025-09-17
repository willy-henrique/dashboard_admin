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
}

export function OrdersTable({ filters }: OrdersTableProps) {
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
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-lg sm:text-xl">Pedidos ({orders.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Filtros</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        {order.id.slice(-8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.clientName}</div>
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
                          <div>Criado: {formatDate(order.createdAt)}</div>
                          {order.cancelledAt && (
                            <div className="text-red-600">
                              Cancelado: {formatDate(order.cancelledAt)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
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