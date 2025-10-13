"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Smartphone, 
  LogIn, 
  LogOut, 
  Route, 
  XCircle, 
  Users,
  Activity,
  Wifi,
  Battery,
  MapPin,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

export default function AutEMMobilePage() {
  const stats = {
    totalUsuarios: 6,
    conectados: 4,
    desconectados: 2,
    totalAcessos: 156,
    quilometragemTotal: 23,
    recusas: 8,
    rastreamentos: 45
  }

  return (
    <main className="flex-1 space-y-6 p-4 sm:p-6" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-col sm:flex-row">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">AutEM Mobile</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Controle e monitoramento do aplicativo móvel
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
          <Activity className="h-4 w-4 mr-2" />
          Status do Sistema
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Usuários Ativos</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.conectados}/{stats.totalUsuarios}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <LogIn className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total de Acessos</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalAcessos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Route className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Quilometragem</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.quilometragemTotal}km</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Recusas</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.recusas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Módulos do AutEM Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Acessos */}
        <Link href="/dashboard/controle/autem-mobile/acessos">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <LogIn className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">Acessos</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Log de conexões</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Conexões Hoje</span>
                  <Badge variant="secondary">{stats.totalAcessos}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Última Atividade</span>
                  <span className="text-xs text-slate-500">2 min atrás</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Usuários Ativos</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">{stats.conectados}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Quilometragem */}
        <Link href="/dashboard/controle/autem-mobile/quilometragem">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <Route className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">Quilometragem</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Distância percorrida</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Hoje</span>
                  <Badge variant="secondary">{stats.quilometragemTotal}km</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Profissionais</span>
                  <Badge variant="outline">2</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Precisão Média</span>
                  <span className="text-xs text-slate-500">7m</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Rastreamento */}
        <Link href="/dashboard/controle/autem-mobile/rastreamento">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">Rastreamento</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Localização em tempo real</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Ativos</span>
                  <Badge variant="secondary">{stats.rastreamentos}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Última Atualização</span>
                  <span className="text-xs text-slate-500">30s atrás</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Sinal</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">LTE/WIFI</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Recusas */}
        <Link href="/dashboard/controle/autem-mobile/recusas">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">Recusas</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Serviços recusados</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Hoje</span>
                  <Badge variant="secondary">{stats.recusas}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Taxa de Recusa</span>
                  <span className="text-xs text-slate-500">5.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Motivo Principal</span>
                  <span className="text-xs text-slate-500">Distância</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Usuários */}
        <Link href="/dashboard/controle/autem-mobile/usuarios">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">Usuários</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Profissionais conectados</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total</span>
                  <Badge variant="secondary">{stats.totalUsuarios}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Online</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">{stats.conectados}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Offline</span>
                  <Badge variant="outline" className="text-red-600 border-red-200">{stats.desconectados}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Status do Sistema */}
        <Card className="hover:shadow-lg transition-all duration-200" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Activity className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-slate-900 dark:text-white">Status do Sistema</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">Monitoramento geral</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">API Status</span>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Database</span>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Conectado
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Firebase</span>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ativo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status em Tempo Real */}
      <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
        <CardHeader>
          <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span>Status em Tempo Real</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">JOCIMAR</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Online - v1.0.206</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">ANTONIO</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Online - v1.0.206</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">MICHEL</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Offline - v1.0.204</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
