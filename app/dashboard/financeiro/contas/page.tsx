"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, DollarSign, TrendingUp, TrendingDown, Eye, Download, RefreshCw, Wallet, CreditCard, Building } from "lucide-react"
import { useMemo, useState } from "react"
import { usePagarmeCharges, usePagarmeOrders, usePagarmeBalance } from "@/hooks/use-pagarme"
import { PagarmeService } from "@/lib/services/pagarme-service"

const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "failed":
      return "bg-red-100 text-red-800"
    case "canceled":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case "pix":
      return <Wallet className="h-4 w-4" />
    case "credit_card":
    case "debit_card":
      return <CreditCard className="h-4 w-4" />
    case "boleto":
      return <Building className="h-4 w-4" />
    default:
      return <DollarSign className="h-4 w-4" />
  }
}

export default function ContasPage() {
  const [search, setSearch] = useState("")
  const { balance, loading: balanceLoading, refetch: refetchBalance } = usePagarmeBalance(true)
  const { charges, loading: chargesLoading, refetch: refetchCharges } = usePagarmeCharges({ autoRefresh: true })
  const { orders, loading: ordersLoading, refetch: refetchOrders } = usePagarmeOrders({ autoRefresh: true })

  // Calcular estatísticas reais
  const stats = useMemo(() => {
    const saldoDisponivel = PagarmeService.fromCents(balance?.available_amount ?? 0)
    const saldoAReceber = PagarmeService.fromCents(balance?.waiting_funds_amount ?? 0)
    const saldoTotal = saldoDisponivel + saldoAReceber

    // Receitas do mês atual
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    const receitasMes = charges
      ?.filter(c => {
        const chargeDate = new Date(c.created_at)
        return chargeDate >= firstDay && chargeDate <= lastDay && c.status === 'paid'
      })
      ?.reduce((sum, c) => sum + PagarmeService.fromCents(c.paid_amount || c.amount), 0) ?? 0

    // Despesas estimadas (taxas do Pagar.me)
    const despesasMes = charges
      ?.filter(c => {
        const chargeDate = new Date(c.created_at)
        return chargeDate >= firstDay && chargeDate <= lastDay && c.status === 'paid'
      })
      ?.reduce((sum, c) => {
        const valor = PagarmeService.fromCents(c.paid_amount || c.amount)
        // Taxa média do Pagar.me: ~3.5%
        return sum + (valor * 0.035)
      }, 0) ?? 0

    return {
      saldoTotal,
      saldoDisponivel,
      saldoAReceber,
      receitasMes,
      despesasMes,
      totalContas: 1 // Pagar.me é uma conta principal
    }
  }, [balance, charges])

  // Contas virtuais baseadas no Pagar.me
  const contas = useMemo(() => [
    {
      id: "pagarme-principal",
      nome: "Conta Principal Pagar.me",
      banco: "Pagar.me",
      agencia: "N/A",
      conta: "Conta Digital",
      tipo: "digital",
      saldo: stats.saldoDisponivel,
      status: "ativa",
      saldoAReceber: stats.saldoAReceber
    }
  ], [stats])

  // Movimentações recentes baseadas nas cobranças
  const movimentacoes = useMemo(() => {
    return (charges || [])
      .slice(0, 10)
      .map(charge => ({
        id: charge.id,
        data: new Date(charge.created_at).toLocaleDateString('pt-BR'),
        descricao: `Pagamento ${charge.payment_method.toUpperCase()} - ${charge.customer.name}`,
        tipo: charge.status === 'paid' ? 'receita' : 'pendente',
        valor: PagarmeService.fromCents(charge.paid_amount || charge.amount),
        conta: "Conta Principal Pagar.me",
        status: charge.status,
        metodo: charge.payment_method
      }))
  }, [charges])

  const handleRefresh = () => {
    refetchBalance()
    refetchCharges()
    refetchOrders()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Gestão de Contas
          </h1>
          <p className="text-gray-600">
            Controle de saldos e movimentações via Pagar.me
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
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
            <CardTitle className="text-sm font-medium text-gray-600">
              Saldo Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {PagarmeService.formatCurrency(stats.saldoTotal)}
            </div>
            <p className="text-xs text-gray-500">
              Disponível: {PagarmeService.formatCurrency(stats.saldoDisponivel)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Receitas (Mês)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {PagarmeService.formatCurrency(stats.receitasMes)}
            </div>
            <p className="text-xs text-gray-500">
              Pagamentos confirmados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxas (Mês)
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {PagarmeService.formatCurrency(stats.despesasMes)}
            </div>
            <p className="text-xs text-gray-500">
              Taxas Pagar.me (~3.5%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Contas
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{contas.length}</div>
            <p className="text-xs text-gray-500">
              Conta digital ativa
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Ações */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar contas..." 
              className="pl-10 w-64" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar contas"
            />
          </div>
        </div>
      </div>

      {/* Tabela de Contas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Contas Bancárias</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900">Nome</TableHead>
                <TableHead className="text-gray-900">Banco</TableHead>
                <TableHead className="text-gray-900">Agência</TableHead>
                <TableHead className="text-gray-900">Conta</TableHead>
                <TableHead className="text-gray-900">Tipo</TableHead>
                <TableHead className="text-gray-900">Saldo Disponível</TableHead>
                <TableHead className="text-gray-900">A Receber</TableHead>
                <TableHead className="text-gray-900">Status</TableHead>
                <TableHead className="text-right text-gray-900">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contas.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium text-gray-900">{account.nome}</TableCell>
                  <TableCell className="text-gray-900">{account.banco}</TableCell>
                  <TableCell className="text-gray-900">{account.agencia}</TableCell>
                  <TableCell className="text-gray-900">{account.conta}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">{account.tipo}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {PagarmeService.formatCurrency(account.saldo)}
                  </TableCell>
                  <TableCell className="font-medium text-yellow-600">
                    {PagarmeService.formatCurrency(account.saldoAReceber)}
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
          <CardTitle className="text-gray-900">Movimentações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {movimentacoes.length > 0 ? (
              movimentacoes.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {getPaymentMethodIcon(transaction.metodo)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.descricao}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.conta} • {transaction.data}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.tipo === "receita" ? "text-green-600" : "text-yellow-600"}`}>
                      {transaction.tipo === "receita" ? "+" : ""}{PagarmeService.formatCurrency(transaction.valor)}
                    </p>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma movimentação encontrada</p>
                <p className="text-sm">As transações aparecerão aqui conforme forem processadas</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}