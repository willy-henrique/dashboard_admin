"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Logo } from "@/components/logo"
// Imports removidos - apenas mantendo o essencial

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")
    
    try {
      await login({ email, password, rememberMe: false })
      router.push("/dashboard")
    } catch (error) {
      console.error("Erro no login:", error)
      setLoginError("Credenciais inválidas. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mx-auto mb-4">
            <Logo className="h-16 text-white" showText={true} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-blue-100">
            Entre com suas credenciais para acessar o sistema
          </p>
        </div>

        {/* Card de Login */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@aquiresolve.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  required
                />
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  required
                />
              </div>

              {/* Erro de login */}
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">{loginError}</p>
                </div>
              )}

              {/* Botão de Login */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  "Entrar no Sistema"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <div className="mt-6 text-center text-sm text-blue-200">
          <p>Sistema de Administração - AquiResolve</p>
          <p>Versão 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
