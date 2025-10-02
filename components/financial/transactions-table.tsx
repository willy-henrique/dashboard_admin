"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, RefreshCw, AlertCircle } from "lucide-react"
import { TransactionModal } from "./transaction-modal"

interface Transaction {
  id: string
  orderId: string
  clientId: string
  clientName: string
  providerId: string
  providerName: string
  amount: number
  commission: number
  status: "pending" | "completed" | "failed" | "refunded"
  paymentMethod: string
  createdAt: string
  completedAt?: string
  failureReason?: string
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    orderId: "ORD-001",
    clientId: "1",
    clientName: "Maria Silva",
    providerId: "1",
    providerName: "João Silva",
    amount: 250.0,
    commission: 25.0,
    status: "completed",
    paymentMethod: "PIX",
    createdAt: "2024-03-10T14:30:00Z",
    completedAt: "2024-03-10T14:31:00Z",
  },
  {
    id: "TXN-002",
    orderId: "ORD-002",
    clientId: "2",
    clientName: "João Santos",
    providerId: "2",
    providerName: "Maria Santos",
    amount: 150.0,
    commission: 15.0,
    status: "pending",
    paymentMethod: "Cartão de Crédito",
    createdAt: "2024-03-11T10:15:00Z",
  },
  {
    id: "TXN-003",
    orderId: "ORD-003",
    clientId: "3",
    clientName: "Ana Costa",
    providerId: "3",
    providerName: "Carlos Lima",
    amount: 300.0,
    commission: 30.0,
    status: "completed",
    paymentMethod: "PIX",
    createdAt: "2024-03-09T16:20:00Z",
    completedAt: "2024-03-09T16:21:00Z",
  },
  {
    id: "TXN-004",
    orderId: "ORD-004",
    clientId: "4",
    clientName: "Carlos Lima",
    providerId: "4",
    providerName: "Ana Costa",
    amount: 800.0,
    commission: 80.0,
    status: "failed",
    paymentMethod: "Cartão de Crédito",
    createdAt: "2024-03-11T09:45:00Z",
    failureReason: "Cartão recusado",
  },
  {
    id: "TXN-005",
    orderId: "ORD-005",
    clientId: "1",
    clientName: "Maria Silva",
    providerId: "1",
    providerName: "João Silva",
    amount: 200.0,
    commission: 20.0,
    status: "refunded",
    paymentMethod: "PIX",
    createdAt: "2024-03-08T11:30:00Z",
    completedAt: "2024-03-08T11:31:00Z",
  },
]

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.providerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesPaymentMethod =
      paymentMethodFilter === "all" ||
      transaction.paymentMethod.toLowerCase().includes(paymentMethodFilter.toLowerCase())
    return matchesSearch && matchesStatus && matchesPaymentMethod
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">Pendente</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Falhou</Badge>
      case "refunded":
        return <Badge className="bg-purple-100 text-purple-800">Reembolsado</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    const colors = {
      PIX: "bg-blue-100 text-blue-800",
      "Cartão de Crédito": "bg-green-100 text-green-800",
      "Cartão de Débito": "bg-orange-100 text-orange-800",
      Boleto: "bg-purple-100 text-purple-800",
    }
    return <Badge className={colors[method as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{method}</Badge>
  }

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleRetryTransaction = (transactionId: string) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === transactionId ? { ...transaction, status: "pending" } : transaction,
      ),
    )
  }

  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  const totalCommission = filteredTransactions.reduce((sum, transaction) => sum + transaction.commission, 0)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>
            {filteredTransactions.length} de {transactions.length} transações • Total: R$ {totalAmount.toLocaleString()}{" "}
            • Comissões: R$ {totalCommission.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por ID, pedido, cliente ou prestador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
                <SelectItem value="refunded">Reembolsado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Métodos</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="cartão">Cartão</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transação</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Prestador</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.id}</div>
                        <div className="text-sm text-gray-500">{transaction.orderId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.clientName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.providerName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">R$ {transaction.amount.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">R$ {transaction.commission.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>{getPaymentMethodBadge(transaction.paymentMethod)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(transaction.status)}
                        {transaction.status === "failed" && <AlertCircle className="h-4 w-4 text-red-500" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(transaction.createdAt).toLocaleDateString("pt-BR")}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(transaction.createdAt).toLocaleTimeString("pt-BR")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewTransaction(transaction)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {transaction.status === "failed" && (
                          <Button variant="ghost" size="sm" onClick={() => handleRetryTransaction(transaction.id)}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TransactionModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTransaction(null)
        }}
      />
    </>
  )
}
