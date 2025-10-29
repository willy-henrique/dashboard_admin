"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"
import { usePermissions } from "@/hooks/use-permissions"
import { useAuth } from "@/components/auth-provider"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Settings,
  Shield,
  FileText,
  MessageSquare,
  MapPin,
  Calendar,
  TrendingUp,
  Activity,
  Bell,
  Database,
  Key,
  LogOut,
  X,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle,
  Star,
  ClipboardList,
  MousePointer,
  Smartphone,
  Wifi,
  Route,
  XCircle,
  Package,
  Truck,
  Download,
  Building,
  Wrench,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: "dashboard",
  },
  {
    name: "Serviços",
    href: "/dashboard/servicos",
    icon: ClipboardList,
    permission: "dashboard",
  },
  {
    name: "Controle",
    icon: MousePointer,
    permission: "controle",
    children: [
      { name: "AutEM Mobile", href: "/dashboard/controle/autem-mobile", icon: Smartphone },
      { name: "Monitoramento de Chat", href: "/dashboard/controle/chat", icon: MessageSquare },
    ],
  },
  {
    name: "Gestão de Usuários",
    icon: Users,
    permission: "gestaoUsuarios",
    children: [
      { name: "Clientes", href: "/users/clients", icon: Users },
      { name: "Prestadores", href: "/users/providers", icon: UserCheck },
      { name: "Verificações", href: "/users/verifications", icon: Shield },
    ],
  },
  {
    name: "Gestão de Pedidos",
    icon: ShoppingCart,
    permission: "gestaoPedidos",
    children: [
      { name: "Todos os Pedidos", href: "/orders", icon: ShoppingCart },
      // Rota dedicada "/orders/completed" não existe; usamos tab via query param
      { name: "Pedidos Concluídos", href: "/orders?tab=concluidos", icon: CheckCircle },
    ],
  },
  {
    name: "Financeiro",
    icon: DollarSign,
    permission: "financeiro",
    children: [
      { name: "Dashboard", href: "/dashboard/financeiro", icon: BarChart3 },
      { name: "Faturamento", href: "/dashboard/financeiro/faturamento", icon: FileText },
    ],
  },
  {
    name: "Relatórios",
    icon: BarChart3,
    permission: "relatorios",
    children: [
      { name: "Dashboard Analytics", href: "/reports/analytics", icon: BarChart3 },
      // Página específica de performance não existe; usamos aba via query param
      { name: "Performance", href: "/reports/analytics?tab=performance", icon: TrendingUp },
    ],
  },
  {
    name: "Configurações",
    icon: Settings,
    permission: "configuracoes",
    children: [
      { name: "Geral", href: "/dashboard/configuracoes", icon: Settings },
      { name: "Equipes", href: "/dashboard/configuracoes/equipes", icon: UserCheck },
    ],
  },
  {
    name: "Área Master",
    href: "/master",
    icon: Shield,
    permission: "gestaoUsuarios", // Apenas quem pode gerenciar usuários pode acessar master
    isMaster: true, // Flag especial para área master
  },
]

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const { hasPermission } = usePermissions()
  const { user, logout } = useAuth()
  const router = useRouter()

  // Expandir automaticamente os menus que contêm a página atual
  useEffect(() => {
    const shouldExpand: string[] = []
    
    navigation.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => 
          pathname === child.href || pathname.startsWith(child.href + '/')
        )
        if (hasActiveChild) {
          shouldExpand.push(item.name)
        }
      }
    })
    
    setExpandedItems(shouldExpand)
  }, [pathname])

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  const isActive = (href: string) => {
    if (pathname === href) return true
    // Para rotas que começam com o href (ex: /dashboard/servicos/orcamento)
    if (href !== '/' && pathname.startsWith(href + '/')) return true
    return false
  }

  // Filtrar navegação baseada nas permissões
  const filteredNavigation = navigation.filter(item => {
    if (!item.permission) return true
    return hasPermission(item.permission as keyof import("@/hooks/use-permissions").UserPermissions)
  })

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-gradient-to-b from-orange-100 to-orange-200 text-slate-900">
      {/* Header fixo */}
      <div className="flex h-16 items-center justify-between px-6 flex-shrink-0">
        <Logo className="h-8" showText={true} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
          className="lg:hidden text-slate-900 hover:bg-black/10"
          aria-label="Fechar menu lateral"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Área rolável para navegação */}
      <ScrollArea className="flex-1 px-3 py-2 overflow-hidden">
        <nav className="space-y-2 pb-4" role="navigation" aria-label="Navegação principal">
          {filteredNavigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between transition-colors text-slate-900 hover:bg-black/10",
                      expandedItems.includes(item.name) && "bg-white/70"
                    )}
                    onClick={() => toggleExpanded(item.name)}
                    aria-expanded={expandedItems.includes(item.name)}
                    aria-controls={`submenu-${item.name}`}
                    aria-label={`${item.name}, ${expandedItems.includes(item.name) ? 'recolher' : 'expandir'} submenu`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.name}</span>
                    </div>
                    {expandedItems.includes(item.name) ? (
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                  {expandedItems.includes(item.name) && (
                    <div 
                      className="ml-6 mt-2 space-y-1"
                      id={`submenu-${item.name}`}
                      role="region"
                      aria-label={`Submenu de ${item.name}`}
                    >
                      {item.children.map((child) => (
                        <button
                          key={child.href}
                          className={cn(
                            "w-full text-left flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors text-slate-900 hover:bg-black/10",
                            isActive(child.href) && "bg-white text-orange-700 font-semibold"
                          )}
                          onClick={() => {
                            setOpen(false)
                            router.push(child.href)
                          }}
                          aria-current={isActive(child.href) ? 'page' : undefined}
                        >
                          <child.icon className="h-4 w-4" aria-hidden="true" />
                          <span>{child.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className={cn(
                    "w-full text-left flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors text-slate-900 hover:bg-black/10",
                    isActive(item.href) && "bg-white text-orange-700 font-semibold"
                  )}
                  onClick={() => {
                    setOpen(false)
                    router.push(item.href)
                  }}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.name}</span>
                </button>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer fixo da Sidebar */}
      <div className="border-t border-black/10 p-4 flex-shrink-0">
        <div className="flex items-center space-x-3 text-slate-900">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {user?.displayName || user?.email?.split('@')[0] || 'Usuário'}
            </p>
            <p className="text-xs text-slate-600">
              {user?.email || 'admin@aquiresolve.com'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-slate-900 hover:bg-black/10"
            aria-label="Sair do sistema"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30" role="complementary" aria-label="Menu lateral">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-80 sm:w-96" role="dialog" aria-label="Menu lateral móvel">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
