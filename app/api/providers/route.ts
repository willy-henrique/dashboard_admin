import { NextRequest, NextResponse } from 'next/server'

// Mock data dos prestadores
const providers = [
  {
    id: "1",
    nome: "João Silva",
    telefone: "(27) 99999-1111",
    email: "joao.silva@email.com",
    status: "disponivel",
    localizacao: { lat: -20.3155, lng: -40.3128 },
    ultimaAtualizacao: new Date().toISOString(),
    servicoAtual: null,
    especialidades: ["Limpeza Residencial", "Limpeza Comercial"],
    avaliacao: 4.8,
    totalServicos: 156
  },
  {
    id: "2",
    nome: "Maria Santos",
    telefone: "(27) 99999-2222",
    email: "maria.santos@email.com",
    status: "ocupado",
    localizacao: { lat: -20.3255, lng: -40.3228 },
    ultimaAtualizacao: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min atrás
    servicoAtual: "Limpeza Residencial - Centro",
    especialidades: ["Limpeza Residencial", "Pós-Obra"],
    avaliacao: 4.9,
    totalServicos: 203
  },
  {
    id: "3",
    nome: "Carlos Lima",
    telefone: "(27) 99999-3333",
    email: "carlos.lima@email.com",
    status: "online",
    localizacao: { lat: -20.3055, lng: -40.3028 },
    ultimaAtualizacao: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 min atrás
    servicoAtual: null,
    especialidades: ["Limpeza Comercial", "Manutenção"],
    avaliacao: 4.7,
    totalServicos: 89
  },
  {
    id: "4",
    nome: "Ana Costa",
    telefone: "(27) 99999-4444",
    email: "ana.costa@email.com",
    status: "disponivel",
    localizacao: { lat: -20.3355, lng: -40.3328 },
    ultimaAtualizacao: new Date().toISOString(),
    servicoAtual: null,
    especialidades: ["Limpeza Residencial", "Organização"],
    avaliacao: 4.6,
    totalServicos: 134
  },
  {
    id: "5",
    nome: "Pedro Oliveira",
    telefone: "(27) 99999-5555",
    email: "pedro.oliveira@email.com",
    status: "offline",
    localizacao: { lat: -20.3455, lng: -40.3428 },
    ultimaAtualizacao: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min atrás
    servicoAtual: null,
    especialidades: ["Limpeza Industrial", "Pós-Obra"],
    avaliacao: 4.5,
    totalServicos: 67
  },
  {
    id: "6",
    nome: "Lucia Ferreira",
    telefone: "(27) 99999-6666",
    email: "lucia.ferreira@email.com",
    status: "disponivel",
    localizacao: { lat: -20.2955, lng: -40.2928 },
    ultimaAtualizacao: new Date().toISOString(),
    servicoAtual: null,
    especialidades: ["Limpeza Residencial", "Cuidados Especiais"],
    avaliacao: 4.9,
    totalServicos: 178
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const ativo = searchParams.get('ativo')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const raio = searchParams.get('raio') || '10' // km

    let filteredProviders = [...providers]

    // Filtrar por status
    if (status) {
      filteredProviders = filteredProviders.filter(p => p.status === status)
    }

    // Filtrar apenas ativos (disponível, ocupado, online)
    if (ativo === 'true') {
      filteredProviders = filteredProviders.filter(p => 
        ['disponivel', 'ocupado', 'online'].includes(p.status)
      )
    }

    // Filtrar por proximidade (se coordenadas fornecidas)
    if (lat && lng) {
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)
      const raioKm = parseFloat(raio)

      filteredProviders = filteredProviders.filter(provider => {
        const distance = calculateDistance(
          userLat, userLng,
          provider.localizacao.lat, provider.localizacao.lng
        )
        return distance <= raioKm
      })
    }

    // Estatísticas
    const stats = {
      total: providers.length,
      disponivel: providers.filter(p => p.status === 'disponivel').length,
      ocupado: providers.filter(p => p.status === 'ocupado').length,
      online: providers.filter(p => p.status === 'online').length,
      offline: providers.filter(p => p.status === 'offline').length
    }

    return NextResponse.json({
      success: true,
      data: filteredProviders,
      stats,
      timestamp: new Date().toISOString()
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
    if (!body.nome || !body.telefone || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    const newProvider = {
      id: (providers.length + 1).toString(),
      ...body,
      status: body.status || 'offline',
      ultimaAtualizacao: new Date().toISOString(),
      avaliacao: 0,
      totalServicos: 0
    }

    providers.push(newProvider)

    return NextResponse.json({
      success: true,
      data: newProvider,
      message: 'Prestador criado com sucesso'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para calcular distância entre duas coordenadas (Haversine)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
