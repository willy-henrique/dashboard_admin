# 💳 Guia de Integração Pagar.me

## 📋 Índice

1. [Introdução](#introdução)
2. [Configuração Inicial](#configuração-inicial)
3. [Variáveis de Ambiente](#variáveis-de-ambiente)
4. [Estrutura do Módulo](#estrutura-do-módulo)
5. [APIs Disponíveis](#apis-disponíveis)
6. [Hooks React](#hooks-react)
7. [Componentes](#componentes)
8. [Webhooks](#webhooks)
9. [Testes](#testes)
10. [Produção](#produção)

---

## 🎯 Introdução

Este guia cobre a integração completa com o **Pagar.me API v5** para processamento de pagamentos, gerenciamento de clientes, assinaturas e cobranças recorrentes.

### Funcionalidades Implementadas

✅ Processamento de pagamentos (PIX, Cartão, Boleto)  
✅ Gerenciamento de clientes  
✅ Assinaturas recorrentes  
✅ Cobranças únicas e recorrentes  
✅ Reembolsos e cancelamentos  
✅ Webhooks para notificações  
✅ Analytics e relatórios  
✅ Saldo e transferências  

---

## ⚙️ Configuração Inicial

### 1. Criar Conta no Pagar.me

1. Acesse https://pagar.me/
2. Crie uma conta (teste ou produção)
3. Acesse o Dashboard
4. Vá em **Configurações > API Keys**

### 2. Obter as API Keys

Você precisará de **duas** chaves:

- **API_KEY_PRIVATE** (Secret Key) - Usada no backend
- **API_KEY_PUBLIC** (Public Key) - Usada no frontend para tokenizar cartões

⚠️ **IMPORTANTE**: Nunca exponha a chave privada no frontend!

---

## 🔐 Variáveis de Ambiente

### Vercel

Configure as seguintes variáveis no painel da Vercel:

```bash
# OBRIGATÓRIAS
PAGARME_API_KEY_PRIVATE=sk_test_xxxxxxxxxxxxx  # Chave privada (backend)
NEXT_PUBLIC_PAGARME_API_KEY_PUBLIC=pk_test_xxxxxxxxxxxxx  # Chave pública (frontend)

# OPCIONAIS
PAGARME_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx  # Secret para validar webhooks
PAGARME_WEBHOOK_URL=https://seudominio.com/api/pagarme/webhooks  # URL do webhook
```

### Ambiente Local

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# .env.local

# API Keys do Pagar.me
PAGARME_API_KEY_PRIVATE=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_PAGARME_API_KEY_PUBLIC=pk_test_xxxxxxxxxxxxx

# Webhook (opcional para desenvolvimento local)
PAGARME_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
PAGARME_WEBHOOK_URL=http://localhost:3000/api/pagarme/webhooks
```

⚠️ **NUNCA** commite o arquivo `.env.local` no git!

### Verificar Configuração

Adicione ao seu `.gitignore`:

```bash
# Environments
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## 📁 Estrutura do Módulo

```
paineladministrativo/
├── types/
│   └── pagarme.ts              # Tipos TypeScript
├── lib/
│   └── services/
│       └── pagarme-service.ts  # Serviço principal
├── hooks/
│   └── use-pagarme.ts          # Hooks React
├── app/
│   └── api/
│       └── pagarme/
│           ├── orders/         # API de pedidos
│           ├── customers/      # API de clientes
│           ├── subscriptions/  # API de assinaturas
│           ├── charges/        # API de cobranças
│           ├── analytics/      # API de analytics
│           ├── balance/        # API de saldo
│           └── webhooks/       # Receptor de webhooks
└── components/
    └── financial/
        ├── financial-dashboard.tsx    # Dashboard financeiro
        └── transactions-table.tsx     # Tabela de transações
```

---

## 🛠️ APIs Disponíveis

### Pedidos (Orders)

```typescript
// Listar pedidos
GET /api/pagarme/orders?status=paid&page=1&size=10

// Buscar pedido específico
GET /api/pagarme/orders/:id

// Criar novo pedido
POST /api/pagarme/orders
{
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "items": [{
    "amount": 10000, // R$ 100,00 em centavos
    "description": "Produto X",
    "quantity": 1
  }],
  "payments": [{
    "payment_method": "pix",
    "pix": {
      "expires_in": 3600
    }
  }]
}

// Cancelar pedido
DELETE /api/pagarme/orders/:id
```

### Clientes (Customers)

```typescript
// Listar clientes
GET /api/pagarme/customers?page=1&size=10

// Buscar cliente
GET /api/pagarme/customers/:id

// Criar cliente
POST /api/pagarme/customers
{
  "name": "João Silva",
  "email": "joao@example.com",
  "document": "12345678900",
  "type": "individual",
  "phones": {
    "mobile_phone": {
      "country_code": "55",
      "area_code": "11",
      "number": "999999999"
    }
  }
}

// Atualizar cliente
PUT /api/pagarme/customers/:id
```

### Cobranças (Charges)

```typescript
// Listar cobranças
GET /api/pagarme/charges?status=paid&page=1

// Buscar cobrança
GET /api/pagarme/charges/:id

// Reembolsar cobrança
POST /api/pagarme/charges/:id/refund
{
  "amount": 5000 // Opcional: valor parcial em centavos
}

// Cancelar cobrança
DELETE /api/pagarme/charges/:id
```

### Assinaturas (Subscriptions)

```typescript
// Listar assinaturas
GET /api/pagarme/subscriptions?status=active

// Buscar assinatura
GET /api/pagarme/subscriptions/:id

// Criar assinatura
POST /api/pagarme/subscriptions
{
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "payment_method": "credit_card",
  "currency": "BRL",
  "interval": "month",
  "interval_count": 1,
  "billing_type": "prepaid",
  "items": [{
    "description": "Plano Premium",
    "quantity": 1,
    "pricing_scheme": {
      "price": 9900 // R$ 99,00
    }
  }],
  "card": {
    "number": "4000000000000010",
    "holder_name": "JOAO SILVA",
    "exp_month": 12,
    "exp_year": 2025,
    "cvv": "123"
  }
}

// Cancelar assinatura
DELETE /api/pagarme/subscriptions/:id
```

### Analytics

```typescript
// Buscar analytics do período
GET /api/pagarme/analytics?start_date=2025-01-01&end_date=2025-01-31

// Resposta
{
  "success": true,
  "data": {
    "total_amount": 150000,
    "total_orders": 25,
    "total_customers": 18,
    "total_subscriptions": 5,
    "payment_methods": {
      "credit_card": 15,
      "pix": 8,
      "boleto": 2
    },
    "status_breakdown": {
      "paid": 20,
      "pending": 3,
      "failed": 2
    }
  }
}
```

### Saldo

```typescript
// Buscar saldo da conta
GET /api/pagarme/balance

// Resposta
{
  "success": true,
  "data": {
    "available_amount": 450000,    // R$ 4.500,00
    "waiting_funds_amount": 150000, // R$ 1.500,00
    "transferred_amount": 2000000,  // R$ 20.000,00
    "currency": "BRL"
  }
}
```

---

## 🪝 Hooks React

### usePagarmeOrders

```typescript
import { usePagarmeOrders } from '@/hooks/use-pagarme'

function MyComponent() {
  const { orders, loading, error, refetch, createOrder, cancelOrder } = 
    usePagarmeOrders({
      status: 'paid',
      autoRefresh: true  // Atualiza a cada 30s
    })

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      {orders.map(order => (
        <div key={order.id}>{order.id}</div>
      ))}
    </div>
  )
}
```

### usePagarmeCharges

```typescript
import { usePagarmeCharges } from '@/hooks/use-pagarme'

function MyComponent() {
  const { charges, loading, refetch, refundCharge, cancelCharge } = 
    usePagarmeCharges({
      status: 'paid',
      autoRefresh: true
    })

  const handleRefund = async (chargeId: string) => {
    const result = await refundCharge(chargeId)
    if (result.success) {
      alert('Reembolso processado!')
    }
  }

  return (
    <div>
      {charges.map(charge => (
        <div key={charge.id}>
          {charge.id}
          <button onClick={() => handleRefund(charge.id)}>
            Reembolsar
          </button>
        </div>
      ))}
    </div>
  )
}
```

### usePagarmeAnalytics

```typescript
import { usePagarmeAnalytics } from '@/hooks/use-pagarme'

function Dashboard() {
  const { analytics, loading, error, refetch } = 
    usePagarmeAnalytics('2025-01-01', '2025-01-31')

  if (!analytics) return null

  return (
    <div>
      <h2>Total: {PagarmeService.formatCurrency(
        PagarmeService.fromCents(analytics.total_amount)
      )}</h2>
      <p>Pedidos: {analytics.total_orders}</p>
      <p>Clientes: {analytics.total_customers}</p>
    </div>
  )
}
```

---

## 🎨 Componentes

### FinancialDashboard

Dashboard financeiro completo com métricas em tempo real:

```typescript
import { FinancialDashboard } from '@/components/financial/financial-dashboard'

function FinancialPage() {
  return <FinancialDashboard />
}
```

**Funcionalidades:**
- Receita total do mês
- Saldo disponível
- Transações processadas
- Taxa de sucesso
- Gráficos de métodos de pagamento
- Status dos pedidos

### TransactionsTable

Tabela completa de transações com filtros:

```typescript
import { TransactionsTable } from '@/components/financial/transactions-table'

function TransactionsPage() {
  return <TransactionsTable />
}
```

**Funcionalidades:**
- Listagem de cobranças
- Filtros por status e método
- Busca por ID ou cliente
- Reembolsos e cancelamentos
- Auto-refresh
- Exportação de dados

---

## 🔔 Webhooks

### Configurar no Pagar.me

1. Acesse o Dashboard do Pagar.me
2. Vá em **Configurações > Webhooks**
3. Adicione a URL: `https://seudominio.com/api/pagarme/webhooks`
4. Selecione os eventos que deseja receber
5. Copie o Webhook Secret

### Eventos Suportados

O endpoint `/api/pagarme/webhooks` processa os seguintes eventos:

- `charge.paid` - Cobrança paga
- `charge.failed` - Cobrança falhou
- `charge.refunded` - Cobrança reembolsada
- `charge.chargeback` - Chargeback recebido
- `subscription.created` - Assinatura criada
- `subscription.updated` - Assinatura atualizada
- `subscription.canceled` - Assinatura cancelada
- `order.paid` - Pedido pago
- `order.canceled` - Pedido cancelado
- `order.payment_failed` - Pagamento do pedido falhou

### Implementar Ações

Edite o arquivo `app/api/pagarme/webhooks/route.ts`:

```typescript
switch (webhook.type) {
  case 'charge.paid':
    // TODO: Liberar acesso ao produto
    // TODO: Enviar email de confirmação
    // TODO: Atualizar banco de dados
    break

  case 'subscription.canceled':
    // TODO: Revogar acesso
    // TODO: Notificar cliente
    break
}
```

---

## 🧪 Testes

### Modo de Teste

Todas as API Keys com prefixo `sk_test_` ou `pk_test_` operam em modo de teste.

### Cartões de Teste

```
Aprovado:      4000 0000 0000 0010
Recusado:      4000 0000 0000 0002
CVV Inválido:  4000 0000 0000 0127

Validade: Qualquer data futura
CVV: 123
```

### PIX de Teste

Em ambiente de teste, o QR Code do PIX é gerado mas não exige pagamento real. Você pode simular o pagamento através do dashboard.

### Webhook Local

Para testar webhooks localmente:

1. Use ngrok: `ngrok http 3000`
2. Configure a URL no Pagar.me: `https://xxx.ngrok.io/api/pagarme/webhooks`
3. Os eventos serão enviados para sua máquina local

---

## 🚀 Produção

### Checklist de Deploy

- [ ] Alterar API Keys de teste para produção
- [ ] Configurar variáveis de ambiente na Vercel
- [ ] Atualizar URL do webhook no Pagar.me
- [ ] Configurar certificado SSL
- [ ] Testar fluxo de pagamento completo
- [ ] Testar webhooks
- [ ] Configurar monitoramento de erros
- [ ] Configurar alertas de pagamento

### Segurança

1. **Nunca exponha a API Key privada**
   ```typescript
   // ❌ ERRADO
   const apiKey = 'sk_live_xxx'
   
   // ✅ CORRETO
   const apiKey = process.env.PAGARME_API_KEY_PRIVATE
   ```

2. **Valide webhooks**
   ```typescript
   // Verifique a assinatura do webhook
   const signature = request.headers.get('X-Hub-Signature')
   if (!verifyWebhookSignature(signature, body)) {
     return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
   }
   ```

3. **Use HTTPS**
   - Sempre use HTTPS em produção
   - Webhooks só funcionam com SSL válido

### Monitoramento

Recomendações:
- **Sentry** para rastreamento de erros
- **LogRocket** para sessões de usuário
- **Datadog** para métricas de performance
- Alertas no Slack/Discord para falhas de pagamento

---

## 📊 Helpers Úteis

### Conversão de Valores

```typescript
import { PagarmeService } from '@/lib/services/pagarme-service'

// Converter para centavos
const amountInCents = PagarmeService.toCents(100.50)  // 10050

// Converter de centavos
const amountInReais = PagarmeService.fromCents(10050)  // 100.50

// Formatar moeda
const formatted = PagarmeService.formatCurrency(100.50)  // "R$ 100,50"

// Validar documento
const isValid = PagarmeService.validateDocument('12345678900')  // true
```

---

## 🆘 Troubleshooting

### Erro: "API Key inválida"

- Verifique se copiou a chave corretamente
- Certifique-se de usar a chave privada no backend
- Verifique se está usando teste/produção correto

### Webhooks não chegam

- Verifique se a URL está acessível publicamente
- Certifique-se de ter HTTPS configurado
- Verifique os logs no dashboard do Pagar.me
- Use ngrok para testes locais

### Pagamento recusado

- Verifique os dados do cartão
- Confirme que está em modo de teste
- Use os cartões de teste oficiais
- Verifique os logs da transação

---

## 📚 Recursos Adicionais

- [Documentação Oficial Pagar.me](https://docs.pagar.me/)
- [API Reference v5](https://docs.pagar.me/reference/overview)
- [Dashboard Pagar.me](https://dashboard.pagar.me/)
- [Status da API](https://status.pagar.me/)
- [Suporte](https://suporte.pagar.me/)

---

## 📝 Changelog

### v1.0.0 - 2025-01-20

✨ Lançamento inicial
- Integração completa com Pagar.me API v5
- Dashboard financeiro
- Gerenciamento de transações
- Suporte a PIX, Cartão e Boleto
- Webhooks
- Analytics e relatórios

---

## 👨‍💻 Suporte

Caso tenha dúvidas ou problemas:

1. Consulte a [documentação oficial](https://docs.pagar.me/)
2. Verifique os [exemplos de código](https://docs.pagar.me/docs/exemplos)
3. Entre em contato com o suporte do Pagar.me
4. Abra uma issue no repositório

---

**Desenvolvido com ❤️ para o Painel Administrativo**

