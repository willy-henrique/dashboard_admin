import { AdminLayout } from "@/components/layout/admin-layout"
import { ProvidersTable } from "@/components/users/providers-table"

export default function ProvidersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Prestadores</h1>
          <p className="text-gray-600">Gerencie todos os prestadores de serviços</p>
        </div>

        <ProvidersTable />
      </div>
    </AdminLayout>
  )
}
