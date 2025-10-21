"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, CheckCircle, AlertCircle, Loader2, Cloud } from "lucide-react"
import { usePagarmeSync } from "@/hooks/use-pagarme-firebase"
import { useEffect } from "react"

export function SyncPanel() {
  const { syncAll, syncing, lastSync, getSyncStatus } = usePagarmeSync()

  useEffect(() => {
    getSyncStatus()
  }, [])

  const handleSync = async () => {
    const result = await syncAll()
    if (result.success) {
      alert(`✅ Sincronização concluída!\n\nPedidos: ${result.data?.orders || 0}\nCobranças: ${result.data?.charges || 0}\nClientes: ${result.data?.customers || 0}`)
    } else {
      alert(`❌ Erro na sincronização: ${result.error}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Sincronização Pagar.me ↔ Firebase
            </CardTitle>
            <CardDescription>
              Sincronize os dados do Pagar.me com o banco de dados local
            </CardDescription>
          </div>
          <Button 
            onClick={handleSync} 
            disabled={syncing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {syncing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sincronizar Agora
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status da última sincronização */}
          {lastSync && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Pedidos</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{lastSync.orders || 0}</p>
                <p className="text-xs text-green-600">Sincronizados</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Cobranças</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{lastSync.charges || 0}</p>
                <p className="text-xs text-blue-600">Sincronizadas</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Clientes</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{lastSync.customers || 0}</p>
                <p className="text-xs text-purple-600">Sincronizados</p>
              </div>
            </div>
          )}

          {/* Informações */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Como funciona</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Os dados do Pagar.me são sincronizados com o Firebase</li>
              <li>• Webhooks atualizam automaticamente em tempo real</li>
              <li>• Você pode forçar uma sincronização manual aqui</li>
              <li>• Limite de 100 registros por sincronização</li>
            </ul>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={getSyncStatus} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Verificar Status
            </Button>
            <Button variant="outline" size="sm">
              <Database className="h-4 w-4 mr-2" />
              Ver Logs
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

