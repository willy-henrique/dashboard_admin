"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, RefreshCw, AlertCircle, Loader2 } from "lucide-react"
import { usePagarmeOrders, usePagarmeCharges } from "@/hooks/use-pagarme"
import { PagarmeService } from "@/lib/services/pagarme-service"
import { PagarmeOrder, PagarmeCharge } from "@/types/pagarme"

export function TransactionsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all")

  // Buscar pedidos e cobranças do Pagar.me
  const { orders, loading: ordersLoading, refetch: refetchOrders } = usePagarmeOrders({ autoRefresh: true })
  const { charges, loading: chargesLoading, refetch: refetchCharges, refundCharge, cancelCharge } = usePagarmeCharges({ autoRefresh: true })

  const loading = ordersLoading || chargesLoading

  // Filtrar charges
  const filteredCharges = charges.filter((charge) => {
    const matchesSearch =
      charge.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (charge.code && charge.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      charge.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || charge.status === statusFilter
    const matchesPaymentMethod =
      paymentMethodFilter === "all" ||
      charge.payment_method === paymentMethodFilter
    return matchesSearch && matchesStatus && matchesPaymentMethod
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pendente</Badge>
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Falhou</Badge>
      case "refunded":
        return <Badge className="bg-purple-100 text-purple-800">Reembolsado</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processando</Badge>
      case "canceled":
        return <Badge className="bg-gray-100 text-gray-800">Cancelado</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    const colors = {
      pix: "bg-blue-100 text-blue-800",
      credit_card: "bg-green-100 text-green-800",
      debit_card: "bg-orange-100 text-orange-800",
      boleto: "bg-purple-100 text-purple-800",
      voucher: "bg-indigo-100 text-indigo-800",
    }
    
    const labels = {
      pix: "PIX",
      credit_card: "Cartão de Crédito",
      debit_card: "Cartão de Débito",
      boleto: "Boleto",
      voucher: "Voucher",
    }
    
    return (
      <Badge className={colors[method as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {labels[method as keyof typeof labels] || method}
      </Badge>
    )
  }

  const handleRefund = async (chargeId: string) => {
    const result = await refundCharge(chargeId)
    if (result.success) {
      alert('Reembolso processado com sucesso!')
    } else {
      alert('Erro ao processar reembolso: ' + result.error)
    }
  }

  const handleCancel = async (chargeId: string) => {
    const result = await cancelCharge(chargeId)
    if (result.success) {
      alert('Cobrança cancelada com sucesso!')
    } else {
      alert('Erro ao cancelar cobrança: ' + result.error)
    }
  }

  const totalAmount = filteredCharges.reduce((sum, charge) => sum + charge.amount, 0)
  const totalPaid = filteredCharges
    .filter(c => c.status === 'paid')
    .reduce((sum, charge) => sum + (charge.paid_amount || charge.amount), 0)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>Carregando transações...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transações do Pagar.me</CardTitle>
              <CardDescription>
                {filteredCharges.length} de {charges.length} cobranças • Total: {PagarmeService.formatCurrency(PagarmeService.fromCents(totalAmount))}{" "}
                • Pago: {PagarmeService.formatCurrency(PagarmeService.fromCents(totalPaid))}
              </CardDescription>
            </div>
            <Button onClick={() => {
              refetchOrders()
              refetchCharges()
            }} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por ID, pedido, cliente ou prestador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-20"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
                <SelectItem value="refunded">Reembolsado</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Métodos</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Cobrança</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCharges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCharges.map((charge) => (
                    <TableRow key={charge.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium font-mono text-xs">{charge.id.substring(0, 12)}...</div>
                          {charge.code && (
                            <div className="text-sm text-gray-500">{charge.code}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{charge.customer.name}</div>
                        <div className="text-xs text-gray-500">{charge.customer.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {PagarmeService.formatCurrency(PagarmeService.fromCents(charge.amount))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-green-600 font-medium">
                          {charge.paid_amount 
                            ? PagarmeService.formatCurrency(PagarmeService.fromCents(charge.paid_amount))
                            : '-'
                          }
                        </div>
                      </TableCell>
                      <TableCell>{getPaymentMethodBadge(charge.payment_method)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(charge.status)}
                          {charge.status === "failed" && <AlertCircle className="h-4 w-4 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{new Date(charge.created_at).toLocaleDateString("pt-BR")}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(charge.created_at).toLocaleTimeString("pt-BR")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {charge.status === "paid" && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRefund(charge.id)}
                              title="Reembolsar"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          {(charge.status === "pending" || charge.status === "processing") && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleCancel(charge.id)}
                              title="Cancelar"
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
