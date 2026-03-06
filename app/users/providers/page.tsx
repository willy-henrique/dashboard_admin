"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { ProvidersTable } from "@/components/users/providers-table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserCheck, Users, Shield, RefreshCw } from "lucide-react"
import { PageWithBack } from "@/components/layout/page-with-back"
import { FirebaseProvidersService, type FirebaseProvider } from "@/lib/services/firebase-providers"

const isVerifiedProvider = (provider: FirebaseProvider) => {
  const status = String((provider as any).verificationStatus || "").toLowerCase()
  return ["verificado", "verified", "approved"].includes(status)
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<FirebaseProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchProviders = useCallback(async () => {
    setLoading(true)
    try {
      const data = await FirebaseProvidersService.getProviders()
      setProviders(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders, refreshKey])

  const stats = useMemo(() => {
    const total = providers.length
    const active = providers.filter((provider) => provider.status !== "offline").length
    const verified = providers.filter(isVerifiedProvider).length
    const inactive = providers.filter((provider) => provider.status === "offline").length

    return { total, active, verified, inactive }
  }, [providers])

  return (
    <AppShell>
      <PageWithBack backButtonLabel="Voltar para Dashboard">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestao de Prestadores</h1>
              <p className="mt-1 text-gray-600">A listagem agora usa a colecao real `providers`, sem fallback de `users` ou debug.</p>
            </div>
            <Button variant="outline" onClick={() => setRefreshKey((value) => value + 1)} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-gray-500">Ativos</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-gray-500">Verificados</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.verified}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-gray-500">Offline</p>
                  <p className="text-3xl font-bold text-gray-700">{stats.inactive}</p>
                </div>
                <RefreshCw className="h-8 w-8 text-gray-500" />
              </CardContent>
            </Card>
          </div>

          <ProvidersTable key={refreshKey} />
        </div>
      </PageWithBack>
    </AppShell>
  )
}
