"use client"

import { useState, useEffect, useCallback } from 'react'
import { collection, query, orderBy, where, onSnapshot, doc, updateDoc, addDoc, deleteDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ChatConversation, ChatMessage, ChatStats, ChatFilter, AdminAction } from '@/types/chat'

export function useChatConversations(filter?: ChatFilter) {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!db) {
      setError('Firestore não inicializado')
      setLoading(false)
      return
    }

    let q = query(
      collection(db, 'chatConversations'),
      orderBy('updatedAt', 'desc')
    )

    // Aplicar filtros
    if (filter?.status) {
      q = query(q, where('status', '==', filter.status))
    }

    if (filter?.priority) {
      q = query(q, where('priority', '==', filter.priority))
    }

    if (filter?.monitoringLevel) {
      q = query(q, where('monitoringLevel', '==', filter.monitoringLevel))
    }

    if (filter?.assignedAdmin) {
      q = query(q, where('assignedAdmin', '==', filter.assignedAdmin))
    }

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          lastMessage: doc.data().lastMessage ? {
            ...doc.data().lastMessage,
            timestamp: doc.data().lastMessage.timestamp?.toDate() || new Date()
          } : undefined
        })) as ChatConversation[]

        // Aplicar filtros client-side para busca
        let filteredData = data
        if (filter?.searchTerm) {
          const searchLower = filter.searchTerm.toLowerCase()
          filteredData = data.filter(conv => 
            conv.clienteName.toLowerCase().includes(searchLower) ||
            conv.prestadorName.toLowerCase().includes(searchLower) ||
            conv.orderProtocol?.toLowerCase().includes(searchLower) ||
            conv.lastMessage?.content.toLowerCase().includes(searchLower)
          )
        }

        setConversations(filteredData)
        setLoading(false)
      },
      (err) => {
        console.error('Erro ao carregar conversas:', err)
        setError('Erro ao carregar conversas')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [filter])

  return { conversations, loading, error }
}

export function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!chatId || !db) {
      setMessages([])
      setLoading(false)
      return
    }

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
        console.error('Erro ao carregar mensagens:', err)
        setError('Erro ao carregar mensagens')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [chatId])

  return { messages, loading, error }
}

export function useChatStats() {
  const [stats, setStats] = useState<ChatStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!db) {
      setLoading(false)
      return
    }

    // Buscar conversas para calcular estatísticas
    const conversationsQuery = query(collection(db, 'chatConversations'))
    const messagesQuery = query(collection(db, 'chatMessages'))

    const unsubscribeConversations = onSnapshot(conversationsQuery, (conversationsSnapshot) => {
      const conversations = conversationsSnapshot.docs.map(doc => doc.data()) as ChatConversation[]

      // Buscar mensagens para completar as estatísticas
      const unsubscribeMessages = onSnapshot(messagesQuery, (messagesSnapshot) => {
        const messages = messagesSnapshot.docs.map(doc => doc.data()) as ChatMessage[]

        const newStats: ChatStats = {
          totalConversations: conversations.length,
          activeConversations: conversations.filter(c => c.status === 'active').length,
          closedConversations: conversations.filter(c => c.status === 'closed').length,
          blockedConversations: conversations.filter(c => c.status === 'blocked').length,
          totalMessages: messages.length,
          unreadMessages: conversations.reduce((sum, conv) => sum + conv.unreadCount.admin, 0),
          averageResponseTime: 0, // Implementar cálculo de tempo de resposta
          conversationsByPriority: {
            low: conversations.filter(c => c.priority === 'low').length,
            medium: conversations.filter(c => c.priority === 'medium').length,
            high: conversations.filter(c => c.priority === 'high').length,
            urgent: conversations.filter(c => c.priority === 'urgent').length,
          },
          messagesByType: {
            text: messages.filter(m => m.messageType === 'text').length,
            image: messages.filter(m => m.messageType === 'image').length,
            file: messages.filter(m => m.messageType === 'file').length,
            location: messages.filter(m => m.messageType === 'location').length,
            system: messages.filter(m => m.messageType === 'system').length,
          }
        }

        setStats(newStats)
        setLoading(false)
      })

      return unsubscribeMessages
    })

    return () => unsubscribeConversations()
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
