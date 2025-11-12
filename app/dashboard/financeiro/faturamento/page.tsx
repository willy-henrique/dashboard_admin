"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  RefreshCw, 
  Wallet, 
  Users, 
  DollarSign, 
  Loader2,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { useMemo, useState } from "react"
import { useProvidersBilling } from "@/hooks/use-providers-billing"
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

export default function FaturamentoPage() {
  const [search, setSearch] = useState("")
  const [filterEarnings, setFilterEarnings] = useState<string>("all") // all, with-earnings, without-earnings
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentDescription, setPaymentDescription] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("pix")
  const [processingPayment, setProcessingPayment] = useState(false)
  
  const { toast } = useToast()
  const { providers, loading, error, refetch, totalEarnings } = useProvidersBilling({ 
    autoRefresh: true,
    refreshInterval: 30000 // Atualizar a cada 30 segundos
  })

  // Filtrar prestadores
  const filteredProviders = useMemo(() => {
    let filtered = providers

    // Filtro de busca
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(p => 
        p.nome?.toLowerCase().includes(searchLower) ||
        p.email?.toLowerCase().includes(searchLower) ||
        p.phone?.includes(search) ||
        p.uid?.toLowerCase().includes(searchLower)
      )
    }

    // Filtro por ganhos
    if (filterEarnings === "with-earnings") {
      filtered = filtered.filter(p => p.totalEarnings > 0)
    } else if (filterEarnings === "without-earnings") {
      filtered = filtered.filter(p => p.totalEarnings === 0)
    }

    // Ordenar por totalEarnings (maior primeiro)
    return filtered.sort((a, b) => b.totalEarnings - a.totalEarnings)
  }, [providers, search, filterEarnings])

  // Estatísticas
  const stats = useMemo(() => {
    const withEarnings = providers.filter(p => p.totalEarnings > 0).length
    const totalJobs = providers.reduce((sum, p) => sum + (p.totalJobs || 0), 0)
    
    return {
      totalProviders: providers.length,
      withEarnings,
      totalEarnings,
      totalJobs,
      averageEarnings: providers.length > 0 ? totalEarnings / providers.length : 0,
    }
  }, [providers, totalEarnings])

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Abrir dialog de pagamento
  const handleOpenPaymentDialog = (provider: any) => {
    setSelectedProvider(provider)
    setPaymentAmount(provider.totalEarnings.toFixed(2))
    setPaymentDescription(`Pagamento de ganhos acumulados para ${provider.nome}`)
    setPaymentMethod("pix")
    setPaymentDialogOpen(true)
  }

  // Processar pagamento
  const handleProcessPayment = async () => {
    if (!selectedProvider) return

    const amount = parseFloat(paymentAmount)
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Erro",
        description: "Valor inválido",
        variant: "destructive",
      })
      return
    }

    if (amount > selectedProvider.totalEarnings) {
      toast({
        title: "Erro",
        description: `Valor excede o total disponível de ${formatCurrency(selectedProvider.totalEarnings)}`,
        variant: "destructive",
      })
      return
    }

    setProcessingPayment(true)

    try {
      const response = await fetch('/api/financial/providers/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId: selectedProvider.id,
          amount,
          description: paymentDescription,
          paymentMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }

      toast({
        title: "Pagamento processado",
        description: `Pagamento de ${formatCurrency(amount)} realizado com sucesso para ${selectedProvider.nome}`,
      })

      // Fechar dialog e atualizar dados
      setPaymentDialogOpen(false)
      setSelectedProvider(null)
      setPaymentAmount("")
      setPaymentDescription("")
      refetch()
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      toast({
        title: "Erro ao processar pagamento",
        description: error instanceof Error ? error.message : "Erro desconhecido",
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Faturamento</h1>
          <p className="text-gray-600 dark:text-gray-400">appservico.com › financeiro › faturamento</p>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Faturamento</h1>
          <p className="text-gray-600 dark:text-gray-400">appservico.com › financeiro › faturamento</p>
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
            <Button onClick={refetch} className="mt-4" variant="outline">
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Faturamento</h1>
        <p className="text-gray-600 dark:text-gray-400">appservico.com › financeiro › faturamento</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Prestadores</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalProviders}
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total a Pagar</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalEarnings)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.withEarnings} prestador(es) com saldo pendente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Média por Prestador</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.averageEarnings)}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Serviços</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.totalJobs}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Ações e Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Buscar prestador..." 
              className="pl-10 w-64" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          <Select value={filterEarnings} onValueChange={setFilterEarnings}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por ganhos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os prestadores</SelectItem>
              <SelectItem value="with-earnings">Com saldo pendente</SelectItem>
              <SelectItem value="without-earnings">Sem saldo pendente</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refetch} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Tabela de Prestadores */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prestador</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Chave PIX</TableHead>
                  <TableHead className="text-right">Total de Serviços</TableHead>
                  <TableHead className="text-right">Ganhos Acumulados</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
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
                          <p className="font-medium text-gray-900 dark:text-white">
                            {provider.nome || 'Sem nome'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {provider.uid.substring(0, 8)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {provider.phone && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {provider.phone}
                            </p>
                          )}
                          {provider.email && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {provider.email}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {provider.pixKey ? (
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {provider.pixKey}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {provider.pixKeyType?.toUpperCase() || 'PIX'}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Não cadastrada</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium">{provider.totalJobs || 0}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-bold text-lg ${
                          provider.totalEarnings > 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-gray-400'
                        }`}>
                          {formatCurrency(provider.totalEarnings)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge 
                            variant={provider.isActive ? "default" : "secondary"}
                            className="w-fit"
                          >
                            {provider.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                          {provider.isVerified && (
                            <Badge variant="outline" className="w-fit text-green-600 border-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verificado
                            </Badge>
                          )}
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
                          Pagar
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

      {/* Dialog de Confirmação de Pagamento */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[550px] z-[100] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="flex items-center space-x-3 text-2xl font-bold">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <span className="text-gray-900 dark:text-white">Confirmar Pagamento</span>
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 dark:text-gray-300 mt-2">
              Processar pagamento para <span className="font-semibold text-gray-900 dark:text-white">{selectedProvider?.nome}</span>
            </DialogDescription>
          </DialogHeader>
          
          {selectedProvider && (
            <div className="space-y-6 py-6">
              {/* Valor Disponível - Destaque */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Valor Disponível</Label>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(selectedProvider.totalEarnings)}
                    </p>
                    <Wallet className="h-8 w-8 text-green-500 dark:text-green-400" />
                  </div>
                </div>
              </div>

              {/* Valor a Pagar */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Valor a Pagar <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={selectedProvider.totalEarnings}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  className="text-lg font-medium h-12"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Máximo disponível: <span className="font-semibold">{formatCurrency(selectedProvider.totalEarnings)}</span>
                </p>
              </div>

              {/* Método de Pagamento */}
              <div className="space-y-2">
                <Label htmlFor="method" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Método de Pagamento
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="method" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">💳 PIX</SelectItem>
                    <SelectItem value="ted">🏦 TED</SelectItem>
                    <SelectItem value="doc">📄 DOC</SelectItem>
                    <SelectItem value="transfer">💸 Transferência Bancária</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Descrição <span className="text-gray-400 text-xs font-normal">(opcional)</span>
                </Label>
                <Textarea
                  id="description"
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  placeholder="Descrição do pagamento..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Informações PIX */}
              {selectedProvider.pixKey && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 dark:bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        Chave PIX
                      </p>
                      <p className="text-base font-mono font-medium text-blue-800 dark:text-blue-200 mb-2">
                        {selectedProvider.pixKey}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Tipo: <span className="font-semibold">{selectedProvider.pixKeyType?.toUpperCase() || 'PIX'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-700 gap-3">
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
              disabled={processingPayment}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleProcessPayment}
              disabled={processingPayment || !paymentAmount || parseFloat(paymentAmount) <= 0}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg flex-1 sm:flex-none min-w-[180px]"
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
