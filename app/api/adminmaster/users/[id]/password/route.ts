import { NextRequest, NextResponse } from 'next/server'
import * as admin from 'firebase-admin'
import { adminApp } from '@/lib/firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔐 Iniciando alteração de senha do usuário:', params.id)
    
    if (!adminApp) {
      console.error('❌ Firebase Admin não inicializado')
      return NextResponse.json({ 
        success: false, 
        error: 'Firebase Admin não inicializado' 
      }, { status: 500 })
    }

    const body = await request.json()
    const { newPassword } = body || {}

    if (!newPassword) {
      console.error('❌ Nova senha não fornecida')
      return NextResponse.json({ 
        success: false, 
        error: 'Nova senha é obrigatória' 
      }, { status: 400 })
    }

    if (newPassword.length < 6) {
      console.error('❌ Senha muito curta')
      return NextResponse.json({ 
        success: false, 
        error: 'A senha deve ter pelo menos 6 caracteres' 
      }, { status: 400 })
    }

    const auth = admin.auth()
    const db = getFirestore()

    // Verificar se o usuário existe
    try {
      const userRecord = await auth.getUser(params.id)
      console.log('✅ Usuário encontrado:', userRecord.email)
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.error('❌ Usuário não encontrado:', params.id)
        return NextResponse.json({ 
          success: false, 
          error: 'Usuário não encontrado' 
        }, { status: 404 })
      }
      throw error
    }

    // Atualizar a senha do usuário
    console.log('🔑 Atualizando senha do usuário...')
    await auth.updateUser(params.id, {
      password: newPassword
    })

    // Atualizar timestamp de última alteração de senha no Firestore
    console.log('💾 Atualizando timestamp no Firestore...')
    const usuarioRef = db.collection('adminmaster').doc('master').collection('usuarios').doc(params.id)
    await usuarioRef.update({
      senhaAlteradaEm: admin.firestore.FieldValue.serverTimestamp(),
    })

    console.log('✅ Senha alterada com sucesso!')
    return NextResponse.json({ 
      success: true, 
      message: 'Senha alterada com sucesso' 
    })

  } catch (error: any) {
    console.error('❌ Erro ao alterar senha:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
