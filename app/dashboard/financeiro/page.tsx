"use client"

import { RouteGuard } from "@/components/auth/route-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePagarmeAnalytics } from "@/hooks/use-pagarme-analytics"
import { DollarSign, TrendingUp, CreditCard, PieChart, Loader2, AlertCircle } from "lucide-react"

export default function FinanceiroPage() {
  const { 
    totalRevenue, 
    totalTransactions, 
    successRate, 
    conversionRate, 
    paymentMethods, 
    recentCharges, 
    loading, 
    error 
  } = usePagarmeAnalytics()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100) // Pagar.me retorna valores em centavos
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <RouteGuard requiredPermission="financeiro">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Financeiro
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Carregando dados financeiros...
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                Carregando dados do Pagar.me...
              </p>
            </div>
          </div>
        </div>
      </RouteGuard>
    )
  }

  if (error) {
    return (
      <RouteGuard requiredPermission="financeiro">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Financeiro
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Erro ao carregar dados
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </RouteGuard>
    )
  }

  return (
    <RouteGuard requiredPermission="financeiro">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Financeiro
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Dados financeiros em tempo real via Pagar.me
          </p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                Últimos 30 dias
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transações
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                Últimos 30 dias
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Sucesso
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(successRate)}</div>
              <p className="text-xs text-muted-foreground">
                Transações aprovadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversão
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(conversionRate)}</div>
              <p className="text-xs text-muted-foreground">
                Taxa de conversão
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Cartão de Crédito</span>
                  <span className="text-sm text-slate-600">{paymentMethods.credit_card}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Cartão de Débito</span>
                  <span className="text-sm text-slate-600">{paymentMethods.debit_card}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">PIX</span>
                  <span className="text-sm text-slate-600">{paymentMethods.pix}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Boleto</span>
                  <span className="text-sm text-slate-600">{paymentMethods.boleto}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cobranças Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCharges.length > 0 ? (
                  recentCharges.slice(0, 5).map((charge, index) => (
                    <div key={charge.id || index} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                      <div>
                        <p className="text-sm font-medium">#{charge.id?.slice(-8)}</p>
                        <p className="text-xs text-slate-600">{charge.status}</p>
                      </div>
                      <span className="text-sm font-medium">
                        {formatCurrency(charge.amount || 0)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Nenhuma cobrança encontrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RouteGuard>
  )
}