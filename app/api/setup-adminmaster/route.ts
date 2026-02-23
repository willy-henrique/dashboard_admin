import { NextRequest, NextResponse } from 'next/server'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore'
import bcrypt from 'bcryptjs'

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const BCRYPT_ROUNDS = 10

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Inicializando setup do AdminMaster...')
    
    // Verificar se as variáveis estão definidas
    const requiredVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ]

    const missingVars = requiredVars.filter(varName => !process.env[varName])
    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Variáveis de ambiente ausentes',
        missing: missingVars
      }, { status: 400 })
    }

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    console.log('👑 Configurando AdminMaster...')

    const senhaHash = await bcrypt.hash('admin123', BCRYPT_ROUNDS)

    // Dados do AdminMaster padrão
    const adminMasterData = {
      email: 'master@aquiresolve.com',
      senhaHash,
      nome: 'Administrador Master',
      permissoes: {
        dashboard: true,
        controle: true,
        gestaoUsuarios: true,
        gestaoPedidos: true,
        financeiro: true,
        relatorios: true,
        configuracoes: true
      },
      criadoEm: new Date().toISOString(),
      ativo: true
    }

    // Criar documento AdminMaster na coleção 'adminmaster'
    const adminMasterRef = doc(db, 'adminmaster', 'master')
    await setDoc(adminMasterRef, adminMasterData)

    console.log('✅ AdminMaster configurado com sucesso!')

    // Criar alguns usuários de exemplo
    console.log('👥 Criando usuários de exemplo...')
    
    const usuariosExemplo = [
      {
        nome: 'João Silva',
        email: 'joao@aquiresolve.com',
        permissoes: {
          dashboard: true,
          controle: true,
          gestaoUsuarios: false,
          gestaoPedidos: true,
          financeiro: false,
          relatorios: true,
          configuracoes: false
        },
        criadoEm: new Date().toISOString(),
        ativo: true
      },
      {
        nome: 'Maria Santos',
        email: 'maria@aquiresolve.com',
        permissoes: {
          dashboard: true,
          controle: false,
          gestaoUsuarios: true,
          gestaoPedidos: true,
          financeiro: true,
          relatorios: false,
          configuracoes: true
        },
        criadoEm: new Date().toISOString(),
        ativo: true
      },
      {
        nome: 'Pedro Costa',
        email: 'pedro@aquiresolve.com',
        permissoes: {
          dashboard: true,
          controle: true,
          gestaoUsuarios: false,
          gestaoPedidos: false,
          financeiro: true,
          relatorios: true,
          configuracoes: false
        },
        criadoEm: new Date().toISOString(),
        ativo: true
      }
    ]

    // Criar subcoleção de usuários
    const usuariosRef = collection(db, 'adminmaster', 'master', 'usuarios')
    
    for (const usuario of usuariosExemplo) {
      await addDoc(usuariosRef, usuario)
      console.log(`✅ Usuário ${usuario.nome} criado`)
    }

    // Criar configurações do sistema
    console.log('⚙️ Criando configurações do sistema...')
    
    const configuracoesRef = doc(db, 'adminmaster', 'master', 'configuracoes', 'sistema')
    await setDoc(configuracoesRef, {
      versao: '1.0.0',
      ultimaAtualizacao: new Date().toISOString(),
      permissoesPadrao: {
        dashboard: false,
        controle: false,
        gestaoUsuarios: false,
        gestaoPedidos: false,
        financeiro: false,
        relatorios: false,
        configuracoes: false
      },
      configuracoes: {
        maxUsuarios: 100,
        sessaoTimeout: 3600, // 1 hora em segundos
        logAtividades: true,
        notificacoes: true
      }
    })

    console.log('✅ Configurações do sistema criadas')

    // Criar logs de atividade
    console.log('📝 Criando logs de atividade...')
    
    const logsRef = collection(db, 'adminmaster', 'master', 'logs')
    await addDoc(logsRef, {
      tipo: 'sistema',
      acao: 'setup_inicial',
      descricao: 'Sistema AdminMaster configurado com sucesso',
      timestamp: new Date().toISOString(),
      usuario: 'sistema',
      ip: 'localhost'
    })

    console.log('✅ Log de atividade criado')

    return NextResponse.json({
      success: true,
      message: 'AdminMaster configurado com sucesso!',
      data: {
        adminMaster: {
          email: 'master@aquiresolve.com',
          senha: 'admin123',
          nome: 'Administrador Master'
        },
        usuarios: usuariosExemplo.length,
        estrutura: {
          'adminmaster/master': 'Documento principal',
          'adminmaster/master/usuarios': 'Subcoleção de usuários',
          'adminmaster/master/configuracoes/sistema': 'Configurações',
          'adminmaster/master/logs': 'Logs de atividade'
        }
      }
    })

  } catch (error) {
    console.error('❌ Erro ao configurar AdminMaster:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST para configurar o AdminMaster',
    endpoint: '/api/setup-adminmaster',
    method: 'POST'
  })
}