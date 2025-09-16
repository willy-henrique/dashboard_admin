"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  DollarSign,
  ShoppingCart,
  BarChart3,
  CheckCircle,
  Eye,
  Settings,
  TrendingUp,
  UserCheck,
  MessageSquare,
  MapPin,
  Clock,
  Navigation,
  Wifi,
  Battery,
  Star,
  Activity,
} from "lucide-react"
import { ProvidersMap } from "@/components/map/providers-map"
import { ProviderStatusCard } from "@/components/dashboard/provider-status-card"
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

  const handleManageUsers = () => {
    trackUserAction('gerenciar_usuarios', 'dashboard')
  }

  const handleViewFinancialReports = () => {
    trackUserAction('ver_relatorios_financeiros', 'dashboard')
  }

  const handleViewOrders = () => {
    trackUserAction('ver_pedidos', 'dashboard')
  }

  return (
    <div className="w-full" role="main" aria-label="Dashboard principal">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Visão geral do sistema de prestação de serviços
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)'
            }}
            aria-label="Ver relatórios detalhados"
            onClick={handleViewReports}
          >
            <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
            Ver Relatórios
          </Button>
          <Button 
            size="sm" 
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)'
            }}
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
            <Activity className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics Detalhado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Mapa de Rastreamento em Tempo Real */}
          <section aria-labelledby="tracking-title">
            <Card style={{
              backgroundColor: 'var(--card)',
              color: 'var(--card-foreground)',
              borderColor: 'var(--border)'
            }}>
              <CardHeader>
                <CardTitle id="tracking-title" className="flex items-center space-x-2">
                  <Navigation className="h-5 w-5" style={{ color: 'var(--primary)' }} aria-hidden="true" />
                  <span>Rastreamento em Tempo Real</span>
                </CardTitle>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  Localização atual dos prestadores de serviço ativos
                </p>
              </CardHeader>
              <CardContent>
                <div 
                  className="h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border" 
                  style={{ borderColor: 'var(--border)' }}
                  role="application"
                  aria-label="Mapa de rastreamento dos prestadores de serviço"
                >
                  <ProvidersMap />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Status dos Prestadores */}
          <section aria-labelledby="provider-status-title">
            <ProviderStatusCard />
          </section>

      {/* Cards Principais */}
      <section aria-labelledby="main-metrics-title">
        <h2 id="main-metrics-title" className="sr-only">Métricas principais do sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Usuários */}
          <Card className="hover:shadow-lg transition-shadow" style={{
            backgroundColor: 'var(--card)',
            color: 'var(--card-foreground)',
            borderColor: 'var(--border)'
          }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>2,847</div>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                +156 este mês
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--foreground)' }}>Clientes Ativos</span>
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>1,623</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--foreground)' }}>Prestadores</span>
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>1,224</span>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                size="sm" 
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)'
                }}
                aria-label="Gerenciar usuários do sistema"
                onClick={handleManageUsers}
              >
                Gerenciar Usuários
              </Button>
            </CardContent>
          </Card>

          {/* Financeiro */}
          <Card className="hover:shadow-lg transition-shadow" style={{
            backgroundColor: 'var(--card)',
            color: 'var(--card-foreground)',
            borderColor: 'var(--border)'
          }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Financeiro</CardTitle>
              <DollarSign className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>R$ 45.230</div>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                +12% vs mês anterior
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--foreground)' }}>Receitas</span>
                  <span className="font-medium" style={{ color: '#10b981' }}>R$ 45.230</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--foreground)' }}>Despesas</span>
                  <span className="font-medium" style={{ color: '#ef4444' }}>R$ 12.450</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--foreground)' }}>Lucro</span>
                  <span className="font-medium" style={{ color: '#3b82f6' }}>R$ 32.780</span>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                size="sm" 
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)'
                }}
                aria-label="Ver relatórios financeiros"
                onClick={handleViewFinancialReports}
              >
                Ver Relatórios
              </Button>
            </CardContent>
          </Card>

          {/* Pedidos */}
          <Card className="hover:shadow-lg transition-shadow" style={{
            backgroundColor: 'var(--card)',
            color: 'var(--card-foreground)',
            borderColor: 'var(--border)'
          }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>1,234</div>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                +89 este mês
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--foreground)' }}>Pendentes</span>
                  <span className="font-medium" style={{ color: '#f59e0b' }}>45</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--foreground)' }}>Em Andamento</span>
                  <span className="font-medium" style={{ color: '#3b82f6' }}>123</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--foreground)' }}>Concluídos</span>
                  <span className="font-medium" style={{ color: '#10b981' }}>1,066</span>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                size="sm" 
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)'
                }}
                aria-label="Ver todos os pedidos"
                onClick={handleViewOrders}
              >
                Ver Pedidos
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Métricas Detalhadas */}
      <section aria-labelledby="detailed-metrics-title">
        <h2 id="detailed-metrics-title" className="sr-only">Métricas detalhadas do sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Prestadores Ativos</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>1,224</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Serviços Concluídos</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>1,066</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Tempo Médio</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>24min</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-purple-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Avaliação Média</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>4.8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gráficos e Relatórios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Novo pedido criado</p>
                  <p className="text-xs text-gray-500">Pedido #1234 - Limpeza residencial</p>
                </div>
                <span className="text-xs text-gray-500">2min atrás</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Prestador verificado</p>
                  <p className="text-xs text-gray-500">João Silva foi aprovado</p>
                </div>
                <span className="text-xs text-gray-500">15min atrás</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Serviço concluído</p>
                  <p className="text-xs text-gray-500">Pedido #1233 - Manutenção elétrica</p>
                </div>
                <span className="text-xs text-gray-500">1h atrás</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Relatório de Performance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Análise de Receita
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Relatório de Usuários
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Satisfação do Cliente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
