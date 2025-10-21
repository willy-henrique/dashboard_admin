"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import {
  Users,
  DollarSign,
  ShoppingCart,
  BarChart3,
  CheckCircle,
  Eye,
  Settings,
  LogIn,
  Mail,
  Lock,
} from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simular login bem-sucedido
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push("/dashboard")
    } catch (error) {
      console.error("Erro no login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mx-auto mb-4">
            <Logo className="h-16" showText={true} />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Painel Administrativo
          </p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center space-x-2 text-slate-900 dark:text-white">
              <LogIn className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>Login Administrativo</span>
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Acesse o sistema de administração
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">
                  Email
                </Label>
                <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20">
                  <div className="pl-3 pr-2 flex-shrink-0">
                    <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@aquiresolve.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 bg-transparent pl-0 pr-4 h-11 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-0 focus:border-0 focus:outline-none"
                    required
                    aria-describedby="email-error"
                    aria-invalid={email && !email.includes('@') ? "true" : "false"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">
                  Senha
                </Label>
                <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20">
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
                    aria-describedby="password-error"
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                >
                  Lembrar de mim
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 dark:focus:ring-offset-slate-900 active:translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isLoading}
                aria-describedby="login-error"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Entrando...
                  </>
                ) : (
                  "Entrar no Sistema"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a 
                href="#" 
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1 py-0.5 transition-colors"
              >
                Esqueceu sua senha?
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p className="font-medium">Sistema de Administração - AquiResolve</p>
          <p>Versão 1.0.0</p>
        </div>
      </div>
    </main>
  )
}
