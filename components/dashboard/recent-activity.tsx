"use client"

import { CheckCircle, Clock, XCircle, User, ShoppingCart, DollarSign, Star, MessageSquare, UserCheck, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRecentActivities } from "@/hooks/use-recent-activities"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

const getActivityIcon = (type: string) => {
  const icons = {
    order_completed: CheckCircle,
    new_provider: UserCheck,
    order_cancelled: XCircle,
    payment_received: DollarSign,
    new_order: ShoppingCart,
    new_client: User,
    rating_received: Star,
    message_received: MessageSquare,
    provider_verified: UserCheck,
  }
  return icons[type as keyof typeof icons] || Clock
}

const getActivityColors = (type: string) => {
  const colors = {
    order_completed: { color: "text-green-600", bgColor: "bg-green-100" },
    new_provider: { color: "text-blue-600", bgColor: "bg-blue-100" },
    order_cancelled: { color: "text-red-600", bgColor: "bg-red-100" },
    payment_received: { color: "text-green-600", bgColor: "bg-green-100" },
    new_order: { color: "text-orange-600", bgColor: "bg-orange-100" },
    new_client: { color: "text-purple-600", bgColor: "bg-purple-100" },
    rating_received: { color: "text-yellow-600", bgColor: "bg-yellow-100" },
    message_received: { color: "text-blue-600", bgColor: "bg-blue-100" },
    provider_verified: { color: "text-blue-600", bgColor: "bg-blue-100" },
  }
  return colors[type as keyof typeof colors] || { color: "text-gray-600", bgColor: "bg-gray-100" }
}

export function RecentActivity() {
  const { activities, loading, error } = useRecentActivities()

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl border border-gray-200 bg-white">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600 font-medium">Erro ao carregar atividades</p>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 font-medium">Nenhuma atividade recente</p>
        <p className="text-sm text-gray-500 mt-1">As atividades aparecerão aqui conforme ocorrem</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {activities.slice(0, 10).map((activity) => {
        const Icon = getActivityIcon(activity.type)
        const colors = getActivityColors(activity.type)
        
        return (
          <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <div className={`p-2 rounded-full ${colors.bgColor}`}>
              <Icon className={`h-4 w-4 ${colors.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 font-medium">{activity.time}</p>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {activity.description}
              </p>
            </div>
          </div>
        )
      })}
      
      <div className="text-center pt-4">
        <button className="text-sm text-orange-600 hover:text-orange-700 font-semibold px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">
          Ver todas as atividades
        </button>
      </div>
    </div>
  )
}