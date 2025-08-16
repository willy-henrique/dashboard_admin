import { Order, IOrder, OrderItem } from '../models/Order';
import { db } from '../utils/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  limit,
  writeBatch
} from 'firebase/firestore';

export class OrderService {
  private collectionName = 'orders';

  // Criar novo pedido
  async createOrder(orderData: Omit<IOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    try {
      // Validar itens do pedido
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Pedido deve ter pelo menos um item');
      }

      // Verificar estoque dos produtos
      await this.validateStock(orderData.items);

      const order = new Order({
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Calcular total
      order.calculateTotal();

      const docRef = await addDoc(collection(db, this.collectionName), order);
      order.id = docRef.id;

      // Atualizar estoque dos produtos
      await this.updateProductStock(order.items, 'decrease');

      return order;
    } catch (error) {
      throw new Error(`Erro ao criar pedido: ${error}`);
    }
  }

  // Buscar pedido por ID
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return new Order({ id: docSnap.id, ...docSnap.data() });
      }
      return null;
    } catch (error) {
      throw new Error(`Erro ao buscar pedido: ${error}`);
    }
  }

  // Listar pedidos com filtros
  async getOrders(
    _page: number = 1,
    limitCount: number = 10,
    filters?: {
      status?: string;
      paymentStatus?: string;
      customerId?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<{ orders: Order[]; total: number; hasMore: boolean }> {
    try {
      let q = query(collection(db, this.collectionName), orderBy('createdAt', 'desc'));

      // Aplicar filtros
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.paymentStatus) {
        q = query(q, where('paymentStatus', '==', filters.paymentStatus));
      }
      if (filters?.customerId) {
        q = query(q, where('customerId', '==', filters.customerId));
      }
      if (filters?.startDate) {
        q = query(q, where('createdAt', '>=', filters.startDate));
      }
      if (filters?.endDate) {
        q = query(q, where('createdAt', '<=', filters.endDate));
      }

      // Aplicar paginação
      q = query(q, limit(limitCount));

      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];

      querySnapshot.forEach((doc) => {
        orders.push(new Order({ id: doc.id, ...doc.data() }));
      });

      return {
        orders,
        total: orders.length,
        hasMore: orders.length === limitCount
      };
    } catch (error) {
      throw new Error(`Erro ao listar pedidos: ${error}`);
    }
  }

  // Atualizar pedido
  async updateOrder(id: string, updateData: Partial<Omit<IOrder, 'id' | 'createdAt'>>): Promise<Order> {
    try {
      const order = await this.getOrderById(id);
      if (!order) {
        throw new Error('Pedido não encontrado');
      }

      // Atualizar propriedades
      Object.assign(order, updateData);
      order.updatedAt = new Date();

      // Recalcular total se itens foram alterados
      if (updateData.items) {
        order.calculateTotal();
      }

      await updateDoc(doc(db, this.collectionName, id), {
        ...updateData,
        updatedAt: order.updatedAt,
        total: order.total
      });

      return order;
    } catch (error) {
      throw new Error(`Erro ao atualizar pedido: ${error}`);
    }
  }

  // Atualizar status do pedido
  async updateOrderStatus(id: string, status: IOrder['status']): Promise<Order> {
    try {
      const order = await this.getOrderById(id);
      if (!order) {
        throw new Error('Pedido não encontrado');
      }

      order.updateStatus(status);

      await updateDoc(doc(db, this.collectionName, id), {
        status: order.status,
        updatedAt: order.updatedAt,
        completedAt: order.completedAt
      });

      return order;
    } catch (error) {
      throw new Error(`Erro ao atualizar status do pedido: ${error}`);
    }
  }

  // Atualizar status do pagamento
  async updatePaymentStatus(id: string, paymentStatus: IOrder['paymentStatus']): Promise<Order> {
    try {
      const order = await this.getOrderById(id);
      if (!order) {
        throw new Error('Pedido não encontrado');
      }

      order.updatePaymentStatus(paymentStatus);

      await updateDoc(doc(db, this.collectionName, id), {
        paymentStatus: order.paymentStatus,
        updatedAt: order.updatedAt
      });

      return order;
    } catch (error) {
      throw new Error(`Erro ao atualizar status do pagamento: ${error}`);
    }
  }

  // Adicionar item ao pedido
  async addItemToOrder(id: string, item: OrderItem): Promise<Order> {
    try {
      const order = await this.getOrderById(id);
      if (!order) {
        throw new Error('Pedido não encontrado');
      }

      // Verificar estoque
      await this.validateStock([item]);

      order.addItem(item);

      // Atualizar estoque
      await this.updateProductStock([item], 'decrease');

      await updateDoc(doc(db, this.collectionName, id), {
        items: order.items,
        total: order.total,
        updatedAt: order.updatedAt
      });

      return order;
    } catch (error) {
      throw new Error(`Erro ao adicionar item ao pedido: ${error}`);
    }
  }

  // Remover item do pedido
  async removeItemFromOrder(id: string, itemId: string): Promise<Order> {
    try {
      const order = await this.getOrderById(id);
      if (!order) {
        throw new Error('Pedido não encontrado');
      }

      const itemToRemove = order.items.find(item => item.id === itemId);
      if (!itemToRemove) {
        throw new Error('Item não encontrado no pedido');
      }

      order.removeItem(itemId);

      // Restaurar estoque
      await this.updateProductStock([itemToRemove], 'increase');

      await updateDoc(doc(db, this.collectionName, id), {
        items: order.items,
        total: order.total,
        updatedAt: order.updatedAt
      });

      return order;
    } catch (error) {
      throw new Error(`Erro ao remover item do pedido: ${error}`);
    }
  }

  // Cancelar pedido
  async cancelOrder(id: string, reason?: string): Promise<void> {
    try {
      const order = await this.getOrderById(id);
      if (!order) {
        throw new Error('Pedido não encontrado');
      }

      // Restaurar estoque dos produtos
      await this.updateProductStock(order.items, 'increase');

      order.updateStatus('cancelled');
      if (reason) {
        order.notes = reason;
      }

      await updateDoc(doc(db, this.collectionName, id), {
        status: order.status,
        notes: order.notes,
        updatedAt: order.updatedAt
      });
    } catch (error) {
      throw new Error(`Erro ao cancelar pedido: ${error}`);
    }
  }

  // Obter estatísticas de pedidos
  async getOrderStats(startDate?: Date, endDate?: Date): Promise<{
    total: number;
    totalRevenue: number;
    byStatus: Record<string, number>;
    byPaymentStatus: Record<string, number>;
    averageOrderValue: number;
  }> {
    try {
      const filters: any = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const result = await this.getOrders(1, 1000, filters);
      
      const stats = {
        total: result.orders.length,
        totalRevenue: 0,
        byStatus: {} as Record<string, number>,
        byPaymentStatus: {} as Record<string, number>,
        averageOrderValue: 0
      };

      result.orders.forEach(order => {
        if (order.paymentStatus === 'paid') {
          stats.totalRevenue += order.total;
        }
        stats.byStatus[order.status] = (stats.byStatus[order.status] || 0) + 1;
        stats.byPaymentStatus[order.paymentStatus] = (stats.byPaymentStatus[order.paymentStatus] || 0) + 1;
      });

      stats.averageOrderValue = stats.total > 0 ? stats.totalRevenue / stats.total : 0;

      return stats;
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas: ${error}`);
    }
  }

  // Validar estoque dos produtos
  private async validateStock(items: OrderItem[]): Promise<void> {
    for (const item of items) {
      const productRef = doc(db, 'products', item.productId);
      const productSnap = await getDoc(productRef);
      
      if (!productSnap.exists()) {
        throw new Error(`Produto ${item.productName} não encontrado`);
      }

      const productData = productSnap.data();
      if (productData['stock'] < item.quantity) {
        throw new Error(`Estoque insuficiente para ${item.productName}`);
      }
    }
  }

  // Atualizar estoque dos produtos
  private async updateProductStock(items: OrderItem[], operation: 'increase' | 'decrease'): Promise<void> {
    const batch = writeBatch(db);
    
    for (const item of items) {
      const productRef = doc(db, 'products', item.productId);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        const currentStock = productSnap.data()['stock'];
        const newStock = operation === 'increase' 
          ? currentStock + item.quantity 
          : currentStock - item.quantity;
        
        batch.update(productRef, { 
          stock: newStock,
          updatedAt: new Date()
        });
      }
    }
    
    await batch.commit();
  }
}
