"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LegacyChatConversation } from "@/lib/services/chat-service"
import { 
  MessageSquare, 
  Users, 
  AlertTriangle,
  Clock,
  Activity
} from "lucide-react"
import { ChatStatsCards } from "./chat-stats-cards"
import { ConversationsList } from "./conversations-list"
import { ChatMessages } from "./chat-messages"

export function ChatDashboard() {
  const [selectedConversation, setSelectedConversation] = useState<LegacyChatConversation | null>(null)

  const handleSelectConversation = (conversation: LegacyChatConversation) => {
    setSelectedConversation(conversation)
  }

  return (
    <div className="space-y-6">
      {/* Header Simplificado */}
        <div>
        <h1 className="text-2xl font-bold text-gray-900">Monitor de Chat</h1>
          <p className="text-gray-600 mt-1">
          Acompanhe conversas em tempo real
        </p>
      </div>

      {/* Estatísticas Essenciais */}
            <ChatStatsCards />
          
      {/* Alertas Críticos */}
      <Card className="bg-white border-red-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Alertas Importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                  <p className="font-medium text-gray-900">Conversas Urgentes</p>
                  <p className="text-sm text-gray-600">Requerem atenção imediata</p>
                </div>
              </div>
              <span className="text-lg font-bold text-red-600">3</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                  <p className="font-medium text-gray-900">Sem Resposta</p>
                  <p className="text-sm text-gray-600">Mais de 1 hora sem resposta</p>
                </div>
                  </div>
              <span className="text-lg font-bold text-orange-600">5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

      {/* Monitor Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Users className="h-5 w-5 text-orange-500 mr-2" />
                Conversas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ConversationsList 
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversation?.id}
              />
            </CardContent>
          </Card>
            </div>
            
            <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <MessageSquare className="h-5 w-5 text-orange-500 mr-2" />
                Mensagens
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ChatMessages conversation={selectedConversation} />
            </CardContent>
          </Card>
          </div>
      </div>
    </div>
  )
}
