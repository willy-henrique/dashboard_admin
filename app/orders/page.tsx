"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrdersDashboard } from "@/components/orders/orders-dashboard"
import { OrdersTable } from "@/components/orders/orders-table"
import { OrderDetailModal } from "@/components/orders/order-detail-modal"
import { ProfessionalSupportChat } from "@/components/orders/professional-support-chat"
import { useOrders, useOrderStats } from "@/hooks/use-orders"
import { useAnalytics } from "@/hooks/use-analytics"
import { 
  ShoppingCart, 
  Clock, 
  Activity, 
  CheckCircle, 
  MessageCircle,
  Plus,
  Filter,
  Download
} from "lucide-react"
import { PageWithBack } from "@/components/layout/page-with-back"

export default function OrdersPage() {
  const { orders, loading, error, updateOrder, deleteOrder, assignProvider, updateOrderStatus } = useOrders()
  const { stats: orderStats, loading: statsLoading } = useOrderStats()
  const { trackPageView, trackUserAction } = useAnalytics()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    trackPageView('Gestão de Pedidos')
  }, [trackPageView])

  const handleView = (orderId: string) => {
    trackUserAction('visualizar_pedido', 'pedidos', { orderId })
    const order = orders.find(o => o.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setModalMode('view')
      setIsModalOpen(true)
    }
  }

  const handleEdit = (orderId: string) => {
    trackUserAction('editar_pedido', 'pedidos', { orderId })
    const order = orders.find(o => o.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setModalMode('edit')
      setIsModalOpen(true)
    }
  }

  const handleUpdate = (orderId: string, orderData: any) => {
    trackUserAction('atualizar_pedido', 'pedidos', { orderId, orderData })
    updateOrder(orderId, orderData)
    setIsModalOpen(false)
  }

  const handleDelete = (orderId: string) => {
    trackUserAction('deletar_pedido', 'pedidos', { orderId })
    if (confirm('Tem certeza que deseja deletar este pedido?')) {
      deleteOrder(orderId)
      setIsModalOpen(false)
    }
  }

  const handleAssignProvider = (orderId: string, providerId: string, providerName: string) => {
    trackUserAction('atribuir_prestador', 'pedidos', { orderId, providerId, providerName })
    assignProvider(orderId, providerId, providerName)
    setIsModalOpen(false)
  }

  const handleUpdateStatus = (orderId: string, status: string, notes?: string) => {
    trackUserAction('atualizar_status_pedido', 'pedidos', { orderId, status, notes })
    updateOrderStatus(orderId, status as any, notes)
    setIsModalOpen(false)
  }

  const handleNewOrder = () => {
    trackUserAction('novo_pedido', 'pedidos')
    // Implementar criação de pedido
  }

  const handleExport = () => {
    trackUserAction('exportar_pedidos', 'pedidos')
    // Implementar exportação
  }

  const getFilteredOrders = (status?: string) => {
    if (!status) return orders
    return orders.filter(order => order.status === status)
  }

  return (
    <AppShell>
      <PageWithBack backButtonLabel="Voltar para Dashboard">
        {/* Header Profissional */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Pedidos</h1>
            <p className="text-gray-600 mt-1">Gerenciamento completo de pedidos e atendimento</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={handleNewOrder} className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Pedido
            </Button>
          </div>
        </div>

        {/* Navegação Profissional */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-white border border-gray-200 shadow-sm rounded-lg">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="todos" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Todos</span>
            </TabsTrigger>
            <TabsTrigger value="pendentes" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Pendentes</span>
            </TabsTrigger>
            <TabsTrigger value="ativos" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Ativos</span>
            </TabsTrigger>
            <TabsTrigger value="concluidos" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Concluídos</span>
            </TabsTrigger>
          </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <OrdersDashboard />
        </TabsContent>

        <TabsContent value="todos" className="space-y-6">
          <OrdersTable onView={handleView} onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="pendentes" className="space-y-6">
          <OrdersTable filters={{ status: 'pending' }} onView={handleView} onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="ativos" className="space-y-6">
          <OrdersTable filters={{ status: 'in_progress' }} onView={handleView} onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="concluidos" className="space-y-6">
          <OrdersTable filters={{ status: 'completed' }} onView={handleView} onEdit={handleEdit} />
        </TabsContent>
      </Tabs>

        {/* Chat de Suporte Profissional */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <MessageCircle className="h-5 w-5" />
              <span>Chat de Suporte</span>
            </CardTitle>
            <p className="text-sm text-orange-700">
              Atendimento em tempo real para dúvidas e suporte
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <ProfessionalSupportChat 
              orderId={selectedOrder?.id}
              clientName={selectedOrder?.clientName}
              clientEmail={selectedOrder?.clientEmail}
              clientPhone={selectedOrder?.clientPhone}
            />
          </CardContent>
        </Card>

        {/* Modal de Detalhes do Pedido */}
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onAssignProvider={handleAssignProvider}
          onUpdateStatus={handleUpdateStatus}
          mode={modalMode}
        />
      </PageWithBack>
    </AppShell>
  )
}