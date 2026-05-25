"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConversationsList } from "@/components/chat/conversations-list"
import { useChatActions, useChatConversations, useChatStats } from "@/hooks/use-chat"
import { useOperationalAlerts } from "@/hooks/use-operational-alerts"
import type { ChatFilter } from "@/types/chat"
import type { LegacyChatConversation } from "@/lib/services/chat-service"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Activity,
  AlertTriangle,
  Bell,
  BellOff,
  Clock,
  Headphones,
  LayoutList,
  MessageSquare,
  Radio,
  ShieldAlert,
} from "lucide-react"

function playSoftBeep() {
  try {
    const w = window as unknown as { webkitAudioContext?: typeof AudioContext; AudioContext: typeof AudioContext }
    const AudioContextClass = w.AudioContext || w.webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 784
    gain.gain.value = 0.06
    osc.start()
    osc.stop(ctx.currentTime + 0.12)
  } catch {
    /* ignore */
  }
}

export function ChatOperationsDashboard() {
  const [protocol, setProtocol] = useState("")
  const [provider, setProvider] = useState("")
  const [opStatus, setOpStatus] = useState("")
  const [priority, setPriority] = useState("all")
  const [status, setStatus] = useState("all")
  const [selectedConversation, setSelectedConversation] = useState<LegacyChatConversation | null>(null)
  const [browserAlerts, setBrowserAlerts] = useState(false)
  const seenAlertIds = useRef<Set<string>>(new Set())
  const bootstrapped = useRef(false)

  const filter = useMemo<ChatFilter>(
    () => ({
      protocolSearch: protocol.trim() || undefined,
      providerSearch: provider.trim() || undefined,
      serviceOperationalStatus: opStatus.trim() || undefined,
      priority: priority === "all" ? undefined : (priority as ChatFilter["priority"]),
      status: status === "all" ? undefined : (status as ChatFilter["status"]),
    }),
    [protocol, provider, opStatus, priority, status]
  )

  const { conversations, loading, error, refresh } = useChatConversations(filter)
  const { stats } = useChatStats()
  const { alerts, loading: alertsLoading, openCount, criticalOpen } = useOperationalAlerts(120)
  const { acknowledgeOperationalAlert } = useChatActions()

  const pendingUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unreadCount?.admin ?? 0), 0),
    [conversations]
  )

  const urgentActive = useMemo(
    () => conversations.filter((c) => c.priority === "urgent" && c.status === "active").length,
    [conversations]
  )

  useEffect(() => {
    if (!browserAlerts || alertsLoading) return
    if (!bootstrapped.current) {
      alerts.forEach((a) => seenAlertIds.current.add(a.id))
      bootstrapped.current = true
      return
    }
    const fresh = alerts.filter((a) => a.status === "open" && !seenAlertIds.current.has(a.id))
    for (const a of fresh) seenAlertIds.current.add(a.id)
    if (fresh.length === 0) return
    playSoftBeep()
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      for (const a of fresh.slice(0, 3)) {
        // eslint-disable-next-line no-new
        new Notification(a.title, { body: a.detail.slice(0, 180), tag: a.id })
      }
    }
  }, [alerts, alertsLoading, browserAlerts])

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return
    const result = await Notification.requestPermission()
    setBrowserAlerts(result === "granted")
  }, [])

  const handleAckAlert = async (id: string) => {
    await acknowledgeOperationalAlert(id, "admin-dashboard")
    seenAlertIds.current.add(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Central operacional de chat</h1>
          <p className="text-muted-foreground">
            KPIs, filtros por cliente/prestador/protocolo/status operacional e fila de alertas em tempo real. Visibilidade por canal exige regras no app cliente/prestador e no Firestore em produção.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant={browserAlerts ? "secondary" : "default"} size="sm" onClick={requestNotificationPermission} className="gap-2">
            {browserAlerts ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            {browserAlerts ? "Notificações ativas" : "Ativar notificações"}
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/controle/chat">Monitor clássico</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              Conversas (filtro)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{loading ? "…" : conversations.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Activity className="h-4 w-4" />
              Ativas (todas)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats?.activeConversations ?? "—"}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              Não lidas (admin)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-orange-600">{pendingUnread}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Urgentes ativas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-red-600">{urgentActive}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Radio className="h-4 w-4" />
              Alertas abertos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{alertsLoading ? "…" : openCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ShieldAlert className="h-4 w-4 text-red-600" />
              Críticos abertos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-red-700">{alertsLoading ? "…" : criticalOpen}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <LayoutList className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 pt-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Protocolo / pedido</p>
            <Input value={protocol} onChange={(e) => setProtocol(e.target.value)} placeholder="Ex.: ABC12345" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Prestador</p>
            <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Nome ou telefone" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Status operacional</p>
            <Input value={opStatus} onChange={(e) => setOpStatus(e.target.value)} placeholder="ex.: em_atendimento" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Prioridade</p>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Status conversa</p>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="closed">Encerrada</SelectItem>
                <SelectItem value="archived">Arquivada</SelectItem>
                <SelectItem value="blocked">Bloqueada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between gap-2 text-lg">
              <span className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Conversas
              </span>
              <Button variant="outline" size="sm" onClick={() => refresh()}>
                Atualizar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[560px] p-0">
            {error ? <p className="p-4 text-sm text-destructive">{error}</p> : null}
            <ConversationsList
              onSelectConversation={setSelectedConversation}
              selectedConversationId={selectedConversation?.id}
              onConversationsLoaded={() => {}}
              conversationsOverride={conversations}
              loadingOverride={loading}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Alertas operacionais</CardTitle>
              <p className="text-sm text-muted-foreground">
                Coleção operationalAlerts — reconhecimento grava acknowledgedAt no documento.
              </p>
            </CardHeader>
            <CardContent className="max-h-[360px] space-y-3 overflow-y-auto pt-4">
              {alertsLoading ? <p className="text-sm text-muted-foreground">Carregando…</p> : null}
              {alerts.length === 0 && !alertsLoading ? (
                <p className="text-sm text-muted-foreground">Nenhum alerta. Crie pelo monitor de chat ou via backend.</p>
              ) : null}
              {alerts.map((a) => (
                <div key={a.id} className="rounded-lg border bg-card p-3 text-sm shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={a.severity === "critical" ? "destructive" : "secondary"}>{a.severity}</Badge>
                      <Badge variant="outline">{a.kind}</Badge>
                      <Badge variant={a.status === "open" ? "default" : "outline"}>{a.status}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(a.createdAt, { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                  <p className="mt-2 font-medium">{a.title}</p>
                  <p className="text-muted-foreground">{a.detail}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/controle/chat?orderId=${encodeURIComponent(a.orderId)}`}>Abrir chat</Link>
                    </Button>
                    {a.status === "open" ? (
                      <Button size="sm" onClick={() => handleAckAlert(a.id)}>
                        Reconhecer
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedConversation ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Seleção</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Cliente:</span> {selectedConversation.clientName}
                </p>
                <p>
                  <span className="text-muted-foreground">Telefone:</span> {selectedConversation.clientPhone || "—"}
                </p>
                {selectedConversation.providerName ? (
                  <p>
                    <span className="text-muted-foreground">Prestador:</span> {selectedConversation.providerName}{" "}
                    {selectedConversation.providerPhone ? `· ${selectedConversation.providerPhone}` : ""}
                  </p>
                ) : (
                  <p className="text-muted-foreground">Prestador não associado neste pedido.</p>
                )}
                <p>
                  <span className="text-muted-foreground">Protocolo:</span> {selectedConversation.orderProtocol || selectedConversation.orderId}
                </p>
                {selectedConversation.serviceOperationalStatus ? (
                  <p>
                    <span className="text-muted-foreground">Status operacional:</span> {selectedConversation.serviceOperationalStatus}
                  </p>
                ) : null}
                <Button asChild className="mt-2 w-full sm:w-auto">
                  <Link
                    href={`/dashboard/controle/chat?orderId=${encodeURIComponent(selectedConversation.orderId)}&protocolo=${encodeURIComponent(
                      String(selectedConversation.orderProtocol || selectedConversation.orderId)
                    )}`}
                  >
                    Abrir thread completo
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}
