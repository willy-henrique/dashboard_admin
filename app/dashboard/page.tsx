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
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Visão geral do sistema de prestação de serviços
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-orange-400 text-orange-600 hover:bg-orange-50"
            aria-label="Ver relatórios detalhados"
            onClick={handleViewReports}
          >
            <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
            Ver Relatórios
          </Button>
          <Button 
            size="sm" 
            className="bg-orange-400 hover:bg-orange-500 text-white"
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Analytics Detalhado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Mapa de Rastreamento em Tempo Real */}
          <section aria-labelledby="tracking-title">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle id="tracking-title" className="flex items-center space-x-2 text-gray-900">
                  <Navigation className="h-5 w-5 text-orange-400" aria-hidden="true" />
                  <span>Rastreamento em Tempo Real</span>
                </CardTitle>
                <p className="text-gray-600">
                  Localização atual dos prestadores de serviço ativos
                </p>
              </CardHeader>
              <CardContent>
                <div 
                  className="h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center" 
                  role="application"
                  aria-label="Mapa de rastreamento dos prestadores de serviço"
                >
                  <ProvidersMap />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Segundo Card de Rastreamento */}
          <section aria-labelledby="tracking-title-2">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle id="tracking-title-2" className="flex items-center space-x-2 text-gray-900">
                      <MapPin className="h-5 w-5 text-orange-400" aria-hidden="true" />
                      <span>Rastreamento em Tempo Real</span>
                    </CardTitle>
                    <p className="text-gray-600">
                      Localização atual dos prestadores de serviço ativos
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-orange-400 hover:bg-orange-500 text-white p-2"
                    aria-label="Atualizar localizações"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center" 
                  role="application"
                  aria-label="Mapa de rastreamento dos prestadores de serviço"
                >
                  <div className="text-center text-gray-500">
                    <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
                    <p>Atualizando localizações...</p>
                  </div>
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