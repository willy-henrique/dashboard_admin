"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Plus,
  Download,
  Upload,
  CreditCard,
  Banknote,
  PiggyBank,
  Receipt,
  Calculator,
  PieChart,
  Activity
} from "lucide-react"

import { useEffect, useMemo } from "react"
import { usePagarmeAnalytics, usePagarmeBalance, usePagarmeCharges } from "@/hooks/use-pagarme"
import { PagarmeService } from "@/lib/services/pagarme-service"

export default function FinanceiroPage() {
  // Período: mês atual
  const now = new Date()
  const firstDay = useMemo(() => new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0], [])
  const lastDay = useMemo(() => new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0], [])

  const { balance } = usePagarmeBalance(true)
  const { analytics } = usePagarmeAnalytics(firstDay, lastDay)
  const { charges } = usePagarmeCharges({ status: 'paid', autoRefresh: true })

  // Valores reais do Pagar.me
  const saldoTotal = PagarmeService.fromCents(balance?.available_amount ?? 0)
  const aReceber = PagarmeService.fromCents(balance?.waiting_funds_amount ?? 0)
  const receitasMes = PagarmeService.fromCents(analytics?.total_amount ?? 0)
  const despesasMes = 0 // Será calculado quando tivermos dados reais de despesas
  const lucroLiquido = Math.max(receitasMes - despesasMes, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Gestão Financeira
          </h1>
          <p className="text-muted-foreground">
            Controle completo das finanças, contas, faturamento e relatórios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Saldo Total
            </CardTitle>
            <DollarSign className="h-4 w-4" style={{ color: 'var(--success)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>{PagarmeService.formatCurrency(saldoTotal)}</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>A receber: {PagarmeService.formatCurrency(aReceber)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Receitas (Mês)
            </CardTitle>
            <TrendingUp className="h-4 w-4" style={{ color: 'var(--success)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>{PagarmeService.formatCurrency(receitasMes)}</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Pedidos pagos: {analytics?.status_breakdown?.paid ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Despesas (Mês)
            </CardTitle>
            <TrendingDown className="h-4 w-4" style={{ color: 'var(--destructive)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--destructive)' }}>{PagarmeService.formatCurrency(despesasMes)}</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Estimado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Lucro Líquido
            </CardTitle>
            <PiggyBank className="h-4 w-4" style={{ color: 'var(--primary)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>{PagarmeService.formatCurrency(lucroLiquido)}</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Base: receitas - despesas</p>
          </CardContent>
        </Card>
      </div>

      {/* Card de Navegação - apenas Faturamento */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <FileText className="h-5 w-5" />
              Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Controle de faturas, recebimentos e inadimplência
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{analytics?.status_breakdown?.paid ?? 0}</span>
              <Button variant="ghost" size="sm" asChild>
                <a href="/dashboard/financeiro/faturamento">Ver todas →</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Rápido */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Últimas Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {charges.slice(0, 3).map((c) => (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--foreground)' }}>{c.customer.name}</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{c.payment_method.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{PagarmeService.formatCurrency(PagarmeService.fromCents(c.paid_amount || c.amount))}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{new Date(c.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              ))}
              {charges.length === 0 && (
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sem pagamentos recentes</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Alertas Financeiros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Receipt className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>Faturas Vencidas</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>3 faturas com mais de 30 dias</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <div className="p-2 bg-red-100 rounded-full">
                  <Calculator className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>Saldo Baixo</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Conta principal abaixo do mínimo</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>Fechamento Mensal</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Vencimento em 5 dias</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: 'var(--foreground)' }}>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Plus className="h-6 w-6" />
              <span>Nova Transação</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Emitir Fatura</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Download className="h-6 w-6" />
              <span>Exportar Relatório</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Calculator className="h-6 w-6" />
              <span>Fechamento</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
