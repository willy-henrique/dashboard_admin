"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AlertCircle, ClipboardList, Clock, Star, TrendingUp, UserPlus, Users } from "lucide-react"
import { FirestoreAnalyticsService } from "@/lib/services/firestore-analytics-simple"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface MetricData {
  title: string
  value: string
  icon: typeof ClipboardList
  description: string
  color: string
}

export function DashboardMetrics() {
  const [firestoreData, setFirestoreData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await FirestoreAnalyticsService.getDashboardMetrics()
      setFirestoreData(data)
    } catch (err) {
      console.error('Erro ao buscar dados do Firestore:', err)
      setError('Erro ao carregar dados')
      setFirestoreData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const metrics: MetricData[] = useMemo(() => {
    if (!firestoreData) {
      return []
    }

    return [
      {
        title: "Total de Pedidos",
        value: (firestoreData.orders?.totalOrders || 0).toLocaleString('pt-BR'),
        icon: ClipboardList,
        description: "Todos os pedidos encontrados na colecao orders",
        color: "orange",
      },
      {
        title: "Pedidos em Aberto",
        value: (firestoreData.orders?.activeOrders || 0).toLocaleString('pt-BR'),
        icon: Clock,
        description: "Pedidos ativos no momento",
        color: "blue",
      },
      {
        title: "Usuarios Ativos",
        value: (firestoreData.users?.activeUsers || 0).toLocaleString('pt-BR'),
        icon: Users,
        description: "Cadastros marcados como ativos",
        color: "emerald",
      },
      {
        title: "Novos Usuarios",
        value: (firestoreData.users?.newUsersLast30Days || 0).toLocaleString('pt-BR'),
        icon: UserPlus,
        description: "Criados nos ultimos 30 dias",
        color: "violet",
      },
      {
        title: "Pedidos Urgentes",
        value: (firestoreData.orders?.emergencyOrders || 0).toLocaleString('pt-BR'),
        icon: AlertCircle,
        description: "Marcados como emergencia",
        color: "red",
      },
      {
        title: "Pedidos Cancelados",
        value: (firestoreData.orders?.cancelledOrders || 0).toLocaleString('pt-BR'),
        icon: Clock,
        description: "Cancelados no historico atual",
        color: "slate",
      },
      {
        title: "Prestadores Aprovados",
        value: (firestoreData.providers?.approvedVerifications || 0).toLocaleString('pt-BR'),
        icon: Star,
        description: "Verificacoes aprovadas",
        color: "amber",
      },
      {
        title: "Taxa de Aprovacao",
        value: `${Math.round(firestoreData.providers?.approvalRate || 0)}%`,
        icon: TrendingUp,
        description: "Aprovacoes sobre o total de verificacoes",
        color: "teal",
      },
    ]
  }, [firestoreData])

  const colorClasses: Record<string, { bg: string; icon: string }> = {
    orange: { bg: "bg-orange-50", icon: "text-orange-500" },
    blue: { bg: "bg-blue-50", icon: "text-blue-500" },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-500" },
    violet: { bg: "bg-violet-50", icon: "text-violet-500" },
    red: { bg: "bg-red-50", icon: "text-red-500" },
    slate: { bg: "bg-slate-50", icon: "text-slate-500" },
    amber: { bg: "bg-amber-50", icon: "text-amber-500" },
    teal: { bg: "bg-teal-50", icon: "text-teal-500" },
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !firestoreData) {
    return (
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-slate-600">Erro ao carregar metricas reais</p>
            <p className="text-sm text-slate-400 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const colors = colorClasses[metric.color] || colorClasses.orange
        const Icon = metric.icon

        return (
          <Card key={metric.title} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">{metric.title}</p>
                  <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
                  <p className="text-xs text-slate-400">{metric.description}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${colors.bg}`}>
                  <Icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
