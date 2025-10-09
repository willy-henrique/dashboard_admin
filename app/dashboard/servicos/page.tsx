"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ClipboardList, 
  Truck, 
  Eye, 
  Calculator, 
  Plus,
  Calendar,
  MapPin,
  Users,
  Clock,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  BarChart3,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal
} from "lucide-react"
import Link from "next/link"
import { useAnalytics } from "@/hooks/use-analytics"
import { useServices } from "@/hooks/use-services"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function ServicosPage() {
  const { trackPageView, trackUserAction } = useAnalytics()
  const { services, stats, loading, error, refetch } = useServices()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTab, setSelectedTab] = useState("overview")

  useEffect(() => {
    trackPageView('Página de Serviços')
  }, [trackPageView])

  const handleNewService = () => {
    trackUserAction('novo_servico', 'servicos')
    // Implementar modal de novo serviço
  }

  const handleRefresh = () => {
    trackUserAction('atualizar_servicos', 'servicos')
    refetch()
  }

  // Filtrar serviços
  const filteredServices = services.filter(service => {
    const matchesSearch = service.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.protocolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.beneficiario?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || service.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Serviços recentes (últimos 10)
  const recentServices = filteredServices.slice(0, 10)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'agendado': { label: 'Agendado', variant: 'secondary', icon: Calendar, color: 'text-blue-600' },
      'aceito': { label: 'Aceito', variant: 'default', icon: CheckCircle, color: 'text-green-600' },
      'aguardando': { label: 'Aguardando', variant: 'outline', icon: Clock, color: 'text-yellow-600' },
      'nao_enviado': { label: 'Não Enviado', variant: 'destructive', icon: XCircle, color: 'text-red-600' },
      'em_andamento': { label: 'Em Andamento', variant: 'default', icon: Truck, color: 'text-orange-600' },
      'concluido': { label: 'Concluído', variant: 'default', icon: CheckCircle, color: 'text-green-600' },
      'cancelado': { label: 'Cancelado', variant: 'destructive', icon: XCircle, color: 'text-red-600' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['aguardando']
    const Icon = config.icon

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className={cn("h-3 w-3", config.color)} />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (prioridade: string) => {
    const priorityConfig = {
      'alta': { label: 'Alta', variant: 'destructive', color: 'text-red-600' },
      'media': { label: 'Média', variant: 'default', color: 'text-yellow-600' },
      'baixa': { label: 'Baixa', variant: 'secondary', color: 'text-green-600' }
    }

    const config = priorityConfig[prioridade as keyof typeof priorityConfig] || priorityConfig['media']

    return (
      <Badge variant={config.variant as any} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  return (
    <main className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Serviços</h1>
          <p className="text-muted-foreground">
            Gerenciamento completo de serviços e logística
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Atualizar
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={handleNewService}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-destructive">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Erro ao carregar serviços: {error}</p>
              <Button onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Serviços</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Em Andamento</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.emAndamento}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Concluídos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.concluidos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Estatísticas Detalhadas */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Estatísticas Detalhadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{stats.agendados}</p>
                    <p className="text-sm text-muted-foreground">Agendados</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{stats.aceitos}</p>
                    <p className="text-sm text-muted-foreground">Aceitos</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{stats.aguardando}</p>
                    <p className="text-sm text-muted-foreground">Aguardando</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{stats.cancelados}</p>
                    <p className="text-sm text-muted-foreground">Cancelados</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={handleNewService}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Serviço
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Rastrear
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Equipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Serviços */}
        <TabsContent value="services" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por empresa, protocolo ou beneficiário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="aceito">Aceito</SelectItem>
                    <SelectItem value="aguardando">Aguardando</SelectItem>
                    <SelectItem value="nao_enviado">Não Enviado</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Serviços */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Serviços Recentes</span>
                <Badge variant="secondary">{recentServices.length} de {services.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
              ) : recentServices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum serviço encontrado</p>
                  <p className="text-sm">Tente ajustar os filtros ou criar um novo serviço</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <ClipboardList className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{service.empresa || 'Empresa não informada'}</h4>
                          <p className="text-sm text-muted-foreground">
                            Protocolo: {service.protocolo || 'N/A'} • Beneficiário: {service.beneficiario || 'N/A'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(service.dataHora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(service.status)}
                        {service.prioridade && getPriorityBadge(service.prioridade)}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Módulos */}
        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Painel Logístico */}
            <Link href="/dashboard/servicos/painel-logistico">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Painel Logístico</CardTitle>
                      <p className="text-sm text-muted-foreground">Rastreamento em tempo real</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Agendamentos Hoje</span>
                      <Badge variant="secondary">{stats.agendados}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Em Trânsito</span>
                      <Badge variant="outline" className="text-orange-600 border-orange-200">{stats.emAndamento}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Concluídos</span>
                      <Badge variant="outline" className="text-green-600 border-green-200">{stats.concluidos}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Visualizar Serviços */}
            <Link href="/dashboard/servicos/visualizar">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Eye className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Visualizar</CardTitle>
                      <p className="text-sm text-muted-foreground">Lista completa de serviços</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total de Registros</span>
                      <Badge variant="secondary">{stats.total}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Última Atualização</span>
                      <span className="text-xs text-muted-foreground">
                        {loading ? 'Carregando...' : 'Agora'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status Ativos</span>
                      <Badge variant="outline">{Object.values(stats).filter(value => typeof value === 'number' && value > 0).length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Orçamento */}
            <Link href="/dashboard/servicos/orcamento">
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <Calculator className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Orçamento</CardTitle>
                      <p className="text-sm text-muted-foreground">Gestão de orçamentos</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Orçamentos Ativos</span>
                      <Badge variant="secondary">{stats.orcamentos}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Aguardando Aprovação</span>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-200">{stats.aguardando}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Aceitos</span>
                      <Badge variant="outline" className="text-green-600 border-green-200">{stats.aceitos}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}