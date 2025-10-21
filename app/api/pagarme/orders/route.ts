import { NextRequest, NextResponse } from 'next/server'
import { pagarmeService } from '@/lib/services/pagarme-service'
import { PagarmeFirebaseSync } from '@/lib/services/pagarme-firebase-sync'

/**
 * GET /api/pagarme/orders
 * Lista todos os pedidos
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      size: searchParams.get('size') ? parseInt(searchParams.get('size')!) : undefined,
      code: searchParams.get('code') || undefined,
      status: searchParams.get('status') || undefined,
      customer_id: searchParams.get('customer_id') || undefined,
      created_since: searchParams.get('created_since') || undefined,
      created_until: searchParams.get('created_until') || undefined,
    }

    const response = await pagarmeService.listOrders(query)

    if (response.errors) {
      return NextResponse.json(
        {
          success: false,
          errors: response.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: response.data,
      paging: response.paging,
    })
  } catch (error) {
    console.error('Erro ao listar pedidos:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao listar pedidos',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/pagarme/orders
 * Cria um novo pedido
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validação básica
    if (!body.customer || !body.items || !body.payments) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados obrigatórios não fornecidos (customer, items, payments)',
        },
        { status: 400 }
      )
    }

    const response = await pagarmeService.createOrder(body)

    if (response.errors) {
      return NextResponse.json(
        {
          success: false,
          errors: response.errors,
        },
        { status: 400 }
      )
    }

    // Sincronizar com Firebase
    if (response.data) {
      try {
        await PagarmeFirebaseSync.saveOrder(response.data)
        await PagarmeFirebaseSync.logSync('order_created', 1, 'success')
      } catch (syncError) {
        console.error('⚠️ Erro ao sincronizar com Firebase:', syncError)
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: response.data,
        message: 'Pedido criado com sucesso',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao criar pedido',
      },
      { status: 500 }
    )
  }
}

