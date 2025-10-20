# 🚀 Configuração do Pagar.me na Vercel

## 📋 Variáveis de Ambiente

Configure estas variáveis no painel da Vercel para o módulo financeiro funcionar:

### 1. Acessar Configurações da Vercel

1. Acesse: https://vercel.com/
2. Selecione seu projeto
3. Vá em **Settings** > **Environment Variables**

### 2. Adicionar as Variáveis

Adicione as seguintes variáveis exatamente com estes nomes:

```bash
# ID Público do Pagar.me (Opcional)
ID_PUBLIC_PAGARME=acc_xxxxxxxxxxxxxxxxx

# Chave Pública (para o frontend tokenizar cartões)
API_KEY_PUBLIC_PAGARME=pk_test_xxxxxxxxxxxxx

# Chave Privada (para o backend processar pagamentos)
API_KEY_PRIVATE_PAGARME=sk_test_xxxxxxxxxxxxx
```

### 3. Onde Obter as Chaves

#### Passo 1: Criar/Acessar Conta no Pagar.me

1. Acesse: https://pagar.me/
2. Faça login ou crie uma conta
3. Confirme seu email

#### Passo 2: Obter as API Keys

1. No dashboard do Pagar.me, clique no ícone de configurações
2. Vá em **Configurações** > **API Keys**
3. Você verá:
   - **Secret Key** (começa com `sk_test_` ou `sk_live_`)
   - **Public Key** (começa com `pk_test_` ou `pk_live_`)

#### Passo 3: Copiar as Chaves

**Para Ambiente de TESTE:**
```bash
API_KEY_PUBLIC_PAGARME=pk_test_SUA_CHAVE_PUBLICA_AQUI
API_KEY_PRIVATE_PAGARME=sk_test_SUA_CHAVE_PRIVADA_AQUI
```

**Para Ambiente de PRODUÇÃO:**
```bash
API_KEY_PUBLIC_PAGARME=pk_live_SUA_CHAVE_PUBLICA_AQUI
API_KEY_PRIVATE_PAGARME=sk_live_SUA_CHAVE_PRIVADA_AQUI
```

### 4. Configurar na Vercel

#### Opção 1: Via Interface Web

1. No painel da Vercel, em **Environment Variables**
2. Clique em **Add New**
3. Adicione cada variável:
   - **Name:** `API_KEY_PRIVATE_PAGARME`
   - **Value:** `sk_test_xxxxxxxxxxxxx`
   - **Environment:** Selecione `Production`, `Preview` e `Development`
4. Clique em **Save**
5. Repita para as outras variáveis

#### Opção 2: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Adicionar variáveis
vercel env add API_KEY_PRIVATE_PAGARME production
# Cole a chave quando solicitado

vercel env add API_KEY_PUBLIC_PAGARME production
# Cole a chave quando solicitado

vercel env add ID_PUBLIC_PAGARME production
# Cole o ID quando solicitado
```

### 5. Redeploy do Projeto

Após adicionar as variáveis, faça um redeploy:

```bash
# Via CLI
vercel --prod

# Ou via interface da Vercel
# Vá em Deployments > ... > Redeploy
```

---

## ✅ Verificar Configuração

### Teste Local

1. Crie `.env.local` na raiz:

```bash
ID_PUBLIC_PAGARME=acc_xxxxxxxxxx
API_KEY_PUBLIC_PAGARME=pk_test_xxxxxxxxxx
API_KEY_PRIVATE_PAGARME=sk_test_xxxxxxxxxx
```

2. Inicie o servidor:

```bash
npm run dev
# ou
pnpm dev
```

3. Acesse: http://localhost:3000/financial

4. Você deve ver o dashboard carregando dados do Pagar.me

### Teste em Produção

1. Acesse seu site: `https://seudominio.vercel.app/financial`
2. O dashboard deve carregar os dados automaticamente
3. Se aparecer erro, verifique:
   - As chaves estão corretas
   - As variáveis foram salvas na Vercel
   - Foi feito redeploy após adicionar as variáveis

---

## 🎯 O Que Você Verá no Painel

### Dashboard de Controle de Recebimentos

- **Saldo Disponível** - Quanto você pode sacar agora
- **A Receber** - Valores que cairão nos próximos dias
- **Recebido no Período** - Total recebido (7 dias, 30 dias ou 1 ano)
- **Já Transferido** - Total histórico de transferências

