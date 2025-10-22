# Guia de Configuração do AdminMaster

Este guia explica como configurar o sistema AdminMaster no Firebase para gerenciar permissões e usuários.

## 🚀 Métodos de Setup

### 1. Via Interface Web (Recomendado)

1. Acesse `/setup-adminmaster` no seu navegador
2. Configure os dados do AdminMaster
3. Clique em "Configurar AdminMaster"
4. Aguarde a confirmação de sucesso

### 2. Via API

```bash
# Executar setup via API
node scripts/setup-via-api.js
```

### 3. Via Script Local

```bash
# Executar setup local
node scripts/run-setup-adminmaster.js
```

## 🔧 Configuração de Variáveis de Ambiente

### No Vercel

Configure as seguintes variáveis no painel do Vercel:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Localmente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 📊 Estrutura Criada

O setup cria a seguinte estrutura no Firebase:

```
adminmaster/
├── master/                          # Documento principal do AdminMaster
│   ├── email: "master@aquiresolve.com"
│   ├── senhaHash: "hash_da_senha"
│   ├── nome: "Administrador Master"
│   ├── permissoes: { ... }
│   ├── criadoEm: "timestamp"
│   └── ativo: true
│
├── master/usuarios/                 # Subcoleção de usuários
│   ├── joao@aquiresolve.com/
│   ├── maria@aquiresolve.com/
│   └── pedro@aquiresolve.com/
│
├── master/configuracoes/sistema/    # Configurações do sistema
│   ├── versao: "1.0.0"
│   ├── permissoesPadrao: { ... }
│   └── configuracoes: { ... }
│
└── master/logs/                     # Logs de atividade
    └── setup_inicial/
```

## 👥 Usuários Criados

O setup cria os seguintes usuários de exemplo:

### 1. João Silva (joao@aquiresolve.com)
- ✅ Dashboard
- ✅ Controle
- ❌ Gestão de Usuários
- ✅ Gestão de Pedidos
- ❌ Financeiro
- ✅ Relatórios
- ❌ Configurações

### 2. Maria Santos (maria@aquiresolve.com)
- ✅ Dashboard
- ❌ Controle
- ✅ Gestão de Usuários
- ✅ Gestão de Pedidos
- ✅ Financeiro
- ❌ Relatórios
- ✅ Configurações

### 3. Pedro Costa (pedro@aquiresolve.com)
- ✅ Dashboard
- ✅ Controle
- ❌ Gestão de Usuários
- ❌ Gestão de Pedidos
- ✅ Financeiro
- ✅ Relatórios
- ❌ Configurações

## 🔐 Credenciais Padrão

- **Email:** master@aquiresolve.com
- **Senha:** admin123

⚠️ **IMPORTANTE:** Altere a senha padrão em produção!

## 🎯 Funcionalidades

### AdminMaster
- Acesso total ao sistema
- Gerenciamento de usuários
- Configuração de permissões
- Logs de atividade

### Usuários
- Acesso baseado em permissões
- Controle granular de funcionalidades
- Sessões seguras

## 🔍 Verificação

Após o setup, você pode verificar:

1. **Acesse `/master`** - Página de login master
2. **Acesse `/setup-adminmaster`** - Interface de configuração
3. **Verifique o Firebase** - Estrutura criada

## 🛠️ Troubleshooting

### Erro: "Variáveis de ambiente ausentes"
- Verifique se todas as variáveis estão configuradas
- Reinicie o servidor após configurar as variáveis

### Erro: "Firebase não inicializado"
- Verifique as credenciais do Firebase
- Confirme se o projeto está ativo

### Erro: "Permissões insuficientes"
- Verifique as regras do Firestore
- Confirme se o usuário tem acesso de escrita

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs do console
2. Confirme as variáveis de ambiente
3. Teste a conexão com o Firebase
4. Verifique as regras do Firestore

## 🎉 Próximos Passos

Após o setup:
1. Acesse `/master` com as credenciais
2. Configure usuários adicionais
3. Ajuste permissões conforme necessário
4. Monitore logs de atividade
