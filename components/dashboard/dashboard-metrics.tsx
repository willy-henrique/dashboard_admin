"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ClipboardList, DollarSign, Star, UserPlus, TrendingUp, BarChart3, FileText, Activity, AlertCircle } from "lucide-react"
import { useFirebaseAnalytics } from "@/hooks/use-firebase-analytics"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardMetrics() {
  const { analyticsData, loading, error } = useFirebaseAnalytics()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
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
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Erro ao carregar métricas: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const metrics = [
    {
      title: "Usuários Ativos",
      value: analyticsData.activeUsers.toLocaleString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      description: "Últimos 30 dias",
    },
    {
      title: "Visualizações de Página",
      value: analyticsData.pageViews.toLocaleString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: BarChart3,
      description: "vs período anterior",
    },
    {
      title: "Ações de Usuário",
      value: analyticsData.userActions.toLocaleString(),
      change: "+23%",
      changeType: "positive" as const,
      icon: Activity,
      description: "Este mês",
    },
    {
      title: "Eventos de Negócio",
      value: analyticsData.businessEvents.toLocaleString(),
      change: "+0.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "Últimos 7 dias",
    },
    {
      title: "Ações Financeiras",
      value: analyticsData.financialActions.toLocaleString(),
      change: "-5%",
      changeType: "negative" as const,
      icon: DollarSign,
      description: "Transações processadas",
    },
    {
      title: "Relatórios Gerados",
      value: analyticsData.reportsGenerated.toLocaleString(),
      change: "+4%",
      changeType: "positive" as const,
      icon: FileText,
      description: "Últimas 24h",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className="bg-card border border-gray-200 shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-lg font-bold">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <metric.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>{metric.title}</span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
            <div className="flex items-center space-x-2 text-sm">
              <span className={`font-medium ${metric.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                {metric.change}
              </span>
              <span className="text-gray-500">{metric.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
