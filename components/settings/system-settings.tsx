"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Server, HardDrive, Cpu, MemoryStick, Globe, RefreshCw, AlertTriangle } from "lucide-react"

export function SystemSettings() {
  const [systemInfo] = useState({
    version: "1.2.3",
    environment: "production",
    uptime: "15 dias, 8 horas",
    lastUpdate: "2024-03-01",
    nextMaintenance: "2024-03-15",
  })

  const [systemHealth] = useState({
    cpu: 45,
    memory: 68,
    disk: 32,
    network: 12,
  })

  const [services] = useState([
    { name: "API Principal", status: "online", uptime: "99.9%" },
    { name: "Base de Dados", status: "online", uptime: "99.8%" },
    { name: "Servidor de Email", status: "online", uptime: "98.5%" },
    { name: "Sistema de Pagamentos", status: "online", uptime: "99.7%" },
    { name: "Notificações Push", status: "warning", uptime: "95.2%" },
    { name: "Backup Automático", status: "online", uptime: "100%" },
  ])

  const [integrations] = useState([
    { name: "Firebase", status: "connected", lastSync: "2024-03-11 14:30" },
    { name: "Stripe", status: "connected", lastSync: "2024-03-11 14:25" },
    { name: "SendGrid", status: "connected", lastSync: "2024-03-11 14:20" },
    { name: "Google Maps", status: "connected", lastSync: "2024-03-11 14:15" },
    { name: "WhatsApp Business", status: "disconnected", lastSync: "2024-03-10 10:30" },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Online</Badge>
      case "warning":
        return <Badge className="bg-orange-100 text-orange-800">Atenção</Badge>
      case "offline":
      case "disconnected":
        return <Badge className="bg-red-100 text-red-800">Offline</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>
    }
  }

  const getHealthColor = (value: number) => {
    if (value < 50) return "bg-green-500"
    if (value < 80) return "bg-orange-500"
    return "bg-red-500"
  }

  const handleRestartService = (serviceName: string) => {
    alert(`Reiniciando ${serviceName}...`)
  }

  const handleTestIntegration = (integrationName: string) => {
    alert(`Testando integração com ${integrationName}...`)
  }

  const handleSystemUpdate = () => {
    alert("Verificando atualizações do sistema...")
  }

  const handleClearCache = () => {
    alert("Cache do sistema limpo com sucesso!")
  }

  return (
    <div className="space-y-6">
      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Informações do Sistema
          </CardTitle>
          <CardDescription>Detalhes sobre a versão e status do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Versão</p>
              <p className="text-lg font-semibold">{systemInfo.version}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ambiente</p>
              <Badge className="bg-blue-100 text-blue-800 mt-1">{systemInfo.environment}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tempo Online</p>
              <p className="text-lg font-semibold">{systemInfo.uptime}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Última Atualização</p>
              <p className="text-lg font-semibold">{systemInfo.lastUpdate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Próxima Manutenção</p>
              <p className="text-lg font-semibold">{systemInfo.nextMaintenance}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex gap-2">
            <Button onClick={handleSystemUpdate}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Verificar Atualizações
            </Button>
            <Button variant="outline" onClick={handleClearCache} className="bg-transparent">
              Limpar Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>Saúde do Sistema</CardTitle>
          <CardDescription>Monitoramento de recursos do servidor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">CPU</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={systemHealth.cpu} className="w-32" />
                <span className="text-sm font-medium">{systemHealth.cpu}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Memória</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={systemHealth.memory} className="w-32" />
                <span className="text-sm font-medium">{systemHealth.memory}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Disco</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={systemHealth.disk} className="w-32" />
                <span className="text-sm font-medium">{systemHealth.disk}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Rede</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={systemHealth.network} className="w-32" />
                <span className="text-sm font-medium">{systemHealth.network}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Serviços</CardTitle>
          <CardDescription>Monitoramento dos serviços principais da plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(service.status)}
                  {service.status === "warning" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestartService(service.name)}
                      className="bg-transparent"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reiniciar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Integrações Externas</CardTitle>
          <CardDescription>Status das integrações com serviços externos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{integration.name}</p>
                  <p className="text-sm text-gray-600">Última sincronização: {integration.lastSync}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(integration.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestIntegration(integration.name)}
                    className="bg-transparent"
                  >
                    Testar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas do Sistema
          </CardTitle>
          <CardDescription>Notificações importantes sobre o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-800">Manutenção Programada</p>
                <p className="text-sm text-orange-700">
                  Manutenção do sistema agendada para 15/03/2024 às 02:00. Duração estimada: 2 horas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <RefreshCw className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Atualização Disponível</p>
                <p className="text-sm text-blue-700">Nova versão 1.2.4 disponível com melhorias de segurança.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
