"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  MapPin, 
  Maximize2, 
  Filter, 
  RefreshCw, 
  Upload, 
  Search,
  ChevronUp,
  ChevronDown,
  Plus,
  Phone,
  Navigation,
  Clock,
  Activity
} from "lucide-react"

interface Rastreamento {
  id: string
  profissional: string
  latitude: string
  longitude: string
  endereco: string
  velocidade: string
  direcao: string
  ultimaAtualizacao: string
  status: 'ativo' | 'inativo'
}

export default function RastreamentoPage() {
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const rastreamentos: Rastreamento[] = [
    {
      id: "1",
      profissional: "JOCIMAR",
      latitude: "-20.2976",
      longitude: "-40.2958",
      endereco: "Vila Velha - ES, Brasil",
      velocidade: "45 km/h",
      direcao: "Norte",
      ultimaAtualizacao: "30s atrás",
      status: "ativo"
    },
    {
      id: "2",
      profissional: "ANTONIO",
      latitude: "-20.3189",
      longitude: "-40.3084",
      endereco: "Vitória - ES, Brasil",
      velocidade: "0 km/h",
      direcao: "-",
      ultimaAtualizacao: "2 min atrás",
      status: "ativo"
    },
    {
      id: "3",
      profissional: "JOYCE BARBOSA",
      latitude: "-20.2976",
      longitude: "-40.2958",
      endereco: "Vila Velha - ES, Brasil",
      velocidade: "32 km/h",
      direcao: "Sul",
      ultimaAtualizacao: "1 min atrás",
      status: "ativo"
    }
  ]

  const columns = [
    { key: "profissional", label: "Profissional", sortable: true },
    { key: "latitude", label: "Latitude", sortable: true },
    { key: "longitude", label: "Longitude", sortable: true },
    { key: "endereco", label: "Endereço", sortable: true },
    { key: "velocidade", label: "Velocidade", sortable: true },
    { key: "direcao", label: "Direção", sortable: true },
    { key: "ultimaAtualizacao", label: "Última Atualização", sortable: true },
    { key: "status", label: "Status", sortable: true }
  ]

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />
    }
    return sortDirection === "asc" ? 
      <ChevronUp className="h-4 w-4 text-blue-600" /> : 
      <ChevronDown className="h-4 w-4 text-blue-600" />
  }

  const getStatusBadge = (status: string) => {
    if (status === 'ativo') {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
    }
    return <Badge className="bg-red-100 text-red-800 border-red-200">Inativo</Badge>
  }

  const filteredRastreamentos = rastreamentos.filter(rastreamento =>
    Object.values(rastreamento).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <main className="flex-1 space-y-6 p-6" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <MapPin className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rastreamento</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              autem.com.br &gt; controle &gt; autem mobile &gt; rastreamento
            </p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Novo Rastreamento
        </Button>
      </div>

      {/* Barra de Ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Maximize2 className="h-4 w-4 mr-1" />
            Expandir
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-1" />
            Exportar
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="PROCURAR"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabela de Rastreamento */}
      <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300 ${
                        column.sortable ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800' : ''
                      }`}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.sortable && getSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRastreamentos.map((rastreamento, index) => (
                  <tr
                    key={rastreamento.id}
                    className={`border-b hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800'
                    }`}
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-green-600" />
                        <span>{rastreamento.profissional}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {rastreamento.latitude}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {rastreamento.longitude}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {rastreamento.endereco}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {rastreamento.velocidade}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {rastreamento.direcao}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>{rastreamento.ultimaAtualizacao}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getStatusBadge(rastreamento.status)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="sm">
                          <Navigation className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MapPin className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Botões Flutuantes */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
        <Button className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg">
          <Plus className="h-5 w-5" />
        </Button>
        <Button className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
          <Phone className="h-5 w-5" />
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
        Copyright © 2025 AutEM v2.2.1 Todos os direitos reservados
      </div>
    </main>
  )
}
