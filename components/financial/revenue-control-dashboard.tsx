"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, Calendar, RefreshCw, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePagarmeBalance, usePagarmeAnalytics, usePagarmeCharges } from "@/hooks/use-pagarme"
import { PagarmeService } from "@/lib/services/pagarme-service"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

/**
 * DASHBOARD DE CONTROLE DE RECEBIMENTOS
 * Focado em mostrar valores recebidos, saldo e controle financeiro
 */
export function RevenueControlDashboard() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  
  // Calcular datas do período
  const now = new Date()
  const startDate = new Date(now)
  
  if (period === 'week') {
    startDate.setDate(now.getDate() - 7)
  } else if (period === 'month') {
    startDate.setMonth(now.getMonth() - 1)
  } else {
    startDate.setFullYear(now.getFullYear() - 1)
  }

  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = now.toISOString().split('T')[0]

  // Buscar dados
  const { balance, loading: balanceLoading, refetch: refetchBalance } = usePagarmeBalance(true)
  const { analytics, loading: analyticsLoading, refetch: refetchAnalytics } = usePagarmeAnalytics(
    startDateStr,
    endDateStr
  )
  const { charges, loading: chargesLoading } = usePagarmeCharges({
    status: 'paid',
    autoRefresh: true
  })

  const loading = balanceLoading || analyticsLoading

  const handleRefresh = () => {
    refetchBalance()
    refetchAnalytics()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-600">Carregando dados financeiros...</span>
        </div>
      </div>
    )
  }

  // Calcular valores
  const availableBalance = balance?.available_amount || 0
  const waitingFunds = balance?.waiting_funds_amount || 0
  const totalTransferred = balance?.transferred_amount || 0
  const totalReceived = analytics?.total_amount || 0
  const paidOrders = analytics?.status_breakdown?.paid || 0
  const totalOrders = analytics?.total_orders || 0
  const successRate = totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0

  // Calcular próximos recebimentos (fundos aguardando)
  const nextReceivable = waitingFunds

  // Período em texto
  const periodText = period === 'week' ? 'Últimos 7 dias' : period === 'month' ? 'Último mês' : 'Último ano'

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Controle de Recebimentos</h2>
          <p className="text-sm text-gray-500">Acompanhe seus recebimentos e saldo em tempo real</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={period === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPeriod('week')}
            >
              7 dias
            </Button>
            <Button
              variant={period === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPeriod('month')}
            >
              30 dias
            </Button>
            <Button
              variant={period === 'year' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPeriod('year')}
            >
              1 ano
            </Button>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Cards Principais - Saldo e Recebimentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Saldo Disponível */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Saldo Disponível
              </CardTitle>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {PagarmeService.formatCurrency(PagarmeService.fromCents(availableBalance))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Pode sacar agora</p>
          </CardContent>
        </Card>

        {/* A Receber */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                A Receber
              </CardTitle>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {PagarmeService.formatCurrency(PagarmeService.fromCents(nextReceivable))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Próximos dias</p>
          </CardContent>
        </Card>

        {/* Total Recebido no Período */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Recebido ({periodText})
              </CardTitle>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">
              {PagarmeService.formatCurrency(PagarmeService.fromCents(totalReceived))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {paidOrders} pagamentos aprovados
            </p>
          </CardContent>
        </Card>

        {/* Já Transferido */}
        <Card className="border-l-4 border-l-gray-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Já Transferido
              </CardTitle>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700">
              {PagarmeService.formatCurrency(PagarmeService.fromCents(totalTransferred))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total histórico</p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Métodos de Pagamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Métodos de Pagamento Recebidos */}
        <Card>
          <CardHeader>
            <CardTitle>Recebimentos por Método ({periodText})</CardTitle>
            <CardDescription>Distribuição dos pagamentos aprovados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">PIX</p>
                    <p className="text-sm text-gray-500">
                      {analytics?.payment_methods?.pix || 0} transações
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {analytics?.payment_methods?.pix || 0}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cartão de Crédito</p>
                    <p className="text-sm text-gray-500">
                      {analytics?.payment_methods?.credit_card || 0} transações
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {analytics?.payment_methods?.credit_card || 0}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cartão de Débito</p>
                    <p className="text-sm text-gray-500">
                      {analytics?.payment_methods?.debit_card || 0} transações
                    </p>
                  </div>
                </div>
                <Badge className="bg-orange-100 text-orange-800">
                  {analytics?.payment_methods?.debit_card || 0}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Boleto</p>
                    <p className="text-sm text-gray-500">
                      {analytics?.payment_methods?.boleto || 0} transações
                    </p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-800">
                  {analytics?.payment_methods?.boleto || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status e Estatísticas */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Pagamento</CardTitle>
            <CardDescription>Desempenho e aprovação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Taxa de Aprovação */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Taxa de Aprovação</span>
                  <span className="text-2xl font-bold text-green-600">
                    {successRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${successRate}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {paidOrders} de {totalOrders} pagamentos aprovados
                </p>
              </div>

              {/* Resumo de Status */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-900">✓ Pagos</span>
                  <span className="text-lg font-bold text-green-700">
                    {analytics?.status_breakdown?.paid || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-orange-900">⏳ Pendentes</span>
                  <span className="text-lg font-bold text-orange-700">
                    {analytics?.status_breakdown?.pending || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-red-900">✗ Falhados</span>
                  <span className="text-lg font-bold text-red-700">
                    {analytics?.status_breakdown?.failed || 0}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Transações Recebidas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Últimos Recebimentos</CardTitle>
              <CardDescription>Transações pagas recentemente</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {charges.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum recebimento encontrado</p>
              <p className="text-sm">Os pagamentos aprovados aparecerão aqui</p>
            </div>
          ) : (
            <div className="space-y-3">
              {charges.slice(0, 5).map((charge) => (
                <div
                  key={charge.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{charge.customer.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(charge.created_at).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(charge.created_at).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {PagarmeService.formatCurrency(PagarmeService.fromCents(charge.amount))}
                    </p>
                    <Badge className="bg-green-100 text-green-800">
                      {charge.payment_method === 'pix' ? 'PIX' :
                       charge.payment_method === 'credit_card' ? 'Cartão' :
                       charge.payment_method === 'boleto' ? 'Boleto' : charge.payment_method}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

