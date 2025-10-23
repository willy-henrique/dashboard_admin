"use client"

import { useState, useEffect } from 'react'
import { PagarmeService } from '@/lib/services/pagarme-service'

export interface PagarmeAnalyticsData {
  totalRevenue: number
  totalTransactions: number
  successRate: number
  conversionRate: number
  paymentMethods: {
    credit_card: number
    debit_card: number
    pix: number
    boleto: number
  }
  recentCharges: any[]
  loading: boolean
  error: string | null
}

export function usePagarmeAnalytics() {
  const [data, setData] = useState<PagarmeAnalyticsData>({
    totalRevenue: 0,
    totalTransactions: 0,
    successRate: 0,
    conversionRate: 0,
    paymentMethods: {
      credit_card: 0,
      debit_card: 0,
      pix: 0,
      boleto: 0,
    },
    recentCharges: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))
        
        const pagarmeService = new PagarmeService()
        
        // Buscar analytics dos últimos 30 dias
        const endDate = new Date().toISOString().split('T')[0]
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        
        const analytics = await pagarmeService.getAnalytics(startDate, endDate)
        
        // Buscar cobranças recentes
        const chargesResponse = await pagarmeService.listCharges({
          page: 1,
          size: 10,
          created_since: startDate,
          created_until: endDate,
        })
        
        setData({
          totalRevenue: analytics.totalRevenue,
          totalTransactions: analytics.totalTransactions,
          successRate: analytics.successRate,
          conversionRate: analytics.conversionRate,
          paymentMethods: analytics.paymentMethods,
          recentCharges: chargesResponse.data || [],
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error('Erro ao buscar analytics do Pagar.me:', error)
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Erro ao carregar dados financeiros'
        }))
      }
    }

    fetchAnalytics()
  }, [])

  return data
}
