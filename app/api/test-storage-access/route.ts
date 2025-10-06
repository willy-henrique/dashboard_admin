import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🔍 Testando acesso ao Firebase Storage...')
    
    // URLs de teste com diferentes formatos
    const testUrls = [
      // Formato 1: URL direta com alt=media
      "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos%2Fzxyg0HWXZ8TWHEp1DTutmjA7BBz1%2F1759591584119_Naruto_Uzumaki_%2528Parte_I_-_HD%2529.png?alt=media",
      
      // Formato 2: URL com encoding diferente
      "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos%252Fzxyg0HWXZ8TWHEp1DTutmjA7BBz1%252F1759591584119_Naruto_Uzumaki_%252528Parte_I_-_HD%252529.png?alt=media",
      
      // Formato 3: URL sem encoding
      "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos/zxyg0HWXZ8TWHEp1DTutmjA7BBz1/1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png?alt=media",
      
      // Formato 4: URL com token v4 (pode funcionar)
      "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos%2Fzxyg0HWXZ8TWHEp1DTutmjA7BBz1%2F1759591584119_Naruto_Uzumaki_%2528Parte_I_-_HD%2529.png?alt=media&token=test"
    ]
    
    const results = []
    
    for (const url of testUrls) {
      try {
        const response = await fetch(url, { method: 'HEAD' })
        results.push({
          url,
          status: response.status,
          accessible: response.status === 200,
          headers: Object.fromEntries(response.headers.entries())
        })
        console.log(`✅ URL testada: ${response.status} - ${url}`)
      } catch (error) {
        results.push({
          url,
          status: 'error',
          accessible: false,
          error: error.message
        })
        console.log(`❌ Erro ao testar URL: ${error.message}`)
      }
    }
    
    return NextResponse.json({
      message: "Teste de acesso ao Firebase Storage",
      results,
      workingUrls: results.filter(r => r.accessible).map(r => r.url)
    })
    
  } catch (e) {
    console.error('❌ Erro no teste de Storage:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
