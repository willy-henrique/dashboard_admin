"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
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
  },
  {
    name: "Serviços",
    href: "/dashboard/servicos",
    icon: ClipboardList,
  },
  {
    name: "Controle",
    icon: MousePointer,
    children: [
      { name: "AutEM Mobile", href: "/dashboard/controle/autem-mobile", icon: Smartphone },
      { name: "Monitoramento de Chat", href: "/dashboard/controle/chat", icon: MessageSquare },
    ],
  },
  {
    name: "Gestão de Usuários",
    icon: Users,
    children: [
      { name: "Clientes", href: "/users/clients", icon: Users },
      { name: "Prestadores", href: "/users/providers", icon: UserCheck },
      { name: "Verificações", href: "/users/verifications", icon: Shield },
    ],
  },
  {
    name: "Gestão de Pedidos",
    icon: ShoppingCart,
    children: [
      { name: "Todos os Pedidos", href: "/orders", icon: ShoppingCart },
      { name: "Pedidos Concluídos", href: "/orders/completed", icon: CheckCircle },
    ],
  },
  {
    name: "Financeiro",
    icon: DollarSign,
    children: [
      { name: "Dashboard", href: "/dashboard/financeiro", icon: BarChart3 },
      { name: "Contas", href: "/dashboard/financeiro/contas", icon: DollarSign },
      { name: "Faturamento", href: "/dashboard/financeiro/faturamento", icon: FileText },
      { name: "Movimento de Caixa", href: "/dashboard/financeiro/movimento-caixa", icon: TrendingUp },
      { name: "Folha de Pagamento", href: "/dashboard/financeiro/folha-pagamento", icon: Users },
      { name: "Fechamento", href: "/dashboard/financeiro/fechamento", icon: Calendar },
      { name: "Relatórios", href: "/dashboard/financeiro/relatorios", icon: BarChart3 },
    ],
  },
  {
    name: "Relatórios",
    icon: BarChart3,
    children: [
      { name: "Dashboard Analytics", href: "/reports/analytics", icon: BarChart3 },
      { name: "Performance", href: "/reports/performance", icon: TrendingUp },
      { name: "Satisfação", href: "/reports/satisfaction", icon: Star },
      { name: "Geográfico", href: "/reports/geographic", icon: MapPin },
      { name: "Tempo de Atendimento", href: "/reports/response-time", icon: Clock },
    ],
  },
  {
    name: "Configurações",
    icon: Settings,
    children: [
      { name: "Dashboard", href: "/dashboard/configuracoes", icon: BarChart3 },
      { name: "Checklists", href: "/dashboard/configuracoes/checklists", icon: ClipboardList },
      { name: "Clientes e Fornecedores", href: "/dashboard/configuracoes/clientes-fornecedores", icon: Users },
      { name: "Equipes", href: "/dashboard/configuracoes/equipes", icon: UserCheck },
      { name: "Exportador", href: "/dashboard/configuracoes/exportador", icon: Download },
      { name: "Filiais", href: "/dashboard/configuracoes/filiais", icon: Building },
      { name: "Manutenção", href: "/dashboard/configuracoes/manutencao", icon: Wrench },
      { name: "Sistema", href: "/dashboard/configuracoes/sistema", icon: Settings },
    ],
  },
]

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  const isActive = (href: string) => pathname === href

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-gradient-to-b from-orange-100 to-orange-200 text-slate-900">
      {/* Header fixo */}
      <div className="flex h-16 items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white text-orange-400">
            <span className="font-bold text-lg">A</span>
          </div>
          <h1 className="text-xl font-bold">AppServiço</h1>
        </div>
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
          {navigation.map((item) => (
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
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors text-slate-900 hover:bg-black/10",
                            isActive(child.href) && "bg-white text-orange-700 font-semibold"
                          )}
                          onClick={() => setOpen(false)}
                          aria-current={isActive(child.href) ? 'page' : undefined}
                        >
                          <child.icon className="h-4 w-4" aria-hidden="true" />
                          <span>{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors text-slate-900 hover:bg-black/10",
                    isActive(item.href) && "bg-white text-orange-700 font-semibold"
                  )}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer fixo da Sidebar */}
      <div className="border-t border-black/10 p-4 flex-shrink-0">
        <div className="flex items-center space-x-3 text-slate-900">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-orange-400">
            <span className="text-sm font-medium">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-slate-600">admin@appservico.com</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
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
