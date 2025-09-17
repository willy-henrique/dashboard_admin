"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, MapPin, Clock, Star, Skeleton } from "lucide-react"
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
  AreaChart,
  Area,
} from "recharts"
import { FirestoreAnalyticsService } from "@/lib/services/firestore-analytics-simple"
import { useEffect, useState } from "react"

const quickStats = [
  {
    title: "Crescimento de Usuários",
    value: "+23.5%",
    description: "Últimos 30 dias",
    icon: Users,
    trend: "up",
  },
  {
    title: "Satisfação Média",
    value: "4.8/5",
    description: "Baseado em 1,247 avaliações",
    icon: Star,
    trend: "up",
  },
  {
    title: "Tempo Médio de Atendimento",
    value: "2.4h",
    description: "Redução de 15% este mês",
    icon: Clock,
    trend: "down",
  },
  {
    title: "Cobertura Geográfica",
    value: "127 cidades",
    description: "+12 novas cidades",
    icon: MapPin,
    trend: "up",
  },
]

const userGrowthData = [
  { month: "Jan", clientes: 450, prestadores: 120 },
  { month: "Fev", clientes: 520, prestadores: 145 },
  { month: "Mar", clientes: 680, prestadores: 180 },
  { month: "Abr", clientes: 750, prestadores: 210 },
  { month: "Mai", clientes: 890, prestadores: 245 },
  { month: "Jun", clientes: 1100, prestadores: 290 },
]

const categoryData = [
  { name: "Limpeza", pedidos: 450, satisfacao: 4.9, color: "#2196F3" },
  { name: "Manutenção", pedidos: 320, satisfacao: 4.7, color: "#4CAF50" },
  { name: "Jardinagem", pedidos: 280, satisfacao: 4.8, color: "#FF9800" },
  { name: "Pintura", pedidos: 180, satisfacao: 4.6, color: "#9C27B0" },
  { name: "Outros", pedidos: 120, satisfacao: 4.5, color: "#F44336" },
]

const geographicData = [
  { cidade: "São Paulo", pedidos: 450, receita: 125000 },
  { cidade: "Rio de Janeiro", pedidos: 320, receita: 89000 },
  { cidade: "Belo Horizonte", pedidos: 180, receita: 52000 },
  { cidade: "Salvador", pedidos: 150, receita: 41000 },
  { cidade: "Brasília", pedidos: 120, receita: 35000 },
]

const satisfactionTrendData = [
  { month: "Jan", satisfacao: 4.5 },
  { month: "Fev", satisfacao: 4.6 },
  { month: "Mar", satisfacao: 4.7 },
  { month: "Abr", satisfacao: 4.8 },
  { month: "Mai", satisfacao: 4.8 },
  { month: "Jun", satisfacao: 4.9 },
]

export function ReportsOverview() {
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
        console.error('Erro ao buscar dados de relatórios:', err)
        setError('Erro ao carregar dados de relatórios')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-card border border-gray-200 shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20 sm:w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mb-2" />
                <Skeleton className="h-3 w-16 sm:w-20" />
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
        <p className="text-red-600">Erro ao carregar dados de relatórios: {error}</p>
      </div>
    )
  }

  // Calcular estatísticas baseadas nos dados do Firestore
  const quickStats = [
    {
      title: "Crescimento de Usuários",
      value: `+${((firestoreData.users.newUsersLast30Days / Math.max(firestoreData.users.totalUsers - firestoreData.users.newUsersLast30Days, 1)) * 100).toFixed(1)}%`,
      description: "Últimos 30 dias",
      icon: Users,
      trend: "up",
    },
    {
      title: "Satisfação Média",
      value: "4.8/5",
      description: `Baseado em ${firestoreData.orders.completedOrders || 0} avaliações`,
      icon: Star,
      trend: "up",
    },
    {
      title: "Tempo Médio de Atendimento",
      value: "2.4h",
      description: "Redução de 15% este mês",
      icon: Clock,
      trend: "down",
    },
    {
      title: "Cobertura Geográfica",
      value: "127 cidades",
      description: `+${firestoreData.orders.ordersLast30Days} novos pedidos`,
      icon: MapPin,
      trend: "up",
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.title} className="bg-card border border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</CardTitle>
              <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs">
                <Badge variant="outline" className={`w-fit ${stat.trend === "up" ? "text-green-600" : "text-blue-600"}`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend === "up" ? "Crescimento" : "Melhoria"}
                </Badge>
                <span className="text-gray-500 truncate">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* User Growth */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Crescimento de Usuários</CardTitle>
            <CardDescription className="text-sm">Evolução mensal de clientes e prestadores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="clientes"
                    stackId="1"
                    stroke="#2196F3"
                    fill="#2196F3"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="prestadores"
                    stackId="1"
                    stroke="#4CAF50"
                    fill="#4CAF50"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Service Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Categorias Mais Solicitadas</CardTitle>
            <CardDescription className="text-sm">Pedidos por categoria de serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="pedidos" fill="#2196F3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Distribuição Geográfica</CardTitle>
            <CardDescription className="text-sm">Pedidos por cidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={geographicData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ cidade, percent }) => `${cidade} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="pedidos"
                  >
                    {geographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categoryData[index]?.color || "#2196F3"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Satisfaction Trend */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Evolução da Satisfação</CardTitle>
            <CardDescription className="text-sm">Avaliação média mensal dos serviços</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={satisfactionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis domain={[4.0, 5.0]} fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="satisfacao"
                    stroke="#4CAF50"
                    strokeWidth={3}
                    dot={{ fill: "#4CAF50", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Performance por Categoria</CardTitle>
            <CardDescription className="text-sm">Análise detalhada de cada categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{category.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{category.pedidos} pedidos</p>
                  </div>
                  <div className="text-right ml-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-sm sm:text-base">{category.satisfacao}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">satisfação</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Performance Geográfica</CardTitle>
            <CardDescription className="text-sm">Receita e pedidos por cidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {geographicData.map((city) => (
                <div key={city.cidade} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{city.cidade}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{city.pedidos} pedidos</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-medium text-sm sm:text-base">R$ {city.receita.toLocaleString()}</p>
                    <p className="text-xs sm:text-sm text-gray-600">receita</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
