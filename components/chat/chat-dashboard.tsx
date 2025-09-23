"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatConversation } from "@/types/chat"
import { 
  MessageSquare, 
  Users, 
  Activity, 
  TrendingUp,
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Archive,
  BarChart3
} from "lucide-react"
import { ChatStatsCards } from "./chat-stats-cards"
import { ConversationsList } from "./conversations-list"
import { ChatMessages } from "./chat-messages"
import { AdminActionsPanel } from "./admin-actions-panel"
import { AdminLogs } from "./admin-logs"

export function ChatDashboard() {
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const handleSelectConversation = (conversation: ChatConversation) => {
    setSelectedConversation(conversation)
    setActiveTab("messages")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitoramento de Chat</h1>
          <p className="text-gray-600 mt-1">
            Gerencie conversas entre clientes e prestadores de serviço
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Shield className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <TrendingUp className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="conversations" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <MessageSquare className="h-4 w-4 mr-2" />
            Conversas
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Eye className="h-4 w-4 mr-2" />
            Mensagens
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            Logs Admin
          </TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <ChatStatsCards />
          
          {/* Ações Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white border-orange-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Urgentes</p>
                    <p className="text-xs text-gray-500">Requerem atenção imediata</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Ativas</p>
                    <p className="text-xs text-gray-500">Conversas em andamento</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pendentes</p>
                    <p className="text-xs text-gray-500">Aguardando resposta</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Archive className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Arquivadas</p>
                    <p className="text-xs text-gray-500">Conversas finalizadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas e Notificações */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                Alertas e Notificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-900">Conversas Urgentes</p>
                      <p className="text-sm text-gray-600">3 conversas com prioridade urgente</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-500 text-white">3</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-gray-900">Conversas Bloqueadas</p>
                      <p className="text-sm text-gray-600">1 conversa bloqueada por violação</p>
                    </div>
                  </div>
                  <Badge className="bg-red-500 text-white">1</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">Tempo de Resposta</p>
                      <p className="text-sm text-gray-600">5 conversas sem resposta há mais de 1 hora</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500 text-white">5</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversas */}
        <TabsContent value="conversations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConversationsList 
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversation?.id}
            />
            
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray-900">Informações da Conversa</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedConversation ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Detalhes</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cliente:</span>
                          <span className="font-medium">{selectedConversation.clienteName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Prestador:</span>
                          <span className="font-medium">{selectedConversation.prestadorName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge className={selectedConversation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {selectedConversation.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Prioridade:</span>
                          <Badge className={`${
                            selectedConversation.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            selectedConversation.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            selectedConversation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedConversation.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {selectedConversation.notes && (
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Notas Administrativas</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedConversation.notes}</p>
                      </div>
                    )}

                    <AdminActionsPanel 
                      conversation={selectedConversation}
                      onUpdate={() => setSelectedConversation({...selectedConversation})}
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p>Selecione uma conversa para ver os detalhes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mensagens */}
        <TabsContent value="messages">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            <div className="lg:col-span-1">
              <ConversationsList 
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversation?.id}
              />
            </div>
            
            <div className="lg:col-span-2">
              <ChatMessages conversation={selectedConversation} />
            </div>
          </div>
        </TabsContent>

        {/* Logs Administrativos */}
        <TabsContent value="logs">
          <AdminLogs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
