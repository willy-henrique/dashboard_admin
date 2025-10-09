"use client"

import { ChatDashboard } from "@/components/chat/chat-dashboard"
import { useSearchParams } from "next/navigation"

export default function ChatMonitoringPage() {
  const searchParams = useSearchParams()
  const protocolo = searchParams.get('protocolo')
  const servicoId = searchParams.get('servico')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <ChatDashboard 
          initialProtocolo={protocolo} 
          initialServicoId={servicoId}
        />
      </div>
    </div>
  )
}
