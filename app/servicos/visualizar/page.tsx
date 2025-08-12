"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, Settings, Info, RefreshCw } from "lucide-react"

const services = [
  {
    dataHora: "12/08/2025 12:00",
    empresa: "USS TEMPO",
    protocolo: "699411371",
    cnpj: "43.246.176/0001-30",
    veiculo: "",
    placa: "",
    renavam: "",
    beneficiario: "CELSO CLAUDIO BUSATO AVILA",
    senha: "---",
    telefone: "",
    cidade: "VITORIA - ESPIRITO SANTO",
    logradouro: "",
    bairro: "",
  },
  {
    dataHora: "12/08/2025 12:00",
    empresa: "USS TEMPO",
    protocolo: "698797494",
    cnpj: "43.246.176/0001-30",
    veiculo: "",
    placa: "",
    renavam: "",
    beneficiario: "KELISSON COSTA DE FARIAS",
    senha: "---",
    telefone: "",
    cidade: "VILA VELHA - ESPIRITO SANTO",
    logradouro: "",
    bairro: "",
  },
  {
    dataHora: "12/08/2025 12:00",
    empresa: "USS TEMPO",
    protocolo: "699192961",
    cnpj: "43.246.176/0001-30",
    veiculo: "",
    placa: "",
    renavam: "",
    beneficiario: "JANDERSON DOS SANTOS MANUEL",
    senha: "---",
    telefone: "",
    cidade: "SERRA - ESPIRITO SANTO",
    logradouro: "",
    bairro: "",
  },
  {
    dataHora: "12/08/2025 17:00",
    empresa: "USS TEMPO",
    protocolo: "699094771",
    cnpj: "43.246.176/0001-30",
    veiculo: "",
    placa: "",
    renavam: "",
    beneficiario: "MARIA DA PENHA REBULI",
    senha: "---",
    telefone: "",
    cidade: "AFONSO CLAUDIO - ESPIRITO SANTO",
    logradouro: "",
    bairro: "",
  },
  {
    dataHora: "12/08/2025 17:00",
    empresa: "USS TEMPO",
    protocolo: "699094771",
    cnpj: "43.246.176/0001-30",
    veiculo: "",
    placa: "",
    renavam: "",
    beneficiario: "MARIA DA PENHA REBULI",
    senha: "---",
    telefone: "",
    cidade: "AFONSO CLAUDIO - ESPIRITO SANTO",
    logradouro: "",
    bairro: "",
  },
]

export default function VisualizarPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600">autem.com.br › serviços › visualizar</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="PROCURAR" className="pl-10 w-32" />
            </div>
          </div>
        </div>

        {/* Services Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data e Hora</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Protocolo</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Veículo / Objeto</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Renavam</TableHead>
                    <TableHead>Beneficiário</TableHead>
                    <TableHead>Senha</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>O. Cidade</TableHead>
                    <TableHead>D. Logradouro</TableHead>
                    <TableHead>D. Bairro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{service.dataHora}</TableCell>
                      <TableCell>{service.empresa}</TableCell>
                      <TableCell>
                        <Button variant="link" className="p-0 h-auto text-blue-600">
                          {service.protocolo}
                        </Button>
                      </TableCell>
                      <TableCell>{service.cnpj}</TableCell>
                      <TableCell>{service.veiculo || "---"}</TableCell>
                      <TableCell>{service.placa || "---"}</TableCell>
                      <TableCell>{service.renavam || "---"}</TableCell>
                      <TableCell>{service.beneficiario}</TableCell>
                      <TableCell>{service.senha}</TableCell>
                      <TableCell>{service.telefone || "---"}</TableCell>
                      <TableCell>{service.cidade}</TableCell>
                      <TableCell>{service.logradouro || "---"}</TableCell>
                      <TableCell>{service.bairro || "---"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Mostrando de 1 até 5 de 5 resultado(s)</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled>
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
