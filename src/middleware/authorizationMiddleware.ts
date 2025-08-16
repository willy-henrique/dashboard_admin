import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export class AuthorizationMiddleware {
  // Middleware para verificar se o usuário tem permissão para um módulo específico
  static requirePermission(module: keyof User['permissions'], action?: string) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Usuário não autenticado'
          });
        }

        if (!req.user.hasPermission(module, action)) {
          return res.status(403).json({
            success: false,
            message: `Acesso negado: permissão insuficiente para ${module}${action ? ` - ${action}` : ''}`
          });
        }

        next();
      } catch (error) {
        console.error('Erro na verificação de permissão:', error);
        return res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    };
  }

  // Middleware para verificar acesso ao módulo de controle
  static requireControleAccess(module: 'autemMobile' | 'estoque' | 'frota') {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Usuário não autenticado'
          });
        }

        if (!req.user.hasControleAccess(module)) {
          return res.status(403).json({
            success: false,
            message: `Acesso negado: sem permissão para o módulo ${module}`
          });
        }

        next();
      } catch (error) {
        console.error('Erro na verificação de acesso ao controle:', error);
        return res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    };
  }

  // Middleware para verificar se o usuário é admin
  static requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado: requer privilégios de administrador'
        });
      }

      next();
    } catch (error) {
      console.error('Erro na verificação de admin:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Middleware para verificar se o usuário é manager ou admin
  static requireManagerOrAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      if (!['admin', 'manager'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado: requer privilégios de gerente ou administrador'
        });
      }

      next();
    } catch (error) {
      console.error('Erro na verificação de manager/admin:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Middleware para verificar se o usuário tem role específico
  static requireRole(roles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Usuário não autenticado'
          });
        }

        if (!roles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            message: `Acesso negado: role requerido: ${roles.join(', ')}`
          });
        }

        next();
      } catch (error) {
        console.error('Erro na verificação de role:', error);
        return res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }
    };
  }

  // Middleware para verificar se o usuário está ativo
  static requireActiveUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado: conta de usuário inativa'
        });
      }

      next();
    } catch (error) {
      console.error('Erro na verificação de usuário ativo:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Middleware combinado: autenticação + permissão + usuário ativo
  static requireAuthAndPermission(module: keyof User['permissions'], action?: string) {
    return [
      AuthorizationMiddleware.requireActiveUser,
      AuthorizationMiddleware.requirePermission(module, action)
    ];
  }

  // Middleware combinado: autenticação + acesso ao controle + usuário ativo
  static requireAuthAndControleAccess(module: 'autemMobile' | 'estoque' | 'frota') {
    return [
      AuthorizationMiddleware.requireActiveUser,
      AuthorizationMiddleware.requireControleAccess(module)
    ];
  }
}

// Exportar tipos para uso em outros arquivos
export type { AuthenticatedRequest };
