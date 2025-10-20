# 🚀 Instruções de Configuração - Pagar.me

## ✅ O que foi implementado

A integração completa com o Pagar.me foi implementada com sucesso! Aqui está um resumo do que foi criado:

### 📁 Arquivos Criados

#### Tipos TypeScript
- `types/pagarme.ts` - Todos os tipos para a API v5 do Pagar.me

#### Serviços
- `lib/services/pagarme-service.ts` - Serviço principal com todos os métodos da API

#### Hooks React
- `hooks/use-pagarme.ts` - Hooks customizados:
  - `usePagarmeOrders` - Gerenciar pedidos
  - `usePagarmeCustomers` - Gerenciar clientes
  - `usePagarmeCharges` - Gerenciar cobranças
  - `usePagarmeSubscriptions` - Gerenciar assinaturas
  - `usePagarmeBalance` - Consultar saldo
  - `usePagarmeAnalytics` - Analytics e métricas

#### APIs REST
- `app/api/pagarme/orders/route.ts` - CRUD de pedidos
- `app/api/pagarme/orders/[id]/route.ts` - Pedido específico
- `app/api/pagarme/customers/route.ts` - CRUD de clientes
- `app/api/pagarme/customers/[id]/route.ts` - Cliente específico
- `app/api/pagarme/subscriptions/route.ts` - CRUD de assinaturas
- `app/api/pagarme/subscriptions/[id]/route.ts` - Assinatura específica
- `app/api/pagarme/charges/route.ts` - Listar cobranças
- `app/api/pagarme/charges/[id]/route.ts` - Cobrança específica
- `app/api/pagarme/charges/[id]/refund/route.ts` - Reembolsar cobrança
- `app/api/pagarme/analytics/route.ts` - Analytics financeiras
- `app/api/pagarme/balance/route.ts` - Consultar saldo
- `app/api/pagarme/webhooks/route.ts` - Receptor de webhooks

#### Componentes Atualizados
- `components/financial/financial-dashboard.tsx` - Dashboard com dados reais do Pagar.me
- `components/financial/transactions-table.tsx` - Tabela com transações reais

#### Documentação
- `PAGARME_INTEGRATION_GUIDE.md` - Guia completo de integração
- `env.pagarme.example` - Exemplo de variáveis de ambiente
- `env.local.example` - Atualizado com variáveis do Pagar.me

---

## 🔧 Próximos Passos (OBRIGATÓRIO)

### 1️⃣ Criar Conta no Pagar.me

1. Acesse: https://pagar.me/
2. Crie uma conta (gratuita para testes)
3. Confirme seu email
4. Faça login no dashboard

### 2️⃣ Obter as API Keys

1. No dashboard, vá em **Configurações > API Keys**
2. Você verá duas chaves:
   - **Secret Key** (sk_test_xxxxx) - Para o backend
   - **Public Key** (pk_test_xxxxx) - Para o frontend
3. Copie ambas as chaves

### 3️⃣ Configurar Variáveis de Ambiente

#### Local (Desenvolvimento)

1. Crie o arquivo `.env.local` na raiz do projeto:

```bash
# Copie o arquivo de exemplo
cp env.local.example .env.local
```

2. Edite `.env.local` e adicione suas chaves:

```bash
PAGARME_API_KEY_PRIVATE=sk_test_SUA_CHAVE_AQUI
NEXT_PUBLIC_PAGARME_API_KEY_PUBLIC=pk_test_SUA_CHAVE_AQUI
```

3. Reinicie o servidor:

```bash
npm run dev
# ou
pnpm dev
```

#### Vercel (Produção)

1. Acesse o painel da Vercel
2. Vá em **Settings > Environment Variables**
3. Adicione as variáveis:

```
PAGARME_API_KEY_PRIVATE = sk_live_SUA_CHAVE_DE_PRODUCAO
NEXT_PUBLIC_PAGARME_API_KEY_PUBLIC = pk_live_SUA_CHAVE_DE_PRODUCAO
```

⚠️ **IMPORTANTE:** Para produção, use as chaves com prefixo `sk_live_` e `pk_live_`

### 4️⃣ Configurar Webhooks (Opcional, mas recomendado)

1. No dashboard do Pagar.me, vá em **Configurações > Webhooks**
2. Clique em **Adicionar Webhook**
3. Configure:
   - **URL:** `https://seudominio.com/api/pagarme/webhooks`
   - **Eventos:** Selecione todos os eventos relevantes
   - **Status:** Ativo
4. Copie o **Webhook Secret** gerado
5. Adicione ao `.env.local` ou Vercel:

```bash
PAGARME_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 5️⃣ Testar a Integração

#### Teste Local

1. Inicie o servidor:
```bash
npm run dev
```

2. Acesse o painel financeiro:
```
http://localhost:3000/financial
```

3. Os componentes tentarão buscar dados da API do Pagar.me
4. No início estará vazio (ainda não há transações)

#### Criar uma Transação de Teste

Use a API ou o código abaixo para criar um pedido de teste:

```typescript
// Exemplo de pedido PIX
const response = await fetch('/api/pagarme/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customer: {
      name: "João Silva",
      email: "joao@test.com",
      document: "12345678900",
      type: "individual"
    },
    items: [{
      amount: 10000, // R$ 100,00 em centavos
      description: "Produto de Teste",
      quantity: 1
    }],
    payments: [{
      payment_method: "pix",
      pix: {
        expires_in: 3600 // 1 hora
      }
    }]
  })
})

