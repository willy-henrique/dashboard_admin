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

  async authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticacao nao fornecido'
        });
        return;
      }

      const userId = this.verifyToken(token);

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Token invalido ou verificacao nao configurada'
        });
        return;
      }

      const user = await this.userService.getUserById(userId);

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Usuario nao encontrado ou inativo'
        });
        return;
      }

      req.user = user.getPublicData();
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro na autenticacao'
      });
    }
  }

  requireRole(roles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario nao autenticado'
        });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: 'Acesso negado. Permissao insuficiente.'
        });
        return;
      }

      next();
    };
  }

  requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.requireRole(['admin'])(req, res, next);
  }

  requireAdminOrManager(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    this.requireRole(['admin', 'manager'])(req, res, next);
  }

  canAccessUser(targetUserId: string) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario nao autenticado'
        });
        return;
      }

      if (req.user.role === 'admin') {
        next();
        return;
      }

      if (req.user.id === targetUserId) {
        next();
        return;
      }

      res.status(403).json({
        success: false,
        message: 'Acesso negado. Voce so pode acessar seus proprios dados.'
      });
    };
  }

  canModifyOrder(_orderId: string) {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuario nao autenticado'
        });
        return;
      }

      if (['admin', 'manager'].includes(req.user.role)) {
        next();
        return;
      }

      res.status(403).json({
        success: false,
        message: 'Regra de autorizacao de pedidos nao implementada para usuarios comuns'
      });
    };
  }

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
        } catch (_error) {
          // Mantem a resposta original quando nao for JSON.
        }
      }

      return originalSend.call(this, data);
    };

    next();
  }

  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (!localPart || localPart.length <= 2) {
      return email;
    }
    const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  }

  // Sem validacao real configurada, a autenticacao deve falhar fechada.
  private verifyToken(_token: string): string | null {
    return null;
  }
}
