import { ref, getDownloadURL, listAll, getMetadata } from 'firebase/storage';
import { storage as firebaseStorage } from './firebase';
import { StorageDocument, ProviderDocuments } from '@/types/verification';

// Inicializar Firebase Storage (reaproveitando instância exportada de lib/firebase)
const storage = firebaseStorage;

// Buscar documentos de um prestador específico pelo ID (sem montar URL manual)
export const getProviderDocuments = async (providerId: string): Promise<ProviderDocuments | null> => {
  if (!storage) {
    console.warn('Firebase Storage não inicializado');
    return null;
  }

  try {
    console.log(`🔍 Buscando documentos para prestador: ${providerId}`);
    const storagePath = `Documentos/${providerId}`;
    const folderRef = ref(storage, storagePath);
    
    // Listar todos os arquivos na pasta do prestador
    const result = await listAll(folderRef);
    
    console.log(`📁 Encontrados ${result.items.length} arquivos na pasta ${storagePath}`);
    
    if (result.items.length === 0) {
      console.log(`Nenhum documento encontrado para o prestador ${providerId}`);
      return null;
    }

    const documents: ProviderDocuments = {
      providerId,
      documents: {},
      uploadedAt: new Date(),
      status: 'pending'
    };

    // Processar arquivos em paralelo para acelerar
    const processed = await Promise.all(result.items.map(async (itemRef) => {
      try {
        const [metadata, downloadURL] = await Promise.all([
          getMetadata(itemRef),
          getDownloadURL(itemRef),
        ]);

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

        console.log(`📄 Arquivo: ${itemRef.name} -> Tipo: ${docType}`);

        const document: StorageDocument = {
          id: itemRef.name,
          name: metadata.name,
          url: downloadURL,
          type: getFileType(fileExtension),
          size: metadata.size,
          uploadedAt: metadata.timeCreated ? new Date(metadata.timeCreated) : new Date(),
          path: itemRef.fullPath
        };

        return { docType, document } as const;
      } catch (error) {
        console.error(`Erro ao processar arquivo ${itemRef.name}:`, error);
        return null;
      }
    }));

    // Agregar resultados no objeto de saída
    for (const entry of processed) {
      if (!entry) continue;
      const { docType, document } = entry;
      if (!documents.documents[docType]) {
        documents.documents[docType] = [];
      }
      documents.documents[docType]!.push(document);
      if (document.uploadedAt > documents.uploadedAt) {
        documents.uploadedAt = document.uploadedAt;
      }
    }

    console.log(`✅ Documentos carregados para prestador ${providerId}:`, documents);
    return documents;
  } catch (error) {
    console.error(`Erro ao buscar documentos do prestador:`, error);
    return null;
  }
};

// Buscar todos os prestadores com documentos pendentes
export const getAllPendingProviders = async (): Promise<ProviderDocuments[]> => {
  // Em produção, buscar via API interna (Admin SDK), para não depender de regras públicas
  try {
    if (!storage) {
      console.warn('Firebase Storage não inicializado');
      return [];
    }
    const storagePath = 'Documentos';
    const folderRef = ref(storage, storagePath);
    
    // Listar todas as pastas de prestadores
    const result = await listAll(folderRef);
    
    // Buscar documentos para todos os prestadores em paralelo
    const providers = await Promise.all(result.prefixes.map(async (prefixRef) => {
      try {
        const clientId = prefixRef.name;
        const documents = await getProviderDocuments(clientId);
        return documents;
      } catch (error) {
        console.error(`Erro ao processar prestador ${prefixRef.name}:`, error);
        return null;
      }
    }));

    const filtered = providers.filter((p): p is ProviderDocuments => p !== null);
    console.log(`✅ Total de prestadores com documentos: ${filtered.length}`);
    return filtered;
  } catch (error) {
    console.error('Erro ao buscar todos os prestadores:', error);
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
