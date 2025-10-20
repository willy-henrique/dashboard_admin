"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Eye, Download, FileText, RefreshCw, Percent, Wallet, Users } from "lucide-react"
import { useMemo, useState } from "react"
import { usePagarmeCharges, usePagarmeOrders } from "@/hooks/use-pagarme"
import { PagarmeService } from "@/lib/services/pagarme-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0])
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
        metodo: firstCharge?.payment_method || '—',
      }
    })
    // filtros
    const filtered = list.filter(inv => {
      const matchesSearch = inv.numero.toLowerCase().includes(search.toLowerCase()) ||
        inv.cliente.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter
      const matchesMethod = methodFilter === 'all' || inv.metodo === methodFilter
      const matchesDate = (!startDate || inv.dataEmissao >= startDate) && (!endDate || inv.dataEmissao <= endDate)
      return matchesSearch && matchesStatus && matchesMethod && matchesDate
    })
    return filtered
  }, [orders, search, statusFilter, methodFilter, startDate, endDate])

  const totalFaturado = invoices.reduce((sum, invoice) => sum + invoice.valor, 0)
  const totalPago = invoices.filter((inv) => inv.status === "pago").reduce((sum, invoice) => sum + invoice.valor, 0)
  const totalPendente = invoices.filter((inv) => inv.status === "pendente").reduce((sum, invoice) => sum + invoice.valor, 0)

  // Distribuição: Prestador x App (Lucro) a partir de splits
  const appRecipientId = (process.env.NEXT_PUBLIC_ID_PUBLIC_PAGARME || process.env.ID_PUBLIC_PAGARME || "").trim()
  const splitTotals = useMemo(() => {
    let appTotalCents = 0
    let providersTotalCents = 0
    let notSplitCents = 0
    ;(charges || []).forEach((c) => {
      if (c.status !== 'paid') return
      const tx = c.last_transaction
      if (tx?.split && tx.split.length > 0) {
        tx.split.forEach(s => {
          if (!s.amount) return
          if (appRecipientId && s.recipient_id === appRecipientId) appTotalCents += s.amount
          else providersTotalCents += s.amount
        })
      } else {
        const base = c.paid_amount || c.amount
        const commission = Math.round(base * 0.10)
        appTotalCents += commission
        providersTotalCents += base - commission
        notSplitCents += base
      }
    })
    return {
      app: PagarmeService.fromCents(appTotalCents),
      providers: PagarmeService.fromCents(providersTotalCents),
      baseWithoutSplit: PagarmeService.fromCents(notSplitCents)
    }
  }, [charges, appRecipientId])

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
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="flex items-center gap-2">
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <span className="text-sm text-gray-500">a</span>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Método" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os métodos</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Distribuição de Receitas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bruto Recebido (Pago)</p>
                  <p className="text-2xl font-bold">
                    {PagarmeService.formatCurrency(totalPago)}
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Repasse aos Prestadores</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {PagarmeService.formatCurrency(splitTotals.providers)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lucro do App</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {PagarmeService.formatCurrency(splitTotals.app)}
                  </p>
                </div>
                <Percent className="h-8 w-8 text-purple-600" />
              </div>
              {splitTotals.baseWithoutSplit > 0 && (
                <p className="text-xs text-gray-500 mt-2">Aplicada comissão padrão de 10% em vendas sem split</p>
              )}
            </CardContent>
          </Card>
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
