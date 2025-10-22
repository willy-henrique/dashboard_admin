"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Database, 
  Users, 
  Settings,
  Shield,
  AlertTriangle
} from "lucide-react"

export default function SetupAdminMasterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const createAdminMasterCollection = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/setup-adminmaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || 'Erro ao criar coleção')
      }
    } catch (err) {
      setError('Erro de conexão: ' + (err instanceof Error ? err.message : 'Erro desconhecido'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50 to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mx-auto mb-4">
            <Logo className="h-16" showText={true} />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Database className="h-6 w-6 text-orange-600" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Configuração do Sistema Master
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Crie a coleção 'adminmaster' no Firebase
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
              <Shield className="h-5 w-5 text-orange-600" />
              <span>Configuração da Coleção AdminMaster</span>
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Esta ação criará a coleção 'adminmaster' no Firebase com dados iniciais
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Estrutura da Coleção */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Estrutura que será criada:
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 font-mono text-sm">
                <div className="text-slate-700 dark:text-slate-300">
                  <div>📦 adminmaster/</div>
                  <div className="ml-4">├── 📄 master (AdminMaster principal)</div>
                  <div className="ml-8">└── 📁 usuarios/ (Subcoleção)</div>
                  <div className="ml-12">├── joao_at_aquiresolve.com</div>
                  <div className="ml-12">├── maria_at_aquiresolve.com</div>
                  <div className="ml-12">└── pedro_at_aquiresolve.com</div>
                  <div className="ml-4">└── 📄 config (Configurações)</div>
                </div>
              </div>
            </div>

            {/* Credenciais */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Credenciais de Acesso:
              </h3>
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800 dark:text-orange-200">
                    Credenciais Padrão
                  </span>
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  <div><strong>Email:</strong> master@aquiresolve.com</div>
                  <div><strong>Senha:</strong> admin123</div>
                  <div className="mt-2 text-xs">
                    ⚠️ Altere a senha padrão em produção!
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Ação */}
            <div className="flex justify-center">
              <Button
                onClick={createAdminMasterCollection}
                disabled={isLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Criando Coleção...
                  </>
                ) : (
                  <>
                    <Database className="h-5 w-5 mr-2" />
                    Criar Coleção AdminMaster
                  </>
                )}
              </Button>
            </div>

            {/* Resultado */}
            {result && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">
                    Coleção criada com sucesso!
                  </span>
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  <div className="mb-2">
                    <strong>Estrutura criada:</strong>
                  </div>
                  <div className="ml-4">
                    <div>✅ Coleção: adminmaster</div>
                    <div>✅ AdminMaster principal</div>
                    <div>✅ Subcoleção de usuários</div>
                    <div>✅ Configurações do sistema</div>
                  </div>
                  <div className="mt-3">
                    <strong>Usuários criados:</strong>
                    <ul className="ml-4 mt-1">
                      {result.data?.usuarios?.map((user: any, index: number) => (
                        <li key={index}>• {user.nome} ({user.email})</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3 p-2 bg-green-100 dark:bg-green-800/30 rounded">
                    <strong>Próximo passo:</strong> Acesse <code>/master</code> para gerenciar usuários
                  </div>
                </div>
              </div>
            )}

            {/* Erro */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800 dark:text-red-200">
                    Erro ao criar coleção
                  </span>
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              </div>
            )}

            {/* Informações Adicionais */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                O que esta ação faz:
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Cria a coleção 'adminmaster' no Firebase</li>
                <li>• Adiciona o AdminMaster principal com todas as permissões</li>
                <li>• Cria usuários de exemplo com diferentes permissões</li>
                <li>• Configura as regras básicas do sistema</li>
                <li>• Permite acesso à rota /master</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
