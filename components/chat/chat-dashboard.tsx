"use client"

import { useCallback, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LegacyChatConversation } from "@/lib/services/chat-service"
import { AlertTriangle, Clock, MessageCircle, Users } from "lucide-react"
import { useChatStats } from "@/hooks/use-chat"
import { ChatStatsCards } from "./chat-stats-cards"
import { ConversationsList } from "./conversations-list"
import { ChatMessages } from "./chat-messages"
import { AdminActionsPanel } from "./admin-actions-panel"

interface ChatDashboardProps {
  initialProtocolo?: string | null
  initialServicoId?: string | null
  initialOrderId?: string | null
}

export function ChatDashboard({ initialProtocolo, initialServicoId, initialOrderId }: ChatDashboardProps) {
  const [selectedConversation, setSelectedConversation] = useState<LegacyChatConversation | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const { stats } = useChatStats()

  const handleSelectConversation = useCallback((conversation: LegacyChatConversation) => {
    setSelectedConversation(conversation)
  }, [])

  const handleConversationsLoaded = useCallback(
    (conversations: LegacyChatConversation[]) => {
      if (conversations.length === 0) {
        setSelectedConversation(null)
        return
      }

      if (selectedConversation) {
        const updatedConversation = conversations.find((conversation) => conversation.id === selectedConversation.id)
        if (updatedConversation) {
          setSelectedConversation(updatedConversation)
          return
        }
      }

      const targetConversation =
        conversations.find(
          (conversation) =>
            conversation.orderProtocol === initialProtocolo ||
            conversation.orderId === initialServicoId ||
            conversation.orderId === initialOrderId
        ) || conversations[0]

      setSelectedConversation(targetConversation)
    },
    [initialOrderId, initialProtocolo, initialServicoId, selectedConversation]
  )

  const urgentConversations = stats?.conversationsByPriority.urgent ?? 0
  const unreadMessages = stats?.unreadMessages ?? 0
  const activeConversations = stats?.activeConversations ?? 0

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Monitoramento de Chat</h1>
        <p className="text-muted-foreground">Acompanhe as conversas reais de pedidos, suporte e atendimentos monitorados.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-red-200 bg-red-50/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-900">Prioridade urgente</p>
                <p className="text-xs text-red-700">Conversas com tratamento imediato</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">{urgentConversations}</div>
                <AlertTriangle className="ml-auto h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-900">Nao lidas</p>
                <p className="text-xs text-orange-700">Mensagens pendentes para o admin</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">{unreadMessages}</div>
                <Clock className="ml-auto h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Ativas</p>
                <p className="text-xs text-blue-700">Conversas abertas no monitoramento</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{activeConversations}</div>
                <Users className="ml-auto h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ChatStatsCards key={`stats-${refreshKey}`} />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)_320px]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Conversas
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[720px] p-0">
            <ConversationsList
              key={`conversations-${refreshKey}`}
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversation?.id}
              initialProtocolo={initialProtocolo}
              initialServicoId={initialServicoId}
              initialOrderId={initialOrderId}
              onConversationsLoaded={handleConversationsLoaded}
            />
          </CardContent>
        </Card>

        <div className="h-[720px] min-w-0">
          <ChatMessages conversation={selectedConversation} />
        </div>

        {selectedConversation ? (
          <AdminActionsPanel conversation={selectedConversation} onUpdate={() => setRefreshKey((value) => value + 1)} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5" />
                Painel administrativo
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Selecione uma conversa para ajustar status, prioridade, responsavel e notas internas.
            </CardContent>
          </Card>
        )}
      </div>

      {selectedConversation?.notes ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo da conversa selecionada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Pedido: {selectedConversation.orderProtocol || selectedConversation.orderId}</Badge>
              {selectedConversation.assignedAdmin ? <Badge variant="outline">Responsavel: {selectedConversation.assignedAdmin}</Badge> : null}
            </div>
            <p className="whitespace-pre-wrap">{selectedConversation.notes}</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
