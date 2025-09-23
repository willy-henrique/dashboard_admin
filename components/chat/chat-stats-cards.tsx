"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useChatStats } from "@/hooks/use-chat"
import { 
  MessageSquare, 
  Users, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  FileText,
  Image,
  MapPin,
  Settings
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
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-orange-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Conversas
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalConversations}</div>
            <p className="text-xs text-green-600 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              {stats.activeConversations} ativas
            </p>
          </CardContent>
        </Card>

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

        <Card className="bg-white border-orange-200 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Mensagens Não Lidas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</div>
            <p className="text-xs text-orange-600 mt-1">
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

      {/* Prioridades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Badge variant="secondary" className="mr-2">Baixa</Badge>
              Prioridade Baixa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900">{stats.conversationsByPriority.low}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Badge variant="default" className="mr-2 bg-yellow-500">Média</Badge>
              Prioridade Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900">{stats.conversationsByPriority.medium}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Badge variant="destructive" className="mr-2 bg-orange-500">Alta</Badge>
              Prioridade Alta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900">{stats.conversationsByPriority.high}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Badge variant="destructive" className="mr-2 bg-red-500">Urgente</Badge>
              Prioridade Urgente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900">{stats.conversationsByPriority.urgent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tipos de Mensagens */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-lg font-bold text-gray-900">{stats.messagesByType.text}</div>
                <div className="text-xs text-gray-600">Texto</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Image className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-lg font-bold text-gray-900">{stats.messagesByType.image}</div>
                <div className="text-xs text-gray-600">Imagens</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-lg font-bold text-gray-900">{stats.messagesByType.file}</div>
                <div className="text-xs text-gray-600">Arquivos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-red-500" />
              <div>
                <div className="text-lg font-bold text-gray-900">{stats.messagesByType.location}</div>
                <div className="text-xs text-gray-600">Localização</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-lg font-bold text-gray-900">{stats.messagesByType.system}</div>
                <div className="text-xs text-gray-600">Sistema</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
