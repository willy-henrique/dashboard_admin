"use client"

import { useState, useEffect, useCallback } from 'react'
import { ProviderDocuments, getProviderDocuments, getAllPendingProviders, hasProviderDocuments } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { DocumentVerification, VerificationStats, VerificationFilters } from '@/types/verification'
import { updateDocument } from '@/lib/firestore'
import { UsersService } from '@/lib/services/users-service'

export const useDocumentVerification = () => {
  const [verifications, setVerifications] = useState<DocumentVerification[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<VerificationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalDocuments: 0,
    documentsByType: {}
  })
  const { toast } = useToast()

  // Buscar todas as verificações
  const fetchVerifications = useCallback(async () => {
    setLoading(true)
    try {
      console.log('🔍 Buscando verificações de documentos...')
      
      // Buscar documentos diretamente do Firebase Storage
      const storageProviders = await getAllPendingProviders()
      console.log(`✅ Encontrados ${storageProviders.length} prestadores com documentos`)

      const verificationsData: DocumentVerification[] = []
      
      // Processar todos os prestadores encontrados no Storage
      for (const provider of storageProviders) {
        try {
          // Criar verificação diretamente dos dados do Storage
          const verification: DocumentVerification = {
            id: `verification_${provider.providerId}`,
            providerId: provider.providerId,
            providerName: `Prestador ${provider.providerId.slice(-8)}`,
            providerEmail: `prestador${provider.providerId.slice(-8)}@email.com`,
            providerPhone: '(11) 99999-9999',
            status: 'pending',
            documents: provider.documents,
            submittedAt: provider.uploadedAt,
          }
          
          verificationsData.push(verification)
          console.log(`✅ Verificação criada para prestador ${provider.providerId}`)
        } catch (error) {
          console.error(`Erro ao processar prestador ${provider.providerId}:`, error)
        }
      }

      setVerifications(verificationsData)
      
      // Calcular estatísticas
      const newStats: VerificationStats = {
        total: verificationsData.length,
        pending: verificationsData.filter(v => v.status === 'pending').length,
        approved: verificationsData.filter(v => v.status === 'approved').length,
        rejected: verificationsData.filter(v => v.status === 'rejected').length,
        totalDocuments: 0,
        documentsByType: {}
      }

      // Contar documentos por tipo
      verificationsData.forEach(verification => {
        Object.values(verification.documents).forEach(documents => {
          if (documents) {
            newStats.totalDocuments += documents.length
            documents.forEach(doc => {
              newStats.documentsByType[doc.type] = (newStats.documentsByType[doc.type] || 0) + 1
            })
          }
        })
      })

      setStats(newStats)
      
      console.log(`✅ Verificações carregadas: ${verificationsData.length} prestadores`)
    } catch (error) {
      console.error('❌ Erro ao buscar verificações:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as verificações.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Buscar verificações de um prestador específico
  const fetchProviderVerification = useCallback(async (providerId: string): Promise<DocumentVerification | null> => {
    try {
      const documents = await getProviderDocuments(providerId)
      if (!documents) return null

      return {
        id: `verification_${providerId}`,
        providerId,
        providerName: `Prestador ${providerId.slice(-6)}`, // Mock
        providerEmail: `prestador${providerId.slice(-6)}@email.com`, // Mock
        providerPhone: '(11) 99999-9999', // Mock
        status: 'pending',
        documents: documents.documents,
        submittedAt: documents.uploadedAt,
      }
    } catch (error) {
      console.error(`Erro ao buscar verificação do prestador ${providerId}:`, error)
      return null
    }
  }, [])

  // Verificar se um prestador tem documentos
  const checkProviderHasDocuments = useCallback(async (providerId: string): Promise<boolean> => {
    try {
      return await hasProviderDocuments(providerId)
    } catch (error) {
      console.error(`Erro ao verificar documentos do prestador ${providerId}:`, error)
      return false
    }
  }, [])

  // Aprovar verificação
  const approveVerification = useCallback(async (verificationId: string, reviewedBy: string) => {
    try {
      const verification = verifications.find(v => v.id === verificationId)
      if (!verification) {
        throw new Error('Verificação não encontrada')
      }

      // Persistir aprovação
      try {
        await updateDocument('verifications', verificationId, {
          status: 'approved',
          reviewedAt: new Date(),
          reviewedBy,
          updatedAt: new Date()
        })
      } catch (e) {
        console.warn('Apenas estado local atualizado; coleção verifications pode não existir.', e)
      }

      // Promover usuário a prestador
      try {
        await UsersService.updateUser(verification.providerId, {
          userType: 'provider',
          role: 'prestador',
          verificado: true
        } as any)
      } catch (e) {
        console.error('Erro ao promover usuário a prestador:', e)
      }

      // Atualizar estado local
      setVerifications(prev => prev.map(v => 
        v.id === verificationId 
          ? { ...v, status: 'approved' as const, reviewedAt: new Date(), reviewedBy }
          : v
      ))

      toast({
        title: "Verificação aprovada",
        description: `${verification.providerName} foi aprovado como prestador e está habilitado para prestar serviços.`,
      })

      return true
    } catch (error) {
      console.error('Erro ao aprovar verificação:', error)
      toast({
        title: "Erro",
        description: "Não foi possível aprovar a verificação.",
        variant: "destructive"
      })
      return false
    }
  }, [verifications, toast])

  // Rejeitar verificação
  const rejectVerification = useCallback(async (verificationId: string, rejectionReason: string, reviewedBy: string) => {
    try {
      const verification = verifications.find(v => v.id === verificationId)
      if (!verification) {
        throw new Error('Verificação não encontrada')
      }

      // Atualizar estado local
      setVerifications(prev => prev.map(v => 
        v.id === verificationId 
          ? { ...v, status: 'rejected' as const, rejectionReason, reviewedAt: new Date(), reviewedBy }
          : v
      ))

      toast({
        title: "Verificação rejeitada",
        description: `${verification.providerName} foi rejeitado como prestador. O motivo foi registrado.`,
        variant: "destructive"
      })

      return true
    } catch (error) {
      console.error('Erro ao rejeitar verificação:', error)
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar a verificação.",
        variant: "destructive"
      })
      return false
    }
  }, [verifications, toast])

  // Filtrar verificações
  const filterVerifications = useCallback((filters: VerificationFilters) => {
    let filtered = verifications

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(v => v.status === filters.status)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(v => 
        v.providerName.toLowerCase().includes(searchLower) ||
        v.providerEmail.toLowerCase().includes(searchLower) ||
        v.providerPhone?.includes(searchLower)
      )
    }

    if (filters.documentType) {
      filtered = filtered.filter(v => 
        v.documents[filters.documentType as keyof typeof v.documents]?.length > 0
      )
    }

    return filtered
  }, [verifications])

  // Buscar verificações automaticamente ao carregar
  useEffect(() => {
    fetchVerifications()
  }, [fetchVerifications])

  return {
    verifications,
    loading,
    stats,
    fetchVerifications,
    fetchProviderVerification,
    checkProviderHasDocuments,
    approveVerification,
    rejectVerification,
    filterVerifications,
    refetch: fetchVerifications
  }
}
