"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MapPin, Edit, Check, Clock, AlertCircle, Plus } from "lucide-react"

const services = [
  {
    id: "1",
    status: "aceito",
    agendamento: "12/08/2025 12:00",
    protocolo: "202507039",
    acionado: "DOUGLAS KO...",
    cidade: "Via Velha - Es (Coqueral De Itaparica)",
    responsavel: "Jocimar",
    tempo: "Atrasado",
    atraso: "8211 min",
    km: "0 km",
  },
  {
    id: "2",
    status: "aguardando",
    agendamento: "07/08 08:00 às 17:00",
    protocolo: "488650191",
    acionado: "ROSCIO SCO...",
    cidade: "Serra - Es (Manoel Plaza)",
    responsavel: "Não Informado",
    tempo: "7101 min",
    atraso: "",
    km: "0 km",
  },
  {
    id: "3",
    status: "aceito",
    agendamento: "12/08 08:00 às 12:00",
    protocolo: "699411371",
    acionado: "CELSO CLAU...",
    cidade: "Vitoria - Espir... (Jardim Da Penha)",
    responsavel: "Rafael",
    tempo: "129 min",
    atraso: "",
    km: "0 km",
  },
  {
    id: "4",
    status: "aceito",
    agendamento: "12/08 08:00 às 12:00",
    protocolo: "698797494",
    acionado: "KELISSON C...",
    cidade: "Vila Velha - Es... (Praia De Itaparica)",
    responsavel: "Jocimar",
    tempo: "129 min",
    atraso: "",
    km: "0 km",
  },
  {
    id: "5",
    status: "aguardando",
    agendamento: "12/08 13:00 às 17:00",
    protocolo: "699094771",
    acionado: "MARIA DA P...",
    cidade: "Afonso Claudio - (Centro)",
    responsavel: "Não Informado",
    tempo: "429 min",
    atraso: "",
    km: "0 km",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "aceito":
      return <Check className="h-4 w-4" />
    case "aguardando":
      return <Clock className="h-4 w-4" />
    case "em_andamento":
      return <AlertCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "aceito":
      return "bg-green-500"
    case "aguardando":
      return "bg-yellow-500"
    case "em_andamento":
      return "bg-blue-500"
    case "cancelado":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export default function PainelLogisticoPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Painel Logístico</h1>
          <p className="text-gray-600">autem.com.br › serviços › painel logístico</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
              <Plus className="h-4 w-4 mr-2" />
              CADASTRAR
            </Button>
            <Button variant="outline" size="sm">
              PROTOCOLO
            </Button>
            <Button variant="outline" size="sm">
              BUSCA RÁPIDA
            </Button>
          </div>
          <div className="text-sm text-gray-600">5 SERVIÇO(S)</div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select defaultValue="todos">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="aceito">Aceito</SelectItem>
              <SelectItem value="aguardando">Aguardando</SelectItem>
              <SelectItem value="em_andamento">Em Andamento</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="todos">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="jocimar">Jocimar</SelectItem>
              <SelectItem value="rafael">Rafael</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Buscar..." className="pl-10 w-64" />
          </div>
        </div>

        {/* Services Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Agendamento</TableHead>
                  <TableHead>Protocolo</TableHead>
                  <TableHead>Acionado</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Tempo</TableHead>
                  <TableHead>Km</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="text-sm">{service.agendamento}</div>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto text-blue-600">
                        {service.protocolo}
                      </Button>
                    </TableCell>
                    <TableCell>{service.acionado}</TableCell>
                    <TableCell className="max-w-48">
                      <div className="text-sm">{service.cidade}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {service.status === "aceito" && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                        <span className={service.responsavel === "Não Informado" ? "text-gray-400" : ""}>
                          {service.responsavel}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {service.status === "aceito" && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                        <span className={service.tempo === "Atrasado" ? "text-red-500" : ""}>{service.tempo}</span>
                        {service.atraso && (
                          <Badge variant="destructive" className="text-xs">
                            {service.atraso}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{service.km}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {service.status === "aguardando" && (
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            ACEITO
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
