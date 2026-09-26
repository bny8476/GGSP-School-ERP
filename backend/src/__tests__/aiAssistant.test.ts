import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import aiRoutes from '../routes/aiRoutes';
import User from '../models/User';
import Student from '../models/Student';
import Fee from '../models/Fee';
import StudentAttendance from '../models/StudentAttendance';
import LeaveRequest from '../models/LeaveRequest';
import AIQueryLog from '../models/AIAssistant';
import { generateAccessToken } from '../services/tokenService';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/ai', aiRoutes);

describe('AI Assistant Controller & Real Aggregation Endpoints', () => {
  let adminToken: string;
  let originalReadyState: number;

  beforeAll(() => {
    originalReadyState = mongoose.connection.readyState;
    Object.defineProperty(mongoose.connection, 'readyState', { value: 1, configurable: true });

    jest.spyOn(User, 'findById').mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        isActive: true,
        isDeleted: false,
        status: 'Active',
      }),
    } as any);

    adminToken = generateAccessToken({
      id: new mongoose.Types.ObjectId().toString(),
      role: 'Admin',
    });
  });

  afterAll(() => {
    Object.defineProperty(mongoose.connection, 'readyState', { value: originalReadyState, configurable: true });
  });

  it('rejects unauthenticated requests to /api/ai/assistant with 401', async () => {
    const res = await request(app)
      .post('/api/ai/assistant')
      .send({ query: 'How many students are absent?' });

    expect(res.status).toBe(401);
  });

  it('rejects empty query with 400', async () => {
    const res = await request(app)
      .post('/api/ai/assistant')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('processes fee collection query using real ERP ledger aggregation for Admin', async () => {
    jest.spyOn(Fee, 'aggregate').mockResolvedValue([{ _id: null, totalCollected: 150000, totalBilled: 200000 }] as any);
    jest.spyOn(Fee, 'find').mockResolvedValue([{ totalAmount: 50000, amountPaid: 20000, status: 'Partial' }] as any);
    jest.spyOn(AIQueryLog, 'create').mockResolvedValue({} as any);

    const res = await request(app)
      .post('/api/ai/assistant')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ query: 'What are the total fees collected?' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.category).toBe('Finance');
    expect(res.body.data.isComputedFromERP).toBe(true);
    expect(res.body.data.response).toContain('Verified Ledger Summary');
    expect(res.body.data.response).toContain('150,000');
  });

  it('processes attendance query using real attendance metrics', async () => {
    jest.spyOn(Student, 'countDocuments').mockResolvedValue(450 as any);
    jest.spyOn(StudentAttendance, 'countDocuments').mockResolvedValue(12 as any);
    jest.spyOn(AIQueryLog, 'create').mockResolvedValue({} as any);

    const res = await request(app)
      .post('/api/ai/assistant')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ query: 'How is attendance today?' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.category).toBe('Attendance');
    expect(res.body.data.response).toContain('12 absent mark(s)');
    expect(res.body.data.response).toContain('450 active students');
  });

  it('returns dynamically computed insights from getAIInsights', async () => {
    jest.spyOn(StudentAttendance, 'countDocuments')
      .mockResolvedValueOnce(18) // absences
      .mockResolvedValueOnce(200); // total sessions
    jest.spyOn(Fee, 'find').mockResolvedValue([{ totalAmount: 40000, amountPaid: 10000, status: 'Pending' }] as any);
    jest.spyOn(LeaveRequest, 'countDocuments').mockResolvedValue(3 as any);

    const res = await request(app)
      .get('/api/ai/insights')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.data[0].dataSource).toBe('StudentAttendance Engine');
  });

  it('returns computed early-warning scores for students', async () => {
    const mockStudent = {
      _id: new mongoose.Types.ObjectId(),
      firstName: 'Alice',
      lastName: 'Wonderland',
      grade: 'UKG',
      admissionNumber: 'ADM-UKG-901',
    };
    jest.spyOn(Student, 'find').mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([mockStudent]),
      }),
    } as any);
    jest.spyOn(StudentAttendance, 'countDocuments')
      .mockResolvedValueOnce(20) // total
      .mockResolvedValueOnce(14) // present (70% attendance -> Critical)
      .mockResolvedValueOnce(6); // absent
    jest.spyOn(Fee, 'countDocuments').mockResolvedValue(1 as any);

    const res = await request(app)
      .get('/api/ai/early-warning')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].studentName).toBe('Alice Wonderland');
    expect(res.body.data[0].riskLevel).toBe('Critical');
  });
});
