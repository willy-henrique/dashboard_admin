import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const periodo = searchParams.get('periodo') || 'mes'
    const tipo = searchParams.get('tipo') || 'resumo'

    // Mock data para demonstração
    const mockData = {
      resumo: {
        receitas: {
          total: 125000.0,
          crescimento: 12.5,
          categorias: [
            { nome: 'Serviços', valor: 80000, percentual: 64 },
            { nome: 'Produtos', valor: 30000, percentual: 24 },
            { nome: 'Outros', valor: 15000, percentual: 12 }
          ]
        },
        despesas: {
          total: 85000.0,
          crescimento: -5.2,
          categorias: [
            { nome: 'Salários', valor: 40000, percentual: 47 },
            { nome: 'Combustível', valor: 15000, percentual: 18 },
            { nome: 'Equipamentos', valor: 20000, percentual: 24 },
            { nome: 'Outros', valor: 10000, percentual: 11 }
          ]
        },
        saldo: 40000.0,
        margem: 32.0
      },
      detalhado: {
        receitas: [
          { data: '2025-01-01', valor: 5000, descricao: 'Serviços do dia' },
          { data: '2025-01-02', valor: 3200, descricao: 'Limpeza comercial' },
          { data: '2025-01-03', valor: 1800, descricao: 'Serviços residenciais' },
        ],
        despesas: [
          { data: '2025-01-01', valor: 1200, descricao: 'Combustível' },
          { data: '2025-01-02', valor: 800, descricao: 'Material de limpeza' },
          { data: '2025-01-03', valor: 1500, descricao: 'Salários' },
        ]
      }
    }

    const data = tipo === 'detalhado' ? mockData.detalhado : mockData.resumo

    return NextResponse.json({
      success: true,
      data,
      periodo,
      tipo,
      geradoEm: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
