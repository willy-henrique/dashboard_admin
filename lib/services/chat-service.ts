import { getCollection, getDocument, addDocument, updateDocument, deleteDocument } from '../firestore'
import { where, orderBy, limit, Timestamp, query } from 'firebase/firestore'
import { db } from '../firebase'
import type { OrderData } from './firestore-analytics'
import type { ChatConversation, ChatMessage } from '@/types/chat'

export interface LegacyChatMessage {
  id: string
  sender: 'user' | 'support' | 'system'
  content: string
  timestamp: Date
  orderId?: string
  isRead: boolean
  clientId?: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
}

export interface LegacyChatConversation {
  id: string
  orderId: string
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  status: 'active' | 'closed' | 'archived' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Date
  updatedAt: Date
  lastMessage?: {
    content: string
    senderName: string
    timestamp: Date
    messageType: 'text' | 'image' | 'file' | 'location' | 'system'
  }
  unreadCount: {
    cliente: number
    prestador: number
    admin: number
  }
  source: 'legacy' | 'new'
  orderData?: OrderData
}

export class ChatService {
  // Buscar conversas do novo sistema
  static async getNewConversations(): Promise<ChatConversation[]> {
    try {
      const conversations = await getCollection('chatConversations')
      return conversations.map(doc => ({
        id: doc.id,
        ...doc,
        createdAt: doc.createdAt?.toDate() || new Date(),
        updatedAt: doc.updatedAt?.toDate() || new Date(),
        lastMessage: doc.lastMessage ? {
          ...doc.lastMessage,
          timestamp: doc.lastMessage.timestamp?.toDate() || new Date()
        } : undefined,
        unreadCount: doc.unreadCount || { cliente: 0, prestador: 0, admin: 0 },
        source: 'new' as const
      })) as ChatConversation[]
    } catch (error) {
      console.error('Erro ao buscar conversas do novo sistema:', error)
      return []
    }
  }

  // Buscar conversas dos pedidos existentes
  static async getLegacyConversations(): Promise<LegacyChatConversation[]> {
    try {
      const orders = await getCollection('orders')
      const legacyConversations: LegacyChatConversation[] = []

      for (const order of orders) {
        // Verificar se existe uma coleção de mensagens para este pedido
        const messagesCollection = `order_${order.id}_messages`
        
        try {
          const messages = await getCollection(messagesCollection)
          
          if (messages.length > 0) {
            // Converter para formato de conversa
            const lastMessage = messages[messages.length - 1]
            const unreadCount = messages.filter(msg => !msg.isRead).length
            
            const conversation: LegacyChatConversation = {
              id: `legacy_${order.id}`,
              orderId: order.id,
              clientId: order.clientId,
              clientName: order.clientName,
              clientEmail: order.clientEmail,
              clientPhone: order.phone,
              status: this.mapOrderStatusToChatStatus(order.status),
              priority: this.mapOrderPriorityToChatPriority(order.isEmergency ? 'urgent' : 'medium'),
              createdAt: order.createdAt?.toDate() || new Date(),
              updatedAt: lastMessage?.timestamp?.toDate() || order.createdAt?.toDate() || new Date(),
              lastMessage: lastMessage ? {
                content: lastMessage.content,
                senderName: this.mapSenderToName(lastMessage.sender),
                timestamp: lastMessage.timestamp?.toDate() || new Date(),
                messageType: 'text'
              } : undefined,
              unreadCount: {
                cliente: 0,
                prestador: 0,
                admin: unreadCount
              },
              source: 'legacy',
              orderData: order
            }
            
            legacyConversations.push(conversation)
          }
        } catch (error) {
          // Se não existe coleção de mensagens para este pedido, pular
          console.log(`Nenhuma mensagem encontrada para o pedido ${order.id}`)
        }
      }

      return legacyConversations
    } catch (error) {
      console.error('Erro ao buscar conversas legadas:', error)
      return []
    }
  }

