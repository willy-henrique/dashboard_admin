"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, MapPin } from "lucide-react"

const vehicles = [
  {
    id: "1",
    placa: "ABC-1234",
    modelo: "Fiat Strada",
    ano: "2022",
    cor: "Branca",
    status: "ativo",
    responsavel: "João Silva",
    km: "45.230",
    ultimaManutencao: "2024-12-15",
    proximaRevisao: "2025-03-15",
  },
  {
    id: "2",
    placa: "DEF-5678",
    modelo: "Volkswagen Saveiro",
    ano: "2021",
    cor: "Prata",
    status: "manutencao",
    responsavel: "Maria Santos",
    km: "67.890",
    ultimaManutencao: "2025-01-10",
    proximaRevisao: "2025-04-10",
  },
  {
    id: "3",
    placa: "GHI-9012",
    modelo: "Ford Ranger",
    ano: "2023",
    cor: "Azul",
    status: "inativo",
    responsavel: "Pedro Costa",
    km: "23.456",
    ultimaManutencao: "2024-11-20",
    proximaRevisao: "2025-02-20",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "ativo":
      return "bg-green-100 text-green-800"
    case "manutencao":
      return "bg-yellow-100 text-yellow-800"
    case "inativo":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function FrotaPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Frota</h1>
          <p className="text-gray-600">autem.com.br › controle › frota</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Veículo
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Buscar veículos..." className="pl-10 w-64" />
            </div>
          </div>
          <div className="text-sm text-gray-600">{vehicles.length} veículo(s)</div>
        </div>

        {/* Fleet Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Quilometragem</TableHead>
                  <TableHead>Última Manutenção</TableHead>
                  <TableHead>Próxima Revisão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.placa}</TableCell>
                    <TableCell>{vehicle.modelo}</TableCell>
                    <TableCell>{vehicle.ano}</TableCell>
                    <TableCell>{vehicle.cor}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                    </TableCell>
                    <TableCell>{vehicle.responsavel}</TableCell>
                    <TableCell>{vehicle.km} km</TableCell>
                    <TableCell className="text-sm text-gray-600">{vehicle.ultimaManutencao}</TableCell>
                    <TableCell className="text-sm text-gray-600">{vehicle.proximaRevisao}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
