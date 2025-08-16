import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export class AuthMiddleware {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Middleware para verificar se usuário está autenticado
  async authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticação não fornecido'
        });
        return;
      }

      // Aqui você implementaria a verificação do JWT token
      // Por enquanto, vamos simular uma verificação básica
      const userId = this.verifyToken(token);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token inválido'
        });
        return;
      }

      const user = await this.userService.getUserById(userId);
      
      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Usuário não encontrado ou inativo'
        });
        return;
      }

      req.user = user.getPublicData();
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro na autenticação'
      });
    }
  }

  // Middleware para verificar se usuário tem role específico
  requireRole(roles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: 'Acesso negado. Permissão insuficiente.'
        });
        return;
      }

      next();
    };
  }

  // Middleware para verificar se usuário é admin
  requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.requireRole(['admin'])(req, res, next);
  }

  // Middleware para verificar se usuário é admin ou manager
  requireAdminOrManager(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.requireRole(['admin', 'manager'])(req, res, next);
  }

  // Verificar se usuário pode acessar recursos de outro usuário
  canAccessUser(targetUserId: string) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      // Admin pode acessar qualquer usuário
      if (req.user.role === 'admin') {
        next();
        return;
      }

      // Usuário só pode acessar seus próprios dados
      if (req.user.id === targetUserId) {
        next();
        return;
      }

      res.status(403).json({
        success: false,
        message: 'Acesso negado. Você só pode acessar seus próprios dados.'
      });
    };
  }

  // Verificar se usuário pode modificar pedido
  canModifyOrder(_orderId: string) {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      // Admin e manager podem modificar qualquer pedido
      if (['admin', 'manager'].includes(req.user.role)) {
        next();
        return;
      }

      // Usuário comum só pode modificar pedidos que criou
      // Aqui você implementaria a verificação se o usuário criou o pedido
      // Por enquanto, vamos permitir acesso
      next();
    };
  }

  // Verificar se email está mascarado na resposta
  maskEmailInResponse(_req: Request, res: Response, next: NextFunction): void {
    const originalSend = res.send;
    const self = this;
    
    res.send = function(data: any) {
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          if (parsed.data && parsed.data.email) {
            parsed.data.email = self.maskEmail(parsed.data.email);
          }
          if (parsed.data && Array.isArray(parsed.data)) {
            parsed.data = parsed.data.map((item: any) => {
              if (item.email) {
                item.email = self.maskEmail(item.email);
              }
              return item;
            });
          }
          data = JSON.stringify(parsed);
        } catch (e) {
          // Se não for JSON válido, mantém como está
        }
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  }

  // Método para mascarar email
  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (!localPart || localPart.length <= 2) {
      return email;
    }
    const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  }

  // Método para verificar token (simulado)
  private verifyToken(token: string): string | null {
    // Aqui você implementaria a verificação real do JWT
    // Por enquanto, vamos simular
    if (token && token.length > 10) {
      return 'user-id-simulado';
    }
    return null;
  }
}
