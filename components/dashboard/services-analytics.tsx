"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useServicesAnalytics } from "@/hooks/use-services-analytics"
import { 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Star, 
  DollarSign,
  TrendingUp,
  Activity
} from "lucide-react"

export function ServicesAnalytics() {
  const { analytics, loading, error } = useServicesAnalytics()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600 font-medium">Erro ao carregar analytics</p>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Métricas Principais - Grid 4 colunas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalServices}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">{analytics.completedServices}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.activeServices}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{analytics.pendingServices}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Financeiras - Grid 3 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-xl font-bold text-gray-900">
                  R$ {analytics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                <p className="text-xl font-bold text-gray-900">
                  R$ {analytics.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-100">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.round(analytics.averageRating)} ⭐
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status e Top Serviços - Grid 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Status dos Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.servicesByStatus.map((status) => (
                <div key={status.status} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={
                        status.status === 'completed' ? 'default' :
                        status.status === 'in_progress' ? 'secondary' :
                        status.status === 'cancelled' ? 'destructive' :
                        'outline'
                      }
                      className="text-xs"
                    >
                      {status.status === 'completed' ? 'Concluído' :
                       status.status === 'in_progress' ? 'Em Andamento' :
                       status.status === 'cancelled' ? 'Cancelado' :
                       status.status === 'pending' ? 'Pendente' :
                       status.status === 'accepted' ? 'Aceito' :
                       status.status === 'assigned' ? 'Atribuído' :
                       status.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{status.count}</div>
                    <div className="text-xs text-gray-500">{Math.round(status.percentage)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Top Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topServices.slice(0, 5).map((service, index) => (
                <div key={service.serviceType} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-sm capitalize">
                      {service.serviceType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{service.count}</div>
                    <div className="text-xs text-gray-500">
                      R$ {service.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Serviços de Emergência */}
      {analytics.emergencyServices > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-700">Serviços de Emergência</p>
                <p className="text-2xl font-bold text-red-600">{analytics.emergencyServices}</p>
                <p className="text-xs text-red-600 mt-1">Requerem atenção imediata</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
