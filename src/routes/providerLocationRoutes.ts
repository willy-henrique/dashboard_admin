import { Router } from 'express';
import { ProviderLocationController } from '../controllers/ProviderLocationController';

const router = Router();
const providerLocationController = new ProviderLocationController();

// Rotas para o app móvel (prestadores)
// Atualizar localização em tempo real
router.put('/:providerId/location', providerLocationController.updateLocation.bind(providerLocationController));

// Atualizar status do prestador
router.put('/:providerId/status', providerLocationController.updateProviderStatus.bind(providerLocationController));

// Iniciar serviço
router.post('/:providerId/service/start', providerLocationController.startService.bind(providerLocationController));

// Finalizar serviço
router.post('/:providerId/service/end', providerLocationController.endService.bind(providerLocationController));

// Atualizar informações do dispositivo
router.put('/:providerId/device', providerLocationController.updateDeviceInfo.bind(providerLocationController));

// Remover localização (logout)
router.delete('/:providerId/location', providerLocationController.removeProviderLocation.bind(providerLocationController));

// Rotas para o dashboard (administradores)
// Buscar localização de um prestador específico
router.get('/:providerId/location', providerLocationController.getProviderLocation.bind(providerLocationController));

// Listar todos os prestadores com localização
router.get('/', providerLocationController.getAllProviderLocations.bind(providerLocationController));

// Buscar prestadores próximos a uma localização
router.get('/nearby/:latitude/:longitude', providerLocationController.getNearbyProviders.bind(providerLocationController));

// Obter estatísticas dos prestadores
router.get('/stats/overview', providerLocationController.getProviderStats.bind(providerLocationController));

export default router;
