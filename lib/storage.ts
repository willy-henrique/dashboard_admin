import { ref, getDownloadURL, listAll, getMetadata, type FirebaseStorage } from 'firebase/storage';
import * as firebaseModule from './firebase';
const storageInstance = firebaseModule.storage as FirebaseStorage | null;
import { StorageDocument, ProviderDocuments } from '@/types/verification';

// Helper para obter URL de download com retry e tratamento de erro robusto
const getDownloadURLWithRetry = async (
  itemRef: ReturnType<typeof ref>,
  retries = 2
): Promise<string | null> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const url = await getDownloadURL(itemRef);
      return url;
    } catch (error: any) {
      const errorCode = error?.code || error?.message || '';
      const isLastAttempt = attempt === retries;
      
      // Se for erro de permissão ou arquivo não encontrado, não tenta novamente
      if (errorCode.includes('storage/object-not-found') || 
          errorCode.includes('storage/unauthorized') ||
          errorCode.includes('storage/permission-denied')) {
        console.warn(`⚠️ Arquivo não acessível: ${itemRef.fullPath} - ${errorCode}`);
        return null;
      }
      
      // Se for último attempt, loga o erro
      if (isLastAttempt) {
        console.error(`❌ Erro ao obter URL após ${retries + 1} tentativas para ${itemRef.fullPath}:`, error);
        return null;
      }
      
      // Aguarda antes de tentar novamente (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  return null;
};

// Buscar documentos de um prestador específico pelo ID (sem montar URL manual)
export const getProviderDocuments = async (providerId: string): Promise<ProviderDocuments | null> => {
  if (!storageInstance) {
    console.warn('⚠️ Firebase Storage não inicializado');
    return null;
  }

  try {
    console.log(`🔍 Buscando documentos para prestador: ${providerId}`);
    const storagePath = `Documentos/${providerId}`;
    const folderRef = ref(storageInstance, storagePath);
    
    // Listar todos os arquivos na pasta do prestador
    let result;
    try {
      result = await listAll(folderRef);
    } catch (listError: any) {
      // Se não conseguir listar, pode ser que a pasta não exista ou não tenha permissão
      if (listError?.code === 'storage/object-not-found' || 
          listError?.code === 'storage/unauthorized' ||
          listError?.code === 'storage/permission-denied') {
        console.warn(`⚠️ Não foi possível acessar a pasta ${storagePath}:`, listError.code);
        return null;
      }
      throw listError;
    }
    
    console.log(`📁 Encontrados ${result.items.length} arquivos na pasta ${storagePath}`);
    
    if (result.items.length === 0) {
      console.log(`ℹ️ Nenhum documento encontrado para o prestador ${providerId}`);
      return null;
    }

    const documents: ProviderDocuments = {
      providerId,
      documents: {},
      uploadedAt: new Date(),
      firstUploadedAt: new Date(),
      status: 'pending'
    };

    // Processar arquivos em paralelo com tratamento de erro individual
    const processed = await Promise.allSettled(
      result.items.map(async (itemRef) => {
        try {
          // Obter metadata primeiro
          let metadata;
          try {
            metadata = await getMetadata(itemRef);
          } catch (metaError: any) {
            console.warn(`⚠️ Erro ao obter metadata de ${itemRef.name}:`, metaError?.code || metaError?.message);
            return null;
          }

          // Obter URL de download com retry
          const downloadURL = await getDownloadURLWithRetry(itemRef);
          
          if (!downloadURL) {
            console.warn(`⚠️ Não foi possível obter URL para ${itemRef.name}`);
            // Mesmo sem URL, podemos criar o documento com informações básicas
            // mas sem URL de download
            return null;
          }

          const fileName = itemRef.name.toLowerCase();
          const fileExtension = fileName.split('.').pop() || '';

          let docType: 'cpf' | 'cnh' | 'comprovante_residencia' | 'certificado' | 'outros' = 'outros';
          if (fileName.includes('cpf') || fileName.includes('rg') || fileName.includes('identidade')) {
            docType = 'cpf';
          } else if (fileName.includes('cnh') || fileName.includes('habilitacao') || fileName.includes('carteira')) {
            docType = 'cnh';
          } else if (fileName.includes('residencia') || fileName.includes('endereco') || fileName.includes('comprovante') || fileName.includes('conta')) {
            docType = 'comprovante_residencia';
          } else if (fileName.includes('certificado') || fileName.includes('curso') || fileName.includes('diploma') || fileName.includes('formacao')) {
            docType = 'certificado';
          }

          console.log(`✅ Arquivo processado: ${itemRef.name} -> Tipo: ${docType}`);

          const document: StorageDocument = {
            id: itemRef.name,
            name: metadata.name || itemRef.name,
            url: downloadURL,
            type: getFileType(fileExtension),
            size: metadata.size || 0,
            uploadedAt: metadata.timeCreated ? new Date(metadata.timeCreated) : new Date(),
            path: itemRef.fullPath
          };

          return { docType, document } as const;
        } catch (error: any) {
          console.error(`❌ Erro ao processar arquivo ${itemRef.name}:`, {
            code: error?.code,
            message: error?.message,
            fullPath: itemRef.fullPath
          });
          return null;
        }
      })
    );

    // Processar resultados (Promise.allSettled retorna array de {status, value/reason})
    let minDate: Date | null = null
    let maxDate: Date | null = null
    let processedCount = 0;
    
    for (const result of processed) {
      if (result.status === 'fulfilled' && result.value) {
        const { docType, document } = result.value;
        if (!documents.documents[docType]) {
          documents.documents[docType] = [];
        }
        documents.documents[docType]!.push(document);
        processedCount++;
        
        // rastrear menor e maior datas
        if (!minDate || document.uploadedAt < minDate) minDate = document.uploadedAt;
        if (!maxDate || document.uploadedAt > maxDate) maxDate = document.uploadedAt;
      } else if (result.status === 'rejected') {
        console.error('❌ Promise rejeitada ao processar arquivo:', result.reason);
      }
    }

    // Se nenhum documento foi processado com sucesso, retorna null
    if (processedCount === 0) {
      console.warn(`⚠️ Nenhum documento pôde ser processado para o prestador ${providerId}`);
      return null;
    }

    // definir primeiro e último upload
    if (minDate) documents.firstUploadedAt = minDate;
    if (maxDate) documents.uploadedAt = maxDate;

    console.log(`✅ ${processedCount} documento(s) carregado(s) para prestador ${providerId}`);
    return documents;
  } catch (error: any) {
    console.error(`❌ Erro ao buscar documentos do prestador ${providerId}:`, {
      code: error?.code,
      message: error?.message,
      stack: error?.stack
    });
    return null;
  }
};

