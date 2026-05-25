"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { collection, getDocs, limit, orderBy, query, Timestamp, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"

export type OperationalAlertStatus = "open" | "acknowledged" | "closed"

export interface OperationalAlertRow {
  id: string
  orderId: string
  protocol?: string
  clientName?: string
  kind: string
  severity: "low" | "medium" | "high" | "critical"
  title: string
  detail: string
  status: OperationalAlertStatus
  createdAt: Date
  sourceMessageId?: string
  createdBy?: string
}

function toDate(value: unknown): Date {
  if (value && typeof (value as { toDate?: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate()
  }
  if (value instanceof Date) return value
  return new Date()
}

// Gera alertas operacionais derivados de pedidos reais (orders collection)
export function useOperationalAlerts(maxDocs = 100) {
  const { user, loading: authLoading } = useAuth()
  const [alerts, setAlerts] = useState<OperationalAlertRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)

  const fetchAlerts = useCallback(async () => {
    if (!db || !user) return

    try {
      const twentyFourHoursAgo = new Date()
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

      const snap = await getDocs(
        query(
          collection(db, "orders"),
          orderBy("createdAt", "desc"),
          limit(maxDocs)
        )
      )

      if (!isMounted.current) return

      const now = new Date()
      const derived: OperationalAlertRow[] = []

      snap.docs.forEach((doc) => {
        const d = doc.data()
        const createdAt = toDate(d.createdAt)
        const ageHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
        const shortId = doc.id.slice(-8)
        const client = d.clientName || d.cliente?.nome || "Cliente"

        // Pedidos de emergência → alerta crítico
        if (d.isEmergency && d.status !== 'completed' && d.status !== 'cancelled') {
          derived.push({
            id: `emergency_${doc.id}`,
            orderId: doc.id,
            protocol: shortId,
            clientName: client,
            kind: "emergency",
            severity: "critical",
            title: `🚨 Pedido de emergência — ${d.serviceType || "Serviço"}`,
            detail: `${client} abriu um pedido de emergência. Endereço: ${d.address || "não informado"}`,
            status: "open",
            createdAt,
          })
        }

        // Pedidos pendentes há mais de 2 horas → alerta alto
        if (d.status === "pending" && ageHours > 2) {
          derived.push({
            id: `stale_${doc.id}`,
            orderId: doc.id,
            protocol: shortId,
            clientName: client,
            kind: "stale_order",
            severity: ageHours > 6 ? "high" : "medium",
            title: `Pedido sem prestador há ${Math.round(ageHours)}h`,
            detail: `${client} aguarda atribuição de prestador para ${d.serviceType || "serviço"}.`,
            status: "open",
            createdAt,
          })
        }

        // Pedidos cancelados nas últimas 2 horas → alerta baixo
        if (d.status === "cancelled" && ageHours <= 2) {
          derived.push({
            id: `cancelled_${doc.id}`,
            orderId: doc.id,
            protocol: shortId,
            clientName: client,
            kind: "cancellation",
            severity: "low",
            title: `Pedido cancelado — ${d.serviceType || "Serviço"}`,
            detail: `Cancelado por: ${d.cancelledBy || "não especificado"}. Motivo: ${d.cancellationReason || "não informado"}`,
            status: "open",
            createdAt,
          })
        }
      })

      // Ordenar por severidade e data
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      derived.sort((a, b) =>
        severityOrder[a.severity] - severityOrder[b.severity] ||
        b.createdAt.getTime() - a.createdAt.getTime()
      )

      setAlerts(derived.slice(0, maxDocs))
      setError(null)
    } catch (err) {
      if (isMounted.current) setError("Erro ao carregar alertas operacionais")
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [user, maxDocs])

  useEffect(() => {
    isMounted.current = true
    if (authLoading) return
    if (!user) { setLoading(false); return }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 2 * 60 * 1000) // atualiza a cada 2 min

    return () => {
      isMounted.current = false
      clearInterval(interval)
    }
  }, [user, authLoading, fetchAlerts])

  const openCount = alerts.filter((a) => a.status === "open").length
  const criticalOpen = alerts.filter((a) => a.status === "open" && a.severity === "critical").length

  return { alerts, loading, error, openCount, criticalOpen, refresh: fetchAlerts }
}
