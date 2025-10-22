"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Logo } from "@/components/logo"
import { useMasterAuth } from "@/hooks/use-master-auth"
import { MasterDashboard } from "@/components/master/master-dashboard"
import {
  LogIn,
  Mail,
  Lock,
  Shield,
  AlertTriangle,
} from "lucide-react"

export default function MasterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { isMasterAuthenticated, masterLogin, masterUser, loading } = useMasterAuth()

  // Não redirecionar automaticamente - deixar o usuário tentar fazer login
  // useEffect(() => {
  //   if (!isMasterAuthenticated && masterUser === null) {
  //     // Se não está autenticado como master, redirecionar para dashboard
  //     router.push("/dashboard")
  //   }
  // }, [isMasterAuthenticated, masterUser, router])

  const handleMasterLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      await masterLogin(email, password)
      // Limpar campos após login bem-sucedido
      setEmail("")
      setPassword("")
    } catch (error) {
      console.error('Erro no login:', error)
      setError("Credenciais inválidas. Apenas administradores master podem acessar esta área.")
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50 to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Verificando autenticação...</p>
        </div>
      </main>
    )
  }

  // Se já está autenticado como master, mostrar dashboard
  if (isMasterAuthenticated && masterUser) {
    return <MasterDashboard />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50 to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mx-auto mb-4">
            <Logo className="h-16" showText={true} />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Shield className="h-6 w-6 text-orange-600" />
            <p className="text-orange-600 dark:text-orange-400 font-bold text-lg">
              Área Master
            </p>
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Acesso Exclusivo para Administradores Master
          </p>
        </div>

        {/* Card de Login Master */}
        <Card className="shadow-xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center space-x-2 text-slate-900 dark:text-white">
              <LogIn className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span>Login Master</span>
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Acesso restrito para configuração de permissões
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMasterLogin} className="space-y-6">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">
                  Email Master
                </Label>
                <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus-within:border-orange-500 dark:focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/20 dark:focus-within:ring-orange-400/20">
                  <div className="pl-3 pr-2 flex-shrink-0">
                    <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="master@aquiresolve.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 bg-transparent pl-0 pr-4 h-11 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-0 focus:border-0 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">
                  Senha Master
                </Label>
                <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus-within:border-orange-500 dark:focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/20 dark:focus-within:ring-orange-400/20">
                  <div className="pl-3 pr-2 flex-shrink-0">
                    <Lock className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-0 bg-transparent pl-0 pr-4 h-11 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-0 focus:border-0 focus:outline-none"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-medium focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-2 dark:focus:ring-offset-slate-900 active:translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Verificando...
                  </>
                ) : (
                  "Acessar Área Master"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                ← Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p className="font-medium">Sistema Master - AquiResolve</p>
          <p>Controle de Permissões e Usuários</p>
        </div>
      </div>
    </main>
  )
}
