"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useChatStats } from "@/hooks/use-chat"
import { 
  MessageSquare, 
  Users, 
  AlertTriangle
} from "lucide-react"

export function ChatStatsCards() {
  const { stats, loading } = useChatStats()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="bg-white">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Métricas Essenciais */}
      <Card className="bg-white border-orange-200 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Conversas Ativas
          </CardTitle>
          <Users className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.activeConversations}</div>
          <p className="text-xs text-blue-600 mt-1">
            {((stats.activeConversations / stats.totalConversations) * 100).toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border-red-200 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Não Lidas
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</div>
          <p className="text-xs text-red-600 mt-1">
            Requerem atenção
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white border-orange-200 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total de Mensagens
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.totalMessages}</div>
          <p className="text-xs text-gray-600 mt-1">
            Todas as mensagens
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
