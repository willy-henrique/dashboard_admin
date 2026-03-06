"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, Edit, Ban, CheckCircle, Shield, Star, Loader2 } from "lucide-react"
import { ProviderModal } from "./provider-modal"
import { FirebaseProvidersService, type FirebaseProvider } from "@/lib/services/firebase-providers"
import { mapProviderStatusToLegacy } from "@/lib/providers/status"
import { toIsoStringFromUnknown } from "@/lib/date-utils"

interface Provider {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  address: string
  serviceCategories: string[]
  experience: string
  isVerified: boolean
  rating: number
  totalOrders: number
  totalEarnings: number
  status: "active" | "inactive" | "pending" | "blocked"
  createdAt: string
}

function convertFirebaseToProvider(fp: FirebaseProvider): Provider {
  return {
    id: fp.id,
    name: fp.nome,
    email: fp.email || '',
    phone: fp.telefone || '',
    cpf: '',
    address: '',
    serviceCategories: fp.especialidades || [],
    experience: '',
    isVerified: fp.ativo ?? false,
    rating: fp.avaliacao || 0,
    totalOrders: fp.totalServicos || 0,
    totalEarnings: 0,
    status: mapProviderStatusToLegacy(fp.status),
    createdAt: toIsoStringFromUnknown(fp.createdAt),
  }
}

export function ProvidersTable() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingProviderId, setUpdatingProviderId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const firebaseProviders = await FirebaseProvidersService.getProviders()
      setProviders(firebaseProviders.map(convertFirebaseToProvider))
    } catch (err) {
      console.error('Erro ao buscar prestadores:', err)
      setError('Erro ao carregar prestadores')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.cpf.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || provider.status === statusFilter
    const matchesCategory =
      categoryFilter === "all" ||
      provider.serviceCategories.some((cat) => cat.toLowerCase().includes(categoryFilter.toLowerCase()))
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pendente</Badge>
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Bloqueado</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
  }

  const handleStatusChange = async (provider: Provider, newStatus: "active" | "blocked") => {
    try {
      setUpdatingProviderId(provider.id)
      setError(null)

      const firebaseStatus = newStatus === "active" ? "disponivel" : "offline"
      await FirebaseProvidersService.updateProviderStatus(provider.id, firebaseStatus)
      await fetchProviders()
    } catch (err) {
      console.error("Erro ao atualizar status do prestador:", err)
      setError("Erro ao atualizar status do prestador")
    } finally {
      setUpdatingProviderId(null)
    }
  }

  const handleViewProvider = (provider: Provider) => {
    setSelectedProvider(provider)
    setIsModalOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Prestadores</CardTitle>
          <CardDescription>
            {filteredProviders.length} de {providers.length} prestadores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-20"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="blocked">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                <SelectItem value="limpeza">Limpeza</SelectItem>
                <SelectItem value="manutenção">Manutenção</SelectItem>
                <SelectItem value="jardinagem">Jardinagem</SelectItem>
                <SelectItem value="pintura">Pintura</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <span className="ml-3 text-gray-500">Carregando prestadores...</span>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-600 font-medium">{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchProviders}>
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredProviders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium">Nenhum prestador encontrado</p>
              <p className="text-sm text-gray-400 mt-1">Ajuste os filtros ou cadastre novos prestadores</p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && filteredProviders.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prestador</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Categorias</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Ganhos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {provider.name}
                              {provider.isVerified && <Shield className="h-4 w-4 text-blue-600" />}
                            </div>
                            <div className="text-sm text-gray-500">{provider.cpf}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{provider.email}</div>
                          <div className="text-sm text-gray-500">{provider.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {provider.serviceCategories.map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(provider.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{provider.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{provider.totalOrders}</TableCell>
                      <TableCell>R$ {provider.totalEarnings.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewProvider(provider)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled
                            title="Edicao detalhada sera conectada ao backend em breve"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!provider.isVerified && provider.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                              title="Verificacao sera sincronizada pelo cadastro oficial"
                            >
                              <Shield className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                          {provider.status === "active" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(provider, "blocked")}
                              disabled={updatingProviderId === provider.id}
                            >
                              <Ban className="h-4 w-4 text-red-600" />
                            </Button>
                          ) : provider.status === "blocked" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(provider, "active")}
                              disabled={updatingProviderId === provider.id}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ProviderModal
        provider={selectedProvider}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProvider(null)
        }}
      />
    </>
  )
}
