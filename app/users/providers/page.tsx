"use client"

import { useMemo, useState } from "react"
import { ProvidersTable } from "@/components/users/providers-table"
import { UsersTable } from "@/components/users/users-table"
import { UserModal } from "@/components/users/user-modal"
import { useUsers } from "@/hooks/use-users"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProvidersPage() {
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const { users, loading, refetch, createUser, updateUser, deleteUser, toggleUserStatus, blockUser, unblockUser } = useUsers({ role: 'prestador', search })

  const selectedUser = useMemo(() => users.find(u => u.id === selectedUserId) || null, [users, selectedUserId])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Prestadores</h1>
          <p className="text-gray-600">Gerencie todos os prestadores de serviços</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => { setSelectedUserId(null); setModalOpen(true) }}>
          Novo Prestador
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
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
            await createUser({ ...(data as any), role: 'prestador', status: 'ativo', nome: data.nome || '', email: data.email || '' })
          }
          setModalOpen(false)
        }}
        mode={selectedUser ? 'edit' : 'create'}
      />
    </div>
  )
}
