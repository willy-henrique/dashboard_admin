import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🔍 API /api/providers/proxy-images - usando proxy para imagens')
    
    // Removido: não usar URLs fixas. Esta rota mantém apenas fallback de teste.
    const firebaseUrls: string[] = []
    
    // Testar se as URLs funcionam
    const workingUrls = []
    for (const url of firebaseUrls) {
      try {
        const response = await fetch(url, { method: 'HEAD' })
        if (response.status === 200) {
          workingUrls.push(url)
          console.log('✅ URL funcionando:', url)
        } else {
          console.log('❌ URL não funciona:', response.status, url)
        }
      } catch (error) {
        console.log('❌ Erro ao testar URL:', error.message)
      }
    }
    
    // Se pelo menos uma URL funciona, usar Firebase
    if (workingUrls.length > 0) {
      const providers = [
        {
          providerId: "zxyg0HWXZ8TWHEp1DTutmjA7BBz1",
          documents: {
            outros: [
              {
                id: "1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
                name: "1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
                url: workingUrls[0] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format",
                type: "image",
                size: 126197,
                uploadedAt: new Date("2025-10-04"),
                path: "Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png"
              },
              {
                id: "1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
                name: "1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
                url: workingUrls[1] || "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format",
                type: "image",
                size: 126197,
                uploadedAt: new Date("2025-10-04"),
                path: "Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png"
              },
              {
                id: "1759591602350_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
                name: "1759591602350_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
                url: workingUrls[2] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format",
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
        providers,
        message: `Firebase Storage funcionando (${workingUrls.length}/3 URLs)`,
        firebaseWorking: true
      })
    }
    
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
      message: "Fallback: imagens de teste (Firebase Storage não acessível)",
      firebaseWorking: false
    })

  } catch (error) {
    console.error('❌ Erro na API proxy-images:', error)
    return NextResponse.json({ 
      providers: [],
      message: "Erro interno",
      firebaseWorking: false
    }, { status: 500 })
  }
}
