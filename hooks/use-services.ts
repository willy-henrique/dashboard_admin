"use client"

import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs, where, Timestamp, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Servico } from '@/types'

interface ServiceStats {
  total: number
  pendentes: number
  emAndamento: number
  concluidos: number
  orcamentos: number
  agendados: number
  aceitos: number
  aguardando: number
  naoEnviados: number
  cancelados: number
}

interface ServiceFilters {
  status?: string
  prioridade?: string
  cidade?: string
  dataInicio?: Date
  dataFim?: Date
  responsavel?: string
}

export function useServices(filters?: ServiceFilters) {
  const [services, setServices] = useState<Servico[]>([])
  const [stats, setStats] = useState<ServiceStats>({
    total: 0,
    pendentes: 0,
    emAndamento: 0,
    concluidos: 0,
    orcamentos: 0,
    agendados: 0,
    aceitos: 0,
    aguardando: 0,
    naoEnviados: 0,
    cancelados: 0
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async () => {
    if (!db) {
      setError('Firebase não inicializado')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Construir query base
      let q = query(collection(db, 'servicos'), orderBy('createdAt', 'desc'))

      // Aplicar filtros se fornecidos
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status))
      }
      if (filters?.prioridade) {
        q = query(q, where('prioridade', '==', filters.prioridade))
      }
      if (filters?.cidade) {
        q = query(q, where('cidade', '==', filters.cidade))
      }
      if (filters?.dataInicio) {
        q = query(q, where('dataHora', '>=', Timestamp.fromDate(filters.dataInicio)))
      }
      if (filters?.dataFim) {
        q = query(q, where('dataHora', '<=', Timestamp.fromDate(filters.dataFim)))
      }
      if (filters?.responsavel) {
        q = query(q, where('responsavel', '==', filters.responsavel))
      }

      const snapshot = await getDocs(q)
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        dataHora: doc.data().dataHora?.toDate() || new Date(),
      })) as Servico[]

      setServices(servicesData)
      calculateStats(servicesData)

    } catch (err) {
      console.error('Erro ao buscar serviços:', err)
      setError('Erro ao carregar serviços')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (servicesData: Servico[]) => {
    const newStats: ServiceStats = {
      total: servicesData.length,
      pendentes: 0,
      emAndamento: 0,
      concluidos: 0,
      orcamentos: 0,
      agendados: 0,
      aceitos: 0,
      aguardando: 0,
      naoEnviados: 0,
      cancelados: 0
    }

    servicesData.forEach(service => {
      switch (service.status) {
        case 'agendado':
          newStats.agendados++
          break
        case 'aceito':
          newStats.aceitos++
          break
        case 'aguardando':
          newStats.aguardando++
          break
        case 'nao_enviado':
          newStats.naoEnviados++
          break
        case 'em_andamento':
          newStats.emAndamento++
          break
        case 'concluido':
          newStats.concluidos++
          break
        case 'cancelado':
          newStats.cancelados++
          break
      }
    })

    // Calcular pendentes (agendado + aceito + aguardando + nao_enviado)
    newStats.pendentes = newStats.agendados + newStats.aceitos + newStats.aguardando + newStats.naoEnviados

    // Orçamentos são serviços com status específico ou campo separado
    // Por enquanto, vamos considerar como serviços agendados
    newStats.orcamentos = newStats.agendados

    setStats(newStats)
  }

  const subscribeToServices = () => {
    if (!db) return

    const q = query(collection(db, 'servicos'), orderBy('createdAt', 'desc'))
    
    return onSnapshot(q, 
      (snapshot) => {
        const servicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          dataHora: doc.data().dataHora?.toDate() || new Date(),
        })) as Servico[]

        setServices(servicesData)
        calculateStats(servicesData)
        setLoading(false)
      },
      (error) => {
        console.error('Erro ao escutar serviços:', error)
        setError('Erro ao carregar serviços em tempo real')
        setLoading(false)
      }
    )
  }

  useEffect(() => {
    const unsubscribe = subscribeToServices()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [filters])

  const updateServiceStatus = async (serviceId: string, newStatus: string) => {
    if (!db) return

    try {
      const serviceRef = doc(db, 'servicos', serviceId)
      await updateDoc(serviceRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao atualizar status do serviço:', error)
      throw error
    }
  }

  const createService = async (serviceData: Omit<Servico, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!db) return

    try {
      const docRef = await addDoc(collection(db, 'servicos'), {
        ...serviceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar serviço:', error)
      throw error
    }
  }

  const deleteService = async (serviceId: string) => {
    if (!db) return

    try {
      await deleteDoc(doc(db, 'servicos', serviceId))
    } catch (error) {
      console.error('Erro ao deletar serviço:', error)
      throw error
    }
  }

  return {
    services,
    stats,
    loading,
    error,
    refetch: fetchServices,
    updateServiceStatus,
    createService,
    deleteService
  }
}