### Métodos de Pagamento

- Quantos pagamentos via PIX
- Quantos por Cartão de Crédito
- Quantos por Cartão de Débito
- Quantos por Boleto

### Últimos Recebimentos

- Lista dos últimos 5 pagamentos aprovados
- Cliente, valor, data e método de pagamento

### Tabela de Transações

- Todas as cobranças com filtros
- Busca por cliente ou ID
- Ações: Reembolsar, Cancelar
- Auto-refresh a cada 30 segundos

---

## 🧪 Testar com Dados Fictícios

### Criar uma Transação de Teste

Use este código para criar um pagamento de teste:

```bash
# Criar um pedido com PIX
curl -X POST https://seudominio.vercel.app/api/pagarme/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Cliente Teste",
      "email": "teste@example.com",
      "document": "12345678900",
      "type": "individual"
    },
    "items": [{
      "amount": 10000,
      "description": "Produto de Teste",
      "quantity": 1
    }],
    "payments": [{
      "payment_method": "pix",
      "pix": {
        "expires_in": 3600
      }
    }]
  }'
```

### Simular Pagamento

Em ambiente de teste, você pode simular o pagamento:

1. Copie o ID do pedido criado
2. Acesse o dashboard do Pagar.me
3. Vá em **Transações**
4. Encontre o pedido
5. Clique em **Simular Pagamento**

O valor aparecerá no seu painel automaticamente!

---

## ⚠️ Importante

### Segurança

1. **NUNCA** compartilhe suas chaves privadas
2. **NUNCA** commite chaves no código
3. Use chaves de **teste** (`sk_test_`) para desenvolvimento
4. Use chaves de **produção** (`sk_live_`) apenas em produção

### Modo Teste vs Produção

**Modo Teste** (`sk_test_` / `pk_test_`)
- ✅ Grátis para testar
- ✅ Não processa pagamentos reais
- ✅ Use cartões de teste
- ✅ Simule pagamentos no dashboard

**Modo Produção** (`sk_live_` / `pk_live_`)
- ⚠️ Processa pagamentos REAIS
- ⚠️ Cobra taxas do Pagar.me
- ⚠️ Clientes pagam de verdade
- ⚠️ Dinheiro cai na sua conta

---

## 📊 Monitoramento

### Ver Transações no Pagar.me

1. Acesse: https://dashboard.pagar.me/
2. Vá em **Transações**
3. Veja todas as transações em tempo real

### Ver no Seu Painel

1. Acesse: `https://seudominio.vercel.app/financial`
2. Dashboard atualiza automaticamente
3. Tabela mostra todas as cobranças
4. Use filtros para encontrar transações específicas

---

## 🆘 Problemas Comuns

### "API Key inválida"

✅ **Solução:**
- Verifique se copiou as chaves corretamente
- Certifique-se de usar `API_KEY_PRIVATE_PAGARME` (não `PAGARME_API_KEY_PRIVATE`)
- Faça redeploy após adicionar as variáveis
- Aguarde 1-2 minutos para as variáveis propagarem

### "Nenhum dado encontrado"

✅ **Solução:**
- É normal no início (ainda não há transações)
- Crie uma transação de teste
- Aguarde alguns segundos para sincronizar
- Clique no botão "Atualizar"

### Dashboard não carrega

✅ **Solução:**
- Verifique o console do navegador (F12)
- Veja se as variáveis estão configuradas na Vercel
- Teste as APIs diretamente: `/api/pagarme/balance`
- Verifique os logs da Vercel

---

## 📞 Próximos Passos

1. ✅ Configurar as variáveis na Vercel
2. ✅ Fazer redeploy do projeto
3. ✅ Acessar o painel financeiro
4. ✅ Criar transações de teste
5. ✅ Verificar se os valores aparecem
6. ✅ Testar filtros e buscas
7. ✅ Configurar webhooks (opcional)

---

## 📚 Links Úteis

- [Dashboard Pagar.me](https://dashboard.pagar.me/)
- [Documentação Pagar.me](https://docs.pagar.me/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Guia Completo de Integração](./PAGARME_INTEGRATION_GUIDE.md)

---

**✨ Pronto! Seu módulo financeiro está configurado e rodando na Vercel!**

Agora você pode acompanhar todos os pagamentos, saldo e recebimentos em tempo real! 🚀

