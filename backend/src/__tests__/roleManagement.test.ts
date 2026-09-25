import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import roleRoutes from '../routes/roleRoutes';
import User from '../models/User';
import Role from '../models/Role';
import { generateAccessToken } from '../services/tokenService';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/roles', roleRoutes);

describe('Admin-Facing Role & Permission Management', () => {
  let superAdminToken: string;
  let teacherToken: string;
  let superAdminId: mongoose.Types.ObjectId;
  let originalReadyState: number;

  beforeAll(() => {
    originalReadyState = mongoose.connection.readyState;
    Object.defineProperty(mongoose.connection, 'readyState', { value: 1, configurable: true });

    superAdminId = new mongoose.Types.ObjectId();

    jest.spyOn(User, 'findById').mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: superAdminId,
        role: 'SuperAdmin',
        isActive: true,
        isDeleted: false,
        status: 'Active',
      }),
    } as any);

    superAdminToken = generateAccessToken({
      id: superAdminId.toString(),
      role: 'SuperAdmin',
    });

    teacherToken = generateAccessToken({
      id: new mongoose.Types.ObjectId().toString(),
      role: 'Teacher',
    });
  });

  afterAll(() => {
    Object.defineProperty(mongoose.connection, 'readyState', { value: originalReadyState, configurable: true });
    jest.restoreAllMocks();
  });

  it('GET /api/roles rejects unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/roles');
    expect(res.status).toBe(401);
  });

  it('GET /api/roles rejects non-admin users with 403', async () => {
    const res = await request(app)
      .get('/api/roles')
      .set('Authorization', `Bearer ${teacherToken}`);
    expect(res.status).toBe(403);
  });

  it('GET /api/roles returns roles and canonical ALL_PERMISSIONS for SuperAdmin', async () => {
    const mockRoles = [
      { name: 'Admin', permissions: ['students:*'] },
      { name: 'Teacher', permissions: ['students:read'] },
    ];

    jest.spyOn(Role, 'find').mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockRoles),
    } as any);

    const res = await request(app)
      .get('/api/roles')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.roles).toHaveLength(2);
    expect(res.body.allPermissions).toContain('students:*');
    expect(res.body.allPermissions).toContain('*');
  });

  it('PUT /api/roles/:id/permissions rejects invalid/typo permission string with 400', async () => {
    const res = await request(app)
      .put('/api/roles/Teacher/permissions')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        permissions: ['students:read', 'invalid_bogus_permission:hack'],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid permissions provided/i);
  });

  it('PUT /api/roles/:id/permissions updates permissions with valid canonical strings', async () => {
    const mockRole = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Teacher',
      permissions: ['students:read'],
      save: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(Role, 'findOne').mockResolvedValue(mockRole as any);

    const res = await request(app)
      .put('/api/roles/Teacher/permissions')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        permissions: ['students:read', 'attendance:mark', 'homework:create'],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockRole.permissions).toEqual(['students:read', 'attendance:mark', 'homework:create']);
    expect(mockRole.save).toHaveBeenCalled();
  });
});
