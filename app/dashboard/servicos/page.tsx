"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  TrendingUp
} from "lucide-react"
import Link from "next/link"

export default function ServicosPage() {
  const stats = {
    total: 156,
    pendentes: 23,
    emAndamento: 45,
    concluidos: 88,
    orcamentos: 34
  }

  return (
    <main className="flex-1 space-y-6 p-6" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Serviços</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerenciamento completo de serviços e logística
          </p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ClipboardList className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total de Serviços</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pendentes</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pendentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Em Andamento</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.emAndamento}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Concluídos</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.concluidos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Orçamentos</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.orcamentos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Módulos de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Painel Logístico */}
        <Link href="/dashboard/servicos/painel-logistico">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">Painel Logístico</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Rastreamento em tempo real</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Agendamentos Hoje</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Em Trânsito</span>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">8</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Concluídos</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">4</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Visualizar Serviços */}
        <Link href="/dashboard/servicos/visualizar">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">Visualizar</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Lista completa de serviços</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total de Registros</span>
                  <Badge variant="secondary">{stats.total}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Última Atualização</span>
                  <span className="text-xs text-slate-500">2 min atrás</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Filtros Ativos</span>
                  <Badge variant="outline">3</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Orçamento */}
        <Link href="/dashboard/servicos/orcamento">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <Calculator className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">Orçamento</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Gestão de orçamentos</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Orçamentos Ativos</span>
                  <Badge variant="secondary">{stats.orcamentos}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Aguardando Aprovação</span>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">7</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Aprovados Hoje</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">3</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Ações Rápidas */}
      <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
        <CardHeader>
          <CardTitle className="text-lg text-slate-900 dark:text-white">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Plus className="h-5 w-5" />
              <span className="text-sm">Novo Serviço</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Agendar</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm">Rastrear</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">Equipe</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
