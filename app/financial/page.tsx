import { AdminLayout } from "@/components/layout/admin-layout"
import { RevenueControlDashboard } from "@/components/financial/revenue-control-dashboard"
import { TransactionsTable } from "@/components/financial/transactions-table"
import { PageWithBack } from "@/components/layout/page-with-back"

export default function FinancialPage() {
  return (
    <AdminLayout>
      <PageWithBack backButtonLabel="Voltar para Dashboard">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">💰 Controle Financeiro</h1>
          <p className="text-gray-600">Acompanhe valores recebidos, saldo disponível e todos os pagamentos</p>
        </div>

        <RevenueControlDashboard />
        
        <div className="mt-8">
          <TransactionsTable />
        </div>
      </PageWithBack>
    </AdminLayout>
  )
}
