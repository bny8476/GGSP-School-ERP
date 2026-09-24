import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { createServer } from 'http';
import swaggerUi from 'swagger-ui-express';

import env from './config/env';
import connectDB from './config/db';
import logger from './utils/logger';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { initSocket } from './socket';
import { registerDomainModules } from './modules';
import { swaggerDocument } from './config/swagger';

// Connect to MongoDB
connectDB();

const app = express();

// Allowed origins
const rawAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://ggsp-school-erp.vercel.app',
  'https://schoolerp-livid.vercel.app',
  'https://school-erp-bny2.vercel.app',
  env.CLIENT_URL,
].filter(Boolean) as string[];

const normalizeUrl = (url?: string) => (url ? url.replace(/\/+$/, '').toLowerCase() : '');
const allowedOrigins = rawAllowedOrigins.map(normalizeUrl);

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true;
  const cleanOrigin = normalizeUrl(origin);
  if (allowedOrigins.includes(cleanOrigin)) return true;
  if (cleanOrigin.endsWith('.vercel.app')) return true;
  if (
    env.NODE_ENV !== 'production' &&
    (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))
  ) {
    return true;
  }
  return false;
};

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Swagger UI and cross-origin assets in dev/staging
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// OPTIONS preflight
app.options(
  /.*/,
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  })
);

// Body and cookie parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request tracking & correlation logging
app.use(requestLogger);

// API Documentation via Swagger / OpenAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root Health Check routes
app.get('/health', (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: dbStatus,
  });
});

app.get('/health/db', (req: Request, res: Response) => {
  const isConnected = mongoose.connection.readyState === 1;
  if (isConnected) {
    res.status(200).json({
      status: 'up',
      database: 'MongoDB',
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    });
  } else {
    res.status(503).json({
      status: 'down',
      database: 'MongoDB',
      readyState: mongoose.connection.readyState,
    });
  }
});

// Root welcome message
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'GGPS School ERP Production API is operational',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
  });
});

// Canonical API Router (supports both /api/v1 and legacy /api)
const apiRouter = express.Router();
registerDomainModules(apiRouter);

// Mount canonical /api/v1 for modular architecture AND /api for backward compatibility
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);

// Centralized error handling
app.use(errorHandler);

const PORT = env.PORT || 5001;

// Create HTTP server for Express and Socket.IO
const httpServer = createServer(app);

// Initialize Socket.io with authenticated connections
initSocket(httpServer);

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    logger.info(`GGPS ERP Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    logger.info(`Swagger API documentation available at http://localhost:${PORT}/api-docs`);
  });
}

export { app, httpServer };
export default app;
