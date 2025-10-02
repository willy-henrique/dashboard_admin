import { getStorage, ref, getDownloadURL, listAll, getMetadata } from 'firebase/storage';
import { app } from './firebase';
import { StorageDocument, ProviderDocuments } from '@/types/verification';
import { generateClientCode, validateClientCode, encryptSensitiveData } from './auth-documents';

// Inicializar Firebase Storage
const storage = app ? getStorage(app) : null;

// Buscar documentos de um prestador específico usando código criptografado
export const getProviderDocuments = async (encryptedClientCode: string): Promise<ProviderDocuments | null> => {
  if (!storage) {
    console.warn('Firebase Storage não inicializado');
    return null;
  }

  try {
    // Validar e descriptografar código do cliente
    const validation = validateClientCode(encryptedClientCode);
    if (!validation.valid || !validation.clientId) {
      console.warn('Código de cliente inválido');
      return null;
    }

    const clientId = validation.clientId;
    const storagePath = `Documentos/${clientId}`;
    const folderRef = ref(storage, storagePath);
    
    // Listar todos os arquivos na pasta do prestador
    const result = await listAll(folderRef);
    
    if (result.items.length === 0) {
      console.log(`Nenhum documento encontrado para o prestador ${providerId}`);
      return null;
    }

    const documents: ProviderDocuments = {
      providerId: clientId,
      documents: {},
      uploadedAt: new Date(),
      status: 'pending'
    };

    // Processar cada arquivo encontrado
    for (const itemRef of result.items) {
      try {
        const metadata = await getMetadata(itemRef);
        const downloadURL = await getDownloadURL(itemRef);
        
        const fileName = itemRef.name.toLowerCase();
        const fileExtension = fileName.split('.').pop() || '';
        
        // Determinar o tipo de documento baseado no nome do arquivo
        let docType: 'cpf' | 'cnh' | 'comprovante_residencia' | 'certificado' | 'outros' = 'outros';
        
        if (fileName.includes('cpf') || fileName.includes('rg')) {
          docType = 'cpf';
        } else if (fileName.includes('cnh') || fileName.includes('habilitacao')) {
          docType = 'cnh';
        } else if (fileName.includes('residencia') || fileName.includes('endereco') || fileName.includes('comprovante')) {
          docType = 'comprovante_residencia';
        } else if (fileName.includes('certificado') || fileName.includes('curso') || fileName.includes('diploma')) {
          docType = 'certificado';
        }

        const document: StorageDocument = {
          id: itemRef.name,
          name: metadata.name,
          url: downloadURL,
          type: getFileType(fileExtension),
          size: metadata.size,
          uploadedAt: metadata.timeCreated ? new Date(metadata.timeCreated) : new Date(),
          path: itemRef.fullPath
        };

        // Adicionar ao tipo correto
        if (!documents.documents[docType]) {
          documents.documents[docType] = [];
        }
        documents.documents[docType]!.push(document);

        // Atualizar data de upload mais recente
        if (document.uploadedAt > documents.uploadedAt) {
          documents.uploadedAt = document.uploadedAt;
        }
      } catch (error) {
        console.error(`Erro ao processar arquivo ${itemRef.name}:`, error);
      }
    }

    console.log(`✅ Documentos carregados para prestador ${clientId}:`, documents);
    return documents;
  } catch (error) {
    console.error(`Erro ao buscar documentos do prestador:`, error);
    return null;
  }
};

// Buscar todos os prestadores com documentos pendentes
export const getAllPendingProviders = async (): Promise<ProviderDocuments[]> => {
  if (!storage) {
    console.warn('Firebase Storage não inicializado');
    return [];
  }

  try {
    const storagePath = 'Documentos';
    const folderRef = ref(storage, storagePath);
    
    // Listar todas as pastas de prestadores
    const result = await listAll(folderRef);
    
    const providers: ProviderDocuments[] = [];
    
    // Para cada pasta de prestador, buscar os documentos
    for (const prefixRef of result.prefixes) {
      try {
        const clientId = prefixRef.name;
        
        // Gerar código criptografado para este cliente
        const encryptedClientCode = generateClientCode(clientId);
        
        // Buscar documentos usando código criptografado
        const documents = await getProviderDocuments(encryptedClientCode);
        
        if (documents) {
          providers.push(documents);
        }
      } catch (error) {
        console.error(`Erro ao processar prestador ${prefixRef.name}:`, error);
      }
    }

    console.log(`✅ Total de prestadores com documentos: ${providers.length}`);
    return providers;
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
export const hasProviderDocuments = async (encryptedClientCode: string): Promise<boolean> => {
  const documents = await getProviderDocuments(encryptedClientCode);
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
