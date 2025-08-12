"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ClipboardList, DollarSign, Star, UserPlus, TrendingUp } from "lucide-react"

const metrics = [
  {
    title: "Total de Usuários",
    value: "2,847",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    description: "Clientes + Prestadores",
  },
  {
    title: "Pedidos Ativos",
    value: "156",
    change: "+8%",
    changeType: "positive" as const,
    icon: ClipboardList,
    description: "Em andamento",
  },
  {
    title: "Receita do Mês",
    value: "R$ 45.230",
    change: "+23%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "Março 2024",
  },
  {
    title: "Satisfação Média",
    value: "4.8",
    change: "+0.2",
    changeType: "positive" as const,
    icon: Star,
    description: "De 5 estrelas",
  },
  {
    title: "Novos Cadastros",
    value: "89",
    change: "-5%",
    changeType: "negative" as const,
    icon: UserPlus,
    description: "Últimos 7 dias",
  },
  {
    title: "Taxa de Conversão",
    value: "68%",
    change: "+4%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "Pedidos concluídos",
  },
]

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
            <div className="flex items-center space-x-2 text-xs">
              <span className={`font-medium ${metric.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                {metric.change}
              </span>
              <span className="text-gray-500">{metric.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
