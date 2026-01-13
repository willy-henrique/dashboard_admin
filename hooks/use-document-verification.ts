"use client"

import { useState, useEffect, useCallback } from 'react'
import { ProviderDocuments, getProviderDocuments, getAllPendingProviders, hasProviderDocuments } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { DocumentVerification, VerificationStats, VerificationFilters } from '@/types/verification'
import { db } from '@/lib/firebase'
import { doc, getDoc, collection, query, where, getDocs, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore'

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

  const mapStatus = (status: any): 'pending' | 'approved' | 'rejected' => {
    if (!status) return 'pending'
    const s = String(status).toUpperCase()
    if (s === 'APPROVED' || s === 'APPROVADO' || s === 'APPROVED_STATUS') return 'approved'
    if (s === 'REJECTED' || s === 'REJEITADO') return 'rejected'
    // UNDER_REVIEW, PENDING, etc
    return 'pending'
  }

  // Buscar todas as verificações
  const fetchVerifications = useCallback(async () => {
    setLoading(true)
    try {
      console.log('🔍 Buscando verificações de documentos...')
      
      // Buscar documentos diretamente do Firebase Storage
      let storageProviders: ProviderDocuments[] = []
      try {
        storageProviders = await getAllPendingProviders()
        console.log(`✅ Encontrados ${storageProviders.length} prestadores com documentos`)
      } catch (storageError: any) {
        console.error('❌ Erro ao buscar documentos do Storage:', {
          code: storageError?.code,
          message: storageError?.message
        })
        
        // Se for erro de Storage, mostra mensagem específica
        if (storageError?.code?.includes('storage')) {
          toast({
            title: "Erro no Firebase Storage",
            description: "Não foi possível acessar os documentos. Verifique as permissões do Storage.",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível carregar os documentos do Storage.",
            variant: "destructive"
          })
        }
        
        // Continua mesmo com erro, mas sem documentos
        storageProviders = []
      }

      // Se não houver prestadores, retorna vazio
      if (storageProviders.length === 0) {
        setVerifications([])
        setStats({
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          totalDocuments: 0,
          documentsByType: {}
        })
        return
      }

      // Processar todos os prestadores em paralelo para acelerar
      const verificationsDataArray = await Promise.allSettled(
        storageProviders.map(async (provider) => {
          try {
            // Busca em providers primeiro; se não existir, busca em users
            let userData: any = null
            let dataSource = ''

            try {
              const providerSnap = await getDoc(doc(db, 'providers', provider.providerId))
              if (providerSnap.exists()) {
                userData = providerSnap.data()
                dataSource = 'providers'
              } else {
                const userSnap = await getDoc(doc(db, 'users', provider.providerId))
                if (userSnap.exists()) {
                  userData = userSnap.data()
                  dataSource = 'users'
                }
              }
            } catch (dbError) {
              console.warn(`⚠️ Erro ao buscar dados do Firestore para ${provider.providerId}:`, dbError)
              // Continua mesmo sem dados do Firestore
            }

            // Buscar status atual em provider_verifications
            let currentStatus: 'pending' | 'approved' | 'rejected' = 'pending'
            let submittedAtOverride: Date | undefined
            
            try {
              const verificationsRef = collection(db, 'provider_verifications')
              const statusSnap = await getDocs(query(verificationsRef, where('providerId', '==', provider.providerId)))
              if (!statusSnap.empty) {
                const vData = statusSnap.docs[0].data() as any
                currentStatus = mapStatus(vData?.status)
                if (vData?.submittedAt?.toDate) {
                  submittedAtOverride = vData.submittedAt.toDate()
                }
              } else if (userData?.verificationStatus) {
                currentStatus = mapStatus(userData.verificationStatus)
              }
            } catch (statusError) {
              console.warn(`⚠️ Erro ao buscar status para ${provider.providerId}:`, statusError)
              // Continua com status padrão 'pending'
            }

            const verification: DocumentVerification = {
              id: `verification_${provider.providerId}`,
              providerId: provider.providerId,
              providerName: userData?.fullName || userData?.nome || userData?.displayName || `Prestador ${provider.providerId.slice(-8)}`,
              providerEmail: userData?.email || `prestador${provider.providerId.slice(-8)}@email.com`,
              providerPhone: userData?.phone || userData?.telefone || userData?.phoneNumber || '',
              providerCpf: userData?.cpf || userData?.document || '',
              providerRg: userData?.rg || '',
              providerAddress: typeof userData?.address === 'string' ? userData.address : 
                             typeof userData?.address === 'object' && userData?.address ? 
                             `${userData.address.street || ''} ${userData.address.number || ''}, ${userData.address.city || ''}, ${userData.address.state || ''}`.trim().replace(/,$/, '') :
                             userData?.endereco || '',
              providerBirthDate: userData?.birthDate || userData?.dataNascimento || '',
              status: currentStatus,
              documents: provider.documents,
              submittedAt: submittedAtOverride || provider.firstUploadedAt || provider.uploadedAt,
            }

            return verification
          } catch (error: any) {
            console.error(`❌ Erro ao processar prestador ${provider.providerId}:`, {
              code: error?.code,
              message: error?.message
            })
            return null
          }
        })
      )

      // Filtrar apenas resultados bem-sucedidos
      const verificationsData: DocumentVerification[] = verificationsDataArray
        .filter((result): result is PromiseFulfilledResult<DocumentVerification | null> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value!)
        .filter((v): v is DocumentVerification => v !== null)

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
    } catch (error: any) {
      console.error('❌ Erro ao buscar verificações:', {
        code: error?.code,
        message: error?.message,
        stack: error?.stack
      })
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível carregar as verificações.",
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

      // Buscar dados reais do prestador no Firestore (collection 'providers')
      let userData = null
      const providerDoc = await getDoc(doc(db, 'providers', providerId))
      if (providerDoc.exists()) {
        userData = providerDoc.data()
      } else {
        // Tentar buscar na collection 'users' como fallback
        const userDoc = await getDoc(doc(db, 'users', providerId))
        if (userDoc.exists()) {
          userData = userDoc.data()
        }
      }

      return {
        id: `verification_${providerId}`,
        providerId,
        providerName: userData?.fullName || userData?.nome || userData?.displayName || `Prestador ${providerId.slice(-6)}`,
        providerEmail: userData?.email || `prestador${providerId.slice(-6)}@email.com`,
        providerPhone: userData?.phone || userData?.telefone || userData?.phoneNumber || '',
        providerCpf: userData?.cpf || userData?.document || '',
        providerRg: userData?.rg || '',
        providerAddress: typeof userData?.address === 'string' ? userData.address : 
                       typeof userData?.address === 'object' && userData?.address ? 
                       `${userData.address.street || ''} ${userData.address.number || ''}, ${userData.address.city || ''}, ${userData.address.state || ''}`.trim().replace(/,$/, '') :
                       userData?.endereco || '',
        providerBirthDate: userData?.birthDate || userData?.dataNascimento || '',
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

      // Persistir no Firestore
      if (!db) throw new Error('Firestore não inicializado')

      // 1) Atualizar/registrar em provider_verifications (status em UPPERCASE)
      const verificationsRef = collection(db, 'provider_verifications')
      const q = query(verificationsRef, where('providerId', '==', verification.providerId))
      const snap = await getDocs(q)

      if (!snap.empty) {
        // Atualiza o(s) documento(s) existente(s)
        await Promise.all(
          snap.docs.map(d => updateDoc(d.ref, {
            status: 'APPROVED',
            reviewedAt: serverTimestamp(),
            reviewedBy,
          }))
        )
      } else {
        // Cria um novo registro se não existir
        await addDoc(verificationsRef, {
          providerId: verification.providerId,
          status: 'APPROVED',
          createdAt: serverTimestamp(),
          submittedAt: verification.submittedAt || serverTimestamp(),
          reviewedAt: serverTimestamp(),
          reviewedBy,
          id: verificationId,
          notes: '',
        })
      }

      // 2) Atualizar provider (status em lowercase)
      const providerRef = doc(db, 'providers', verification.providerId)
      const providerSnap = await getDoc(providerRef)
      if (providerSnap.exists()) {
        await updateDoc(providerRef, {
          verificationStatus: 'approved',
          isVerified: true,
          updatedAt: serverTimestamp(),
        })
      } else {
        // fallback: tentar em users se for esse o cadastro ativo
        const userRef = doc(db, 'users', verification.providerId)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          await updateDoc(userRef, {
            verificationStatus: 'approved',
            isVerified: true,
            updatedAt: serverTimestamp(),
          })
        }
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

      // Persistir no Firestore
      if (!db) throw new Error('Firestore não inicializado')

      // 1) Atualizar/registrar em provider_verifications (status em UPPERCASE)
      const verificationsRef = collection(db, 'provider_verifications')
      const q = query(verificationsRef, where('providerId', '==', verification.providerId))
      const snap = await getDocs(q)

      if (!snap.empty) {
        await Promise.all(
          snap.docs.map(d => updateDoc(d.ref, {
            status: 'REJECTED',
            reviewedAt: serverTimestamp(),
            reviewedBy,
            rejectionReason,
          }))
        )
      } else {
        await addDoc(verificationsRef, {
          providerId: verification.providerId,
          status: 'REJECTED',
          createdAt: serverTimestamp(),
          submittedAt: verification.submittedAt || serverTimestamp(),
          reviewedAt: serverTimestamp(),
          reviewedBy,
          id: verificationId,
          notes: '',
          rejectionReason,
        })
      }

      // 2) Atualizar provider (status em lowercase)
      const providerRef = doc(db, 'providers', verification.providerId)
      const providerSnap = await getDoc(providerRef)
      if (providerSnap.exists()) {
        await updateDoc(providerRef, {
          verificationStatus: 'rejected',
          updatedAt: serverTimestamp(),
        })
      } else {
        const userRef = doc(db, 'users', verification.providerId)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          await updateDoc(userRef, {
            verificationStatus: 'rejected',
            updatedAt: serverTimestamp(),
          })
        }
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
        v.providerPhone?.includes(searchLower) ||
        v.providerCpf?.toLowerCase().includes(searchLower) ||
        v.providerRg?.toLowerCase().includes(searchLower)
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
