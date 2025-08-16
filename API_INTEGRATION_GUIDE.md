# 🚀 Guia de Integração - Aplicativo Móvel

## 📋 **Visão Geral**

Este documento contém todas as informações necessárias para integrar o aplicativo móvel dos prestadores de serviço com o backend do painel administrativo.

## 🔗 **URLs da API**

### **Base URL**
```
http://localhost:3001/api
```

### **URLs de Produção**
```
https://seu-dominio.com/api
```

## 🔐 **Autenticação**

### **Headers Obrigatórios**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer SEU_JWT_TOKEN"
}
```

### **Obter Token JWT**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "prestador@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-id",
      "name": "João Silva",
      "email": "j***n@email.com",
      "role": "provider"
    }
  }
}
```

## 📍 **Sistema de Rastreamento em Tempo Real**

### **1. Atualizar Localização**

**Endpoint:** `PUT /api/providers/{providerId}/location`

**Frequência:** A cada 30 segundos quando em movimento, 2 minutos quando parado

**Payload:**
```json
{
  "latitude": -23.5505,
  "longitude": -46.6333,
  "address": "Rua Augusta, 123 - São Paulo, SP",
  "locationAccuracy": 10.5,
  "speed": 25.5,
  "heading": 180,
  "altitude": 760,
  "isMoving": true,
  "batteryLevel": 85,
  "signalStrength": 4,
  "deviceInfo": {
    "platform": "android",
    "version": "1.0.0",
    "model": "Samsung Galaxy S21",
    "osVersion": "Android 12"
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "location-id",
    "providerId": "provider-id",
    "name": "João Silva",
    "email": "j***n@email.com",
    "phone": "****-1111",
    "latitude": -23.5505,
    "longitude": -46.6333,
    "status": "available",
    "lastUpdate": "2024-01-15T10:30:00.000Z",
    "batteryLevel": 85,
    "signalStrength": 4,
    "rating": 4.8,
    "vehicle": {
      "model": "Honda CG 160",
      "plate": "ABC-1234",
      "color": "Vermelho"
    }
  },
  "message": "Localização atualizada com sucesso"
}
```

### **2. Atualizar Status do Prestador**

**Endpoint:** `PUT /api/providers/{providerId}/status`

**Payload:**
```json
{
  "status": "available" // "online", "offline", "busy", "available"
}
```

### **3. Atualizar Informações do Dispositivo**

**Endpoint:** `PUT /api/providers/{providerId}/device`

**Payload:**
```json
{
  "batteryLevel": 75,
  "signalStrength": 3,
  "deviceInfo": {
    "platform": "android",
    "version": "1.0.1",
    "model": "Samsung Galaxy S21",
    "osVersion": "Android 12"
  }
}
```

### **4. Iniciar Serviço**

**Endpoint:** `POST /api/providers/{providerId}/service/start`

**Payload:**
```json
{
  "serviceId": "service-123",
  "title": "Limpeza Residencial",
  "clientName": "Maria Santos",
  "estimatedTime": 45
}
```

### **5. Finalizar Serviço**

**Endpoint:** `POST /api/providers/{providerId}/service/end`

### **6. Logout (Remover Localização)**

**Endpoint:** `DELETE /api/providers/{providerId}/location`

## 📊 **Endpoints de Consulta (Dashboard)**

### **1. Listar Todos os Prestadores**

**Endpoint:** `GET /api/providers`

**Parâmetros de Query:**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 50)
- `status`: Filtrar por status ("online", "offline", "busy", "available")
- `isOnline`: Filtrar por status online (true/false)
- `minRating`: Rating mínimo (ex: 4.0)
- `maxDistance`: Distância máxima em km
- `centerLat`: Latitude do centro da busca
- `centerLng`: Longitude do centro da busca

**Exemplo:**
```http
GET /api/providers?status=available&isOnline=true&minRating=4.5&maxDistance=10&centerLat=-23.5505&centerLng=-46.6333
```

### **2. Buscar Prestadores Próximos**

**Endpoint:** `GET /api/providers/nearby/{latitude}/{longitude}`

**Parâmetros de Query:**
- `radius`: Raio de busca em km (padrão: 10)
- `limit`: Limite de resultados (padrão: 20)

**Exemplo:**
```http
GET /api/providers/nearby/-23.5505/-46.6333?radius=5&limit=10
```

### **3. Buscar Localização de um Prestador**

**Endpoint:** `GET /api/providers/{providerId}/location`

### **4. Estatísticas dos Prestadores**

**Endpoint:** `GET /api/providers/stats/overview`

