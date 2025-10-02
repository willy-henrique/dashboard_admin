"use client"

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface RecentActivity {
  id: string
  type: 'order_completed' | 'new_provider' | 'order_cancelled' | 'payment_received' | 'new_order' | 'new_client' | 'rating_received' | 'message_received' | 'provider_verified'
  title: string
  description: string
  timestamp: Timestamp
  time: string
  metadata?: {
    orderId?: string
    providerId?: string
    clientId?: string
    amount?: number
    rating?: number
    messageId?: string
  }
}

export const useRecentActivities = () => {
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!db) {
      console.warn('Firestore não inicializado')
      setLoading(false)
      return
    }

    const activitiesRef = collection(db, 'activities')
    const q = query(
      activitiesRef,
      orderBy('timestamp', 'desc'),
      limit(20)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const activitiesData: RecentActivity[] = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            time: formatDistanceToNow(data.timestamp?.toDate() || new Date(), {
              addSuffix: true,
              locale: ptBR
            })
          } as RecentActivity
        })
        
        setActivities(activitiesData)
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.error('Erro ao buscar atividades:', error)
        setError('Erro ao carregar atividades')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const addActivity = async (activity: Omit<RecentActivity, 'id' | 'time'>) => {
    if (!db) return

    try {
      const activitiesRef = collection(db, 'activities')
      await import('firebase/firestore').then(({ addDoc, Timestamp }) => {
        addDoc(activitiesRef, {
          ...activity,
          timestamp: Timestamp.now()
        })
      })
    } catch (error) {
      console.error('Erro ao adicionar atividade:', error)
    }
  }

  return {
    activities,
    loading,
    error,
    addActivity
  }
}
