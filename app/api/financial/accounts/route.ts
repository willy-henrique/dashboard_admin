import { NextRequest, NextResponse } from 'next/server'

// Mock data para demonstração
const accounts = [
  {
    id: "1",
    nome: "Conta Corrente Principal",
    banco: "Banco do Brasil",
    agencia: "1234-5",
    conta: "12345-6",
    tipo: "corrente",
    saldo: 15750.5,
    status: "ativa",
  },
  {
    id: "2",
    nome: "Conta Poupança",
    banco: "Caixa Econômica",
    agencia: "0987-6",
    conta: "98765-4",
    tipo: "poupanca",
    saldo: 8200.0,
    status: "ativa",
  },
  {
    id: "3",
    nome: "Conta Investimento",
    banco: "Itaú",
    agencia: "5678-9",
    conta: "56789-0",
    tipo: "investimento",
    saldo: 25000.0,
    status: "ativa",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const status = searchParams.get('status')

    let filteredAccounts = accounts

    if (tipo) {
      filteredAccounts = filteredAccounts.filter(account => account.tipo === tipo)
    }

    if (status) {
      filteredAccounts = filteredAccounts.filter(account => account.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filteredAccounts,
      total: filteredAccounts.length
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
    if (!body.nome || !body.banco || !body.agencia || !body.conta) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    const newAccount = {
      id: (accounts.length + 1).toString(),
      ...body,
      saldo: body.saldo || 0,
      status: body.status || 'ativa'
    }

    // Em um cenário real, salvaria no banco de dados
    accounts.push(newAccount)

    return NextResponse.json({
      success: true,
      data: newAccount,
      message: 'Conta criada com sucesso'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
