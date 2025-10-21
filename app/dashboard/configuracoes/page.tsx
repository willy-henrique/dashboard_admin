"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, UserCheck, Database, Shield, CheckCircle, AlertTriangle } from "lucide-react"
import { SyncPanel } from "@/components/financial/sync-panel"

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Configurações do Sistema
          </h1>
          <p className="text-gray-600">
            Gerencie configurações e sincronização de dados
          </p>
        </div>
      </div>

      {/* Painel de Sincronização */}
      <SyncPanel />

      {/* Cards de Navegação */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Settings className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Configurações principais do sistema e parâmetros gerais
            </p>
            <div className="mt-4">
              <Button variant="ghost" size="sm">
                Gerenciar →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <UserCheck className="h-5 w-5" />
              Equipes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Gestão de equipes e responsabilidades
            </p>
            <div className="mt-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/dashboard/configuracoes/equipes">Ver equipes →</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Status do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">Sistema Online</p>
                  <p className="text-sm text-green-600">Funcionando normalmente</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-800">Firebase</p>
                  <p className="text-sm text-blue-600">Conectado</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">Pagar.me</p>
                  <p className="text-sm text-green-600">Integrado</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
