import { ProviderLocation, IProviderLocation } from '../models/ProviderLocation';
import { db } from '../utils/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';

export class ProviderLocationService {
  private collectionName = 'provider_locations';

  // Criar ou atualizar localização do prestador
  async updateProviderLocation(providerId: string, locationData: Partial<IProviderLocation>): Promise<ProviderLocation> {
    try {
      // Verificar se já existe uma entrada para este prestador
      const existingQuery = query(
        collection(db, this.collectionName),
        where('providerId', '==', providerId)
      );
      const existingDocs = await getDocs(existingQuery);

      let providerLocation: ProviderLocation;

      if (!existingDocs.empty) {
        // Atualizar entrada existente
        const docRef = doc(db, this.collectionName, existingDocs.docs[0]?.id || '');
        const updateData = {
          ...locationData,
          lastUpdate: Timestamp.now(),
          updatedAt: Timestamp.now()
        };

        await updateDoc(docRef, updateData);
        
        // Buscar dados atualizados
        const updatedDoc = await getDoc(docRef);
        providerLocation = new ProviderLocation({ 
          id: updatedDoc.id, 
          ...updatedDoc.data() 
        });
      } else {
        // Criar nova entrada
        const newLocationData = {
          ...locationData,
          providerId,
          createdAt: Timestamp.now(),
          lastUpdate: Timestamp.now(),
          updatedAt: Timestamp.now()
        };

        const docRef = await addDoc(collection(db, this.collectionName), newLocationData);
        providerLocation = new ProviderLocation({ 
          id: docRef.id, 
          ...newLocationData,
          lastUpdate: new Date()
        });
      }

      return providerLocation;
    } catch (error) {
      throw new Error(`Erro ao atualizar localização do prestador: ${error}`);
    }
  }

