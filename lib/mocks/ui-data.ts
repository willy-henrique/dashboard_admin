import type { AdminAction } from "@/types/chat"

export interface SupportMockMessage {
  id: string
  sender: "user" | "support" | "system"
  content: string
  timestamp: Date
  orderId?: string
  isRead: boolean
}

export interface SecurityAuditLog {
  id: string
  action: string
  user: string
  timestamp: string
  ip: string
  status: "success" | "failed"
}

export function getMockAdminLogs(): AdminAction[] {
  return [
    {
      id: "log-1",
      chatId: "chat-1",
      adminId: "admin-1",
      adminName: "Administrador",
      action: "priority_change",
      details: "Prioridade alterada de Media para Alta",
      timestamp: new Date(Date.now() - 35 * 60 * 1000),
      metadata: { oldPriority: "medium", newPriority: "high" },
    },
    {
      id: "log-2",
      chatId: "chat-2",
      adminId: "admin-2",
      adminName: "Moderador",
      action: "block",
      details: "Conversa bloqueada por linguagem inadequada",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "log-3",
      chatId: "chat-1",
      adminId: "admin-1",
      adminName: "Administrador",
      action: "note_add",
      details: "Cliente relatou atraso na chegada do prestador",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: "log-4",
      chatId: "chat-3",
      adminId: "admin-2",
      adminName: "Moderador",
      action: "assign",
      details: "Conversa atribuida para investigacao",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: "log-5",
      chatId: "chat-2",
      adminId: "admin-1",
      adminName: "Administrador",
      action: "message_delete",
      details: "Mensagem removida por violacao de politica",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
  ]
}

export function getMockSupportMessages(orderId?: string): SupportMockMessage[] {
  const fallbackOrder = orderId || "ORD-001"

  return [
    {
      id: "support-msg-1",
      sender: "user",
      content: `Ola, gostaria de saber o status do meu pedido ${fallbackOrder}`,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      orderId: fallbackOrder,
      isRead: true,
    },
    {
      id: "support-msg-2",
      sender: "support",
      content: "Ola! Estou verificando o status para voce agora.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 45 * 1000),
      isRead: true,
    },
    {
      id: "support-msg-3",
      sender: "system",
      content: `Atualizacao: o pedido ${fallbackOrder} esta em andamento e o prestador esta a caminho.`,
      timestamp: new Date(Date.now() - 75 * 60 * 1000),
      orderId: fallbackOrder,
      isRead: false,
    },
  ]
}

export function getMockSecurityAuditLogs(): SecurityAuditLog[] {
  return [
    {
      id: "audit-1",
      action: "Login",
      user: "admin@appservico.com",
      timestamp: "2026-03-06 14:30:25",
      ip: "192.168.1.100",
      status: "success",
    },
    {
      id: "audit-2",
      action: "User Block",
      user: "admin@appservico.com",
      timestamp: "2026-03-06 13:45:12",
      ip: "192.168.1.100",
      status: "success",
    },
    {
      id: "audit-3",
      action: "Failed Login",
      user: "unknown@email.com",
      timestamp: "2026-03-06 12:15:33",
      ip: "203.0.113.45",
      status: "failed",
    },
    {
      id: "audit-4",
      action: "Settings Update",
      user: "admin@appservico.com",
      timestamp: "2026-03-06 11:20:18",
      ip: "192.168.1.100",
      status: "success",
    },
    {
      id: "audit-5",
      action: "Report Export",
      user: "admin@appservico.com",
      timestamp: "2026-03-06 10:05:42",
      ip: "192.168.1.100",
      status: "success",
    },
  ]
}
