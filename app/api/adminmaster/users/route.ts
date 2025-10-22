import { NextRequest, NextResponse } from 'next/server'
import * as admin from 'firebase-admin'
import { adminApp } from '@/lib/firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 Iniciando criação de usuário master...')
    
    const body = await req.json()
    const { nome, email, password, permissoes } = body || {}

    console.log('📝 Dados recebidos:', { nome, email, permissoes: Object.keys(permissoes || {}) })

    if (!nome || !email || !password || !permissoes) {
      console.error('❌ Dados inválidos:', { nome: !!nome, email: !!email, password: !!password, permissoes: !!permissoes })
      return NextResponse.json({ success: false, error: 'Dados inválidos' }, { status: 400 })
    }

    if (!adminApp) {
      console.error('❌ Firebase Admin não inicializado')
      return NextResponse.json({ success: false, error: 'Firebase Admin não inicializado' }, { status: 500 })
    }

    console.log('✅ Firebase Admin disponível, criando usuário...')
    const auth = admin.auth()
    const db = getFirestore()

    // Verifica se o usuário já existe
    try {
      const existingUser = await auth.getUserByEmail(email)
      if (existingUser) {
        console.error('❌ Usuário já existe:', email)
        return NextResponse.json({ success: false, error: 'Usuário já existe com este email' }, { status: 400 })
      }
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        console.error('❌ Erro ao verificar usuário existente:', error)
        throw error
      }
      // Usuário não existe, continuar
    }

    // Cria usuário de autenticação
    console.log('👤 Criando usuário no Firebase Auth...')
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: nome,
      emailVerified: false,
      disabled: false,
    })

    console.log('✅ Usuário criado no Auth:', userRecord.uid)

    // Salva permissões na subcoleção adminmaster/master/usuarios usando uid como id
    console.log('💾 Salvando permissões no Firestore...')
    const usuarioRef = db.collection('adminmaster').doc('master').collection('usuarios').doc(userRecord.uid)
    await usuarioRef.set({
      nome,
      email,
      permissoes,
      criadoEm: admin.firestore.FieldValue.serverTimestamp(),
    })

    console.log('✅ Usuário master criado com sucesso!')
    return NextResponse.json({ success: true, uid: userRecord.uid })
  } catch (error: any) {
    console.error('❌ Erro ao criar usuário master:', error)
    
    // Tratamento específico para erros comuns
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ success: false, error: 'Email já está em uso' }, { status: 400 })
    }
    if (error.code === 'auth/invalid-email') {
      return NextResponse.json({ success: false, error: 'Email inválido' }, { status: 400 })
    }
    if (error.code === 'auth/weak-password') {
      return NextResponse.json({ success: false, error: 'Senha muito fraca' }, { status: 400 })
    }
    
    return NextResponse.json({ success: false, error: error?.message || 'Erro interno' }, { status: 500 })
  }
}


