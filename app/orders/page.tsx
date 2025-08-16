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
  MessageSquare,
  MapPin,
  Clock,
  DollarSign,
  User,
  UserCheck,
  ShoppingCart,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

const mockOrders = [
  {
    id: "1234",
    clientName: "Maria Santos",
    providerName: "João Silva",
    serviceCategory: "Limpeza",
    description: "Limpeza residencial - 3 quartos, 2 banheiros",
    status: "in_progress",
    priority: "medium",
    budget: 150.00,
    location: "Rua das Flores, 123 - São Paulo, SP",
    createdAt: "2024-08-12 10:00",
    assignedAt: "2024-08-12 10:30",
    completedAt: null,
    rating: null,
  },
  {
    id: "1235",
    clientName: "Carlos Lima",
    providerName: null,
    serviceCategory: "Manutenção",
    description: "Reparo no sistema elétrico - tomadas não funcionando",
    status: "pending",
    priority: "high",
    budget: 300.00,
    location: "Av. Paulista, 456 - São Paulo, SP",
    createdAt: "2024-08-12 09:00",
    assignedAt: null,
    completedAt: null,
    rating: null,
  },
  {
    id: "1236",
    clientName: "Ana Costa",
    providerName: "Pedro Oliveira",
    serviceCategory: "Pintura",
    description: "Pintura de sala e quarto - cores neutras",
    status: "completed",
    priority: "low",
    budget: 500.00,
    location: "Rua Augusta, 789 - São Paulo, SP",
    createdAt: "2024-08-11 14:00",
    assignedAt: "2024-08-11 15:00",
    completedAt: "2024-08-12 16:00",
    rating: 5,
  },
  {
    id: "1237",
    clientName: "Fernanda Oliveira",
    providerName: null,
    serviceCategory: "Jardinagem",
    description: "Manutenção de jardim - poda e limpeza",
    status: "cancelled",
    priority: "medium",
    budget: 200.00,
    location: "Rua Oscar Freire, 321 - São Paulo, SP",
    createdAt: "2024-08-11 11:00",
    assignedAt: null,
    completedAt: null,
    rating: null,
  },
  {
    id: "1238",
    clientName: "Roberto Silva",
    providerName: "Maria Santos",
    serviceCategory: "Limpeza",
    description: "Limpeza de escritório - 200m²",
    status: "assigned",
    priority: "urgent",
    budget: 400.00,
    location: "Rua Haddock Lobo, 654 - São Paulo, SP",
    createdAt: "2024-08-12 08:00",
    assignedAt: "2024-08-12 08:15",
    completedAt: null,
    rating: null,
  },
]

const columns = [
  {
    accessorKey: "id",
    header: "Pedido",
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <ShoppingCart className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <div className="font-medium">#{row.getValue("id")}</div>
          <div className="text-sm text-gray-500">{row.original.serviceCategory}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "clientName",
    header: "Cliente",
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-gray-400" />
        <span className="font-medium">{row.getValue("clientName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "providerName",
    header: "Prestador",
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-2">
        {row.getValue("providerName") ? (
          <>
            <UserCheck className="h-4 w-4 text-green-600" />
            <span className="font-medium">{row.getValue("providerName")}</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-gray-500">Não atribuído</span>
          </>
        )}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }: any) => (
      <div className="max-w-xs">
        <p className="text-sm truncate">{row.getValue("description")}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("status")
      const statusConfig = {
        pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
        assigned: { label: "Atribuído", className: "bg-blue-100 text-blue-800" },
        in_progress: { label: "Em Andamento", className: "bg-orange-100 text-orange-800" },
        completed: { label: "Concluído", className: "bg-green-100 text-green-800" },
        cancelled: { label: "Cancelado", className: "bg-red-100 text-red-800" },
      }
      const config = statusConfig[status as keyof typeof statusConfig]
      return <Badge className={config.className}>{config.label}</Badge>
    },
  },
  {
    accessorKey: "priority",
    header: "Prioridade",
    cell: ({ row }: any) => {
      const priority = row.getValue("priority")
      const priorityConfig = {
        low: { label: "Baixa", className: "bg-gray-100 text-gray-800" },
        medium: { label: "Média", className: "bg-yellow-100 text-yellow-800" },
        high: { label: "Alta", className: "bg-orange-100 text-orange-800" },
        urgent: { label: "Urgente", className: "bg-red-100 text-red-800" },
      }
      const config = priorityConfig[priority as keyof typeof priorityConfig]
      return <Badge className={config.className}>{config.label}</Badge>
    },
  },
  {
    accessorKey: "budget",
    header: "Orçamento",
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-1">
        <DollarSign className="h-3 w-3 text-green-600" />
        <span className="font-medium">
          R$ {row.getValue("budget").toLocaleString()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Localização",
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-1">
        <MapPin className="h-3 w-3 text-gray-400" />
        <span className="text-sm">{row.getValue("location")}</span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }: any) => (
      <div className="flex items-center space-x-1">
        <Clock className="h-3 w-3 text-gray-400" />
        <span className="text-sm">{row.getValue("createdAt")}</span>
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
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline">
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestão de Pedidos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie todos os pedidos de serviços
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
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
                  placeholder="Buscar por ID, cliente, prestador, categoria..."
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Atribuídos</p>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold">67</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold">1,089</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cancelados</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={mockOrders} />
        </CardContent>
      </Card>
    </div>
  )
}
