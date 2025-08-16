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

export default function FinanceiroPage() {
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
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>R$ 48.950,50</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              +12.5% em relação ao mês anterior
            </p>
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
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>R$ 67.250,00</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              +8.3% em relação ao mês anterior
            </p>
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
            <div className="text-2xl font-bold" style={{ color: 'var(--destructive)' }}>R$ 18.299,50</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              -5.2% em relação ao mês anterior
            </p>
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
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>R$ 48.950,50</div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Margem de 72.8%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Navegação */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <DollarSign className="h-5 w-5" />
              Contas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Gerencie contas bancárias, saldos e movimentações
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>3</span>
              <Button variant="ghost" size="sm">
                Ver todas →
              </Button>
            </div>
          </CardContent>
        </Card>

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
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>156</span>
              <Button variant="ghost" size="sm">
                Ver todas →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Activity className="h-5 w-5" />
              Movimento de Caixa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Acompanhe entradas, saídas e fluxo de caixa
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>245</span>
              <Button variant="ghost" size="sm">
                Ver todas →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Users className="h-5 w-5" />
              Folha de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Gestão de salários, benefícios e impostos
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>12</span>
              <Button variant="ghost" size="sm">
                Ver todos →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Calendar className="h-5 w-5" />
              Fechamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Fechamentos mensais, trimestrais e anuais
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>12</span>
              <Button variant="ghost" size="sm">
                Ver todos →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <BarChart3 className="h-5 w-5" />
              Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Relatórios financeiros e análises gerenciais
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-1" />
                Gerar
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>Pagamento de Serviço</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Cliente #1234</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+R$ 350,00</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Hoje</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>Combustível</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Veículo ABC-1234</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-R$ 120,00</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Ontem</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>Comissão</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Prestador João Silva</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+R$ 85,00</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>2 dias atrás</p>
                </div>
              </div>
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
