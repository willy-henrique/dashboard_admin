"use client"

import { AlertTriangle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PaymentBanner() {
  return (
    <div className="bg-orange-500 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5" />
        <div>
          <h3 className="font-semibold">Pagamento em aberto!</h3>
          <p className="text-sm">
            Prezado cliente, consta(m) em nosso sistema fatura(s) em aberto de sua empresa. Regularize o(s) débito(s) o
            mais rápido possível pra evitar a suspensão do sistema. Se já efetuou o pagamento, envie o comprovante para{" "}
            <span className="font-semibold">financeiro@satellitus.com</span> e entre em contato para solicitar a baixa.
          </p>
        </div>
      </div>
      <Button variant="secondary" size="sm" className="bg-white text-orange-600 hover:bg-gray-100">
        <Eye className="h-4 w-4 mr-2" />
        VISUALIZAR FATURAS...
      </Button>
    </div>
  )
}
