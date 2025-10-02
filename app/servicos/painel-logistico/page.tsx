"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import {
  Search,
  Filter,
  Download,
  Eye,
  MapPin,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

const mockServices = [
  {
    id: "1234",
    status: "em_andamento",
    agendamento: "2024-08-12 14:30",
    protocolo: "PROT-2024-001234",
    acionado: "João Silva",
    cidade: "São Paulo",
    bairro: "Vila Madalena",
    responsavel: "João Silva",
    tempo: "45min",
    atraso: "0min",
    km: "12.5",
  },
  {
    id: "1235",
    status: "aguardando",
    agendamento: "2024-08-12 15:00",
    protocolo: "PROT-2024-001235",
    acionado: "Maria Santos",
    cidade: "São Paulo",
    bairro: "Pinheiros",
    responsavel: "Maria Santos",
    tempo: "0min",
    atraso: "15min",
    km: "8.2",
  },
  {
    id: "1236",
    status: "aceito",
    agendamento: "2024-08-12 16:00",
    protocolo: "PROT-2024-001236",
    acionado: "Carlos Lima",
    cidade: "São Paulo",
    bairro: "Itaim Bibi",
    responsavel: "Carlos Lima",
    tempo: "0min",
    atraso: "0min",
    km: "15.8",
  },
  {
    id: "1237",
    status: "concluido",
    agendamento: "2024-08-12 13:00",
    protocolo: "PROT-2024-001237",
    acionado: "Ana Costa",
    cidade: "São Paulo",
    bairro: "Jardins",
    responsavel: "Ana Costa",
    tempo: "32min",
    atraso: "0min",
    km: "6.3",
  },
]

const columns = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "agendamento",
    header: "Agendamento",
  },
  {
    accessorKey: "protocolo",
    header: "Protocolo",
    cell: ({ row }: any) => (
      <a
        href={`/servicos/${row.getValue("protocolo")}`}
        className="text-orange-600 hover:text-orange-700 font-medium"
      >
        {row.getValue("protocolo")}
      </a>
    ),
  },
  {
    accessorKey: "acionado",
    header: "Acionado/Aguardando",
  },
  {
    accessorKey: "cidade",
    header: "Cidade/Bairro",
    cell: ({ row }: any) => (
      <div>
        <div className="font-medium">{row.getValue("cidade")}</div>
        <div className="text-sm text-gray-500">{row.original.bairro}</div>
      </div>
    ),
  },
  {
    accessorKey: "responsavel",
    header: "Responsável",
  },
  {
    accessorKey: "tempo",
    header: "Tempo/Atraso",
    cell: ({ row }: any) => (
      <div>
        <div className="font-medium">{row.getValue("tempo")}</div>
        {row.original.atraso !== "0min" && (
          <div className="text-sm text-red-500">{row.original.atraso} atraso</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "km",
    header: "KM",
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }: any) => (
      <div className="flex space-x-2">
        <Button size="sm" variant="outline">
          <CheckCircle className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline">
          <MapPin className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline">
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

export default function PainelLogisticoPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Painel Logístico
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe todos os serviços em tempo real
          </p>
        </div>
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
                  placeholder="Buscar por protocolo, profissional, cidade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
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

      {/* Tabela de Serviços */}
      <Card>
        <CardHeader>
          <CardTitle>Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={mockServices} />
        </CardContent>
      </Card>
    </div>
  )
}
