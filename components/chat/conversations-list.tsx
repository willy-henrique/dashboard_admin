"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useChatConversations } from "@/hooks/use-chat"
import { LegacyChatConversation } from "@/lib/services/chat-service"
import { Search, MessageSquare, Clock, AlertTriangle, Mail, UserCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ConversationsListProps {
  onSelectConversation: (conversation: LegacyChatConversation) => void
  selectedConversationId?: string
  initialProtocolo?: string | null
  initialServicoId?: string | null
  initialOrderId?: string | null
  onConversationsLoaded?: (conversations: LegacyChatConversation[]) => void
  compact?: boolean
}

export function ConversationsList({
  onSelectConversation,
  selectedConversationId,
  initialProtocolo,
  initialServicoId,
  initialOrderId,
  onConversationsLoaded,
}: ConversationsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { conversations, loading, error } = useChatConversations({ searchTerm })

  useEffect(() => {
    onConversationsLoaded?.(conversations)
  }, [conversations, onConversationsLoaded])

  useEffect(() => {
    if (!(initialProtocolo || initialOrderId || initialServicoId) || conversations.length === 0) {
      return
    }

    const matchingConversation = conversations.find(
      (conversation) =>
        conversation.orderProtocol === initialProtocolo ||
        conversation.orderId === initialServicoId ||
        conversation.orderId === initialOrderId
    )

    if (matchingConversation && matchingConversation.id !== selectedConversationId) {
      onSelectConversation(matchingConversation)
    }
  }, [conversations, initialOrderId, initialProtocolo, initialServicoId, onSelectConversation, selectedConversationId])

  const getStatusIcon = (status: LegacyChatConversation["status"]) => {
    switch (status) {
      case "active":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "closed":
        return <Clock className="h-4 w-4 text-gray-500" />
      case "blocked":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: LegacyChatConversation["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: LegacyChatConversation["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "archived":
        return "bg-blue-100 text-blue-800"
      case "blocked":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 bg-white p-4">
          <h3 className="font-semibold text-gray-800">Carregando...</h3>
        </div>
        <div className="flex-1 space-y-4 p-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="rounded-lg border p-4 animate-pulse">
              <div className="mb-2 flex items-center justify-between">
                <div className="h-4 w-1/3 rounded bg-gray-200"></div>
                <div className="h-4 w-16 rounded bg-gray-200"></div>
              </div>
              <div className="mb-2 h-3 w-2/3 rounded bg-gray-200"></div>
              <div className="h-3 w-1/2 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 bg-white p-4">
          <h3 className="font-semibold text-gray-800">Erro</h3>
        </div>
        <div className="flex-1 p-6 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="text-red-600">Erro ao carregar conversas: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Conversas ({conversations.length})</h3>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por cliente, pedido ou responsavel"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-9 pl-10 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p>Nenhuma conversa encontrada</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`cursor-pointer p-4 transition-all duration-200 hover:bg-gray-50 ${
                  selectedConversationId === conversation.id ? "border-r-4 border-r-orange-500 bg-orange-50" : ""
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(conversation.status)}
                    <h4 className="flex-1 truncate text-sm font-medium text-gray-900">{conversation.clientName}</h4>
                    {conversation.unreadCount.admin > 0 ? (
                      <div className="flex-shrink-0 rounded-full bg-orange-500 px-2 py-1 text-xs text-white">
                        {conversation.unreadCount.admin}
                      </div>
                    ) : null}
                  </div>

                  <p className="truncate text-xs text-gray-500">
                    {conversation.orderId !== "suporte-geral"
                      ? `Pedido: ${conversation.orderProtocol || conversation.orderId}`
                      : "Suporte geral"}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={`px-2 py-1 text-xs ${getPriorityColor(conversation.priority)}`}>
                      {conversation.priority}
                    </Badge>
                    <Badge className={`px-2 py-1 text-xs ${getStatusColor(conversation.status)}`}>
                      {conversation.status}
                    </Badge>
                    {conversation.assignedAdmin ? (
                      <Badge variant="outline" className="px-2 py-1 text-xs">
                        <UserCheck className="mr-1 h-3 w-3" />
                        {conversation.assignedAdmin}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                    <div className="flex min-w-0 items-center space-x-1">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{conversation.clientEmail || "Sem email"}</span>
                    </div>

                    {conversation.lastMessage ? (
                      <div className="flex flex-shrink-0 items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className="whitespace-nowrap">
                          {formatDistanceToNow(conversation.lastMessage.timestamp, {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
