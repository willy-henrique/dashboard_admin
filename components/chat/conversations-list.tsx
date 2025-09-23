"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useChatConversations, useChatActions } from "@/hooks/use-chat"
import { ChatConversation, ChatFilter } from "@/types/chat"
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Archive,
  Shield,
  User,
  UserCheck,
  Calendar,
  Phone,
  Mail
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ConversationsListProps {
  onSelectConversation: (conversation: ChatConversation) => void
  selectedConversationId?: string
}

export function ConversationsList({ onSelectConversation, selectedConversationId }: ConversationsListProps) {
  const [filter, setFilter] = useState<ChatFilter>({})
  const [searchTerm, setSearchTerm] = useState("")
  
  const { conversations, loading, error } = useChatConversations({
    ...filter,
    searchTerm: searchTerm || undefined
  })
  
  const { updateConversationStatus, updateConversationPriority, assignConversation } = useChatActions()

  const getStatusIcon = (status: ChatConversation['status']) => {
    switch (status) {
      case 'active':
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      case 'archived':
        return <Archive className="h-4 w-4 text-blue-500" />
      case 'blocked':
        return <Shield className="h-4 w-4 text-red-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: ChatConversation['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'urgent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: ChatConversation['status']) => {
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
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">Conversas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Erro ao carregar conversas: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center">
          <MessageSquare className="h-5 w-5 text-orange-500 mr-2" />
          Conversas ({conversations.length})
        </CardTitle>
        
        {/* Filtros */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Select 
              value={filter.status || "all"} 
              onValueChange={(value) => setFilter(prev => ({ ...prev, status: value === "all" ? undefined : value as ChatConversation['status'] }))}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="closed">Fechadas</SelectItem>
                <SelectItem value="archived">Arquivadas</SelectItem>
                <SelectItem value="blocked">Bloqueadas</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filter.priority || "all"} 
              onValueChange={(value) => setFilter(prev => ({ ...prev, priority: value === "all" ? undefined : value as ChatConversation['priority'] }))}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>Nenhuma conversa encontrada</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-l-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedConversationId === conversation.id 
                      ? 'bg-orange-50 border-l-orange-500' 
                      : 'border-l-transparent hover:border-l-orange-200'
                  }`}
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(conversation.status)}
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          {conversation.clienteName} ↔ {conversation.prestadorName}
                        </h4>
                        {conversation.orderProtocol && (
                          <p className="text-xs text-gray-500">Pedido: {conversation.orderProtocol}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Badge className={`text-xs ${getPriorityColor(conversation.priority)}`}>
                        {conversation.priority}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(conversation.status)}`}>
                        {conversation.status}
                      </Badge>
                    </div>
                  </div>

                  {conversation.lastMessage && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        <span className="font-medium">{conversation.lastMessage.senderName}:</span>{" "}
                        {conversation.lastMessage.content}
                      </p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(conversation.lastMessage.timestamp, { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {conversation.clienteName}
                      </div>
                      <div className="flex items-center">
                        <UserCheck className="h-3 w-3 mr-1" />
                        {conversation.prestadorName}
                      </div>
                    </div>

                    {conversation.unreadCount.admin > 0 && (
                      <Badge className="bg-orange-500 text-white text-xs">
                        {conversation.unreadCount.admin}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center text-xs text-gray-400 mt-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    Criada {formatDistanceToNow(conversation.createdAt, { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
