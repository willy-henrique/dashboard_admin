"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useChatMessages, useChatActions } from "@/hooks/use-chat"
import { ChatMessage } from "@/types/chat"
import { LegacyChatConversation } from "@/lib/services/chat-service"
import { 
  Send, 
  User, 
  UserCheck, 
  Shield, 
  Image, 
  FileText, 
  MapPin, 
  Clock,
  AlertTriangle,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  Phone,
  Mail,
  Calendar
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatMessagesProps {
  conversation: LegacyChatConversation | null
}

export function ChatMessages({ conversation }: ChatMessagesProps) {
  const [messageText, setMessageText] = useState("")
  const [showAdminActions, setShowAdminActions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { messages, loading, error } = useChatMessages(conversation?.id || "")
  const { deleteMessage, addConversationNote } = useChatActions()

  // Debug: Log das mensagens recebidas
  console.log('🔍 ChatMessages - conversation:', conversation?.id)
  console.log('🔍 ChatMessages - messages:', messages)
  console.log('🔍 ChatMessages - loading:', loading)
  console.log('🔍 ChatMessages - error:', error)
  console.log('🔍 ChatMessages - messages.length:', messages.length)
  console.log('🔍 ChatMessages - messages content:', messages.map(m => ({ id: m.id, content: m.content, senderName: m.senderName })))

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getSenderIcon = (senderType: ChatMessage['senderType']) => {
    switch (senderType) {
      case 'cliente':
        return <User className="h-4 w-4 text-blue-500" />
      case 'prestador':
        return <UserCheck className="h-4 w-4 text-green-500" />
      case 'admin':
        return <Shield className="h-4 w-4 text-orange-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getSenderColor = (senderType: ChatMessage['senderType']) => {
    switch (senderType) {
      case 'cliente':
        return 'bg-blue-50 border-blue-200'
      case 'prestador':
        return 'bg-green-50 border-green-200'
      case 'admin':
        return 'bg-orange-50 border-orange-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getMessageIcon = (messageType: ChatMessage['messageType']) => {
    switch (messageType) {
      case 'image':
        return <Image className="h-4 w-4 text-green-500" />
      case 'file':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'location':
        return <MapPin className="h-4 w-4 text-red-500" />
      case 'system':
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (confirm("Tem certeza que deseja deletar esta mensagem?")) {
      await deleteMessage(messageId, "admin", "Administrador")
    }
  }

  const handleAddNote = async () => {
    if (messageText.trim() && conversation) {
      await addConversationNote(conversation.id, messageText, "admin", "Administrador")
      setMessageText("")
    }
  }

  if (!conversation) {
    console.log('🔍 ChatMessages - Estado: SEM CONVERSA')
    return (
      <Card className="bg-white h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>Selecione uma conversa para visualizar as mensagens</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  console.log('🔍 ChatMessages - CONVERSA SELECIONADA:', conversation.id, conversation.clientName)

  if (loading) {
    console.log('🔍 ChatMessages - Estado: LOADING')
    return (
      <Card className="bg-white h-full">
        <CardHeader>
          <CardTitle className="text-gray-900">Carregando mensagens...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-4 bg-gray-200 rounded w-4"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  console.log('🔍 ChatMessages - Estado: RENDERIZANDO', { loading, error, messagesLength: messages.length })

  // TESTE: Mensagens hardcoded para verificar se o componente funciona
  const testMessages = [
    {
      id: 'test1',
      chatId: conversation.id,
      senderId: 'test123',
      senderName: 'Cliente Teste',
      senderType: 'cliente' as const,
      content: 'Esta é uma mensagem de teste para verificar se o componente está funcionando.',
      messageType: 'text' as const,
      timestamp: new Date(),
      isRead: false,
      readBy: [],
      metadata: {}
    },
    {
      id: 'test2',
      chatId: conversation.id,
      senderId: 'test456',
      senderName: 'Prestador Teste',
      senderType: 'prestador' as const,
      content: 'Resposta de teste do prestador. O sistema está funcionando!',
      messageType: 'text' as const,
      timestamp: new Date(Date.now() - 60000),
      isRead: false,
      readBy: [],
      metadata: {}
    }
  ]

  console.log('🔍 ChatMessages - Mensagens de teste:', testMessages)

  if (error) {
    return (
      <Card className="bg-white h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Erro ao carregar mensagens: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white h-full flex flex-col">
      {/* Header da Conversa */}
      <CardHeader className="border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gray-900 text-lg">
              {conversation.clientName}
              {conversation.source === 'legacy' && (
                <span className="text-sm text-orange-600 ml-2">(Histórico)</span>
              )}
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                {conversation.clientPhone || "Sem telefone"}
              </div>
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                {conversation.clientEmail}
              </div>
              {conversation.orderId !== 'suporte-geral' && (
                <Badge variant="outline" className="text-xs">
                  Pedido: {conversation.orderId}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`${conversation.priority === 'urgent' ? 'bg-red-500' : 
                              conversation.priority === 'high' ? 'bg-orange-500' : 
                              conversation.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'} text-white`}>
              {conversation.priority}
            </Badge>
            <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'}>
              {conversation.status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdminActions(!showAdminActions)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Mensagens */}
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* TESTE: Mostrar tanto mensagens reais quanto de teste */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm font-medium">🔍 Debug: Mostrando mensagens reais + teste</p>
            <p className="text-blue-600 text-xs">Mensagens reais: {messages.length} | Mensagens teste: {testMessages.length}</p>
          </div>
          
          {/* Mensagens reais do Firebase */}
          {messages.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">📨 Mensagens Reais do Firebase:</h4>
              {messages.map((message) => {
                console.log('🔍 Renderizando mensagem REAL:', message.id, message.content, message.senderName)
                return (
                  <div
                    key={`real-${message.id}`}
                    className={`flex items-start space-x-3 p-3 rounded-lg border ${getSenderColor(message.senderType)} mb-2`}
                  >
                  <div className="flex-shrink-0">
                    {getSenderIcon(message.senderType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">
                        {message.senderName} (REAL)
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(message.timestamp, { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-700">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          )}
          
          {/* Mensagens de teste */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">🧪 Mensagens de Teste:</h4>
            {testMessages.map((message) => {
              console.log('🔍 Renderizando mensagem de teste:', message.id, message.content, message.senderName)
              return (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${getSenderColor(message.senderType)}`}
                >
                <div className="flex-shrink-0">
                  {getSenderIcon(message.senderType)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">
                      {message.senderName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(message.timestamp, { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                    {getMessageIcon(message.messageType)}
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    {message.messageType === 'image' && message.metadata?.imageUrl && (
                      <img 
                        src={message.metadata.imageUrl} 
                        alt="Imagem" 
                        className="max-w-xs rounded-lg mb-2"
                      />
                    )}
                    
                    {message.messageType === 'file' && (
                      <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{message.metadata?.fileName}</span>
                        <span className="text-xs text-gray-500">
                          ({(message.metadata?.fileSize || 0) / 1024} KB)
                        </span>
                      </div>
                    )}
                    
                    {message.messageType === 'location' && message.metadata?.location && (
                      <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{message.metadata.location.address}</span>
                      </div>
                    )}
                    
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDeleteMessage(message.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deletar mensagem
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      {/* Notas do Admin */}
      {showAdminActions && (
        <div className="border-t bg-gray-50 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Adicionar nota administrativa:
            </label>
            <Textarea
              placeholder="Digite uma nota para esta conversa..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="bg-white border-gray-200"
              rows={2}
            />
            <Button 
              onClick={handleAddNote}
              disabled={!messageText.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Edit className="h-4 w-4 mr-2" />
              Adicionar Nota
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
