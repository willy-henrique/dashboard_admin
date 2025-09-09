# Sistema Financeiro Completo

Este documento descreve o sistema financeiro desenvolvido com todas as funcionalidades solicitadas, incluindo integrações externas e gestão segura de credenciais.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Módulos Implementados](#módulos-implementados)
4. [Integrações Externas](#integrações-externas)
5. [Segurança](#segurança)
6. [Observabilidade](#observabilidade)
7. [Configuração](#configuração)
8. [Uso](#uso)
9. [Estrutura de Arquivos](#estrutura-de-arquivos)
10. [Próximos Passos](#próximos-passos)

## 🎯 Visão Geral

O sistema financeiro implementa um conjunto completo de funcionalidades para gestão financeira empresarial, incluindo:

- **Dashboard Financeiro**: KPIs, alertas e métricas consolidadas
- **Gestão de Contas**: Contas bancárias, caixa e investimentos
- **Faturamento**: Clientes, produtos, NF-e/NFS-e, pagamentos
- **Fluxo de Caixa**: Entradas manuais e automáticas, categorias, centros de custo
- **Folha de Pagamento**: Funcionários, proventos, descontos, contracheques
- **Fechamento**: Períodos, conciliação, ajustes, previsões
- **Relatórios**: PDF, Excel, CSV com filtros e agendamentos

## 🏗️ Arquitetura

### Padrões Arquiteturais

- **Domain-Driven Design (DDD)**: Separação clara entre domínios
- **Clean Architecture**: Camadas bem definidas (domain, application, infrastructure)
- **Repository Pattern**: Abstração de acesso a dados
- **Factory Pattern**: Criação de integrações
- **Strategy Pattern**: Diferentes implementações de integrações

### Camadas da Aplicação

```
src/
├── types/           # Definições de tipos TypeScript
├── lib/            # Utilitários e configurações
│   ├── config.ts   # Configuração centralizada
│   ├── logger.ts   # Sistema de logs estruturados
│   ├── queue.ts    # Sistema de filas assíncronas
│   ├── encryption.ts # Criptografia e segurança
│   └── integrations/ # Integrações externas
├── services/       # Serviços de domínio
└── controllers/    # Controladores da API (futuro)
```

## 📦 Módulos Implementados

### 1. Dashboard Financeiro (`DashboardService`)

**Funcionalidades:**
- KPIs financeiros (receita, despesas, lucro, contas a receber/pagar)
- Resumo do fluxo de caixa
- Alertas financeiros (vencimentos, saldo baixo, fluxo negativo)
- Saldos das contas
- Tendências financeiras

**Métodos Principais:**
```typescript
// Obter dados completos do dashboard
await dashboardService.getDashboardData(userId, period);

// Calcular KPIs específicos
await dashboardService.getKPIMetrics(period);

// Obter alertas financeiros
await dashboardService.getAlerts();
```

### 2. Gestão de Contas (`AccountService`)

**Funcionalidades:**
- CRUD de contas bancárias, caixa e investimentos
- Sincronização com bancos via Open Finance
- Importação de extratos
- Gestão de transações
- Saldos em tempo real

**Métodos Principais:**
```typescript
// Obter todas as contas
await accountService.getAccounts();

// Sincronizar com banco
await accountService.syncWithBank(accountId);

// Importar transações
await accountService.importTransactions(accountId, transactions);
```

### 3. Faturamento (`InvoiceService`)

**Funcionalidades:**
- CRUD de clientes e produtos
- Emissão de NF-e/NFS-e
- Criação de cobranças (PIX, Boleto, Cartão)
- Gestão de faturas e parcelas
- Cancelamento de documentos

**Métodos Principais:**
```typescript
// Criar nova fatura
await invoiceService.createInvoice(invoiceData);

// Emitir NF-e
await invoiceService.issueNFE(invoiceId);

// Criar cobrança PIX
await invoiceService.createPIXCharge(invoiceId);
```

### 4. Fluxo de Caixa (`CashFlowService`)

**Funcionalidades:**
- Entradas manuais e automáticas
- Categorização de receitas e despesas
- Centros de custo
- Filtros avançados
- Estatísticas e relatórios

**Métodos Principais:**
```typescript
// Criar entrada no fluxo de caixa
await cashFlowService.createEntry(entryData);

// Obter estatísticas
await cashFlowService.getStatistics(period);

// Importar entradas
await cashFlowService.importEntries(entries);
```

### 5. Folha de Pagamento (`PayrollService`)

**Funcionalidades:**
- Gestão de funcionários
- Proventos e descontos
- Geração de contracheques
- Cobranças da folha
- Processamento automático

**Métodos Principais:**
```typescript
// Processar folha de pagamento
await payrollService.processPayroll(period);

// Gerar contracheque
await payrollService.generatePayslip(employeeId, period);

// Obter estatísticas
await payrollService.getStatistics(period);
```

### 6. Fechamento (`ClosingService`)

**Funcionalidades:**
- Períodos de fechamento
- Conciliação automática
- Ajustes manuais
- Previsões vs. realizados
- Bloqueio de períodos

**Métodos Principais:**
```typescript
// Bloquear período
await closingService.lockPeriod(periodId, userId);

// Executar conciliação automática
await closingService.performAutomaticReconciliation(periodId);

// Criar ajuste
await closingService.createAdjustment(adjustmentData);
```

### 7. Relatórios (`ReportService`)

**Funcionalidades:**
- Geração de relatórios (PDF, Excel, CSV)
- Templates personalizáveis
- Agendamento automático
- Filtros avançados
- Estatísticas de execução

**Métodos Principais:**
```typescript
// Gerar relatório
await reportService.generateReport(type, format, filter, createdBy);

// Executar agendamentos
await reportService.executeScheduledReports();

// Obter estatísticas
await reportService.getStatistics(period);
```

## 🔌 Integrações Externas

### 1. Bancos (Open Finance)

**Implementação:** `BankIntegration`
- **Sandbox Mode**: Dados mock para desenvolvimento
- **Open Finance**: Integração real com APIs bancárias
- **Funcionalidades:**
  - Consulta de saldos
  - Importação de extratos
  - Transferências
  - Webhooks para atualizações

```typescript
// Testar conexão
await bankIntegration.testConnection();

// Obter saldo
await bankIntegration.getBalance(accountId);

// Importar extratos
await bankIntegration.getStatements(accountId, startDate, endDate);
```

### 2. Fiscal (SEFAZ/Município)

**Implementação:** `FiscalIntegration`
- **NF-e**: Nota Fiscal Eletrônica
- **NFS-e**: Nota Fiscal de Serviços Eletrônica
- **Funcionalidades:**
  - Emissão de documentos
  - Consulta de status
  - Cancelamento
  - Webhooks para atualizações

```typescript
// Emitir NF-e
await nfeIntegration.issue(invoiceData);

// Consultar status
await nfeIntegration.query(documentId);

// Cancelar documento
await nfeIntegration.cancel(documentId, reason);
```

### 3. Pagamentos (PSPs)

**Implementação:** `PaymentIntegration`
- **Sandbox Mode**: Dados mock para desenvolvimento
- **MercadoPago**: Integração real com gateway
- **Funcionalidades:**
  - PIX
  - Boleto
  - Cartão de crédito
  - Webhooks para confirmações

```typescript
// Criar cobrança PIX
await paymentIntegration.createPIXCharge(chargeData);

// Criar boleto
await paymentIntegration.createBoletoCharge(chargeData);

// Consultar status
await paymentIntegration.getChargeStatus(chargeId);
```

## 🔒 Segurança

### 1. Gestão de Credenciais

- **Variáveis de Ambiente**: Todas as credenciais via ENV
- **Criptografia**: AES-256-GCM para dados sensíveis
- **Mascaramento**: Logs não expõem dados sensíveis
- **Rotação**: Suporte a rotação de chaves

### 2. Criptografia

```typescript
// Criptografar dados
const encrypted = await encryptionService.encryptString(sensitiveData);

// Descriptografar dados
const decrypted = await encryptionService.decryptString(encrypted);

// Hash seguro
const hashed = await encryptionService.hashString(password);
```

### 3. Logs Seguros

```typescript
// Logs automáticos com mascaramento
logger.info('Operação realizada', { 
  userId, 
  amount: 1000, // Mascarado automaticamente
  accountId: 'acc-123' // Mascarado automaticamente
});
```

## 📊 Observabilidade

### 1. Logs Estruturados

- **JSON em produção**: Para agregação e análise
- **Formato legível em desenvolvimento**: Para debug
- **Níveis**: error, warn, info, debug, trace
- **Contexto**: userId, requestId, operação

### 2. Métricas

- **Tempo de execução**: Para todas as operações
- **Taxa de sucesso**: Para integrações
- **Volume de dados**: Para relatórios
- **Uso de recursos**: Para otimização

### 3. Rastreamento

- **Request ID**: Rastreamento de requisições
- **Correlation ID**: Rastreamento entre serviços
- **Audit Trail**: Log de todas as operações

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
# Core
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/financial_db
REDIS_URL=redis://localhost:6379

# Segurança
ENCRYPTION_KEY=your-32-character-encryption-key
JWT_SECRET=your-jwt-secret

# Integrações
BANK_INTEGRATION_ENABLED=true
BANK_SANDBOX_MODE=true
FISCAL_INTEGRATION_ENABLED=true
PAYMENT_INTEGRATION_ENABLED=true
```

### 2. Verificação de Configuração

```typescript
// Verificar status das integrações
const bankStatus = config.getIntegrationStatus('bank');
const fiscalStatus = config.getIntegrationStatus('fiscal');
const paymentStatus = config.getIntegrationStatus('payment');
```

## 🚀 Uso

### 1. Inicialização

```typescript
import { 
  DashboardService, 
  AccountService, 
  InvoiceService,
  config,
  logger 
} from './services';

// Verificar configuração
if (!config.isValid()) {
  logger.error('Configuração inválida');
  process.exit(1);
}

// Inicializar serviços
const dashboardService = new DashboardService();
const accountService = new AccountService();
const invoiceService = new InvoiceService();
```

### 2. Exemplo de Uso Completo

```typescript
// Obter dashboard financeiro
const dashboardData = await dashboardService.getDashboardData('user-123', 'current');

// Criar nova conta
const account = await accountService.createAccount({
  name: 'Conta Principal',
  type: 'checking',
  bankCode: '001',
  agency: '1234',
  account: '123456-7'
});

// Criar fatura
const invoice = await invoiceService.createInvoice({
  clientId: 'client-123',
  items: [
    { productId: 'prod-1', quantity: 2, unitPrice: 100 }
  ],
  dueDate: '2024-02-15'
});

// Emitir NF-e
await invoiceService.issueNFE(invoice.id);

// Criar cobrança PIX
await invoiceService.createPIXCharge(invoice.id);
```

### 3. Integração com Filas

```typescript
import { queue } from './services';

// Adicionar job para processamento assíncrono
await queue.add('process-invoice', {
  invoiceId: 'inv-123',
  userId: 'user-456'
}, {
  priority: 1,
  delay: 5000 // 5 segundos
});

// Processar jobs
queue.process('process-invoice', async (job) => {
  const { invoiceId, userId } = job.data;
  await invoiceService.processInvoice(invoiceId, userId);
});
```

## 📁 Estrutura de Arquivos

```
src/
├── types/
│   └── finance.ts              # Tipos TypeScript do sistema financeiro
├── lib/
│   ├── config.ts               # Configuração centralizada
│   ├── logger.ts               # Sistema de logs
│   ├── queue.ts                # Sistema de filas
│   ├── encryption.ts           # Criptografia
│   └── integrations/
│       ├── bank.ts             # Integração bancária
│       ├── fiscal.ts           # Integração fiscal
│       └── payments.ts         # Integração de pagamentos
├── services/
│   ├── index.ts                # Exportações
│   ├── AccountService.ts       # Gestão de contas
│   ├── InvoiceService.ts       # Faturamento
│   ├── DashboardService.ts     # Dashboard financeiro
│   ├── CashFlowService.ts      # Fluxo de caixa
│   ├── PayrollService.ts       # Folha de pagamento
│   ├── ClosingService.ts       # Fechamento
│   └── ReportService.ts        # Relatórios
└── controllers/                # Futuro: controladores da API
```

## 🔄 Próximos Passos

### 1. Implementações Pendentes

- [ ] **API REST**: Endpoints para todos os serviços
- [ ] **Autenticação**: JWT/OAuth2 com RBAC
- [ ] **Banco de Dados**: PostgreSQL com migrations
- [ ] **Testes**: Unit, integration e API contract tests
- [ ] **CI/CD**: Pipelines com verificação de secrets
- [ ] **Métricas**: Prometheus/Grafana
- [ ] **Tracing**: Jaeger/Zipkin
- [ ] **Scheduler**: Cron jobs para tarefas automáticas

### 2. Melhorias Futuras

- [ ] **Cache**: Redis para performance
- [ ] **Rate Limiting**: Proteção contra abuso
- [ ] **Webhooks**: Endpoints para integrações
- [ ] **Audit Trail**: Log completo de todas as operações
- [ ] **Backup**: Estratégia de backup automático
- [ ] **Monitoramento**: Alertas e dashboards
- [ ] **Documentação**: API docs com Swagger
- [ ] **Deploy**: Docker e Kubernetes

### 3. Integrações Adicionais

- [ ] **Email**: SendGrid/Mailgun para notificações
- [ ] **SMS**: Twilio para alertas
- [ ] **Storage**: AWS S3 para arquivos
- [ ] **OAuth**: Google/Microsoft para login empresarial
- [ ] **Mais Bancos**: Outros provedores Open Finance
- [ ] **Mais PSPs**: Outros gateways de pagamento

## 📞 Suporte

Para dúvidas ou suporte:

1. **Documentação**: Consulte este README
2. **Logs**: Verifique os logs estruturados
3. **Configuração**: Valide as variáveis de ambiente
4. **Integrações**: Teste as conexões via métodos `testConnection()`

## 📄 Licença

Este sistema foi desenvolvido como parte do projeto de painel administrativo. Todos os direitos reservados.



