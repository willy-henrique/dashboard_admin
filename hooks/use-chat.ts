"use client"

import { useState, useEffect, useCallback } from 'react'
import { collection, query, orderBy, where, onSnapshot, doc, updateDoc, addDoc, deleteDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ChatConversation, ChatMessage, ChatStats, ChatFilter, AdminAction } from '@/types/chat'
import { ChatService, LegacyChatConversation } from '@/lib/services/chat-service'

export function useChatConversations(filter?: ChatFilter) {
  const [conversations, setConversations] = useState<LegacyChatConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        console.log('🚀 Iniciando busca de conversas...')
        setLoading(true)
        setError(null)
        
        // Buscar todas as conversas (novas + legadas)
        console.log('📞 Chamando ChatService.getAllConversations()...')
        const allConversations = await ChatService.getAllConversations()
        console.log(`📊 Conversas encontradas: ${allConversations.length}`)
        
        // Log das conversas encontradas
        allConversations.forEach((conv, index) => {
          console.log(`💬 Conversa ${index + 1}: ${conv.clientName} (${conv.orderId})`)
        })
        
        // Aplicar filtros
        let filteredConversations = allConversations
        console.log(`🔍 Aplicando filtros... Filtros ativos:`, filter)

        if (filter?.status) {
          filteredConversations = filteredConversations.filter(conv => conv.status === filter.status)
          console.log(`📋 Filtro por status ${filter.status}: ${filteredConversations.length} conversas`)
        }

        if (filter?.priority) {
          filteredConversations = filteredConversations.filter(conv => conv.priority === filter.priority)
          console.log(`⚡ Filtro por prioridade ${filter.priority}: ${filteredConversations.length} conversas`)
        }

        if (filter?.searchTerm) {
          const searchLower = filter.searchTerm.toLowerCase()
          filteredConversations = filteredConversations.filter(conv => 
            conv.clientName.toLowerCase().includes(searchLower) ||
            conv.clientEmail.toLowerCase().includes(searchLower) ||
            conv.orderId.toLowerCase().includes(searchLower) ||
            conv.lastMessage?.content.toLowerCase().includes(searchLower)
          )
          console.log(`🔎 Filtro por busca "${filter.searchTerm}": ${filteredConversations.length} conversas`)
        }

        if (filter?.hasUnread) {
          filteredConversations = filteredConversations.filter(conv => conv.unreadCount.admin > 0)
          console.log(`📬 Filtro por não lidas: ${filteredConversations.length} conversas`)
        }

        console.log(`✅ Total final de conversas: ${filteredConversations.length}`)
        setConversations(filteredConversations)
      } catch (err) {
        console.error('❌ Erro ao carregar conversas:', err)
        setError('Erro ao carregar conversas')
      } finally {
        setLoading(false)
        console.log('🏁 Busca de conversas finalizada')
      }
    }

    fetchConversations()

    // Configurar listener em tempo real para novas conversas
    if (db) {
      const unsubscribeChat = onSnapshot(
        collection(db, 'chatConversations'),
        () => {
          // Recarregar conversas quando houver mudanças
          fetchConversations()
        },
        (err) => {
          console.error('Erro no listener de conversas:', err)
        }
      )

      const unsubscribeOrders = onSnapshot(
        collection(db, 'orders'),
        () => {
          // Recarregar conversas quando houver mudanças na coleção orders
          fetchConversations()
        },
        (err) => {
          console.error('Erro no listener de orders:', err)
        }
      )

      return () => {
        unsubscribeChat()
        unsubscribeOrders()
      }
    }
  }, [filter])

  return { conversations, loading, error }
}

export function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) {
        setMessages([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // Buscar mensagens usando o serviço unificado
        const conversationMessages = await ChatService.getConversationMessages(chatId)
        setMessages(conversationMessages)
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err)
        setError('Erro ao carregar mensagens')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Para conversas do novo sistema, configurar listener em tempo real
    if (chatId && !chatId.startsWith('legacy_') && !chatId.startsWith('support_') && !chatId.startsWith('orders_') && db) {
      const q = query(
        collection(db, 'chatMessages'),
        where('chatId', '==', chatId),
        orderBy('timestamp', 'asc')
      )

      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
            readBy: doc.data().readBy || [],
            metadata: doc.data().metadata || {}
          })) as ChatMessage[]

          setMessages(data.filter(msg => !msg.isDeleted))
          setLoading(false)
        },
        (err) => {
          console.error('Erro no listener de mensagens:', err)
          setLoading(false)
        }
      )

      return () => unsubscribe()
    }
  }, [chatId])

  return { messages, loading, error }
}