const data = await response.json()
console.log('QR Code PIX:', data.data.charges[0].last_transaction.pix_qr_code)
```

### 6️⃣ Cartões de Teste

Para testar cartões de crédito/débito:

```
Aprovado:      4000 0000 0000 0010
Recusado:      4000 0000 0000 0002
CVV Inválido:  4000 0000 0000 0127

Validade: Qualquer data futura (ex: 12/2025)
CVV: 123
Nome: Qualquer nome
```

---

## 📊 Como Usar no Código

### Dashboard Financeiro

O dashboard já está configurado e mostrará automaticamente:
- Receita total do mês
- Saldo disponível
- Transações processadas
- Taxa de sucesso
- Métodos de pagamento
- Status dos pedidos

```typescript
// app/financial/page.tsx
import { FinancialDashboard } from "@/components/financial/financial-dashboard"
import { TransactionsTable } from "@/components/financial/transactions-table"

export default function FinancialPage() {
  return (
    <div>
      <FinancialDashboard />
      <TransactionsTable />
    </div>
  )
}
```

### Criar Pedido com PIX

```typescript
import { usePagarmeOrders } from '@/hooks/use-pagarme'

function CheckoutPage() {
  const { createOrder } = usePagarmeOrders()

  const handleCheckout = async () => {
    const result = await createOrder({
      customer: {
        name: "Cliente Teste",
        email: "cliente@example.com"
      },
      items: [{
        amount: 5000, // R$ 50,00
        description: "Produto X",
        quantity: 1
      }],
      payments: [{
        payment_method: "pix"
      }]
    })

    if (result.success) {
      const pixCode = result.data.charges[0].last_transaction.pix_qr_code
      // Mostrar QR Code para o cliente
    }
  }

  return <button onClick={handleCheckout}>Pagar com PIX</button>
}
```

### Criar Assinatura Recorrente

```typescript
import { usePagarmeSubscriptions } from '@/hooks/use-pagarme'

function SubscriptionPage() {
  const { createSubscription } = usePagarmeSubscriptions()

  const handleSubscribe = async () => {
    const result = await createSubscription({
      customer: {
        name: "Cliente Assinante",
        email: "assinante@example.com"
      },
      payment_method: "credit_card",
      currency: "BRL",
      interval: "month",
      interval_count: 1,
      billing_type: "prepaid",
      items: [{
        description: "Plano Premium",
        quantity: 1,
        pricing_scheme: {
          price: 9900 // R$ 99,00/mês
        }
      }],
      card: {
        number: "4000000000000010",
        holder_name: "CLIENTE TESTE",
        exp_month: 12,
        exp_year: 2025,
        cvv: "123"
      }
    })

    if (result.success) {
      // Assinatura criada com sucesso
    }
  }

  return <button onClick={handleSubscribe}>Assinar Plano</button>
}
```

---

## 🔍 Monitorar Transações

### No Dashboard do Pagar.me

1. Acesse: https://dashboard.pagar.me/
2. Vá em **Transações**
3. Veja todas as transações em tempo real
4. Clique em uma transação para ver detalhes

### No Seu Painel

1. Acesse: `/financial`
2. Veja o dashboard com métricas
3. Veja a tabela de transações
4. Use os filtros para encontrar transações específicas

---

## 📚 Recursos Úteis

- [Documentação Completa](./PAGARME_INTEGRATION_GUIDE.md)
- [Documentação Oficial Pagar.me](https://docs.pagar.me/)
- [Dashboard Pagar.me](https://dashboard.pagar.me/)
- [API Reference](https://docs.pagar.me/reference/overview)
- [Status da API](https://status.pagar.me/)

---

## ⚠️ Avisos Importantes

### Segurança

1. **NUNCA** exponha a chave privada (`PAGARME_API_KEY_PRIVATE`) no frontend
2. **NUNCA** commite arquivos `.env` no git
3. Use chaves diferentes para teste e produção
4. Rotacione suas chaves periodicamente

### Produção

1. Antes de ir para produção:
   - [ ] Substitua chaves de teste por chaves de produção
   - [ ] Configure webhooks com URL de produção
   - [ ] Teste o fluxo completo de pagamento
   - [ ] Configure SSL/HTTPS
   - [ ] Configure monitoramento de erros

2. Para converter de teste → produção:
   ```bash
   # Obtenha as chaves de produção no dashboard
   # Substitua no .env ou Vercel:
   PAGARME_API_KEY_PRIVATE=sk_live_xxxxxxxxx
   NEXT_PUBLIC_PAGARME_API_KEY_PUBLIC=pk_live_xxxxxxxxx
   ```

---

## 🆘 Problemas Comuns

### "API Key inválida"

✅ **Solução:**
- Verifique se copiou a chave corretamente
- Certifique-se de usar `PAGARME_API_KEY_PRIVATE` e não `NEXT_PUBLIC_`
- Reinicie o servidor após alterar `.env.local`

### "Nenhuma transação encontrada"

✅ **Solução:**
- Isso é normal no início (ainda não há transações)
- Crie uma transação de teste usando a API
- Verifique se as chaves estão corretas

### Webhooks não chegam

✅ **Solução:**
- Use ngrok para testes locais: `ngrok http 3000`
- Configure a URL do webhook no dashboard do Pagar.me
- Certifique-se de ter HTTPS em produção

---

## 📞 Suporte

Se precisar de ajuda:

1. Consulte o [Guia Completo](./PAGARME_INTEGRATION_GUIDE.md)
2. Veja a [documentação oficial](https://docs.pagar.me/)
3. Entre em contato com o suporte do Pagar.me

---

**🎉 Parabéns! O módulo financeiro está pronto para uso!**

Agora você pode processar pagamentos, gerenciar assinaturas e acompanhar todas as transações em tempo real.

