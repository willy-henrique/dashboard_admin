import { NextResponse } from 'next/server'
import { adminStorage } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🔍 API /api/providers chamada')
    
    // Tentar usar Firebase Admin SDK se disponível
    if (adminStorage) {
      console.log('✅ Usando Firebase Admin SDK')
      
      const [files] = await adminStorage.getFiles({ prefix: 'Documentos/' })
      const dirMap = new Map<string, any[]>()
      
      for (const file of files) {
        const name = file.name
        const parts = name.split('/')
        if (parts.length < 3) continue
        const providerId = parts[1]
        if (!dirMap.has(providerId)) dirMap.set(providerId, [])
        dirMap.get(providerId)!.push(file)
      }

      const providers: any[] = []
      for (const [providerId, providerFiles] of dirMap.entries()) {
        const documents: Record<string, any[]> = {}
        let uploadedAt = 0
        
        for (const file of providerFiles) {
          const [metadata] = await file.getMetadata()
          const [signedUrl] = await file.getSignedUrl({ 
            action: 'read', 
            expires: Date.now() + 60 * 60 * 1000 
          })
          const fileName = file.name.split('/').pop() || ''
          const ext = (fileName.split('.').pop() || '').toLowerCase()
          const type = ['jpg','jpeg','png','gif','webp','bmp'].includes(ext) ? 'image' : ext === 'pdf' ? 'pdf' : 'document'
          const docType = 'outros'
          
          const item = {
            id: fileName,
            name: fileName,
            url: signedUrl,
            type,
            size: Number(metadata.size || 0),
            uploadedAt: new Date(metadata.timeCreated || Date.now()),
            path: file.name,
          }
          
          if (!documents[docType]) documents[docType] = []
          documents[docType].push(item)
          const ts = new Date(item.uploadedAt).getTime()
          if (ts > uploadedAt) uploadedAt = ts
        }
        
        providers.push({ 
          providerId, 
          documents, 
          uploadedAt: new Date(uploadedAt || Date.now()) 
        })
      }

      return NextResponse.json({ providers })
    }
    
    // Fallback removido: sem dados mockados. A UI deve usar lib/storage.ts com getDownloadURL.
    console.log('⚠️ Firebase Admin SDK não disponível - retornando lista vazia (sem mocks)')
    return NextResponse.json({ providers: [] })
    
  } catch (e) {
    console.error('API providers error', e)
    return NextResponse.json({ providers: [] }, { status: 200 })
  }
}
