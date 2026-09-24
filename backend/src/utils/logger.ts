import pino from 'pino';
import env from '../config/env';

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'body.password',
      'body.currentPassword',
      'body.newPassword',
      'body.passwordHash',
      'body.token',
      'body.refreshToken',
      'password',
      'token',
      'refreshToken',
      'secret',
    ],
    censor: '[REDACTED]',
  },
  base: {
    env: env.NODE_ENV,
    service: 'GGPS-School-ERP-Backend',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
