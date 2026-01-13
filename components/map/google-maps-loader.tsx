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

    // Usar a chave da API do ambiente
    const key = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    // Validar se a chave existe e não é um placeholder
    if (!key || key.trim() === '' || key.includes('your_google_maps_api_key') || key.includes('your_') || key.length < 20) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('⚠️ Google Maps API Key não configurada ou inválida. O mapa mock será usado.')
        console.warn('⚠️ Para configurar, adicione NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no .env.local')
        console.warn('⚠️ Obtenha uma chave em: https://console.cloud.google.com/google/maps-apis/credentials')
      }
      return
    }
    
    // Verificar se o script já foi adicionado
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`)
    if (existingScript) {
      return
    }
    
    // Carregar o script do Google Maps
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&loading=async`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Google Maps carregado com sucesso')
      }
    }
    
    script.onerror = () => {
      console.error('❌ Erro ao carregar Google Maps. Verifique se a chave da API é válida.')
      console.error('❌ Certifique-se de que a chave está habilitada para "Maps JavaScript API" no Google Cloud Console')
    }

    // Adicionar handler para erros de chave inválida
    window.addEventListener('error', (event) => {
      if (event.message && event.message.includes('InvalidKeyMapError')) {
        console.error('❌ Google Maps API Key inválida. Verifique a chave no Google Cloud Console.')
        console.error('❌ Certifique-se de que a chave está habilitada para "Maps JavaScript API"')
      }
    }, { once: true })

    document.head.appendChild(script)

    return () => {
      // Limpar o script quando o componente for desmontado
      const scriptToRemove = document.querySelector(`script[src*="maps.googleapis.com"]`)
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove)
      }
    }
  }, [apiKey])

  return null
}
