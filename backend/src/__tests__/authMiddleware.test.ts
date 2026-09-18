import { Request, Response, NextFunction } from 'express';
import { protect, authorize } from '../middleware/auth';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'test_secret_key';
  });

  describe('protect middleware', () => {
    it('should return 401 if no Authorization header is present', () => {
      protect(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should verify valid Bearer token and call next()', () => {
      const payload = { user: { id: 'user123', role: 'Admin' } };
      const token = jwt.sign(payload, 'test_secret_key');
      req.headers = { authorization: `Bearer ${token}` };

      protect(req as Request, res as Response, next);

      expect(req.user).toEqual({ id: 'user123', role: 'Admin' });
      expect(next).toHaveBeenCalled();
    });

    it('should verify valid HttpOnly cookie and call next()', () => {
      const payload = { user: { id: 'user456', role: 'Parent' } };
      const token = jwt.sign(payload, 'test_secret_key');
      // @ts-ignore
      req.cookies = { token };

      protect(req as Request, res as Response, next);

      expect(req.user).toEqual({ id: 'user456', role: 'Parent' });
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 for an invalid token', () => {
      req.headers = { authorization: 'Bearer invalid_token_xyz' };

      protect(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorize middleware', () => {
    it('should call next() if user role is authorized', () => {
      req.user = { id: '123', role: 'Admin' };
      const middleware = authorize('Admin', 'SuperAdmin');

      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user role is not authorized', () => {
      req.user = { id: '123', role: 'Parent' };
      const middleware = authorize('Admin', 'Teacher');

      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
