"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useChatActions } from "@/hooks/use-chat"
import { LegacyChatConversation } from "@/lib/services/chat-service"
import { Shield, Archive, Ban, CheckCircle, Clock, Edit, UserPlus, AlertTriangle } from "lucide-react"

interface AdminActionsPanelProps {
  conversation: LegacyChatConversation
  onUpdate: () => void
}

export function AdminActionsPanel({ conversation, onUpdate }: AdminActionsPanelProps) {
  const [note, setNote] = useState("")
  const [priority, setPriority] = useState<LegacyChatConversation["priority"]>(conversation.priority)
  const [assignee, setAssignee] = useState(conversation.assignedAdmin || "")

  const {
    updateConversationStatus,
    updateConversationPriority,
    assignConversation,
    addConversationNote,
    loading,
  } = useChatActions()

  useEffect(() => {
    setPriority(conversation.priority)
    setAssignee(conversation.assignedAdmin || "")
  }, [conversation.assignedAdmin, conversation.priority])

  const handleStatusChange = async (newStatus: LegacyChatConversation["status"]) => {
    const success = await updateConversationStatus(conversation.id, newStatus)
    if (success) {
      onUpdate()
    }
  }

  const handlePriorityChange = async (newPriority: LegacyChatConversation["priority"]) => {
    setPriority(newPriority)
    const success = await updateConversationPriority(conversation.id, newPriority)
    if (success) {
      onUpdate()
    }
  }

  const handleAssignConversation = async () => {
    const normalizedAssignee = assignee.trim()
    if (!normalizedAssignee) {
      return
    }

    const success = await assignConversation(conversation.id, normalizedAssignee, normalizedAssignee)
    if (success) {
      onUpdate()
    }
  }

  const handleAddNote = async () => {
    const trimmedNote = note.trim()
    if (!trimmedNote) {
      return
    }

    const success = await addConversationNote(conversation.id, trimmedNote, "admin", "Administrador")
    if (success) {
      setNote("")
      onUpdate()
    }
  }

  const getStatusColor = (status: LegacyChatConversation["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "archived":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "blocked":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (value: LegacyChatConversation["priority"]) => {
    switch (value) {
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <Shield className="mr-2 h-5 w-5 text-orange-500" />
          Monitoramento administrativo
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-lg bg-gray-50 p-3">
          <h4 className="mb-2 font-medium text-gray-900">Estado atual</h4>
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(conversation.status)}>{conversation.status}</Badge>
            <Badge className={getPriorityColor(conversation.priority)}>{conversation.priority}</Badge>
            <Badge variant="outline">Mensagens: {conversation.messageCount || 0}</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Alterar status</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => handleStatusChange("active")} disabled={loading || conversation.status === "active"}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Ativar
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleStatusChange("closed")} disabled={loading || conversation.status === "closed"}>
              <Clock className="mr-2 h-4 w-4" />
              Fechar
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleStatusChange("archived")} disabled={loading || conversation.status === "archived"}>
              <Archive className="mr-2 h-4 w-4" />
              Arquivar
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleStatusChange("blocked")} disabled={loading || conversation.status === "blocked"}>
              <Ban className="mr-2 h-4 w-4" />
              Bloquear
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Prioridade</h4>
          <Select value={priority} onValueChange={(value) => handlePriorityChange(value as LegacyChatConversation["priority"])}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Responsavel</h4>
          <div className="flex gap-2">
            <Input value={assignee} onChange={(event) => setAssignee(event.target.value)} placeholder="Nome do responsavel" className="bg-white" />
            <Button type="button" variant="outline" onClick={handleAssignConversation} disabled={loading || !assignee.trim()}>
              <UserPlus className="mr-2 h-4 w-4" />
              Salvar
            </Button>
          </div>
          <p className="text-xs text-gray-500">Atual: {conversation.assignedAdmin || "Nao atribuido"}</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Notas internas</h4>
          {conversation.notes ? (
            <div className="max-h-32 overflow-y-auto rounded-md border bg-gray-50 p-3 text-sm whitespace-pre-wrap">
              {conversation.notes}
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-3 text-sm text-gray-500">Nenhuma nota registrada para esta conversa.</div>
          )}
          <Textarea placeholder="Adicionar nota administrativa" value={note} onChange={(event) => setNote(event.target.value)} rows={3} className="bg-white" />
          <Button type="button" onClick={handleAddNote} disabled={loading || !note.trim()} className="w-full bg-orange-500 text-white hover:bg-orange-600">
            <Edit className="mr-2 h-4 w-4" />
            Registrar nota
          </Button>
        </div>

        {conversation.priority === "urgent" ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="font-medium text-red-800">Conversa urgente</span>
            </div>
            <p className="mt-1 text-sm text-red-700">Este atendimento esta marcado com prioridade maxima.</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
