"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useChatConversations, useChatActions } from "@/hooks/use-chat"
import { LegacyChatConversation } from "@/lib/services/chat-service"
import { 
  Search, 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  Mail
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ConversationsListProps {
  onSelectConversation: (conversation: LegacyChatConversation) => void
  selectedConversationId?: string
  initialProtocolo?: string | null
  initialServicoId?: string | null
  initialOrderId?: string | null
  compact?: boolean
}

export function ConversationsList({ onSelectConversation, selectedConversationId, initialProtocolo, initialServicoId, initialOrderId, compact = false }: ConversationsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  
  const { conversations, loading, error } = useChatConversations({ searchTerm })

  // Selecionar automaticamente a conversa baseada nos parâmetros iniciais
  useEffect(() => {
    if ((initialProtocolo || initialOrderId) && conversations.length > 0) {
      const matchingConversation = conversations.find(conv => 
        conv.orderProtocol === initialProtocolo || 
        conv.orderId === initialServicoId ||
        conv.orderId === initialOrderId
      )
      
      if (matchingConversation && matchingConversation.id !== selectedConversationId) {
        onSelectConversation(matchingConversation)
      }
    }
  }, [initialProtocolo, initialServicoId, initialOrderId, conversations, selectedConversationId, onSelectConversation])
  
  const { updateConversationStatus, updateConversationPriority, assignConversation } = useChatActions()

  const getStatusIcon = (status: LegacyChatConversation['status']) => {
    switch (status) {
      case 'active':
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case 'closed':
        return <Clock className="h-4 w-4 text-gray-500" />
      case 'archived':
        return <MessageSquare className="h-4 w-4 text-gray-400" />
      case 'blocked':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: LegacyChatConversation['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: LegacyChatConversation['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      case 'archived':
        return 'bg-blue-100 text-blue-800'
      case 'blocked':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="font-semibold text-gray-800">Carregando...</h3>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="font-semibold text-gray-800">Erro</h3>
        </div>
        <div className="flex-1 p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Erro ao carregar conversas: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Compacto */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">
            Conversas ({conversations.length})
          </h3>
        </div>
        
        {/* Busca Simplificada */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>
      </div>
      
      {/* Lista de Conversas */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>Nenhuma conversa encontrada</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  selectedConversationId === conversation.id 
                    ? 'bg-orange-50 border-r-4 border-r-orange-500' 
                    : ''
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(conversation.status)}
                    <h4 className="font-medium text-gray-900 text-sm truncate flex-1">
                      {conversation.clientName}
                      {conversation.source === 'legacy' && (
                        <span className="text-xs text-orange-600 ml-1">(Histórico)</span>
                      )}
                    </h4>
                    {conversation.unreadCount.admin > 0 && (
                      <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
                        {conversation.unreadCount.admin}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 truncate">
                    {conversation.orderId !== 'suporte-geral' ? `Pedido: ${conversation.orderId}` : 'Suporte Geral'}
                  </p>
                  
                  <div className="flex items-center space-x-2 flex-wrap">
                    <Badge className={`text-xs px-2 py-1 ${getPriorityColor(conversation.priority)}`}>
                      {conversation.priority}
                    </Badge>
                    <Badge className={`text-xs px-2 py-1 ${getStatusColor(conversation.status)}`}>
                      {conversation.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1 truncate">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{conversation.clientEmail}</span>
                    </div>
                    
                    {conversation.lastMessage && (
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Clock className="h-3 w-3" />
                        <span className="whitespace-nowrap">
                          {formatDistanceToNow(conversation.lastMessage.timestamp, { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </span>
                      </div>
                    )}
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
