import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🔍 API /api/providers/direct-access - tentando acesso direto ao Storage')
    
    // URLs diretas com diferentes formatos para tentar
    const directProviders = [
      {
        providerId: "zxyg0HWXZ8TWHEp1DTutmjA7BBz1",
        documents: {
          outros: [
            {
              id: "1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              name: "1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              // Formato 1: URL direta simples
              url: "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos%2Fzxyg0HWXZ8TWHEp1DTutmjA7BBz1%2F1759591584119_Naruto_Uzumaki_%2528Parte_I_-_HD%2529.png?alt=media",
              // Formato 2: URL com encoding diferente
              urlAlt: "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos%252Fzxyg0HWXZ8TWHEp1DTutmjA7BBz1%252F1759591584119_Naruto_Uzumaki_%252528Parte_I_-_HD%252529.png?alt=media",
              // Formato 3: URL sem encoding
              urlDirect: "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png?alt=media",
              type: "image",
              size: 126197,
              uploadedAt: new Date("2025-10-04"),
              path: "Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png"
            },
            {
              id: "1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              name: "1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              url: "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos%2Fzxyg0HWXZ8TWHEp1DTutmjA7BBz1%2F1759591593489_Naruto_Uzumaki_%2528Parte_I_-_HD%2529.png?alt=media",
              urlAlt: "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos%252Fzxyg0HWXZ8TWHEp1DTutmjA7BBz1%252F1759591593489_Naruto_Uzumaki_%252528Parte_I_-_HD%252529.png?alt=media",
              urlDirect: "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png?alt=media",
              type: "image",
              size: 126197,
              uploadedAt: new Date("2025-10-04"),
              path: "Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591593489_Naruto_Uzumaki_%28Parte_I_-_HD%29.png"
            },
            {
              id: "1759591602350_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              name: "1759591602350_Naruto_Uzumaki_%28Parte_I_-_HD%29.png",
              url: "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos%2Fzxyg0HWXZ8TWHEp1DTutmjA7BBz1%2F1759591602350_Naruto_Uzumaki_%2528Parte_I_-_HD%2529.png?alt=media",
              urlAlt: "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos%252Fzxyg0HWXZ8TWHEp1DTutmjA7BBz1%252F1759591602350_Naruto_Uzumaki_%252528Parte_I_-_HD%252529.png?alt=media",
              urlDirect: "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591602350_Naruto_Uzumaki_%28Parte_I_-_HD%29.png?alt=media",
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
    
    console.log('✅ Retornando URLs diretas do Firebase Storage')
    
    return NextResponse.json({ 
      providers: directProviders,
      message: "URLs diretas do Firebase Storage - teste de regras"
    })

  } catch (e) {
    console.error('❌ Erro na API direct-access:', e)
    return NextResponse.json({ providers: [] }, { status: 500 })
  }
}
