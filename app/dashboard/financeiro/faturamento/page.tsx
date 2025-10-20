"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Eye, Download, FileText, RefreshCw } from "lucide-react"
import { useMemo, useState } from "react"
import { usePagarmeCharges, usePagarmeOrders } from "@/hooks/use-pagarme"
import { PagarmeService } from "@/lib/services/pagarme-service"

// Usaremos cobranças (charges) e pedidos (orders) do Pagar.me como "faturas"

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
  const [search, setSearch] = useState("")
  const { charges, loading: chargesLoading, refetch: refetchCharges } = usePagarmeCharges({ autoRefresh: true })
  const { orders, loading: ordersLoading, refetch: refetchOrders } = usePagarmeOrders({ autoRefresh: true })

  // Montar "faturas" a partir de orders/charges
  const invoices = useMemo(() => {
    const list = (orders || []).map((o) => {
      const firstCharge = o.charges?.[0]
      return {
        id: o.id,
        numero: o.code || o.id,
        cliente: o.customer?.name || "—",
        dataEmissao: new Date(o.created_at).toISOString().split('T')[0],
        dataVencimento: new Date(o.updated_at).toISOString().split('T')[0],
        valor: PagarmeService.fromCents(o.amount),
        status:
          o.status === 'paid' ? 'pago' :
          o.status === 'pending' ? 'pendente' :
          o.status === 'canceled' ? 'cancelado' : 'pendente',
        dataPagamento: firstCharge?.paid_at || null,
        servicos: o.items?.reduce((sum, it) => sum + (it.quantity || 1), 0) || 1,
      }
    })
    // filtro simples por busca
    return list.filter(inv =>
      inv.numero.toLowerCase().includes(search.toLowerCase()) ||
      inv.cliente.toLowerCase().includes(search.toLowerCase())
    )
  }, [orders, search])

  const totalFaturado = invoices.reduce((sum, invoice) => sum + invoice.valor, 0)
  const totalPago = invoices.filter((inv) => inv.status === "pago").reduce((sum, invoice) => sum + invoice.valor, 0)
  const totalPendente = invoices.filter((inv) => inv.status === "pendente").reduce((sum, invoice) => sum + invoice.valor, 0)

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
              <Input placeholder="Buscar faturas..." className="pl-20 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" onClick={() => { refetchOrders(); refetchCharges(); }}>
              <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
            </Button>
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
                    <TableCell>{invoice.dataPagamento ? new Date(invoice.dataPagamento).toLocaleDateString('pt-BR') : "---"}</TableCell>
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
