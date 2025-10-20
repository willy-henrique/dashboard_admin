import { NextRequest, NextResponse } from 'next/server'
import { PagarmeWebhook } from '@/types/pagarme'

/**
 * POST /api/pagarme/webhooks
 * Recebe webhooks do Pagar.me
 */
export async function POST(request: NextRequest) {
  try {
    const webhook: PagarmeWebhook = await request.json()

    console.log('📥 Webhook recebido:', {
      id: webhook.id,
      type: webhook.type,
      created_at: webhook.created_at,
    })

    // Processar o webhook baseado no tipo
    switch (webhook.type) {
      case 'charge.paid':
        console.log('✅ Cobrança paga:', webhook.data)
        // TODO: Atualizar status do pedido no banco de dados
        // TODO: Enviar email de confirmação
        // TODO: Liberar acesso/produto
        break

      case 'charge.failed':
        console.log('❌ Cobrança falhou:', webhook.data)
        // TODO: Notificar cliente
        // TODO: Atualizar status do pedido
        break

      case 'charge.refunded':
        console.log('↩️ Cobrança reembolsada:', webhook.data)
        // TODO: Processar reembolso
        // TODO: Notificar cliente
        break

      case 'subscription.created':
        console.log('🔄 Assinatura criada:', webhook.data)
        // TODO: Ativar assinatura
        // TODO: Liberar acesso
        break

      case 'subscription.canceled':
        console.log('🚫 Assinatura cancelada:', webhook.data)
        // TODO: Desativar assinatura
        // TODO: Revogar acesso
        break

      case 'order.paid':
        console.log('✅ Pedido pago:', webhook.data)
        // TODO: Processar pedido
        // TODO: Atualizar estoque
        break

      default:
        console.log('ℹ️ Tipo de webhook não tratado:', webhook.type)
    }

    // Sempre retornar 200 para o Pagar.me
    return NextResponse.json(
      {
        success: true,
        message: 'Webhook processado com sucesso',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error)
    
    // Mesmo com erro, retornar 200 para não ficar reenviando
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar webhook',
      },
      { status: 200 }
    )
  }
}

