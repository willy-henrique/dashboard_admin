import { Request, Response } from 'express';
import { ProviderLocationService } from '../services/ProviderLocationService';

export class ProviderLocationController {
  private providerLocationService: ProviderLocationService;

  constructor() {
    this.providerLocationService = new ProviderLocationService();
  }

  // Atualizar localização do prestador (chamado pelo app móvel)
  async updateLocation(req: Request, res: Response): Promise<void> {
    try {
      const { providerId } = req.params;
      const locationData = req.body;

      if (!providerId) {
        res.status(400).json({
          success: false,
          message: 'ID do prestador é obrigatório'
        });
        return;
      }

      if (!locationData.latitude || !locationData.longitude) {
        res.status(400).json({
          success: false,
          message: 'Latitude e longitude são obrigatórios'
        });
        return;
      }

      const providerLocation = await this.providerLocationService.updateProviderLocation(
        providerId,
        locationData
      );

      res.status(200).json({
        success: true,
        data: providerLocation.getPublicData(),
        message: 'Localização atualizada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Erro ao atualizar localização: ${error}`
      });
    }
  }

  // Buscar localização de um prestador específico
  async getProviderLocation(req: Request, res: Response): Promise<void> {
    try {
      const { providerId } = req.params;

      if (!providerId) {
        res.status(400).json({
          success: false,
          message: 'ID do prestador é obrigatório'
        });
        return;
      }

      const providerLocation = await this.providerLocationService.getProviderLocation(providerId);

      if (!providerLocation) {
        res.status(404).json({
          success: false,
          message: 'Prestador não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: providerLocation.getPublicData()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Erro ao buscar localização: ${error}`
      });
    }
  }

  // Listar todos os prestadores com localização
  async getAllProviderLocations(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 50;
      const status = req.query['status'] as string;
      const isOnline = req.query['isOnline'] as string;
      const minRating = parseFloat(req.query['minRating'] as string);
      const maxDistance = parseFloat(req.query['maxDistance'] as string);
      const centerLat = parseFloat(req.query['centerLat'] as string);
      const centerLng = parseFloat(req.query['centerLng'] as string);

      const filters: any = {};
      if (status) filters.status = status;
      if (isOnline !== undefined) filters.isOnline = isOnline === 'true';
      if (minRating) filters.minRating = minRating;
      if (maxDistance) filters.maxDistance = maxDistance;
      if (centerLat) filters.centerLat = centerLat;
      if (centerLng) filters.centerLng = centerLng;

      const result = await this.providerLocationService.getAllProviderLocations(
        page,
        limit,
        filters
      );

      res.status(200).json({
        success: true,
        data: {
          providers: result.providers.map(p => p.getPublicData()),
          pagination: {
            page,
            limit,
            total: result.total,
            hasMore: result.hasMore
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Erro ao listar prestadores: ${error}`
      });
    }
  }

  // Buscar prestadores próximos a uma localização
  async getNearbyProviders(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude } = req.params;
      const radius = parseFloat(req.query['radius'] as string) || 10;
      const limit = parseInt(req.query['limit'] as string) || 20;

      if (!latitude || !longitude) {
        res.status(400).json({
          success: false,
          message: 'Latitude e longitude são obrigatórios'
        });
        return;
      }

      const providers = await this.providerLocationService.getNearbyProviders(
        parseFloat(latitude),
        parseFloat(longitude),
        radius,
        limit
      );

      res.status(200).json({
        success: true,
        data: {
          providers: providers.map(p => p.getPublicData()),
          searchParams: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            radius,
            limit
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Erro ao buscar prestadores próximos: ${error}`
      });
    }
  }

  // Atualizar status do prestador
  async updateProviderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { providerId } = req.params;
      const { status } = req.body;

      if (!providerId) {
        res.status(400).json({
          success: false,
          message: 'ID do prestador é obrigatório'
        });
        return;
      }

      if (!status || !['online', 'offline', 'busy', 'available'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Status válido é obrigatório (online, offline, busy, available)'
        });
        return;
      }

      await this.providerLocationService.updateProviderStatus(providerId, status);

      res.status(200).json({
        success: true,
        message: 'Status atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Erro ao atualizar status: ${error}`
      });
    }
  }

  // Iniciar serviço para um prestador
  async startService(req: Request, res: Response): Promise<void> {
    try {
      const { providerId } = req.params;
      const { serviceId, title, clientName, estimatedTime } = req.body;

      if (!providerId) {
        res.status(400).json({
          success: false,
          message: 'ID do prestador é obrigatório'
        });
        return;
      }

      if (!serviceId || !title || !clientName || !estimatedTime) {
        res.status(400).json({
          success: false,
          message: 'Todos os dados do serviço são obrigatórios'
        });
        return;
      }

      await this.providerLocationService.startService(providerId, {
        id: serviceId,
        title,
        clientName,
        estimatedTime: parseInt(estimatedTime)
      });

      res.status(200).json({
        success: true,
        message: 'Serviço iniciado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Erro ao iniciar serviço: ${error}`
      });
    }
  }

  // Finalizar serviço para um prestador
  async endService(req: Request, res: Response): Promise<void> {
    try {
      const { providerId } = req.params;

      if (!providerId) {
        res.status(400).json({
          success: false,
          message: 'ID do prestador é obrigatório'
        });
        return;
      }

      await this.providerLocationService.endService(providerId);

      res.status(200).json({
        success: true,
        message: 'Serviço finalizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Erro ao finalizar serviço: ${error}`
      });
    }
  }

  // Remover localização do prestador (logout)
  async removeProviderLocation(req: Request, res: Response): Promise<void> {
    try {
      const { providerId } = req.params;

      if (!providerId) {
        res.status(400).json({
          success: false,
          message: 'ID do prestador é obrigatório'
        });
        return;
      }

      await this.providerLocationService.removeProviderLocation(providerId);

      res.status(200).json({
        success: true,
        message: 'Localização removida com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Erro ao remover localização: ${error}`
      });
    }
  }

  // Obter estatísticas dos prestadores
  async getProviderStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.providerLocationService.getProviderStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Erro ao obter estatísticas: ${error}`
      });
    }
  }

  // Atualizar informações do dispositivo
  async updateDeviceInfo(req: Request, res: Response): Promise<void> {
    try {
      const { providerId } = req.params;
      const { batteryLevel, signalStrength, deviceInfo } = req.body;

      if (!providerId) {
        res.status(400).json({
          success: false,
          message: 'ID do prestador é obrigatório'
        });
        return;
      }

      const updateData: any = {};
      if (batteryLevel !== undefined) updateData.batteryLevel = batteryLevel;
      if (signalStrength !== undefined) updateData.signalStrength = signalStrength;
      if (deviceInfo) updateData.deviceInfo = deviceInfo;

      await this.providerLocationService.updateProviderLocation(providerId, updateData);

      res.status(200).json({
        success: true,
        message: 'Informações do dispositivo atualizadas com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Erro ao atualizar informações do dispositivo: ${error}`
      });
    }
  }
}
