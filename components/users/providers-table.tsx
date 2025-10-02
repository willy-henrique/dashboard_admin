"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, Edit, Ban, CheckCircle, Shield, Star } from "lucide-react"
import { ProviderModal } from "./provider-modal"

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

const mockProviders: Provider[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-1234",
    cpf: "123.456.789-01",
    address: "São Paulo, SP",
    serviceCategories: ["Limpeza", "Manutenção"],
    experience: "5 anos",
    isVerified: true,
    rating: 4.9,
    totalOrders: 45,
    totalEarnings: 12500.0,
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(11) 88888-5678",
    cpf: "987.654.321-09",
    address: "Rio de Janeiro, RJ",
    serviceCategories: ["Jardinagem"],
    experience: "3 anos",
    isVerified: true,
    rating: 4.8,
    totalOrders: 38,
    totalEarnings: 9800.0,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Carlos Lima",
    email: "carlos.lima@email.com",
    phone: "(11) 77777-9012",
    cpf: "456.789.123-45",
    address: "Belo Horizonte, MG",
    serviceCategories: ["Pintura", "Manutenção"],
    experience: "8 anos",
    isVerified: false,
    rating: 4.7,
    totalOrders: 32,
    totalEarnings: 8900.0,
    status: "pending",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 66666-3456",
    cpf: "789.123.456-78",
    address: "Salvador, BA",
    serviceCategories: ["Limpeza"],
    experience: "2 anos",
    isVerified: false,
    rating: 4.6,
    totalOrders: 25,
    totalEarnings: 5600.0,
    status: "blocked",
    createdAt: "2024-02-15",
  },
]

export function ProvidersTable() {
  const [providers, setProviders] = useState<Provider[]>(mockProviders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleStatusChange = (providerId: string, newStatus: "active" | "blocked") => {
    setProviders(
      providers.map((provider) => (provider.id === providerId ? { ...provider, status: newStatus } : provider)),
    )
  }

  const handleVerifyProvider = (providerId: string) => {
    setProviders(
      providers.map((provider) =>
        provider.id === providerId ? { ...provider, isVerified: true, status: "active" } : provider,
      ),
    )
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
                className="pl-12"
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

          {/* Table */}
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
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!provider.isVerified && provider.status === "pending" && (
                          <Button variant="ghost" size="sm" onClick={() => handleVerifyProvider(provider.id)}>
                            <Shield className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                        {provider.status === "active" ? (
                          <Button variant="ghost" size="sm" onClick={() => handleStatusChange(provider.id, "blocked")}>
                            <Ban className="h-4 w-4 text-red-600" />
                          </Button>
                        ) : provider.status === "blocked" ? (
                          <Button variant="ghost" size="sm" onClick={() => handleStatusChange(provider.id, "active")}>
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
