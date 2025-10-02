"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, Edit, Ban, CheckCircle } from "lucide-react"
import { ClientModal } from "./client-modal"

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

const mockClients: Client[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 99999-1234",
    cpf: "123.456.789-01",
    address: "São Paulo, SP",
    createdAt: "2024-01-15",
    lastLogin: "2024-03-10",
    status: "active",
    totalOrders: 12,
    totalSpent: 2450.0,
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao.santos@email.com",
    phone: "(11) 88888-5678",
    cpf: "987.654.321-09",
    address: "Rio de Janeiro, RJ",
    createdAt: "2024-02-20",
    lastLogin: "2024-03-08",
    status: "active",
    totalOrders: 8,
    totalSpent: 1890.0,
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 77777-9012",
    cpf: "456.789.123-45",
    address: "Belo Horizonte, MG",
    createdAt: "2024-01-30",
    lastLogin: "2024-02-28",
    status: "inactive",
    totalOrders: 3,
    totalSpent: 650.0,
  },
  {
    id: "4",
    name: "Carlos Lima",
    email: "carlos.lima@email.com",
    phone: "(11) 66666-3456",
    cpf: "789.123.456-78",
    address: "Salvador, BA",
    createdAt: "2024-03-01",
    lastLogin: "2024-03-09",
    status: "blocked",
    totalOrders: 1,
    totalSpent: 120.0,
  },
]

export function ClientsTable() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleStatusChange = (clientId: string, newStatus: "active" | "blocked") => {
    setClients(clients.map((client) => (client.id === clientId ? { ...client, status: newStatus } : client)))
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
                className="pl-16"
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

          {/* Table */}
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
                    <TableCell>{new Date(client.lastLogin).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewClient(client)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {client.status === "active" ? (
                          <Button variant="ghost" size="sm" onClick={() => handleStatusChange(client.id, "blocked")}>
                            <Ban className="h-4 w-4 text-red-600" />
                          </Button>
                        ) : client.status === "blocked" ? (
                          <Button variant="ghost" size="sm" onClick={() => handleStatusChange(client.id, "active")}>
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
