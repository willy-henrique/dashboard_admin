"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  Settings,
  Navigation,
  MapPin,
  RefreshCw,
} from "lucide-react"
import { ProvidersMap } from "@/components/map/providers-map"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { useAnalytics } from "@/hooks/use-analytics"
import { useEffect } from "react"

export default function DashboardPage() {
  const { trackPageView, trackUserAction } = useAnalytics()

  useEffect(() => {
    trackPageView('Dashboard Principal')
  }, [trackPageView])

  const handleViewReports = () => {
    trackUserAction('ver_relatorios', 'dashboard')
  }

  const handleSettings = () => {
    trackUserAction('abrir_configuracoes', 'dashboard')
  }

  return (
    <div className="w-full" role="main" aria-label="Dashboard principal">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700">
            Visão geral do sistema de prestação de serviços
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-orange-500 text-orange-600 hover:bg-orange-50 font-medium px-3 sm:px-4 py-2 w-full sm:w-auto"
            aria-label="Ver relatórios detalhados"
            onClick={handleViewReports}
          >
            <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
            <span className="hidden sm:inline">Ver Relatórios</span>
            <span className="sm:hidden">Relatórios</span>
          </Button>
          <Button 
            size="sm" 
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-3 sm:px-4 py-2 w-full sm:w-auto"
            aria-label="Abrir configurações do sistema"
            onClick={handleSettings}
          >
            <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
            <span className="hidden sm:inline">Configurações</span>
            <span className="sm:hidden">Config</span>
          </Button>
        </div>
      </header>

      {/* Tabs para diferentes visualizações */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-1 sm:gap-2 font-medium text-sm sm:text-base py-2 sm:py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Navigation className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Visão Geral</span>
            <span className="sm:hidden">Geral</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-1 sm:gap-2 font-medium text-sm sm:text-base py-2 sm:py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Analytics Detalhado</span>
            <span className="sm:hidden">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 sm:mt-6 space-y-6 sm:space-y-8">
          {/* Métricas do Dashboard */}
          <section aria-labelledby="metrics-title">
            <h2 id="metrics-title" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Métricas Principais
            </h2>
            <DashboardMetrics />
          </section>

          {/* Mapa de Rastreamento em Tempo Real */}
          <section aria-labelledby="tracking-title">
            <Card className="bg-card border border-gray-200 shadow-sm rounded-2xl">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle id="tracking-title" className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-bold">
                    <span className="inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                    </span>
                    <span>Rastreamento em Tempo Real</span>
                  </CardTitle>
                  <button
                    type="button"
                    className="self-end sm:self-auto inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-orange-100 text-orange-700 shadow-sm hover:bg-orange-200"
                    aria-label="Atualizar localizações"
                  >
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Localização atual dos prestadores de serviço ativos
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div 
                    className="h-64 sm:h-80 md:h-96 lg:h-[28rem] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center" 
                    role="application"
                    aria-label="Mapa de rastreamento dos prestadores de serviço"
                  >
                    <ProvidersMap />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Gráficos e Atividades */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            <section aria-labelledby="charts-title">
              <h2 id="charts-title" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Análise de Serviços
              </h2>
              <DashboardCharts />
            </section>

            <section aria-labelledby="activity-title">
              <h2 id="activity-title" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Atividades Recentes
              </h2>
              <RecentActivity />
            </section>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}