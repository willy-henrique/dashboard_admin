import { ref, getDownloadURL, listAll, getMetadata, type FirebaseStorage } from 'firebase/storage';
import * as firebaseModule from './firebase';
const storageInstance = firebaseModule.storage as FirebaseStorage | null;
import { StorageDocument, ProviderDocuments } from '@/types/verification';

// Processar em lotes para limitar concorrência
const runInBatches = async <T, R>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> => {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(fn));
    batchResults.forEach(r => {
      if (r.status === 'fulfilled' && r.value != null) results.push(r.value);
    });
  }
  return results;
};

// Helper para obter URL de download com retry e tratamento de erro robusto
const getDownloadURLWithRetry = async (
  itemRef: ReturnType<typeof ref>,
  retries = 1
): Promise<string | null> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await getDownloadURL(itemRef);
    } catch (error: any) {
      const errorCode = error?.code || error?.message || '';
      if (errorCode.includes('storage/object-not-found') || 
          errorCode.includes('storage/unauthorized') ||
          errorCode.includes('storage/permission-denied')) {
        return null;
      }
      if (attempt === retries) return null;
      await new Promise(r => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  return null;
};

// Inferir tipo de documento pelo nome do arquivo
const inferDocType = (fileName: string): 'cpf' | 'cnh' | 'comprovante_residencia' | 'certificado' | 'outros' => {
  const lower = fileName.toLowerCase();
  if (lower.includes('cpf') || lower.includes('rg') || lower.includes('identidade')) return 'cpf';
  if (lower.includes('cnh') || lower.includes('habilitacao') || lower.includes('carteira')) return 'cnh';
  if (lower.includes('residencia') || lower.includes('endereco') || lower.includes('comprovante') || lower.includes('conta')) return 'comprovante_residencia';
  if (lower.includes('certificado') || lower.includes('curso') || lower.includes('diploma') || lower.includes('formacao')) return 'certificado';
  return 'outros';
};

// Versão leve: apenas listAll, sem getMetadata/getDownloadURL (para carregamento inicial rápido)
export const getProviderDocumentsLightweight = async (providerId: string): Promise<ProviderDocuments | null> => {
  if (!storageInstance) return null;
  try {
    const folderRef = ref(storageInstance, `Documentos/${providerId}`);
    const result = await listAll(folderRef);
    if (result.items.length === 0) return null;

    const documents: ProviderDocuments = {
      providerId,
      documents: {},
      uploadedAt: new Date(),
      firstUploadedAt: new Date(),
      status: 'pending'
    };
    const now = new Date();

    for (const itemRef of result.items) {
      const fileName = itemRef.name.toLowerCase();
      const ext = fileName.split('.').pop() || '';
      const docType = inferDocType(fileName);
      if (!documents.documents[docType]) documents.documents[docType] = [];
      documents.documents[docType]!.push({
        id: itemRef.name,
        name: itemRef.name,
        url: '', // Será carregado sob demanda
        type: ext && ['jpg','jpeg','png','gif','webp','pdf'].includes(ext) ? (ext === 'pdf' ? 'pdf' : 'image') : 'document',
        size: 0,
        uploadedAt: now,
        path: itemRef.fullPath
      });
    }
    return documents;
  } catch {
    return null;
  }
};

// Buscar documentos completos (com URLs) - usado quando o usuário abre "Ver Documentos"
export const getProviderDocuments = async (providerId: string): Promise<ProviderDocuments | null> => {
  if (!storageInstance) return null;
  try {
    const folderRef = ref(storageInstance, `Documentos/${providerId}`);
    const result = await listAll(folderRef);
    if (result.items.length === 0) return null;

    const documents: ProviderDocuments = {
      providerId,
      documents: {},
      uploadedAt: new Date(),
      firstUploadedAt: new Date(),
      status: 'pending'
    };

    // Processar em lotes de 4 para não sobrecarregar
    const processed = await runInBatches(result.items, 4, async (itemRef) => {
      try {
        const metadata = await getMetadata(itemRef).catch(() => null);
        const downloadURL = await getDownloadURLWithRetry(itemRef);
        if (!downloadURL) return null;

        const fileName = itemRef.name.toLowerCase();
        const ext = fileName.split('.').pop() || '';
        const docType = inferDocType(fileName);

        const document: StorageDocument = {
          id: itemRef.name,
          name: metadata?.name || itemRef.name,
          url: downloadURL,
          type: ext && ['jpg','jpeg','png','gif','webp'].includes(ext) ? 'image' : ext === 'pdf' ? 'pdf' : 'document',
          size: metadata?.size || 0,
          uploadedAt: metadata?.timeCreated ? new Date(metadata.timeCreated) : new Date(),
          path: itemRef.fullPath
        };
        return { docType, document } as const;
      } catch {
        return null;
      }
    });

    let minDate: Date | null = null;
    let maxDate: Date | null = null;
    processed.forEach((item) => {
      if (!item) return;
      const { docType, document } = item;
      if (!documents.documents[docType]) documents.documents[docType] = [];
      documents.documents[docType]!.push(document);
      if (!minDate || document.uploadedAt < minDate) minDate = document.uploadedAt;
      if (!maxDate || document.uploadedAt > maxDate) maxDate = document.uploadedAt;
    });

    if (Object.keys(documents.documents).length === 0) return null;
    if (minDate) documents.firstUploadedAt = minDate;
    if (maxDate) documents.uploadedAt = maxDate;
    return documents;
  } catch {
    return null;
  }
};

// Buscar todos os prestadores com documentos pendentes (versão otimizada - só listAll, sem URLs)
export const getAllPendingProviders = async (): Promise<ProviderDocuments[]> => {
  try {
    if (!storageInstance) return [];

    const folderRef = ref(storageInstance, 'Documentos');
    const result = await listAll(folderRef);
    if (result.prefixes.length === 0) return [];

    // Processar em lotes de 5 para não sobrecarregar
    const providers = await runInBatches(result.prefixes, 5, async (prefixRef) => {
      const docs = await getProviderDocumentsLightweight(prefixRef.name);
      return docs;
    });

    return providers.filter((p): p is ProviderDocuments => p !== null);
  } catch {
    return [];
  }
};

// Determinar o tipo de arquivo baseado na extensão
const getFileType = (extension: string): 'image' | 'pdf' | 'document' => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
  const pdfExtensions = ['pdf'];
  
  if (imageExtensions.includes(extension.toLowerCase())) {
    return 'image';
  } else if (pdfExtensions.includes(extension.toLowerCase())) {
    return 'pdf';
  } else {
    return 'document';
  }
};

// Baixar documento
export const downloadDocument = async (url: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpar o URL do objeto
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Erro ao baixar documento:', error);
    throw error;
  }
};

// Verificar se um prestador tem documentos
export const hasProviderDocuments = async (providerId: string): Promise<boolean> => {
  const documents = await getProviderDocuments(providerId);
  return documents !== null && Object.keys(documents.documents).length > 0;
};

// Obter estatísticas de documentos
export const getDocumentsStats = async (): Promise<{
  totalProviders: number;
  providersWithDocuments: number;
  totalDocuments: number;
  documentsByType: Record<string, number>;
}> => {
  const providers = await getAllPendingProviders();
  
  const stats = {
    totalProviders: providers.length,
    providersWithDocuments: providers.length,
    totalDocuments: 0,
    documentsByType: {} as Record<string, number>
  };

  providers.forEach(provider => {
    Object.values(provider.documents).forEach(documents => {
      if (documents) {
        stats.totalDocuments += documents.length;
        documents.forEach(doc => {
          stats.documentsByType[doc.type] = (stats.documentsByType[doc.type] || 0) + 1;
        });
      }
    });
  });

  return stats;
};
