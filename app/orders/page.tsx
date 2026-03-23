"use client"

import { Suspense, useEffect, useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { OrdersDashboard } from "@/components/orders/orders-dashboard"
import { OrdersTable } from "@/components/orders/orders-table"
import { OrderDetailModal } from "@/components/orders/order-detail-modal"
import { useAnalytics } from "@/hooks/use-analytics"
import { PageWithBack } from "@/components/layout/page-with-back"

function OrdersPageContent() {
  const { trackPageView, trackUserAction } = useAnalytics()
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    trackPageView("Gestao de Pedidos")
  }, [trackPageView])

  const handleView = (order: any) => {
    if (!order) {
      return
    }

    trackUserAction("visualizar_pedido", "pedidos", { orderId: String(order.id) })
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  return (
    <AppShell>
      <PageWithBack backButtonLabel="Voltar para Dashboard">
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Gestao de Pedidos</h1>
            <p className="text-gray-600">Todos os pedidos ficam concentrados em uma unica lista com filtros reais.</p>
          </div>

          <OrdersDashboard />

          <OrdersTable onView={handleView} />
        </div>

        <OrderDetailModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode="view"
        />
      </PageWithBack>
    </AppShell>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<main className="p-6">Carregando pedidos...</main>}>
      <OrdersPageContent />
    </Suspense>
  )
}
