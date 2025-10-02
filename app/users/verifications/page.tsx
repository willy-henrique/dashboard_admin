"use client"

import { DocumentRouteGuard } from "@/components/auth/document-route-guard"
import { DocumentAuthProvider } from "@/hooks/use-document-auth"
import { VerificationsPageContent } from "./verifications-content"

export default function VerificationsPage() {
  return (
    <DocumentAuthProvider>
      <DocumentRouteGuard requiredRole="document_admin">
        <VerificationsPageContent />
      </DocumentRouteGuard>
    </DocumentAuthProvider>
  )
}
