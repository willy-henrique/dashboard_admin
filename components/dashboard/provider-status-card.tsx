"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  MapPin, 
  Clock, 
  Wifi, 
  Battery, 
  User, 
  Phone,
  Mail,
  Star,
  Car,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react"

interface ProviderStatus {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  status: 'online' | 'offline' | 'busy' | 'available'
  lastUpdate: Date
  batteryLevel: number
  signalStrength: number
  currentService?: {
    id: string
    title: string
    clientName: string
    estimatedTime: number
  }
  rating: number
  vehicle?: {
    model: string
    plate: string
    color: string
  }
  location: {
    latitude: number
    longitude: number
    address: string
  }
}

// Dados simulados de prestadores
const mockProviders: ProviderStatus[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-1111',
    status: 'available',
    lastUpdate: new Date(),
    batteryLevel: 85,
    signalStrength: 4,
    rating: 4.8,
    vehicle: {
      model: 'Honda CG 160',
      plate: 'ABC-1234',
      color: 'Vermelho'
    },
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      address: 'Rua Augusta, 123 - São Paulo, SP'
    }
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 99999-2222',
    status: 'busy',
    lastUpdate: new Date(),
    batteryLevel: 92,
    signalStrength: 5,
    currentService: {
      id: 'service-1',
      title: 'Limpeza Residencial',
      clientName: 'Ana Costa',
      estimatedTime: 45
    },
    rating: 4.9,
    vehicle: {
      model: 'Yamaha YBR 125',
      plate: 'DEF-5678',
      color: 'Azul'
    },
    location: {
      latitude: -23.5489,
      longitude: -46.6388,
      address: 'Av. Paulista, 456 - São Paulo, SP'
    }
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    phone: '(11) 99999-3333',
    status: 'online',
    lastUpdate: new Date(),
    batteryLevel: 67,
    signalStrength: 3,
    rating: 4.7,
    vehicle: {
      model: 'Suzuki Intruder 125',
      plate: 'GHI-9012',
      color: 'Preto'
    },
    location: {
      latitude: -23.5520,
      longitude: -46.6310,
      address: 'Rua Oscar Freire, 789 - São Paulo, SP'
    }
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(11) 99999-4444',
    status: 'offline',
    lastUpdate: new Date(Date.now() - 3600000), // 1 hora atrás
    batteryLevel: 23,
    signalStrength: 1,
    rating: 4.6,
    vehicle: {
      model: 'Honda Biz 125',
      plate: 'JKL-3456',
      color: 'Branco'
    },
    location: {
      latitude: -23.5540,
      longitude: -46.6350,
      address: 'Rua Haddock Lobo, 321 - São Paulo, SP'
    }
  }
]

export function ProviderStatusCard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10b981'
      case 'busy': return '#f59e0b'
      case 'online': return '#3b82f6'
      case 'offline': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível'
      case 'busy': return 'Ocupado'
      case 'online': return 'Online'
      case 'offline': return 'Offline'
      default: return 'Desconhecido'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />
      case 'busy': return <Activity className="w-4 h-4" />
      case 'online': return <Wifi className="w-4 h-4" />
      case 'offline': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d atrás`
    if (hours > 0) return `${hours}h atrás`
    if (minutes > 0) return `${minutes}m atrás`
    return 'Agora'
  }

  const stats = {
    total: mockProviders.length,
    available: mockProviders.filter(p => p.status === 'available').length,
    busy: mockProviders.filter(p => p.status === 'busy').length,
    online: mockProviders.filter(p => p.status === 'online').length,
    offline: mockProviders.filter(p => p.status === 'offline').length
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card style={{
          backgroundColor: 'var(--card)',
          color: 'var(--card-foreground)',
          borderColor: 'var(--border)'
        }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {stats.total}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{
          backgroundColor: 'var(--card)',
          color: 'var(--card-foreground)',
          borderColor: 'var(--border)'
        }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {stats.available}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Disponíveis
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{
          backgroundColor: 'var(--card)',
          color: 'var(--card-foreground)',
          borderColor: 'var(--border)'
        }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5" style={{ color: '#f59e0b' }} />
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {stats.busy}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Ocupados
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{
          backgroundColor: 'var(--card)',
          color: 'var(--card-foreground)',
          borderColor: 'var(--border)'
        }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wifi className="w-5 h-5" style={{ color: '#3b82f6' }} />
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {stats.online}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Online
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{
          backgroundColor: 'var(--card)',
          color: 'var(--card-foreground)',
          borderColor: 'var(--border)'
        }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5" style={{ color: '#6b7280' }} />
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {stats.offline}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Offline
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Prestadores */}
      <Card style={{
        backgroundColor: 'var(--card)',
        color: 'var(--card-foreground)',
        borderColor: 'var(--border)'
      }}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" style={{ color: 'var(--primary)' }} />
            <span>Status dos Prestadores</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProviders.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center justify-between p-4 rounded-lg border"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
                  </div>

                  {/* Informações básicas */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium" style={{ color: 'var(--foreground)' }}>
                        {provider.name}
                      </h3>
                      <Badge 
                        style={{ 
                          backgroundColor: getStatusColor(provider.status),
                          color: 'white'
                        }}
                      >
                        {getStatusText(provider.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" style={{ color: 'var(--muted-foreground)' }} />
                        <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          {provider.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3" style={{ color: 'var(--muted-foreground)' }} />
                        <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          {provider.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status detalhado */}
                <div className="flex items-center space-x-4">
                  {/* Status do dispositivo */}
                  <div className="flex items-center space-x-2">
                    <Battery className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                      {Math.round(provider.batteryLevel)}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                      {provider.signalStrength}/5
                    </span>
                  </div>

                  {/* Última atualização */}
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {getTimeAgo(provider.lastUpdate)}
                  </div>

                  {/* Ações */}
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}>
                      <MapPin className="w-4 h-4 mr-1" />
                      Localizar
                    </Button>
                    <Button size="sm" style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)'
                    }}>
                      <Phone className="w-4 h-4 mr-1" />
                      Ligar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
