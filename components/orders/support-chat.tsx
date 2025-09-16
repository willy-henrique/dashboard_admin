"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  Bot,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Message {
  id: string
  sender: 'user' | 'support' | 'system'
  content: string
  timestamp: Date
  orderId?: string
  isRead: boolean
}

interface SupportChatProps {
  orderId?: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'user',
    content: 'Olá, gostaria de saber o status do meu pedido ORD-001',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    orderId: 'ORD-001',
    isRead: true
  },
  {
    id: '2',
    sender: 'support',
    content: 'Olá! Vou verificar o status do seu pedido para você. Um momento, por favor.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000),
    isRead: true
  },
  {
    id: '3',
    sender: 'support',
    content: 'Seu pedido ORD-001 está atualmente em andamento. O prestador João Silva foi atribuído e está a caminho do local. O tempo estimado de chegada é de 30 minutos.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60000),
    orderId: 'ORD-001',
    isRead: true
  },
  {
    id: '4',
    sender: 'user',
    content: 'Perfeito! Obrigado pela informação. Posso acompanhar em tempo real?',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: '5',
    sender: 'support',
    content: 'Sim! Você pode acompanhar o progresso do seu pedido através do painel do cliente. Também enviaremos notificações por email e SMS conforme o status for atualizado.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 30000),
    isRead: true
  },
  {
    id: '6',
    sender: 'user',
    content: 'Excelente! Muito obrigado pelo atendimento.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: true
  },
  {
    id: '7',
    sender: 'system',
    content: 'Pedido ORD-001 foi concluído com sucesso! O prestador finalizou o serviço e aguarda sua avaliação.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    orderId: 'ORD-001',
    isRead: false
  }
]

export function SupportChat({ orderId, clientName, clientEmail, clientPhone }: SupportChatProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: newMessage,
      timestamp: new Date(),
      orderId,
      isRead: false
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')

    // Simular resposta do suporte
    setIsTyping(true)
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'support',
        content: 'Obrigado pela sua mensagem! Nossa equipe de suporte está analisando sua solicitação e responderá em breve.',
        timestamp: new Date(),
        isRead: false
      }
      setMessages(prev => [...prev, supportMessage])
      setIsTyping(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getSenderInfo = (sender: Message['sender']) => {
    switch (sender) {
      case 'user':
        return {
          name: clientName || 'Cliente',
          avatar: <User className="h-4 w-4" />,
          color: 'bg-blue-500'
        }
      case 'support':
        return {
          name: 'Suporte',
          avatar: <MessageCircle className="h-4 w-4" />,
          color: 'bg-green-500'
        }
      case 'system':
        return {
          name: 'Sistema',
          avatar: <Bot className="h-4 w-4" />,
          color: 'bg-gray-500'
        }
    }
  }

  const getStatusIcon = (sender: Message['sender']) => {
    switch (sender) {
      case 'user':
        return <CheckCircle className="h-3 w-3 text-blue-500" />
      case 'support':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'system':
        return <AlertCircle className="h-3 w-3 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Informações do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Chat de Suporte</span>
          </CardTitle>
          <CardDescription>
            Atendimento em tempo real para dúvidas e suporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">{clientName || 'Cliente'}</p>
                <p className="text-xs text-gray-500">Cliente</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">{clientEmail || 'email@exemplo.com'}</p>
                <p className="text-xs text-gray-500">Email</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">{clientPhone || '(11) 99999-9999'}</p>
                <p className="text-xs text-gray-500">Telefone</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Conversa</CardTitle>
          {orderId && (
            <Badge variant="outline">Pedido: {orderId}</Badge>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96 p-4">
            <div className="space-y-4">
              {messages.map((message) => {
                const senderInfo = getSenderInfo(message.sender)
                return (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex space-x-2 max-w-xs lg:max-w-md ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={senderInfo.color}>
                          {senderInfo.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : message.sender === 'support'
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-yellow-100 text-yellow-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium">{senderInfo.name}</span>
                          {getStatusIcon(message.sender)}
                        </div>
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {format(message.timestamp, "HH:mm", { locale: ptBR })}
                          </span>
                          {message.orderId && (
                            <Badge variant="outline" className="text-xs">
                              {message.orderId}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-500">
                        <MessageCircle className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium">Suporte</span>
                        <Clock className="h-3 w-3 text-gray-500" />
                      </div>
                      <div className="flex space-x-1 mt-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Pressione Enter para enviar ou clique no botão
          </p>
        </CardContent>
      </Card>

      {/* Status do Atendimento */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Suporte Online</span>
            </div>
            <div className="text-xs text-gray-500">
              Tempo médio de resposta: 2 minutos
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
