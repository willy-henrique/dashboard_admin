"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Truck, 
  Clock, 
  MapPin, 
  Phone, 
  MoreHorizontal,
  Edit,
  Copy,
  Navigation,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Upload,
  FileText,
  Layout,
  Bell,
  Target,
  Info,
  Volume2,
  Calendar,
  Key,
  Home,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react"

interface Agendamento {
  id: string
  tipo: string
  data: string
  horario: string
  protocolo: string
  cliente: string
  endereco: string
  status: 'pendente' | 'acionado' | 'em_transito' | 'concluido'
  servicos: number
}

export default function PainelLogisticoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null)

  const agendamentos: Agendamento[] = [
    {
      id: "1",
      tipo: "Agendamento",
      data: "13/08",
      horario: "08:00 às 12:00",
      protocolo: "2025073039...",
      cliente: "DOUGLAS KO...",
      endereco: "Vila Velha - ES (Coqueiral De Itapari.....)",
      status: "acionado",
      servicos: 2
    },
    {
      id: "2",
      tipo: "Agendamento",
      data: "13/08",
      horario: "13:00 às 15:00",
      protocolo: "49919929/1",
      cliente: "SONIA MARC...",
      endereco: "Vila Velha - ES (Praia Itaparica)",
      status: "pendente",
      servicos: 1
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-4 w-4 text-red-500" />
      case 'acionado':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'em_transito':
        return <Truck className="h-4 w-4 text-blue-500" />
      case 'concluido':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'acionado':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'em_transito':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'concluido':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <main className="flex-1 space-y-6 p-6" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Truck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Painel Logístico</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              autem.com.br &gt; serviços &gt; painel logístico
            </p>
          </div>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Barra de Ações */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-1" />
          Importar
        </Button>
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-1" />
          Buscar
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-1" />
          Filtrar
        </Button>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-1" />
          Atualizar
        </Button>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-1" />
          Relatório
        </Button>
        <Button variant="outline" size="sm">
          <Layout className="h-4 w-4 mr-1" />
          Layout
        </Button>
      </div>

      {/* Barra de Notificações */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
        </Button>
        <Button variant="outline" size="sm">
          <Target className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Info className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Volume2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Barra de Busca */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="PROTOCOLO"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex-1">
          <Input
            placeholder="BUSCA RÁPIDA"
            className="max-w-xs"
          />
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div className="space-y-4">
        {agendamentos.map((agendamento) => (
          <Card 
            key={agendamento.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}
            onClick={() => setSelectedAgendamento(agendamento)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                {/* Informações Principais */}
                <div className="flex items-start space-x-4 flex-1">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {getStatusIcon(agendamento.status)}
                  </div>

                  {/* Detalhes do Agendamento */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {agendamento.tipo}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {agendamento.data} {agendamento.horario}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Key className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {agendamento.protocolo}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Home className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        - {agendamento.cliente}
                      </span>
                    </div>

                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Chav. Resid. - Banestes
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Acionado...
                      </span>
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {agendamento.endereco}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <Badge className={`${getStatusColor(agendamento.status)}`}>
                    {agendamento.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Contador de Serviços */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {agendamento.servicos} SERVIÇO(S)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botões Flutuantes */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
        <Button className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg">
          <Plus className="h-5 w-5" />
        </Button>
        <Button className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
          <Phone className="h-5 w-5" />
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
        Copyright © 2025 AutEM v2.2.1 Todos os direitos reservados
      </div>
    </main>
  )
}
