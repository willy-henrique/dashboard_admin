import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, DollarSign, TrendingUp, TrendingDown, Eye, Download } from "lucide-react"

const accounts = [
  {
    id: "1",
    nome: "Conta Corrente Principal",
    banco: "Banco do Brasil",
    agencia: "1234-5",
    conta: "12345-6",
    tipo: "corrente",
    saldo: 15750.5,
    status: "ativa",
  },
  {
    id: "2",
    nome: "Conta Poupança",
    banco: "Caixa Econômica",
    agencia: "0987-6",
    conta: "98765-4",
    tipo: "poupanca",
    saldo: 8200.0,
    status: "ativa",
  },
  {
    id: "3",
    nome: "Conta Investimento",
    banco: "Itaú",
    agencia: "5678-9",
    conta: "56789-0",
    tipo: "investimento",
    saldo: 25000.0,
    status: "ativa",
  },
]

const recentTransactions = [
  {
    id: "1",
    data: "2025-01-15",
    descricao: "Pagamento de serviço #699411371",
    tipo: "receita",
    valor: 350.0,
    conta: "Conta Corrente Principal",
  },
  {
    id: "2",
    data: "2025-01-15",
    descricao: "Combustível - Veículo ABC-1234",
    tipo: "despesa",
    valor: 120.0,
    conta: "Conta Corrente Principal",
  },
  {
    id: "3",
    data: "2025-01-14",
    descricao: "Pagamento de fornecedor",
    tipo: "despesa",
    valor: 850.0,
    conta: "Conta Corrente Principal",
  },
]

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case "corrente":
      return "bg-blue-100 text-blue-800"
    case "poupanca":
      return "bg-green-100 text-green-800"
    case "investimento":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ContasPage() {
  const totalSaldo = accounts.reduce((sum, account) => sum + account.saldo, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Gestão de Contas
          </h1>
          <p className="text-muted-foreground">
            Gerencie contas bancárias, saldos e movimentações
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Conta
          </Button>
        </div>
      </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                Saldo Total
              </CardTitle>
              <DollarSign className="h-4 w-4" style={{ color: 'var(--success)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                R$ {totalSaldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
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
              <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>R$ 12.450,00</div>
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
              <div className="text-2xl font-bold" style={{ color: 'var(--destructive)' }}>R$ 8.750,00</div>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                -5.2% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                Total de Contas
              </CardTitle>
              <DollarSign className="h-4 w-4" style={{ color: 'var(--primary)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>{accounts.length}</div>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Todas ativas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Barra de Ações */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
              <Input 
                placeholder="Buscar contas..." 
                className="pl-10 w-64" 
                aria-label="Buscar contas"
              />
            </div>
          </div>
        </div>

        {/* Tabela de Contas */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Contas Bancárias</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ color: 'var(--foreground)' }}>Nome</TableHead>
                  <TableHead style={{ color: 'var(--foreground)' }}>Banco</TableHead>
                  <TableHead style={{ color: 'var(--foreground)' }}>Agência</TableHead>
                  <TableHead style={{ color: 'var(--foreground)' }}>Conta</TableHead>
                  <TableHead style={{ color: 'var(--foreground)' }}>Tipo</TableHead>
                  <TableHead style={{ color: 'var(--foreground)' }}>Saldo</TableHead>
                  <TableHead style={{ color: 'var(--foreground)' }}>Status</TableHead>
                  <TableHead className="text-right" style={{ color: 'var(--foreground)' }}>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium" style={{ color: 'var(--foreground)' }}>{account.nome}</TableCell>
                    <TableCell style={{ color: 'var(--foreground)' }}>{account.banco}</TableCell>
                    <TableCell style={{ color: 'var(--foreground)' }}>{account.agencia}</TableCell>
                    <TableCell style={{ color: 'var(--foreground)' }}>{account.conta}</TableCell>
                    <TableCell>
                      <Badge className={getTipoColor(account.tipo)}>{account.tipo}</Badge>
                    </TableCell>
                    <TableCell className="font-medium" style={{ color: 'var(--foreground)' }}>
                      R$ {account.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">{account.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Movimentações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: 'var(--foreground)' }}>Movimentações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>{transaction.descricao}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {transaction.conta} • {transaction.data}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.tipo === "receita" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.tipo === "receita" ? "+" : "-"}R$ {transaction.valor.toFixed(2)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{transaction.tipo}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
