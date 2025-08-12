"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Wrench, Shield, DollarSign, Settings, BarChart3, Menu, X, ChevronRight } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Serviços",
    href: "/services",
    icon: Wrench,
    submenu: [
      { name: "Painel Logístico", href: "/services/logistics" },
      { name: "Visualizar", href: "/services/view" },
      { name: "Orçamento", href: "/services/budget" },
    ],
  },
  {
    name: "Controle",
    href: "/control",
    icon: Shield,
    submenu: [
      { name: "AutEM Mobile", href: "/control/mobile" },
      { name: "Danos", href: "/control/damages" },
      { name: "Estoque", href: "/control/inventory" },
      { name: "Frota", href: "/control/fleet" },
      { name: "Notificações", href: "/control/notifications" },
      { name: "Remunerações", href: "/control/payments" },
      { name: "Usuários", href: "/control/users" },
    ],
  },
  {
    name: "Financeiro",
    href: "/financial",
    icon: DollarSign,
    submenu: [
      { name: "Contas", href: "/financial/accounts" },
      { name: "Faturamento", href: "/financial/billing" },
      { name: "Fechamento", href: "/financial/closing" },
      { name: "Folha de Pagamento", href: "/financial/payroll" },
      { name: "Movimento de Caixa", href: "/financial/cashflow" },
    ],
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
    submenu: [
      { name: "Checklists", href: "/settings/checklists" },
      { name: "Checklists Viaturas", href: "/settings/vehicle-checklists" },
      { name: "Clientes e Fornecedores", href: "/settings/clients-suppliers" },
      { name: "Equipes", href: "/settings/teams" },
      { name: "Estoque", href: "/settings/inventory" },
      { name: "Exportador", href: "/settings/exporter" },
      { name: "Filiais", href: "/settings/branches" },
      { name: "Financeiro", href: "/settings/financial" },
      { name: "Manutenção", href: "/settings/maintenance" },
    ],
  },
  { name: "Relatórios", href: "/reports", icon: BarChart3 },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md bg-white shadow-md">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0", // Dark background to match AutEM
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-gray-900 font-bold text-lg">A</span> {/* AutEM logo */}
              </div>
              <h1 className="text-xl font-bold text-white">AutEM</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              const isExpanded = expandedItems.includes(item.name)
              const hasSubmenu = item.submenu && item.submenu.length > 0

              return (
                <div key={item.name}>
                  <div
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                      isActive
                        ? "bg-orange-500 text-white" // Orange active state to match AutEM
                        : "text-gray-300 hover:bg-gray-800 hover:text-white",
                    )}
                    onClick={() => {
                      if (hasSubmenu) {
                        toggleExpanded(item.name)
                      } else {
                        setIsOpen(false)
                      }
                    }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center flex-1"
                      onClick={(e) => {
                        if (hasSubmenu) {
                          e.preventDefault()
                        } else {
                          setIsOpen(false)
                        }
                      }}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                    {hasSubmenu && (
                      <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded ? "rotate-90" : "")} />
                    )}
                  </div>

                  {/* Submenu */}
                  {hasSubmenu && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu?.map((subItem) => {
                        const isSubActive = pathname === subItem.href
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              "block px-3 py-2 rounded-lg text-sm transition-colors",
                              isSubActive
                                ? "bg-orange-500 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
