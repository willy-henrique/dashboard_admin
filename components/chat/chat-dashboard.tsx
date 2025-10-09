"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LegacyChatConversation } from "@/lib/services/chat-service"
import { 
  MessageSquare, 
  Users, 
  AlertTriangle,
  Clock,
  Activity,
  TrendingUp,
  Shield,
  Zap,
  Filter,
  Search,
  Settings,
  Bell,
  Eye,
  Archive,
  MoreHorizontal,
  Phone,
  Video,
  UserCheck,
  MessageCircle,
  BarChart3
} from "lucide-react"
import { ChatStatsCards } from "./chat-stats-cards"
import { ConversationsList } from "./conversations-list"
import { ChatMessages } from "./chat-messages"
import { cn } from "@/lib/utils"

interface ChatDashboardProps {
  initialProtocolo?: string | null
  initialServicoId?: string | null
  initialOrderId?: string | null
}

export function ChatDashboard({ initialProtocolo, initialServicoId, initialOrderId }: ChatDashboardProps) {
  const [selectedConversation, setSelectedConversation] = useState<LegacyChatConversation | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const handleSelectConversation = (conversation: LegacyChatConversation) => {
    setSelectedConversation(conversation)
  }

  const urgentConversations = 3 // Dados mock - substituir por dados reais
  const noResponseConversations = 5 // Dados mock - substituir por dados reais

  return (
    <div className="space-y-6">
      {/* Header Profissional */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Central de Atendimento</h1>
          <p className="text-muted-foreground">
            Monitoramento e gestão de conversas em tempo real
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Relatórios
          </Button>
          <Button className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Nova Conversa
          </Button>
        </div>
      </div>

      {/* Alertas de Urgência */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-red-200 bg-red-50/50 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900">Conversas Urgentes</h3>
                  <p className="text-sm text-red-700">Requerem atenção imediata</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">{urgentConversations}</div>
                <Badge variant="destructive" className="text-xs">Alta Prioridade</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-900">Sem Resposta</h3>
                  <p className="text-sm text-orange-700">Aguardando há mais de 1 hora</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">{noResponseConversations}</div>
                <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">Pendente</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Principais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Métricas de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChatStatsCards />
        </CardContent>
      </Card>

      {/* Tabs de Navegação */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="conversations">Conversas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Conversas Compacta */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Conversas Ativas
                  </span>
                  <Badge variant="secondary">12</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  <ConversationsList 
                    onSelectConversation={handleSelectConversation}
                    selectedConversationId={selectedConversation?.id}
                    initialProtocolo={initialProtocolo}
                    initialServicoId={initialServicoId}
                    initialOrderId={initialOrderId}
                    compact={true}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Métricas Rápidas */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Indicadores de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2.3m</div>
                    <p className="text-sm text-muted-foreground">Tempo Médio de Resposta</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <p className="text-sm text-muted-foreground">Taxa de Satisfação</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">18</div>
                    <p className="text-sm text-muted-foreground">Conversas Hoje</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">4.8</div>
                    <p className="text-sm text-muted-foreground">Avaliação Média</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conversas */}
        <TabsContent value="conversations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Conversas Completa */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Todas as Conversas
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] overflow-y-auto">
                  <ConversationsList 
                    onSelectConversation={handleSelectConversation}
                    selectedConversationId={selectedConversation?.id}
                    initialProtocolo={initialProtocolo}
                    initialServicoId={initialServicoId}
                    initialOrderId={initialOrderId}
                    compact={false}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Painel de Mensagens */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    {selectedConversation ? (
                      <span className="flex items-center gap-2">
                        <span className="truncate">{selectedConversation.clientName}</span>
                        <Badge variant="outline" className="text-xs">
                          {selectedConversation.orderProtocol || 'N/A'}
                        </Badge>
                      </span>
                    ) : (
                      "Selecione uma conversa"
                    )}
                  </span>
                  {selectedConversation && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] overflow-hidden">
                  <ChatMessages conversation={selectedConversation} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Volume de Conversas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Hoje</span>
                    <span className="font-semibold">18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Esta Semana</span>
                    <span className="font-semibold">127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Este Mês</span>
                    <span className="font-semibold">542</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tempo de Resposta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Média</span>
                    <span className="font-semibold text-green-600">2.3m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Mais Rápido</span>
                    <span className="font-semibold text-blue-600">0.8m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Mais Lento</span>
                    <span className="font-semibold text-orange-600">15.2m</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Satisfação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avaliação Média</span>
                    <span className="font-semibold text-yellow-600">4.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Positivas</span>
                    <span className="font-semibold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Neutras</span>
                    <span className="font-semibold text-gray-600">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}