"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
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
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])

  // Usar o hook para buscar prestadores com atualização automática
  const { providers, stats, loading, error, refetch } = useProviders({
    ativo: true, // Apenas prestadores ativos
    autoRefresh: true,
    refreshInterval: 30000 // Atualiza a cada 30 segundos
  })

  // Fallback para dados mock se não houver prestadores - memoizado para evitar re-renders
  const mockProviders: Provider[] = useMemo(() => [
    {
      id: "mock-1",
      nome: "João Silva",
      telefone: "(27) 99999-1111",
      email: "joao.silva@email.com",
      status: "disponivel" as const,
      localizacao: { lat: -20.3155, lng: -40.3128 },
      ultimaAtualizacao: new Date().toISOString(),
      servicoAtual: null,
      especialidades: ["Limpeza Residencial"],
      avaliacao: 4.8,
      totalServicos: 156
    },
    {
      id: "mock-2", 
      nome: "Maria Santos",
      telefone: "(27) 99999-2222",
      email: "maria.santos@email.com",
      status: "ocupado" as const,
      localizacao: { lat: -20.3255, lng: -40.3228 },
      ultimaAtualizacao: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      servicoAtual: "Limpeza Residencial - Centro",
      especialidades: ["Limpeza Residencial"],
      avaliacao: 4.9,
      totalServicos: 203
    }
  ], [])

  const displayProviders = useMemo(() => {
    return providers.length > 0 ? providers : mockProviders
  }, [providers, mockProviders])

  // Inicializar o mapa
  useEffect(() => {
    if (!mapRef.current || mapLoaded) return

    const initMap = () => {
      // Verificar se o Google Maps está disponível
      if (typeof window !== 'undefined' && window.google && window.google.maps) {
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
        // Fallback: criar mapa mock mais realista
        createMockMap()
        setMapLoaded(true)
      }
    }

    // Tentar carregar Google Maps primeiro
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      initMap()
    } else {
      // Aguardar um pouco para o Google Maps carregar
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined' && window.google && window.google.maps) {
          initMap()
        } else {
          createMockMap()
          setMapLoaded(true)
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [mapLoaded])

  // Criar mapa mock quando Google Maps não estiver disponível - memoizado
  const createMockMap = useCallback(() => {
    if (!mapRef.current) return

    const mapContainer = mapRef.current
    mapContainer.innerHTML = `
      <div class="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden rounded-lg">
        <!-- Grid pattern -->
        <div class="absolute inset-0 opacity-20">
          <div class="grid grid-cols-12 grid-rows-8 h-full">
            ${Array.from({ length: 96 }, (_, i) => 
              `<div class="border border-gray-300"></div>`
            ).join('')}
          </div>
        </div>
        
        <!-- Mock markers for providers -->
        ${displayProviders.map((provider, index) => {
          const colors = {
            disponivel: '#10b981',
            ocupado: '#f59e0b', 
            online: '#3b82f6',
            offline: '#6b7280'
          }
          const color = colors[provider.status] || '#6b7280'
          
          return `
            <div 
              class="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
              style="
                background-color: ${color};
                left: ${20 + (index * 15) % 60}%;
                top: ${30 + (index * 20) % 40}%;
                z-index: 10;
              "
              title="${provider.nome} - ${provider.status}"
              onclick="alert('${provider.nome}\\nStatus: ${provider.status}\\nTelefone: ${provider.telefone}')"
            ></div>
          `
        }).join('')}
        
        <!-- Map info -->
        <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div class="text-sm font-medium text-gray-700">Vitória, ES</div>
          <div class="text-xs text-gray-500">${displayProviders.length} prestadores ativos</div>
        </div>
        
        <!-- Loading indicator -->
        <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <div class="flex items-center gap-2 text-xs text-gray-600">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
        </div>
      </div>
    `
  }, [displayProviders])

  // Atualizar marcadores quando os prestadores mudarem
  useEffect(() => {
    if (!mapLoaded || !displayProviders.length) return

    if (mapInstance && window.google && window.google.maps) {
      // Google Maps está disponível
      // Limpar marcadores existentes usando referência atual
      markers.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null)
        }
      })

      // Adicionar novos marcadores
      const newMarkers: any[] = []
      
      displayProviders.forEach(provider => {
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
    } else if (mapLoaded) {
      // Usar mapa mock - recriar com novos dados
      createMockMap()
    }
  }, [mapInstance, mapLoaded, displayProviders, createMockMap])

  // Cleanup: remover marcadores quando o componente desmontar ou quando markers mudar
  const markersRef = useRef(markers)
  useEffect(() => {
    markersRef.current = markers
  }, [markers])

  useEffect(() => {
    return () => {
      // Limpar marcadores ao desmontar usando ref para evitar dependência
      markersRef.current.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null)
        }
      })
    }
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                <span className="truncate">Rastreamento em Tempo Real</span>
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Localização atual dos prestadores de serviço ativos
              </p>
            </div>
            <button
              onClick={refetch}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors self-start sm:self-auto"
              title="Atualizar localizações"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Estatísticas */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4">
              <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-green-600">{stats.disponivel}</div>
                <div className="text-xs text-green-700">Disponíveis</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-orange-50 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-orange-600">{stats.ocupado}</div>
                <div className="text-xs text-orange-700">Ocupados</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">{stats.online}</div>
                <div className="text-xs text-blue-700">Online</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-gray-600">{stats.total}</div>
                <div className="text-xs text-gray-700">Total</div>
              </div>
            </div>
          )}

          {/* Mapa */}
          <div className="relative">
            <div 
              ref={mapRef} 
              className="w-full h-64 sm:h-80 md:h-96 rounded-lg border"
              style={{ minHeight: '300px' }}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
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
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <User className="h-4 w-4" />
              <span className="truncate">{selectedProvider.nome}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm truncate">{selectedProvider.telefone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statusConfig[selectedProvider.status].color} flex-shrink-0`}></div>
                <Badge className={`${statusConfig[selectedProvider.status].textColor} text-xs`}>
                  {statusConfig[selectedProvider.status].label}
                </Badge>
              </div>

              {selectedProvider.servicoAtual && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Serviço Atual:</p>
                  <p className="text-sm text-gray-600 break-words">{selectedProvider.servicoAtual}</p>
                </div>
              )}

              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Última atualização:</p>
                  <p className="text-xs">{new Date(selectedProvider.ultimaAtualizacao).toLocaleString()}</p>
                </div>
              </div>

              {/* Informações adicionais para mobile */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Avaliação</p>
                  <p className="text-sm font-semibold">{selectedProvider.avaliacao}/5</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Serviços</p>
                  <p className="text-sm font-semibold">{selectedProvider.totalServicos}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
