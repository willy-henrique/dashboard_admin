"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  Settings,
  Navigation,
} from "lucide-react"
import { ProvidersMap } from "@/components/map/providers-map"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
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
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-gray-700">
            Visão geral do sistema de prestação de serviços
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-orange-500 text-orange-600 hover:bg-orange-50 font-medium px-4 py-2"
            aria-label="Ver relatórios detalhados"
            onClick={handleViewReports}
          >
            <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
            Ver Relatórios
          </Button>
          <Button 
            size="sm" 
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2"
            aria-label="Abrir configurações do sistema"
            onClick={handleSettings}
          >
            <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
            Configurações
          </Button>
        </div>
      </header>

      {/* Tabs para diferentes visualizações */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 font-medium text-base py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Navigation className="h-5 w-5" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 font-medium text-base py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Settings className="h-5 w-5" />
            Analytics Detalhado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Mapa de Rastreamento em Tempo Real */}
          <section aria-labelledby="tracking-title">
            <Card className="bg-white border-2 border-gray-200 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle id="tracking-title" className="flex items-center space-x-3 text-2xl font-bold text-gray-900">
                  <Navigation className="h-6 w-6 text-orange-500" aria-hidden="true" />
                  <span>Rastreamento em Tempo Real</span>
                </CardTitle>
                <p className="text-lg text-gray-700 mt-2">
                  Localização atual dos prestadores de serviço ativos
                </p>
              </CardHeader>
              <CardContent>
                <div 
                  className="h-80 sm:h-96 md:h-[28rem] rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center" 
                  role="application"
                  aria-label="Mapa de rastreamento dos prestadores de serviço"
                >
                  <ProvidersMap />
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}