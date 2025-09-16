"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UsersTable } from "@/components/users/users-table"
import { UserModal } from "@/components/users/user-modal"
import { useUsers } from "@/hooks/use-users"

export default function VerificationsPage() {
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // Prestadores pendentes de verificação (status pendente ou role prestador com status inativo)
  const { users, loading, refetch, updateUser, deleteUser, blockUser, unblockUser } = useUsers({ role: 'prestador', search })
  const pending = useMemo(() => users.filter(u => u.status === 'inativo' || (u as any).pendente === true), [users])
  const selectedUser = useMemo(() => pending.find(u => u.id === selectedUserId) || null, [pending, selectedUserId])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verificações</h1>
          <p className="text-gray-600">Aprove ou recuse cadastros de prestadores</p>
        </div>
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
        users={pending}
        loading={loading}
        onView={(id) => { setSelectedUserId(id); setModalOpen(true) }}
        onEdit={(id) => { setSelectedUserId(id); setModalOpen(true) }}
        onDelete={(id) => deleteUser(id)}
        onToggleStatus={async (id, status) => {
          // Aprovar = ativar; Recusar = bloquear
          if (status === 'inativo') {
            await updateUser(id, { status: 'ativo' } as any)
          } else {
            await blockUser(id)
          }
        }}
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
          }
          setModalOpen(false)
        }}
        mode={selectedUser ? 'edit' : 'view'}
      />
    </div>
  )
}


