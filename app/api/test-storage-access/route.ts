import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🔍 Testando acesso ao Firebase Storage...')
    
    // URL de teste (codificação simples: encodeURIComponent no caminho inteiro)
    const testUrls = [
      "https://firebasestorage.googleapis.com/v0/b/aplicativoservico-143c2.appspot.com/o/Documentos%2Fzxyg0HWXZ8TWHEp1DTutmjA7BBz1%2F1759591584119_Naruto_Uzumaki_%28Parte_I_-_HD%29.png?alt=media"
    ]
    
    const results = []
    
    for (const url of testUrls) {
      try {
        // Usar GET com Range para checagem leve (HEAD não é suportado pelo endpoint alt=media)
        const response = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-0' } })
        results.push({
          url,
          status: response.status,
          accessible: response.status === 200 || response.status === 206,
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
