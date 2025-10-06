import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🔍 API /api/providers/firebase-real - tentando Firebase Storage real')
    
    // Tentar diferentes formatos de URL para o Firebase Storage
    const firebaseUrls = [
      // Formato 1: URL direta com encoding
      "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos%2Fzxyg0HWXZ8TWHEp1DTutmjA7BBz1%2F1759591584119_Naruto_Uzumaki_%2528Parte_I_-_HD%2529.png?alt=media",
      
      // Formato 2: URL sem encoding extra
      "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos%2Fzxyg0HWXZ8TWHEp1DTutmjA7BBz1%2F1759591584119_Naruto_Uzumaki_%2528Parte_I_-_HD%2529.png?alt=media",
      
      // Formato 3: URL com token
      "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos%2Fzxyg0HWXZ8TWHEp1DTutmjA7BBz1%2F1759591584119_Naruto_Uzumaki_%2528Parte_I_-_HD%2529.png?alt=media&token=public"
    ]
    
    // Testar qual URL funciona
    let workingUrl = null
    for (const url of firebaseUrls) {
      try {
        const response = await fetch(url, { method: 'HEAD' })
        if (response.status === 200) {
          workingUrl = url
          console.log('✅ URL funcionando:', url)
          break
        }
      } catch (error) {
        console.log('❌ URL não funciona:', url)
      }
    }
    
    const realProviders = [
      {
        providerId: "zxyg0HWXZ8TWHEp1DTutmjA7BBz1",
        documents: {
          outros: [
            {
              id: "1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              name: "1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              url: workingUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format",
              type: "image",
              size: 126197,
              uploadedAt: new Date("2025-10-04"),
              path: "Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png"
            },
            {
              id: "1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              name: "1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              url: workingUrl ? workingUrl.replace('1759591584119', '1759591593489') : "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format",
              type: "image",
              size: 126197,
              uploadedAt: new Date("2025-10-04"),
              path: "Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png"
            },
            {
              id: "1759591602350_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              name: "1759591602350_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              url: workingUrl ? workingUrl.replace('1759591584119', '1759591602350') : "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format",
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
    
    console.log(workingUrl ? '✅ Usando Firebase Storage real' : '⚠️ Usando fallback Unsplash')
    
    return NextResponse.json({ 
      providers: realProviders,
      message: workingUrl ? "Firebase Storage real funcionando" : "Fallback para imagens de teste",
      firebaseWorking: !!workingUrl
    })

  } catch (e) {
    console.error('❌ Erro na API firebase-real:', e)
    return NextResponse.json({ providers: [] }, { status: 500 })
  }
}
