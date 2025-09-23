"use client"

import { useChatConversations } from "@/hooks/use-chat"
import { LegacyChatConversation } from "@/lib/services/chat-service"

export function DebugConversations() {
  const { conversations, loading, error } = useChatConversations({})

  console.log('🔍 DebugConversations - Estado atual:')
  console.log('- Loading:', loading)
  console.log('- Error:', error)
  console.log('- Conversations count:', conversations.length)
  console.log('- Conversations data:', conversations)

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-bold text-yellow-800 mb-2">Debug - Estado das Conversas</h3>
      <div className="text-sm text-yellow-700 space-y-1">
        <div>Loading: {loading ? '✅ Sim' : '❌ Não'}</div>
        <div>Error: {error || '❌ Nenhum'}</div>
        <div>Conversas encontradas: {conversations.length}</div>
        {conversations.length > 0 && (
          <div>
            <div>Primeira conversa:</div>
            <pre className="text-xs bg-yellow-100 p-2 rounded mt-1 overflow-auto">
              {JSON.stringify(conversations[0], null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
