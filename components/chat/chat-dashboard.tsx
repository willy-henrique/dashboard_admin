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
    <div className="space-y-8">
      {/* Header Melhorado */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Monitoramento de Chat</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Acompanhe conversas e atendimentos em tempo real
        </p>
      </div>

      {/* Estatísticas e Alertas em Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ChatStatsCards />
        </div>
        
        {/* Alertas Compactos */}
        <div className="space-y-4">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Urgentes</p>
                    <p className="text-sm text-gray-600">Atenção imediata</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Sem Resposta</p>
                    <p className="text-sm text-gray-600">+1 hora</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-orange-600">5</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monitor Principal - Layout Melhorado */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 h-[700px]">
        {/* Lista de Conversas */}
        <div className="xl:col-span-2">
          <Card className="h-full border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Users className="h-5 w-5 text-orange-500 mr-2" />
                Conversas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <ConversationsList 
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversation?.id}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Mensagens */}
        <div className="xl:col-span-3">
          <Card className="h-full border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <MessageSquare className="h-5 w-5 text-orange-500 mr-2" />
                Mensagens
                {selectedConversation && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    - {selectedConversation.clientName}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <ChatMessages conversation={selectedConversation} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
