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

    // Usar a chave da API do ambiente ou fallback
    const key = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo-key'
    
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