  // Buscar localização de um prestador específico
  async getProviderLocation(providerId: string): Promise<ProviderLocation | null> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('providerId', '==', providerId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        if (doc) {
          return new ProviderLocation({ id: doc.id, ...doc.data() });
        }
        return null;
      }
      return null;
    } catch (error) {
      throw new Error(`Erro ao buscar localização do prestador: ${error}`);
    }
  }

  // Listar todos os prestadores com localização
  async getAllProviderLocations(
    _page: number = 1,
    limitCount: number = 50,
    filters?: {
      status?: string;
      isOnline?: boolean;
      minRating?: number;
      maxDistance?: number; // em km
      centerLat?: number;
      centerLng?: number;
    }
  ): Promise<{ providers: ProviderLocation[]; total: number; hasMore: boolean }> {
    try {
      let q = query(
        collection(db, this.collectionName),
        orderBy('lastUpdate', 'desc')
      );

      // Aplicar filtros
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters?.isOnline !== undefined) {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        if (filters.isOnline) {
          q = query(q, where('lastUpdate', '>', Timestamp.fromDate(fiveMinutesAgo)));
        } else {
          q = query(q, where('lastUpdate', '<=', Timestamp.fromDate(fiveMinutesAgo)));
        }
      }

      // Aplicar paginação
      q = query(q, limit(limitCount));

      const querySnapshot = await getDocs(q);
      const providers: ProviderLocation[] = [];

      querySnapshot.forEach((doc) => {
        const provider = new ProviderLocation({ id: doc.id, ...doc.data() });
        
        // Filtrar por distância se especificado
        if (filters?.maxDistance && filters?.centerLat && filters?.centerLng) {
          const distance = provider.calculateDistanceTo(filters.centerLat, filters.centerLng);
          if (distance <= filters.maxDistance) {
            providers.push(provider);
          }
        } else {
          providers.push(provider);
        }
      });

      // Filtrar por rating se especificado
      let filteredProviders = providers;
      if (filters?.minRating) {
        filteredProviders = providers.filter(p => p.rating >= filters.minRating!);
      }

      return {
        providers: filteredProviders,
        total: filteredProviders.length,
        hasMore: filteredProviders.length === limitCount
      };
    } catch (error) {
      throw new Error(`Erro ao listar localizações dos prestadores: ${error}`);
    }
  }

  // Buscar prestadores próximos a uma localização
  async getNearbyProviders(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    limitCount: number = 20
  ): Promise<ProviderLocation[]> {
    try {
      // Buscar todos os prestadores online
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const q = query(
        collection(db, this.collectionName),
        where('lastUpdate', '>', Timestamp.fromDate(fiveMinutesAgo)),
        orderBy('lastUpdate', 'desc'),
        limit(100) // Buscar mais para filtrar por distância
      );

      const querySnapshot = await getDocs(q);
      const nearbyProviders: ProviderLocation[] = [];

      querySnapshot.forEach((doc) => {
        const provider = new ProviderLocation({ id: doc.id, ...doc.data() });
        const distance = provider.calculateDistanceTo(latitude, longitude);
        
        if (distance <= radiusKm) {
          nearbyProviders.push(provider);
        }
      });

      // Ordenar por distância e limitar resultados
      nearbyProviders.sort((a, b) => {
        const distanceA = a.calculateDistanceTo(latitude, longitude);
        const distanceB = b.calculateDistanceTo(latitude, longitude);
        return distanceA - distanceB;
      });

      return nearbyProviders.slice(0, limitCount);
    } catch (error) {
      throw new Error(`Erro ao buscar prestadores próximos: ${error}`);
    }
  }

  // Atualizar status do prestador
  async updateProviderStatus(providerId: string, status: IProviderLocation['status']): Promise<void> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('providerId', '==', providerId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = doc(db, this.collectionName, querySnapshot.docs[0]?.id || '');
        await updateDoc(docRef, {
          status,
          lastUpdate: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      throw new Error(`Erro ao atualizar status do prestador: ${error}`);
    }
  }

  // Iniciar serviço para um prestador
  async startService(
    providerId: string, 
    service: {
      id: string;
      title: string;
      clientName: string;
      estimatedTime: number;
    }
  ): Promise<void> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('providerId', '==', providerId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = doc(db, this.collectionName, querySnapshot.docs[0]?.id || '');
        await updateDoc(docRef, {
          status: 'busy',
          currentService: {
            ...service,
            startTime: Timestamp.now()
          },
          lastUpdate: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      throw new Error(`Erro ao iniciar serviço: ${error}`);
    }
  }

  // Finalizar serviço para um prestador
  async endService(providerId: string): Promise<void> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('providerId', '==', providerId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = doc(db, this.collectionName, querySnapshot.docs[0]?.id || '');
        await updateDoc(docRef, {
          status: 'available',
          currentService: null,
          lastUpdate: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      throw new Error(`Erro ao finalizar serviço: ${error}`);
    }
  }

  // Remover localização de um prestador (quando ele faz logout)
  async removeProviderLocation(providerId: string): Promise<void> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('providerId', '==', providerId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = doc(db, this.collectionName, querySnapshot.docs[0]?.id || '');
        await deleteDoc(docRef);
      }
    } catch (error) {
      throw new Error(`Erro ao remover localização do prestador: ${error}`);
    }
  }

  // Obter estatísticas de prestadores
  async getProviderStats(): Promise<{
    total: number;
    online: number;
    available: number;
    busy: number;
    offline: number;
    averageRating: number;
    averageResponseTime: number;
  }> {
    try {
      const allProviders = await this.getAllProviderLocations(1, 1000);
      const providers = allProviders.providers;

      const stats = {
        total: providers.length,
        online: 0,
        available: 0,
        busy: 0,
        offline: 0,
        averageRating: 0,
        averageResponseTime: 0
      };

      let totalRating = 0;
      let totalResponseTime = 0;
      let responseTimeCount = 0;

      providers.forEach(provider => {
        // Contar por status
        if (provider.isOnline()) {
          stats.online++;
        } else {
          stats.offline++;
        }

        if (provider.status === 'available') stats.available++;
        if (provider.status === 'busy') stats.busy++;

        // Calcular rating médio
        totalRating += provider.rating;

        // Calcular tempo de resposta médio (se houver dados)
        if (provider.currentService) {
          const responseTime = provider.currentService.startTime.getTime() - provider.lastUpdate.getTime();
          totalResponseTime += responseTime;
          responseTimeCount++;
        }
      });

      stats.averageRating = stats.total > 0 ? totalRating / stats.total : 0;
      stats.averageResponseTime = responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0;

      return stats;
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas dos prestadores: ${error}`);
    }
  }

  // Listener em tempo real para mudanças de localização
  subscribeToProviderLocations(
    callback: (providers: ProviderLocation[]) => void,
    filters?: {
      status?: string;
      isOnline?: boolean;
    }
  ): () => void {
    let q = query(
      collection(db, this.collectionName),
      orderBy('lastUpdate', 'desc')
    );

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const providers: ProviderLocation[] = [];
      
      snapshot.forEach((doc) => {
        if (doc) {
          const provider = new ProviderLocation({ id: doc.id, ...doc.data() });
        
          // Filtrar por status online se especificado
          if (filters?.isOnline !== undefined) {
            if (filters.isOnline === provider.isOnline()) {
              providers.push(provider);
            }
          } else {
            providers.push(provider);
          }
        }
      });

      callback(providers);
    });

    return unsubscribe;
  }

  // Listener para mudanças de localização de um prestador específico
  subscribeToProviderLocation(
    providerId: string,
    callback: (provider: ProviderLocation | null) => void
  ): () => void {
    const q = query(
      collection(db, this.collectionName),
      where('providerId', '==', providerId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        if (doc) {
          const provider = new ProviderLocation({ id: doc.id, ...doc.data() });
          callback(provider);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    });

    return unsubscribe;
  }
}
