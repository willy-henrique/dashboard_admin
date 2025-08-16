"use client"

import { CheckCircle, Clock, XCircle, User, ShoppingCart, DollarSign, Star, MessageSquare, UserCheck, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    type: "order_completed",
    title: "Pedido #1234 concluído",
    description: "João Silva finalizou o serviço de limpeza para Maria Santos",
    time: "2 minutos atrás",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    id: 2,
    type: "new_provider",
    title: "Novo prestador verificado",
    description: "Carlos Lima foi aprovado como prestador de serviços",
    time: "15 minutos atrás",
    icon: UserCheck,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: 3,
    type: "order_cancelled",
    title: "Pedido #1235 cancelado",
    description: "Cliente cancelou o serviço de manutenção",
    time: "1 hora atrás",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    id: 4,
    type: "payment_received",
    title: "Pagamento recebido",
    description: "R$ 150,00 recebido pelo pedido #1233",
    time: "2 horas atrás",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    id: 5,
    type: "new_order",
    title: "Novo pedido criado",
    description: "Pedido #1236 - Manutenção elétrica em São Paulo",
    time: "3 horas atrás",
    icon: ShoppingCart,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    id: 6,
    type: "new_client",
    title: "Novo cliente cadastrado",
    description: "Ana Costa se registrou no aplicativo",
    time: "4 horas atrás",
    icon: User,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: 7,
    type: "rating_received",
    title: "Avaliação 5 estrelas",
    description: "Pedido #1230 recebeu avaliação perfeita",
    time: "5 horas atrás",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    id: 8,
    type: "chat_started",
    title: "Chat de suporte iniciado",
    description: "Cliente iniciou conversa sobre pedido #1231",
    time: "6 horas atrás",
    icon: MessageSquare,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
  },
  {
    id: 9,
    type: "provider_blocked",
    title: "Prestador bloqueado",
    description: "Prestador foi bloqueado por violação de termos",
    time: "8 horas atrás",
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    id: 10,
    type: "order_assigned",
    title: "Pedido atribuído",
    description: "Pedido #1232 atribuído ao prestador Pedro Oliveira",
    time: "10 horas atrás",
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activity.icon
        return (
          <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className={`p-2 rounded-full ${activity.bgColor}`}>
              <Icon className={`h-4 w-4 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {activity.description}
              </p>
            </div>
          </div>
        )
      })}
      
      <div className="text-center pt-4">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver todas as atividades
        </button>
      </div>
    </div>
  )
}
