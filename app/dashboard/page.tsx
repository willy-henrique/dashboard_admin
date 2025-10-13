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
import { ServicesAnalytics } from "@/components/dashboard/services-analytics"
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
      <header className="mb-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Visão geral do sistema de prestação de serviços
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-orange-500 text-orange-600 hover:bg-orange-50"
              onClick={handleViewReports}
            >
              <Eye className="h-4 w-4 mr-2" />
              Relatórios
            </Button>
            <Button 
              size="sm" 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSettings}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs para diferentes visualizações */}
      <div className="container mx-auto px-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto flex gap-2">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 font-medium py-3 whitespace-nowrap data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Navigation className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 font-medium py-3 whitespace-nowrap data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4" />
            Analytics Detalhado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Métricas Principais */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Métricas Principais</h2>
            <DashboardMetrics />
          </section>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Análise de Serviços - Ocupa 2 colunas */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Análise de Serviços</h2>
              <ServicesAnalytics />
            </div>

            {/* Atividades Recentes - Ocupa 1 coluna */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Atividades Recentes</h2>
              <Card className="h-fit">
                <CardContent className="p-6">
                  <RecentActivity />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mapa de Rastreamento */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rastreamento em Tempo Real</h2>
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Localização dos Prestadores</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Acompanhe a localização em tempo real
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-orange-50"
                    aria-label="Atualizar localizações"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[50vh] max-h-[480px] sm:h-96 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <ProvidersMap />
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