  // Buscar conversas da coleção orders com subcoleção messages
  static async getOrdersWithMessagesConversations(): Promise<LegacyChatConversation[]> {
    try {
      const orders = await getCollection('orders')
      const conversations: LegacyChatConversation[] = []

      for (const order of orders) {
        try {
          // Buscar mensagens da subcoleção messages para este pedido
          const messages = await getCollection(`orders/${order.id}/messages`)
          
          const conversation: LegacyChatConversation = {
            id: `orders_${order.id}`,
            orderId: order.id,
            clientId: order.clientId || order.id,
            clientName: order.clientName || 'Cliente',
            clientEmail: order.clientEmail || '',
            clientPhone: order.phone || '',
            status: this.mapOrderStatusToChatStatus(order.status || 'active'),
            priority: order.isEmergency ? 'urgent' : 'medium',
            createdAt: order.createdAt?.toDate() || new Date(),
            updatedAt: messages.length > 0 
              ? (messages[messages.length - 1].timestamp?.toDate() || order.assignedAt?.toDate() || order.createdAt?.toDate() || new Date())
              : (order.assignedAt?.toDate() || order.createdAt?.toDate() || new Date()),
            lastMessage: messages.length > 0 ? {
              content: messages[messages.length - 1].content || `Pedido ${order.id} - ${order.description || 'Serviço solicitado'}`,
              senderName: messages[messages.length - 1].senderName || order.clientName || 'Cliente',
              timestamp: messages[messages.length - 1].timestamp?.toDate() || new Date(),
              messageType: messages[messages.length - 1].messageType || 'text'
            } : {
              content: `Pedido criado: ${order.description || 'Serviço solicitado'}`,
              senderName: order.clientName || 'Cliente',
              timestamp: order.createdAt?.toDate() || new Date(),
              messageType: 'text'
            },
            unreadCount: {
              cliente: 0,
              prestador: 0,
              admin: messages.filter(msg => !msg.isRead).length
            },
            source: 'legacy',
            orderData: order
          }
          
          conversations.push(conversation)
          
        } catch (error) {
          // Criar conversa mesmo sem mensagens
          const conversation: LegacyChatConversation = {
            id: `orders_${order.id}`,
            orderId: order.id,
            clientId: order.clientId || order.id,
            clientName: order.clientName || 'Cliente',
            clientEmail: order.clientEmail || '',
            clientPhone: order.phone || '',
            status: this.mapOrderStatusToChatStatus(order.status || 'active'),
            priority: order.isEmergency ? 'urgent' : 'medium',
            createdAt: order.createdAt?.toDate() || new Date(),
            updatedAt: order.assignedAt?.toDate() || order.createdAt?.toDate() || new Date(),
            lastMessage: {
              content: `Pedido criado: ${order.description || 'Serviço solicitado'}`,
              senderName: order.clientName || 'Cliente',
              timestamp: order.createdAt?.toDate() || new Date(),
              messageType: 'text'
            },
            unreadCount: {
              cliente: 0,
              prestador: 0,
              admin: 0
            },
            source: 'legacy',
            orderData: order
          }
          
          conversations.push(conversation)
        }
      }

      return conversations
    } catch (error) {
      console.error('❌ Erro ao buscar conversas dos pedidos com mensagens:', error)
      return []
    }
  }

