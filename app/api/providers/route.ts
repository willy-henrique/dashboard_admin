import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Dados mockados baseados nas imagens que você mostrou no Firebase Storage
const mockProviders = [
  {
    providerId: "zxyg0HWXZ8TWHEp1DTutmjA7BBz1",
    documents: {
      outros: [
        {
          id: "1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
          name: "1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
          url: "https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Documento+1",
          type: "image",
          size: 126197,
          uploadedAt: new Date("2025-10-04"),
          path: "Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png"
        },
        {
          id: "1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
          name: "1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
          url: "https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Documento+2",
          type: "image",
          size: 126197,
          uploadedAt: new Date("2025-10-04"),
          path: "Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png"
        },
        {
          id: "1759591602350_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
          name: "1759591602350_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
          url: "https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Documento+3",
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

export async function GET() {
  try {
    console.log('🔍 API /api/providers chamada - retornando dados mockados')
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json({ 
      providers: mockProviders,
      message: "Dados mockados para teste - configure FIREBASE_SERVICE_ACCOUNT para dados reais"
    })
  } catch (e) {
    console.error('API providers error', e)
    return NextResponse.json({ providers: [] }, { status: 200 })
  }
}
