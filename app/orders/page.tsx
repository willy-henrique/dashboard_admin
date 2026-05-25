import { Suspense, useEffect, useMemo, useState } from "react"
import { ShoppingCart } from "lucide-react"
import { useOrderDocumentRealtime } from "@/hooks/use-order-document-realtime"
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

  const liveOrderId = isModalOpen && selectedOrder?.id ? String(selectedOrder.id) : null
  const { order: liveOrder } = useOrderDocumentRealtime(liveOrderId, Boolean(liveOrderId))

  const mergedOrder = useMemo(() => {
    if (!selectedOrder) {
      return null
    }
    if (!liveOrder) {
      return selectedOrder
    }
    return { ...selectedOrder, ...liveOrder }
  }, [liveOrder, selectedOrder])

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
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestão de Pedidos</h1>
              <p className="text-sm text-muted-foreground">Todos os pedidos em uma lista com filtros em tempo real</p>
            </div>
          </div>

          <OrdersDashboard />

          <OrdersTable onView={handleView} />
        </div>

        <OrderDetailModal
          order={isModalOpen ? mergedOrder : null}
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
