"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle,
  Clock,
  ShoppingCart,
  TrendingUp,
  XCircle,
} from "lucide-react"
import { FirestoreAnalyticsService } from "@/lib/services/firestore-analytics-simple"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface OrdersDashboardProps {
  filters?: {
    status?: string
    priority?: string
    serviceCategory?: string
    search?: string
  }
}

interface RealStats {
  total: number
  active: number
  completed: number
  cancelled: number
  urgent: number
  today: number
  last7Days: number
  last30Days: number
}

export function OrdersDashboard(_props: OrdersDashboardProps) {
  const [firestoreData, setFirestoreData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await FirestoreAnalyticsService.getDashboardMetrics()
        setFirestoreData(data)
      } catch (err) {
        console.error('Erro ao buscar dados de pedidos:', err)
        setError('Erro ao carregar dados de pedidos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = useMemo<RealStats>(() => {
    const ordersData = firestoreData?.orders || {}

    return {
      total: ordersData.totalOrders || 0,
      active: ordersData.activeOrders || 0,
      completed: ordersData.completedOrders || 0,
      cancelled: ordersData.cancelledOrders || 0,
      urgent: ordersData.emergencyOrders || 0,
      today: ordersData.ordersToday || 0,
      last7Days: ordersData.ordersLast7Days || 0,
      last30Days: ordersData.ordersLast30Days || 0,
    }
  }, [firestoreData])

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
  const cancellationRate = stats.total > 0 ? (stats.cancelled / stats.total) * 100 : 0

  const statusRows = [
    { label: "Em aberto", value: stats.active, color: "bg-yellow-500" },
    { label: "Concluidos", value: stats.completed, color: "bg-green-500" },
    { label: "Cancelados", value: stats.cancelled, color: "bg-red-500" },
    { label: "Urgentes", value: stats.urgent, color: "bg-orange-500" },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !firestoreData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <XCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Erro ao carregar dados reais de pedidos</p>
            <p className="text-sm text-red-500 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.total}</div>
            <p className="text-sm text-gray-600">Historico completo da colecao orders</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-br from-yellow-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pedidos em Aberto</CardTitle>
            <Clock className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-600 mb-2">{stats.active}</div>
            <p className="text-sm text-gray-600">Pedidos ativos e nao cancelados</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pedidos Concluidos</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.completed}</div>
            <p className="text-sm text-gray-600">Registros com status concluido</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pedidos Cancelados</CardTitle>
            <XCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600 mb-2">{stats.cancelled}</div>
            <p className="text-sm text-gray-600">Cancelados no historico atual</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuicao Atual</CardTitle>
            <CardDescription>Status calculados a partir dos pedidos reais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusRows.map((row) => {
              const width = stats.total > 0 ? (row.value / stats.total) * 100 : 0

              return (
                <div key={row.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{row.label}</span>
                    <span className="text-sm text-gray-500">{row.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${row.color} h-2 rounded-full`} style={{ width: `${width}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Janela Recente</CardTitle>
            <CardDescription>Volumes observados nas datas reais de criacao</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Hoje</p>
                <p className="text-xs text-gray-500">Pedidos criados hoje</p>
              </div>
              <Badge variant="outline">{stats.today}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Ultimos 7 dias</p>
                <p className="text-xs text-gray-500">Pedidos criados na semana</p>
              </div>
              <Badge variant="outline">{stats.last7Days}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Ultimos 30 dias</p>
                <p className="text-xs text-gray-500">Pedidos criados no mes</p>
              </div>
              <Badge variant="outline">{stats.last30Days}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Pedidos urgentes</p>
                <p className="text-xs text-gray-500">Marcados como emergencia</p>
              </div>
              <Badge variant="outline">{stats.urgent}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <TrendingUp className="h-5 w-5" />
            <span>Indicadores Reais</span>
          </CardTitle>
          <CardDescription className="text-orange-700">
            Taxas calculadas apenas com os dados disponiveis no Firestore
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-orange-200 bg-white p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{completionRate.toFixed(1)}%</div>
            <p className="text-sm font-medium text-gray-700">Taxa de Conclusao</p>
            <p className="text-xs text-gray-500">Pedidos concluidos sobre o total</p>
          </div>
          <div className="rounded-lg border border-orange-200 bg-white p-6 text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">{cancellationRate.toFixed(1)}%</div>
            <p className="text-sm font-medium text-gray-700">Taxa de Cancelamento</p>
            <p className="text-xs text-gray-500">Pedidos cancelados sobre o total</p>
          </div>
          <div className="rounded-lg border border-orange-200 bg-white p-6 text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">{stats.last30Days}</div>
            <p className="text-sm font-medium text-gray-700">Pedidos nos Ultimos 30 Dias</p>
            <p className="text-xs text-gray-500">Volume recente sem extrapolacao artificial</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
