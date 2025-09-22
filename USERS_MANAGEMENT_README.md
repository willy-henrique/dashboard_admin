# Gestão de Usuários - AppServiço

## Visão Geral

Sistema completo de gestão de usuários (Clientes e Prestadores) integrado com Firebase, oferecendo uma interface moderna, responsiva e profissional para administração.

## Funcionalidades

### 🎯 Gestão de Clientes
- **Visualização**: Lista completa de clientes com informações detalhadas
- **Criação**: Formulário intuitivo para cadastro de novos clientes
- **Edição**: Atualização de dados dos clientes existentes
- **Exclusão**: Remoção segura de clientes
- **Filtros**: Busca por nome, email, CPF e status
- **Status**: Ativação/desativação de contas

### 🛡️ Gestão de Prestadores
- **Visualização**: Lista completa de prestadores com informações detalhadas
- **Criação**: Formulário específico para cadastro de prestadores
- **Edição**: Atualização de dados dos prestadores
- **Verificação**: Sistema de verificação de documentos e credenciais
- **Avaliação**: Sistema de rating para prestadores
- **Filtros**: Busca avançada e filtros por status e verificação

### 📊 Dashboard e Métricas
- **Estatísticas em Tempo Real**: Total de usuários, ativos, bloqueados
- **Métricas de Crescimento**: Novos usuários nos últimos 30 dias
- **Indicadores Visuais**: Cards com informações importantes
- **Gráficos**: Visualizações interativas dos dados

### 🔍 Filtros e Busca
- **Busca Global**: Pesquisa por nome, email, CPF
- **Filtros de Status**: Ativos, bloqueados, todos
- **Filtros de Verificação**: Verificados, pendentes (apenas prestadores)
- **Busca em Tempo Real**: Resultados instantâneos

## Interface Responsiva

### 🖥️ Desktop
- **Tabela Completa**: Visualização detalhada em formato tabular
- **Ações Rápidas**: Menu dropdown com todas as opções
- **Filtros Avançados**: Interface completa de filtros
- **Modais Grandes**: Formulários espaçosos e organizados

### 📱 Mobile
- **Cards Responsivos**: Visualização em cards para telas pequenas
- **Navegação Touch**: Botões e elementos otimizados para toque
- **Formulários Adaptativos**: Campos organizados verticalmente
- **Ações Acessíveis**: Botões grandes e bem espaçados

### 📱 Tablet
- **Layout Híbrido**: Combinação de elementos desktop e mobile
- **Grid Responsivo**: Adaptação automática do layout
- **Navegação Intuitiva**: Interface otimizada para tablets

## Tecnologias Utilizadas

### Frontend
- **Next.js 15**: Framework React com App Router
- **TypeScript**: Tipagem estática para maior segurança
- **Tailwind CSS**: Estilização utilitária e responsiva
- **Radix UI**: Componentes acessíveis e customizáveis
- **Lucide React**: Ícones modernos e consistentes
- **date-fns**: Manipulação de datas com localização PT-BR

### Backend e Dados
- **Firebase Firestore**: Banco de dados NoSQL em tempo real
- **Firebase Auth**: Autenticação de usuários
- **Firebase Analytics**: Métricas e análises
- **React Query**: Gerenciamento de estado e cache

### Funcionalidades Avançadas
- **Toast Notifications**: Feedback visual para ações
- **Loading States**: Indicadores de carregamento
- **Error Handling**: Tratamento robusto de erros
- **Optimistic Updates**: Atualizações otimistas da UI

## Estrutura de Dados

### Usuário (User)
```typescript
interface User {
  id: string
  name: string
  email: string
  telefone?: string
  cpf?: string
  endereco?: string
  role: 'cliente' | 'prestador' | 'admin' | 'operador'
  isActive: boolean
  verificado?: boolean // Apenas para prestadores
  rating?: number // Apenas para prestadores
  createdAt: Timestamp
  lastLoginAt?: Timestamp
  updatedAt: Timestamp
}
```

## Configuração

### 1. Variáveis de Ambiente
Copie o arquivo `env.local.example` para `.env.local` e configure:

```bash
cp env.local.example .env.local
```

### 2. Configuração do Firebase
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative o Firestore Database
3. Configure as regras de segurança
4. Adicione as credenciais no arquivo `.env.local`

### 3. Regras do Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Uso

### Navegação
- **Clientes**: `/users/clients`
- **Prestadores**: `/users/providers`
- **Verificações**: `/users/verifications`

### Ações Principais
1. **Criar Usuário**: Clique em "Novo Cliente/Prestador"
2. **Editar**: Clique no menu de ações e selecione "Editar"
3. **Visualizar**: Clique no menu de ações e selecione "Visualizar"
4. **Bloquear/Desbloquear**: Use o menu de ações
5. **Verificar**: Apenas para prestadores não verificados
6. **Excluir**: Use o menu de ações (cuidado!)

### Filtros
- **Busca**: Digite no campo de busca para filtrar por nome, email ou CPF
- **Status**: Use os botões de filtro para mostrar apenas ativos, bloqueados ou todos
- **Verificação**: Para prestadores, filtre por status de verificação

## Recursos de Acessibilidade

- **Navegação por Teclado**: Todos os elementos são navegáveis via teclado
- **Screen Readers**: Textos alternativos e labels apropriados
- **Contraste**: Cores com contraste adequado para legibilidade
- **Foco Visível**: Indicadores claros de foco
- **Responsividade**: Interface adaptável a diferentes tamanhos de tela

## Performance

- **Lazy Loading**: Carregamento sob demanda de componentes
- **Memoização**: Otimização de re-renderizações
- **Debounce**: Busca otimizada com delay
- **Cache**: Dados em cache para melhor performance
- **Otimização de Imagens**: Carregamento otimizado de assets

## Segurança

- **Validação**: Validação de dados no frontend e backend
- **Sanitização**: Limpeza de dados de entrada
- **Autenticação**: Verificação de usuário autenticado
- **Autorização**: Controle de acesso baseado em roles
- **HTTPS**: Comunicação segura com o Firebase

## Manutenção

### Logs e Monitoramento
- **Console Logs**: Logs detalhados para debugging
- **Error Boundaries**: Captura de erros React
- **Firebase Analytics**: Métricas de uso
- **Performance Monitoring**: Monitoramento de performance

### Atualizações
- **Versionamento**: Controle de versão com Git
- **Dependências**: Atualizações regulares de pacotes
- **Testes**: Testes automatizados (recomendado)
- **Documentação**: Documentação sempre atualizada

## Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do Firebase
2. Consulte os logs do console
3. Verifique as regras do Firestore
4. Confirme as variáveis de ambiente

## Próximos Passos

- [ ] Implementar testes automatizados
- [ ] Adicionar exportação de dados (CSV/Excel)
- [ ] Implementar notificações push
- [ ] Adicionar relatórios avançados
- [ ] Integrar com sistema de pagamentos
- [ ] Implementar backup automático
