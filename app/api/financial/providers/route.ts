import { NextRequest, NextResponse } from 'next/server'
import { adminApp } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

interface ProviderBilling {
  id: string
  uid: string
  nome?: string
  phone?: string
  email?: string
  pixKey?: string
  pixKeyType?: string
  totalEarnings: number
  totalJobs?: number
  isActive?: boolean
  isVerified?: boolean
  verificationStatus?: string
  updatedAt?: any
}

/**
 * GET /api/financial/providers
 * Busca todos os prestadores com dados financeiros (totalEarnings)
 */
export async function GET(request: NextRequest) {
  try {
    if (!adminApp) {
      return NextResponse.json(
        {
          success: false,
          error: 'Firebase Admin SDK não configurado',
          providers: [],
        },
        { status: 500 }
      )
    }

    const db = adminApp.firestore()
    const providersRef = db.collection('providers')
    
    // Buscar todos os providers (filtrar isActive no código)
    const snapshot = await providersRef.get()

    const providers: ProviderBilling[] = []

    snapshot.forEach((doc) => {
      const data = doc.data()
      
      // Filtrar apenas providers ativos (ou que não tenham o campo, assumindo como ativo)
      const isActive = data.isActive !== false // Se não existir, assume true
      
      // Extrair totalEarnings do campo services.totalEarnings
      const services = data.services || {}
      const totalEarnings = services.totalEarnings || 0
      const totalJobs = services.totalJobs || 0

      // Incluir apenas providers ativos
      if (isActive) {
        providers.push({
          id: doc.id,
          uid: data.uid || doc.id,
          nome: data.nome || data.name || 'Sem nome',
          phone: data.phone || '',
          email: data.email || '',
          pixKey: data.pixKey || '',
          pixKeyType: data.pixKeyType || '',
          totalEarnings: typeof totalEarnings === 'number' ? totalEarnings : 0,
          totalJobs: typeof totalJobs === 'number' ? totalJobs : 0,
          isActive: true,
          isVerified: data.isVerified ?? false,
          verificationStatus: data.verificationStatus || 'pending',
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        })
      }
    })

    // Ordenar por totalEarnings (maior primeiro)
    providers.sort((a, b) => b.totalEarnings - a.totalEarnings)

    const totalEarnings = providers.reduce((sum, p) => sum + p.totalEarnings, 0)

    return NextResponse.json({
      success: true,
      providers,
      totalEarnings,
      count: providers.length,
    })
  } catch (error) {
    console.error('Erro ao buscar prestadores:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar prestadores',
        providers: [],
      },
      { status: 500 }
    )
  }
}

