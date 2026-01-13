"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Eye, 
  Printer, 
  Info, 
  Filter, 
  RefreshCw, 
  Upload, 
  Search,
  ChevronUp,
  ChevronDown,
  Folder,
  Phone,
  MapPin,
  Calendar,
  Building,
  FileText,
  Car,
  User,
  Lock,
  Plus
} from "lucide-react"

interface Servico {
  id: string
  dataHora: string
  empresa: string
  protocolo: string
  cnpj: string
  veiculo: string
  placa: string
  renavam: string
  beneficiario: string
  senha: string
  telefone: string
  origemCidade: string
  destinoLogradouro: string
  destinoBairro: string
  destinoCidade: string
}

export default function VisualizarServicosPage() {
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const servicos: Servico[] = [
    {
      id: "1",
      dataHora: "13/08/2025 11:00",
      empresa: "MONDIAL AS...",
      protocolo: "49910674/2",
      cnpj: "43.246.176/0001-30",
      veiculo: "",
      placa: "",
      renavam: "",
      beneficiario: "PABLO MARTINS BOURGUIGNON",
      senha: "6836",
      telefone: "(27) 99962-6836",
      origemCidade: "VILA VELHA - ES",
      destinoLogradouro: "",
      destinoBairro: "",
      destinoCidade: ""
    },
    {
      id: "2",
      dataHora: "13/08/2025 12:00",
      empresa: "IKE ASSIST...",
      protocolo: "20250730391982/1",
      cnpj: "43.246.176/0001-30",
      veiculo: "",
      placa: "",
      renavam: "",
      beneficiario: "DOUGLAS KONRADO DE OLIVEIRA LOIOLA",
      senha: "****",
      telefone: "(27) 99926-****",
      origemCidade: "VILA VELHA - ES",
      destinoLogradouro: "",
      destinoBairro: "",
      destinoCidade: ""
    },
    {
      id: "3",
      dataHora: "13/08/2025 15:00",
      empresa: "MONDIAL AS...",
      protocolo: "49919929/1",
      cnpj: "43.246.176/0001-30",
      veiculo: "",
      placa: "",
      renavam: "",
      beneficiario: "SONIA MARCIA PINTO CHAGAS",
      senha: "****",
      telefone: "(27) 99873-5122",
      origemCidade: "VILA VELHA - ES",
      destinoLogradouro: "",
      destinoBairro: "",
      destinoCidade: ""
    }
  ]

  const columns = [
    { key: "dataHora", label: "Data e Hora", sortable: true },
    { key: "empresa", label: "Empresa", sortable: true },
    { key: "protocolo", label: "Protocolo", sortable: true },
    { key: "cnpj", label: "CNPJ", sortable: true },
    { key: "veiculo", label: "Veículo / Objeto", sortable: true },
    { key: "placa", label: "Placa", sortable: true },
    { key: "renavam", label: "Renavam", sortable: true },
    { key: "beneficiario", label: "Beneficiário", sortable: true },
    { key: "senha", label: "Senha", sortable: true },
    { key: "telefone", label: "Telefone", sortable: true },
    { key: "origemCidade", label: "O. Cidade", sortable: true },
    { key: "destinoLogradouro", label: "D. Logradouro", sortable: true },
    { key: "destinoBairro", label: "D. Bairro", sortable: true },
    { key: "destinoCidade", label: "D. Cidade", sortable: true }
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

  const filteredServicos = servicos.filter(servico =>
    Object.values(servico).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <main className="flex-1 space-y-6 p-6" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Eye className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Serviços</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              autem.com.br &gt; serviços &gt; visualizar
            </p>
          </div>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {/* Barra de Ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-1" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <Info className="h-4 w-4 mr-1" />
            Informações
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
            Importar
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

      {/* Tabela de Serviços */}
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
                </tr>
              </thead>
              <tbody>
                {filteredServicos.map((servico, index) => (
                  <tr
                    key={servico.id}
                    className={`border-b hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800'
                    }`}
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {servico.dataHora}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {servico.empresa}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <Folder className="h-4 w-4 text-green-600" />
                        <span>{servico.protocolo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {servico.cnpj}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {servico.veiculo || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {servico.placa || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {servico.renavam || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {servico.beneficiario}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {servico.senha}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {servico.telefone}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {servico.origemCidade}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {servico.destinoLogradouro || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {servico.destinoBairro || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {servico.destinoCidade || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Mostrando de 1 até {filteredServicos.length} de {filteredServicos.length} resultado(s)
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled={currentPage === 1}>
            &lt;
          </Button>
          <Button variant="outline" size="sm" className="bg-blue-600 text-white">
            1
          </Button>
          <Button variant="outline" size="sm" disabled={filteredServicos.length <= 3}>
            &gt;
          </Button>
        </div>
      </div>

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
