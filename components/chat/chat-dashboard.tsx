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

interface ChatDashboardProps {
  initialProtocolo?: string | null
  initialServicoId?: string | null
}

export function ChatDashboard({ initialProtocolo, initialServicoId }: ChatDashboardProps) {
  const [selectedConversation, setSelectedConversation] = useState<LegacyChatConversation | null>(null)

  const handleSelectConversation = (conversation: LegacyChatConversation) => {
    setSelectedConversation(conversation)
  }

  return (
    <div className="space-y-8">
      {/* Header Melhorado */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Monitoramento de Chat</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Acompanhe conversas e atendimentos em tempo real
        </p>
      </div>

      {/* Estatísticas e Alertas em Grid Responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-full">
        <div className="lg:col-span-3 min-w-0">
          <ChatStatsCards />
        </div>
        
        {/* Alertas Compactos */}
        <div className="space-y-3 min-w-0">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">Urgentes</p>
                    <p className="text-xs text-gray-600">Atenção imediata</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-red-600">3</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <Clock className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">Sem Resposta</p>
                    <p className="text-xs text-gray-600">+1 hora</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-orange-600">5</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monitor Principal - Layout Responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-full overflow-hidden">
        {/* Lista de Conversas */}
        <div className="lg:col-span-1 min-w-0">
          <Card className="h-[600px] border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Users className="h-5 w-5 text-orange-500 mr-2" />
                Conversas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full overflow-hidden">
              <ConversationsList 
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversation?.id}
                initialProtocolo={initialProtocolo}
                initialServicoId={initialServicoId}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Mensagens */}
        <div className="lg:col-span-2 min-w-0">
          <Card className="h-[600px] border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <MessageSquare className="h-5 w-5 text-orange-500 mr-2" />
                <span className="truncate">
                  Mensagens
                  {selectedConversation && (
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      - {selectedConversation.clientName}
                    </span>
                  )}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full overflow-hidden">
              <ChatMessages conversation={selectedConversation} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
