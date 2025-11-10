import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase'
import { FirebaseProvidersService, FirebaseProvider } from './firebase-providers'
import { OrdersService } from './orders-service'

export interface MobileStats {
  totalUsuarios: number
  conectados: number
  desconectados: number
  totalAcessos: number
  quilometragemTotal: number
  recusas: number
  rastreamentos: number
  taxaRecusa: number
  precisaoMedia: number
  ultimaAtividade?: Date
  profissionaisAtivos: number
}

export interface ProviderRealtimeStatus {
  id: string
  nome: string
  status: 'online' | 'offline'
  versao?: string
  ultimaAtualizacao?: Date
}

export class MobileStatsService {
  // Calcular estatísticas do mobile
  static async getMobileStats(): Promise<MobileStats> {
    try {
      // Buscar todos os providers
      const providers = await FirebaseProvidersService.getProviders()
      
      // Calcular usuários
      const totalUsuarios = providers.length
      const conectados = providers.filter(p => 
        ['disponivel', 'ocupado', 'online'].includes(p.status)
      ).length
      const desconectados = totalUsuarios - conectados

      // Buscar acessos (logins hoje)
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      const hojeTimestamp = Timestamp.fromDate(hoje)
      
      const totalAcessos = await this.getAccessCountToday()
      
      // Calcular quilometragem (baseado em localizações atualizadas hoje)
      const quilometragemTotal = await this.calculateKilometersToday(providers)
      
      // Buscar recusas (pedidos cancelados/recusados hoje)
      const recusas = await this.getRejectedOrdersToday()
      
      // Calcular rastreamentos ativos
      const rastreamentos = providers.filter(p => 
        p.status !== 'offline' && 
        p.ultimaAtualizacao && 
        this.isRecentUpdate(p.ultimaAtualizacao)
      ).length

      // Calcular taxa de recusa
      const totalPedidosHoje = await this.getTotalOrdersToday()
      const taxaRecusa = totalPedidosHoje > 0 
        ? (recusas / totalPedidosHoje) * 100 
        : 0

      // Calcular precisão média (baseado em localizações)
      const precisaoMedia = await this.calculateAverageAccuracy(providers)

      // Última atividade
      const ultimaAtividade = this.getLastActivity(providers)

      return {
        totalUsuarios,
        conectados,
        desconectados,
        totalAcessos,
        quilometragemTotal: Math.round(quilometragemTotal * 100) / 100,
        recusas,
        rastreamentos,
        taxaRecusa: Math.round(taxaRecusa * 100) / 100,
        precisaoMedia: Math.round(precisaoMedia),
        ultimaAtividade,
        profissionaisAtivos: conectados
      }
    } catch (error) {
      console.error('Erro ao calcular estatísticas do mobile:', error)
      // Retornar valores padrão em caso de erro
      return {
        totalUsuarios: 0,
        conectados: 0,
        desconectados: 0,
        totalAcessos: 0,
        quilometragemTotal: 0,
        recusas: 0,
        rastreamentos: 0,
        taxaRecusa: 0,
        precisaoMedia: 0,
        profissionaisAtivos: 0
      }
    }
  }

  // Buscar status em tempo real dos profissionais
  static async getRealtimeStatus(): Promise<ProviderRealtimeStatus[]> {
    try {
      const providers = await FirebaseProvidersService.getActiveProviders()
      
      return providers.map(p => {
        const isOnline = ['disponivel', 'ocupado', 'online'].includes(p.status)
        const ultimaAtualizacao = p.ultimaAtualizacao?.toDate?.() || 
          (p.ultimaAtualizacao instanceof Date ? p.ultimaAtualizacao : new Date())
        
        // Tentar extrair versão do app se disponível
        const versao = (p as any).appVersion || (p as any).deviceInfo?.version || 'N/A'
        
        return {
          id: p.id,
          nome: p.nome.toUpperCase(),
          status: isOnline ? 'online' : 'offline',
          versao,
          ultimaAtualizacao
        }
      })
    } catch (error) {
      console.error('Erro ao buscar status em tempo real:', error)
      return []
    }
  }

