import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
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
import admissionRoutes from './routes/admissionRoutes';
import curriculumRoutes from './routes/curriculumRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import financeRoutes from './routes/financeRoutes';
import authRoutes from './routes/authRoutes';
import operationsRoutes from './routes/operationsRoutes';
import userRoutes from './routes/userRoutes';
import studentRoutes from './routes/studentRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import dailyDiaryRoutes from './routes/dailyDiaryRoutes';
import classRoutes from './routes/classRoutes';
import parentRoutes from './routes/parentRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import leaveRoutes from './routes/leaveRoutes';
import academicRoutes from './routes/academicRoutes';
import transportRoutes from './routes/transportRoutes';
import announcementRoutes from './routes/announcementRoutes';
import reportRoutes from './routes/reportRoutes';
import eventsRoutes from './routes/eventsRoutes';
import daycareRoutes from './routes/daycareRoutes';
import galleryRoutes from './routes/galleryRoutes';
import payrollRoutes from './routes/payrollRoutes';
import healthRoutes from './routes/healthRoutes';
import bookRoutes from './routes/bookRoutes';
import hostelRoutes from './routes/hostelRoutes';
import ticketRoutes from './routes/ticketRoutes';

import notificationRoutes from './routes/notificationRoutes';
import auditRoutes from './routes/auditRoutes';
import documentRoutes from './routes/documentRoutes';
import examRoutes from './routes/examRoutes';
import learningRoutes from './routes/learningRoutes';
import broadcastRoutes from './routes/broadcastRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import visitorRoutes from './routes/visitorRoutes';
import recruitmentRoutes from './routes/recruitmentRoutes';
import appsRoutes from './routes/appsRoutes';
import settingsRoutes from './routes/settingsRoutes';
import aiRoutes from './routes/aiRoutes';
import nextGenRoutes from './routes/nextGenRoutes';
import campusRoutes from './routes/campusRoutes';
import enterpriseRoutes from './routes/enterpriseRoutes';


// Connect to database
connectDB();

const app = express();

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://schoolerp-livid.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
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

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Global International School ERP API is running...');
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/operations', operationsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/daily-diary', dailyDiaryRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/daycare', daycareRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/hostel', hostelRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/broadcasts', broadcastRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/apps', appsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/nextgen', nextGenRoutes);
app.use('/api/campuses', campusRoutes);
app.use('/api/enterprise', enterpriseRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Create HTTP server instead of listening directly on Express app
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
