"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

// Sample data for charts
const ordersData = [
  { name: "Jan", pedidos: 65, concluidos: 58 },
  { name: "Fev", pedidos: 78, concluidos: 72 },
  { name: "Mar", pedidos: 90, concluidos: 85 },
  { name: "Abr", pedidos: 81, concluidos: 79 },
  { name: "Mai", pedidos: 95, concluidos: 88 },
  { name: "Jun", pedidos: 108, concluidos: 102 },
]

const categoryData = [
  { name: "Limpeza", value: 35, color: "#2196F3" },
  { name: "Manutenção", value: 25, color: "#FF9800" },
  { name: "Jardinagem", value: 20, color: "#4CAF50" },
  { name: "Pintura", value: 12, color: "#FFC107" },
  { name: "Outros", value: 8, color: "#9C27B0" },
]

const topProvidersData = [
  { name: "João Silva", pedidos: 45, rating: 4.9 },
  { name: "Maria Santos", pedidos: 38, rating: 4.8 },
  { name: "Carlos Lima", pedidos: 32, rating: 4.7 },
  { name: "Ana Costa", pedidos: 28, rating: 4.9 },
  { name: "Pedro Oliveira", pedidos: 25, rating: 4.6 },
]

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Orders Timeline */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Pedidos por Mês</CardTitle>
          <CardDescription>Comparação entre pedidos recebidos e concluídos</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pedidos" stroke="#2196F3" strokeWidth={2} name="Pedidos" />
              <Line type="monotone" dataKey="concluidos" stroke="#4CAF50" strokeWidth={2} name="Concluídos" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Categoria</CardTitle>
          <CardDescription>Pedidos por tipo de serviço</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Prestadores</CardTitle>
          <CardDescription>Prestadores com mais pedidos concluídos</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProvidersData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="pedidos" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
