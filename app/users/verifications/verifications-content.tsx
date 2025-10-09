"use client"

import { useMemo, useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Mail, 
  Phone, 
  Shield,
  Eye,
  Download,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  MessageSquare,
  User,
  Calendar,
  Building,
  MapPin,
  Star,
  TrendingUp,
  Users,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowLeft
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useDocumentVerification } from "@/hooks/use-document-verification"
import { DocumentViewer } from "@/components/users/document-viewer"
import { VerificationHistory } from "@/components/users/verification-history"
import { ServiceAcceptanceDocs } from "@/components/users/service-acceptance-docs"
import { UserDocumentsStructure } from "@/components/users/user-documents-structure"
import { useDocumentAuth } from "@/hooks/use-document-auth"
import { useToast } from "@/hooks/use-toast"
import { PageWithBack } from "@/components/layout/page-with-back"
import { cn } from "@/lib/utils"

export const VerificationsPageContent = () => {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>("all")
  const [selectedVerification, setSelectedVerification] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<string>("submittedAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [activeTab, setActiveTab] = useState("all")
  const [modalTab, setModalTab] = useState("documents")
  const { toast } = useToast()
  const { user } = useDocumentAuth()

  // Usar o hook de verificação de documentos
  const {
    verifications,
    loading,
    stats,
    approveVerification,
    rejectVerification,
    filterVerifications,
    refetch
  } = useDocumentVerification()

  // Funções auxiliares
  const toggleCardExpansion = (verificationId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(verificationId)) {
      newExpanded.delete(verificationId)
    } else {
      newExpanded.add(verificationId)
    }
    setExpandedCards(newExpanded)
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  // Filtrar e ordenar verificações
  const filteredVerifications = useMemo(() => {
    let filtered = filterVerifications({
      status: statusFilter === "all" ? undefined : statusFilter as any,
      search: search || undefined,
      documentType: documentTypeFilter === "all" ? undefined : documentTypeFilter
    })

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case "providerName":
          aValue = a.providerName.toLowerCase()
          bValue = b.providerName.toLowerCase()
          break
        case "submittedAt":
          aValue = new Date(a.submittedAt).getTime()
          bValue = new Date(b.submittedAt).getTime()
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = a[sortBy as keyof typeof a]
          bValue = b[sortBy as keyof typeof b]
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [verifications, statusFilter, search, documentTypeFilter, sortBy, sortOrder, filterVerifications])

  const handleApprove = async (verificationId: string) => {
    const success = await approveVerification(verificationId, user?.email || "admin")
    if (success) {
      setShowDetails(false)
    }
  }

  const handleReject = async (verificationId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo da rejeição.",
        variant: "destructive"
      })
      return
    }

    const success = await rejectVerification(verificationId, rejectionReason, user?.email || "admin")
    if (success) {
      setShowDetails(false)
      setShowRejectDialog(false)
      setRejectionReason("")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pendente</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Aprovado</Badge>
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Rejeitado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'cpf': return 'CPF/RG'
      case 'cnh': return 'CNH'
      case 'comprovante_residencia': return 'Comprovante de Residência'
      case 'certificado': return 'Certificados'
      case 'outros': return 'Outros'
      default: return type
    }
  }

  const countTotalDocuments = (documents: any) => {
    return Object.values(documents).reduce((total: number, docs: any) => {
      return total + (docs ? docs.length : 0)
    }, 0)
  }

  return (
    <AppShell hideSidebar={true}>
      <div className="space-y-6">
        {/* Header da página */}
        <div className="flex flex-col gap-6">
          {/* Botão de voltar */}
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Usuários
            </Button>
          </div>
          
          {/* Título e ações */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                  Verificações de Prestadores
                </h1>
                <p className="text-muted-foreground">
                  Gerencie e aprove cadastros de prestadores de serviço
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                {loading ? "Atualizando..." : "Atualizar"}
              </Button>
              <Button 
                variant="default"
                className="flex items-center gap-2"
              >
                <FileCheck className="h-4 w-4" />
                Relatório
              </Button>
            </div>
          </div>
        </div>

        {/* Debug removido: exibimos apenas documentos reais do Storage */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Total de Verificações</p>
                  <p className="text-xl lg:text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalDocuments} documentos
                  </p>
                </div>
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-xl lg:text-2xl font-bold text-orange-600">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.pending > 0 ? "Aguardando análise" : "Nenhuma pendência"}
                  </p>
                </div>
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Aprovados</p>
                  <p className="text-xl lg:text-2xl font-bold text-green-600">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.approved > 0 ? `${Math.round((stats.approved / stats.total) * 100)}% do total` : "Nenhum aprovado"}
                  </p>
                </div>
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm font-medium text-muted-foreground">Rejeitados</p>
                  <p className="text-xl lg:text-2xl font-bold text-red-600">{stats.rejected}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.rejected > 0 ? `${Math.round((stats.rejected / stats.total) * 100)}% do total` : "Nenhum rejeitado"}
                  </p>
                </div>
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-5 w-5 lg:h-6 lg:w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5" />
                Filtros e Busca
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submittedAt">Data de Envio</SelectItem>
                    <SelectItem value="providerName">Nome</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Busca */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome, email, telefone, CPF, RG..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tabs para filtros rápidos */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
                  Todos ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="pending" onClick={() => setStatusFilter("pending")}>
                  Pendentes ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="approved" onClick={() => setStatusFilter("approved")}>
                  Aprovados ({stats.approved})
                </TabsTrigger>
                <TabsTrigger value="rejected" onClick={() => setStatusFilter("rejected")}>
                  Rejeitados ({stats.rejected})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Filtros de Tipo de Documento */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Documento</label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={documentTypeFilter === "all" ? "default" : "outline"}
                  onClick={() => setDocumentTypeFilter("all")}
                  size="sm"
                  className="text-xs"
                >
                  Todos
                </Button>
                <Button 
                  variant={documentTypeFilter === "cpf" ? "default" : "outline"}
                  onClick={() => setDocumentTypeFilter("cpf")}
                  size="sm"
                  className="text-xs"
                >
                  CPF/RG
                </Button>
                <Button 
                  variant={documentTypeFilter === "cnh" ? "default" : "outline"}
                  onClick={() => setDocumentTypeFilter("cnh")}
                  size="sm"
                  className="text-xs"
                >
                  CNH
                </Button>
                <Button 
                  variant={documentTypeFilter === "comprovante_residencia" ? "default" : "outline"}
                  onClick={() => setDocumentTypeFilter("comprovante_residencia")}
                  size="sm"
                  className="text-xs"
                >
                  Comprovante
                </Button>
                <Button 
                  variant={documentTypeFilter === "certificado" ? "default" : "outline"}
                  onClick={() => setDocumentTypeFilter("certificado")}
                  size="sm"
                  className="text-xs"
                >
                  Certificados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verifications List */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                Verificações
                <Badge variant="secondary" className="ml-2">
                  {filteredVerifications.length}
                </Badge>
              </CardTitle>
              {filteredVerifications.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Ordenado por: {sortBy === "submittedAt" ? "Data de Envio" : sortBy === "providerName" ? "Nome" : "Status"}</span>
                  <span className="capitalize">({sortOrder})</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 bg-muted/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredVerifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-6">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Nenhuma verificação encontrada
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {search || statusFilter !== "all" || documentTypeFilter !== "all" 
                    ? 'Tente ajustar os filtros de busca para encontrar verificações.' 
                    : 'Não há verificações pendentes no momento. Novos prestadores aparecerão aqui quando enviarem seus documentos.'}
                </p>
                {(search || statusFilter !== "all" || documentTypeFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch("")
                      setStatusFilter("all")
                      setDocumentTypeFilter("all")
                      setActiveTab("all")
                    }}
                    className="mt-4"
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVerifications.map((verification) => {
                  const isExpanded = expandedCards.has(verification.id)
                  return (
                    <Card key={verification.id} className="border shadow-sm hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex flex-col gap-4">
                          {/* Header do Card */}
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                                <span className="font-semibold text-primary-foreground text-lg">
                                  {verification.providerName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-semibold text-lg">
                                  {verification.providerName}
                                </h3>
                                <div className="flex flex-col gap-1 text-sm text-muted-foreground lg:flex-row lg:items-center lg:gap-4">
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    {verification.providerEmail}
                                  </div>
                                  {verification.providerPhone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-4 w-4" />
                                      {verification.providerPhone}
                                    </div>
                                  )}
                                </div>
                                {/* CPF e RG em destaque */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {verification.providerCpf && (
                                    <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                                      <FileText className="h-4 w-4 text-blue-600" />
                                      <span className="text-sm font-semibold text-blue-700">CPF: {verification.providerCpf}</span>
                                    </div>
                                  )}
                                  {verification.providerRg && (
                                    <div className="flex items-center gap-1 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                                      <FileText className="h-4 w-4 text-purple-600" />
                                      <span className="text-sm font-semibold text-purple-700">RG: {verification.providerRg}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 lg:items-end">
                              <div className="flex items-center gap-2">
                                {getStatusBadge(verification.status)}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleCardExpansion(verification.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {countTotalDocuments(verification.documents)} documentos • {formatDistanceToNow(verification.submittedAt, { addSuffix: true, locale: ptBR })}
                              </div>
                            </div>
                          </div>

                          {/* Conteúdo Expandido */}
                          {isExpanded && (
                            <div className="space-y-4 pt-4 border-t">
                              {/* Resumo dos tipos de documentos */}
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Documentos Enviados</h4>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(verification.documents).map(([type, docs]) => {
                                    if (!docs || !Array.isArray(docs) || docs.length === 0) return null
                                    return (
                                      <Badge key={type} variant="outline" className="text-xs">
                                        {getDocumentTypeLabel(type)} ({docs.length})
                                      </Badge>
                                    )
                                  })}
                                </div>
                              </div>

                              {/* Ações */}
                              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedVerification(verification)
                                    setShowDetails(true)
                                  }}
                                  className="flex items-center gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  Ver Documentos
                                </Button>
                                
                                {verification.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleApprove(verification.id)}
                                      className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      Aprovar
                                    </Button>
                                    <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          className="flex items-center gap-2"
                                          onClick={() => setSelectedVerification(verification)}
                                        >
                                          <XCircle className="h-4 w-4" />
                                          Rejeitar
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-md">
                                        <DialogHeader>
                                          <DialogTitle className="flex items-center gap-2">
                                            <AlertTriangle className="h-5 w-5 text-red-500" />
                                            Rejeitar Verificação
                                          </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <p className="text-sm text-muted-foreground">
                                            Informe o motivo da rejeição para <strong>{selectedVerification?.providerName}</strong>:
                                          </p>
                                          <Textarea
                                            placeholder="Ex: Documentos ilegíveis, informações incompletas, etc."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            rows={4}
                                          />
                                          <div className="flex justify-end gap-2">
                                            <Button
                                              variant="outline"
                                              onClick={() => {
                                                setShowRejectDialog(false)
                                                setRejectionReason("")
                                              }}
                                            >
                                              Cancelar
                                            </Button>
                                            <Button
                                              variant="destructive"
                                              onClick={() => selectedVerification && handleReject(selectedVerification.id)}
                                            >
                                              Confirmar Rejeição
                                            </Button>
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Details Modal */}
        {showDetails && selectedVerification && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="w-full max-w-7xl max-h-[95vh] bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Header do Modal */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Documentos do Prestador</h2>
                      <p className="text-orange-100">{selectedVerification.providerName}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowDetails(false)}
                    className="h-10 w-10 p-0 text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Conteúdo do Modal */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-140px)] bg-gray-50">
                {/* Provider Info */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-orange-600" />
                    Informações do Prestador
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nome</p>
                        <p className="font-semibold text-gray-900">{selectedVerification.providerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="font-semibold text-gray-900">{selectedVerification.providerEmail}</p>
                      </div>
                    </div>
                    {selectedVerification.providerPhone && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Telefone</p>
                          <p className="font-semibold text-gray-900">{selectedVerification.providerPhone}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Enviado</p>
                        <p className="font-semibold text-gray-900">
                          {format(selectedVerification.submittedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credenciais e Documentos Pessoais - DESTAQUE */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 shadow-sm border-2 border-blue-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Credenciais e Documentos Pessoais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedVerification.providerCpf && (
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">CPF</p>
                            <p className="text-lg font-bold text-blue-900">{selectedVerification.providerCpf}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedVerification.providerRg && (
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">RG</p>
                            <p className="text-lg font-bold text-purple-900">{selectedVerification.providerRg}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedVerification.providerBirthDate && (
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Data de Nascimento</p>
                            <p className="text-lg font-bold text-green-900">{selectedVerification.providerBirthDate}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedVerification.providerAddress && (
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-200 md:col-span-2 lg:col-span-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Endereço</p>
                            <p className="text-base font-semibold text-orange-900">{selectedVerification.providerAddress}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {!selectedVerification.providerCpf && !selectedVerification.providerRg && !selectedVerification.providerBirthDate && !selectedVerification.providerAddress && (
                      <div className="col-span-full text-center py-4 text-gray-500">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>Nenhuma credencial adicional cadastrada</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status e Ações Rápidas */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-medium text-gray-700">Status da Verificação:</span>
                        {getStatusBadge(selectedVerification.status)}
                      </div>
                    </div>
                    {selectedVerification.status === 'pending' && (
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                          onClick={() => {
                            handleApprove(selectedVerification.id)
                            setShowDetails(false)
                          }}
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2 px-6 py-3"
                        >
                          <CheckCircle className="h-5 w-5" />
                          Aprovar Prestador
                        </Button>
                        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              className="flex items-center gap-2 px-6 py-3"
                            >
                              <XCircle className="h-5 w-5" />
                              Rejeitar Prestador
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Rejeitar Verificação
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Informe o motivo da rejeição para <strong>{selectedVerification.providerName}</strong>:
                              </p>
                              <Textarea
                                placeholder="Ex: Documentos ilegíveis, informações incompletas, etc."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setShowRejectDialog(false)
                                    setRejectionReason("")
                                  }}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleReject(selectedVerification.id)}
                                >
                                  Confirmar Rejeição
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tabs para Documentos e Documentação */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <Tabs value={modalTab} onValueChange={setModalTab} className="w-full">
                    <div className="p-6 pb-0">
                      <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                        <TabsTrigger value="documents" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
                          <FileText className="h-4 w-4 mr-2" />
                          Documentos
                        </TabsTrigger>
                        <TabsTrigger value="structure" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
                          <Building className="h-4 w-4 mr-2" />
                          Estrutura
                        </TabsTrigger>
                        <TabsTrigger value="acceptance" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aceitação
                        </TabsTrigger>
                        <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
                          <Clock className="h-4 w-4 mr-2" />
                          Histórico
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <div className="p-6">
                      <TabsContent value="documents" className="space-y-6 mt-0">
                        <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                          <FileText className="h-6 w-6 text-orange-600" />
                          Documentos Enviados
                        </h3>
                        {Object.entries(selectedVerification.documents).map(([type, documents]) => {
                          if (!documents || !Array.isArray(documents) || documents.length === 0) return null
                          
                          return (
                            <div key={type} className="bg-gray-50 rounded-lg p-6">
                              <DocumentViewer
                                documents={documents as any[]}
                                documentType={type}
                                showActions={false}
                              />
                            </div>
                          )
                        })}
                      </TabsContent>
                      
                      <TabsContent value="structure" className="mt-0">
                        <UserDocumentsStructure
                          providerId={selectedVerification.providerId}
                          providerName={selectedVerification.providerName}
                          documents={selectedVerification.documents}
                          submittedAt={selectedVerification.submittedAt}
                        />
                      </TabsContent>
                      
                      <TabsContent value="acceptance" className="mt-0">
                        <ServiceAcceptanceDocs
                          verification={selectedVerification}
                          onAccept={() => {
                            handleApprove(selectedVerification.id)
                            setShowDetails(false)
                          }}
                          onReject={() => setShowRejectDialog(true)}
                        />
                      </TabsContent>
                      
                      <TabsContent value="history" className="mt-0">
                        <VerificationHistory
                          verificationId={selectedVerification.id}
                          providerName={selectedVerification.providerName}
                        />
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
