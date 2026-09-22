import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';

// Load env vars FIRST before anything else
dotenv.config();
if (!process.env.JWT_SECRET) {
  console.error('FATAL: Missing JWT_SECRET environment variable');
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error('FATAL: Missing MONGO_URI environment variable');
  process.exit(1);
}

import { createServer } from 'http';
import connectDB from './config/db';
import { initSocket } from './socket';
import { registerDomainModules } from './modules';



// Connect to database
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
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

const normalizeUrl = (url?: string) => url ? url.replace(/\/+$/, '').toLowerCase() : '';
const allowedOrigins = rawAllowedOrigins.map(normalizeUrl);

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true;
  const cleanOrigin = normalizeUrl(origin);
  if (allowedOrigins.includes(cleanOrigin)) return true;
  if (cleanOrigin.endsWith('.vercel.app')) return true;
  if (process.env.NODE_ENV !== 'production' && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
    return true;
  }
  return false;
};

// Middleware - CORS
app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Security middlewares
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Handle OPTIONS preflight for all routes explicitly
app.options(/.*/, cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

// Basic health check route
app.get('/', (req: Request, res: Response) => {
  res.send('Global International School ERP API is running...');
});

// Canonical API Router (supports both /api/v1 and legacy /api)
const apiRouter = express.Router();
registerDomainModules(apiRouter);

// Mount canonical /api/v1 for modular architecture AND /api for backward compatibility
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Create HTTP server instead of listening directly on Express app
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
