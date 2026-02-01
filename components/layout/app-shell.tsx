"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

interface AppShellProps {
  children: React.ReactNode
  hideSidebar?: boolean
}

export function AppShell({ children, hideSidebar = false }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden flex flex-col w-full max-w-full">
      {!hideSidebar && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />}
      <div className={cn("flex-1 min-w-0 overflow-x-hidden", !hideSidebar && "lg:ml-64")}>
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-w-0 overflow-x-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
