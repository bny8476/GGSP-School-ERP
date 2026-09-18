import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { registerDomainModules } from '../modules';

const app = express();
app.use(express.json());
app.use(cookieParser());

const apiRouter = express.Router();
registerDomainModules(apiRouter);

app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);

describe('Phase 3 Domain Modules Architecture', () => {
  it('should route /api/v1/health through the core domain module', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
  });

  it('should route /api/health (legacy alias) identically', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });

  it('should route /api/v1/auth/logout through the auth domain module', async () => {
    const res = await request(app).post('/api/v1/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: 'Logged out successfully' });
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should protect domain endpoints with auth middleware (/api/v1/students and /api/v1/attendance)', async () => {
    const studentRes = await request(app).get('/api/v1/students');
    expect(studentRes.status).toBe(401);

    const attendRes = await request(app).get('/api/v1/attendance');
    expect(attendRes.status).toBe(401);
  });
});
