"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle, UserPlus } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "order_completed",
    title: "Pedido #1234 concluído",
    description: "Limpeza residencial finalizada por João Silva",
    time: "2 min atrás",
    icon: CheckCircle,
    iconColor: "text-green-600",
    user: "JS",
  },
  {
    id: 2,
    type: "new_user",
    title: "Novo cliente cadastrado",
    description: "Maria Santos se registrou na plataforma",
    time: "15 min atrás",
    icon: UserPlus,
    iconColor: "text-blue-600",
    user: "MS",
  },
  {
    id: 3,
    type: "order_pending",
    title: "Pedido #1235 aguardando",
    description: "Manutenção elétrica precisa de prestador",
    time: "1 hora atrás",
    icon: Clock,
    iconColor: "text-orange-600",
    user: "AC",
  },
  {
    id: 4,
    type: "order_issue",
    title: "Problema reportado",
    description: "Cliente relatou atraso no pedido #1230",
    time: "2 horas atrás",
    icon: AlertCircle,
    iconColor: "text-red-600",
    user: "PO",
  },
  {
    id: 5,
    type: "order_completed",
    title: "Pedido #1233 concluído",
    description: "Jardinagem finalizada por Carlos Lima",
    time: "3 horas atrás",
    icon: CheckCircle,
    iconColor: "text-green-600",
    user: "CL",
  },
]

const getStatusBadge = (type: string) => {
  switch (type) {
    case "order_completed":
      return <Badge className="bg-green-100 text-green-800">Concluído</Badge>
    case "new_user":
      return <Badge className="bg-blue-100 text-blue-800">Novo</Badge>
    case "order_pending":
      return <Badge className="bg-orange-100 text-orange-800">Pendente</Badge>
    case "order_issue":
      return <Badge className="bg-red-100 text-red-800">Problema</Badge>
    default:
      return <Badge>Atividade</Badge>
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>Últimas atividades do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">{activity.user}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  {getStatusBadge(activity.type)}
                </div>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <activity.icon className={`h-3 w-3 mr-1 ${activity.iconColor}`} />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
