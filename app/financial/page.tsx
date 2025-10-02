import { AdminLayout } from "@/components/layout/admin-layout"
import { FinancialDashboard } from "@/components/financial/financial-dashboard"
import { TransactionsTable } from "@/components/financial/transactions-table"
import { PageWithBack } from "@/components/layout/page-with-back"

export default function FinancialPage() {
  return (
    <AdminLayout>
      <PageWithBack backButtonLabel="Voltar para Dashboard">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão Financeira</h1>
          <p className="text-gray-600">Monitore receitas, transações e comissões da plataforma</p>
        </div>

        <FinancialDashboard />
        <TransactionsTable />
      </PageWithBack>
    </AdminLayout>
  )
}
