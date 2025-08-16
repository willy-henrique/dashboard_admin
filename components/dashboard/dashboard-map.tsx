"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix para ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

const mockServices = [
  {
    id: 1,
    title: "Serviço #1234",
    lat: -23.5505,
    lng: -46.6333,
    status: "em_andamento",
    profissional: "João Silva",
  },
  {
    id: 2,
    title: "Serviço #1235",
    lat: -23.5605,
    lng: -46.6433,
    status: "aguardando",
    profissional: "Maria Santos",
  },
  {
    id: 3,
    title: "Serviço #1236",
    lat: -23.5405,
    lng: -46.6233,
    status: "concluido",
    profissional: "Carlos Lima",
  },
  {
    id: 4,
    title: "Serviço #1237",
    lat: -23.5705,
    lng: -46.6533,
    status: "em_andamento",
    profissional: "Ana Costa",
  },
]

const statusColors = {
  agendado: "#6b7280",
  aceito: "#16a34a",
  aguardando: "#f59e0b",
  nao_enviado: "#6b7280",
  em_andamento: "#3b82f6",
  concluido: "#059669",
  cancelado: "#ef4444",
}

export function DashboardMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Criar mapa
    const map = L.map(mapRef.current).setView([-23.5505, -46.6333], 12)

    // Adicionar tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Adicionar marcadores
    mockServices.forEach((service) => {
      const marker = L.marker([service.lat, service.lng])
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${service.title}</h3>
            <p class="text-xs text-gray-600">Profissional: ${service.profissional}</p>
            <p class="text-xs text-gray-600">Status: ${service.status}</p>
          </div>
        `)

      // Personalizar ícone baseado no status
      const statusColor = statusColors[service.status as keyof typeof statusColors]
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: 12px;
          height: 12px;
          background-color: ${statusColor};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      })

      marker.setIcon(customIcon)
    })

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <div ref={mapRef} className="h-64 w-full rounded-lg border" />
      
      {/* Legenda */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <span>Agendado</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
          <span>Aceito</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>Aguardando</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Em Andamento</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
          <span>Concluído</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Cancelado</span>
        </div>
      </div>
    </div>
  )
}