## 🔄 **Implementação no App Móvel**

### **1. Configuração Inicial**

```typescript
// config/api.ts
const API_CONFIG = {
  baseURL: 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### **2. Serviço de Localização**

```typescript
// services/LocationService.ts
class LocationService {
  private providerId: string;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(providerId: string) {
    this.providerId = providerId;
  }

  // Iniciar rastreamento
  startTracking() {
    // Solicitar permissões de localização
    this.requestLocationPermission();
    
    // Configurar listener de localização
    this.setupLocationListener();
    
    // Iniciar atualizações periódicas
    this.startPeriodicUpdates();
  }

  // Parar rastreamento
  stopTracking() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    // Remover localização do servidor
    this.removeLocation();
  }

  // Atualizar localização no servidor
  private async updateLocation(locationData: any) {
    try {
      const response = await api.put(
        `/providers/${this.providerId}/location`,
        locationData
      );
      
      if (response.data.success) {
        console.log('Localização atualizada');
      }
    } catch (error) {
      console.error('Erro ao atualizar localização:', error);
    }
  }

  // Configurar listener de localização
  private setupLocationListener() {
    // Implementar listener nativo de localização
    // (React Native Geolocation, Capacitor Geolocation, etc.)
  }

  // Iniciar atualizações periódicas
  private startPeriodicUpdates() {
    this.updateInterval = setInterval(() => {
      this.getCurrentLocation();
    }, 30000); // 30 segundos
  }

  // Obter localização atual
  private async getCurrentLocation() {
    // Implementar obtenção de localização
    // Incluir informações do dispositivo
    const locationData = {
      latitude: currentLat,
      longitude: currentLng,
      locationAccuracy: accuracy,
      speed: speed,
      heading: heading,
      altitude: altitude,
      isMoving: isMoving,
      batteryLevel: await this.getBatteryLevel(),
      signalStrength: await this.getSignalStrength(),
      deviceInfo: this.getDeviceInfo()
    };

    await this.updateLocation(locationData);
  }

  // Obter nível da bateria
  private async getBatteryLevel(): Promise<number> {
    // Implementar obtenção do nível da bateria
    return 85;
  }

  // Obter força do sinal
  private async getSignalStrength(): Promise<number> {
    // Implementar obtenção da força do sinal
    return 4;
  }

  // Obter informações do dispositivo
  private getDeviceInfo() {
    return {
      platform: Platform.OS, // 'ios' ou 'android'
      version: '1.0.0',
      model: Device.modelName,
      osVersion: Device.systemVersion
    };
  }
}
```

### **3. Gerenciamento de Status**

```typescript
// services/StatusService.ts
class StatusService {
  private providerId: string;

  constructor(providerId: string) {
    this.providerId = providerId;
  }

  // Atualizar status
  async updateStatus(status: 'online' | 'offline' | 'busy' | 'available') {
    try {
      const response = await api.put(
        `/providers/${this.providerId}/status`,
        { status }
      );
      
      return response.data.success;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      return false;
    }
  }

  // Iniciar serviço
  async startService(serviceData: any) {
    try {
      const response = await api.post(
        `/providers/${this.providerId}/service/start`,
        serviceData
      );
      
      return response.data.success;
    } catch (error) {
      console.error('Erro ao iniciar serviço:', error);
      return false;
    }
  }

  // Finalizar serviço
  async endService() {
    try {
      const response = await api.post(
        `/providers/${this.providerId}/service/end`
      );
      
      return response.data.success;
    } catch (error) {
      console.error('Erro ao finalizar serviço:', error);
      return false;
    }
  }
}
```

### **4. Implementação no App Principal**

```typescript
// App.tsx ou componente principal
import { LocationService } from './services/LocationService';
import { StatusService } from './services/StatusService';

class App {
  private locationService: LocationService;
  private statusService: StatusService;

  constructor() {
    this.locationService = new LocationService(userId);
    this.statusService = new StatusService(userId);
  }

  // Inicializar app
  async initialize() {
    // Fazer login
    await this.login();
    
    // Iniciar rastreamento
    this.locationService.startTracking();
    
    // Definir status como online
    await this.statusService.updateStatus('online');
  }

  // Fazer logout
  async logout() {
    // Parar rastreamento
    this.locationService.stopTracking();
    
    // Definir status como offline
    await this.statusService.updateStatus('offline');
    
    // Limpar dados locais
    this.clearLocalData();
  }

  // Iniciar serviço
  async startService(serviceData: any) {
    await this.statusService.startService(serviceData);
  }

