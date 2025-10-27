"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Logo } from "@/components/logo"
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  // Validação em tempo real
  useEffect(() => {
    if (email && !email.includes('@')) {
      setEmailError("Email inválido")
    } else {
      setEmailError("")
    }
  }, [email])

  useEffect(() => {
    if (password && password.length < 6) {
      setPasswordError("Senha deve ter pelo menos 6 caracteres")
    } else {
      setPasswordError("")
    }
  }, [password])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsAnimating(true)
    setLoginError("")
    
    try {
      await login({ email, password, rememberMe })
      // Pequeno delay para mostrar a animação de sucesso
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      console.error("Erro no login:", error)
      setLoginError("Credenciais inválidas. Tente novamente.")
      setIsAnimating(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background com gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        {/* Elementos flutuantes animados */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl animate-bounce"></div>
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Lado esquerdo - Informações e branding */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                      <Logo className="h-12 text-white" showText={false} />
                    </div>
                    <div className="text-white">
                      <div className="text-4xl font-bold tracking-tight">
                        <span className="text-white drop-shadow-lg">Aqui</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 drop-shadow-lg">Resolve</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                  Painel <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 drop-shadow-lg">Administrativo</span>
                </h1>
                <p className="text-xl text-white/90 max-w-md mx-auto lg:mx-0 drop-shadow-md font-medium">
                  Gerencie seu negócio com eficiência e precisão através da nossa plataforma completa
                </p>
              </div>
            </div>

            {/* Features destacadas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center space-x-3 p-4 bg-white/15 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg hover:bg-white/20 transition-all duration-200">
                <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center border border-green-400/50">
                  <Target className="h-5 w-5 text-green-300" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">Controle Total</p>
                  <p className="text-white/80 text-xs">Gestão completa</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-white/15 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg hover:bg-white/20 transition-all duration-200">
                <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center border border-blue-400/50">
                  <TrendingUp className="h-5 w-5 text-blue-300" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">Analytics</p>
                  <p className="text-white/80 text-xs">Relatórios detalhados</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-white/15 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg hover:bg-white/20 transition-all duration-200">
                <div className="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center border border-purple-400/50">
                  <Zap className="h-5 w-5 text-purple-300" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">Performance</p>
                  <p className="text-white/80 text-xs">Alta velocidade</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado direito - Formulário de login */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl transform transition-all duration-500 hover:scale-105">
              <CardHeader className="text-center pb-8 pt-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Acesso Administrativo
                </CardTitle>
                <p className="text-gray-600">
                  Entre com suas credenciais para acessar o sistema
                </p>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Campo Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className={`h-5 w-5 transition-colors ${emailError ? 'text-red-500' : email ? 'text-green-500' : 'text-gray-300'}`} />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@aquiresolve.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-12 h-12 border-2 transition-all duration-200 ${
                          emailError 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : email 
                              ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                        } rounded-xl bg-gray-50 focus:bg-white`}
                        required
                      />
                      {email && !emailError && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Campo Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                      Senha
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className={`h-5 w-5 transition-colors ${passwordError ? 'text-red-500' : password ? 'text-green-500' : 'text-gray-300'}`} />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-12 pr-12 h-12 border-2 transition-all duration-200 ${
                          passwordError 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : password 
                              ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                        } rounded-xl bg-gray-50 focus:bg-white`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-gray-500 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {passwordError}
                      </p>
                    )}
                  </div>

                  {/* Checkbox Lembrar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        className="border-2 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-lg"
                      />
                      <Label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                        Lembrar de mim
                      </Label>
                    </div>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      Esqueceu a senha?
                    </a>
                  </div>

                  {/* Erro de login */}
                  {loginError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 text-sm">{loginError}</p>
                    </div>
                  )}

                  {/* Botão de Login */}
                  <Button 
                    type="submit" 
                    className={`w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      isAnimating ? 'animate-pulse' : ''
                    }`}
                    disabled={isLoading || !!emailError || !!passwordError}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        <span>Entrando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Entrar no Sistema</span>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Informações do sistema */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/15 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-white text-sm font-semibold">Sistema Online</span>
              </div>
              <p className="text-white/80 text-sm mt-3 font-medium">
                AquiResolve Admin v1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS personalizados */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}
