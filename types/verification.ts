export interface StorageDocument {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf' | 'document';
  size: number;
  uploadedAt: Date;
  path: string;
}

export interface ProviderDocuments {
  providerId: string;
  documents: {
    cpf?: StorageDocument[];
    cnh?: StorageDocument[];
    comprovante_residencia?: StorageDocument[];
    certificado?: StorageDocument[];
    outros?: StorageDocument[];
  };
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface DocumentVerification {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  providerPhone?: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: ProviderDocuments['documents'];
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface VerificationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalDocuments: number;
  documentsByType: Record<string, number>;
}

export interface VerificationFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'all';
  search?: string;
  documentType?: string;
}
