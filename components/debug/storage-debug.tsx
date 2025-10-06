"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllPendingProviders } from "@/lib/storage"
import { RefreshCw, Bug, FileText, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export const StorageDebug = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const testStorageAccess = async () => {
    setLoading(true)
    setError(null)
    setResults([])
    
    try {
      console.log('🔧 Iniciando teste de acesso ao Storage...')
      const providers = await getAllPendingProviders()
      
      console.log('📊 Resultados do teste:', providers)
      setResults(providers)
      
      if (providers.length === 0) {
        setError('Nenhum prestador encontrado no Storage')
      }
    } catch (err) {
      console.error('❌ Erro no teste:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-2 border-dashed border-orange-300 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Bug className="h-5 w-5" />
          Debug do Firebase Storage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testStorageAccess}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          {loading ? "Testando..." : "Testar Acesso ao Storage"}
        </Button>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Erro:</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">
                {results.length} prestador(es) encontrado(s)
              </span>
            </div>
            
            {results.map((provider, index) => (
              <div key={index} className="p-3 bg-white border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{provider.providerId}</span>
                  <Badge variant="outline">
                    {Object.keys(provider.documents).length} tipos
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  {Object.entries(provider.documents).map(([type, docs]: [string, any]) => (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{type}:</span>
                      <span className="font-medium">{docs?.length || 0} documentos</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  Enviado: {new Date(provider.uploadedAt).toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results.length === 0 && !error && (
          <p className="text-gray-600 text-sm">
            Clique em "Testar Acesso ao Storage" para verificar se os documentos estão sendo carregados.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
