"use client"

import { useMemo, useState } from "react"
import {
  Building,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { usePagarmeBalance, usePagarmeCharges } from "@/hooks/use-pagarme"
import { PagarmeService } from "@/lib/services/pagarme-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  const {
    balance,
    loading: balanceLoading,
    error: balanceError,
    warning: balanceWarning,
    refetch: refetchBalance,
  } = usePagarmeBalance(true)
  const {
    charges,
    loading: chargesLoading,
    error: chargesError,
    warning: chargesWarning,
    refetch: refetchCharges,
  } = usePagarmeCharges({ autoRefresh: true })

  const statusMessage = balanceError || chargesError
  const warningMessage = balanceWarning || chargesWarning
  const loading = balanceLoading || chargesLoading

  const stats = useMemo(() => {
    const saldoDisponivel = PagarmeService.fromCents(balance?.available_amount ?? 0)
    const saldoAReceber = PagarmeService.fromCents(balance?.waiting_funds_amount ?? 0)
    const saldoTotal = saldoDisponivel + saldoAReceber

    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const receitasMes =
      charges
        ?.filter((charge) => {
          const chargeDate = new Date(charge.created_at)
          return chargeDate >= firstDay && chargeDate <= lastDay && charge.status === "paid"
        })
        ?.reduce((sum, charge) => sum + PagarmeService.fromCents(charge.paid_amount || charge.amount), 0) ?? 0

    const despesasMes =
      charges
        ?.filter((charge) => {
          const chargeDate = new Date(charge.created_at)
          return chargeDate >= firstDay && chargeDate <= lastDay && charge.status === "paid"
        })
        ?.reduce((sum, charge) => {
          const valor = PagarmeService.fromCents(charge.paid_amount || charge.amount)
          return sum + valor * 0.035
        }, 0) ?? 0

    return {
      saldoTotal,
      saldoDisponivel,
      saldoAReceber,
      receitasMes,
      despesasMes,
    }
  }, [balance, charges])

  const contas = useMemo(() => {
    if (!balance) {
      return []
    }

    return [
      {
        id: "pagarme-principal",
        nome: "Saldo Pagar.me",
        banco: "Pagar.me",
        agencia: "N/A",
        conta: "Conta digital",
        tipo: "digital",
        saldo: stats.saldoDisponivel,
        status: "ativa",
        saldoAReceber: stats.saldoAReceber,
      },
    ]
  }, [balance, stats.saldoAReceber, stats.saldoDisponivel])

  const movimentacoes = useMemo(() => {
    return (charges || []).slice(0, 10).map((charge) => ({
      id: charge.id,
      data: new Date(charge.created_at).toLocaleDateString("pt-BR"),
      descricao: `Pagamento ${charge.payment_method.toUpperCase()} - ${charge.customer.name}`,
      tipo: charge.status === "paid" ? "receita" : "pendente",
      valor: PagarmeService.fromCents(charge.paid_amount || charge.amount),
      conta: "Saldo Pagar.me",
      status: charge.status,
      metodo: charge.payment_method,
    }))
  }, [charges])

  const handleRefresh = () => {
    void refetchBalance()
    void refetchCharges()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestao de Contas</h1>
          <p className="text-gray-600">Saldos e movimentacoes retornados pelo Pagar.me</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {statusMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{statusMessage}</div>
      ) : null}

      {warningMessage && !statusMessage ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{warningMessage}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{PagarmeService.formatCurrency(stats.saldoTotal)}</div>
            <p className="text-xs text-gray-500">Disponivel: {PagarmeService.formatCurrency(stats.saldoDisponivel)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receitas (Mes)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{PagarmeService.formatCurrency(stats.receitasMes)}</div>
            <p className="text-xs text-gray-500">Pagamentos confirmados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxas (Mes)</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{PagarmeService.formatCurrency(stats.despesasMes)}</div>
            <p className="text-xs text-gray-500">Estimativa baseada nas cobrancas pagas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Contas</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{contas.length}</div>
            <p className="text-xs text-gray-500">{contas.length > 0 ? "Fonte financeira conectada" : "Nenhuma conta real conectada"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar contas..."
              className="pl-10 w-64"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar contas"
            />
          </div>
        </div>
        {loading ? <p className="text-sm text-gray-500">Atualizando dados financeiros...</p> : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Contas Bancarias</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {contas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-900">Nome</TableHead>
                  <TableHead className="text-gray-900">Banco</TableHead>
                  <TableHead className="text-gray-900">Agencia</TableHead>
                  <TableHead className="text-gray-900">Conta</TableHead>
                  <TableHead className="text-gray-900">Tipo</TableHead>
                  <TableHead className="text-gray-900">Saldo Disponivel</TableHead>
                  <TableHead className="text-gray-900">A Receber</TableHead>
                  <TableHead className="text-gray-900">Status</TableHead>
                  <TableHead className="text-right text-gray-900">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contas
                  .filter((account) => account.nome.toLowerCase().includes(search.toLowerCase()))
                  .map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium text-gray-900">{account.nome}</TableCell>
                      <TableCell className="text-gray-900">{account.banco}</TableCell>
                      <TableCell className="text-gray-900">{account.agencia}</TableCell>
                      <TableCell className="text-gray-900">{account.conta}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">{account.tipo}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">{PagarmeService.formatCurrency(account.saldo)}</TableCell>
                      <TableCell className="font-medium text-yellow-600">{PagarmeService.formatCurrency(account.saldoAReceber)}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{account.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" disabled>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma conta real encontrada</p>
              <p className="text-sm">A tabela so exibe contas quando a integracao financeira retorna saldo real.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Movimentacoes Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {movimentacoes.length > 0 ? (
              movimentacoes.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">{getPaymentMethodIcon(transaction.metodo)}</div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.descricao}</p>
                      <p className="text-sm text-gray-500">{transaction.conta} - {transaction.data}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.tipo === "receita" ? "text-green-600" : "text-yellow-600"}`}>
                      {transaction.tipo === "receita" ? "+" : ""}
                      {PagarmeService.formatCurrency(transaction.valor)}
                    </p>
                    <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma movimentacao encontrada</p>
                <p className="text-sm">{warningMessage || "As transacoes so aparecem aqui quando o provedor retorna dados reais."}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
