import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';

const router = Router();
const orderController = new OrderController();

// Rotas de pedidos
router.post('/orders', orderController.createOrder.bind(orderController));
router.get('/orders', orderController.getOrders.bind(orderController));
router.get('/orders/stats', orderController.getOrderStats.bind(orderController));
router.get('/orders/:id', orderController.getOrderById.bind(orderController));
router.put('/orders/:id/status', orderController.updateOrderStatus.bind(orderController));
router.put('/orders/:id/payment-status', orderController.updatePaymentStatus.bind(orderController));
router.delete('/orders/:id', orderController.cancelOrder.bind(orderController));

// Rotas de itens do pedido
router.post('/orders/:id/items', orderController.addItemToOrder.bind(orderController));
router.delete('/orders/:id/items/:itemId', orderController.removeItemFromOrder.bind(orderController));

// Rotas por cliente
router.get('/customers/:customerId/orders', orderController.getOrdersByCustomer.bind(orderController));

export default router;
