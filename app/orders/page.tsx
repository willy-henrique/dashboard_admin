import { AdminLayout } from "@/components/layout/admin-layout"
import { OrdersTable } from "@/components/orders/orders-table"

export default function OrdersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Pedidos</h1>
          <p className="text-gray-600">Monitore e gerencie todos os pedidos da plataforma</p>
        </div>

        <OrdersTable />
      </div>
    </AdminLayout>
  )
}
