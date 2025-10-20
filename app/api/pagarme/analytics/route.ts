import { NextRequest, NextResponse } from 'next/server'
import { pagarmeService } from '@/lib/services/pagarme-service'

/**
 * GET /api/pagarme/analytics
 * Retorna analytics financeiras do período
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'start_date e end_date são obrigatórios',
        },
        { status: 400 }
      )
    }

    const analytics = await pagarmeService.getAnalytics(startDate, endDate)

    return NextResponse.json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    console.error('Erro ao buscar analytics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar analytics',
      },
      { status: 500 }
    )
  }
}

