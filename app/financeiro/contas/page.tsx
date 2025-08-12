"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

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
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contas</h1>
          <p className="text-gray-600">autem.com.br › financeiro › contas</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saldo Total</p>
                  <p className="text-2xl font-bold">
                    R$ {totalSaldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receitas do Mês</p>
                  <p className="text-2xl font-bold text-green-600">R$ 12.450,00</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Despesas do Mês</p>
                  <p className="text-2xl font-bold text-red-600">R$ 8.750,00</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Conta
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Buscar contas..." className="pl-10 w-64" />
            </div>
          </div>
        </div>

        {/* Accounts Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Banco</TableHead>
                  <TableHead>Agência</TableHead>
                  <TableHead>Conta</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.nome}</TableCell>
                    <TableCell>{account.banco}</TableCell>
                    <TableCell>{account.agencia}</TableCell>
                    <TableCell>{account.conta}</TableCell>
                    <TableCell>
                      <Badge className={getTipoColor(account.tipo)}>{account.tipo}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      R$ {account.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">{account.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
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

        {/* Recent Transactions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Movimentações Recentes</h3>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{transaction.descricao}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.conta} • {transaction.data}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.tipo === "receita" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.tipo === "receita" ? "+" : "-"}R$ {transaction.valor.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.tipo}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
