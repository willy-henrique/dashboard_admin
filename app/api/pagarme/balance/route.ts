import { NextRequest, NextResponse } from 'next/server'
import { pagarmeService } from '@/lib/services/pagarme-service'

/**
 * GET /api/pagarme/balance
 * Retorna o saldo da conta
 */
export async function GET(request: NextRequest) {
  try {
    const response = await pagarmeService.getBalance()

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
    })
  } catch (error) {
    console.error('Erro ao buscar saldo:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar saldo',
      },
      { status: 500 }
    )
  }
}

