import { AdminLayout } from "@/components/layout/admin-layout"
import { ClientsTable } from "@/components/users/clients-table"

export default function ClientsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h1>
          <p className="text-gray-600">Gerencie todos os clientes da plataforma</p>
        </div>

        <ClientsTable />
      </div>
    </AdminLayout>
  )
}
