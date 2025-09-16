"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrdersDashboard } from "@/components/orders/orders-dashboard"
import { OrdersTable } from "@/components/orders/orders-table"
import { OrderDetailModal } from "@/components/orders/order-detail-modal"
import { SupportChat } from "@/components/orders/support-chat"
import { useOrders } from "@/hooks/use-orders"
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

export default function OrdersPage() {
  const { orders, stats, loading, error, updateOrder, deleteOrder, assignProvider, updateOrderStatus } = useOrders()
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Pedidos</h1>
          <p className="text-gray-600">Gerenciamento completo de pedidos e atendimento</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleNewOrder} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="todos" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Todos os Pedidos
          </TabsTrigger>
          <TabsTrigger value="pendentes" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pendentes
          </TabsTrigger>
          <TabsTrigger value="ativos" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Ativos
          </TabsTrigger>
          <TabsTrigger value="concluidos" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Concluídos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <OrdersDashboard />
        </TabsContent>

        <TabsContent value="todos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Pedidos</CardTitle>
              <p className="text-sm text-gray-600">
                Visualize e gerencie todos os pedidos do sistema
              </p>
            </CardHeader>
          </Card>
          <OrdersTable
            orders={orders}
            loading={loading}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAssignProvider={handleAssignProvider}
            onUpdateStatus={handleUpdateStatus}
            onView={handleView}
            onEdit={handleEdit}
          />
        </TabsContent>

        <TabsContent value="pendentes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Pendentes</CardTitle>
              <p className="text-sm text-gray-600">
                Pedidos aguardando atribuição de prestador
              </p>
            </CardHeader>
          </Card>
          <OrdersTable
            orders={getFilteredOrders('pending')}
            loading={loading}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAssignProvider={handleAssignProvider}
            onUpdateStatus={handleUpdateStatus}
            onView={handleView}
            onEdit={handleEdit}
          />
        </TabsContent>

        <TabsContent value="ativos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Ativos</CardTitle>
              <p className="text-sm text-gray-600">
                Pedidos atribuídos e em andamento
              </p>
            </CardHeader>
          </Card>
          <OrdersTable
            orders={getFilteredOrders('assigned').concat(getFilteredOrders('in_progress'))}
            loading={loading}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAssignProvider={handleAssignProvider}
            onUpdateStatus={handleUpdateStatus}
            onView={handleView}
            onEdit={handleEdit}
          />
        </TabsContent>

        <TabsContent value="concluidos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Concluídos</CardTitle>
              <p className="text-sm text-gray-600">
                Pedidos finalizados e avaliados
              </p>
            </CardHeader>
          </Card>
          <OrdersTable
            orders={getFilteredOrders('completed')}
            loading={loading}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAssignProvider={handleAssignProvider}
            onUpdateStatus={handleUpdateStatus}
            onView={handleView}
            onEdit={handleEdit}
          />
        </TabsContent>
      </Tabs>

      {/* Chat de Suporte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Chat de Suporte</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Atendimento em tempo real para clientes e prestadores
          </p>
        </CardHeader>
        <CardContent>
          <SupportChat 
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
    </div>
  )
}