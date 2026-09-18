import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import authRoutes from '../routes/authRoutes';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRoutes);
app.use('/api/auth', authRoutes);

describe('Auth Routes & Logout (Phase 1)', () => {
  it('should successfully log out and clear token cookie on /api/v1/auth/logout', async () => {
    const res = await request(app).post('/api/v1/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: 'Logged out successfully' });
    expect(res.headers['set-cookie']).toBeDefined();
    // Cookie should be cleared (max-age=0 / expires in past / empty value)
    expect(res.headers['set-cookie'][0]).toMatch(/token=;/);
  });

  it('should also work on legacy backward-compatible /api/auth/logout', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: 'Logged out successfully' });
    expect(res.headers['set-cookie']).toBeDefined();
  });
});
