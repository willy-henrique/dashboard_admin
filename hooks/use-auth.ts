"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getDocument } from "@/lib/firestore"
import type { User } from "@/types"

interface AdminLogin {
  email: string
  password: string
  rememberMe?: boolean
}

interface AuthContextType {
  user: User | null
  login: (credentials: AdminLogin) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userData = await getDocument("users", firebaseUser.uid)
          if (userData && (userData.role === "admin" || userData.role === "operador")) {
            setUser(userData as User)
          } else {
            // Fallback for demo - create mock admin user
            const mockUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              nome: "Administrador",
              role: "admin",
              status: "ativo",
              createdAt: new Date(),
            }
            setUser(mockUser)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          // Fallback for demo
          const mockUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            nome: "Administrador",
            role: "admin",
            status: "ativo",
            createdAt: new Date(),
          }
          setUser(mockUser)
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (credentials: AdminLogin) => {
    try {
      // Try Firebase auth first
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      // User state will be updated by onAuthStateChanged
      router.push("/dashboard")
    } catch (error) {
      // Fallback for demo - allow mock credentials
      if (credentials.email === "admin@appservico.com" && credentials.password === "admin123") {
        const userData: User = {
          id: "demo-admin",
          email: credentials.email,
          nome: "Administrador",
          role: "admin",
          status: "ativo",
          createdAt: new Date(),
        }

        setUser(userData)
        router.push("/dashboard")
      } else {
        throw new Error("Credenciais inválidas")
      }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
