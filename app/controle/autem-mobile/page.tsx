"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Download, Users, Activity } from "lucide-react"

const mobileStats = {
  totalUsuarios: 45,
  usuariosAtivos: 32,
  versaoAtual: "2.1.4",
  ultimaAtualizacao: "2025-01-10",
  downloads: 1250,
}

const recentActivity = [
  {
    usuario: "João Silva",
    acao: "Login realizado",
    timestamp: "2025-01-15 10:30",
    dispositivo: "Android 12",
  },
  {
    usuario: "Maria Santos",
    acao: "Serviço aceito",
    timestamp: "2025-01-15 09:45",
    dispositivo: "iOS 16",
  },
  {
    usuario: "Pedro Costa",
    acao: "Localização atualizada",
    timestamp: "2025-01-15 09:30",
    dispositivo: "Android 11",
  },
]

export default function AutEMMobilePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AutEM Mobile</h1>
          <p className="text-gray-600">autem.com.br › controle › autem mobile</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold">{mobileStats.totalUsuarios}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold">{mobileStats.usuariosAtivos}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Versão Atual</p>
                  <p className="text-2xl font-bold">{mobileStats.versaoAtual}</p>
                </div>
                <Smartphone className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Downloads</p>
                  <p className="text-2xl font-bold">{mobileStats.downloads}</p>
                </div>
                <Download className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento do App</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Versão atual:</span>
                <Badge>{mobileStats.versaoAtual}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Última atualização:</span>
                <span className="text-sm text-gray-600">{mobileStats.ultimaAtualizacao}</span>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">Enviar Atualização</Button>
                <Button variant="outline">Configurações</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{activity.usuario}</p>
                      <p className="text-sm text-gray-600">{activity.acao}</p>
                      <p className="text-xs text-gray-400">{activity.dispositivo}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
