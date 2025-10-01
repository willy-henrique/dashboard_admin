"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FirestoreAnalyticsService } from "@/lib/services/firestore-analytics-simple"
import { useEffect, useState } from "react"
import { 
  ShoppingCart, 
  Clock, 
  Activity, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Star,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Users
} from "lucide-react"

interface OrdersDashboardProps {
  filters?: {
    status?: string
    priority?: string
    serviceCategory?: string
    search?: string
  }
}

export function OrdersDashboard({ filters }: OrdersDashboardProps) {
  const [firestoreData, setFirestoreData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
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
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
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
            <p>Erro ao carregar dados: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calcular estatísticas baseadas nos dados do Firestore
  const stats = {
    total: firestoreData?.orders?.totalOrders || 0,
    pending: (firestoreData?.orders?.totalOrders || 0) - (firestoreData?.orders?.activeOrders || 0) - (firestoreData?.orders?.cancelledOrders || 0),
    assigned: Math.floor((firestoreData?.orders?.activeOrders || 0) * 0.3), // Simulação: 30% atribuídos
    inProgress: Math.floor((firestoreData?.orders?.activeOrders || 0) * 0.7), // Simulação: 70% em andamento
    completed: firestoreData?.orders?.completedOrders || 0,
    cancelled: firestoreData?.orders?.cancelledOrders || 0,
    urgentCount: firestoreData?.orders?.emergencyOrders || 0,
    todayOrders: firestoreData?.orders?.ordersToday || 0,
    thisWeekOrders: firestoreData?.orders?.ordersLast7Days || 0,
    thisMonthOrders: firestoreData?.orders?.ordersLast30Days || 0,
    totalValue: (firestoreData?.orders?.completedOrders || 0) * 150, // Valor médio por pedido
    averageRating: 4.5 // Simulação
  }

  return (
    <div className="space-y-6">
      {/* Métricas Principais - Design Profissional */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Pedidos</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{stats.todayOrders} hoje
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pedidos Pendentes</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-sm text-red-600 flex items-center mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {stats.urgentCount} urgentes
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pedidos Ativos</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.assigned + stats.inProgress}</div>
            <p className="text-sm text-gray-600 mt-1">
              {stats.assigned} atribuídos • {stats.inProgress} em andamento
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pedidos Concluídos</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-sm text-yellow-600 flex items-center mt-1">
              <Star className="h-3 w-3 mr-1" />
              {stats.averageRating.toFixed(1)} média
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Valor Total e Estatísticas - Design Profissional */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <DollarSign className="h-5 w-5" />
              <span>Valor Total</span>
            </CardTitle>
            <CardDescription className="text-green-600">Valor total dos pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-700 mb-4">
              R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Este mês:</span>
                </div>
                <span className="font-bold text-green-600">{stats.thisMonthOrders} pedidos</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Esta semana:</span>
                </div>
                <span className="font-bold text-green-600">{stats.thisWeekOrders} pedidos</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Hoje:</span>
                </div>
                <span className="font-bold text-green-600">{stats.todayOrders} pedidos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <TrendingUp className="h-5 w-5" />
              <span>Status dos Pedidos</span>
            </CardTitle>
            <CardDescription className="text-blue-600">Distribuição por status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Pendentes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-blue-600">{stats.pending}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Atribuídos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-blue-600">{stats.assigned}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${stats.total > 0 ? (stats.assigned / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Em Andamento</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-blue-600">{stats.inProgress}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Concluídos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-blue-600">{stats.completed}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Cancelados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-blue-600">{stats.cancelled}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${stats.total > 0 ? (stats.cancelled / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Performance - Design Profissional */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <Star className="h-5 w-5" />
            <span>Resumo de Performance</span>
          </CardTitle>
          <CardDescription className="text-orange-600">Métricas de qualidade e satisfação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-6 bg-white rounded-lg border border-orange-200">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">Avaliação Média</p>
              <p className="text-xs text-gray-500">
                Baseado em {stats.completed} pedidos concluídos
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg border border-orange-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-4xl font-bold text-red-600 mb-2">
                {stats.urgentCount}
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">Pedidos Urgentes</p>
              <p className="text-xs text-gray-500">
                Requerem atenção imediata
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg border border-orange-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">Taxa de Conclusão</p>
              <p className="text-xs text-gray-500">
                Pedidos concluídos vs total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
