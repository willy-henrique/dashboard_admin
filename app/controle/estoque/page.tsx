"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, Package, AlertTriangle } from "lucide-react"

const inventory = [
  {
    id: "1",
    nome: "Óleo Motor 5W30",
    unidade: "Litro",
    precoCompra: 25.5,
    precoVenda: 35.0,
    qtdViatura: 12,
    qtdProfissional: 8,
    min: 5,
    max: 50,
    categoria: "Lubrificantes",
  },
  {
    id: "2",
    nome: "Filtro de Ar",
    unidade: "Unidade",
    precoCompra: 15.0,
    precoVenda: 25.0,
    qtdViatura: 3,
    qtdProfissional: 15,
    min: 10,
    max: 100,
    categoria: "Filtros",
  },
  {
    id: "3",
    nome: "Pneu 185/65R15",
    unidade: "Unidade",
    precoCompra: 180.0,
    precoVenda: 250.0,
    qtdViatura: 8,
    qtdProfissional: 4,
    min: 8,
    max: 32,
    categoria: "Pneus",
  },
]

const getStockStatus = (current: number, min: number, max: number) => {
  if (current <= min) return { status: "baixo", color: "bg-red-100 text-red-800" }
  if (current >= max) return { status: "alto", color: "bg-yellow-100 text-yellow-800" }
  return { status: "normal", color: "bg-green-100 text-green-800" }
}

export default function EstoquePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
          <p className="text-gray-600">autem.com.br › controle › estoque</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Movimentação
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Buscar itens..." className="pl-10 w-64" />
            </div>
          </div>
          <div className="text-sm text-gray-600">{inventory.length} item(ns)</div>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Preço Compra</TableHead>
                  <TableHead>Preço Venda</TableHead>
                  <TableHead>Qtd. Viatura</TableHead>
                  <TableHead>Qtd. Profissional</TableHead>
                  <TableHead>Min/Max</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => {
                  const totalStock = item.qtdViatura + item.qtdProfissional
                  const stockStatus = getStockStatus(totalStock, item.min, item.max)

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell>{item.unidade}</TableCell>
                      <TableCell>R$ {item.precoCompra.toFixed(2)}</TableCell>
                      <TableCell>R$ {item.precoVenda.toFixed(2)}</TableCell>
                      <TableCell>{item.qtdViatura}</TableCell>
                      <TableCell>{item.qtdProfissional}</TableCell>
                      <TableCell className="text-sm">
                        {item.min} / {item.max}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={stockStatus.color}>{stockStatus.status}</Badge>
                          {stockStatus.status === "baixo" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
