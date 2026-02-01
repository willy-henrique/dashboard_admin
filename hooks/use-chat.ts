"use client"

import { useState, useEffect, useCallback } from 'react'
import { collection, query, orderBy, where, onSnapshot, doc, updateDoc, addDoc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ChatConversation, ChatMessage, ChatStats, ChatFilter } from '@/types/chat'
import { ChatService, LegacyChatConversation } from '@/lib/services/chat-service'

export function useChatConversations(filter?: ChatFilter) {
  const [conversations, setConversations] = useState<LegacyChatConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // Carregar apenas uma vez
    if (hasLoaded) return
    
    const fetchConversations = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Buscar todas as conversas (novas + legadas)
        const allConversations = await ChatService.getAllConversations()
        
        // Aplicar filtros
        let filteredConversations = allConversations

        if (filter?.status) {
          filteredConversations = filteredConversations.filter(conv => conv.status === filter.status)
        }

        if (filter?.priority) {
          filteredConversations = filteredConversations.filter(conv => conv.priority === filter.priority)
        }

        if (filter?.searchTerm?.trim()) {
          const searchLower = filter.searchTerm.trim().toLowerCase()
          filteredConversations = filteredConversations.filter(conv => 
            conv.clientName?.toLowerCase().includes(searchLower) ||
            conv.clientEmail?.toLowerCase().includes(searchLower) ||
            conv.orderId?.toLowerCase().includes(searchLower) ||
            (conv as { orderProtocol?: string }).orderProtocol?.toLowerCase().includes(searchLower) ||
            conv.lastMessage?.content?.toLowerCase().includes(searchLower)
          )
        }

        if (filter?.hasUnread) {
          filteredConversations = filteredConversations.filter(conv => conv.unreadCount.admin > 0)
        }

        setConversations(filteredConversations)
        setHasLoaded(true)
      } catch {
        setError('Erro ao carregar conversas')
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [filter, hasLoaded])

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
      } catch {
        setError('Erro ao carregar mensagens')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Listener em tempo real: novo sistema (chatMessages) ou orders (orders/{orderId}/messages)
    if (chatId && db) {
      if (chatId.startsWith('orders_')) {
        const orderId = chatId.replace('orders_', '')
        const messagesRef = collection(db, 'orders', orderId, 'messages')
        const q = query(messagesRef, orderBy('timestamp', 'asc'))

        const unsubscribe = onSnapshot(q,
          (snapshot) => {
            const data = snapshot.docs.map(d => {
              const docData = d.data()
              const content = docData.message ?? docData.content ?? ''
              return {
                id: d.id,
                chatId,
                senderId: docData.senderId || docData.clientId || 'unknown',
                senderName: docData.senderName || docData.clientName || 'Cliente',
                senderType: (['client','cliente'].includes(String(docData.senderType||'').toLowerCase()) ? 'cliente' :
                  ['provider','prestador'].includes(String(docData.senderType||'').toLowerCase()) ? 'prestador' : 'cliente') as ChatMessage['senderType'],
                content: content || '(mensagem vazia)',
                messageType: (docData.messageType || 'text') as const,
                timestamp: docData.timestamp?.toDate?.() || new Date(),
                isRead: docData.isRead ?? false,
                readBy: docData.readBy || [],
                metadata: { ...docData.metadata, imageUrl: docData.imageUrl, documentUrl: docData.documentUrl }
              }
            }) as ChatMessage[]
            setMessages(data)
            setLoading(false)
          },
          () => setLoading(false)
        )
        return () => unsubscribe()
      }

      if (!chatId.startsWith('legacy_') && !chatId.startsWith('support_')) {
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
          () => setLoading(false)
        )
        return () => unsubscribe()
      }
    }
  }, [chatId])

  return { messages, loading, error }
}

export function useChatStats() {
  const [stats, setStats] = useState<ChatStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // Carregar apenas uma vez
    if (hasLoaded) return
    
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Buscar todas as conversas usando o serviço
        const allConversations = await ChatService.getAllConversations()
        
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

        setStats(newStats)
        setHasLoaded(true)
      } catch (error) {
        console.error('❌ Erro ao calcular estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [hasLoaded])

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
    } catch {
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
    } catch {
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
      const conversationDoc = await getDoc(conversationRef)
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
      const messageDoc = await getDoc(messageRef)
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
    } catch {
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
