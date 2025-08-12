"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, MapPin, Clock, Star } from "lucide-react"
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
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <Badge variant="outline" className={stat.trend === "up" ? "text-green-600" : "text-blue-600"}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend === "up" ? "Crescimento" : "Melhoria"}
                </Badge>
                <span className="text-gray-500">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Crescimento de Usuários</CardTitle>
            <CardDescription>Evolução mensal de clientes e prestadores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
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
          </CardContent>
        </Card>

        {/* Service Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categorias Mais Solicitadas</CardTitle>
            <CardDescription>Pedidos por categoria de serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pedidos" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição Geográfica</CardTitle>
            <CardDescription>Pedidos por cidade</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={geographicData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ cidade, percent }) => `${cidade} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
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
          </CardContent>
        </Card>

        {/* Satisfaction Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolução da Satisfação</CardTitle>
            <CardDescription>Avaliação média mensal dos serviços</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={satisfactionTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[4.0, 5.0]} />
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
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Performance por Categoria</CardTitle>
            <CardDescription>Análise detalhada de cada categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-gray-600">{category.pedidos} pedidos</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{category.satisfacao}</span>
                    </div>
                    <p className="text-sm text-gray-600">satisfação</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Geográfica</CardTitle>
            <CardDescription>Receita e pedidos por cidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geographicData.map((city) => (
                <div key={city.cidade} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{city.cidade}</p>
                    <p className="text-sm text-gray-600">{city.pedidos} pedidos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {city.receita.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">receita</p>
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
