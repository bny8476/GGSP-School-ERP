import { Request, Response, NextFunction } from 'express';
import AuditLog from '../models/AuditLog';

export const logAuditEvent = (moduleName: string, actionName: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const originalSend = res.json;
      res.json = function (body: any): Response {
        // Only log if the request succeeded (2xx)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const userId = req.user?.id;
          const userRole = req.user?.role;
          const targetId = req.params?.id || body?._id || body?.id;
          const ipAddress = req.ip || req.socket.remoteAddress;

          AuditLog.create({
            userId,
            userName: req.user?.id ? `User:${req.user.id}` : 'Anonymous',
            userRole: userRole || 'Unknown',
            action: actionName,
            module: moduleName,
            targetId: targetId ? String(targetId) : undefined,
            ipAddress: String(ipAddress),
            details: `Method ${req.method} on ${req.originalUrl}`,
          }).catch((err) => console.error('Audit log write error:', err));
        }
        return originalSend.call(this, body);
      };
      next();
    } catch (err) {
      next(err);
    }
  };
};
