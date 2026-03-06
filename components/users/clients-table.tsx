"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, Edit, Ban, CheckCircle, Loader2 } from "lucide-react"
import { ClientModal } from "./client-modal"
import { useAllClients } from "@/hooks/use-users"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  address: string
  createdAt: string
  lastLogin: string
  status: "active" | "inactive" | "blocked"
  totalOrders: number
  totalSpent: number
}

export function ClientsTable() {
  const { clients: rawClients, loading, error, refetch } = useAllClients()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Converter dados do Firebase para o formato Client
  const clients: Client[] = rawClients.map((u) => ({
    id: u.id,
    name: u.name || u.displayName || 'Sem nome',
    email: u.email || '',
    phone: (u as any).phone || (u as any).telefone || '',
    cpf: (u as any).cpf || '',
    address: (u as any).address || (u as any).endereco || '',
    createdAt: u.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
    lastLogin: (u as any).lastLogin?.toDate?.()?.toISOString?.() || '',
    status: u.isActive === false ? 'blocked' : 'active',
    totalOrders: (u as any).totalOrders || (u as any).totalPedidos || 0,
    totalSpent: (u as any).totalSpent || (u as any).totalGasto || 0,
  }))

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cpf.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Bloqueado</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
  }

  const handleViewClient = (client: Client) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredClients.length} de {clients.length} clientes
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
                <SelectItem value="blocked">Bloqueado</SelectItem>
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
              <span className="ml-3 text-gray-500">Carregando clientes...</span>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-600 font-medium">{error}</p>
              <Button variant="outline" className="mt-4" onClick={refetch}>
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredClients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium">Nenhum cliente encontrado</p>
              <p className="text-sm text-gray-400 mt-1">Ajuste os filtros ou aguarde novos cadastros</p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && filteredClients.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Total Gasto</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.cpf}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{client.email}</div>
                          <div className="text-sm text-gray-500">{client.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell>{client.totalOrders}</TableCell>
                      <TableCell>R$ {client.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>
                        {client.lastLogin
                          ? new Date(client.lastLogin).toLocaleDateString("pt-BR")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewClient(client)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {client.status === "active" ? (
                            <Button variant="ghost" size="sm">
                              <Ban className="h-4 w-4 text-red-600" />
                            </Button>
                          ) : client.status === "blocked" ? (
                            <Button variant="ghost" size="sm">
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

      <ClientModal
        client={selectedClient}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedClient(null)
        }}
      />
    </>
  )
}
