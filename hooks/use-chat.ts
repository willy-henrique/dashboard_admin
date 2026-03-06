"use client"

import { useCallback, useEffect, useState } from "react"
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, Timestamp, updateDoc, where, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ChatConversation, ChatMessage, ChatStats, ChatFilter } from "@/types/chat"
import { ChatService, LegacyChatConversation } from "@/lib/services/chat-service"

const CHAT_REFRESH_INTERVAL_MS = 15000

function applyConversationFilter(
  conversations: LegacyChatConversation[],
  filter?: ChatFilter
): LegacyChatConversation[] {
  let filtered = [...conversations]

  if (filter?.status) {
    filtered = filtered.filter((conversation) => conversation.status === filter.status)
  }

  if (filter?.priority) {
    filtered = filtered.filter((conversation) => conversation.priority === filter.priority)
  }

  if (filter?.searchTerm?.trim()) {
    const searchLower = filter.searchTerm.trim().toLowerCase()
    filtered = filtered.filter((conversation) =>
      conversation.clientName?.toLowerCase().includes(searchLower) ||
      conversation.clientEmail?.toLowerCase().includes(searchLower) ||
      conversation.orderId?.toLowerCase().includes(searchLower) ||
      conversation.orderProtocol?.toLowerCase().includes(searchLower) ||
      conversation.lastMessage?.content?.toLowerCase().includes(searchLower) ||
      conversation.assignedAdmin?.toLowerCase().includes(searchLower)
    )
  }

  if (filter?.hasUnread) {
    filtered = filtered.filter((conversation) => conversation.unreadCount.admin > 0)
  }

  return filtered
}

function buildChatStats(conversations: LegacyChatConversation[]): ChatStats {
  return {
    totalConversations: conversations.length,
    activeConversations: conversations.filter((conversation) => conversation.status === "active").length,
    closedConversations: conversations.filter((conversation) => conversation.status === "closed").length,
    blockedConversations: conversations.filter((conversation) => conversation.status === "blocked").length,
    totalMessages: conversations.reduce((sum, conversation) => sum + (conversation.messageCount || (conversation.lastMessage ? 1 : 0)), 0),
    unreadMessages: conversations.reduce((sum, conversation) => sum + conversation.unreadCount.admin, 0),
    averageResponseTime: 0,
    conversationsByPriority: {
      low: conversations.filter((conversation) => conversation.priority === "low").length,
      medium: conversations.filter((conversation) => conversation.priority === "medium").length,
      high: conversations.filter((conversation) => conversation.priority === "high").length,
      urgent: conversations.filter((conversation) => conversation.priority === "urgent").length,
    },
    messagesByType: {
      text: conversations.filter((conversation) => conversation.lastMessage?.messageType === "text").length,
      image: conversations.filter((conversation) => conversation.lastMessage?.messageType === "image").length,
      file: conversations.filter((conversation) => conversation.lastMessage?.messageType === "file").length,
      location: conversations.filter((conversation) => conversation.lastMessage?.messageType === "location").length,
      system: conversations.filter((conversation) => conversation.lastMessage?.messageType === "system").length,
    },
  }
}

