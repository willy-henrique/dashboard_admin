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
  Legend,
} from "recharts"
import { 
  CalendarIcon, 
  Download, 
  TrendingUp, 
  Users, 
  DollarSign, 
  RefreshCw, 
  Loader2,
  AlertCircle,
  FileText,
  CheckCircle2
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState, useMemo } from "react"
import { usePagarmeCharges, usePagarmeOrders, usePagarmeAnalytics } from "@/hooks/use-pagarme"
import { PagarmeService } from "@/lib/services/pagarme-service"
import { cn } from "@/lib/utils"
import { AppShell } from "@/components/layout/app-shell"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  const { 
    charges, 
    loading: chargesLoading, 
    error: chargesError,
    refetch: refetchCharges 
  } = usePagarmeCharges({ autoRefresh: true })
  
  const { 
    orders, 
    loading: ordersLoading, 
    error: ordersError,
    refetch: refetchOrders 
  } = usePagarmeOrders({ autoRefresh: true })
  
  const { 
    analytics, 
    loading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics 
  } = usePagarmeAnalytics(
    dateRange.from.toISOString().split('T')[0],
    dateRange.to.toISOString().split('T')[0]
  )

  const isLoading = chargesLoading || ordersLoading || analyticsLoading
  const hasError = chargesError || ordersError || analyticsError

  // Calcular estatísticas reais
  const stats = useMemo(() => {
    const totalServicos = orders?.length || 0
    const receitaTotal = charges
      ?.filter(c => c.status === 'paid')
      ?.reduce((sum, c) => sum + PagarmeService.fromCents(c.paid_amount || c.amount), 0) || 0
    
    const clientesUnicos = new Set(charges?.map(c => c.customer.id) || []).size
    
    const tempoMedio = analytics?.average_processing_time || 0

    return {
      totalServicos,
      receitaTotal,
      clientesUnicos,
      tempoMedio
    }
  }, [orders, charges, analytics])

  // Dados para gráficos baseados em dados reais
  const chartData = useMemo(() => {
    if (!charges) return []
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date
    })

    return last7Days.map(date => {
      const dayCharges = charges.filter(c => {
        const chargeDate = new Date(c.created_at)
        return chargeDate.toDateString() === date.toDateString() && c.status === 'paid'
      })
      
      return {
        name: format(date, "dd/MM"),
        value: dayCharges.length,
        revenue: dayCharges.reduce((sum, c) => sum + PagarmeService.fromCents(c.paid_amount || c.amount), 0)
      }
    })
  }, [charges])

  // Dados de métodos de pagamento
  const paymentMethodData = useMemo(() => {
    if (!charges) return []
    
    const methods = charges.reduce((acc, charge) => {
      if (charge.status === 'paid') {
        acc[charge.payment_method] = (acc[charge.payment_method] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const colors = {
      pix: "#3b82f6",
      credit_card: "#10b981", 
      debit_card: "#f59e0b",
      boleto: "#ef4444"
    }

    return Object.entries(methods).map(([method, count]) => ({
      name: method.toUpperCase(),
      value: count,
      color: colors[method as keyof typeof colors] || "#8b5cf6"
    }))
  }, [charges])

  const handleRefresh = () => {
    refetchCharges()
    refetchOrders()
    refetchAnalytics()
  }

  const handleExport = () => {
    // TODO: Implementar exportação de relatórios
    console.log('Exportar relatórios')
  }

  const hasData = (charges && charges.length > 0) || (orders && orders.length > 0)

  return (
    <AppShell>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Relatórios e Analytics</h1>
          <p className="text-gray-600 mt-1">Análise de performance e métricas financeiras</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full lg:w-[280px] justify-start text-left font-normal">
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
                onSelect={(range: any) => {
                  if (range?.from && range?.to) {
                    setDateRange(range)
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            {isLoading ? "Atualizando..." : "Atualizar"}
          </Button>
          <Button onClick={handleExport} disabled={!hasData || isLoading}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {hasError && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="font-medium text-orange-900">Erro ao carregar dados</p>
                <p className="text-sm text-orange-700">
                  {chargesError || ordersError || analyticsError || "Ocorreu um erro ao buscar os dados dos relatórios"}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                {isLoading ? (
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalServicos}</p>
                )}
                <p className="text-xs text-gray-500 flex items-center mt-2">
                  <FileText className="h-3 w-3 mr-1" />
                  Pedidos processados
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                {isLoading ? (
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {PagarmeService.formatCurrency(stats.receitaTotal)}
                  </p>
                )}
                <p className="text-xs text-gray-500 flex items-center mt-2">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Pagamentos confirmados
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Clientes Únicos</p>
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.clientesUnicos}</p>
                )}
                <p className="text-xs text-gray-500 flex items-center mt-2">
                  <Users className="h-3 w-3 mr-1" />
                  Clientes ativos
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-2" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {analytics?.success_rate ? `${(analytics.success_rate * 100).toFixed(1)}%` : "N/A"}
                  </p>
                )}
                <p className="text-xs text-gray-500 flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Pagamentos aprovados
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger value="financial" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardHeader>
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 bg-gray-100 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !hasData ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum dado disponível</h3>
                  <p className="text-gray-600 mb-6">
                    Não há dados de pedidos ou receitas no período selecionado.
                  </p>
                  <Button onClick={handleRefresh} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Atualizar dados
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Receita dos Últimos 7 Dias</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData.length === 0 || chartData.every(d => d.revenue === 0) ? (
                    <div className="h-80 flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">Nenhuma receita registrada nos últimos 7 dias</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            formatter={(value: any) => [
                              `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
                              "Receita"
                            ]} 
                          />
                          <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Pedidos por Dia</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData.length === 0 || chartData.every(d => d.value === 0) ? (
                    <div className="h-80 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">Nenhum pedido registrado nos últimos 7 dias</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: "#3b82f6", r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardHeader>
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 bg-gray-100 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !hasData || paymentMethodData.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum dado de performance</h3>
                  <p className="text-gray-600 mb-6">
                    Não há dados de métodos de pagamento no período selecionado.
                  </p>
                  <Button onClick={handleRefresh} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Atualizar dados
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Métodos de Pagamento</CardTitle>
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
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Distribuição por Método</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentMethodData.map((method) => {
                      const maxValue = Math.max(...paymentMethodData.map(m => m.value))
                      return (
                        <div key={method.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: method.color }}></div>
                            <span className="font-medium text-gray-900">{method.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-gray-900">{method.value} transações</span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full mt-2">
                              <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                  backgroundColor: method.color,
                                  width: maxValue > 0 ? `${(method.value / maxValue) * 100}%` : '0%',
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </AppShell>
  )
}