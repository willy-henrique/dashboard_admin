import { NextRequest, NextResponse } from 'next/server'
import { pagarmeService } from '@/lib/services/pagarme-service'

/**
 * GET /api/pagarme/charges/:id
 * Busca uma cobrança por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await pagarmeService.getCharge(params.id)

    if (response.errors) {
      return NextResponse.json(
        {
          success: false,
          errors: response.errors,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: response.data,
    })
  } catch (error) {
    console.error('Erro ao buscar cobrança:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar cobrança',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/pagarme/charges/:id
 * Cancela uma cobrança
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await pagarmeService.cancelCharge(params.id)

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
      message: 'Cobrança cancelada com sucesso',
    })
  } catch (error) {
    console.error('Erro ao cancelar cobrança:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao cancelar cobrança',
      },
      { status: 500 }
    )
  }
}

