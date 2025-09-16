# Configuração de Variáveis de Ambiente no Vercel

## Firebase Analytics - Configuração Completa

Para que o Firebase Analytics funcione corretamente no Vercel, configure as seguintes variáveis de ambiente:

### 1. Acesse o Painel do Vercel
1. Vá para [vercel.com](https://vercel.com)
2. Selecione seu projeto
3. Vá em **Settings** > **Environment Variables**

### 2. Configure as Variáveis de Ambiente

Adicione as seguintes variáveis:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDEqhKhvclyd-qfo2Hmxg2e44f0cF621CI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aplicativoservico-143c2.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aplicativoservico-143c2
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aplicativoservico-143c2.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=183171649633
NEXT_PUBLIC_FIREBASE_APP_ID=1:183171649633:web:2cb40dbbdc82847cf8da20
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-TSQBJSN34S

# Database URL (se usando Firestore)
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://aplicativoservico-143c2-default-rtdb.firebaseio.com/
```

### 3. Configuração do Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto `aplicativoservico`
3. Vá em **Project Settings** > **General**
4. Copie as configurações do seu projeto

### 4. Regras do Firestore

Configure as regras do Firestore para permitir leitura/escrita dos eventos de analytics:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para analytics_events
    match /analytics_events/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Outras regras do seu projeto...
  }
}
```

### 5. Deploy no Vercel

Após configurar as variáveis:

1. Faça commit das alterações
2. Push para o repositório
3. O Vercel fará o deploy automaticamente
4. As variáveis de ambiente estarão disponíveis na aplicação

### 6. Verificação

Após o deploy, verifique se:

1. ✅ Firebase Analytics está funcionando
2. ✅ Eventos estão sendo rastreados
3. ✅ Dashboard mostra dados reais
4. ✅ Métricas em tempo real estão atualizando

### 7. Monitoramento

- Acesse o Firebase Console > Analytics para ver os dados
- Use o dashboard interno para métricas detalhadas
- Monitore os logs do Vercel para erros

## Funcionalidades Implementadas

### ✅ Analytics Completo
- Tracking de eventos em tempo real
- Métricas históricas
- Dashboard interativo
- Dados do Firestore integrados

### ✅ Eventos Rastreados
- Visualizações de página
- Ações do usuário
- Eventos de negócio
- Ações financeiras
- Ações de pedidos
- Ações de prestadores
- Geração de relatórios
- Erros do sistema

### ✅ Dashboard Robusto
- Métricas em tempo real
- Gráficos interativos
- Dados históricos
- Análise de tendências
- Top eventos
- Atividade recente

## Troubleshooting

### Problema: Analytics não funciona
**Solução**: Verifique se todas as variáveis de ambiente estão configuradas corretamente no Vercel.

### Problema: Dados não aparecem
**Solução**: Aguarde alguns minutos para os dados serem processados pelo Firebase.

### Problema: Erro de permissão
**Solução**: Verifique as regras do Firestore e a autenticação do usuário.

### Problema: Performance lenta
**Solução**: Os dados são carregados em tempo real, pode haver latência inicial.