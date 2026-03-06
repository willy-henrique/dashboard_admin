"use client"

import { useEffect, useMemo, useState } from "react"
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
  AreaChart,
  Area,
} from "recharts"
import {
  CalendarIcon,
  Download,
  TrendingUp,
  Users,
  DollarSign,
  RefreshCw,
  AlertCircle,
  FileText,
  CheckCircle2,
  Target,
  Activity,
  CreditCard,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { usePagarmeCharges, usePagarmeOrders, usePagarmeAnalytics } from "@/hooks/use-pagarme"
import { PagarmeService } from "@/lib/services/pagarme-service"
import { cn } from "@/lib/utils"
import { AppShell } from "@/components/layout/app-shell"

const TAB_KEYS = new Set(["overview", "analytics", "performance"])

const LEGACY_TAB_MAP: Record<string, "overview" | "analytics" | "performance"> = {
  financial: "overview",
  payments: "analytics",
  evolution: "analytics",
  insights: "analytics",
  performance: "performance",
}

const paymentMethodColors: Record<string, string> = {
  pix: "#3b82f6",
  credit_card: "#10b981",
  debit_card: "#f59e0b",
  boleto: "#ef4444",
  voucher: "#8b5cf6",
}

const formatCurrency = (value: number) =>
  `R$ ${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const getMethodLabel = (method: string) => {
  if (method === "credit_card") return "Cartão de Crédito"
  if (method === "debit_card") return "Cartão de Débito"
  if (method === "pix") return "PIX"
  if (method === "boleto") return "Boleto"
  if (method === "voucher") return "Voucher"
  return method.toUpperCase()
}

function ChartLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {[1, 2].map((item) => (
        <Card key={item} className="border-0 shadow-sm">
          <CardHeader>
            <div className="h-6 w-44 animate-pulse rounded bg-gray-200" />
          </CardHeader>
          <CardContent>
            <div className="h-80 animate-pulse rounded bg-gray-100" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EmptyDataState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-12">
        <div className="text-center">
          <FileText className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Nenhum dado disponível</h3>
          <p className="mb-6 text-gray-600">Não encontramos dados para o período selecionado.</p>
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar dados
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "performance">("overview")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requestedTab = params.get("tab")

    if (!requestedTab) return

    const mappedTab = LEGACY_TAB_MAP[requestedTab] || requestedTab
    if (TAB_KEYS.has(mappedTab)) {
      setActiveTab(mappedTab as "overview" | "analytics" | "performance")
    }
  }, [])

  const fromDate = dateRange?.from || new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const toDate = dateRange?.to || new Date()

  const {
    charges,
    loading: chargesLoading,
    error: chargesError,
    refetch: refetchCharges,
  } = usePagarmeCharges({ autoRefresh: true })

  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = usePagarmeOrders({ autoRefresh: true })

  const {
    analytics,
    loading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = usePagarmeAnalytics(format(fromDate, "yyyy-MM-dd"), format(toDate, "yyyy-MM-dd"))

  const isLoading = chargesLoading || ordersLoading || analyticsLoading
  const hasError = chargesError || ordersError || analyticsError

  const paidCharges = useMemo(
    () => (charges || []).filter((charge) => charge.status === "paid"),
    [charges]
  )

  const stats = useMemo(() => {
    const totalPedidos = orders?.length || 0
    const totalCobrancas = charges?.length || 0
    const pedidosPagos = paidCharges.length
    const receitaTotal = paidCharges.reduce(
      (sum, charge) => sum + PagarmeService.fromCents(charge.paid_amount || charge.amount),
      0
    )

    const clientesUnicos = new Set((charges || []).map((charge) => charge.customer.id)).size
    const ticketMedio = pedidosPagos > 0 ? receitaTotal / pedidosPagos : 0
    const taxaAprovacao = totalCobrancas > 0 ? (pedidosPagos / totalCobrancas) * 100 : 0

    return {
      totalPedidos,
      totalCobrancas,
      pedidosPagos,
      receitaTotal,
      clientesUnicos,
      ticketMedio,
      taxaAprovacao,
    }
  }, [orders, charges, paidCharges])

  const dailyData = useMemo(() => {
    if (!charges || charges.length === 0) return []

    const last7Days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - (6 - index))
      return date
    })

    return last7Days.map((date) => {
      const dayCharges = charges.filter((charge) => {
        const createdAt = new Date(charge.created_at)
        return createdAt.toDateString() === date.toDateString()
      })

      const paidDayCharges = dayCharges.filter((charge) => charge.status === "paid")

      return {
        label: format(date, "dd/MM"),
        pedidos: dayCharges.length,
        receita: paidDayCharges.reduce(
          (sum, charge) => sum + PagarmeService.fromCents(charge.paid_amount || charge.amount),
          0
        ),
      }
    })
  }, [charges])

  const evolutionData = useMemo(() => {
    if (!charges || charges.length === 0) return []

    const last30Days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - (29 - index))
      return date
    })

    return last30Days.map((date) => {
      const dayCharges = charges.filter((charge) => {
        const createdAt = new Date(charge.created_at)
        return createdAt.toDateString() === date.toDateString()
      })

      const paid = dayCharges.filter((charge) => charge.status === "paid")
      const pending = dayCharges.filter((charge) => charge.status === "pending")
      const failed = dayCharges.filter(
        (charge) => charge.status === "failed" || charge.status === "canceled"
      )

      return {
        label: format(date, "dd/MM"),
        receita: paid.reduce(
          (sum, charge) => sum + PagarmeService.fromCents(charge.paid_amount || charge.amount),
          0
        ),
        paid: paid.length,
        pending: pending.length,
        failed: failed.length,
      }
    })
  }, [charges])

  const paymentMethodData = useMemo(() => {
    if (!paidCharges.length) return []

    const grouped = paidCharges.reduce((accumulator, charge) => {
      const method = charge.payment_method
      if (!accumulator[method]) {
        accumulator[method] = { count: 0, value: 0 }
      }

      accumulator[method].count += 1
      accumulator[method].value += PagarmeService.fromCents(charge.paid_amount || charge.amount)
      return accumulator
    }, {} as Record<string, { count: number; value: number }>)

    return Object.entries(grouped)
      .map(([method, data]) => ({
        key: method,
        name: getMethodLabel(method),
        count: data.count,
        value: data.value,
        color: paymentMethodColors[method] || "#6b7280",
      }))
      .sort((a, b) => b.value - a.value)
  }, [paidCharges])

  const hourlyData = useMemo(() => {
    if (!charges || charges.length === 0) return []

    const hours = Array.from({ length: 24 }, (_, hour) => hour)

    return hours.map((hour) => {
      const hourCharges = charges.filter((charge) => new Date(charge.created_at).getHours() === hour)

      const hourRevenue = hourCharges
        .filter((charge) => charge.status === "paid")
        .reduce((sum, charge) => sum + PagarmeService.fromCents(charge.paid_amount || charge.amount), 0)

      return {
        hour: `${hour.toString().padStart(2, "0")}:00`,
        transactions: hourCharges.length,
        revenue: hourRevenue,
      }
    })
  }, [charges])

  const topHour = useMemo(() => {
    if (!hourlyData.length) return null
    return hourlyData.reduce((best, current) =>
      current.revenue > best.revenue ? current : best
    )
  }, [hourlyData])

  const topPaymentMethod = paymentMethodData[0]
  const hasData = (charges && charges.length > 0) || (orders && orders.length > 0)

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDateRange(range)
    }
  }

  const handleRefresh = () => {
    refetchCharges()
    refetchOrders()
    refetchAnalytics()
  }

  const handleExport = () => {
    if (!dailyData.length) return

    const csvHeader = "Data,Pedidos,Receita"
    const csvRows = dailyData.map((row) => `${row.label},${row.pedidos},${row.receita.toFixed(2)}`)
    const csvContent = [csvHeader, ...csvRows].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `relatorio-${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Central de Relatórios e Análises</h1>
            <p className="mt-1 text-gray-600">
              Tudo em um único painel: relatórios, análise de evolução e performance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal lg:w-[280px]">
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
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" onClick={handleRefresh} disabled={isLoading} className="flex items-center gap-2">
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              {isLoading ? "Atualizando..." : "Atualizar"}
            </Button>

            <Button onClick={handleExport} disabled={!dailyData.length || isLoading}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {hasError && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="font-medium text-orange-900">Erro ao carregar dados</p>
                  <p className="text-sm text-orange-700">
                    {chargesError || ordersError || analyticsError || "Não foi possível atualizar os relatórios."}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  Tentar novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pedidos</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalPedidos}</p>
                  <p className="mt-2 flex items-center text-xs text-gray-500">
                    <FileText className="mr-1 h-3 w-3" />
                    Total no período
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(stats.receitaTotal)}</p>
                  <p className="mt-2 flex items-center text-xs text-gray-500">
                    <DollarSign className="mr-1 h-3 w-3" />
                    Pagamentos aprovados
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stats.taxaAprovacao.toFixed(1)}%</p>
                  <p className="mt-2 flex items-center text-xs text-gray-500">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {stats.pedidosPagos} pagas de {stats.totalCobrancas}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clientes Únicos</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stats.clientesUnicos}</p>
                  <p className="mt-2 flex items-center text-xs text-gray-500">
                    <Users className="mr-1 h-3 w-3" />
                    Ticket médio {formatCurrency(stats.ticketMedio)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 gap-2 bg-transparent p-0 md:grid-cols-3">
            <TabsTrigger value="overview" className="border bg-white data-[state=active]:border-orange-300 data-[state=active]:text-orange-700">
              Relatórios e Análises
            </TabsTrigger>
            <TabsTrigger value="analytics" className="border bg-white data-[state=active]:border-orange-300 data-[state=active]:text-orange-700">
              Painel de Análise
            </TabsTrigger>
            <TabsTrigger value="performance" className="border bg-white data-[state=active]:border-orange-300 data-[state=active]:text-orange-700">
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
              <ChartLoading />
            ) : !hasData ? (
              <EmptyDataState onRefresh={handleRefresh} />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Receita nos últimos 7 dias</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dailyData}>
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value: number | string) => [formatCurrency(Number(value) || 0), "Receita"]} />
                            <Bar dataKey="receita" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Pedidos por dia</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={dailyData}>
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="pedidos"
                              stroke="#3b82f6"
                              strokeWidth={3}
                              dot={{ fill: "#3b82f6", r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Métodos de pagamento</CardTitle>
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
                              dataKey="value"
                              nameKey="name"
                            >
                              {paymentMethodData.map((entry) => (
                                <Cell key={entry.key} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number | string) => [formatCurrency(Number(value) || 0), "Receita"]} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Distribuição por método</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {paymentMethodData.map((method) => {
                          const maxValue = Math.max(...paymentMethodData.map((item) => item.value), 1)

                          return (
                            <div key={method.key} className="rounded-lg bg-gray-50 p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: method.color }} />
                                  <span className="font-medium text-gray-900">{method.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{formatCurrency(method.value)}</span>
                              </div>
                              <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                                <div
                                  className="h-2 rounded-full"
                                  style={{
                                    width: `${(method.value / maxValue) * 100}%`,
                                    backgroundColor: method.color,
                                  }}
                                />
                              </div>
                              <p className="mt-1 text-xs text-gray-500">{method.count} transações</p>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {isLoading ? (
              <ChartLoading />
            ) : !hasData ? (
              <EmptyDataState onRefresh={handleRefresh} />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Evolução da receita (30 dias)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={evolutionData}>
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value: number | string) => [formatCurrency(Number(value) || 0), "Receita"]} />
                            <Area type="monotone" dataKey="receita" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Status das cobranças</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={evolutionData}>
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="paid" stroke="#10b981" strokeWidth={2} name="Pagas" />
                            <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pendentes" />
                            <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} name="Falhas" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Resumo analítico do período</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-600">Pedidos no período</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{analytics?.total_orders ?? stats.totalPedidos}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-600">Faturamento no período</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                          {formatCurrency(
                            analytics ? PagarmeService.fromCents(analytics.total_amount) : stats.receitaTotal
                          )}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-600">Clientes no período</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{analytics?.total_customers ?? stats.clientesUnicos}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-600">Assinaturas no período</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{analytics?.total_subscriptions ?? 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {isLoading ? (
              <ChartLoading />
            ) : !hasData ? (
              <EmptyDataState onRefresh={handleRefresh} />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Transações por hora</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={hourlyData}>
                            <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="transactions" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Receita por hora</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={hourlyData}>
                            <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value: number | string) => [formatCurrency(Number(value) || 0), "Receita"]} />
                            <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center gap-2 text-blue-700">
                        <Activity className="h-4 w-4" />
                        <p className="text-sm font-medium">Melhor horário</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{topHour?.hour || "N/A"}</p>
                      <p className="mt-1 text-xs text-gray-500">Maior receita por hora</p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center gap-2 text-green-700">
                        <CreditCard className="h-4 w-4" />
                        <p className="text-sm font-medium">Método líder</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{topPaymentMethod?.name || "N/A"}</p>
                      <p className="mt-1 text-xs text-gray-500">Maior participação na receita</p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center gap-2 text-orange-700">
                        <Target className="h-4 w-4" />
                        <p className="text-sm font-medium">Taxa de aprovação</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stats.taxaAprovacao.toFixed(1)}%</p>
                      <p className="mt-1 text-xs text-gray-500">Cobranças aprovadas</p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center gap-2 text-purple-700">
                        <TrendingUp className="h-4 w-4" />
                        <p className="text-sm font-medium">Ticket médio</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.ticketMedio)}</p>
                      <p className="mt-1 text-xs text-gray-500">Valor por cobrança paga</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
