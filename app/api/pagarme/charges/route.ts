import { NextRequest, NextResponse } from 'next/server'
import { pagarmeService } from '@/lib/services/pagarme-service'

/**
 * GET /api/pagarme/charges
 * Lista todas as cobranças
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      size: searchParams.get('size') ? parseInt(searchParams.get('size')!) : undefined,
      status: searchParams.get('status') || undefined,
      customer_id: searchParams.get('customer_id') || undefined,
      created_since: searchParams.get('created_since') || undefined,
      created_until: searchParams.get('created_until') || undefined,
    }

    const response = await pagarmeService.listCharges(query)

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
    console.error('Erro ao listar cobranças:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao listar cobranças',
      },
      { status: 500 }
    )
  }
}

