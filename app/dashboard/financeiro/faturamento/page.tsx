"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Eye, Download, FileText } from "lucide-react"

const invoices = [
  {
    id: "1",
    numero: "FAT-2025-001",
    cliente: "João Silva",
    dataEmissao: "2025-01-15",
    dataVencimento: "2025-02-15",
    valor: 1250.0,
    status: "pago",
    dataPagamento: "2025-01-10",
    servicos: 5,
  },
  {
    id: "2",
    numero: "FAT-2025-002",
    cliente: "Maria Santos",
    dataEmissao: "2025-01-12",
    dataVencimento: "2025-02-12",
    valor: 850.0,
    status: "pendente",
    dataPagamento: null,
    servicos: 3,
  },
  {
    id: "3",
    numero: "FAT-2025-003",
    cliente: "Pedro Costa",
    dataEmissao: "2025-01-10",
    dataVencimento: "2025-01-25",
    valor: 2100.0,
    status: "vencido",
    dataPagamento: null,
    servicos: 8,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pago":
      return "bg-green-100 text-green-800"
    case "pendente":
      return "bg-yellow-100 text-yellow-800"
    case "vencido":
      return "bg-red-100 text-red-800"
    case "cancelado":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function FaturamentoPage() {
  const totalFaturado = invoices.reduce((sum, invoice) => sum + invoice.valor, 0)
  const totalPago = invoices.filter((inv) => inv.status === "pago").reduce((sum, invoice) => sum + invoice.valor, 0)
  const totalPendente = invoices
    .filter((inv) => inv.status === "pendente")
    .reduce((sum, invoice) => sum + invoice.valor, 0)

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faturamento</h1>
          <p className="text-gray-600">autem.com.br › financeiro › faturamento</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Faturado</p>
                  <p className="text-2xl font-bold">
                    R$ {totalFaturado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pago</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {totalPago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pendente</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    R$ {totalPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Fatura
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Buscar faturas..." className="pl-16 w-64" />
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data Emissão</TableHead>
                  <TableHead>Data Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Serviços</TableHead>
                  <TableHead>Data Pagamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.numero}</TableCell>
                    <TableCell>{invoice.cliente}</TableCell>
                    <TableCell>{invoice.dataEmissao}</TableCell>
                    <TableCell>{invoice.dataVencimento}</TableCell>
                    <TableCell className="font-medium">
                      R$ {invoice.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>{invoice.servicos}</TableCell>
                    <TableCell>{invoice.dataPagamento || "---"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
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
