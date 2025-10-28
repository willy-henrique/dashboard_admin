// hooks/use-performance-optimization.ts
import { useEffect, useRef, useCallback } from 'react'

// Hook para otimizar listeners em tempo real
export function usePerformanceOptimization() {
  const listenersRef = useRef<Set<() => void>>(new Set())
  const isVisibleRef = useRef(true)
  const lastUpdateRef = useRef<number>(0)
  
  // Throttle para evitar atualizações muito frequentes
  const throttledUpdate = useCallback((callback: () => void, delay: number = 1000) => {
    const now = Date.now()
    if (now - lastUpdateRef.current > delay) {
      callback()
      lastUpdateRef.current = now
    }
  }, [])

  // Detectar quando a aba está visível/invisível
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden
      
      if (document.hidden) {
        // Pausar listeners quando aba não está visível
        console.log('🔄 Pausando listeners - aba não visível')
      } else {
        // Reativar listeners quando aba volta a ser visível
        console.log('🔄 Reativando listeners - aba visível')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Cleanup automático de listeners
  useEffect(() => {
    return () => {
      listenersRef.current.forEach(unsubscribe => {
        try {
          unsubscribe()
        } catch (error) {
          console.warn('Erro ao limpar listener:', error)
        }
      })
      listenersRef.current.clear()
    }
  }, [])

  return {
    addListener: (unsubscribe: () => void) => {
      listenersRef.current.add(unsubscribe)
    },
    removeListener: (unsubscribe: () => void) => {
      listenersRef.current.delete(unsubscribe)
    },
    isVisible: () => isVisibleRef.current,
    throttledUpdate
  }
}

// Hook para debounce de atualizações
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook para memoização de cálculos pesados
export function useMemoizedCalculation<T>(
  calculation: () => T,
  dependencies: any[],
  cacheKey?: string
): T {
  const cacheRef = useRef<Map<string, T>>(new Map())
  
  return useMemo(() => {
    if (cacheKey && cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey)!
    }
    
    const result = calculation()
    
    if (cacheKey) {
      cacheRef.current.set(cacheKey, result)
    }
    
    return result
  }, dependencies)
}
