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
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false) // Tema claro por padrão
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")
    
    try {
      await login({ email, password, rememberMe })
      router.push("/dashboard")
    } catch (error) {
      console.error("Erro no login:", error)
      setLoginError("Credenciais inválidas. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-[#6A00A8] via-[#8B1EFF] to-[#6A00A8]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Toggle Theme Button - Mobile First */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg ${isDarkMode ? 'bg-[#8B1EFF]/50 hover:bg-[#8B1EFF]/70 text-white' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
        >
          {isDarkMode ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 18.75c-3.728 0-6.75-3.022-6.75-6.75S8.272 5.25 12 5.25s6.75 3.022 6.75 6.75-3.022 6.75-6.75 6.75z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Lado esquerdo - Cards informativos */}
      <div className={`hidden lg:flex lg:w-1/2 p-12 flex-col justify-center transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-[#6A00A8]/50 to-[#8B1EFF]/50 backdrop-blur-sm' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>

        {/* Logo e Título */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF8C00] to-[#FFC93C] rounded-xl flex items-center justify-center shadow-lg animate-pulse">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-[#FF8C00] rounded-sm"></div>
              </div>
            </div>
            <div>
              <h1 className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>AquiResolve</h1>
              <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-white/80' : 'text-gray-600'}`}>Sistema Administrativo</p>
            </div>
          </div>
          
          <h2 className={`text-4xl font-bold mb-6 leading-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Gerencie seu negócio com inteligência
          </h2>
          
          <p className={`text-lg leading-relaxed max-w-md transition-colors duration-300 ${isDarkMode ? 'text-white/80' : 'text-gray-600'}`}>
            Sistema completo para gestão empresarial. Monitore, analise e tome decisões baseadas em dados precisos sobre suas operações.
          </p>
        </div>

        {/* Cards de Features */}
        <div className="grid grid-cols-1 gap-4">
          <div className={`flex items-start space-x-4 p-6 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:scale-105 ${isDarkMode ? 'bg-[#8B1EFF]/20 backdrop-blur-sm border-[#8B1EFF]/30' : 'bg-white border-gray-200'}`}>
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF8C00]/20 to-[#FFC93C]/20 rounded-lg flex items-center justify-center border border-[#FF8C00]/30 animate-bounce">
              <svg className="w-6 h-6 text-[#FF8C00]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div>
              <h3 className={`font-semibold text-lg mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Gestão Completa</h3>
              <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-white/80' : 'text-gray-600'}`}>Controle total sobre pedidos, clientes e operações do seu negócio.</p>
            </div>
          </div>
          
          <div className={`flex items-start space-x-4 p-6 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:scale-105 ${isDarkMode ? 'bg-[#8B1EFF]/20 backdrop-blur-sm border-[#8B1EFF]/30' : 'bg-white border-gray-200'}`}>
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF8C00]/20 to-[#FFC93C]/20 rounded-lg flex items-center justify-center border border-[#FF8C00]/30 animate-bounce" style={{animationDelay: '0.2s'}}>
              <svg className="w-6 h-6 text-[#FF8C00]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h3 className={`font-semibold text-lg mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Analytics Avançado</h3>
              <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-white/80' : 'text-gray-600'}`}>Relatórios detalhados e insights para otimizar sua operação.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário de login */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-[#6A00A8]/80 to-[#8B1EFF]/80' : 'bg-white'}`}>
        <div className="w-full max-w-md">
          {/* Card do formulário */}
          <div className={`rounded-xl shadow-lg border p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl ${isDarkMode ? 'bg-[#8B1EFF]/20 backdrop-blur-sm border-[#8B1EFF]/30' : 'bg-white border-gray-200'}`}>
            {/* Header do formulário */}
            <div className="text-center mb-6 sm:mb-8 animate-fade-in-up">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF8C00] to-[#FFC93C] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Bem-vindo de volta</h2>
              <p className={`text-sm sm:text-base transition-colors duration-300 ${isDarkMode ? 'text-white/80' : 'text-gray-600'}`}>Entre com suas credenciais para acessar o sistema</p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              {/* Campo Email */}
              <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <label className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-white/90' : 'text-gray-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="admin@aquiresolve.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-12 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/50 ${isDarkMode ? 'bg-[#8B1EFF]/30 border border-[#8B1EFF]/50 text-white placeholder-white/60 focus:border-[#FF8C00]' : 'bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:border-[#FF8C00]'}`}
                  required
                />
              </div>

              {/* Campo Senha */}
              <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <label className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-white/90' : 'text-gray-700'}`}>
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full h-12 px-4 pr-12 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/50 ${isDarkMode ? 'bg-[#8B1EFF]/30 border border-[#8B1EFF]/50 text-white placeholder-white/60 focus:border-[#FF8C00]' : 'bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:border-[#FF8C00]'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${isDarkMode ? 'text-white/70 hover:text-[#FFC93C]' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Opções */}
              <div className="flex items-center justify-between animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <label className={`flex items-center space-x-2 text-sm transition-colors duration-300 ${isDarkMode ? 'text-white/90' : 'text-gray-700'}`}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#FF8C00] bg-transparent border-gray-300 rounded focus:ring-[#FF8C00] transition-colors duration-300" 
                  />
                  <span>Lembrar-me</span>
                </label>
                <a href="#" className="text-[#FF8C00] hover:text-[#FFC93C] text-sm transition-colors font-medium">
                  Esqueceu a senha?
                </a>
              </div>

              {/* Erro de login */}
              {loginError && (
                <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg animate-fade-in">
                  <p className="text-red-300 text-sm">{loginError}</p>
                </div>
              )}

              {/* Botão de Login */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-[#FF8C00] to-[#FFC93C] hover:from-[#FF8C00]/90 hover:to-[#FFC93C]/90 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg animate-fade-in-up"
                style={{animationDelay: '0.4s'}}
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
            <div className="mt-6 sm:mt-8 text-center animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-white/80' : 'text-gray-600'}`}>
                Sistema de Administração - AquiResolve
              </p>
              <p className={`text-xs mt-1 transition-colors duration-300 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                Versão 1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS para animações */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
