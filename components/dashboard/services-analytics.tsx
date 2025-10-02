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
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalServices}</div>
            <p className="text-xs text-muted-foreground">
              Todos os pedidos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviços Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analytics.activeServices}</div>
            <p className="text-xs text-muted-foreground">
              Em andamento ou aceitos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.completedServices}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalServices > 0 ? Math.round((analytics.completedServices / analytics.totalServices) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{analytics.pendingServices}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Financeiras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {analytics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              De todos os serviços concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {analytics.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {analytics.averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado em {analytics.completedServices} avaliações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status dos Serviços */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status dos Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.servicesByStatus.map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        status.status === 'completed' ? 'default' :
                        status.status === 'in_progress' ? 'secondary' :
                        status.status === 'cancelled' ? 'destructive' :
                        'outline'
                      }
                      className="capitalize"
                    >
                      {status.status === 'completed' ? 'Concluído' :
                       status.status === 'in_progress' ? 'Em Andamento' :
                       status.status === 'cancelled' ? 'Cancelado' :
                       status.status === 'pending' ? 'Pendente' :
                       status.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{status.count}</div>
                    <div className="text-xs text-gray-500">{status.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topServices.slice(0, 5).map((service, index) => (
                <div key={service.serviceType} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium capitalize">{service.serviceType}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{service.count} serviços</div>
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
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Serviços de Emergência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{analytics.emergencyServices}</div>
            <p className="text-sm text-red-700 mt-1">
              Requerem atenção imediata
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
