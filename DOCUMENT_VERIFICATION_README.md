# Sistema de Verificação de Documentos

## Visão Geral

O sistema de verificação de documentos permite que a equipe administrativa visualize, analise e aprove/rejeite os documentos enviados pelos prestadores de serviço através do aplicativo móvel.

## Funcionalidades

### 🔍 Visualização de Documentos
- **Imagens**: Visualização completa com zoom, rotação e controles
- **PDFs**: Download direto e visualização em nova aba
- **Outros formatos**: Download para análise local

### 📋 Gestão de Verificações
- **Aprovação**: Aprovação rápida com um clique
- **Rejeição**: Rejeição com motivo obrigatório
- **Status**: Acompanhamento do status (pendente, aprovado, rejeitado)

### 🔎 Filtros e Busca
- **Por status**: Pendente, aprovado, rejeitado
- **Por tipo de documento**: CPF/RG, CNH, Comprovante de Residência, Certificados
- **Busca textual**: Por nome, email ou telefone do prestador

## Estrutura de Arquivos

```
lib/
├── storage.ts                    # Serviços do Firebase Storage
├── firebase.ts                   # Configuração do Firebase (atualizado)
└── firestore.ts                  # Serviços do Firestore

components/users/
├── document-viewer.tsx           # Componente de visualização de documentos
└── verification-document-viewer.tsx # Componente legado (pode ser removido)

hooks/
└── use-document-verification.ts  # Hook personalizado para gerenciar verificações

types/
└── verification.ts               # Tipos TypeScript para o sistema

app/users/verifications/
└── page.tsx                      # Página principal de verificações
```

## Como Usar

### 1. Acessar a Página de Verificações
Navegue para `/users/verifications` no painel administrativo.

### 2. Visualizar Documentos
- Clique em "Ver Documentos" em qualquer verificação pendente
- Use os controles de zoom e rotação para analisar imagens
- Baixe documentos para análise offline

### 3. Aprovar Prestador
- Após analisar todos os documentos
- Clique em "Aprovar Prestador"
- O prestador será automaticamente ativado

### 4. Rejeitar Prestador
- Clique em "Rejeitar Prestador"
- Informe o motivo da rejeição (obrigatório)
- Confirme a rejeição

## Integração com Firebase Storage

### Estrutura de Pastas
```
Documentos/
├── {providerId}/
│   ├── cpf_documento.jpg
│   ├── cnh_documento.jpg
│   ├── comprovante_residencia.pdf
│   └── certificado_curso.jpg
└── {outroProviderId}/
    └── ...
```

### Tipos de Documentos Suportados
- **CPF/RG**: Documentos de identidade
- **CNH**: Carteira Nacional de Habilitação
- **Comprovante de Residência**: Contas de luz, água, etc.
- **Certificados**: Cursos, especializações, etc.
- **Outros**: Qualquer outro documento relevante

## Configuração

### Variáveis de Ambiente
Certifique-se de que as seguintes variáveis estão configuradas:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Regras do Firebase Storage
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /Documentos/{providerId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == providerId || 
         request.auth.token.admin == true);
    }
  }
}
```

## Funcionalidades Técnicas

### Hook `useDocumentVerification`
```typescript
const {
  verifications,        // Lista de verificações
  loading,             // Estado de carregamento
  stats,               // Estatísticas
  approveVerification, // Função para aprovar
  rejectVerification,  // Função para rejeitar
  filterVerifications, // Função para filtrar
  refetch              // Função para recarregar
} = useDocumentVerification()
```

### Componente `DocumentViewer`
```typescript
<DocumentViewer
  documents={documents}
  documentType="cpf"
  onApprove={handleApprove}
  onReject={handleReject}
  showActions={true}
/>
```

## Estatísticas Disponíveis

- **Total**: Número total de verificações
- **Pendentes**: Verificações aguardando análise
- **Aprovados**: Verificações aprovadas
- **Rejeitados**: Verificações rejeitadas
- **Documentos por tipo**: Distribuição dos tipos de documentos

## Notificações

O sistema inclui notificações toast para:
- ✅ Aprovação bem-sucedida
- ❌ Rejeição bem-sucedida
- ⚠️ Erros de operação
- ℹ️ Informações importantes

## Responsividade

O sistema é totalmente responsivo e funciona em:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

## Próximos Passos

1. **Integração com Notificações Push**: Notificar prestadores sobre status
2. **Histórico de Verificações**: Manter log completo de ações
3. **Aprovação em Lote**: Aprovar múltiplos prestadores
4. **Relatórios**: Gerar relatórios de verificações
5. **API Externa**: Integração com serviços de validação de documentos

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console do navegador
2. Confirme as configurações do Firebase
3. Teste a conectividade com o Firebase Storage
4. Verifique as permissões de acesso
