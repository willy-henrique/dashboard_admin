import { NextRequest, NextResponse } from 'next/server'

// Mock data para demonstração
const transactions = [
  {
    id: "1",
    data: "2025-01-15",
    descricao: "Pagamento de serviço #699411371",
    tipo: "receita",
    valor: 350.0,
    conta: "Conta Corrente Principal",
    categoria: "servicos",
    status: "confirmada"
  },
  {
    id: "2",
    data: "2025-01-15",
    descricao: "Combustível - Veículo ABC-1234",
    tipo: "despesa",
    valor: 120.0,
    conta: "Conta Corrente Principal",
    categoria: "combustivel",
    status: "confirmada"
  },
  {
    id: "3",
    data: "2025-01-14",
    descricao: "Pagamento de fornecedor",
    tipo: "despesa",
    valor: 850.0,
    conta: "Conta Corrente Principal",
    categoria: "fornecedores",
    status: "pendente"
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const status = searchParams.get('status')
    const conta = searchParams.get('conta')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let filteredTransactions = [...transactions]

    // Filtros
    if (tipo) {
      filteredTransactions = filteredTransactions.filter(t => t.tipo === tipo)
    }

    if (status) {
      filteredTransactions = filteredTransactions.filter(t => t.status === status)
    }

    if (conta) {
      filteredTransactions = filteredTransactions.filter(t => t.conta === conta)
    }

    if (dataInicio) {
      filteredTransactions = filteredTransactions.filter(t => t.data >= dataInicio)
    }

    if (dataFim) {
      filteredTransactions = filteredTransactions.filter(t => t.data <= dataFim)
    }

    // Paginação
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

    // Estatísticas
    const totalReceitas = filteredTransactions
      .filter(t => t.tipo === 'receita')
      .reduce((sum, t) => sum + t.valor, 0)

    const totalDespesas = filteredTransactions
      .filter(t => t.tipo === 'despesa')
      .reduce((sum, t) => sum + t.valor, 0)

    return NextResponse.json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        page,
        limit,
        total: filteredTransactions.length,
        totalPages: Math.ceil(filteredTransactions.length / limit)
      },
      summary: {
        totalReceitas,
        totalDespesas,
        saldo: totalReceitas - totalDespesas
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
    if (!body.descricao || !body.tipo || !body.valor || !body.conta) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    const newTransaction = {
      id: (transactions.length + 1).toString(),
      data: body.data || new Date().toISOString().split('T')[0],
      ...body,
      status: body.status || 'pendente'
    }

    // Em um cenário real, salvaria no banco de dados
    transactions.push(newTransaction)

    return NextResponse.json({
      success: true,
      data: newTransaction,
      message: 'Transação criada com sucesso'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
