"use client"

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface RealtimeMetric {
  id: string
  timestamp: Date
  eventName: string
  parameters: Record<string, any>
  userId?: string
  sessionId?: string
}

interface RealtimeStats {
  totalEvents: number
  eventsLastHour: number
  activeUsers: number
  topEvents: Array<{ eventName: string; count: number }>
  recentEvents: RealtimeMetric[]
}

export function useRealtimeAnalytics() {
  const [stats, setStats] = useState<RealtimeStats>({
    totalEvents: 0,
    eventsLastHour: 0,
    activeUsers: 0,
    topEvents: [],
    recentEvents: []
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!db) {
      setError('Firebase não inicializado')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Buscar eventos das últimas 24 horas
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)
    
    const eventsRef = collection(db, 'analytics_events')
    const q = query(
      eventsRef,
      where('timestamp', '>=', Timestamp.fromDate(oneDayAgo)),
      orderBy('timestamp', 'desc'),
      limit(100)
    )

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const events = snapshot.docs.map(doc => ({
          id: doc.id,
          timestamp: doc.data().timestamp?.toDate() || new Date(),
          eventName: doc.data().event_name || doc.data().eventName,
          parameters: doc.data().parameters || {},
          userId: doc.data().user_id || doc.data().userId,
          sessionId: doc.data().session_id || doc.data().sessionId,
        }))

        // Calcular estatísticas em tempo real
        const now = new Date()
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

        const eventsLastHour = events.filter(event => 
          event.timestamp >= oneHourAgo
        ).length

        const uniqueUsers = new Set(events.map(event => event.userId).filter(Boolean))
        const activeUsers = uniqueUsers.size

        // Top eventos
        const eventCounts = new Map<string, number>()
        events.forEach(event => {
          const count = eventCounts.get(event.eventName) || 0
          eventCounts.set(event.eventName, count + 1)
        })

        const topEvents = Array.from(eventCounts.entries())
          .map(([eventName, count]) => ({ eventName, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        setStats({
          totalEvents: events.length,
          eventsLastHour,
          activeUsers,
          topEvents,
          recentEvents: events.slice(0, 10)
        })

        setLoading(false)
      },
      (error) => {
        console.error('Erro ao escutar eventos em tempo real:', error)
        setError('Erro ao carregar dados em tempo real')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return {
    stats,
    loading,
    error
  }
}
