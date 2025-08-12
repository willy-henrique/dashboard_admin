"use client"

import { AppShell } from "@/components/layout/app-shell"
import { KPICard } from "@/components/kpi-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceChart } from "@/components/charts/service-chart"
import { FinancialChart } from "@/components/charts/financial-chart"
import { ServiceMap } from "@/components/map/service-map"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">autem.com.br › dashboard</p>
        </div>

        {/* KPI Cards Grid - matching AutEM design exactly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KPICard title="TME do mês" subtitle="" value="41 min." icon="timer" color="blue" />
          <KPICard title="TMC do mês" subtitle="" value="75 min." icon="clock" color="blue" />
          <KPICard title="Percorridos hoje" subtitle="" value="2 km" icon="map" color="blue" />
          <KPICard title="Serviços" subtitle="Cadastrados" value="3" icon="wrench" color="blue" />
          <KPICard title="Serviços" subtitle="Concluídos" value="0" icon="check" color="green" />
          <KPICard title="Serviços" subtitle="Em andamento" value="3" icon="clock" color="orange" />
          <KPICard title="TMC do dia" subtitle="" value="0 min." icon="timer" color="blue" />
          <KPICard title="Jocimar" subtitle="Melhor TMC do mês" value="65 min." icon="trophy" color="blue" />
          <KPICard title="Serviços" subtitle="Deste mês" value="60" icon="calendar" color="blue" />
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <KPICard
            title="Rafael - Pior TMC do mês"
            subtitle=""
            value="93 min."
            icon="user-x"
            color="red"
            className="lg:col-span-1"
          />
          <Card className="bg-blue-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold">R$ 2.013,90</div>
                  <div className="text-blue-100 text-sm mt-2">
                    de serviços do mês (receita hoje R$ 0,00, previsto no mês R$ 5.202,58 e faturado até hoje R$ 0,00)
                  </div>
                </div>
                <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center opacity-50">
                  <div className="w-8 h-8 bg-blue-300 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs">📍</span>
                </div>
                Mapa de Calor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceMap />
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs">💾</span>
                </div>
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FinancialChart />
            </CardContent>
          </Card>
        </div>

        {/* Service Report Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs">📊</span>
              </div>
              Relatório de Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceChart />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity />

        {/* Chat Widget */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-blue-600 text-white p-3 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">A</span>
              </div>
              <div>
                <div className="font-semibold text-sm">No momento estamos com uma lista de...</div>
                <div className="text-xs opacity-75">Ana • Agora</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
