import { NextRequest, NextResponse } from 'next/server'
import * as admin from 'firebase-admin'
import { adminApp } from '@/lib/firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nome, email, password, permissoes } = body || {}

    if (!nome || !email || !password || !permissoes) {
      return NextResponse.json({ success: false, error: 'Dados inválidos' }, { status: 400 })
    }

    if (!adminApp) {
      return NextResponse.json({ success: false, error: 'Firebase Admin não inicializado' }, { status: 500 })
    }

    const auth = admin.auth()
    const db = getFirestore()

    // Cria usuário de autenticação
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: nome,
      emailVerified: false,
      disabled: false,
    })

    // Salva permissões na subcoleção adminmaster/master/usuarios usando uid como id
    const usuarioRef = db.collection('adminmaster').doc('master').collection('usuarios').doc(userRecord.uid)
    await usuarioRef.set({
      nome,
      email,
      permissoes,
      criadoEm: admin.firestore.FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true, uid: userRecord.uid })
  } catch (error: any) {
    console.error('Erro ao criar usuário master:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Erro interno' }, { status: 500 })
  }
}


