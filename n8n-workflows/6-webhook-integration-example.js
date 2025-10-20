// 🔗 Exemplo de Integração Webhooks N8N
// Este arquivo mostra como integrar os workflows N8N com o dashboard

// 📋 Configurações dos Webhooks
const N8N_CONFIG = {
  baseUrl: process.env.N8N_WEBHOOK_URL || 'https://seu-n8n.com/webhook',
  endpoints: {
    novoPedido: '/novo-pedido',
    statusPedido: '/status-pedido', 
    novaMensagem: '/nova-mensagem'
  }
}

// 🚀 Função para enviar novo pedido para N8N
export async function enviarNovoPedido(pedido) {
  try {
    const webhookUrl = `${N8N_CONFIG.baseUrl}${N8N_CONFIG.endpoints.novoPedido}`
    
    const payload = {
      id: pedido.id,
      clientName: pedido.clientName,
      clientEmail: pedido.clientEmail,
      clientPhone: pedido.clientPhone,
      address: pedido.address,
      complement: pedido.complement,
      description: pedido.description,
      isEmergency: pedido.isEmergency || false,
      status: pedido.status || 'pending',
      createdAt: new Date().toISOString(),
      protocolo: pedido.protocolo
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Erro webhook: ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ Novo pedido enviado para N8N:', result)
    
    return result
  } catch (error) {
    console.error('❌ Erro ao enviar novo pedido:', error)
    throw error
  }
}

// 🔄 Função para atualizar status do pedido
export async function atualizarStatusPedido(pedidoId, novoStatus, dadosExtras = {}) {
  try {
    const webhookUrl = `${N8N_CONFIG.baseUrl}${N8N_CONFIG.endpoints.statusPedido}`
    
    const payload = {
      id: pedidoId,
      status: novoStatus,
      updatedAt: new Date().toISOString(),
      ...dadosExtras
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Erro webhook: ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ Status atualizado enviado para N8N:', result)
    
    return result
  } catch (error) {
    console.error('❌ Erro ao atualizar status:', error)
    throw error
  }
}

// 💬 Função para enviar nova mensagem do chat
export async function enviarNovaMensagem(mensagem) {
  try {
    const webhookUrl = `${N8N_CONFIG.baseUrl}${N8N_CONFIG.endpoints.novaMensagem}`
    
    const payload = {
      conversationId: mensagem.conversationId,
      messageId: mensagem.id,
      userId: mensagem.userId,
      userName: mensagem.userName,
      userEmail: mensagem.userEmail,
      orderId: mensagem.orderId,
      orderProtocol: mensagem.orderProtocol,
      message: mensagem.text,
      messageType: mensagem.type || 'text',
      timestamp: mensagem.timestamp || new Date().toISOString(),
      isFromAdmin: mensagem.isFromAdmin || false
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Erro webhook: ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ Nova mensagem enviada para N8N:', result)
    
    return result
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error)
    throw error
  }
}

// 🔧 Função utilitária para testar conectividade
export async function testarConectividadeN8N() {
  try {
    const testUrl = `${N8N_CONFIG.baseUrl}/health`
    const response = await fetch(testUrl, { method: 'GET' })
    
    if (response.ok) {
      console.log('✅ N8N conectado com sucesso')
      return true
    } else {
      console.log('⚠️ N8N respondeu com erro:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Erro de conectividade N8N:', error)
    return false
  }
}

// 📊 Exemplo de uso nos serviços existentes
export class N8NIntegrationService {
  
  // Integrar com OrdersService
  static async onCreateOrder(orderData) {
    try {
      // Salvar no Firestore primeiro
      const savedOrder = await OrdersService.createOrder(orderData)
      
      // Enviar para N8N
      await enviarNovoPedido(savedOrder)
      
      return savedOrder
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      throw error
    }
  }

  // Integrar com atualização de status
  static async onUpdateOrderStatus(orderId, newStatus, additionalData = {}) {
    try {
      // Atualizar no Firestore primeiro
      await OrdersService.updateOrderStatus(orderId, newStatus, additionalData)
      
      // Buscar dados completos do pedido
      const order = await OrdersService.getOrder(orderId)
      
      // Enviar para N8N
      await atualizarStatusPedido(orderId, newStatus, {
        clientName: order?.clientName,
        clientEmail: order?.clientEmail,
        address: order?.address,
        description: order?.description,
        ...additionalData
      })
      
      return true
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      throw error
    }
  }

  // Integrar com ChatService
  static async onNewChatMessage(messageData) {
    try {
      // Salvar mensagem no Firestore primeiro
      const savedMessage = await ChatService.saveMessage(messageData)
      
      // Enviar para N8N
      await enviarNovaMensagem(savedMessage)
      
      return savedMessage
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error)
      throw error
    }
  }
}

// 🎯 Exemplo de uso em componentes React
export const useN8NIntegration = () => {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Testar conectividade ao carregar
    testarConectividadeN8N().then(setIsConnected)
  }, [])

  const criarPedidoComNotificacao = async (pedidoData) => {
    try {
      const resultado = await N8NIntegrationService.onCreateOrder(pedidoData)
      
      // Mostrar toast de sucesso
      toast.success('Pedido criado e notificações enviadas!')
      
      return resultado
    } catch (error) {
      toast.error('Erro ao criar pedido')
      throw error
    }
  }

  const atualizarStatusComNotificacao = async (orderId, status, dadosExtras) => {
    try {
      await N8NIntegrationService.onUpdateOrderStatus(orderId, status, dadosExtras)
      
      // Mostrar toast de sucesso
      toast.success('Status atualizado e notificações enviadas!')
      
      return true
    } catch (error) {
      toast.error('Erro ao atualizar status')
      throw error
    }
  }

  return {
    isConnected,
    criarPedidoComNotificacao,
    atualizarStatusComNotificacao
  }
}

// 📝 Exemplo de uso em páginas
/*
// Em app/orders/page.tsx
import { useN8NIntegration } from '@/lib/n8n-integration'

export default function OrdersPage() {
  const { criarPedidoComNotificacao, atualizarStatusComNotificacao } = useN8NIntegration()

  const handleCreateOrder = async (orderData) => {
    await criarPedidoComNotificacao(orderData)
  }

  const handleUpdateStatus = async (orderId, status) => {
    await atualizarStatusComNotificacao(orderId, status)
  }

  // ... resto do componente
}

// Em components/chat/chat-input.tsx
import { N8NIntegrationService } from '@/lib/n8n-integration'

const handleSendMessage = async (messageText) => {
  const messageData = {
    conversationId: conversation.id,
    userId: user.id,
    userName: user.name,
    text: messageText,
    orderId: conversation.orderId
  }

  await N8NIntegrationService.onNewChatMessage(messageData)
}
*/

export default {
  enviarNovoPedido,
  atualizarStatusPedido,
  enviarNovaMensagem,
  testarConectividadeN8N,
  N8NIntegrationService,
  useN8NIntegration
}






