"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, LogOut, User, Settings, LayoutDashboard } from "lucide-react" // Fixed import to use LayoutDashboard from lucide-react

export function Header() {
  const { user, logout } = useAuth()

  return (
    <>
      {/* Payment Alert Banner - matching AutEM design */}
      <div className="bg-orange-500 text-white px-6 py-3">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 rounded-full p-2">
            <Bell className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Pagamento em aberto!</h3>
            <p className="text-sm opacity-90">
              Prezado cliente, consta(m) em nosso sistema fatura(s) em aberto de sua empresa. Regularize o(s) débito(s)
              o mais rápido possível pra evitar a suspensão do sistema. Se já efetuou o pagamento, envie o comprovante
              para <span className="font-semibold">financeiro@satellitus.com</span> e entre em contato para solicitar a
              baixa.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-30"
          >
            VISUALIZAR FATURAS...
          </Button>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-gray-900 shadow-sm border-b border-gray-700">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-lg">A</span>
                </div>
              </div>
              <nav className="flex space-x-6">
                <a
                  href="/dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium flex items-center"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </a>
                <a href="/services" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                  Serviços
                </a>
                <a href="/control" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                  Controle
                </a>
                <a href="/financial" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                  Financeiro
                </a>
                <a href="/settings" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                  Configurações
                </a>
                <a href="/reports" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                  Relatórios
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Telli Button */}
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">telli</Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative text-gray-300 hover:text-white">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  1
                </span>
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-orange-500 text-white">
                        {user?.name?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
