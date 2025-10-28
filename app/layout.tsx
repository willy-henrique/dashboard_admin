import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./performance.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { AuthProvider } from "@/components/auth-provider"
import { PermissionsProvider } from "@/hooks/use-permissions"
import { MasterAuthProvider } from "@/hooks/use-master-auth"
import { Toaster } from "@/components/ui/toaster"
import { PerformanceOptimizer } from "@/components/performance-optimizer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AquiResolve - Painel Administrativo",
  description: "Sistema de administração para aplicativo de prestação de serviços",
  keywords: "administração, serviços, prestadores, clientes, dashboard",
  authors: [{ name: "AquiResolve Team" }],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <MasterAuthProvider>
                <PermissionsProvider>
                  <PerformanceOptimizer>
                    <GoogleMapsLoader />
                    <div className="min-h-screen bg-background">
                      {children}
                      <Toaster />
                    </div>
                  </PerformanceOptimizer>
                </PermissionsProvider>
              </MasterAuthProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