export function useChatConversations(filter?: ChatFilter) {
  const [conversations, setConversations] = useState<LegacyChatConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const filterSnapshot = JSON.stringify(filter ?? {})

  const fetchConversations = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
      }
      setError(null)

      const allConversations = await ChatService.getAllConversations()
      setConversations(applyConversationFilter(allConversations, filter))
    } catch {
      setError("Erro ao carregar conversas")
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }, [filterSnapshot])

  useEffect(() => {
    let isActive = true

    const run = async () => {
      try {
        setLoading(true)
        setError(null)
        const allConversations = await ChatService.getAllConversations()
        if (!isActive) {
          return
        }
        setConversations(applyConversationFilter(allConversations, filter))
      } catch {
        if (isActive) {
          setError("Erro ao carregar conversas")
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    run()
    const intervalId = window.setInterval(() => {
      fetchConversations(true)
    }, CHAT_REFRESH_INTERVAL_MS)

    return () => {
      isActive = false
      window.clearInterval(intervalId)
    }
  }, [fetchConversations])

  return { conversations, loading, error, refresh: () => fetchConversations() }
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
        const conversationMessages = await ChatService.getConversationMessages(chatId)
        setMessages(conversationMessages)
      } catch {
        setError("Erro ao carregar mensagens")
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    if (!chatId) {
      return
    }

    if (chatId.startsWith("legacy_") || chatId.startsWith("support_")) {
      const intervalId = window.setInterval(() => {
        fetchMessages()
      }, CHAT_REFRESH_INTERVAL_MS)

      return () => window.clearInterval(intervalId)
    }

    if (!db) {
      return
    }

    if (chatId.startsWith("orders_")) {
      const orderId = chatId.replace("orders_", "")
      const messagesRef = collection(db, "orders", orderId, "messages")
      const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"))

      const unsubscribe = onSnapshot(
        messagesQuery,
        (snapshot) => {
          const data = snapshot.docs
            .map((snapshotDoc) => {
              const message = snapshotDoc.data()
              if (message.isDeleted) {
                return null
              }

              const imageUrl = message.imageUrl ?? message.image_url ?? message.mediaUrl ?? message.attachmentUrl ?? message.photoUrl ?? message.metadata?.imageUrl
              const documentUrl = message.documentUrl ?? message.fileUrl ?? message.metadata?.documentUrl

              return {
                id: snapshotDoc.id,
                chatId,
                senderId: message.senderId || message.clientId || "unknown",
                senderName: message.senderName || message.clientName || "Cliente",
                senderType:
                  ["provider", "prestador"].includes(String(message.senderType || "").toLowerCase())
                    ? "prestador"
                    : ["admin", "support", "system"].includes(String(message.senderType || "").toLowerCase())
                      ? "admin"
                      : "cliente",
                content: message.message ?? message.content ?? "",
                messageType: (message.messageType || "text") as ChatMessage["messageType"],
                timestamp: message.timestamp?.toDate?.() || new Date(),
                isRead: message.isRead ?? false,
                readBy: message.readBy || [],
                metadata: { ...message.metadata, imageUrl, documentUrl },
              } as ChatMessage
            })
            .filter(Boolean) as ChatMessage[]

          setMessages(data)
          setLoading(false)
        },
        () => setLoading(false)
      )

      return () => unsubscribe()
    }

    if (!chatId.startsWith("legacy_") && !chatId.startsWith("support_")) {
      const messagesQuery = query(collection(db, "chatMessages"), where("chatId", "==", chatId), orderBy("timestamp", "asc"))

      const unsubscribe = onSnapshot(
        messagesQuery,
        (snapshot) => {
          const data = snapshot.docs
            .map((snapshotDoc) => {
              const message = snapshotDoc.data()
              if (message.isDeleted) {
                return null
              }

              return {
                id: snapshotDoc.id,
                ...message,
                timestamp: message.timestamp?.toDate?.() || new Date(),
                readBy: message.readBy || [],
                metadata: message.metadata || {},
              } as ChatMessage
            })
            .filter(Boolean) as ChatMessage[]

          setMessages(data)
          setLoading(false)
        },
        () => setLoading(false)
      )

      return () => unsubscribe()
    }
  }, [chatId])

  return { messages, loading, error }
}

export function useChatStats() {
  const [stats, setStats] = useState<ChatStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
      }
      const allConversations = await ChatService.getAllConversations()
      setStats(buildChatStats(allConversations))
    } catch (error) {
      console.error("Erro ao calcular estatisticas:", error)
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const intervalId = window.setInterval(() => {
      fetchStats(true)
    }, CHAT_REFRESH_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [fetchStats])

  return { stats, loading, refresh: () => fetchStats() }
}

function resolveMessageDocumentRef(message: Pick<ChatMessage, "id" | "chatId">) {
  if (!db) {
    return null
  }

  if (message.chatId.startsWith("orders_")) {
    const orderId = message.chatId.replace("orders_", "")
    return doc(db, "orders", orderId, "messages", message.id)
  }

  if (message.chatId.startsWith("legacy_")) {
    const orderId = message.chatId.replace("legacy_", "")
    return doc(db, `order_${orderId}_messages`, message.id)
  }

  if (message.chatId.startsWith("support_")) {
    return doc(db, "support_messages", message.id)
  }

  return doc(db, "chatMessages", message.id)
}

