# 🔧 Configuração Automática do Firebase

## 🚀 **Opção 1: Script Automático (Recomendado)**

### **Passo 1: Instalar Firebase CLI**
```bash
npm install -g firebase-tools
```

### **Passo 2: Fazer Login**
```bash
firebase login
```

### **Passo 3: Executar Script**
```bash
node scripts/setup-firebase.js
```

### **Passo 4: Deploy das Regras**
```bash
node scripts/deploy-firebase.js
```

## 🎯 **Opção 2: Manual (Mais Rápida)**

### **Passo 1: Acesse o Firebase Console**
- URL: https://console.firebase.google.com
- Projeto: `aplicativoservico-143c2`

### **Passo 2: Vá em Firestore Database > Rules**

### **Passo 3: Cole as Regras**
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

### **Passo 4: Clique em "Publish"**

## 🔍 **Opção 3: Via Firebase CLI**

### **Passo 1: Instalar Firebase CLI**
```bash
npm install -g firebase-tools
```

### **Passo 2: Login**
```bash
firebase login
```

### **Passo 3: Inicializar Projeto**
```bash
firebase init firestore
```

### **Passo 4: Deploy**
```bash
firebase deploy --only firestore:rules
```

## ✅ **Verificação**

Após configurar, teste:

1. **Reinicie o servidor**: `npm run dev`
2. **Verifique o console**: Sem erros de permissão
3. **Acesse o dashboard**: Dados devem carregar

## 🆘 **Se Ainda Houver Problemas**

### **Regras Alternativas (Mais Restritivas)**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **Regras por Coleção**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if true;
    }
    match /orders/{orderId} {
      allow read, write: if true;
    }
    match /provider_verifications/{verificationId} {
      allow read, write: if true;
    }
    match /saved_addresses/{addressId} {
      allow read, write: if true;
    }
  }
}
```

## 🎉 **Resultado Esperado**

- ✅ Sem erros de permissão
- ✅ Dados carregando no dashboard
- ✅ Métricas sendo exibidas
- ✅ Sistema funcionando perfeitamente
