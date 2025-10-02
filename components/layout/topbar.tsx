"use client"

import { useState } from "react"
import { Menu, Search, Bell, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  return (
    <header className="sticky top-0 z-40" style={{ 
      backgroundColor: 'var(--card)', 
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
            style={{ color: 'var(--foreground)' }}
            aria-label="Abrir menu lateral"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Campo de Busca */}
          <div className="relative hidden md:block">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" 
              style={{ color: 'var(--muted-foreground)' }}
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-80 h-9 text-sm"
              style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                borderColor: 'var(--border)'
              }}
              aria-label="Buscar no sistema"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative" 
            style={{ color: 'var(--foreground)' }}
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
            <span 
              className="absolute -top-1 -right-1 h-3 w-3 rounded-full" 
              style={{ backgroundColor: 'var(--primary)' }}
              aria-label="3 notificações não lidas"
            />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-2" 
                style={{ color: 'var(--foreground)' }}
                aria-label="Menu do usuário"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:block text-sm">
                  {user?.displayName || user?.email || "Usuário"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56" 
              style={{
                backgroundColor: 'var(--popover)',
                color: 'var(--popover-foreground)',
                borderColor: 'var(--border)'
              }}
            >
              <DropdownMenuLabel className="font-medium">
                Minha Conta
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                style={{ color: 'var(--popover-foreground)' }}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem 
                style={{ color: 'var(--popover-foreground)' }}
                className="cursor-pointer"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notificações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout} 
                style={{ color: 'var(--popover-foreground)' }}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
