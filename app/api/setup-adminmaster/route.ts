import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, doc, setDoc, collection } from 'firebase/firestore'

// Configuração do Firebase usando variáveis de ambiente do Vercel
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Função para hash de senha
const hashPassword = (password: string): string => {
  return Buffer.from(password).toString('base64')
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando criação da coleção adminmaster...')
    
    // Verificar se as variáveis de ambiente estão configuradas
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    ]
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Variáveis de ambiente do Firebase não configuradas',
        missing: missingVars
      }, { status: 400 })
    }

    // Inicializar Firebase
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    const db = getFirestore(app)

    console.log('📦 Criando coleção "adminmaster"...')
    
    // 1. Criar documento principal do AdminMaster
    console.log('👑 Criando AdminMaster principal...')
    const adminMasterData = {
      email: 'master@aquiresolve.com',
      senhaHash: hashPassword('admin123'),
      nome: 'Administrador Master',
      createdAt: new Date(),
      updatedAt: new Date(),
      permissoes: {
        dashboard: true,
        controle: true,
        gestaoUsuarios: true,
        gestaoPedidos: true,
        financeiro: true,
        relatorios: true,
        configuracoes: true
      }
    }

    const adminMasterRef = doc(db, 'adminmaster', 'master')
    await setDoc(adminMasterRef, adminMasterData)
    console.log('✅ AdminMaster criado com sucesso!')

    // 2. Criar usuários de exemplo na subcoleção
    console.log('👥 Criando usuários de exemplo...')
    
    const usuariosExemplo = [
      {
        nome: 'João Silva',
        email: 'joao@aquiresolve.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        permissoes: {
          dashboard: true,
          controle: true,
          gestaoUsuarios: false,
          gestaoPedidos: true,
          financeiro: false,
          relatorios: true,
          configuracoes: false
        }
      },
      {
        nome: 'Maria Santos',
        email: 'maria@aquiresolve.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        permissoes: {
          dashboard: true,
          controle: false,
          gestaoUsuarios: true,
          gestaoPedidos: true,
          financeiro: true,
          relatorios: false,
          configuracoes: true
        }
      },
      {
        nome: 'Pedro Costa',
        email: 'pedro@aquiresolve.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        permissoes: {
          dashboard: true,
          controle: false,
          gestaoUsuarios: false,
          gestaoPedidos: false,
          financeiro: true,
          relatorios: true,
          configuracoes: false
        }
      }
    ]

    // Criar usuários na subcoleção
    for (const usuario of usuariosExemplo) {
      const usuarioRef = doc(db, 'adminmaster', 'master', 'usuarios', usuario.email.replace('@', '_at_'))
      await setDoc(usuarioRef, usuario)
      console.log(`✅ Usuário ${usuario.nome} (${usuario.email}) criado`)
    }

    // 3. Criar documento de configurações
    console.log('⚙️ Criando configurações do sistema...')
    const configData = {
      sistemaAtivo: true,
      versao: '1.0.0',
      ultimaAtualizacao: new Date(),
      configuracoes: {
        permitirNovosUsuarios: true,
        notificacoesAtivas: true,
        backupAutomatico: true
      }
    }

    const configRef = doc(db, 'adminmaster', 'config')
    await setDoc(configRef, configData)
    console.log('✅ Configurações criadas!')

    console.log('🎉 Coleção "adminmaster" criada com sucesso!')

    return NextResponse.json({
      success: true,
      message: 'Coleção adminmaster criada com sucesso!',
      data: {
        estrutura: {
          colecao: 'adminmaster',
          documentos: {
            master: 'AdminMaster principal',
            config: 'Configurações do sistema'
          },
          subcolecoes: {
            'master/usuarios': 'Usuários gerenciados'
          }
        },
        credenciais: {
          email: 'master@aquiresolve.com',
          senha: 'admin123'
        },
        usuarios: usuariosExemplo.map(u => ({
          nome: u.nome,
          email: u.email,
          permissoes: u.permissoes
        }))
      }
    })

  } catch (error) {
    console.error('❌ Erro ao criar coleção adminmaster:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro ao criar coleção adminmaster',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API para criar coleção adminmaster',
    usage: 'POST /api/setup-adminmaster',
    description: 'Cria a coleção adminmaster no Firebase com dados iniciais'
  })
}
