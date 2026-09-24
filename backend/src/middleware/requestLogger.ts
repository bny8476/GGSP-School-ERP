import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  // Skip noisy logs for health check
  if (req.path === '/health' || req.path === '/health/db') {
    return next();
  }

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip || req.socket.remoteAddress,
      userId: req.user?.id,
      userRole: req.user?.role,
    };

    if (res.statusCode >= 500) {
      logger.error(logData, 'Request server error');
    } else if (res.statusCode >= 400) {
      logger.warn(logData, 'Request client error');
    } else {
      logger.info(logData, 'Request completed');
    }
  });

  next();
};

export default requestLogger;
