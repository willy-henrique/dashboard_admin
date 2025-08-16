import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

// Rotas de autenticação
router.post('/auth/login', userController.authenticateUser.bind(userController));

// Rotas de usuários
router.post('/users', userController.createUser.bind(userController));
router.get('/users', userController.getUsers.bind(userController));
router.get('/users/stats', userController.getUserStats.bind(userController));
router.get('/users/:id', userController.getUserById.bind(userController));
router.put('/users/:id', userController.updateUser.bind(userController));
router.delete('/users/:id', userController.deleteUser.bind(userController));
router.patch('/users/:id/toggle-status', userController.toggleUserStatus.bind(userController));

// Rotas por departamento
router.get('/users/department/:department', userController.getUsersByDepartment.bind(userController));

export default router;
