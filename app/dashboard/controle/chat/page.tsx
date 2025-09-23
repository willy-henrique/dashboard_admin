import { ChatDashboard } from "@/components/chat/chat-dashboard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Monitoramento de Chat - AppServiço",
  description: "Gerencie conversas entre clientes e prestadores de serviço",
}

export default function ChatMonitoringPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <ChatDashboard />
      </div>
    </div>
  )
}
