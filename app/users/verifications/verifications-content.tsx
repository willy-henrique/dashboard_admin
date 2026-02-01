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
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  User,
  Calendar,
  Building,
  MapPin,
  FileCheck,
  X,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
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
    refetch,
    fetchProviderVerification
  } = useDocumentVerification()
  const [loadingDocumentsFor, setLoadingDocumentsFor] = useState<string | null>(null)

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
      case "pending":
        return (
          <Badge className="rounded-full bg-amber-50 text-amber-700 border-amber-200/80 font-medium gap-1.5 px-3 py-1">
            <Clock className="h-3.5 w-3.5" /> Pendente
          </Badge>
        )
      case "approved":
        return (
          <Badge className="rounded-full bg-emerald-50 text-emerald-700 border-emerald-200/80 font-medium gap-1.5 px-3 py-1">
            <CheckCircle className="h-3.5 w-3.5" /> Aprovado
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="rounded-full bg-rose-50 text-rose-700 border-rose-200/80 font-medium gap-1.5 px-3 py-1">
            <XCircle className="h-3.5 w-3.5" /> Rejeitado
          </Badge>
        )
      default:
        return <Badge variant="outline" className="rounded-full">{status}</Badge>
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
    <AppShell>
      <div className="w-full max-w-full min-w-0 overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-orange-50/30">
        <div className="space-y-6 sm:space-y-8 pb-8 sm:pb-12 overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="w-fit -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl h-10 sm:h-11 px-3 sm:px-4 gap-2 font-medium transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Voltar para Usuários</span>
            </Button>

            <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-3 sm:gap-5 min-w-0">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25 flex-shrink-0">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 truncate">
                    Verificações de Prestadores
                  </h1>
                  <p className="text-slate-600 text-sm sm:text-base max-w-xl line-clamp-2">
                    Gerencie e aprove cadastros de prestadores de serviço
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  disabled={loading}
                  className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 shadow-sm h-10 sm:h-11 px-3 sm:px-5 gap-2 font-medium text-sm sm:text-base"
                >
                  <RefreshCw className={cn("h-4 w-4 flex-shrink-0", loading && "animate-spin")} />
                  {loading ? "Atualizando..." : "Atualizar"}
                </Button>
                <Button className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/25 h-10 sm:h-11 px-3 sm:px-5 gap-2 font-medium text-white border-0 text-sm sm:text-base">
                  <FileCheck className="h-4 w-4 flex-shrink-0" />
                  Relatório
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="rounded-xl sm:rounded-2xl border-0 bg-white/80 backdrop-blur shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 overflow-hidden min-w-0">
              <div className="h-1 w-full bg-gradient-to-r from-slate-400 to-slate-500" />
              <CardContent className="p-3 sm:p-5 lg:p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Total</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tabular-nums">{stats.total}</p>
                    <p className="text-xs text-slate-500">{stats.totalDocuments} documentos</p>
                  </div>
                  <div className="rounded-xl sm:rounded-2xl bg-slate-100 p-2 sm:p-3">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl sm:rounded-2xl border-0 bg-white/80 backdrop-blur shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-amber-200/40 transition-all duration-300 overflow-hidden min-w-0">
              <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
              <CardContent className="p-3 sm:p-5 lg:p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Pendentes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-600 tabular-nums">{stats.pending}</p>
                    <p className="text-xs text-slate-500">{stats.pending > 0 ? "Aguardando análise" : "Nenhuma pendência"}</p>
                  </div>
                  <div className="rounded-xl sm:rounded-2xl bg-amber-50 p-2 sm:p-3">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl sm:rounded-2xl border-0 bg-white/80 backdrop-blur shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-emerald-200/40 transition-all duration-300 overflow-hidden min-w-0">
              <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-green-500" />
              <CardContent className="p-3 sm:p-5 lg:p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Aprovados</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 tabular-nums">{stats.approved}</p>
                    <p className="text-xs text-slate-500">{stats.approved > 0 ? `${stats.total ? Math.round((stats.approved / stats.total) * 100) : 0}% do total` : "Nenhum aprovado"}</p>
                  </div>
                  <div className="rounded-xl sm:rounded-2xl bg-emerald-50 p-2 sm:p-3">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl sm:rounded-2xl border-0 bg-white/80 backdrop-blur shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-rose-200/40 transition-all duration-300 overflow-hidden min-w-0">
              <div className="h-1 w-full bg-gradient-to-r from-rose-400 to-red-500" />
              <CardContent className="p-3 sm:p-5 lg:p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Rejeitados</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-rose-600 tabular-nums">{stats.rejected}</p>
                    <p className="text-xs text-slate-500">{stats.rejected > 0 ? `${stats.total ? Math.round((stats.rejected / stats.total) * 100) : 0}% do total` : "Nenhum rejeitado"}</p>
                  </div>
                  <div className="rounded-xl sm:rounded-2xl bg-rose-50 p-2 sm:p-3">
                    <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Filters */}
        <Card className="rounded-xl sm:rounded-2xl border-0 bg-white/80 backdrop-blur shadow-lg shadow-slate-200/50 overflow-hidden min-w-0">
          <CardHeader className="p-3 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100">
            <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="flex items-center gap-2 sm:gap-2.5 text-base sm:text-lg font-semibold text-slate-900">
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100">
                  <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600" />
                </div>
                Filtros e Busca
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36 sm:w-44 rounded-lg sm:rounded-xl border-slate-200 bg-slate-50/80 text-xs sm:text-sm h-9 sm:h-10">
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
                  className="rounded-lg sm:rounded-xl border-slate-200 h-9 sm:h-10 w-9 sm:w-10 p-0"
                >
                  {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <Input
                placeholder="Buscar por nome, email, telefone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all text-sm sm:text-base"
              />
            </div>

            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v)} className="w-full min-w-0">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-12 p-1 rounded-xl bg-slate-100">
                <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 font-medium text-xs sm:text-sm py-2 px-2 sm:px-3">
                  Todos ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-sm font-medium text-xs sm:text-sm py-2 px-2 sm:px-3">
                  Pendentes ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="approved" className="rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm font-medium text-xs sm:text-sm py-2 px-2 sm:px-3">
                  Aprovados ({stats.approved})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="rounded-lg data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700 data-[state=active]:shadow-sm font-medium text-xs sm:text-sm py-2 px-2 sm:px-3">
                  Rejeitados ({stats.rejected})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm font-medium text-slate-600">Tipo de documento</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  { id: "all", label: "Todos" },
                  { id: "cpf", label: "CPF/RG" },
                  { id: "cnh", label: "CNH" },
                  { id: "comprovante_residencia", label: "Comprovante" },
                  { id: "certificado", label: "Certificados" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setDocumentTypeFilter(id)}
                    className={cn(
                      "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all",
                      documentTypeFilter === id
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <Card className="rounded-xl sm:rounded-2xl border-0 bg-white/80 backdrop-blur shadow-lg shadow-slate-200/50 overflow-hidden min-w-0">
          <CardHeader className="p-3 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100">
            <div className="flex flex-col gap-2 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="flex items-center gap-2 sm:gap-2.5 text-base sm:text-lg font-semibold text-slate-900">
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100">
                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600" />
                </div>
                Verificações
                <Badge variant="secondary" className="ml-1 rounded-full px-2 sm:px-2.5 py-0.5 font-medium bg-slate-100 text-slate-600 text-xs sm:text-sm">
                  {filteredVerifications.length}
                </Badge>
              </CardTitle>
              {filteredVerifications.length > 0 && (
                <p className="text-xs sm:text-sm text-slate-500">
                  Ordenado por {sortBy === "submittedAt" ? "Data" : sortBy === "providerName" ? "Nome" : "Status"} ({sortOrder})
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-4 sm:pt-6">
            {loading ? (
              <div className="space-y-3 sm:space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3 sm:gap-4 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50/80 animate-pulse">
                    <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-2 sm:space-y-3">
                      <div className="h-4 sm:h-5 w-32 sm:w-48 rounded-md sm:rounded-lg bg-slate-200" />
                      <div className="h-3 sm:h-4 w-48 sm:w-64 rounded-md sm:rounded-lg bg-slate-200" />
                      <div className="h-3 sm:h-4 w-24 sm:w-32 rounded-md sm:rounded-lg bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredVerifications.length === 0 ? (
              <div className="text-center py-12 sm:py-20 px-3 sm:px-4">
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4 sm:mb-6">
                  <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                  Nenhuma verificação encontrada
                </h3>
                <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto mb-4 sm:mb-6">
                  {search || statusFilter !== "all" || documentTypeFilter !== "all"
                    ? "Tente ajustar os filtros de busca para encontrar verificações."
                    : "Não há verificações pendentes no momento."}
                </p>
                {(search || statusFilter !== "all" || documentTypeFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch("")
                      setStatusFilter("all")
                      setDocumentTypeFilter("all")
                    }}
                    className="rounded-lg sm:rounded-xl border-slate-200 font-medium text-sm sm:text-base h-9 sm:h-10"
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredVerifications.map((verification) => {
                  const isExpanded = expandedCards.has(verification.id)
                  return (
                    <Card
                      key={verification.id}
                      className={cn(
                        "rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-lg hover:border-slate-300/80 transition-all duration-300 min-w-0 overflow-hidden",
                        verification.status === "pending" && "ring-1 ring-amber-200/50"
                      )}
                    >
                      <CardContent className="p-3 sm:p-5 lg:p-6">
                        <div className="flex flex-col gap-3 sm:gap-4">
                          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                              <div
                                className={cn(
                                  "h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 font-bold text-base sm:text-lg shadow-sm",
                                  verification.status === "pending" && "bg-gradient-to-br from-amber-400 to-orange-500 text-white ring-2 ring-amber-200/60",
                                  verification.status === "approved" && "bg-gradient-to-br from-emerald-400 to-green-500 text-white",
                                  verification.status === "rejected" && "bg-gradient-to-br from-slate-300 to-slate-400 text-white",
                                  !["pending", "approved", "rejected"].includes(verification.status) && "bg-gradient-to-br from-orange-500 to-amber-600 text-white"
                                )}
                              >
                                {verification.providerName.charAt(0).toUpperCase()}
                              </div>
                              <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
                                <h3 className="font-semibold text-base sm:text-lg text-slate-900 truncate">
                                  {verification.providerName}
                                </h3>
                                <div className="flex flex-col gap-1 text-xs sm:text-sm text-slate-500 sm:flex-row sm:items-center sm:gap-4">
                                  <span className="flex items-center gap-1 sm:gap-1.5 truncate">
                                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                                    <span className="truncate">{verification.providerEmail}</span>
                                  </span>
                                  {verification.providerPhone && (
                                    <span className="flex items-center gap-1 sm:gap-1.5">
                                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                                      {verification.providerPhone}
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 w-full min-w-0">
                                  {verification.providerCpf && (
                                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-sky-50 text-sky-700 text-[10px] sm:text-xs font-medium border border-sky-200/80 break-all max-w-full">
                                      <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" /> CPF: {verification.providerCpf}
                                    </span>
                                  )}
                                  {verification.providerRg && (
                                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-violet-50 text-violet-700 text-[10px] sm:text-xs font-medium border border-violet-200/80 break-all max-w-full">
                                      <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" /> RG: {verification.providerRg}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row items-center justify-between sm:flex-col sm:gap-2 lg:items-end shrink-0">
                              <div className="flex items-center gap-2">
                                {getStatusBadge(verification.status)}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleCardExpansion(verification.id)}
                                  className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg sm:rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                >
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-500">
                                {countTotalDocuments(verification.documents)} docs • {formatDistanceToNow(verification.submittedAt, { addSuffix: true, locale: ptBR })}
                              </p>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="space-y-4 sm:space-y-5 pt-4 sm:pt-5 border-t border-slate-100">
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs sm:text-sm text-slate-700">Documentos enviados</h4>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                  {Object.entries(verification.documents).map(([type, docs]) => {
                                    if (!docs || !Array.isArray(docs) || docs.length === 0) return null
                                    return (
                                      <Badge key={type} variant="outline" className="rounded-lg text-xs border-slate-200 bg-slate-50">
                                        {getDocumentTypeLabel(type)} ({docs.length})
                                      </Badge>
                                    )
                                  })}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={loadingDocumentsFor === verification.providerId}
                                  onClick={async () => {
                                    const hasUrls = Object.values(verification.documents || {}).some(
                                      docs => Array.isArray(docs) && docs.some((d: any) => d?.url)
                                    )
                                    if (hasUrls) {
                                      setSelectedVerification(verification)
                                      setShowDetails(true)
                                      return
                                    }
                                    setLoadingDocumentsFor(verification.providerId)
                                    try {
                                      const full = await fetchProviderVerification(verification.providerId)
                                      if (full) {
                                        setSelectedVerification({ ...verification, documents: full.documents })
                                        setShowDetails(true)
                                      }
                                    } finally {
                                      setLoadingDocumentsFor(null)
                                    }
                                  }}
                                  className="rounded-lg sm:rounded-xl border-slate-200 font-medium gap-2 text-xs sm:text-sm h-8 sm:h-9"
                                >
                                  {loadingDocumentsFor === verification.providerId ? (
                                    <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                  ) : (
                                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  )}
                                  {loadingDocumentsFor === verification.providerId ? "Carregando..." : "Ver Documentos"}
                                </Button>
                                {verification.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleApprove(verification.id)}
                                      className="rounded-lg sm:rounded-xl bg-emerald-600 hover:bg-emerald-700 font-medium gap-2 shadow-lg shadow-emerald-500/25 text-xs sm:text-sm h-8 sm:h-9"
                                    >
                                      <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                      Aprovar
                                    </Button>
                                    <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          className="rounded-lg sm:rounded-xl font-medium gap-2 text-xs sm:text-sm h-8 sm:h-9"
                                          onClick={() => setSelectedVerification(verification)}
                                        >
                                          <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                          Rejeitar
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent overlayClassName="z-[10000]" className="z-[10001] max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl border-slate-200 bg-white shadow-2xl mx-4 sm:mx-0">
                                        <DialogHeader>
                                          <DialogTitle className="flex items-center gap-2 text-slate-900">
                                            <AlertTriangle className="h-5 w-5 text-rose-500" />
                                            Rejeitar Verificação
                                          </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <p className="text-sm text-slate-600">
                                            Informe o motivo da rejeição para <strong>{selectedVerification?.providerName}</strong>:
                                          </p>
                                          <Textarea
                                            placeholder="Ex: Documentos ilegíveis, informações incompletas, etc."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            rows={4}
                                            className="rounded-xl border-slate-200 focus:ring-2 focus:ring-rose-500/20"
                                          />
                                          <div className="flex justify-end gap-2">
                                            <Button
                                              variant="outline"
                                              onClick={() => {
                                                setShowRejectDialog(false)
                                                setRejectionReason("")
                                              }}
                                              className="rounded-xl border-slate-200"
                                            >
                                              Cancelar
                                            </Button>
                                            <Button
                                              variant="destructive"
                                              onClick={() => selectedVerification && handleReject(selectedVerification.id)}
                                              className="rounded-xl"
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

        {showDetails && selectedVerification && (
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto overscroll-contain bg-slate-900/60 backdrop-blur-md">
            <div className="w-full max-w-full sm:max-w-7xl sm:my-4 flex flex-col bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200/80 min-h-[80dvh] sm:min-h-0 sm:max-h-[90dvh] max-h-[100dvh] touch-pan-y">
              {/* Header fixo */}
              <div className="flex-shrink-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-4 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-2xl font-bold truncate">Documentos do Prestador</h2>
                      <p className="text-orange-100 text-sm sm:text-base truncate">{selectedVerification.providerName}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                    className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-xl text-white hover:bg-white/20 flex-shrink-0"
                    aria-label="Fechar"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Conteúdo rolável */}
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-6 space-y-4 sm:space-y-6 bg-slate-50/80">
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-slate-200/80 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
                    Informações do Prestador
                  </h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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

                <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-sky-200/80 min-w-0 overflow-hidden">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    Credenciais e Documentos Pessoais
                  </h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {selectedVerification.providerCpf && (
                      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-blue-200 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">CPF</p>
                            <p className="text-sm sm:text-lg font-bold text-blue-900 break-all">{selectedVerification.providerCpf}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedVerification.providerRg && (
                      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-purple-200 min-w-0 overflow-hidden">
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
                      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-green-200 min-w-0 overflow-hidden">
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
                      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-orange-200 md:col-span-2 lg:col-span-3 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Endereço</p>
                            <p className="text-sm sm:text-base font-semibold text-orange-900 break-words">{selectedVerification.providerAddress}</p>
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

                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-slate-200/80 min-w-0">
                  <div className="flex flex-col gap-3 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                      <span className="text-base sm:text-lg font-medium text-gray-700">Status da Verificação:</span>
                      {getStatusBadge(selectedVerification.status)}
                    </div>
                    {selectedVerification.status === "pending" && (
                      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 flex-shrink-0">
                        <Button
                          onClick={() => {
                            handleApprove(selectedVerification.id)
                            setShowDetails(false)
                          }}
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 px-6 py-3 font-medium shadow-lg shadow-emerald-500/25"
                        >
                          <CheckCircle className="h-5 w-5" />
                          Aprovar Prestador
                        </Button>
                        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              className="rounded-xl flex items-center gap-2 px-6 py-3 font-medium"
                            >
                              <XCircle className="h-5 w-5" />
                              Rejeitar Prestador
                            </Button>
                          </DialogTrigger>
                          <DialogContent overlayClassName="z-[10000]" className="z-[10001] max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl border-slate-200 bg-white shadow-2xl mx-4 sm:mx-0">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2 text-slate-900">
                                <AlertTriangle className="h-5 w-5 text-rose-500" />
                                Rejeitar Verificação
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-sm text-slate-600">
                                Informe o motivo da rejeição para <strong>{selectedVerification.providerName}</strong>:
                              </p>
                              <Textarea
                                placeholder="Ex: Documentos ilegíveis, informações incompletas, etc."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                                className="rounded-xl border-slate-200 focus:ring-2 focus:ring-rose-500/20"
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setShowRejectDialog(false)
                                    setRejectionReason("")
                                  }}
                                  className="rounded-xl border-slate-200"
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleReject(selectedVerification.id)}
                                  className="rounded-xl"
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

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden min-w-0">
                  <Tabs value={modalTab} onValueChange={setModalTab} className="w-full min-w-0">
                    <div className="p-3 sm:p-6 pb-0">
                      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-12 p-1 rounded-xl bg-slate-100">
                        <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm font-medium text-xs sm:text-sm py-2 px-2 sm:px-3">
                          <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Documentos
                        </TabsTrigger>
                        <TabsTrigger value="structure" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm font-medium text-xs sm:text-sm py-2 px-2 sm:px-3">
                          <Building className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Estrutura
                        </TabsTrigger>
                        <TabsTrigger value="acceptance" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm font-medium text-xs sm:text-sm py-2 px-2 sm:px-3">
                          <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Aceitação
                        </TabsTrigger>
                        <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm font-medium text-xs sm:text-sm py-2 px-2 sm:px-3">
                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Histórico
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <div className="p-3 sm:p-6 min-w-0 overflow-x-hidden">
                      <TabsContent value="documents" className="space-y-4 sm:space-y-6 mt-0 min-w-0">
                        <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                          <FileText className="h-6 w-6 text-orange-600" />
                          Documentos Enviados
                        </h3>
                        {Object.entries(selectedVerification.documents).map(([type, documents]) => {
                          if (!documents || !Array.isArray(documents) || documents.length === 0) return null
                          
                          return (
                            <div key={type} className="bg-gray-50 rounded-lg p-3 sm:p-6 min-w-0 overflow-x-hidden">
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
      </div>
    </AppShell>
  )
}
