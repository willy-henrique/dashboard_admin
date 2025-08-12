"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, DollarSign, TrendingUp, TrendingDown, FileText, Lock } from "lucide-react"

const closingPeriods = [
  {
    id: "1",
    periodo: "Janeiro 2025",
    dataInicio: "2025-01-01",
    dataFim: "2025-01-31",
    receitas: 15750.0,
    despesas: 8950.0,
    lucro: 6800.0,
    status: "aberto",
    dataFechamento: null,
  },
  {
    id: "2",
    periodo: "Dezembro 2024",
    dataInicio: "2024-12-01",
    dataFim: "2024-12-31",
    receitas: 18200.0,
    despesas: 10500.0,
    lucro: 7700.0,
    status: "fechado",
    dataFechamento: "2025-01-05",
  },
  {
    id: "3",
    periodo: "Novembro 2024",
    dataInicio: "2024-11-01",
    dataFim: "2024-11-30",
    receitas: 16800.0,
    despesas: 9200.0,
    lucro: 7600.0,
    status: "fechado",
    dataFechamento: "2024-12-05",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "aberto":
      return "bg-yellow-100 text-yellow-800"
    case "fechado":
      return "bg-green-100 text-green-800"
    case "processando":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function FechamentoPage() {
  const currentPeriod = closingPeriods.find((p) => p.status === "aberto")

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fechamento</h1>
          <p className="text-gray-600">autem.com.br › financeiro › fechamento</p>
        </div>

        {/* Current Period Summary */}
        {currentPeriod && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Período Atual - {currentPeriod.periodo}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Receitas</p>
                    <p className="text-xl font-bold text-green-600">
                      R$ {currentPeriod.receitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-full">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Despesas</p>
                    <p className="text-xl font-bold text-red-600">
                      R$ {currentPeriod.despesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lucro</p>
                    <p className="text-xl font-bold text-blue-600">
                      R$ {currentPeriod.lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Lock className="h-4 w-4 mr-2" />
                    Fechar Período
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Closing History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Fechamentos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Fim</TableHead>
                  <TableHead>Receitas</TableHead>
                  <TableHead>Despesas</TableHead>
                  <TableHead>Lucro</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Fechamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {closingPeriods.map((period) => (
                  <TableRow key={period.id}>
                    <TableCell className="font-medium">{period.periodo}</TableCell>
                    <TableCell>{period.dataInicio}</TableCell>
                    <TableCell>{period.dataFim}</TableCell>
                    <TableCell className="text-green-600 font-medium">
                      R$ {period.receitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-red-600 font-medium">
                      R$ {period.despesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-blue-600 font-medium">
                      R$ {period.lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(period.status)}>{period.status}</Badge>
                    </TableCell>
                    <TableCell>{period.dataFechamento || "---"}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4" />
                      </Button>
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
