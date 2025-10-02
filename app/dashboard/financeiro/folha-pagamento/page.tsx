"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Eye, Download, Users } from "lucide-react"

const payrollEntries = [
  {
    id: "1",
    funcionario: "João Silva",
    cargo: "Técnico",
    periodo: "Janeiro 2025",
    salarioBase: 2500.0,
    horasExtras: 150.0,
    comissoes: 300.0,
    descontos: 275.0,
    inss: 200.0,
    irrf: 125.0,
    salarioLiquido: 2350.0,
    status: "processado",
  },
  {
    id: "2",
    funcionario: "Maria Santos",
    cargo: "Supervisora",
    periodo: "Janeiro 2025",
    salarioBase: 3500.0,
    horasExtras: 200.0,
    comissoes: 450.0,
    descontos: 385.0,
    inss: 280.0,
    irrf: 210.0,
    salarioLiquido: 3275.0,
    status: "processado",
  },
  {
    id: "3",
    funcionario: "Pedro Costa",
    cargo: "Técnico",
    periodo: "Janeiro 2025",
    salarioBase: 2500.0,
    horasExtras: 100.0,
    comissoes: 250.0,
    descontos: 255.0,
    inss: 200.0,
    irrf: 115.0,
    salarioLiquido: 2280.0,
    status: "pendente",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "processado":
      return "bg-green-100 text-green-800"
    case "pendente":
      return "bg-yellow-100 text-yellow-800"
    case "pago":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function FolhaPagamentoPage() {
  const totalFolha = payrollEntries.reduce((sum, entry) => sum + entry.salarioLiquido, 0)
  const totalDescontos = payrollEntries.reduce((sum, entry) => sum + entry.descontos + entry.inss + entry.irrf, 0)

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Folha de Pagamento</h1>
          <p className="text-gray-600">autem.com.br › financeiro › folha de pagamento</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total da Folha</p>
                  <p className="text-2xl font-bold">
                    R$ {totalFolha.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Descontos</p>
                  <p className="text-2xl font-bold text-red-600">
                    R$ {totalDescontos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <Users className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Funcionários</p>
                  <p className="text-2xl font-bold">{payrollEntries.length}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Processar Folha
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Buscar funcionário..." className="pl-20 w-64" />
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Salário Base</TableHead>
                    <TableHead>Horas Extras</TableHead>
                    <TableHead>Comissões</TableHead>
                    <TableHead>Descontos</TableHead>
                    <TableHead>INSS</TableHead>
                    <TableHead>IRRF</TableHead>
                    <TableHead>Salário Líquido</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.funcionario}</TableCell>
                      <TableCell>{entry.cargo}</TableCell>
                      <TableCell>{entry.periodo}</TableCell>
                      <TableCell>R$ {entry.salarioBase.toFixed(2)}</TableCell>
                      <TableCell>R$ {entry.horasExtras.toFixed(2)}</TableCell>
                      <TableCell>R$ {entry.comissoes.toFixed(2)}</TableCell>
                      <TableCell>R$ {entry.descontos.toFixed(2)}</TableCell>
                      <TableCell>R$ {entry.inss.toFixed(2)}</TableCell>
                      <TableCell>R$ {entry.irrf.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">R$ {entry.salarioLiquido.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(entry.status)}>{entry.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
