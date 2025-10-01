"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  MessageCircle, 
  Send, 
  Clock, 
  User, 
  Mail, 
  Phone,
  CheckCircle,
  AlertCircle,
  Bot
} from "lucide-react"

interface Message {
  id: string
  sender: 'client' | 'support' | 'system'
  message: string
  timestamp: Date
  orderId?: string
  isRead?: boolean
}

interface SupportChatProps {
  orderId?: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
}

export function ProfessionalSupportChat({ 
  orderId, 
  clientName, 
  clientEmail, 
  clientPhone 
}: SupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Dados simulados baseados no exemplo do link
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "1",
        sender: 'client',
        message: "Olá, gostaria de saber o status do meu pedido ORD-001",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
        orderId: "ORD-001",
        isRead: true
      },
      {
        id: "2",
        sender: 'support',
        message: "Olá! Vou verificar o status do seu pedido para você. Um momento, por favor.",
        timestamp: new Date(Date.now() - 1000 * 60 * 29),
        isRead: true
      },
      {
        id: "3",
        sender: 'support',
        message: "Seu pedido ORD-001 está atualmente em andamento. O prestador João Silva foi atribuído e está a caminho do local. O tempo estimado de chegada é de 30 minutos.",
        timestamp: new Date(Date.now() - 1000 * 60 * 29),
        isRead: true
      },
      {
        id: "4",
        sender: 'client',
        message: "Perfeito! Obrigado pela informação. Posso acompanhar em tempo real?",
        timestamp: new Date(Date.now() - 1000 * 60 * 28),
        isRead: true
      },
      {
        id: "5",
        sender: 'support',
        message: "Sim! Você pode acompanhar o progresso do seu pedido através do painel do cliente. Também enviaremos notificações por email e SMS conforme o status for atualizado.",
        timestamp: new Date(Date.now() - 1000 * 60 * 28),
        isRead: true
      },
      {
        id: "6",
        sender: 'client',
        message: "Excelente! Muito obrigado pelo atendimento.",
        timestamp: new Date(Date.now() - 1000 * 60 * 27),
        isRead: true
      },
      {
        id: "7",
        sender: 'system',
        message: "Pedido ORD-001 foi concluído com sucesso! O prestador finalizou o serviço e aguarda sua avaliação.",
        timestamp: new Date(Date.now() - 1000 * 60 * 26),
        isRead: false
      }
    ]
    setMessages(mockMessages)
  }, [orderId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: 'support',
      message: newMessage,
      timestamp: new Date(),
      isRead: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")
    
    // Simular resposta automática
    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'client',
        message: "Obrigado pela resposta!",
        timestamp: new Date(),
        isRead: false
      }
      setMessages(prev => [...prev, autoReply])
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getSenderInfo = (sender: string) => {
    switch (sender) {
      case 'client':
        return { name: clientName || 'Cliente', icon: User, color: 'bg-gray-500' }
      case 'support':
        return { name: 'Suporte', icon: MessageCircle, color: 'bg-orange-500' }
      case 'system':
        return { name: 'Sistema', icon: Bot, color: 'bg-gray-500' }
      default:
        return { name: 'Usuário', icon: User, color: 'bg-gray-500' }
    }
  }

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="h-[600px] flex flex-col">
      {/* Informações do Cliente */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{clientName || 'Cliente'}</p>
              <p className="text-xs text-gray-500">Cliente</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{clientEmail || 'email@exemplo.com'}</p>
              <p className="text-xs text-gray-500">Email</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{clientPhone || '(11) 99999-9999'}</p>
              <p className="text-xs text-gray-500">Telefone</p>
            </div>
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const senderInfo = getSenderInfo(message.sender)
          const SenderIcon = senderInfo.icon
          
          return (
            <div
              key={message.id}
              className={`flex ${message.sender === 'support' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[70%] ${message.sender === 'support' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={senderInfo.color}>
                    <SenderIcon className="h-4 w-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                
                <div className={`rounded-lg p-3 ${
                  message.sender === 'support' 
                    ? 'bg-orange-500 text-white' 
                    : message.sender === 'system'
                    ? 'bg-gray-100 text-gray-800 border border-gray-200'
                    : 'bg-gray-500 text-white'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium">{senderInfo.name}</span>
                    {message.orderId && (
                      <Badge variant="secondary" className="text-xs">
                        {message.orderId}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm">{message.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-75">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.sender === 'support' && !message.isRead && (
                      <CheckCircle className="h-3 w-3 opacity-75" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-orange-500">
                  <MessageCircle className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
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

      {/* Área de Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
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
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">
            Pressione Enter para enviar ou clique no botão
          </p>
          <div className="flex items-center space-x-2 text-xs text-green-600">
            <CheckCircle className="h-3 w-3" />
            <span>Suporte Online</span>
          </div>
        </div>
        <div className="flex items-center justify-end mt-1">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Tempo médio de resposta: 2 minutos</span>
          </div>
        </div>
      </div>
    </div>
  )
}