  // Buscar conversas do chat de suporte
  static async getSupportChatConversations(): Promise<LegacyChatConversation[]> {
    try {
      const supportMessages = await getCollection('support_messages')
      const conversations: LegacyChatConversation[] = []
      
      // Agrupar mensagens por pedido
      const messagesByOrder: Record<string, any[]> = {}
      
      supportMessages.forEach(message => {
        const orderId = message.orderId || 'general'
        if (!messagesByOrder[orderId]) {
          messagesByOrder[orderId] = []
        }
        messagesByOrder[orderId].push(message)
      })

      // Converter para conversas
      for (const [orderId, messages] of Object.entries(messagesByOrder)) {
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1]
          const unreadCount = messages.filter(msg => !msg.isRead).length
          
          // Buscar dados do pedido se existir
          let orderData = null
          if (orderId !== 'general') {
            try {
              orderData = await getDocument('orders', orderId)
            } catch (error) {
              console.log(`Pedido ${orderId} não encontrado`)
            }
          }

          const conversation: LegacyChatConversation = {
            id: `support_${orderId}`,
            orderId: orderId === 'general' ? 'suporte-geral' : orderId,
            clientId: lastMessage.clientId || 'unknown',
            clientName: lastMessage.clientName || orderData?.clientName || 'Cliente',
            clientEmail: lastMessage.clientEmail || orderData?.clientEmail || '',
            clientPhone: lastMessage.clientPhone || orderData?.phone || '',
            status: 'active',
            priority: unreadCount > 0 ? 'high' : 'medium',
            createdAt: lastMessage.timestamp?.toDate() || new Date(),
            updatedAt: lastMessage.timestamp?.toDate() || new Date(),
            lastMessage: {
              content: lastMessage.content,
              senderName: this.mapSenderToName(lastMessage.sender),
              timestamp: lastMessage.timestamp?.toDate() || new Date(),
              messageType: 'text'
            },
            unreadCount: {
              cliente: 0,
              prestador: 0,
              admin: unreadCount
            },
            source: 'legacy',
            orderData
          }
          
          conversations.push(conversation)
        }
      }

