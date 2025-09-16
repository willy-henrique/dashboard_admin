"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UsersTable } from "@/components/users/users-table"
import { UserModal } from "@/components/users/user-modal"
import { useUsers } from "@/hooks/use-users"
import { Badge } from "@/components/ui/badge"
import { User, UserCheck, UserX } from "lucide-react"

export default function ClientsPage() {
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const { users, loading, refetch, createUser, updateUser, deleteUser, toggleUserStatus, blockUser, unblockUser } = useUsers({ role: 'cliente', search })

  const selectedUser = useMemo(() => users.find(u => u.id === selectedUserId) || null, [users, selectedUserId])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 backdrop-blur p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
            <p className="text-muted-foreground">Gerencie todos os clientes do aplicativo</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">Exportar</Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => { setSelectedUserId(null); setModalOpen(true) }}>
              Novo Cliente
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-semibold">{users.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-semibold">{users.filter(u=>u.status==='ativo').length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bloqueados</p>
                <p className="text-2xl font-semibold">{users.filter(u=>u.status==='bloqueado').length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Filtros rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            <Input placeholder="Buscar por nome, email, CPF..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button variant="outline" onClick={() => { setSearch(""); refetch() }}>Limpar</Button>
          </div>
        </CardContent>
      </Card>

      <UsersTable 
        users={users}
        loading={loading}
        onView={(id) => { setSelectedUserId(id); setModalOpen(true) }}
        onEdit={(id) => { setSelectedUserId(id); setModalOpen(true) }}
        onDelete={(id) => deleteUser(id)}
        onToggleStatus={(id, status) => toggleUserStatus(id, status)}
        onBlock={(id) => blockUser(id)}
        onUnblock={(id) => unblockUser(id)}
      />

      <UserModal 
        user={selectedUser}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={async (data) => {
          if (selectedUser) {
            await updateUser(selectedUser.id, data as any)
          } else {
            await createUser({ ...(data as any), role: 'cliente', status: 'ativo', nome: data.nome || '', email: data.email || '' })
          }
          setModalOpen(false)
        }}
        mode={selectedUser ? 'edit' : 'create'}
      />
    </div>
  )
}
