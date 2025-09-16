"use client"

import { useEffect } from 'react'

declare global {
  interface Window {
    google: any
    initGoogleMaps: () => void
  }
}

interface GoogleMapsLoaderProps {
  apiKey?: string
}

export function GoogleMapsLoader({ apiKey }: GoogleMapsLoaderProps) {
  useEffect(() => {
    // Verificar se o Google Maps já foi carregado
    if (window.google && window.google.maps) {
      return
    }

    // Usar a chave da API do ambiente (sem fallback em produção)
    const isProd = process.env.NODE_ENV === 'production'
    const key = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (isProd && !key) {
      console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ausente em produção')
      return
    }
    
    // Carregar o script do Google Maps
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      console.log('Google Maps carregado com sucesso')
    }
    
    script.onerror = () => {
      console.error('Erro ao carregar Google Maps')
    }

    document.head.appendChild(script)

    return () => {
      // Limpar o script quando o componente for desmontado
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`)
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [apiKey])

  return null
}
