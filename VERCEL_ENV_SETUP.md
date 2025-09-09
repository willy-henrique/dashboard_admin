# Configuração de Variáveis de Ambiente no Vercel

## Como configurar as variáveis de ambiente no Vercel:

### 1. Acesse o Dashboard do Vercel
- Vá para [vercel.com](https://vercel.com)
- Faça login na sua conta
- Selecione o projeto `dashboard_admin`

### 2. Configure as Variáveis de Ambiente
Vá em **Settings** > **Environment Variables** e adicione as seguintes variáveis:

#### Firebase (Obrigatórias)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

#### Google Maps (Obrigatória para o mapa)
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

#### Core (Obrigatórias)
```
APP_ENV=production
NODE_ENV=production
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
```

#### Database (Opcionais - para funcionalidades completas)
```
DB_URL=postgres://user:pass@host:5432/database
DB_USER=user
DB_PASS=password
DB_HOST=host
DB_PORT=5432
DB_NAME=database
```

#### Integrações Bancárias (Opcionais)
```
BANK_API_BASE_URL=https://api.sandbox.bank.com
BANK_API_KEY=your-bank-api-key
BANK_WEBHOOK_SECRET=your-webhook-secret
BANK_CLIENT_ID=your-client-id
BANK_CLIENT_SECRET=your-client-secret
```

#### Integrações Fiscais (Opcionais)
```
NFE_API_BASE_URL=https://api.sandbox.nfe.com
NFE_API_KEY=your-nfe-api-key
NFE_AMBIENTE=2
NFE_EMPRESA_CNPJ=your-cnpj

NFSE_API_BASE_URL=https://api.sandbox.nfse.com
NFSE_API_KEY=your-nfse-api-key
NFSE_AMBIENTE=2
NFSE_EMPRESA_CNPJ=your-cnpj
```

#### Pagamentos (Opcionais)
```
PAYMENTS_API_BASE_URL=https://api.sandbox.payments.com
PAYMENTS_API_KEY=your-payments-api-key
PAYMENTS_CLIENT_ID=your-payments-client-id
PAYMENTS_CLIENT_SECRET=your-payments-client-secret
```

#### Comunicações (Opcionais)
```
EMAIL_API_KEY=your-email-api-key
EMAIL_FROM=noreply@empresa.com
SMS_API_KEY=your-sms-api-key
SMS_FROM=EMPRESA
```

#### Storage (Opcionais)
```
STORAGE_BUCKET=finance-docs
STORAGE_ACCESS_KEY=your-storage-access-key
STORAGE_SECRET_KEY=your-storage-secret-key
STORAGE_REGION=us-east-1
```

#### OAuth (Opcionais)
```
OAUTH_GOOGLE_CLIENT_ID=your-google-client-id
OAUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret
OAUTH_MICROSOFT_CLIENT_ID=your-microsoft-client-id
OAUTH_MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

#### Feature Flags (Opcionais)
```
FEATURE_BANK=true
FEATURE_NFE=true
FEATURE_NFSE=true
FEATURE_PAYMENTS=true
FEATURE_EMAIL=true
FEATURE_SMS=true
FEATURE_STORAGE=true
FEATURE_OAUTH=true
FEATURE_SANDBOX=true
```

#### Observabilidade (Opcionais)
```
LOG_LEVEL=info
LOG_FORMAT=json
SENTRY_DSN=your-sentry-dsn
```

#### Segurança (Opcionais)
```
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100
CORS_ORIGIN=https://your-domain.vercel.app
ENCRYPTION_KEY=your-encryption-key
ENCRYPTION_ALGORITHM=aes-256-gcm
```

### 3. Configuração de Ambiente
- **Environment**: Selecione `Production`, `Preview` e `Development`
- **Regions**: Deixe como padrão ou selecione as regiões desejadas

### 4. Redeploy
Após configurar as variáveis, faça um novo deploy:
- Vá em **Deployments**
- Clique em **Redeploy** no último deployment

## APIs Disponíveis

O projeto agora está configurado para funcionar com as seguintes APIs no Vercel:

- `/api/auth/*` - Autenticação
- `/api/financial/*` - Sistema financeiro
- `/api/orders/*` - Gestão de pedidos
- `/api/reports/*` - Relatórios
- `/api/users/*` - Gestão de usuários
- `/api/webhooks/*` - Webhooks para integrações

## Notas Importantes

1. **Firebase**: Configure pelo menos as variáveis do Firebase para o projeto funcionar
2. **JWT_SECRET**: Use uma chave segura e única
3. **CORS_ORIGIN**: Atualize com o domínio do seu projeto no Vercel
4. **Variáveis Opcionais**: O projeto funcionará mesmo sem as integrações externas
5. **Ambiente de Produção**: Use valores reais para produção, sandbox para desenvolvimento
