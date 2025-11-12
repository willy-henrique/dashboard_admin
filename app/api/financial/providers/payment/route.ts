import { NextRequest, NextResponse } from 'next/server'
import { adminApp } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

interface PaymentRequest {
  providerId: string
  amount: number
  description?: string
  paymentMethod?: string
}

/**
 * POST /api/financial/providers/payment
 * Processa pagamento para um prestador
 * Atualiza o totalEarnings zerando o valor pago e registra o histórico de pagamento
 */
export async function POST(request: NextRequest) {
  try {
    if (!adminApp) {
      return NextResponse.json(
        {
          success: false,
          error: 'Firebase Admin SDK não configurado',
        },
        { status: 500 }
      )
    }

    const body: PaymentRequest = await request.json()
    const { providerId, amount, description, paymentMethod = 'pix' } = body

    // Validações
    if (!providerId || !amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos. providerId e amount são obrigatórios.',
        },
        { status: 400 }
      )
    }

    const db = adminApp.firestore()
    const providerRef = db.collection('providers').doc(providerId)
    const providerDoc = await providerRef.get()

    if (!providerDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Prestador não encontrado',
        },
        { status: 404 }
      )
    }

    const providerData = providerDoc.data()
    const services = providerData?.services || {}
    const currentEarnings = services.totalEarnings || 0

    // Validar se o valor a pagar não excede o total disponível
    if (amount > currentEarnings) {
      return NextResponse.json(
        {
          success: false,
          error: `Valor a pagar (R$ ${amount.toFixed(2)}) excede o total disponível (R$ ${currentEarnings.toFixed(2)})`,
        },
        { status: 400 }
      )
    }

    // Atualizar o totalEarnings subtraindo o valor pago
    const newEarnings = currentEarnings - amount

    await providerRef.update({
      'services.totalEarnings': newEarnings,
      updatedAt: adminApp.firestore.FieldValue.serverTimestamp(),
    })

    // Registrar histórico de pagamento em uma coleção separada
    const paymentHistoryRef = db.collection('provider_payments')
    await paymentHistoryRef.add({
      providerId,
      providerUid: providerData?.uid || providerId,
      providerName: providerData?.nome || providerData?.name || 'Sem nome',
      amount,
      previousBalance: currentEarnings,
      newBalance: newEarnings,
      paymentMethod,
      description: description || `Pagamento de R$ ${amount.toFixed(2)}`,
      status: 'completed',
      processedAt: adminApp.firestore.FieldValue.serverTimestamp(),
      processedBy: 'admin', // TODO: Pegar do contexto de autenticação
    })

    return NextResponse.json({
      success: true,
      message: 'Pagamento processado com sucesso',
      data: {
        providerId,
        amount,
        previousBalance: currentEarnings,
        newBalance: newEarnings,
        paymentMethod,
      },
    })
  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar pagamento',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}