export function useChatActions() {
  const [loading, setLoading] = useState(false)

  const upsertConversationMonitoring = useCallback(async (chatId: string, data: Record<string, unknown>) => {
    if (!db) {
      return false
    }

    await setDoc(
      doc(db, "chatMonitoring", chatId),
      {
        ...data,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    )

    return true
  }, [])

  const logAdminAction = useCallback(async (payload: Record<string, unknown>) => {
    if (!db) {
      return
    }

    await addDoc(collection(db, "adminActions"), {
      ...payload,
      timestamp: Timestamp.now(),
    })
  }, [])

  const updateConversationStatus = useCallback(async (chatId: string, status: ChatConversation["status"]) => {
    if (!db) return false

    setLoading(true)
    try {
      await upsertConversationMonitoring(chatId, { status })
      await logAdminAction({
        chatId,
        adminId: "admin",
        adminName: "Administrador",
        action: status === "blocked" ? "block" : status === "archived" ? "archive" : "unassign",
        details: `Status alterado para ${status}`,
      })
      return true
    } catch {
      return false
    } finally {
      setLoading(false)
    }
  }, [logAdminAction, upsertConversationMonitoring])

  const updateConversationPriority = useCallback(async (chatId: string, priority: ChatConversation["priority"]) => {
    if (!db) return false

    setLoading(true)
    try {
      await upsertConversationMonitoring(chatId, { priority })
      await logAdminAction({
        chatId,
        adminId: "admin",
        adminName: "Administrador",
        action: "priority_change",
        details: `Prioridade alterada para ${priority}`,
      })
      return true
    } catch (error) {
      console.error("Erro ao atualizar prioridade:", error)
      return false
    } finally {
      setLoading(false)
    }
  }, [logAdminAction, upsertConversationMonitoring])

  const assignConversation = useCallback(async (chatId: string, adminId: string, adminName: string) => {
    if (!db) return false

    setLoading(true)
    try {
      await upsertConversationMonitoring(chatId, {
        assignedAdmin: adminName || adminId,
      })

      await logAdminAction({
        chatId,
        adminId,
        adminName,
        action: "assign",
        details: `Conversa atribuida para ${adminName}`,
      })

      return true
    } catch {
      return false
    } finally {
      setLoading(false)
    }
  }, [logAdminAction, upsertConversationMonitoring])

  const addConversationNote = useCallback(async (chatId: string, note: string, adminId: string, adminName: string) => {
    if (!db) return false

    setLoading(true)
    try {
      const monitoringRef = doc(db, "chatMonitoring", chatId)
      const monitoringDoc = await getDoc(monitoringRef)
      const currentNotes = typeof monitoringDoc.data()?.notes === "string" ? monitoringDoc.data()?.notes : ""
      const newEntry = `[${new Date().toLocaleString("pt-BR")}] ${adminName}: ${note}`
      const notes = currentNotes ? `${currentNotes}\n\n${newEntry}` : newEntry

      await upsertConversationMonitoring(chatId, { notes })
      await logAdminAction({
        chatId,
        adminId,
        adminName,
        action: "note_add",
        details: note,
      })

      return true
    } catch (error) {
      console.error("Erro ao adicionar nota:", error)
      return false
    } finally {
      setLoading(false)
    }
  }, [logAdminAction, upsertConversationMonitoring])

  const deleteMessage = useCallback(async (message: Pick<ChatMessage, "id" | "chatId" | "content">, adminId: string, adminName: string) => {
    if (!db) return false

    const messageRef = resolveMessageDocumentRef(message)
    if (!messageRef) {
      return false
    }

    setLoading(true)
    try {
      const messageDoc = await getDoc(messageRef)
      if (!messageDoc.exists()) {
        return false
      }

      await updateDoc(messageRef, {
        isDeleted: true,
        deletedAt: Timestamp.now(),
        deletedBy: adminId,
      })

      await logAdminAction({
        chatId: message.chatId,
        adminId,
        adminName,
        action: "message_delete",
        details: `Mensagem deletada: \"${message.content.substring(0, 50)}\"`,
      })

      return true
    } catch {
      return false
    } finally {
      setLoading(false)
    }
  }, [logAdminAction])

  return {
    loading,
    updateConversationStatus,
    updateConversationPriority,
    assignConversation,
    addConversationNote,
    deleteMessage,
  }
}