      return conversations
    } catch (error) {
      console.error('Erro ao buscar conversas de suporte:', error)
      return []
    }
  }

  // Buscar todas as conversas (novas + legadas)
  static async getAllConversations(): Promise<LegacyChatConversation[]> {
    try {
      const [newConversations, legacyConversations, supportConversations, ordersWithMessages] = await Promise.all([
        this.getNewConversations(),
        this.getLegacyConversations(),
        this.getSupportChatConversations(),
        this.getOrdersWithMessagesConversations()
      ])

      // Converter conversas novas para o formato legado para compatibilidade
      const convertedNewConversations: LegacyChatConversation[] = newConversations.map(conv => ({
        id: conv.id,
        orderId: conv.orderId || conv.id,
        clientId: conv.clienteId,
        clientName: conv.clienteName,
        clientEmail: conv.clienteEmail,
        clientPhone: conv.clientePhone,
        status: conv.status,
        priority: conv.priority,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount,
        source: 'new'
      }))

      // Combinar e ordenar por data de atualização
      const allConversations = [
        ...convertedNewConversations,
        ...legacyConversations,
        ...supportConversations,
        ...ordersWithMessages
      ]

      return allConversations.sort((a, b) => 
        b.updatedAt.getTime() - a.updatedAt.getTime()
      )
    } catch (error) {
      console.error('Erro ao buscar todas as conversas:', error)
      return []
    }
  }

  // Buscar mensagens de uma conversa específica
  static async getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      console.log('🔍 Buscando mensagens para conversa:', conversationId)
      console.log('🔍 Firebase db disponível:', !!db)
      
      // Primeiro, tentar buscar da nova coleção
      const newMessages = await getCollection('chatMessages', [
        where('chatId', '==', conversationId),
        orderBy('timestamp', 'asc')
      ])

      console.log('📨 Mensagens da nova coleção:', newMessages.length)

      if (newMessages.length > 0) {
        const mappedMessages = newMessages.map(doc => ({
          id: doc.id,
          ...doc,
          timestamp: doc.timestamp?.toDate() || new Date(),
          readBy: doc.readBy || [],
          metadata: doc.metadata || {}
        })) as ChatMessage[]
        console.log('✅ Mensagens mapeadas da nova coleção:', mappedMessages)
        return mappedMessages
      }

      // Se não encontrar, tentar buscar das mensagens legadas
      if (conversationId.startsWith('legacy_')) {
        const orderId = conversationId.replace('legacy_', '')
        const messagesCollection = `order_${orderId}_messages`
        
        try {
          const legacyMessages = await getCollection(messagesCollection)
          return legacyMessages.map(doc => ({
            id: doc.id,
            chatId: conversationId,
            senderId: doc.clientId || 'unknown',
            senderName: this.mapSenderToName(doc.sender),
            senderType: this.mapSenderToType(doc.sender),
            content: doc.content,
            messageType: 'text' as const,
            timestamp: doc.timestamp?.toDate() || new Date(),
            isRead: doc.isRead || false,
            readBy: [],
            metadata: {}
          })) as ChatMessage[]
        } catch (error) {
          console.log(`Nenhuma mensagem encontrada para ${messagesCollection}`)
        }
      }

      // Se for conversa de suporte
      if (conversationId.startsWith('support_')) {
        const orderId = conversationId.replace('support_', '')
        const supportMessages = await getCollection('support_messages', [
          where('orderId', '==', orderId === 'suporte-geral' ? null : orderId),
          orderBy('timestamp', 'asc')
        ])

        return supportMessages.map(doc => ({
          id: doc.id,
          chatId: conversationId,
          senderId: doc.clientId || 'unknown',
          senderName: this.mapSenderToName(doc.sender),
          senderType: this.mapSenderToType(doc.sender),
          content: doc.content,
          messageType: 'text' as const,
          timestamp: doc.timestamp?.toDate() || new Date(),
          isRead: doc.isRead || false,
          readBy: [],
          metadata: {}
        })) as ChatMessage[]
      }

      // Se for conversa dos pedidos com mensagens
      if (conversationId.startsWith('orders_')) {
        const orderId = conversationId.replace('orders_', '')
        console.log('📦 Buscando mensagens do pedido:', orderId)
        const messages = await getCollection(`orders/${orderId}/messages`)
        console.log('📨 Mensagens encontradas no pedido:', messages.length, messages)

        const mappedMessages = messages.map(doc => ({
          id: doc.id,
          chatId: conversationId,
          senderId: doc.senderId || doc.clientId || 'unknown',
          senderName: doc.senderName || doc.clientName || 'Cliente',
          senderType: this.mapSenderToType(doc.sender || 'user'),
          content: doc.content || 'Mensagem',
          messageType: doc.messageType || 'text' as const,
          timestamp: doc.timestamp?.toDate() || doc.createdAt?.toDate() || new Date(),
          isRead: doc.isRead || false,
          readBy: doc.readBy || [],
          metadata: doc.metadata || {}
        })) as ChatMessage[]
        
        console.log('✅ Mensagens mapeadas do pedido:', mappedMessages)
        return mappedMessages
      }

      return []
    } catch (error) {
      console.error('Erro ao buscar mensagens da conversa:', error)
      return []
    }
  }

  // Métodos auxiliares para mapeamento
  private static mapOrderStatusToChatStatus(orderStatus: string): LegacyChatConversation['status'] {
    switch (orderStatus) {
      case 'completed':
        return 'closed'
      case 'cancelled':
        return 'blocked'
      default:
        return 'active'
    }
  }

  private static mapOrderPriorityToChatPriority(orderPriority: string): LegacyChatConversation['priority'] {
    switch (orderPriority) {
      case 'urgent':
        return 'urgent'
      case 'high':
        return 'high'
      case 'medium':
        return 'medium'
      case 'low':
        return 'low'
      default:
        return 'medium'
    }
  }

  private static mapSenderToName(sender: string): string {
    switch (sender) {
      case 'user':
        return 'Cliente'
      case 'support':
        return 'Suporte'
      case 'system':
        return 'Sistema'
      default:
        return 'Usuário'
    }
  }

  private static mapSenderToType(sender: string): ChatMessage['senderType'] {
    switch (sender) {
      case 'user':
        return 'cliente'
      case 'support':
        return 'admin'
      case 'system':
        return 'admin'
      default:
        return 'cliente'
    }
  }
}
