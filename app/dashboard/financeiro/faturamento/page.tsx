"use client"

import { useMemo, useState } from "react"
import {
  Search,
  RefreshCw,
  Wallet,
  Users,
  DollarSign,
  Loader2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProvidersBilling, type ProviderBilling } from "@/hooks/use-providers-billing"

export default function FaturamentoPage() {
  const [search, setSearch] = useState("")
  const [filterEarnings, setFilterEarnings] = useState<string>("all")
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<ProviderBilling | null>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentDescription, setPaymentDescription] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("pix")
  const [processingPayment, setProcessingPayment] = useState(false)
  const [amountError, setAmountError] = useState<string | null>(null)

  const { toast } = useToast()
  const { providers, loading, error, refetch, totalEarnings } = useProvidersBilling({
    autoRefresh: true,
    refreshInterval: 30000,
  })

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)

  const formatPixKeyType = (rawType?: string): string => {
    const normalized = String(rawType || "").trim().toLowerCase()
    if (!normalized) return "PIX"

    if (["telefone", "phone", "mobile", "cel"].includes(normalized)) return "CELULAR"
    if (["cpf", "cnpj", "email", "aleatoria", "random"].includes(normalized)) {
      return normalized.toUpperCase()
    }

    return normalized.toUpperCase()
  }

  const getProviderDisplayName = (provider: ProviderBilling | null): string => {
    if (!provider) return ""

    const name = String(provider.nome || "").trim()
    const isPlaceholder =
      name.length === 0 || ["sem nome", "sem-nome", "-", "na"].includes(name.toLowerCase())

    if (!isPlaceholder) return name
    return provider.email || provider.phone || `ID: ${(provider.uid || provider.id).slice(0, 8)}...`
  }

  const filteredProviders = useMemo(() => {
    let filtered = providers

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((provider) =>
        provider.nome?.toLowerCase().includes(searchLower) ||
        provider.email?.toLowerCase().includes(searchLower) ||
        provider.phone?.includes(search) ||
        provider.uid?.toLowerCase().includes(searchLower)
      )
    }

    if (filterEarnings === "with-earnings") {
      filtered = filtered.filter((provider) => provider.totalEarnings > 0)
    } else if (filterEarnings === "without-earnings") {
      filtered = filtered.filter((provider) => provider.totalEarnings <= 0)
    }

    return [...filtered].sort((a, b) => b.totalEarnings - a.totalEarnings)
  }, [providers, search, filterEarnings])

  const stats = useMemo(() => {
    const withEarnings = providers.filter((provider) => provider.totalEarnings > 0).length
    const totalJobs = providers.reduce((sum, provider) => sum + (provider.totalJobs || 0), 0)

    return {
      totalProviders: providers.length,
      withEarnings,
      totalEarnings,
      totalJobs,
      averageEarnings: providers.length > 0 ? totalEarnings / providers.length : 0,
    }
  }, [providers, totalEarnings])

  const handleOpenPaymentDialog = (provider: ProviderBilling) => {
    setSelectedProvider(provider)
    setPaymentAmount(provider.totalEarnings.toFixed(2))
    setPaymentDescription(`Pagamento de saldo pendente para ${getProviderDisplayName(provider)}`)
    setPaymentMethod("pix")
    setPaymentDialogOpen(true)
    setAmountError(null)
  }

  const handleAmountChange = (value: string) => {
    const normalized = value.replace(",", ".")
    const available = Number(selectedProvider?.totalEarnings || 0)
    let parsed = Number(normalized)

    if (Number.isNaN(parsed)) {
      setPaymentAmount(value)
      setAmountError("Informe um valor numerico valido")
      return
    }

    if (parsed > available) {
      parsed = available
    }
    if (parsed < 0) {
      parsed = 0
    }

    setPaymentAmount(parsed === 0 ? "" : parsed.toFixed(2))

    if (parsed === 0) {
      setAmountError("Valor deve ser maior que 0")
    } else {
      setAmountError(null)
    }
  }

  const handleProcessPayment = async () => {
    if (!selectedProvider) return

    const amount = parseFloat((paymentAmount || "0").replace(",", "."))

    if (Number.isNaN(amount) || amount <= 0) {
      toast({
        title: "Erro",
        description: "Valor invalido",
        variant: "destructive",
      })
      return
    }

    if (amount > selectedProvider.totalEarnings) {
      toast({
        title: "Erro",
        description: `Valor excede o total disponivel de ${formatCurrency(selectedProvider.totalEarnings)}`,
        variant: "destructive",
      })
      return
    }

    setProcessingPayment(true)

    try {
      const response = await fetch("/api/financial/providers/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: selectedProvider.id,
          amount,
          description: paymentDescription,
          paymentMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erro ao processar pagamento")
      }

      toast({
        title: "Pagamento processado",
        description: `Pagamento de ${formatCurrency(amount)} realizado para ${getProviderDisplayName(selectedProvider)}`,
      })

      setPaymentDialogOpen(false)
      setSelectedProvider(null)
      setPaymentAmount("")
      setPaymentDescription("")
      await refetch()
    } catch (err) {
      toast({
        title: "Erro ao processar pagamento",
        description: err instanceof Error ? err.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setProcessingPayment(false)
    }
  }

  if (loading && providers.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pagamentos a Prestadores</h1>
          <p className="text-gray-600 dark:text-gray-400">appservico.com &gt; financeiro &gt; pagamentos a prestadores</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Carregando prestadores...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pagamentos a Prestadores</h1>
          <p className="text-gray-600 dark:text-gray-400">appservico.com &gt; financeiro &gt; pagamentos a prestadores</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Erro ao carregar dados</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
              </div>
            </div>
            <Button onClick={() => void refetch()} className="mt-4" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pagamentos a Prestadores</h1>
        <p className="text-gray-600 dark:text-gray-400">appservico.com &gt; financeiro &gt; pagamentos a prestadores</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Prestadores</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProviders}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total a Pagar</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalEarnings)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">{stats.withEarnings} prestador(es) com saldo pendente</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Media por Prestador</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.averageEarnings)}</p>
              </div>
              <Wallet className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pedidos Elegiveis</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalJobs}</p>
              </div>
              <CreditCard className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar prestador..."
              className="pl-10 w-64"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Select value={filterEarnings} onValueChange={setFilterEarnings}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filtrar por saldo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os prestadores</SelectItem>
              <SelectItem value="with-earnings">Com saldo pendente</SelectItem>
              <SelectItem value="without-earnings">Sem saldo pendente</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => void refetch()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prestador</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Chave PIX</TableHead>
                  <TableHead className="text-right">Pedidos Elegiveis</TableHead>
                  <TableHead className="text-right">Saldo Pendente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Nenhum prestador encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{getProviderDisplayName(provider)}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {(provider.uid || provider.id).slice(0, 8)}...
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          {provider.phone ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{provider.phone}</p>
                          ) : null}
                          {provider.email ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{provider.email}</p>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell>
                        {provider.pixKey ? (
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{provider.pixKey}</p>
                            <Badge variant="outline" className="text-xs">
                              {formatPixKeyType(provider.pixKeyType)}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Nao cadastrada</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <span className="font-medium">{provider.totalJobs || provider.eligibleOrdersCount || 0}</span>
                      </TableCell>

                      <TableCell className="text-right">
                        <span
                          className={`font-bold text-lg ${
                            provider.totalEarnings > 0 ? "text-green-600 dark:text-green-400" : "text-gray-400"
                          }`}
                        >
                          {formatCurrency(provider.totalEarnings)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={provider.isActive ? "default" : "secondary"} className="w-fit">
                            {provider.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                          {provider.isVerified ? (
                            <Badge variant="outline" className="w-fit text-green-600 border-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verificado
                            </Badge>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleOpenPaymentDialog(provider)}
                          disabled={provider.totalEarnings <= 0}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          {`Pagar ${formatCurrency(provider.totalEarnings)}`}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[560px] max-h-[85vh] overflow-y-auto z-[100] bg-white border-slate-200 rounded-2xl shadow-xl text-slate-900">
          <DialogHeader className="pb-4 border-b border-slate-200">
            <DialogTitle className="flex items-center space-x-3 text-2xl font-bold">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <span className="text-slate-900">Confirmar Pagamento</span>
            </DialogTitle>
            <DialogDescription className="text-base text-slate-600 mt-2">
              Processar pagamento para <span className="font-semibold text-slate-900">{getProviderDisplayName(selectedProvider)}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedProvider ? (
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-900">Valor Disponivel</Label>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-slate-900">{formatCurrency(selectedProvider.totalEarnings)}</p>
                    <Wallet className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-semibold text-slate-900">
                  Valor a Pagar <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={selectedProvider.totalEarnings}
                  value={paymentAmount}
                  onChange={(event) => handleAmountChange(event.target.value)}
                  placeholder="0.00"
                  className="text-lg font-medium h-12 text-slate-900 placeholder:text-slate-400 bg-white border-slate-300"
                />
                <p className="text-xs text-slate-600">
                  Maximo disponivel: <span className="font-semibold">{formatCurrency(selectedProvider.totalEarnings)}</span>
                </p>
                {amountError ? <p className="text-xs text-red-600">{amountError}</p> : null}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="method" className="text-sm font-semibold text-slate-900">
                    Metodo de Pagamento
                  </Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="method" className="h-12 text-slate-900 bg-white border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-slate-900 border-slate-200">
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="ted">TED</SelectItem>
                      <SelectItem value="doc">DOC</SelectItem>
                      <SelectItem value="transfer">Transferencia Bancaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === "pix" ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-900">Chave PIX</Label>
                    <div className="p-3 min-h-12 flex flex-col justify-center rounded-lg border border-slate-200 bg-slate-50">
                      {selectedProvider.pixKey ? (
                        <>
                          <div className="truncate w-full text-sm font-medium text-slate-900" title={selectedProvider.pixKey}>
                            {selectedProvider.pixKey}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Tipo: {formatPixKeyType(selectedProvider.pixKeyType)}
                          </div>
                        </>
                      ) : (
                        <div className="w-full text-sm text-slate-500">Prestador sem chave PIX</div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-slate-900">
                  Descricao <span className="text-slate-500 text-xs font-normal">(opcional)</span>
                </Label>
                <Textarea
                  id="description"
                  value={paymentDescription}
                  onChange={(event) => setPaymentDescription(event.target.value)}
                  placeholder="Descricao do pagamento..."
                  rows={3}
                  className="resize-none text-slate-900 placeholder:text-slate-400 bg-white border-slate-300"
                />
              </div>
            </div>
          ) : null}

          <DialogFooter className="pt-4 border-t border-slate-200 gap-3 sticky bottom-0 bg-white">
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
              disabled={processingPayment}
              className="flex-1 sm:flex-none bg-slate-200 text-slate-900 hover:bg-slate-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => void handleProcessPayment()}
              disabled={
                processingPayment ||
                !paymentAmount ||
                !!amountError ||
                parseFloat((paymentAmount || "0").replace(",", ".")) <= 0
              }
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg flex-1 sm:flex-none min-w-[180px]"
            >
              {processingPayment ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Confirmar Pagamento
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

