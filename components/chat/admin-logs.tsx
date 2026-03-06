"use client"

import { Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminLogs() {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center">
          <Shield className="h-5 w-5 text-orange-500 mr-2" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          Nenhum log real de auditoria foi encontrado para este painel.
        </div>
      </CardContent>
    </Card>
  )
}
