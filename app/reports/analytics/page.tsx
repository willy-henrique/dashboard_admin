"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
} from "recharts"
import { CalendarIcon, Download, TrendingUp, Users, DollarSign, RefreshCw, Activity, CreditCard, Wallet, Target } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { usePagarmeCharges, usePagarmeOrders, usePagarmeAnalytics } from "@/hooks/use-pagarme"
import { PagarmeService } from "@/lib/services/pagarme-service"
import { AppShell } from "@/components/layout/app-shell"

function AnalyticsPageContent() {
  const searchParams = useSearchParams()
  const initialAnalyticsTab = (() => {
    const tab = searchParams?.get("tab") || "evolution"
    const allowed = new Set(["evolution", "payments", "performance", "insights"])
    return allowed.has(tab) ? tab : "evolution"
  })()
  const [activeTab, setActiveTab] = useState(initialAnalyticsTab)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  const { charges, loading: chargesLoading, refetch: refetchCharges } = usePagarmeCharges({ autoRefresh: true })
  const { orders, loading: ordersLoading, refetch: refetchOrders } = usePagarmeOrders({ autoRefresh: true })
  const { analytics } = usePagarmeAnalytics(
    dateRange.from.toISOString().split('T')[0],
    dateRange.to.toISOString().split('T')[0]
  )

  // Calcular métricas avançadas
  const metrics = useMemo(() => {
    const totalPedidos = orders?.length || 0
    const pedidosPagos = charges?.filter(c => c.status === 'paid').length || 0
    const taxaConversao = totalPedidos > 0 ? (pedidosPagos / totalPedidos) * 100 : 0
    
    const receitaTotal = charges
      ?.filter(c => c.status === 'paid')
      ?.reduce((sum, c) => sum + PagarmeService.fromCents(c.paid_amount || c.amount), 0) || 0
    
    const ticketMedio = pedidosPagos > 0 ? receitaTotal / pedidosPagos : 0
    
    const clientesUnicos = new Set(charges?.map(c => c.customer.id) || []).size
    
    const receitaPorCliente = clientesUnicos > 0 ? receitaTotal / clientesUnicos : 0

    return {
      totalPedidos,
      pedidosPagos,
      taxaConversao,
      receitaTotal,
      ticketMedio,
      clientesUnicos,
      receitaPorCliente
    }
  }, [orders, charges])

  // Dados para gráficos de evolução temporal
  const evolutionData = useMemo(() => {
    if (!charges) return []
    
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date
    })

    return last30Days.map(date => {
      const dayCharges = charges.filter(c => {
        const chargeDate = new Date(c.created_at)
        return chargeDate.toDateString() === date.toDateString()
      })
      
      const pagos = dayCharges.filter(c => c.status === 'paid')
      const pendentes = dayCharges.filter(c => c.status === 'pending')
      const falhados = dayCharges.filter(c => c.status === 'failed')
      
      return {
        name: format(date, "dd/MM"),
        data: date,
        receita: pagos.reduce((sum, c) => sum + PagarmeService.fromCents(c.paid_amount || c.amount), 0),
        pagos: pagos.length,
        pendentes: pendentes.length,
        falhados: falhados.length,
        total: dayCharges.length
      }
    })
  }, [charges])

  // Dados de métodos de pagamento
  const paymentMethodData = useMemo(() => {
    if (!charges) return []
    
    const methods = charges.reduce((acc, charge) => {
      if (charge.status === 'paid') {
        const method = charge.payment_method
        if (!acc[method]) {
          acc[method] = { count: 0, value: 0 }
        }
        acc[method].count += 1
        acc[method].value += PagarmeService.fromCents(charge.paid_amount || charge.amount)
      }
      return acc
    }, {} as Record<string, { count: number; value: number }>)

    const colors = {
      pix: "#3b82f6",
      credit_card: "#10b981", 
      debit_card: "#f59e0b",
      boleto: "#ef4444"
    }

    return Object.entries(methods).map(([method, data]) => ({
      name: method.toUpperCase(),
      count: data.count,
      value: data.value,
      color: colors[method as keyof typeof colors] || "#8b5cf6"
    }))
  }, [charges])

  // Dados de performance por hora
  const hourlyData = useMemo(() => {
    if (!charges) return []
    
    const hours = Array.from({ length: 24 }, (_, i) => i)
    
    return hours.map(hour => {
      const hourCharges = charges.filter(c => {
        const chargeHour = new Date(c.created_at).getHours()
        return chargeHour === hour
      })
      
      return {
        hora: `${hour.toString().padStart(2, '0')}:00`,
        transacoes: hourCharges.length,
        receita: hourCharges
          .filter(c => c.status === 'paid')
          .reduce((sum, c) => sum + PagarmeService.fromCents(c.paid_amount || c.amount), 0)
      }
    })
  }, [charges])

  const handleRefresh = () => {
    refetchCharges()
    refetchOrders()
  }

  return (
    <AppShell>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h1>
          <p className="text-gray-600">Análise avançada de performance e métricas de negócio</p>
        </div>
        <div className="flex items-center space-x-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                  )
                ) : (
                  <span>Selecionar período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-green-600">
                  {metrics.taxaConversao.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">
                  {metrics.pedidosPagos} de {metrics.totalPedidos} pedidos
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-blue-600">
                  {PagarmeService.formatCurrency(metrics.ticketMedio)}
                </p>
                <p className="text-xs text-gray-500">
                  Por transação
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita por Cliente</p>
                <p className="text-2xl font-bold text-purple-600">
                  {PagarmeService.formatCurrency(metrics.receitaPorCliente)}
                </p>
                <p className="text-xs text-gray-500">
                  {metrics.clientesUnicos} clientes únicos
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-orange-600">
                  {PagarmeService.formatCurrency(metrics.receitaTotal)}
                </p>
                <p className="text-xs text-gray-500">
                  Período selecionado
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="evolution">Evolução</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="evolution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução da Receita (30 dias)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={evolutionData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, "Receita"]} />
                      <Area type="monotone" dataKey="receita" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolutionData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="pagos" stroke="#10b981" strokeWidth={2} name="Pagos" />
                      <Line type="monotone" dataKey="pendentes" stroke="#f59e0b" strokeWidth={2} name="Pendentes" />
                      <Line type="monotone" dataKey="falhados" stroke="#ef4444" strokeWidth={2} name="Falhados" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, "Valor"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volume por Método</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethodData.map((method) => (
                    <div key={method.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: method.color }}></div>
                        <div>
                          <span className="font-medium">{method.name}</span>
                          <p className="text-sm text-gray-500">{method.count} transações</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{PagarmeService.formatCurrency(method.value)}</span>
                        <p className="text-sm text-gray-500">
                          {((method.value / metrics.receitaTotal) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance por Hora do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData}>
                      <XAxis dataKey="hora" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="transacoes" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receita por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyData}>
                      <XAxis dataKey="hora" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, "Receita"]} />
                      <Area type="monotone" dataKey="receita" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Insights de Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Melhor Horário</p>
                  <p className="text-lg font-bold text-green-600">
                    {hourlyData.reduce((max, hour) => hour.receita > max.receita ? hour : max, hourlyData[0])?.hora || "N/A"}
                  </p>
                  <p className="text-xs text-green-600">Maior receita</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Método Preferido</p>
                  <p className="text-lg font-bold text-blue-600">
                    {paymentMethodData.reduce((max, method) => method.count > max.count ? method : max, paymentMethodData[0])?.name || "N/A"}
                  </p>
                  <p className="text-xs text-blue-600">Mais utilizado</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Métricas de Crescimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-800">Taxa de Conversão</p>
                  <p className="text-lg font-bold text-purple-600">
                    {metrics.taxaConversao.toFixed(1)}%
                  </p>
                  <p className="text-xs text-purple-600">Pedidos pagos</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm font-medium text-orange-800">Ticket Médio</p>
                  <p className="text-lg font-bold text-orange-600">
                    {PagarmeService.formatCurrency(metrics.ticketMedio)}
                  </p>
                  <p className="text-xs text-orange-600">Por transação</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Análise de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-sm font-medium text-indigo-800">Clientes Únicos</p>
                  <p className="text-lg font-bold text-indigo-600">
                    {metrics.clientesUnicos}
                  </p>
                  <p className="text-xs text-indigo-600">Total de clientes</p>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg">
                  <p className="text-sm font-medium text-pink-800">Receita por Cliente</p>
                  <p className="text-lg font-bold text-pink-600">
                    {PagarmeService.formatCurrency(metrics.receitaPorCliente)}
                  </p>
                  <p className="text-xs text-pink-600">Valor médio</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </AppShell>
  )
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<main className="p-6">Carregando analytics...</main>}>
      <AnalyticsPageContent />
    </Suspense>
  )
}
