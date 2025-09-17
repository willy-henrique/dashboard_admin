"use client"

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface AnalyticsData {
  activeUsers: number
  pageViews: number
  userActions: number
  businessEvents: number
  financialActions: number
  orderActions: number
  providerActions: number
  reportsGenerated: number
  errors: number
}

interface TimeSeriesData {
  date: string
  value: number
  category: string
}

interface TopPages {
  page: string
  views: number
}

interface UserActivity {
  action: string
  count: number
  category: string
}

export function useFirebaseAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    activeUsers: 0,
    pageViews: 0,
    userActions: 0,
    businessEvents: 0,
    financialActions: 0,
    orderActions: 0,
    providerActions: 0,
    reportsGenerated: 0,
    errors: 0
  })
  
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [topPages, setTopPages] = useState<TopPages[]>([])
  const [userActivity, setUserActivity] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalyticsData = async () => {
    if (!db) {
      setError('Firebase não inicializado')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Buscar eventos dos últimos 30 dias
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const eventsRef = collection(db, 'analytics_events')
      const q = query(
        eventsRef,
        where('timestamp', '>=', Timestamp.fromDate(thirtyDaysAgo)),
        orderBy('timestamp', 'desc')
      )

      const snapshot = await getDocs(q)
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Processar dados
      const processedData = processAnalyticsEvents(events)
      setAnalyticsData(processedData.analyticsData)
      setTimeSeriesData(processedData.timeSeriesData)
      setTopPages(processedData.topPages)
      setUserActivity(processedData.userActivity)

    } catch (err) {
      console.error('Erro ao buscar dados do analytics:', err)
      setError('Erro ao carregar dados do analytics')
    } finally {
      setLoading(false)
    }
  }

  const processAnalyticsEvents = (events: any[]) => {
    const analyticsData: AnalyticsData = {
      activeUsers: 0,
      pageViews: 0,
      userActions: 0,
      businessEvents: 0,
      financialActions: 0,
      orderActions: 0,
      providerActions: 0,
      reportsGenerated: 0,
      errors: 0
    }

    const timeSeriesMap = new Map<string, { [key: string]: number }>()
    const pageViewsMap = new Map<string, number>()
    const userActivityMap = new Map<string, { count: number, category: string }>()

    // Processar cada evento
    events.forEach(event => {
      const eventName = event.eventName || event.event_name
      const timestamp = event.timestamp?.toDate() || new Date()
      const dateKey = timestamp.toISOString().split('T')[0]

      // Contar eventos por tipo
      switch (eventName) {
        case 'page_view':
          analyticsData.pageViews++
          const page = event.page_name || event.page
          if (page) {
            pageViewsMap.set(page, (pageViewsMap.get(page) || 0) + 1)
          }
          break
        case 'user_action':
          analyticsData.userActions++
          const action = event.action
          if (action) {
            const key = `${action}_${event.category || 'general'}`
            const existing = userActivityMap.get(key) || { count: 0, category: event.category || 'general' }
            userActivityMap.set(key, { ...existing, count: existing.count + 1 })
          }
          break
        case 'business_event':
          analyticsData.businessEvents++
          break
        case 'financial_action':
          analyticsData.financialActions++
          break
        case 'order_action':
          analyticsData.orderActions++
          break
        case 'provider_action':
          analyticsData.providerActions++
          break
        case 'report_generated':
          analyticsData.reportsGenerated++
          break
        case 'error_occurred':
          analyticsData.errors++
          break
      }

      // Dados de série temporal
      if (!timeSeriesMap.has(dateKey)) {
        timeSeriesMap.set(dateKey, { pageViews: 0, userActions: 0, businessEvents: 0 })
      }
      const dayData = timeSeriesMap.get(dateKey)!
      
      if (eventName === 'page_view') dayData.pageViews++
      if (eventName === 'user_action') dayData.userActions++
      if (eventName === 'business_event') dayData.businessEvents++
    })

    // Converter dados de série temporal
    const timeSeriesData: TimeSeriesData[] = []
    timeSeriesMap.forEach((data, date) => {
      Object.entries(data).forEach(([category, value]) => {
        timeSeriesData.push({ date, value, category })
      })
    })

    // Converter páginas mais visitadas
    const topPages: TopPages[] = Array.from(pageViewsMap.entries())
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Converter atividade do usuário
    const userActivity: UserActivity[] = Array.from(userActivityMap.entries())
      .map(([key, data]) => ({
        action: key.split('_')[0],
        count: data.count,
        category: data.category
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Calcular usuários únicos (simulação)
    analyticsData.activeUsers = Math.min(analyticsData.pageViews, events.length)

    return {
      analyticsData,
      timeSeriesData: timeSeriesData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      topPages,
      userActivity
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    analyticsData,
    timeSeriesData,
    topPages,
    userActivity,
    loading,
    error,
    refetch: fetchAnalyticsData
  }
}
