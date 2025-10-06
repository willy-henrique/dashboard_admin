import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🔍 API /api/providers/working-images - usando imagens que funcionam')
    
    // Usar imagens de teste que funcionam garantidamente
    const workingProviders = [
      {
        providerId: "zxyg0HWXZ8TWHEp1DTutmjA7BBz1",
        documents: {
          outros: [
            {
              id: "1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              name: "1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              // Imagem de teste que funciona
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
    
    console.log('✅ Retornando imagens que funcionam (Unsplash)')
    
    return NextResponse.json({ 
      providers: workingProviders,
      message: "Imagens funcionais para teste - depois implementar Firebase real"
    })

  } catch (e) {
    console.error('❌ Erro na API working-images:', e)
    return NextResponse.json({ providers: [] }, { status: 500 })
  }
}
