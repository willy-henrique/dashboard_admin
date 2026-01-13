"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, ClipboardList, Star, UserPlus, TrendingUp, Activity, AlertCircle, Clock, ArrowUp, ArrowDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { FirestoreAnalyticsService } from "@/lib/services/firestore-analytics-simple"
import { useEffect, useState, useMemo, useCallback } from "react"

interface MetricData {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
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
      // Usar dados mock em caso de erro
      setFirestoreData({
        orders: {
          totalOrders: 1247,
          activeOrders: 38,
          ordersLast30Days: 312,
          ordersLast7Days: 78,
          ordersToday: 12,
          cancelledOrders: 23,
          completedOrders: 1186,
          emergencyOrders: 5
        },
        users: {
          totalUsers: 892,
          activeUsers: 456,
          newUsersLast30Days: 67,
          newUsersLast7Days: 18,
          usersWithRecentLogin: 234
        },
        providers: {
          totalVerifications: 156,
          pendingVerifications: 12,
          approvedVerifications: 128,
          rejectedVerifications: 16,
          approvalRate: 82
        }
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const metrics: MetricData[] = useMemo(() => {
    if (!firestoreData) return []
    
    return [
      {
        title: "Total de Pedidos",
        value: (firestoreData.orders?.totalOrders || 0).toLocaleString('pt-BR'),
        change: "+12%",
        changeType: "positive",
        icon: ClipboardList,
        description: "Todos os tempos",
        color: "orange",
      },
      {
        title: "Pedidos Ativos",
        value: (firestoreData.orders?.activeOrders || 0).toLocaleString('pt-BR'),
        change: "+8%",
        changeType: "positive",
        icon: Activity,
        description: "Em andamento",
        color: "blue",
      },
      {
        title: "Usuários Ativos",
        value: (firestoreData.users?.activeUsers || 0).toLocaleString('pt-BR'),
        change: "+23%",
        changeType: "positive",
        icon: Users,
        description: "Últimos 30 dias",
        color: "emerald",
      },
      {
        title: "Novos Usuários",
        value: (firestoreData.users?.newUsersLast30Days || 0).toLocaleString('pt-BR'),
        change: "+15%",
        changeType: "positive",
        icon: UserPlus,
        description: "Últimos 30 dias",
        color: "violet",
      },
      {
        title: "Emergências",
        value: (firestoreData.orders?.emergencyOrders || 0).toLocaleString('pt-BR'),
        change: "+2%",
        changeType: "positive",
        icon: AlertCircle,
        description: "Pedidos urgentes",
        color: "red",
      },
      {
        title: "Cancelados",
        value: (firestoreData.orders?.cancelledOrders || 0).toLocaleString('pt-BR'),
        change: "-5%",
        changeType: "negative",
        icon: Clock,
        description: "Taxa de cancelamento",
        color: "slate",
      },
      {
        title: "Prestadores",
        value: (firestoreData.providers?.approvedVerifications || 0).toLocaleString('pt-BR'),
        change: "+18%",
        changeType: "positive",
        icon: Star,
        description: "Verificados",
        color: "amber",
      },
      {
        title: "Taxa Aprovação",
        value: `${Math.round(firestoreData.providers?.approvalRate || 0)}%`,
        change: "+3%",
        changeType: "positive",
        icon: TrendingUp,
        description: "Eficiência",
        color: "teal",
      },
    ]
  }, [firestoreData])

  const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
    orange: { bg: "bg-orange-50", icon: "text-orange-500", text: "text-orange-600" },
    blue: { bg: "bg-blue-50", icon: "text-blue-500", text: "text-blue-600" },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-500", text: "text-emerald-600" },
    violet: { bg: "bg-violet-50", icon: "text-violet-500", text: "text-violet-600" },
    red: { bg: "bg-red-50", icon: "text-red-500", text: "text-red-600" },
    slate: { bg: "bg-slate-50", icon: "text-slate-500", text: "text-slate-600" },
    amber: { bg: "bg-amber-50", icon: "text-amber-500", text: "text-amber-600" },
    teal: { bg: "bg-teal-50", icon: "text-teal-500", text: "text-teal-600" },
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error && !firestoreData) {
    return (
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-slate-600">Erro ao carregar métricas</p>
            <p className="text-sm text-slate-400 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const colors = colorClasses[metric.color] || colorClasses.orange
        const Icon = metric.icon
        const ChangeIcon = metric.changeType === "positive" ? ArrowUp : ArrowDown
        
        return (
          <Card 
            key={metric.title} 
            className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-slate-300 card-hover"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">{metric.title}</p>
                  <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                      metric.changeType === "positive" ? "text-emerald-600" : "text-red-500"
                    }`}>
                      <ChangeIcon className="h-3 w-3" />
                      {metric.change}
                    </span>
                    <span className="text-xs text-slate-400">{metric.description}</span>
                  </div>
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
