import { NextRequest, NextResponse } from 'next/server'

// Mock data para demonstração
const orders = [
  {
    id: "1",
    numero: "ORD-2025-001",
    cliente: "João Silva",
    servico: "Limpeza Residencial",
    valor: 150.0,
    status: "pendente",
    dataCriacao: "2025-01-15",
    dataAgendamento: "2025-01-16",
    endereco: "Rua das Flores, 123",
    observacoes: "Limpeza completa da casa"
  },
  {
    id: "2",
    numero: "ORD-2025-002",
    cliente: "Maria Santos",
    servico: "Limpeza Comercial",
    valor: 300.0,
    status: "em_andamento",
    dataCriacao: "2025-01-14",
    dataAgendamento: "2025-01-15",
    endereco: "Av. Comercial, 456",
    observacoes: "Limpeza do escritório"
  },
  {
    id: "3",
    numero: "ORD-2025-003",
    cliente: "Pedro Costa",
    servico: "Limpeza Pós-Obra",
    valor: 500.0,
    status: "concluida",
    dataCriacao: "2025-01-13",
    dataAgendamento: "2025-01-14",
    endereco: "Rua da Construção, 789",
    observacoes: "Limpeza após reforma"
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const cliente = searchParams.get('cliente')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredOrders = [...orders]

    // Filtros
    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status)
    }

    if (cliente) {
      filteredOrders = filteredOrders.filter(o => 
        o.cliente.toLowerCase().includes(cliente.toLowerCase())
      )
    }

    if (dataInicio) {
      filteredOrders = filteredOrders.filter(o => o.dataCriacao >= dataInicio)
    }

    if (dataFim) {
      filteredOrders = filteredOrders.filter(o => o.dataCriacao <= dataFim)
    }

    // Paginação
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

    // Estatísticas
    const totalValor = filteredOrders.reduce((sum, o) => sum + o.valor, 0)
    const statusCounts = filteredOrders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit)
      },
      summary: {
        totalValor,
        statusCounts
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação básica
    if (!body.cliente || !body.servico || !body.valor || !body.endereco) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    const newOrder = {
      id: (orders.length + 1).toString(),
      numero: `ORD-2025-${String(orders.length + 1).padStart(3, '0')}`,
      dataCriacao: new Date().toISOString().split('T')[0],
      status: 'pendente',
      ...body
    }

    // Em um cenário real, salvaria no banco de dados
    orders.push(newOrder)

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: 'Pedido criado com sucesso'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
