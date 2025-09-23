# Sistema de Monitoramento de Chat - AppServiço

## 📋 Visão Geral

O Sistema de Monitoramento de Chat permite que administradores monitorem, gerenciem e modere conversas entre clientes e prestadores de serviço em tempo real.

## 🚀 Funcionalidades Principais

### 1. **Dashboard de Estatísticas**
- Total de conversas ativas, fechadas e bloqueadas
- Contagem de mensagens por tipo (texto, imagem, arquivo, localização)
- Distribuição por prioridades (baixa, média, alta, urgente)
- Alertas de conversas que requerem atenção

### 2. **Lista de Conversas**
- Visualização de todas as conversas com filtros avançados
- Busca por nome do cliente, prestador ou protocolo do pedido
- Filtros por status, prioridade e nível de monitoramento
- Indicadores visuais de mensagens não lidas

### 3. **Visualização de Mensagens**
- Interface de chat em tempo real
- Suporte a diferentes tipos de mídia
- Histórico completo de mensagens
- Identificação visual de remetentes (cliente, prestador, admin)

### 4. **Ações Administrativas**
- **Controle de Status**: Ativar, fechar, arquivar ou bloquear conversas
- **Gestão de Prioridades**: Alterar prioridade (baixa, média, alta, urgente)
- **Atribuição**: Atribuir conversas para administradores específicos
- **Notas Administrativas**: Adicionar notas privadas sobre conversas
- **Moderação**: Deletar mensagens inadequadas

### 5. **Logs de Atividades**
- Histórico completo de ações administrativas
- Filtros por tipo de ação e administrador
- Busca por detalhes das ações
- Timestamps de todas as atividades

## 🗄️ Estrutura de Dados (Firestore)

### Coleção: `chatConversations`
```typescript
{
  id: string
  clienteId: string
  clienteName: string
  clienteEmail: string
  clientePhone?: string
  prestadorId: string
  prestadorName: string
  prestadorEmail: string
  prestadorPhone?: string
  orderId?: string
  orderProtocol?: string
  status: 'active' | 'closed' | 'archived' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Date
  updatedAt: Date
  lastMessage?: {
    content: string
    senderName: string
    timestamp: Date
    messageType: 'text' | 'image' | 'file' | 'location' | 'system'
  }
  unreadCount: {
    cliente: number
    prestador: number
    admin: number
  }
  tags?: string[]
  assignedAdmin?: string
  notes?: string
  isMonitored: boolean
  monitoringLevel: 'normal' | 'high' | 'critical'
}
```

### Coleção: `chatMessages`
```typescript
{
  id: string
  chatId: string
  senderId: string
  senderName: string
  senderType: 'cliente' | 'prestador' | 'admin'
  content: string
  messageType: 'text' | 'image' | 'file' | 'location' | 'system'
  timestamp: Date
  isRead: boolean
  readBy: string[]
  metadata?: {
    fileName?: string
    fileSize?: number
    fileType?: string
    imageUrl?: string
    location?: {
      lat: number
      lng: number
      address: string
    }
  }
  isDeleted?: boolean
  deletedAt?: Date
  deletedBy?: string
}
```

### Coleção: `adminActions`
```typescript
{
  id: string
  chatId: string
  adminId: string
  adminName: string
  action: 'block' | 'unblock' | 'archive' | 'unarchive' | 'assign' | 'unassign' | 'priority_change' | 'note_add' | 'message_delete'
  details: string
  timestamp: Date
  metadata?: Record<string, any>
}
```

## 🎨 Design e Interface

### Paleta de Cores
- **Primária**: Laranja (#f97316) - Botões principais e elementos ativos
- **Secundária**: Branco (#ffffff) - Fundos e cards
- **Texto**: Cinza escuro (#111827) - Títulos e texto principal
- **Acentos**: Verde, Azul, Vermelho - Status e prioridades

### Componentes Principais
1. **ChatStatsCards**: Cartões com métricas principais
2. **ConversationsList**: Lista de conversas com filtros
3. **ChatMessages**: Interface de visualização de mensagens
4. **AdminActionsPanel**: Painel de ações administrativas
5. **AdminLogs**: Logs de atividades administrativas

## 🔧 Como Usar

### 1. **Acessando o Sistema**
- Navegue para `/dashboard/controle/chat`
- O sistema está integrado no menu "Controle" da sidebar

### 2. **Monitoramento de Conversas**
- Use a aba "Visão Geral" para ver estatísticas
- A aba "Conversas" permite listar e filtrar conversas
- A aba "Mensagens" mostra o chat em tempo real
- A aba "Logs Admin" exibe histórico de ações

### 3. **Ações Administrativas**
- Selecione uma conversa para ver detalhes
- Use o painel de ações para modificar status/prioridade
- Adicione notas administrativas quando necessário
- Monitore logs de atividades

### 4. **Filtros e Busca**
- Busque por nome, email ou protocolo
- Filtre por status, prioridade ou administrador
- Use os filtros em tempo real para encontrar conversas específicas

## 🚨 Alertas e Notificações

### Tipos de Alertas
1. **Urgentes**: Conversas com prioridade urgente
2. **Bloqueadas**: Conversas bloqueadas por violação
3. **Tempo de Resposta**: Conversas sem resposta há mais de 1 hora
4. **Não Lidas**: Mensagens não lidas pelos administradores

### Indicadores Visuais
- **Badges coloridos** para status e prioridades
- **Ícones específicos** para diferentes tipos de ação
- **Contadores** de mensagens não lidas
- **Cores de fundo** para destacar conversas importantes

## 🔒 Segurança e Permissões

### Controle de Acesso
- Apenas administradores podem acessar o sistema
- Logs de todas as ações administrativas
- Notas administrativas são privadas
- Mensagens deletadas são marcadas como removidas

### Auditoria
- Todas as ações são registradas com timestamp
- Identificação do administrador responsável
- Detalhes das ações realizadas
- Histórico completo de modificações

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Layout adaptado com navegação otimizada
- **Mobile**: Interface simplificada focada em ações essenciais

## 🔄 Integração com o Sistema

### Conexões Existentes
- **Usuários**: Integração com sistema de usuários (clientes/prestadores)
- **Pedidos**: Vinculação com protocolos de pedidos
- **Firestore**: Banco de dados principal
- **Sidebar**: Integração com navegação principal

### APIs e Hooks
- `useChatConversations`: Gerenciamento de conversas
- `useChatMessages`: Carregamento de mensagens
- `useChatStats`: Estatísticas do sistema
- `useChatActions`: Ações administrativas

## 🚀 Próximos Passos

### Funcionalidades Futuras
1. **Notificações Push**: Alertas em tempo real
2. **Relatórios Avançados**: Análise de métricas
3. **IA para Moderação**: Detecção automática de conteúdo inadequado
4. **Exportação de Dados**: Relatórios em PDF/Excel
5. **API Externa**: Integração com sistemas terceiros

### Melhorias Planejadas
- Dashboard de métricas em tempo real
- Sistema de tags personalizadas
- Filtros avançados por data
- Templates de resposta rápida
- Sistema de escalação automática

---

**Desenvolvido para AppServiço** - Sistema de monitoramento de chat profissional e completo.
