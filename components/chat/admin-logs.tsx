"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminAction } from "@/types/chat"
import { 
  Shield, 
  User, 
  Clock, 
  AlertTriangle,
  Archive,
  Ban,
  Star,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  MessageSquare
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export function AdminLogs() {
  const [logs, setLogs] = useState<AdminAction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    action: "all",
    admin: "all",
    search: ""
  })

  // Simulação de dados - em produção, viria do Firestore
  useEffect(() => {
    const mockLogs: AdminAction[] = [
      {
        id: "1",
        chatId: "chat1",
        adminId: "admin1",
        adminName: "Administrador",
        action: "priority_change",
        details: "Prioridade alterada de 'Média' para 'Alta'",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
        metadata: { oldPriority: "medium", newPriority: "high" }
      },
      {
        id: "2",
        chatId: "chat2",
        adminId: "admin2",
        adminName: "Moderador",
        action: "block",
        details: "Conversa bloqueada por uso de linguagem inadequada",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h atrás
      },
      {
        id: "3",
        chatId: "chat1",
        adminId: "admin1",
        adminName: "Administrador",
        action: "note_add",
        details: "Cliente relatou problema com prestador. Investigar.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3h atrás
      },
      {
        id: "4",
        chatId: "chat3",
        adminId: "admin2",
        adminName: "Moderador",
        action: "assign",
        details: "Conversa atribuída para investigação",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5h atrás
      },
      {
        id: "5",
        chatId: "chat2",
        adminId: "admin1",
        adminName: "Administrador",
        action: "message_delete",
        details: "Mensagem deletada: 'conteúdo inadequado'",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6h atrás
      }
    ]
    
    setLogs(mockLogs)
    setLoading(false)
  }, [])

  const getActionIcon = (action: AdminAction['action']) => {
    switch (action) {
      case 'block':
        return <Ban className="h-4 w-4 text-red-500" />
      case 'unblock':
        return <Ban className="h-4 w-4 text-green-500" />
      case 'archive':
        return <Archive className="h-4 w-4 text-blue-500" />
      case 'unarchive':
        return <Archive className="h-4 w-4 text-green-500" />
      case 'assign':
        return <User className="h-4 w-4 text-purple-500" />
      case 'unassign':
        return <User className="h-4 w-4 text-gray-500" />
      case 'priority_change':
        return <Star className="h-4 w-4 text-orange-500" />
      case 'note_add':
        return <Edit className="h-4 w-4 text-blue-500" />
      case 'message_delete':
        return <Trash2 className="h-4 w-4 text-red-500" />
      default:
        return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionColor = (action: AdminAction['action']) => {
    switch (action) {
      case 'block':
      case 'message_delete':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'unblock':
      case 'unarchive':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'archive':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'assign':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'priority_change':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'note_add':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesAction = filter.action === "all" || log.action === filter.action
    const matchesAdmin = filter.admin === "all" || log.adminName.toLowerCase().includes(filter.admin.toLowerCase())
    const matchesSearch = filter.search === "" || 
      log.details.toLowerCase().includes(filter.search.toLowerCase()) ||
      log.adminName.toLowerCase().includes(filter.search.toLowerCase())
    
    return matchesAction && matchesAdmin && matchesSearch
  })

  if (loading) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">Carregando logs...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center">
          <Shield className="h-5 w-5 text-orange-500 mr-2" />
          Logs de Atividades Administrativas
        </CardTitle>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar logs..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
          
          <Select 
            value={filter.action} 
            onValueChange={(value) => setFilter(prev => ({ ...prev, action: value }))}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Ação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Ações</SelectItem>
              <SelectItem value="block">Bloquear</SelectItem>
              <SelectItem value="unblock">Desbloquear</SelectItem>
              <SelectItem value="archive">Arquivar</SelectItem>
              <SelectItem value="assign">Atribuir</SelectItem>
              <SelectItem value="priority_change">Alterar Prioridade</SelectItem>
              <SelectItem value="note_add">Adicionar Nota</SelectItem>
              <SelectItem value="message_delete">Deletar Mensagem</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filter.admin} 
            onValueChange={(value) => setFilter(prev => ({ ...prev, admin: value }))}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Administrador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Admins</SelectItem>
              <SelectItem value="Administrador">Administrador</SelectItem>
              <SelectItem value="Moderador">Moderador</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>Nenhum log encontrado</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 border-l-4 border-l-orange-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(log.action)}
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          {log.adminName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Chat ID: {log.chatId}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getActionColor(log.action)}`}>
                        {log.action.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(log.timestamp, { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">
                    {log.details}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {log.timestamp.toLocaleString('pt-BR')}
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
