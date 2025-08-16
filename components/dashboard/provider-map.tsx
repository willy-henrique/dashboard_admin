"use client"

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Wifi, 
  Battery, 
  User, 
  Phone,
  Mail,
  Star,
  Car
} from "lucide-react"

interface ProviderLocation {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  latitude: number
  longitude: number
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
}

// Dados simulados de prestadores
const mockProviders: ProviderLocation[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-1111',
    latitude: -23.5505,
    longitude: -46.6333,
    status: 'available',
    lastUpdate: new Date(),
    batteryLevel: 85,
    signalStrength: 4,
    rating: 4.8,
    vehicle: {
      model: 'Honda CG 160',
      plate: 'ABC-1234',
      color: 'Vermelho'
    }
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 99999-2222',
    latitude: -23.5489,
    longitude: -46.6388,
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
    }
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    phone: '(11) 99999-3333',
    latitude: -23.5520,
    longitude: -46.6310,
    status: 'online',
    lastUpdate: new Date(),
    batteryLevel: 67,
    signalStrength: 3,
    rating: 4.7,
    vehicle: {
      model: 'Suzuki Intruder 125',
      plate: 'GHI-9012',
      color: 'Preto'
    }
  }
]

export function ProviderMap() {
  const [selectedProvider, setSelectedProvider] = useState<ProviderLocation | null>(null)
  const [providers, setProviders] = useState<ProviderLocation[]>(mockProviders)
  const mapRef = useRef<HTMLDivElement>(null)

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setProviders(prev => prev.map(provider => ({
        ...provider,
        lastUpdate: new Date(),
        batteryLevel: Math.max(0, provider.batteryLevel - Math.random() * 2),
        latitude: provider.latitude + (Math.random() - 0.5) * 0.001,
        longitude: provider.longitude + (Math.random() - 0.5) * 0.001
      })))
    }, 30000) // Atualiza a cada 30 segundos

    return () => clearInterval(interval)
  }, [])

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

  return (
    <div className="relative h-full">
      {/* Mapa Simulado */}
      <div 
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden"
        style={{ backgroundColor: 'var(--muted)' }}
      >
        {/* Grid do mapa */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-20 grid-rows-20 h-full">
            {Array.from({ length: 400 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>

        {/* Marcadores dos prestadores */}
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${((provider.longitude + 46.64) * 1000) % 100}%`,
              top: `${((provider.latitude + 23.55) * 1000) % 100}%`,
            }}
            onClick={() => setSelectedProvider(provider)}
          >
            <div className="relative">
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                style={{ backgroundColor: getStatusColor(provider.status) }}
              >
                <User className="w-3 h-3 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getStatusColor(provider.status) }}
                ></div>
              </div>
            </div>
          </div>
        ))}

        {/* Legenda */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 border" style={{ borderColor: 'var(--border)' }}>
          <div className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Status dos Prestadores</div>
          <div className="space-y-1">
            {['available', 'busy', 'online', 'offline'].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getStatusColor(status) }}
                ></div>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {getStatusText(status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Painel de detalhes do prestador */}
      {selectedProvider && (
        <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg border" style={{ borderColor: 'var(--border)' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{selectedProvider.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProvider(null)}
                style={{ color: 'var(--muted-foreground)' }}
              >
                ×
              </Button>
            </div>
            <Badge 
              style={{ 
                backgroundColor: getStatusColor(selectedProvider.status),
                color: 'white'
              }}
            >
              {getStatusText(selectedProvider.status)}
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Informações de contato */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                  {selectedProvider.phone}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                  {selectedProvider.email}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                  {selectedProvider.rating} ⭐
                </span>
              </div>
            </div>

            {/* Status do dispositivo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Bateria</span>
                <div className="flex items-center space-x-1">
                  <Battery className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                    {Math.round(selectedProvider.batteryLevel)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sinal</span>
                <div className="flex items-center space-x-1">
                  <Wifi className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                    {selectedProvider.signalStrength}/5
                  </span>
                </div>
              </div>
            </div>

            {/* Veículo */}
            {selectedProvider.vehicle && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    Veículo
                  </span>
                </div>
                <div className="text-sm space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                  <div>{selectedProvider.vehicle.model}</div>
                  <div>Placa: {selectedProvider.vehicle.plate}</div>
                  <div>Cor: {selectedProvider.vehicle.color}</div>
                </div>
              </div>
            )}

            {/* Serviço atual */}
            {selectedProvider.currentService && (
              <div className="space-y-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    Serviço Atual
                  </span>
                </div>
                <div className="text-sm space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                  <div>{selectedProvider.currentService.title}</div>
                  <div>Cliente: {selectedProvider.currentService.clientName}</div>
                  <div>Tempo estimado: {selectedProvider.currentService.estimatedTime} min</div>
                </div>
              </div>
            )}

            {/* Última atualização */}
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Última atualização: {selectedProvider.lastUpdate.toLocaleTimeString()}
            </div>

            {/* Ações */}
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1" style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)'
              }}>
                <Navigation className="w-4 h-4 mr-2" />
                Rastrear
              </Button>
              <Button size="sm" variant="outline" className="flex-1" style={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}>
                <Phone className="w-4 h-4 mr-2" />
                Ligar
              </Button>
            </div>
          </CardContent>
        </div>
      )}
    </div>
  )
}
