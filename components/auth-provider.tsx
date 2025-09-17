"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, onAuthStateChanged, signInAnonymously } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Login automático em desenvolvimento
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !user && !loading) {
      signInAnonymously(auth).catch(console.error)
    }
  }, [user, loading])

  const login = async ({ email, password, rememberMe }: { email: string; password: string; rememberMe?: boolean }) => {
    // Implementar login real aqui se necessário
    console.log('Login:', { email, password, rememberMe })
  }

  const logout = async () => {
    // Implementar logout real aqui se necessário
    console.log('Logout')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
