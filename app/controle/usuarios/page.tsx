"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, UserCheck, UserX } from "lucide-react"

const users = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao@exemplo.com",
    role: "operador",
    status: "ativo",
    telefone: "(27) 99999-9999",
    cpf: "123.456.789-00",
    lastLogin: "2025-01-15 10:30",
    createdAt: "2024-12-01",
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria@exemplo.com",
    role: "admin",
    status: "ativo",
    telefone: "(27) 88888-8888",
    cpf: "987.654.321-00",
    lastLogin: "2025-01-15 09:15",
    createdAt: "2024-11-15",
  },
  {
    id: "3",
    nome: "Pedro Costa",
    email: "pedro@exemplo.com",
    role: "prestador",
    status: "inativo",
    telefone: "(27) 77777-7777",
    cpf: "456.789.123-00",
    lastLogin: "2025-01-10 14:20",
    createdAt: "2024-10-20",
  },
]

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800"
    case "operador":
      return "bg-blue-100 text-blue-800"
    case "prestador":
      return "bg-green-100 text-green-800"
    case "cliente":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "ativo":
      return "bg-green-100 text-green-800"
    case "inativo":
      return "bg-red-100 text-red-800"
    case "bloqueado":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function UsuariosPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600">autem.com.br › controle › usuários</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Buscar usuários..." className="pl-10 w-64" />
            </div>
          </div>
          <div className="text-sm text-gray-600">{users.length} usuário(s)</div>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>{user.telefone}</TableCell>
                    <TableCell>{user.cpf}</TableCell>
                    <TableCell className="text-sm text-gray-600">{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.status === "ativo" ? (
                          <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                            <UserX className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="text-green-600 bg-transparent">
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
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
