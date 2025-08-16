import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Criar novo usuário
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role, department, phone } = req.body;

      // Validações básicas
      if (!name || !email || !password) {
        res.status(400).json({ 
          success: false, 
          message: 'Nome, email e senha são obrigatórios' 
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ 
          success: false, 
          message: 'Senha deve ter pelo menos 6 caracteres' 
        });
        return;
      }

      const userData = {
        name,
        email: email.toLowerCase(),
        password,
        role: role || 'user',
        department,
        phone,
        isActive: true
      };

      const user = await this.userService.createUser(userData);
      const publicData = user.getPublicData();

      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: publicData
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Autenticar usuário
  async authenticateUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
        return;
      }

      const user = await this.userService.authenticateUser(email.toLowerCase(), password);
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Email ou senha inválidos'
        });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({
          success: false,
          message: 'Usuário está desativado'
        });
        return;
      }

      const publicData = user.getPublicData();

      res.status(200).json({
        success: true,
        message: 'Autenticação realizada com sucesso',
        data: publicData
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Buscar usuário por ID
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID do usuário é obrigatório'
        });
        return;
      }

      const user = await this.userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
        return;
      }

      const publicData = user.getPublicData();

      res.status(200).json({
        success: true,
        data: publicData
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Listar usuários
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;
      const role = req.query['role'] as string;
      const isActive = req.query['isActive'] as string;
      const department = req.query['department'] as string;

      const filters: any = {};
      if (role) filters.role = role;
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (department) filters.department = department;

      const result = await this.userService.getUsers(page, limit, filters);
      
      // Mascarar emails dos usuários
      const usersWithMaskedEmails = result.users.map(user => user.getPublicData());

      res.status(200).json({
        success: true,
        data: {
          users: usersWithMaskedEmails,
          pagination: {
            page,
            limit,
            total: result.total,
            hasMore: result.hasMore
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Atualizar usuário
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID do usuário é obrigatório'
        });
        return;
      }

      // Remover campos que não devem ser atualizados
      delete updateData.id;
      delete updateData.createdAt;

      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
        return;
      }

      await this.userService.updateUser(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Deletar usuário
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID do usuário é obrigatório'
        });
        return;
      }

      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
        return;
      }

      await this.userService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: 'Usuário deletado com sucesso'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Ativar/Desativar usuário
  async toggleUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID do usuário é obrigatório'
        });
        return;
      }

      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
        return;
      }

      await this.userService.toggleUserStatus(id);

      const newStatus = user.isActive ? 'desativado' : 'ativado';

      res.status(200).json({
        success: true,
        message: `Usuário ${newStatus} com sucesso`
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Buscar usuários por departamento
  async getUsersByDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { department } = req.params;

      if (!department) {
        res.status(400).json({
          success: false,
          message: 'Departamento é obrigatório'
        });
        return;
      }

      const users = await this.userService.getUsersByDepartment(department);
      const usersWithMaskedEmails = users.map(user => user.getPublicData());

      res.status(200).json({
        success: true,
        data: usersWithMaskedEmails
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }

  // Obter estatísticas de usuários
  async getUserStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.userService.getUserStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }
}
