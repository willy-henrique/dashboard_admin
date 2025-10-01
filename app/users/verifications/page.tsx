"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  RefreshCw
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useUsers } from "@/hooks/use-users"
import { useToast } from "@/hooks/use-toast"
import { VerificationDocumentViewer } from "@/components/users/verification-document-viewer"

interface VerificationDocument {
  id: string
  type: 'cpf' | 'cnh' | 'comprovante_residencia' | 'certificado'
  name: string
  url: string
  uploadedAt: Date
  status: 'pending' | 'approved' | 'rejected'
}

interface ProviderVerification {
  id: string
  providerId: string
  providerName: string
  providerEmail: string
  providerPhone: string
  status: 'pending' | 'approved' | 'rejected'
  documents: VerificationDocument[]
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  rejectionReason?: string
}

export default function VerificationsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedVerification, setSelectedVerification] = useState<ProviderVerification | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const { toast } = useToast()

  // Buscar prestadores pendentes de verificação
  const { users, loading, refetch, updateUser, blockUser, unblockUser } = useUsers({ 
    userType: 'provider', 
    searchTerm: search || undefined 
  })

  // Simular dados de verificação (em produção viria do Firestore)
  const verifications: ProviderVerification[] = useMemo(() => {
    return users
      .filter(user => !user.verificado && user.userType === 'provider')
      .map(user => ({
        id: `verification_${user.id}`,
        providerId: user.id,
        providerName: user.fullName || user.name || 'Nome não informado',
        providerEmail: user.email,
        providerPhone: user.phone || '',
        status: 'pending' as const,
        documents: [
          {
            id: 'doc1',
            type: 'cpf',
            name: 'CPF - Documento de Identidade',
            url: '/placeholder-document.pdf',
            uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'pending'
          },
          {
            id: 'doc2',
            type: 'cnh',
            name: 'CNH - Carteira Nacional de Habilitação',
            url: '/placeholder-document.pdf',
            uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            status: 'pending'
          },
          {
            id: 'doc3',
            type: 'comprovante_residencia',
            name: 'Comprovante de Residência',
            url: '/placeholder-document.pdf',
            uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            status: 'pending'
          }
        ],
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }))
  }, [users])

  const filteredVerifications = useMemo(() => {
    let filtered = verifications

    if (statusFilter !== "all") {
      filtered = filtered.filter(v => v.status === statusFilter)
    }

    return filtered
  }, [verifications, statusFilter])

  const stats = useMemo(() => {
    return {
      total: verifications.length,
      pending: verifications.filter(v => v.status === 'pending').length,
      approved: verifications.filter(v => v.status === 'approved').length,
      rejected: verifications.filter(v => v.status === 'rejected').length
    }
  }, [verifications])

  const handleApprove = async (verificationId: string) => {
    try {
      const verification = verifications.find(v => v.id === verificationId)
      if (verification) {
        await updateUser(verification.providerId, { 
          verificado: true,
          isActive: true,
          status: 'ativo'
        })
        toast({
          title: "Verificação aprovada",
          description: `${verification.providerName} foi aprovado como prestador.`,
        })
        refetch()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível aprovar a verificação.",
        variant: "destructive"
      })
    }
  }

  const handleReject = async (verificationId: string) => {
    try {
      const verification = verifications.find(v => v.id === verificationId)
      if (verification) {
        await blockUser(verification.providerId)
        toast({
          title: "Verificação rejeitada",
          description: `${verification.providerName} foi rejeitado como prestador.`,
        })
        refetch()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar a verificação.",
        variant: "destructive"
      })
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
              Verificações de Prestadores
            </h1>
            <p className="text-muted-foreground mt-2">
              Aprove ou recuse cadastros de prestadores de serviço
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full sm:flex-row sm:w-auto sm:items-center">
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedVerification({
                  id: 'test',
                  providerId: 'test',
                  providerName: 'Teste Modal',
                  providerEmail: 'teste@teste.com',
                  providerPhone: '(11) 99999-9999',
                  status: 'pending',
                  documents: [],
                  submittedAt: new Date()
                })
                setShowDetails(true)
              }}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              Testar Modal
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{stats.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Aprovados</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejeitados</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
        <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
        </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar por nome, email, telefone..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <Button 
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  size="sm"
                >
                  Todos
                </Button>
                <Button 
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                  size="sm"
                >
                  Pendentes
                </Button>
                <Button 
                  variant={statusFilter === "approved" ? "default" : "outline"}
                  onClick={() => setStatusFilter("approved")}
                  size="sm"
                >
                  Aprovados
                </Button>
                <Button 
                  variant={statusFilter === "rejected" ? "default" : "outline"}
                  onClick={() => setStatusFilter("rejected")}
                  size="sm"
                >
                  Rejeitados
                </Button>
              </div>
          </div>
        </CardContent>
      </Card>

        {/* Verifications List */}
        <Card className="border-0 shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Shield className="h-5 w-5" />
              Verificações ({filteredVerifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredVerifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Nenhuma verificação encontrada
                </h3>
                <p className="text-muted-foreground">
                  {search ? 'Tente ajustar os filtros de busca.' : 'Não há verificações pendentes no momento.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVerifications.map((verification) => (
                  <Card key={verification.id} className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                            <span className="font-semibold text-primary-foreground">
                              {verification.providerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                              {verification.providerName}
                            </h3>
                            <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
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
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 text-sm sm:text-right">
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            {getStatusBadge(verification.status)}
                          </div>
                          <div>
                            <p className="text-muted-foreground">Documentos</p>
                            <p>{verification.documents.length} documentos</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Enviado</p>
                            <p>
                              {formatDistanceToNow(verification.submittedAt, { 
                                addSuffix: true, 
                                locale: ptBR 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVerification(verification)
                            setShowDetails(true)
                          }}
                          className="flex items-center gap-2 w-full sm:w-auto"
                        >
                          <Eye className="h-4 w-4" />
                          Ver Detalhes
                        </Button>
                        
                        {verification.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(verification.id)}
                              className="bg-green-600 hover:bg-green-700 flex items-center gap-2 w-full sm:w-auto"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Aprovar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleReject(verification.id)}
                              className="flex items-center gap-2 w-full sm:w-auto"
                            >
                              <XCircle className="h-4 w-4" />
                              Rejeitar
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Details Modal */}
        {showDetails && selectedVerification && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Shield className="h-5 w-5" />
                    Detalhes da Verificação - {selectedVerification.providerName}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowDetails(false)}
                    className="hover:bg-gray-200"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Provider Info */}
                <div>
                  <h3 className="font-semibold mb-3">Informações do Prestador</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nome</p>
                      <p>{selectedVerification.providerName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p>{selectedVerification.providerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                      <p>{selectedVerification.providerPhone || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      {getStatusBadge(selectedVerification.status)}
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <VerificationDocumentViewer
                  documents={selectedVerification.documents}
                  onViewDocument={(documentId) => {
                    const doc = selectedVerification.documents.find(d => d.id === documentId)
                    if (doc) {
                      // Em produção, abriria o documento em nova aba
                      window.open(doc.url, '_blank')
                    }
                  }}
                  onDownloadDocument={(documentId) => {
                    const doc = selectedVerification.documents.find(d => d.id === documentId)
                    if (doc) {
                      // Em produção, baixaria o documento
                      const link = document.createElement('a')
                      link.href = doc.url
                      link.download = doc.name
                      link.click()
                    }
                  }}
                  onApproveDocument={(documentId) => {
                    toast({
                      title: "Documento aprovado",
                      description: "O documento foi marcado como aprovado.",
                    })
                  }}
                  onRejectDocument={(documentId) => {
                    toast({
                      title: "Documento rejeitado",
                      description: "O documento foi marcado como rejeitado.",
                      variant: "destructive"
                    })
                  }}
                />

                {/* Actions */}
                {selectedVerification.status === 'pending' && (
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Button
                      onClick={() => {
                        handleApprove(selectedVerification.id)
                        setShowDetails(false)
                      }}
                      className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Aprovar Verificação
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleReject(selectedVerification.id)
                        setShowDetails(false)
                      }}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Rejeitar Verificação
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
