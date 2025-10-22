const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection, addDoc } = require('firebase/firestore');

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Função para hash de senha
const hashPassword = (password) => {
  return Buffer.from(password).toString('base64');
};

async function createAdminMasterCollection() {
  try {
    console.log('🔥 Conectando ao Firebase...');
    
    // Verificar se as variáveis de ambiente estão configuradas
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.error('❌ Variáveis de ambiente do Firebase não configuradas:');
      missingVars.forEach(varName => console.error(`   - ${varName}`));
      console.error('\n📝 Configure as variáveis de ambiente do Firebase primeiro!');
      process.exit(1);
    }

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('📦 Criando coleção "adminmaster"...');
    
    // 1. Criar documento principal do AdminMaster
    console.log('👑 Criando AdminMaster principal...');
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
    };

    const adminMasterRef = doc(db, 'adminmaster', 'master');
    await setDoc(adminMasterRef, adminMasterData);
    console.log('✅ AdminMaster criado com sucesso!');

    // 2. Criar subcoleção de usuários com alguns exemplos
    console.log('👥 Criando usuários de exemplo...');
    
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
    ];

    // Criar usuários na subcoleção
    for (const usuario of usuariosExemplo) {
      const usuarioRef = doc(db, 'adminmaster', 'master', 'usuarios', usuario.email.replace('@', '_at_'));
      await setDoc(usuarioRef, usuario);
      console.log(`✅ Usuário ${usuario.nome} (${usuario.email}) criado`);
    }

    // 3. Criar documento de configurações
    console.log('⚙️ Criando configurações do sistema...');
    const configData = {
      sistemaAtivo: true,
      versao: '1.0.0',
      ultimaAtualizacao: new Date(),
      configuracoes: {
        permitirNovosUsuarios: true,
        notificacoesAtivas: true,
        backupAutomatico: true
      }
    };

    const configRef = doc(db, 'adminmaster', 'config');
    await setDoc(configRef, configData);
    console.log('✅ Configurações criadas!');

    console.log('\n🎉 Coleção "adminmaster" criada com sucesso!');
    console.log('\n📋 Estrutura criada:');
    console.log('├── adminmaster/');
    console.log('│   ├── master/ (AdminMaster principal)');
    console.log('│   │   └── usuarios/ (Subcoleção de usuários)');
    console.log('│   │       ├── joao_at_aquiresolve.com');
    console.log('│   │       ├── maria_at_aquiresolve.com');
    console.log('│   │       └── pedro_at_aquiresolve.com');
    console.log('│   └── config/ (Configurações do sistema)');
    console.log('\n🔐 Credenciais de acesso:');
    console.log('📧 Email: master@aquiresolve.com');
    console.log('🔑 Senha: admin123');
    console.log('\n⚠️  IMPORTANTE: Altere a senha padrão em produção!');
    console.log('\n🌐 Acesse /master para gerenciar usuários e permissões');

  } catch (error) {
    console.error('❌ Erro ao criar coleção adminmaster:', error);
    
    if (error.code === 'permission-denied') {
      console.error('\n🔒 Erro de permissão:');
      console.error('   - Verifique as regras do Firestore');
      console.error('   - Confirme se o projeto Firebase está configurado corretamente');
    } else if (error.code === 'unavailable') {
      console.error('\n🌐 Erro de conectividade:');
      console.error('   - Verifique sua conexão com a internet');
      console.error('   - Confirme se as credenciais do Firebase estão corretas');
    }
    
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createAdminMasterCollection();
}

module.exports = { createAdminMasterCollection };
