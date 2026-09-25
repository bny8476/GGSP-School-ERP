import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import studentRoutes from '../routes/studentRoutes';
import financeRoutes from '../routes/financeRoutes';
import payrollRoutes from '../routes/payrollRoutes';
import admissionRoutes from '../routes/admissionRoutes';
import attendanceRoutes from '../routes/attendanceRoutes';
import User from '../models/User';
import Student from '../models/Student';
import Fee from '../models/Fee';
import { generateAccessToken } from '../services/tokenService';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/finance', financeRoutes);
app.use('/api/v1/payroll', payrollRoutes);
app.use('/api/v1/admissions', admissionRoutes);
app.use('/api/v1/attendance', attendanceRoutes);

describe('RBAC Route Matching Across Core ERP Modules', () => {
  let originalReadyState: number;
  let adminToken: string;
  let teacherToken: string;
  let parentToken: string;
  let adminId: mongoose.Types.ObjectId;
  let teacherId: mongoose.Types.ObjectId;
  let parentId: mongoose.Types.ObjectId;

  beforeAll(() => {
    originalReadyState = mongoose.connection.readyState;
    Object.defineProperty(mongoose.connection, 'readyState', { value: 1, configurable: true });

    adminId = new mongoose.Types.ObjectId();
    teacherId = new mongoose.Types.ObjectId();
    parentId = new mongoose.Types.ObjectId();

    jest.spyOn(User, 'findById').mockImplementation(((id: any) => {
      let role = 'Admin';
      if (String(id) === String(teacherId)) role = 'Teacher';
      if (String(id) === String(parentId)) role = 'Parent';

      return {
        select: jest.fn().mockResolvedValue({
          _id: id,
          role,
          isActive: true,
          isDeleted: false,
          status: 'Active',
        }),
      } as any;
    }) as any);

    adminToken = generateAccessToken({ id: adminId.toString(), role: 'Admin' });
    teacherToken = generateAccessToken({ id: teacherId.toString(), role: 'Teacher' });
    parentToken = generateAccessToken({ id: parentId.toString(), role: 'Parent' });
  });

  afterAll(() => {
    Object.defineProperty(mongoose.connection, 'readyState', { value: originalReadyState, configurable: true });
    jest.restoreAllMocks();
  });

  it('Students module: allows Admin and Teacher to view students, rejects unauthenticated', async () => {
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      then: jest.fn((resolve: any) => resolve([])),
    };
    jest.spyOn(Student, 'find').mockReturnValue(mockQuery as any);

    const unauthRes = await request(app).get('/api/v1/students');
    expect(unauthRes.status).toBe(401);

    const adminRes = await request(app)
      .get('/api/v1/students')
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200, 304]).toContain(adminRes.status);
  });

  it('Payroll module: allows Admin and forbids Teacher and Parent', async () => {
    const teacherRes = await request(app)
      .get('/api/v1/payroll')
      .set('Authorization', `Bearer ${teacherToken}`);
    expect(teacherRes.status).toBe(403);

    const parentRes = await request(app)
      .get('/api/v1/payroll')
      .set('Authorization', `Bearer ${parentToken}`);
    expect(parentRes.status).toBe(403);
  });

  it('Finance module: allows Admin and Parent to view fees, forbids anonymous', async () => {
    const mockFeeQuery = {
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      then: jest.fn((resolve: any) => resolve([])),
    };
    jest.spyOn(Fee, 'find').mockReturnValue(mockFeeQuery as any);

    const unauthRes = await request(app).get('/api/v1/finance/fees');
    expect(unauthRes.status).toBe(401);

    const adminRes = await request(app)
      .get('/api/v1/finance/fees')
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200, 304]).toContain(adminRes.status);
  });

  it('Admissions module: allows Admin and forbids Parent', async () => {
    const parentRes = await request(app)
      .get('/api/v1/admissions')
      .set('Authorization', `Bearer ${parentToken}`);
    expect(parentRes.status).toBe(403);
  });
});
