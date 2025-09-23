"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, CreditCard, Percent, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { FirestoreAnalyticsService } from "@/lib/services/firestore-analytics-simple"
import { useEffect, useState } from "react"

const financialMetrics = [
  {
    title: "Receita Total",
    value: "R$ 127.450",
    change: "+15.2%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "Este mês",
  },
  {
    title: "Comissões Geradas",
    value: "R$ 12.745",
    change: "+18.1%",
    changeType: "positive" as const,
    icon: Percent,
    description: "10% média",
  },
  {
    title: "Transações",
    value: "1,247",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: CreditCard,
    description: "Este mês",
  },
  {
    title: "Taxa de Sucesso",
    value: "98.2%",
    change: "+0.8%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "Pagamentos",
  },
]

const revenueData = [
  { month: "Jan", receita: 85000, comissoes: 8500 },
  { month: "Fev", receita: 92000, comissoes: 9200 },
  { month: "Mar", receita: 127450, comissoes: 12745 },
  { month: "Abr", receita: 98000, comissoes: 9800 },
  { month: "Mai", receita: 115000, comissoes: 11500 },
  { month: "Jun", receita: 134000, comissoes: 13400 },
]

const paymentMethodsData = [
  { name: "PIX", value: 45, color: "#2196F3" },
  { name: "Cartão de Crédito", value: 35, color: "#4CAF50" },
  { name: "Cartão de Débito", value: 15, color: "#FF9800" },
  { name: "Boleto", value: 5, color: "#9C27B0" },
]

const topProvidersEarnings = [
  { name: "João Silva", ganhos: 8500 },
  { name: "Maria Santos", ganhos: 7200 },
  { name: "Carlos Lima", ganhos: 6800 },
  { name: "Ana Costa", ganhos: 5900 },
  { name: "Pedro Oliveira", ganhos: 5400 },
]

export function FinancialDashboard() {
  const [firestoreData, setFirestoreData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await FirestoreAnalyticsService.getDashboardMetrics()
        setFirestoreData(data)
      } catch (err) {
        console.error('Erro ao buscar dados financeiros:', err)
        setError('Erro ao carregar dados financeiros')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Loader2 className="h-4 w-24" />
                <Loader2 className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Loader2 className="h-8 w-20 mb-2" />
                <Loader2 className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !firestoreData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erro ao carregar dados financeiros: {error}</p>
      </div>
    )
  }

  // Calcular métricas financeiras baseadas nos dados do Firestore
  const totalOrders = firestoreData?.orders?.totalOrders || 0
  const completedOrders = firestoreData?.orders?.completedOrders || 0
  const averageOrderValue = 150 // Valor médio por pedido (simulado)
  const totalRevenue = completedOrders * averageOrderValue
  const commissionRate = 0.10 // 10% de comissão
  const totalCommissions = totalRevenue * commissionRate
  const successRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0

  const financialMetrics = [
    {
      title: "Receita Total",
      value: `R$ ${totalRevenue.toLocaleString()}`,
      change: "+15.2%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Baseado em pedidos concluídos",
    },
    {
      title: "Comissões Geradas",
      value: `R$ ${totalCommissions.toLocaleString()}`,
      change: "+18.1%",
      changeType: "positive" as const,
      icon: Percent,
      description: `${(commissionRate * 100)}% média`,
    },
    {
      title: "Transações",
      value: totalOrders.toLocaleString(),
      change: "+12.5%",
      changeType: "positive" as const,
      icon: CreditCard,
      description: "Total de pedidos",
    },
    {
      title: "Taxa de Sucesso",
      value: `${successRate.toFixed(1)}%`,
      change: "+0.8%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "Pedidos concluídos",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <span
                  className={`font-medium flex items-center gap-1 ${
                    metric.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.changeType === "positive" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {metric.change}
                </span>
                <span className="text-gray-500">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Receita e Comissões</CardTitle>
            <CardDescription>Evolução mensal da receita total e comissões geradas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, ""]} />
                <Line type="monotone" dataKey="receita" stroke="#2196F3" strokeWidth={2} name="Receita Total" />
                <Line type="monotone" dataKey="comissoes" stroke="#4CAF50" strokeWidth={2} name="Comissões" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento</CardTitle>
            <CardDescription>Distribuição por tipo de pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Providers Earnings */}
        <Card>
          <CardHeader>
            <CardTitle>Maiores Ganhos</CardTitle>
            <CardDescription>Prestadores com maiores ganhos este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProvidersEarnings} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, "Ganhos"]} />
                <Bar dataKey="ganhos" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
