import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { OrderItem } from '../models/Order';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  // Criar novo pedido
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { 
        customerId, 
        customerName, 
        customerEmail, 
        items, 
        paymentMethod, 
        shippingAddress, 
        billingAddress,
        notes 
      } = req.body;

      // Validações básicas
      if (!customerName || !customerEmail || !items || items.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Dados do cliente e itens são obrigatórios'
        });
        return;
      }

      // Validar itens
      for (const item of items) {
        if (!item.productId || !item.productName || !item.quantity || !item.unitPrice) {
          res.status(400).json({
            success: false,
            message: 'Dados incompletos nos itens do pedido'
          });
          return;
        }
      }

      const orderData = {
        customerId: customerId || '',
        customerName,
        customerEmail: customerEmail.toLowerCase(),
        items: items.map((item: any) => ({
          ...item,
          id: item.id || Math.random().toString(36).substr(2, 9),
          totalPrice: item.quantity * item.unitPrice
        })),
        total: 0, // Será calculado no serviço
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
        paymentMethod: paymentMethod || 'credit_card',
        shippingAddress,
        billingAddress,
        notes
      };

      const order = await this.orderService.createOrder(orderData);
      const publicData = order.getPublicData();

      res.status(201).json({
        success: true,
        message: 'Pedido criado com sucesso',
        data: publicData
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Buscar pedido por ID
  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID do pedido é obrigatório'
        });
        return;
      }

      const order = await this.orderService.getOrderById(id);
      
      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
        return;
      }

      const publicData = order.getPublicData();

      res.status(200).json({
        success: true,
        data: publicData
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Listar pedidos
  async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;
      const status = req.query['status'] as string;
      const paymentStatus = req.query['paymentStatus'] as string;
      const customerId = req.query['customerId'] as string;
      const startDate = req.query['startDate'] ? new Date(req.query['startDate'] as string) : undefined;
      const endDate = req.query['endDate'] ? new Date(req.query['endDate'] as string) : undefined;

      const filters: any = {};
      if (status) filters.status = status;
      if (paymentStatus) filters.paymentStatus = paymentStatus;
      if (customerId) filters.customerId = customerId;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const result = await this.orderService.getOrders(page, limit, filters);
      
      // Mascarar emails dos clientes
      const ordersWithMaskedEmails = result.orders.map(order => order.getPublicData());

      res.status(200).json({
        success: true,
        data: {
          orders: ordersWithMaskedEmails,
          pagination: {
            page,
            limit,
            total: result.total,
            hasMore: result.hasMore
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Atualizar status do pedido
  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID do pedido é obrigatório'
        });
        return;
      }

      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Status é obrigatório'
        });
        return;
      }

      const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Status inválido'
        });
        return;
      }

      await this.orderService.updateOrderStatus(id, status);

      res.status(200).json({
        success: true,
        message: `Status do pedido atualizado para ${status}`
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Atualizar status do pagamento
  async updatePaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID do pedido é obrigatório'
        });
        return;
      }

      if (!paymentStatus) {
        res.status(400).json({
          success: false,
          message: 'Status do pagamento é obrigatório'
        });
        return;
      }

      const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        res.status(400).json({
          success: false,
          message: 'Status do pagamento inválido'
        });
        return;
      }

      await this.orderService.updatePaymentStatus(id, paymentStatus);

      res.status(200).json({
        success: true,
        message: `Status do pagamento atualizado para ${paymentStatus}`
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Adicionar item ao pedido
  async addItemToOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { productId, productName, quantity, unitPrice } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID do pedido é obrigatório'
        });
        return;
      }

      if (!productId || !productName || !quantity || !unitPrice) {
        res.status(400).json({
          success: false,
          message: 'Todos os dados do item são obrigatórios'
        });
        return;
      }

      const item: OrderItem = {
        id: Math.random().toString(36).substr(2, 9),
        productId,
        productName,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice
      };

      await this.orderService.addItemToOrder(id, item);

      res.status(200).json({
        success: true,
        message: 'Item adicionado ao pedido com sucesso'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Remover item do pedido
  async removeItemFromOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id, itemId } = req.params;

      if (!id || !itemId) {
        res.status(400).json({
          success: false,
          message: 'ID do pedido e ID do item são obrigatórios'
        });
        return;
      }

      await this.orderService.removeItemFromOrder(id, itemId);

      res.status(200).json({
        success: true,
        message: 'Item removido do pedido com sucesso'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Cancelar pedido
  async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID do pedido é obrigatório'
        });
        return;
      }

      await this.orderService.cancelOrder(id, reason);

      res.status(200).json({
        success: true,
        message: 'Pedido cancelado com sucesso'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Obter estatísticas de pedidos
  async getOrderStats(req: Request, res: Response): Promise<void> {
    try {
      const startDate = req.query['startDate'] ? new Date(req.query['startDate'] as string) : undefined;
      const endDate = req.query['endDate'] ? new Date(req.query['endDate'] as string) : undefined;

      const stats = await this.orderService.getOrderStats(startDate, endDate);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Buscar pedidos por cliente
  async getOrdersByCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;

      if (!customerId) {
        res.status(400).json({
          success: false,
          message: 'ID do cliente é obrigatório'
        });
        return;
      }

      const result = await this.orderService.getOrders(page, limit, { customerId });
      
      // Mascarar emails dos clientes
      const ordersWithMaskedEmails = result.orders.map(order => order.getPublicData());

      res.status(200).json({
        success: true,
        data: {
          orders: ordersWithMaskedEmails,
          pagination: {
            page,
            limit,
            total: result.total,
            hasMore: result.hasMore
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }
}
