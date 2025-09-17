# 🔐 Guia de Configuração do Firebase - Resolução de Permissões

## ❌ **Problema Atual**
Erro: `Missing or insufficient permissions` ao tentar acessar o Firestore.

## ✅ **Soluções**

### **1. Configurar Regras de Segurança no Firebase Console**

1. **Acesse**: https://console.firebase.google.com
2. **Selecione o projeto**: `aplicativoservico-143c2`
3. **Vá em**: Firestore Database > Rules
4. **Substitua as regras por**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // PERMISSÃO TOTAL PARA DESENVOLVIMENTO
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

5. **Clique em "Publish"**

### **2. Criar Arquivo .env.local**

Crie um arquivo `.env.local` na raiz do projeto com:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDEqhKhvclyd-qfo2Hmxg2e44f0cF621CI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aplicativoservico-143c2.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aplicativoservico-143c2
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aplicativoservico-143c2.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=183171649633
NEXT_PUBLIC_FIREBASE_APP_ID=1:183171649633:web:2cb40dbbdc82847cf8da20
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-TSQBJSN34S

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### **3. Verificar Configuração do Projeto**

1. **No Firebase Console**:
   - Vá em Project Settings
   - Verifique se o projeto está ativo
   - Confirme se as APIs estão habilitadas

2. **Habilitar APIs necessárias**:
   - Firestore API
   - Authentication API
   - Analytics API

### **4. Testar a Conexão**

Após configurar, teste executando:

```bash
npm run dev
```

### **5. Regras de Segurança para Produção (Opcional)**

Se quiser manter segurança em produção:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários - apenas autenticados
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // Pedidos - apenas autenticados
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    
    // Verificações - apenas autenticados
    match /provider_verifications/{verificationId} {
      allow read, write: if request.auth != null;
    }
    
    // Endereços - apenas autenticados
    match /saved_addresses/{addressId} {
      allow read, write: if request.auth != null;
    }
    
    // Analytics - apenas autenticados
    match /analytics_events/{eventId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚨 **Importante**

- **Desenvolvimento**: Use `allow read, write: if true;` para facilitar
- **Produção**: Configure regras mais restritivas
- **Sempre teste** após alterar as regras
- **Mantenha o .env.local** fora do controle de versão

## 🔍 **Verificação**

Após configurar, você deve ver:
- ✅ Dados carregando no dashboard
- ✅ Sem erros de permissão no console
- ✅ Métricas sendo exibidas corretamente