  // Contar acessos hoje (logins)
  private static async getAccessCountToday(): Promise<number> {
    if (!db) return 0

    try {
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      const amanha = new Date(hoje)
      amanha.setDate(amanha.getDate() + 1)

      // Buscar em provider_logins ou similar
      const loginsRef = collection(db, 'provider_logins')
      const q = query(
        loginsRef,
        where('timestamp', '>=', Timestamp.fromDate(hoje)),
        where('timestamp', '<', Timestamp.fromDate(amanha))
      )
      
      const snapshot = await getDocs(q)
      return snapshot.size
    } catch (error) {
      // Se a coleção não existir, contar providers que atualizaram hoje
      console.warn('Erro ao buscar logins, usando fallback:', error)
      try {
        const providers = await FirebaseProvidersService.getProviders()
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)
        
        return providers.filter(p => {
          if (!p.ultimaAtualizacao) return false
          const updateDate = p.ultimaAtualizacao?.toDate?.() || 
            (p.ultimaAtualizacao instanceof Date ? p.ultimaAtualizacao : new Date())
          return updateDate >= hoje
        }).length
      } catch {
        return 0
      }
    }
  }

  // Calcular quilometragem hoje (estimativa baseada em localizações)
  private static async calculateKilometersToday(providers: FirebaseProvider[]): Promise<number> {
    if (!db) return 0

    try {
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)

      // Buscar localizações atualizadas hoje
      const locationsRef = collection(db, 'provider_locations')
      const q = query(
        locationsRef,
        where('lastUpdate', '>=', Timestamp.fromDate(hoje)),
        orderBy('lastUpdate', 'desc')
      )

      const snapshot = await getDocs(q)
      let totalKm = 0

      // Calcular distância total percorrida (estimativa)
      snapshot.docs.forEach((doc, index) => {
        const data = doc.data()
        if (data.speed && data.speed > 0) {
          // Estimativa: velocidade média * tempo estimado
          const speedKmh = data.speed
          // Assumir 1 hora de atividade por atualização
          totalKm += speedKmh * 0.1 // Estimativa conservadora
        }
      })

      // Se não houver dados de velocidade, usar estimativa baseada em providers ativos
      if (totalKm === 0) {
        const activeProviders = providers.filter(p => 
          ['disponivel', 'ocupado', 'online'].includes(p.status)
        )
        // Estimativa: 5km por provider ativo
        totalKm = activeProviders.length * 5
      }

      return totalKm
    } catch (error) {
      console.warn('Erro ao calcular quilometragem, usando estimativa:', error)
      // Fallback: estimativa baseada em providers ativos
      const activeProviders = providers.filter(p => 
        ['disponivel', 'ocupado', 'online'].includes(p.status)
      )
      return activeProviders.length * 5
    }
  }

  // Buscar pedidos recusados hoje
  private static async getRejectedOrdersToday(): Promise<number> {
    try {
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      
      const orders = await OrdersService.getOrders({
        dateFrom: hoje,
        status: 'cancelled'
      })

      // Também contar pedidos recusados por providers
      const rejectedByProviders = orders.filter(order => 
        order.cancelledBy === 'provider' || 
        order.cancellationReason?.toLowerCase().includes('recusado') ||
        order.cancellationReason?.toLowerCase().includes('recusa')
      )

      return rejectedByProviders.length
    } catch (error) {
      console.warn('Erro ao buscar recusas:', error)
      return 0
    }
  }

  // Buscar total de pedidos hoje
  private static async getTotalOrdersToday(): Promise<number> {
    try {
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      
      const orders = await OrdersService.getOrders({
        dateFrom: hoje
      })

      return orders.length
    } catch (error) {
      console.warn('Erro ao buscar total de pedidos:', error)
      return 0
    }
  }

  // Calcular precisão média das localizações
  private static async calculateAverageAccuracy(providers: FirebaseProvider[]): Promise<number> {
    if (!db) return 7 // Valor padrão

    try {
      const locationsRef = collection(db, 'provider_locations')
      const snapshot = await getDocs(locationsRef)
      
      if (snapshot.empty) return 7

      let totalAccuracy = 0
      let count = 0

      snapshot.docs.forEach(doc => {
        const data = doc.data()
        if (data.locationAccuracy && data.locationAccuracy > 0) {
          totalAccuracy += data.locationAccuracy
          count++
        }
      })

      return count > 0 ? totalAccuracy / count : 7
    } catch (error) {
      console.warn('Erro ao calcular precisão média:', error)
      return 7 // Valor padrão em metros
    }
  }

  // Verificar se atualização é recente (últimos 5 minutos)
  private static isRecentUpdate(updateTime: any): boolean {
    if (!updateTime) return false
    
    const updateDate = updateTime?.toDate?.() || 
      (updateTime instanceof Date ? updateTime : new Date())
    const now = new Date()
    const diffMinutes = (now.getTime() - updateDate.getTime()) / (1000 * 60)
    
    return diffMinutes <= 5
  }

  // Obter última atividade
  private static getLastActivity(providers: FirebaseProvider[]): Date | undefined {
    const updates = providers
      .map(p => {
        if (!p.ultimaAtualizacao) return null
        return p.ultimaAtualizacao?.toDate?.() || 
          (p.ultimaAtualizacao instanceof Date ? p.ultimaAtualizacao : null)
      })
      .filter((date): date is Date => date !== null)
      .sort((a, b) => b.getTime() - a.getTime())

    return updates[0]
  }
}

