"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useChatActions } from "@/hooks/use-chat"
import { LegacyChatConversation } from "@/lib/services/chat-service"
import { 
  Shield, 
  Archive, 
  Unarchive, 
  Block, 
  Unlock, 
  Star, 
  Edit, 
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AdminActionsPanelProps {
  conversation: LegacyChatConversation
  onUpdate: () => void
}

export function AdminActionsPanel({ conversation, onUpdate }: AdminActionsPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<string>("")
  const [note, setNote] = useState("")
  const [priority, setPriority] = useState<ChatConversation['priority']>(conversation.priority)
  
  const { 
    updateConversationStatus, 
    updateConversationPriority, 
    assignConversation, 
    addConversationNote,
    loading 
  } = useChatActions()

  const handleStatusChange = async (newStatus: LegacyChatConversation['status']) => {
    const success = await updateConversationStatus(conversation.id, newStatus)
    if (success) {
      onUpdate()
    }
  }

  const handlePriorityChange = async (newPriority: LegacyChatConversation['priority']) => {
    const success = await updateConversationPriority(conversation.id, newPriority)
    if (success) {
      setPriority(newPriority)
      onUpdate()
    }
  }

  const handleAddNote = async () => {
    if (note.trim()) {
      const success = await addConversationNote(conversation.id, note, "admin", "Administrador")
      if (success) {
        setNote("")
        setIsDialogOpen(false)
        onUpdate()
      }
    }
  }

  const getStatusColor = (status: LegacyChatConversation['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'archived':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: LegacyChatConversation['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center">
          <Shield className="h-5 w-5 text-orange-500 mr-2" />
          Ações Administrativas
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Atual */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Status Atual</h4>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(conversation.status)}>
              {conversation.status}
            </Badge>
            <Badge className={getPriorityColor(conversation.priority)}>
              {conversation.priority}
            </Badge>
          </div>
        </div>

        {/* Controle de Status */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Alterar Status</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={conversation.status === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('active')}
              disabled={loading || conversation.status === 'active'}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Ativar
            </Button>
            
            <Button
              variant={conversation.status === 'closed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('closed')}
              disabled={loading || conversation.status === 'closed'}
            >
              <Clock className="h-4 w-4 mr-2" />
              Fechar
            </Button>
            
            <Button
              variant={conversation.status === 'archived' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('archived')}
              disabled={loading || conversation.status === 'archived'}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Archive className="h-4 w-4 mr-2" />
              Arquivar
            </Button>
            
            <Button
              variant={conversation.status === 'blocked' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('blocked')}
              disabled={loading || conversation.status === 'blocked'}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Block className="h-4 w-4 mr-2" />
              Bloquear
            </Button>
          </div>
        </div>

        {/* Controle de Prioridade */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Alterar Prioridade</h4>
          <Select value={priority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Atribuição */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Atribuir Conversa</h4>
          <div className="flex space-x-2">
            <Input 
              placeholder="ID do administrador" 
              className="flex-1 bg-white"
            />
            <Button 
              variant="outline" 
              size="sm"
              disabled={loading}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Atribuir
            </Button>
          </div>
        </div>

        {/* Notas Administrativas */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Notas Administrativas</h4>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full bg-white">
                <Edit className="h-4 w-4 mr-2" />
                Adicionar Nota
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nota Administrativa</DialogTitle>
                <DialogDescription>
                  Adicione uma nota privada sobre esta conversa. Esta nota será visível apenas para administradores.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="Digite sua nota..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="bg-white"
                  rows={4}
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddNote}
                  disabled={!note.trim() || loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Adicionar Nota
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Histórico de Ações */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Histórico de Ações</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            <div className="p-2 bg-gray-50 rounded text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Conversa criada</span>
                <span className="text-gray-500 text-xs">há 2 horas</span>
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Prioridade alterada para "Alta"</span>
                <span className="text-gray-500 text-xs">há 1 hora</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {conversation.priority === 'urgent' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="font-medium text-red-800">Conversa Urgente</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              Esta conversa requer atenção imediata.
            </p>
          </div>
        )}

        {conversation.status === 'blocked' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Block className="h-5 w-5 text-red-500" />
              <span className="font-medium text-red-800">Conversa Bloqueada</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              Esta conversa foi bloqueada por violação das regras.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