export function useChatStats() {
  const [stats, setStats] = useState<ChatStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('📊 Calculando estatísticas do chat...')
        setLoading(true)
        
        // Buscar todas as conversas usando o serviço
        const allConversations = await ChatService.getAllConversations()
        console.log(`📈 Conversas para estatísticas: ${allConversations.length}`)
        
        // Calcular estatísticas
        const newStats: ChatStats = {
          totalConversations: allConversations.length,
          activeConversations: allConversations.filter(c => c.status === 'active').length,
          closedConversations: allConversations.filter(c => c.status === 'closed').length,
          blockedConversations: allConversations.filter(c => c.status === 'blocked').length,
          totalMessages: allConversations.reduce((sum, conv) => sum + (conv.lastMessage ? 1 : 0), 0),
          unreadMessages: allConversations.reduce((sum, conv) => sum + conv.unreadCount.admin, 0),
          averageResponseTime: 0, // Implementar cálculo de tempo de resposta
          conversationsByPriority: {
            low: allConversations.filter(c => c.priority === 'low').length,
            medium: allConversations.filter(c => c.priority === 'medium').length,
            high: allConversations.filter(c => c.priority === 'high').length,
            urgent: allConversations.filter(c => c.priority === 'urgent').length,
          },
          messagesByType: {
            text: allConversations.filter(c => c.lastMessage?.messageType === 'text').length,
            image: allConversations.filter(c => c.lastMessage?.messageType === 'image').length,
            file: allConversations.filter(c => c.lastMessage?.messageType === 'file').length,
            location: allConversations.filter(c => c.lastMessage?.messageType === 'location').length,
            system: allConversations.filter(c => c.lastMessage?.messageType === 'system').length,
          }
        }

        console.log('📊 Estatísticas calculadas:', newStats)
        setStats(newStats)
        setLoading(false)
      } catch (error) {
        console.error('❌ Erro ao calcular estatísticas:', error)
        setLoading(false)
      }
    }

    fetchStats()

    // Configurar listener para atualizações em tempo real
    if (db) {
      const unsubscribeOrders = onSnapshot(
        collection(db, 'orders'),
        () => {
          console.log('🔄 Atualizando estatísticas...')
          fetchStats()
        },
        (err) => {
          console.error('Erro no listener de estatísticas:', err)
        }
      )

      return () => unsubscribeOrders()
    }
  }, [])

  return { stats, loading }
}

export function useChatActions() {
  const [loading, setLoading] = useState(false)

  const updateConversationStatus = useCallback(async (chatId: string, status: ChatConversation['status']) => {
    if (!db) return false

    setLoading(true)
    try {
      await updateDoc(doc(db, 'chatConversations', chatId), {
        status,
        updatedAt: Timestamp.now()
      })
      return true
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateConversationPriority = useCallback(async (chatId: string, priority: ChatConversation['priority']) => {
    if (!db) return false

    setLoading(true)
    try {
      await updateDoc(doc(db, 'chatConversations', chatId), {
        priority,
        updatedAt: Timestamp.now()
      })
      return true
    } catch (error) {
      console.error('Erro ao atualizar prioridade:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const assignConversation = useCallback(async (chatId: string, adminId: string, adminName: string) => {
    if (!db) return false

    setLoading(true)
    try {
      await updateDoc(doc(db, 'chatConversations', chatId), {
        assignedAdmin: adminId,
        updatedAt: Timestamp.now()
      })

      // Registrar ação do admin
      await addDoc(collection(db, 'adminActions'), {
        chatId,
        adminId,
        adminName,
        action: 'assign',
        details: `Conversa atribuída para ${adminName}`,
        timestamp: Timestamp.now()
      })

      return true
    } catch (error) {
      console.error('Erro ao atribuir conversa:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addConversationNote = useCallback(async (chatId: string, note: string, adminId: string, adminName: string) => {
    if (!db) return false

    setLoading(true)
    try {
      const conversationRef = doc(db, 'chatConversations', chatId)
      const conversationDoc = await conversationRef.get()
      const currentNotes = conversationDoc.data()?.notes || ''
      const newNotes = currentNotes ? `${currentNotes}\n\n[${new Date().toLocaleString()}] ${adminName}: ${note}` : `[${new Date().toLocaleString()}] ${adminName}: ${note}`

      await updateDoc(conversationRef, {
        notes: newNotes,
        updatedAt: Timestamp.now()
      })

      // Registrar ação do admin
      await addDoc(collection(db, 'adminActions'), {
        chatId,
        adminId,
        adminName,
        action: 'note_add',
        details: note,
        timestamp: Timestamp.now()
      })

      return true
    } catch (error) {
      console.error('Erro ao adicionar nota:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteMessage = useCallback(async (messageId: string, adminId: string, adminName: string) => {
    if (!db) return false

    setLoading(true)
    try {
      const messageRef = doc(db, 'chatMessages', messageId)
      const messageDoc = await messageRef.get()
      const messageData = messageDoc.data()

      await updateDoc(messageRef, {
        isDeleted: true,
        deletedAt: Timestamp.now(),
        deletedBy: adminId
      })

      // Registrar ação do admin
      await addDoc(collection(db, 'adminActions'), {
        chatId: messageData?.chatId,
        adminId,
        adminName,
        action: 'message_delete',
        details: `Mensagem deletada: "${messageData?.content?.substring(0, 50)}..."`,
        timestamp: Timestamp.now()
      })

      return true
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    updateConversationStatus,
    updateConversationPriority,
    assignConversation,
    addConversationNote,
    deleteMessage
  }
}
