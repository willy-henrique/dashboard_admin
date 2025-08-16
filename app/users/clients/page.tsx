"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react"

const mockClients = [
  {
    id: "1",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(11) 99999-9999",
    cpf: "123.456.789-00",
    address: "Rua das Flores, 123 - São Paulo, SP",
    createdAt: "2024-01-15",
    lastLogin: "2024-08-12 14:30",
    status: "active",
    totalOrders: 15,
    totalSpent: 2500.00,
  },
  {
    id: "2",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 88888-8888",
    cpf: "987.654.321-00",
    address: "Av. Paulista, 456 - São Paulo, SP",
    createdAt: "2024-02-20",
    lastLogin: "2024-08-12 10:15",
    status: "active",
    totalOrders: 8,
    totalSpent: 1200.00,
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 77777-7777",
    cpf: "456.789.123-00",
    address: "Rua Augusta, 789 - São Paulo, SP",
    createdAt: "2024-03-10",
    lastLogin: "2024-08-11 16:45",
    status: "inactive",
    totalOrders: 3,
    totalSpent: 450.00,
  },
  {
    id: "4",
    name: "Carlos Lima",
    email: "carlos.lima@email.com",
    phone: "(11) 66666-6666",
    cpf: "789.123.456-00",
    address: "Rua Oscar Freire, 321 - São Paulo, SP",
    createdAt: "2024-04-05",
    lastLogin: "2024-08-12 09:20",
    status: "active",
    totalOrders: 22,
    totalSpent: 3800.00,
  },
  {
    id: "5",
    name: "Fernanda Oliveira",
    email: "fernanda.oliveira@email.com",
    phone: "(11) 55555-5555",
    cpf: "321.654.987-00",
    address: "Rua Haddock Lobo, 654 - São Paulo, SP",
    createdAt: "2024-05-12",
    lastLogin: "2024-08-10 11:30",
    status: "blocked",
    totalOrders: 0,
    totalSpent: 0.00,
  },
]

const columns = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-sm text-gray-500">{row.original.cpf}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Contato",
    cell: ({ row }: any) => (
      <div>
        <div className="flex items-center space-x-1">
          <Mail className="h-3 w-3 text-gray-400" />
          <span className="text-sm">{row.getValue("email")}</span>
        </div>
        <div className="flex items-center space-x-1 mt-1">
          <Phone className="h-3 w-3 text-gray-400" />
          <span className="text-sm text-gray-500">{row.original.phone}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Endereço",
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-1">
        <MapPin className="h-3 w-3 text-gray-400" />
        <span className="text-sm">{row.getValue("address")}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("status")
      const statusConfig = {
        active: { label: "Ativo", className: "bg-green-100 text-green-800" },
        inactive: { label: "Inativo", className: "bg-gray-100 text-gray-800" },
        blocked: { label: "Bloqueado", className: "bg-red-100 text-red-800" },
      }
      const config = statusConfig[status as keyof typeof statusConfig]
      return <Badge className={config.className}>{config.label}</Badge>
    },
  },
  {
    accessorKey: "totalOrders",
    header: "Pedidos",
    cell: ({ row }: any) => (
      <div className="text-center">
        <div className="font-medium">{row.getValue("totalOrders")}</div>
        <div className="text-sm text-gray-500">pedidos</div>
      </div>
    ),
  },
  {
    accessorKey: "totalSpent",
    header: "Total Gasto",
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-1">
        <DollarSign className="h-3 w-3 text-green-600" />
        <span className="font-medium">
          R$ {row.getValue("totalSpent").toLocaleString()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "lastLogin",
    header: "Último Login",
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-1">
        <Calendar className="h-3 w-3 text-gray-400" />
        <span className="text-sm">{row.getValue("lastLogin")}</span>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }: any) => (
      <div className="flex space-x-2">
        <Button size="sm" variant="outline">
          <Eye className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline">
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestão de Clientes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie todos os clientes do aplicativo
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email, CPF..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold">1,623</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold">1,489</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Clientes Inativos</p>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Clientes Bloqueados</p>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={mockClients} />
        </CardContent>
      </Card>
    </div>
  )
}