// Buscar todos os prestadores com documentos pendentes
export const getAllPendingProviders = async (): Promise<ProviderDocuments[]> => {
  // Em produção, buscar via API interna (Admin SDK), para não depender de regras públicas
  try {
    if (!storageInstance) {
      console.warn('⚠️ Firebase Storage não inicializado');
      return [];
    }
    
    const storagePath = 'Documentos';
    const folderRef = ref(storageInstance, storagePath);
    
    // Listar todas as pastas de prestadores
    let result;
    try {
      result = await listAll(folderRef);
    } catch (listError: any) {
      // Se não conseguir listar, pode ser problema de permissão ou pasta não existe
      if (listError?.code === 'storage/object-not-found') {
        console.warn('⚠️ Pasta Documentos não encontrada no Storage');
        return [];
      }
      if (listError?.code === 'storage/unauthorized' || listError?.code === 'storage/permission-denied') {
        console.error('❌ Sem permissão para acessar o Storage. Verifique as regras do Firebase Storage.');
        return [];
      }
      console.error('❌ Erro ao listar pastas do Storage:', listError);
      return [];
    }
    
    console.log(`📁 Encontradas ${result.prefixes.length} pastas de prestadores`);
    
    if (result.prefixes.length === 0) {
      console.log('ℹ️ Nenhuma pasta de prestador encontrada');
      return [];
    }
    
    // Buscar documentos para todos os prestadores em paralelo com Promise.allSettled
    const providers = await Promise.allSettled(
      result.prefixes.map(async (prefixRef) => {
        try {
          const clientId = prefixRef.name;
          const documents = await getProviderDocuments(clientId);
          return documents;
        } catch (error: any) {
          console.error(`❌ Erro ao processar prestador ${prefixRef.name}:`, {
            code: error?.code,
            message: error?.message
          });
          return null;
        }
      })
    );

    // Filtrar apenas resultados bem-sucedidos e não-nulos
    const filtered = providers
      .filter((p): p is PromiseFulfilledResult<ProviderDocuments | null> => 
        p.status === 'fulfilled' && p.value !== null
      )
      .map(p => p.value)
      .filter((p): p is ProviderDocuments => p !== null);
    
    console.log(`✅ Total de prestadores com documentos processados: ${filtered.length}`);
    return filtered;
  } catch (error: any) {
    console.error('❌ Erro ao buscar todos os prestadores:', {
      code: error?.code,
      message: error?.message,
      stack: error?.stack
    });
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
