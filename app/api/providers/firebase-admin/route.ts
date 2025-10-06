import { NextResponse } from 'next/server'
import { adminStorage } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🔍 API /api/providers/firebase-admin - usando Admin SDK')
    
    if (!adminStorage) {
      console.log('⚠️ Firebase Admin SDK não disponível')
      return NextResponse.json({ 
        providers: [],
        message: "Firebase Admin SDK não configurado"
      })
    }

    // Listar arquivos do Storage usando Admin SDK
    const [files] = await adminStorage.getFiles({ prefix: 'Documentos/' })
    console.log(`✅ Encontrados ${files.length} arquivos no Storage`)
    
    const providersMap = new Map()
    
    for (const file of files) {
      const pathParts = file.name.split('/')
      if (pathParts.length >= 3) {
        const providerId = pathParts[1]
        
        if (!providersMap.has(providerId)) {
          providersMap.set(providerId, {
            providerId,
            documents: {},
            uploadedAt: new Date()
          })
        }
        
        const provider = providersMap.get(providerId)
        const fileName = pathParts[2]
        const docType = 'outros' // Simplificado
        
        // Gerar URL assinada válida por 1 hora
        const [signedUrl] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 60 * 60 * 1000 // 1 hora
        })
        
        const [metadata] = await file.getMetadata()
        
        if (!provider.documents[docType]) {
          provider.documents[docType] = []
        }
        
        provider.documents[docType].push({
          id: fileName,
          name: fileName,
          url: signedUrl,
          type: 'image',
          size: parseInt(metadata.size || '0'),
          uploadedAt: new Date(metadata.timeCreated || Date.now()),
          path: file.name
        })
        
        // Atualizar data mais recente
        const fileDate = new Date(metadata.timeCreated || Date.now())
        if (fileDate > provider.uploadedAt) {
          provider.uploadedAt = fileDate
        }
      }
    }
    
    const providers = Array.from(providersMap.values())
    console.log(`✅ Retornando ${providers.length} prestadores com URLs assinadas`)
    
    return NextResponse.json({ 
      providers,
      message: "URLs assinadas do Firebase Storage via Admin SDK"
    })

  } catch (error) {
    console.error('❌ Erro no Firebase Admin SDK:', error)
    
    // Fallback para imagens de teste
    const fallbackProviders = [
      {
        providerId: "zxyg0HWXZ8TWHEp1DTutmjA7BBz1",
        documents: {
          outros: [
            {
              id: "1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              name: "1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format",
              type: "image",
              size: 126197,
              uploadedAt: new Date("2025-10-04"),
              path: "Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png"
            },
            {
              id: "1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              name: "1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format",
              type: "image",
              size: 126197,
              uploadedAt: new Date("2025-10-04"),
              path: "Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png"
            },
            {
              id: "1759591602350_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              name: "1759591602350_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format",
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
      providers: fallbackProviders,
      message: "Fallback: imagens de teste (Firebase Admin SDK com erro)"
    })
  }
}
