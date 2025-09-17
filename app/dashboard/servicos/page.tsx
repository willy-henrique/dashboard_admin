"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ClipboardList, 
  Truck, 
  Eye, 
  Calculator, 
  Plus,
  Calendar,
  MapPin,
  Users,
  Clock,
  TrendingUp,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useAnalytics } from "@/hooks/use-analytics"
import { FirestoreAnalyticsService } from "@/lib/services/firestore-analytics-simple"
import { useEffect, useState } from "react"

export default function ServicosPage() {
  const [firestoreData, setFirestoreData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { trackPageView, trackUserAction } = useAnalytics()

  useEffect(() => {
    trackPageView('Página de Serviços')
  }, [trackPageView])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await FirestoreAnalyticsService.getDashboardMetrics()
        setFirestoreData(data)
      } catch (err) {
        console.error('Erro ao buscar dados de serviços:', err)
        setError('Erro ao carregar dados de serviços')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleNewService = () => {
    trackUserAction('novo_servico', 'servicos')
  }

  const handleRefresh = () => {
    trackUserAction('atualizar_servicos', 'servicos')
    // Refetch data
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await FirestoreAnalyticsService.getDashboardMetrics()
        setFirestoreData(data)
      } catch (err) {
        console.error('Erro ao buscar dados de serviços:', err)
        setError('Erro ao carregar dados de serviços')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }

  // Calcular estatísticas baseadas nos dados do Firestore
  const stats = firestoreData ? {
    total: firestoreData.orders.totalOrders,
    pendentes: firestoreData.orders.totalOrders - firestoreData.orders.activeOrders - firestoreData.orders.cancelledOrders,
    emAndamento: firestoreData.orders.activeOrders,
    concluidos: firestoreData.orders.completedOrders || 0,
    orcamentos: Math.floor(firestoreData.orders.totalOrders * 0.3), // Simulação: 30% são orçamentos
    agendados: firestoreData.orders.ordersToday,
    aguardando: Math.floor(firestoreData.orders.totalOrders * 0.1), // Simulação: 10% aguardando
    aceitos: Math.floor(firestoreData.orders.totalOrders * 0.2) // Simulação: 20% aceitos
  } : {
    total: 0,
    pendentes: 0,
    emAndamento: 0,
    concluidos: 0,
    orcamentos: 0,
    agendados: 0,
    aguardando: 0,
    aceitos: 0
  }

  return (
    <main className="flex-1 space-y-6 p-6" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Serviços</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerenciamento completo de serviços e logística
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </Button>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleNewService}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Erro ao carregar serviços: {error}</p>
              <Button onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ClipboardList className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total de Serviços</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pendentes</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pendentes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Em Andamento</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.emAndamento}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Concluídos</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.concluidos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calculator className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Orçamentos</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.orcamentos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Módulos de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Painel Logístico */}
        <Link href="/dashboard/servicos/painel-logistico">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">Painel Logístico</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Rastreamento em tempo real</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Agendamentos Hoje</span>
                  <Badge variant="secondary">{stats.agendados}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Em Trânsito</span>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">{stats.emAndamento}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Concluídos</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">{stats.concluidos}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Visualizar Serviços */}
        <Link href="/dashboard/servicos/visualizar">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">Visualizar</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Lista completa de serviços</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total de Registros</span>
                  <Badge variant="secondary">{stats.total}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Última Atualização</span>
                  <span className="text-xs text-slate-500">
                    {loading ? 'Carregando...' : 'Agora'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Status Ativos</span>
                  <Badge variant="outline">{Object.keys(stats).filter(key => key !== 'total' && stats[key as keyof typeof stats] > 0).length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Orçamento */}
        <Link href="/dashboard/servicos/orcamento">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <Calculator className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">Orçamento</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Gestão de orçamentos</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Orçamentos Ativos</span>
                  <Badge variant="secondary">{stats.orcamentos}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Aguardando Aprovação</span>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">{stats.aguardando}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Aceitos</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">{stats.aceitos}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Ações Rápidas */}
      <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
        <CardHeader>
          <CardTitle className="text-lg text-slate-900 dark:text-white">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Plus className="h-5 w-5" />
              <span className="text-sm">Novo Serviço</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Agendar</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm">Rastrear</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">Equipe</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
