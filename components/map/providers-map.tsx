"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, User, Clock, Phone, RefreshCw } from "lucide-react"
import { useProviders, Provider } from "@/hooks/use-providers"

const statusConfig = {
  disponivel: { color: "bg-green-500", label: "Disponível", textColor: "text-green-700" },
  ocupado: { color: "bg-orange-500", label: "Ocupado", textColor: "text-orange-700" },
  online: { color: "bg-blue-500", label: "Online", textColor: "text-blue-700" },
  offline: { color: "bg-gray-500", label: "Offline", textColor: "text-gray-700" }
}

export function ProvidersMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])

  // Usar o hook para buscar prestadores com atualização automática
  const { providers, stats, loading, error, refetch } = useProviders({
    ativo: true, // Apenas prestadores ativos
    autoRefresh: true,
    refreshInterval: 30000 // Atualiza a cada 30 segundos
  })

  // Inicializar o mapa
  useEffect(() => {
    if (!mapRef.current || mapLoaded) return

    const initMap = () => {
      // Verificar se o Google Maps está disponível
      if (typeof window !== 'undefined' && window.google) {
        const map = new window.google.maps.Map(mapRef.current!, {
          center: { lat: -20.3155, lng: -40.3128 }, // Vitória, ES
          zoom: 12,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        })

        setMapInstance(map)
        setMapLoaded(true)
      } else {
        // Fallback se Google Maps não estiver carregado
        setTimeout(initMap, 100)
      }
    }

    initMap()
  }, [mapLoaded])

  // Atualizar marcadores quando os prestadores mudarem
  useEffect(() => {
    if (!mapInstance || !providers.length) return

    // Limpar marcadores existentes
    markers.forEach(marker => marker.setMap(null))
    setMarkers([])

    // Adicionar novos marcadores
    const newMarkers: google.maps.Marker[] = []
    
    providers.forEach(provider => {
      const marker = new window.google.maps.Marker({
        position: provider.localizacao,
        map: mapInstance,
        title: provider.nome,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: statusConfig[provider.status].color.replace('bg-', '#').replace('-500', ''),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      })

      // Info window para cada marcador
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-3 min-w-[200px]">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 rounded-full ${statusConfig[provider.status].color}"></div>
              <h3 class="font-semibold text-sm">${provider.nome}</h3>
            </div>
            <p class="text-xs text-gray-600 mb-1">${provider.telefone}</p>
            <p class="text-xs ${statusConfig[provider.status].textColor} font-medium">${statusConfig[provider.status].label}</p>
            ${provider.servicoAtual ? `<p class="text-xs text-gray-500 mt-1">Serviço: ${provider.servicoAtual}</p>` : ''}
            <p class="text-xs text-gray-400 mt-1">Atualizado: ${new Date(provider.ultimaAtualizacao).toLocaleTimeString()}</p>
          </div>
        `
      })

      marker.addListener('click', () => {
        setSelectedProvider(provider)
        infoWindow.open(mapInstance, marker)
      })

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)
  }, [mapInstance, providers])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                Rastreamento em Tempo Real
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Localização atual dos prestadores de serviço ativos
              </p>
            </div>
            <button
              onClick={refetch}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Atualizar localizações"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Estatísticas */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.disponivel}</div>
                <div className="text-xs text-green-700">Disponíveis</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.ocupado}</div>
                <div className="text-xs text-orange-700">Ocupados</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.online}</div>
                <div className="text-xs text-blue-700">Online</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
                <div className="text-xs text-gray-700">Total</div>
              </div>
            </div>
          )}

          {/* Mapa */}
          <div className="relative">
            <div 
              ref={mapRef} 
              className="w-full h-96 rounded-lg border"
              style={{ minHeight: '400px' }}
            />
            
            {/* Loading overlay */}
            {(!mapLoaded || loading) && (
              <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">
                    {!mapLoaded ? 'Carregando mapa...' : 'Atualizando localizações...'}
                  </p>
                </div>
              </div>
            )}

            {/* Error overlay */}
            {error && (
              <div className="absolute inset-0 bg-red-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-red-500 mb-2">⚠️</div>
                  <p className="text-sm text-red-600">{error}</p>
                  <button
                    onClick={refetch}
                    className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Legenda */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Status dos Prestadores</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(statusConfig).map(([status, config]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                  <span className={config.textColor}>{config.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do prestador selecionado */}
      {selectedProvider && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {selectedProvider.nome}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{selectedProvider.telefone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statusConfig[selectedProvider.status].color}`}></div>
                <Badge className={statusConfig[selectedProvider.status].textColor}>
                  {statusConfig[selectedProvider.status].label}
                </Badge>
              </div>

              {selectedProvider.servicoAtual && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Serviço Atual:</p>
                  <p className="text-sm text-gray-600">{selectedProvider.servicoAtual}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Última atualização: {new Date(selectedProvider.ultimaAtualizacao).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
