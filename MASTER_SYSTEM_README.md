# Sistema Master - AquiResolve

## 📋 Visão Geral

O Sistema Master é uma funcionalidade exclusiva do painel administrativo AquiResolve que permite o controle total de usuários e permissões. Apenas administradores master podem acessar esta área para gerenciar as permissões de outros usuários do sistema.

## 🔐 Estrutura de Acesso

### AdminMaster
- **Coleção**: `AdminMaster`
- **Documento**: `master`
- **Campos**:
  ```typescript
  {
    email: string,
    senhaHash: string,
    nome: string,
    permissoes: {
      dashboard: boolean,
      controle: boolean,
      gestaoUsuarios: boolean,
      gestaoPedidos: boolean,
      financeiro: boolean,
      relatorios: boolean,
      configuracoes: boolean
    }
  }
  ```

### Usuários Gerenciados
- **Subcoleção**: `AdminMaster/{adminId}/usuarios/{usuarioId}`
- **Campos**:
  ```typescript
  {
    nome: string,
    email: string,
    permissoes: {
      dashboard: boolean,
      controle: boolean,
      gestaoUsuarios: boolean,
      gestaoPedidos: boolean,
      financeiro: boolean,
      relatorios: boolean,
      configuracoes: boolean
    }
  }
  ```

## 🚀 Configuração Inicial

### 1. Executar Script de Configuração
```bash
node scripts/run-setup-admin-master.js
```

### 2. Credenciais Padrão
- **Email**: `master@aquiresolve.com`
- **Senha**: `admin123`
- ⚠️ **IMPORTANTE**: Altere a senha padrão em produção!

### 3. Acessar Área Master
- URL: `/master`
- Login exclusivo para AdminMaster
- Redirecionamento automático se não for master

## 🛠️ Funcionalidades

### Login Master
- Autenticação exclusiva para AdminMaster
- Verificação de credenciais no Firestore
- Redirecionamento automático para usuários comuns

### Gestão de Usuários
- **Adicionar Usuário**: Formulário com nome, email e permissões iniciais
- **Editar Permissões**: Checkboxes para cada módulo do sistema
- **Remover Usuário**: Exclusão com confirmação
- **Visualização**: Lista de todos os usuários cadastrados

### Sistema de Permissões
- **Módulos Disponíveis**:
  - Dashboard
  - Controle
  - Gestão de Usuários
  - Gestão de Pedidos
  - Financeiro
  - Relatórios
  - Configurações

## 🔧 Arquivos Principais

### Rota Master
- `app/master/page.tsx` - Página principal da área master

### Componentes
- `components/master/master-dashboard.tsx` - Dashboard de gestão
- `components/auth/route-guard.tsx` - Proteção de rotas

### Hooks
- `hooks/use-master-auth.ts` - Autenticação master
- `hooks/use-permissions.ts` - Sistema de permissões global

### Serviços
- `lib/services/admin-master-service.ts` - Serviços do AdminMaster

### Scripts
- `scripts/setup-admin-master.js` - Configuração inicial
- `scripts/run-setup-admin-master.js` - Executor do setup

## 🎨 Interface

### Design
- Identidade visual AquiResolve (tons laranja e cinza)
- Layout responsivo
- Cards e botões arredondados
- Ícones Lucide React

### Componentes UI
- Formulários com validação
- Modais para adicionar usuários
- Checkboxes para permissões
- Botões de ação (Salvar, Editar, Remover)

## 🔒 Segurança

### Proteção de Rotas
- Verificação de autenticação master
- Redirecionamento para usuários não autorizados
- Middleware de proteção

### Validação
- Verificação de email único
- Validação de permissões
- Controle de acesso por módulo

## 📱 Responsividade

### Desktop
- Layout em duas colunas
- Sidebar fixa
- Cards organizados

### Mobile
- Layout adaptativo
- Modais responsivos
- Navegação otimizada

## 🚀 Como Usar

### 1. Primeiro Acesso
1. Execute o script de configuração
2. Acesse `/master`
3. Faça login com as credenciais padrão
4. Altere a senha padrão

### 2. Gerenciar Usuários
1. Clique em "Adicionar Usuário"
2. Preencha nome, email e permissões
3. Salve o usuário
4. Edite permissões conforme necessário

### 3. Aplicar Permissões
- As permissões são aplicadas automaticamente no menu lateral
- Usuários sem permissão não veem determinados módulos
- Redirecionamento automático para páginas não autorizadas

## 🔄 Integração com Sistema

### Menu Lateral
- Filtragem automática baseada em permissões
- Ocultação de módulos não autorizados
- Link para área master (apenas para usuários autorizados)

### Sistema de Autenticação
- Integração com Firebase Auth
- Verificação de permissões em tempo real
- Contexto global de permissões

## 📊 Monitoramento

### Logs
- Registro de ações do AdminMaster
- Logs de autenticação
- Rastreamento de alterações de permissões

### Analytics
- Métricas de uso por módulo
- Estatísticas de usuários
- Relatórios de acesso

## 🛡️ Boas Práticas

### Segurança
- Use senhas fortes para AdminMaster
- Monitore acessos à área master
- Faça backup regular das configurações

### Manutenção
- Revise permissões periodicamente
- Remova usuários inativos
- Mantenha logs de auditoria

## 🆘 Troubleshooting

### Problemas Comuns
1. **Erro de autenticação**: Verifique credenciais do AdminMaster
2. **Permissões não aplicadas**: Verifique configuração do Firestore
3. **Usuário não encontrado**: Confirme se está na subcoleção correta

### Suporte
- Verifique logs do console
- Confirme configuração do Firebase
- Teste com usuário master primeiro

## 📈 Próximas Funcionalidades

- [ ] Auditoria de alterações
- [ ] Backup automático de permissões
- [ ] Notificações de mudanças
- [ ] Relatórios de uso
- [ ] Integração com LDAP/AD
- [ ] Autenticação 2FA para master
