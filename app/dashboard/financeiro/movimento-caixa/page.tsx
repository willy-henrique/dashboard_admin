"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

const cashFlowEntries = [
  {
    id: "1",
    data: "2025-01-15",
    descricao: "Pagamento de serviço #699411371",
    categoria: "Receita de Serviços",
    tipo: "entrada",
    valor: 350.0,
    conta: "Conta Corrente",
    responsavel: "João Silva",
  },
  {
    id: "2",
    data: "2025-01-15",
    descricao: "Combustível - Veículo ABC-1234",
    categoria: "Combustível",
    tipo: "saida",
    valor: 120.0,
    conta: "Conta Corrente",
    responsavel: "Maria Santos",
  },
  {
    id: "3",
    data: "2025-01-14",
    descricao: "Pagamento de fornecedor - Peças",
    categoria: "Fornecedores",
    tipo: "saida",
    valor: 850.0,
    conta: "Conta Corrente",
    responsavel: "Pedro Costa",
  },
  {
    id: "4",
    data: "2025-01-14",
    descricao: "Recebimento de fatura FAT-2025-001",
    categoria: "Receita de Serviços",
    tipo: "entrada",
    valor: 1250.0,
    conta: "Conta Corrente",
    responsavel: "João Silva",
  },
  {
    id: "5",
    data: "2025-01-13",
    descricao: "Manutenção preventiva - Veículo DEF-5678",
    categoria: "Manutenção",
    tipo: "saida",
    valor: 450.0,
    conta: "Conta Corrente",
    responsavel: "Maria Santos",
  },
]

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case "entrada":
      return "bg-green-100 text-green-800"
    case "saida":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function MovimentoCaixaPage() {
  const totalEntradas = cashFlowEntries
    .filter((entry) => entry.tipo === "entrada")
    .reduce((sum, entry) => sum + entry.valor, 0)
  const totalSaidas = cashFlowEntries
    .filter((entry) => entry.tipo === "saida")
    .reduce((sum, entry) => sum + entry.valor, 0)
  const saldoLiquido = totalEntradas - totalSaidas

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Movimento de Caixa</h1>
          <p className="text-gray-600">autem.com.br › financeiro › movimento de caixa</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Entradas</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {totalEntradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Saídas</p>
                  <p className="text-2xl font-bold text-red-600">
                    R$ {totalSaidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saldo Líquido</p>
                  <p className={`text-2xl font-bold ${saldoLiquido >= 0 ? "text-blue-600" : "text-red-600"}`}>
                    R$ {saldoLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Movimentação
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Buscar movimentações..." className="pl-10 w-64" />
            </div>
          </div>
        </div>

        {/* Cash Flow Table */}
        <Card>
          <CardHeader>
            <CardTitle>Movimentações Recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Conta</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashFlowEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.data}</TableCell>
                    <TableCell className="font-medium">{entry.descricao}</TableCell>
                    <TableCell>{entry.categoria}</TableCell>
                    <TableCell>
                      <Badge className={getTipoColor(entry.tipo)}>{entry.tipo}</Badge>
                    </TableCell>
                    <TableCell
                      className={`font-medium ${entry.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}
                    >
                      {entry.tipo === "entrada" ? "+" : "-"}R$ {entry.valor.toFixed(2)}
                    </TableCell>
                    <TableCell>{entry.conta}</TableCell>
                    <TableCell>{entry.responsavel}</TableCell>
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
      </div>
    </AppShell>
  )
}
