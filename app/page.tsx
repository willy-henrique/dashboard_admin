"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
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
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Seção promocional */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 p-12 flex-col justify-center">
        {/* Logo e Título */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">AquiResolve</h1>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Seu sistema de gestão empresarial inteligente
          </h2>
          
          <p className="text-white/90 text-lg leading-relaxed max-w-md">
            Gerencie seu negócio com eficiência, otimize processos e alcance seus objetivos com a ajuda da nossa plataforma completa de administração.
          </p>
        </div>

        {/* Cards de Features */}
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center border border-purple-400/50">
              <svg className="w-6 h-6 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Gestão Completa</h3>
              <p className="text-white/80 text-sm">Controle total sobre pedidos, clientes e operações do seu negócio.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center border border-purple-400/50">
              <svg className="w-6 h-6 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Analytics Avançado</h3>
              <p className="text-white/80 text-sm">Relatórios detalhados e insights para otimizar sua operação.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário de login */}
      <div className="w-full lg:w-1/2 bg-black flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header do formulário */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h2>
            <p className="text-white/70">Entre com suas credenciais para acessar o sistema</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Campo Email */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>Email</span>
              </label>
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <span>Senha</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Opções */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-white text-sm">
                <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500" />
                <span>Lembrar-me</span>
              </label>
              <a href="#" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            {/* Erro de login */}
            {loginError && (
              <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm">{loginError}</p>
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/70 text-sm">
              Sistema de Administração - AquiResolve
            </p>
            <p className="text-white/50 text-xs mt-1">
              Versão 1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
