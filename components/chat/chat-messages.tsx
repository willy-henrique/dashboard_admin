"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useChatMessages, useChatActions } from "@/hooks/use-chat"
import { ChatMessage } from "@/types/chat"
import { LegacyChatConversation } from "@/lib/services/chat-service"
import { User, UserCheck, Shield, FileText, MapPin, AlertTriangle, Trash2, MoreVertical, Phone, Mail, Image, MessageCircle } from "lucide-react"
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, loading, error } = useChatMessages(conversation?.id || "")
  const { deleteMessage } = useChatActions()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getSenderIcon = (senderType: ChatMessage["senderType"]) => {
    switch (senderType) {
      case "cliente":
        return <User className="h-4 w-4 text-blue-500" />
      case "prestador":
        return <UserCheck className="h-4 w-4 text-green-500" />
      case "admin":
        return <Shield className="h-4 w-4 text-orange-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getSenderColor = (senderType: ChatMessage["senderType"]) => {
    switch (senderType) {
      case "cliente":
        return "bg-blue-50 border-blue-200"
      case "prestador":
        return "bg-green-50 border-green-200"
      case "admin":
        return "bg-orange-50 border-orange-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getMessageIcon = (messageType: ChatMessage["messageType"]) => {
    switch (messageType) {
      case "image":
        return <Image className="h-4 w-4 text-green-500" />
      case "file":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "location":
        return <MapPin className="h-4 w-4 text-red-500" />
      case "system":
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getImageUrl = (message: ChatMessage): string | undefined => {
    const url = message.metadata?.imageUrl ?? message.metadata?.mediaUrl ?? message.metadata?.attachmentUrl
    if (url) return url

    const documentUrl = message.metadata?.documentUrl
    if (!documentUrl) return undefined

    const extension = documentUrl.split(".").pop()?.split("?")[0]?.toLowerCase()
    return extension && ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(extension)
      ? documentUrl
      : undefined
  }

  const handleDeleteMessage = async (message: ChatMessage) => {
    if (!confirm("Tem certeza que deseja deletar esta mensagem?")) {
      return
    }

    await deleteMessage(
      { id: message.id, chatId: message.chatId, content: message.content },
      "admin",
      "Administrador"
    )
  }

  if (!conversation) {
    return (
      <Card className="flex h-full bg-white">
        <CardContent className="flex h-full items-center justify-center">
          <div className="text-center text-gray-500">
            <User className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p>Selecione uma conversa para visualizar as mensagens</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="flex h-full bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">Carregando mensagens...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-lg border p-4">
              <div className="mb-2 flex items-center space-x-2">
                <div className="h-4 w-4 rounded bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-3 w-16 rounded bg-gray-200" />
              </div>
              <div className="mb-2 h-4 w-full rounded bg-gray-200" />
              <div className="h-3 w-2/3 rounded bg-gray-200" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="flex h-full bg-white">
        <CardContent className="flex h-full items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <p className="text-red-600">Erro ao carregar mensagens: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex h-full flex-col bg-white">
      <CardHeader className="border-b bg-gray-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg text-gray-900">{conversation.clientName}</CardTitle>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Phone className="mr-1 h-3 w-3" />
                {conversation.clientPhone || "Sem telefone"}
              </div>
              <div className="flex items-center">
                <Mail className="mr-1 h-3 w-3" />
                {conversation.clientEmail || "Sem email"}
              </div>
              <Badge variant="outline" className="text-xs">
                {conversation.orderProtocol || conversation.orderId || "Sem pedido"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="text-white bg-slate-600">{conversation.priority}</Badge>
            <Badge variant={conversation.status === "active" ? "default" : "secondary"}>{conversation.status}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map((message) => {
              const imageUrl = getImageUrl(message)

              return (
                <div key={message.id} className={`flex items-start space-x-3 rounded-lg border p-3 ${getSenderColor(message.senderType)}`}>
                  <div className="flex-shrink-0">{getSenderIcon(message.senderType)}</div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{message.senderName}</span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(message.timestamp, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                      {getMessageIcon(message.messageType)}
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                      {imageUrl ? (
                        <div className="space-y-1">
                          <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block transition-opacity hover:opacity-90">
                            <img src={imageUrl} alt="Imagem do chat" className="max-h-64 max-w-xs cursor-pointer rounded-lg border object-contain" loading="lazy" />
                          </a>
                          <p className="text-xs text-muted-foreground">Clique para ampliar</p>
                        </div>
                      ) : null}

                      {message.messageType === "file" ? (
                        <div className="flex items-center space-x-2 rounded border bg-white p-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{message.metadata?.fileName || "Arquivo"}</span>
                        </div>
                      ) : null}

                      {message.messageType === "location" && message.metadata?.location ? (
                        <div className="flex items-center space-x-2 rounded border bg-white p-2">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{message.metadata.location.address}</span>
                        </div>
                      ) : null}

                      {message.content && !(imageUrl && /^Imagem enviada\.?$/i.test(message.content.trim())) ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : null}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDeleteMessage(message)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar mensagem
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
            <MessageCircle className="mb-4 h-12 w-12 opacity-50" />
            <p className="text-sm">Nenhuma mensagem nesta conversa ainda.</p>
            <p className="mt-1 text-xs">As mensagens reais do pedido aparecerao aqui.</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>
    </Card>
  )
}
