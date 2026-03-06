"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  ShieldAlert,
} from "lucide-react"
import { useOrders } from "@/hooks/use-orders"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

type EmergencyFilter = "all" | "emergency" | "standard"

interface OrdersTableProps {
  filters?: {
    status?: string
    isEmergency?: boolean
    searchTerm?: string
  }
  onView?: (orderId: string) => void
  onEdit?: (orderId: string) => void
}

const STATUS_OPTIONS = [
  { value: "all", label: "Todos os status" },
  { value: "pending", label: "Pendentes" },
  { value: "assigned", label: "Atribuidos" },
  { value: "in_progress", label: "Em andamento" },
  { value: "completed", label: "Concluidos" },
  { value: "cancelled", label: "Cancelados" },
]

function toDate(value: any): Date | null {
  if (!value) {
    return null
  }

  if (value instanceof Date) {
    return value
  }

  if (typeof value?.toDate === "function") {
    const date = value.toDate()
    return date instanceof Date ? date : null
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function getStatusBadge(order: any) {
  if (order.cancelledAt || order.status === "cancelled") {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Cancelado
      </Badge>
    )
  }

  if (order.status === "completed") {
    return (
      <Badge variant="default" className="flex items-center gap-1 bg-green-600">
        <CheckCircle className="h-3 w-3" />
        Concluido
      </Badge>
    )
  }

  if (order.status === "assigned") {
    return (
      <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800">
        <Clock className="h-3 w-3" />
        Atribuido
      </Badge>
    )
  }

  if (order.isEmergency) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1 bg-red-600">
        <ShieldAlert className="h-3 w-3" />
        Emergencia
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <Clock className="h-3 w-3" />
      Em andamento
    </Badge>
  )
}

function formatRelativeDate(value: any) {
  const date = toDate(value)
  if (!date) {
    return "N/A"
  }

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: ptBR,
  })
}

function getOrderAmount(order: any): number | null {
  const candidates = [order.budget, order.valor, order.amount, order.total]
  const amount = candidates.find((candidate) => typeof candidate === "number" && Number.isFinite(candidate))
  return typeof amount === "number" ? amount : null
}

function getServiceLabel(order: any): string {
  return order.serviceCategory || order.serviceName || order.serviceType || order.description || "Servico nao informado"
}

function getAddressLabel(order: any): string {
  return order.location || order.address || order.serviceAddress || [order.city, order.state].filter(Boolean).join(" - ") || "Endereco nao informado"
}

export function OrdersTable({ filters, onView }: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState(filters?.searchTerm || "")
  const [statusFilter, setStatusFilter] = useState(filters?.status || "all")
  const [emergencyFilter, setEmergencyFilter] = useState<EmergencyFilter>(
    filters?.isEmergency === true ? "emergency" : filters?.isEmergency === false ? "standard" : "all"
  )

  const activeFilters = useMemo(
    () => ({
      status: statusFilter === "all" ? undefined : statusFilter,
      isEmergency:
        emergencyFilter === "all"
          ? undefined
          : emergencyFilter === "emergency",
      searchTerm: searchTerm.trim() || undefined,
    }),
    [emergencyFilter, searchTerm, statusFilter]
  )

  const { orders, loading, error, refetch } = useOrders(activeFilters)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded bg-gray-100 animate-pulse" />
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
          <div className="py-8 text-center">
            <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-500" />
            <p className="text-red-600">Erro ao carregar pedidos: {error}</p>
            <Button onClick={refetch} className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Todos os pedidos</CardTitle>
            <p className="mt-1 text-sm text-gray-600">{orders.length} pedido(s) encontrados com os filtros atuais</p>
          </div>

          <div className="grid w-full gap-3 lg:w-auto lg:grid-cols-[minmax(280px,1fr)_220px_220px]">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por cliente, email, endereco ou servico"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="bg-white pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={emergencyFilter} onValueChange={(value) => setEmergencyFilter(value as EmergencyFilter)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="emergency">Apenas emergencias</SelectItem>
                <SelectItem value="standard">Apenas comuns</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhum pedido encontrado</h3>
            <p className="text-gray-500">Ajuste os filtros para ampliar a busca</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Cliente</TableHead>
                    <TableHead className="font-semibold text-gray-700">Servico</TableHead>
                    <TableHead className="font-semibold text-gray-700">Endereco</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Data</TableHead>
                    <TableHead className="font-semibold text-gray-700">Valor</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Acao</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any, index) => {
                    const amount = getOrderAmount(order)

                    return (
                      <TableRow
                        key={order.id}
                        className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                      >
                        <TableCell className="font-mono text-sm font-medium text-gray-700">
                          #{String(order.id).slice(-8)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-gray-900">{order.clientName || "Cliente nao informado"}</div>
                            <div className="text-sm text-gray-500">{order.clientEmail || "Sem email"}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="truncate font-medium text-gray-900">{getServiceLabel(order)}</div>
                            {order.description && order.description !== getServiceLabel(order) ? (
                              <div className="truncate text-sm text-gray-500">{order.description}</div>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs text-sm text-gray-700">
                            <div className="flex items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                              <span className="truncate">{getAddressLabel(order)}</span>
                            </div>
                            {order.complement ? <div className="truncate pl-6 text-gray-500">{order.complement}</div> : null}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{formatRelativeDate(order.createdAt)}</div>
                            {order.cancelledAt ? (
                              <div className="text-xs text-red-600">Cancelado {formatRelativeDate(order.cancelledAt)}</div>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-green-600">
                            {amount === null
                              ? "N/A"
                              : `R$ ${amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView?.(order.id)}
                            className="h-8 gap-2 px-3 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-4 p-4 lg:hidden">
              {orders.map((order: any) => {
                const amount = getOrderAmount(order)

                return (
                  <Card key={order.id} className="p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 font-mono text-sm text-gray-500">#{String(order.id).slice(-8)}</div>
                        <div className="truncate text-lg font-medium">{order.clientName || "Cliente nao informado"}</div>
                        <div className="truncate text-sm text-gray-500">{order.clientEmail || "Sem email"}</div>
                      </div>
                      {getStatusBadge(order)}
                    </div>

                    <div className="mb-4 space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-700">Servico</div>
                        <div className="text-sm text-gray-600">{getServiceLabel(order)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Endereco</div>
                        <div className="text-sm text-gray-600">{getAddressLabel(order)}</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <div className="font-medium text-gray-700">Criado</div>
                          <div className="text-gray-600">{formatRelativeDate(order.createdAt)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-700">Valor</div>
                          <div className="text-green-600">
                            {amount === null
                              ? "N/A"
                              : `R$ ${amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full" onClick={() => onView?.(order.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalhes
                    </Button>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
