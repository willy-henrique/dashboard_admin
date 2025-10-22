"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Logo } from "@/components/logo"
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Database,
  Users,
  Settings,
  FileText
} from "lucide-react"

interface SetupResult {
  success: boolean
  message: string
  data?: {
    adminMaster: {
      email: string
      senha: string
      nome: string
    }
    usuarios: number
    estrutura: Record<string, string>
  }
  error?: string
  missing?: string[]
}

export default function SetupAdminMasterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SetupResult | null>(null)
  const [customEmail, setCustomEmail] = useState("master@aquiresolve.com")
  const [customPassword, setCustomPassword] = useState("admin123")
  const [customName, setCustomName] = useState("Administrador Master")

  const handleSetup = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/setup-adminmaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customEmail,
          password: customPassword,
          nome: customName
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: 'Erro ao executar setup',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50 to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mx-auto mb-4">
            <Logo className="h-16" showText={true} />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Shield className="h-6 w-6 text-orange-600" />
            <p className="text-orange-600 dark:text-orange-400 font-bold text-lg">
              Setup AdminMaster
            </p>
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Configuração inicial do sistema de permissões
          </p>
        </div>

        {/* Card de Setup */}
        <Card className="shadow-xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center space-x-2 text-slate-900 dark:text-white">
              <Database className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span>Configuração do Sistema</span>
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Criação da estrutura AdminMaster no Firebase
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Configurações do AdminMaster */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Configurações do AdminMaster
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">
                    Email Master
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="border-slate-300 dark:border-slate-600"
                    placeholder="master@aquiresolve.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">
                    Senha Master
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    className="border-slate-300 dark:border-slate-600"
                    placeholder="admin123"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome" className="text-slate-700 dark:text-slate-300 font-medium">
                  Nome do Administrador
                </Label>
                <Input
                  id="nome"
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="border-slate-300 dark:border-slate-600"
                  placeholder="Administrador Master"
                />
              </div>
            </div>

            {/* Estrutura que será criada */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Estrutura que será criada
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Database className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">AdminMaster</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Documento principal</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Usuários</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">3 usuários de exemplo</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Settings className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Configurações</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Sistema e permissões</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Logs</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Atividades do sistema</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Setup */}
            <Button 
              onClick={handleSetup}
              disabled={isLoading}
              className="w-full h-11 bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Configurando...
                </>
              ) : (
                "Configurar AdminMaster"
              )}
            </Button>

            {/* Resultado */}
            {result && (
              <div className={`p-4 rounded-lg border ${
                result.success 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-start space-x-3">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${
                      result.success 
                        ? 'text-green-900 dark:text-green-100' 
                        : 'text-red-900 dark:text-red-100'
                    }`}>
                      {result.message}
                    </p>
                    
                    {result.success && result.data && (
                      <div className="mt-3 space-y-2">
                        <div className="text-sm text-green-800 dark:text-green-200">
                          <p><strong>Email:</strong> {result.data.adminMaster.email}</p>
                          <p><strong>Senha:</strong> {result.data.adminMaster.senha}</p>
                          <p><strong>Usuários criados:</strong> {result.data.usuarios}</p>
                        </div>
                      </div>
                    )}
                    
                    {result.error && (
                      <p className="text-sm text-red-800 dark:text-red-200 mt-2">
                        Erro: {result.error}
                      </p>
                    )}
                    
                    {result.missing && result.missing.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          Variáveis ausentes: {result.missing.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Informações do Sistema */}
            <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              <p className="font-medium">Sistema AdminMaster - AquiResolve</p>
              <p>Configuração inicial do sistema de permissões</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}