  // Finalizar serviço
  async endService() {
    await this.statusService.endService();
  }
}
```

## 📱 **Permissões Necessárias**

### **Android (AndroidManifest.xml)**
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
```

### **iOS (Info.plist)**
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Este app precisa da sua localização para rastreamento em tempo real</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Este app precisa da sua localização para rastreamento em tempo real</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>Este app precisa da sua localização para rastreamento em tempo real</string>
<key>UIBackgroundModes</key>
<array>
    <string>location</string>
    <string>background-processing</string>
</array>
```

## 🔧 **Configurações de Background**

### **Android - Foreground Service**
```typescript
// services/BackgroundLocationService.ts
import { startForegroundService } from '@react-native-community/background-actions';

const backgroundTask = async (taskDataArguments: any) => {
  // Implementar tarefa de background
  while (BackgroundService.isRunning()) {
    await this.updateLocation();
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
};

const startBackgroundService = async () => {
  await BackgroundService.start(backgroundTask, {
    taskName: 'LocationTracking',
    taskTitle: 'Rastreamento de Localização',
    taskDesc: 'Atualizando localização em tempo real',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourScheme://chat/jane',
    parameters: {
      delay: 30000,
    },
  });
};
```

### **iOS - Background App Refresh**
```typescript
// services/BackgroundLocationService.ts
import BackgroundFetch from 'react-native-background-fetch';

const configureBackgroundFetch = () => {
  BackgroundFetch.configure({
    minimumFetchInterval: 15, // 15 minutos
    stopOnTerminate: false,
    enableHeadless: true,
    startOnBoot: true,
  }, async (taskId) => {
    // Atualizar localização
    await this.updateLocation();
    BackgroundFetch.finish(taskId);
  });
};
```

## 📊 **Monitoramento e Debug**

### **Logs Recomendados**
```typescript
// utils/Logger.ts
class Logger {
  static logLocationUpdate(locationData: any) {
    console.log('📍 Localização atualizada:', {
      timestamp: new Date().toISOString(),
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      accuracy: locationData.locationAccuracy,
      battery: locationData.batteryLevel,
      signal: locationData.signalStrength
    });
  }

  static logApiError(endpoint: string, error: any) {
    console.error('❌ Erro na API:', {
      endpoint,
      timestamp: new Date().toISOString(),
      error: error.message,
      status: error.response?.status
    });
  }

  static logStatusChange(oldStatus: string, newStatus: string) {
    console.log('🔄 Status alterado:', {
      timestamp: new Date().toISOString(),
      from: oldStatus,
      to: newStatus
    });
  }
}
```

### **Métricas de Performance**
- Tempo de resposta da API
- Frequência de atualizações de localização
- Taxa de sucesso das requisições
- Uso de bateria
- Qualidade do sinal GPS

## 🚨 **Tratamento de Erros**

### **Estratégias de Retry**
```typescript
// utils/RetryHandler.ts
class RetryHandler {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }

    throw lastError!;
  }
}

// Uso
await RetryHandler.withRetry(() => 
  this.updateLocation(locationData)
);
```

### **Fallback para Modo Offline**
```typescript
// services/OfflineQueue.ts
class OfflineQueue {
  private queue: any[] = [];

  async addToQueue(operation: any) {
    this.queue.push({
      ...operation,
      timestamp: Date.now()
    });
    
    await this.saveQueue();
  }

  async processQueue() {
    if (!navigator.onLine) return;

    const operations = await this.loadQueue();
    
    for (const operation of operations) {
      try {
        await this.executeOperation(operation);
        await this.removeFromQueue(operation.id);
      } catch (error) {
        console.error('Erro ao processar operação:', error);
      }
    }
  }
}
```

## 📋 **Checklist de Implementação**

- [ ] Configurar autenticação JWT
- [ ] Implementar serviço de localização
- [ ] Configurar permissões de localização
- [ ] Implementar atualizações em background
- [ ] Configurar retry automático
- [ ] Implementar modo offline
- [ ] Adicionar logs e monitoramento
- [ ] Testar em diferentes condições de rede
- [ ] Otimizar uso de bateria
- [ ] Implementar tratamento de erros

## 🔗 **Links Úteis**

- **Documentação Firebase:** https://firebase.google.com/docs
- **React Native Geolocation:** https://github.com/react-native-geolocation/react-native-geolocation
- **Capacitor Geolocation:** https://capacitorjs.com/docs/apis/geolocation
- **Background Tasks:** https://reactnative.dev/docs/background-tasks

---

**📞 Suporte:** Para dúvidas sobre a integração, entre em contato com a equipe de desenvolvimento.
