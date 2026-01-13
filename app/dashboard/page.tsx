"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  Settings,
  LayoutGrid,
  BarChart3,
  MapPin,
  RefreshCw,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { ProvidersMap } from "@/components/map/providers-map"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ServicesAnalytics } from "@/components/dashboard/services-analytics"
import { useAnalytics } from "@/hooks/use-analytics"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"

export default function DashboardPage() {
  const { trackPageView, trackUserAction } = useAnalytics()
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    trackPageView('Dashboard Principal')
  }, [trackPageView])

  const handleViewReports = useCallback(() => {
    trackUserAction('ver_relatorios', 'dashboard')
  }, [trackUserAction])

  const handleSettings = useCallback(() => {
    trackUserAction('abrir_configuracoes', 'dashboard')
  }, [trackUserAction])

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  // Data atual formatada
  const currentDate = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="w-full animate-fade-in" role="main" aria-label="Dashboard principal">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/20">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="h-4 w-4" />
              <p className="text-sm capitalize">{currentDate}</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/reports">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all"
                onClick={handleViewReports}
              >
                <Eye className="h-4 w-4 mr-2" />
                Relatórios
              </Button>
            </Link>
            <Link href="/dashboard/configuracoes">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 transition-all"
                onClick={handleSettings}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs para diferentes visualizações */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full sm:w-auto bg-white border border-slate-200 p-1.5 rounded-xl mb-6 overflow-x-auto flex gap-1 shadow-sm">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 font-medium px-4 py-2.5 rounded-lg whitespace-nowrap text-slate-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
          >
            <LayoutGrid className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 font-medium px-4 py-2.5 rounded-lg whitespace-nowrap text-slate-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-slide-up">
          {/* Métricas Principais */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Métricas Principais</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefresh}
                className="text-slate-500 hover:text-orange-600 hover:bg-orange-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
            <DashboardMetrics key={refreshKey} />
          </section>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Análise de Serviços - Ocupa 2 colunas */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Análise de Serviços</h2>
              <ServicesAnalytics />
            </div>

            {/* Atividades Recentes - Ocupa 1 coluna */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Atividades Recentes</h2>
              <Card className="h-fit border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <RecentActivity />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mapa de Rastreamento */}
          <section>
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-orange-50/30 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-md shadow-orange-500/20">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Rastreamento em Tempo Real
                      </CardTitle>
                      <p className="text-sm text-slate-500 mt-0.5">
                        Localização dos prestadores ativos
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] sm:h-[450px]">
                  <ProvidersMap />
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="analytics" className="animate-slide-up">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
