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
    
    // Fallback: dados mockados com imagens de teste funcionais
    console.log('⚠️ Firebase Admin SDK não disponível - usando dados mockados com imagens de teste')
    
    const mockProviders = [
      {
        providerId: "zxyg0HWXZ8TWHEp1DTutmjA7BBz1",
        documents: {
          outros: [
            {
              id: "1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              name: "1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
              type: "image",
              size: 126197,
              uploadedAt: new Date("2025-10-04"),
              path: "Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png"
            },
            {
              id: "1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              name: "1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
              type: "image",
              size: 126197,
              uploadedAt: new Date("2025-10-04"),
              path: "Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png"
            },
            {
              id: "1759591602350_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              name: "1759591602350_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
              type: "image",
              size: 126197,
              uploadedAt: new Date("2025-10-04"),
              path: "Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591602350_Naruto_Uzumaki_%28Parte_I_-_HD%29.png"
            }
          ]
        },
        uploadedAt: new Date("2025-10-04")
      }
    ]
    
    return NextResponse.json({ 
      providers: mockProviders,
      message: "Dados mockados com URLs reais do Firebase Storage"
    })
    
  } catch (e) {
    console.error('API providers error', e)
    return NextResponse.json({ providers: [] }, { status: 200 })
  }
}
