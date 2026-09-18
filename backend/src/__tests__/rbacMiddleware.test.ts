import { Request, Response, NextFunction } from 'express';
import {
  matchesPermission,
  hasPermission,
  requirePermissions,
  requireAnyPermission,
} from '../middleware/rbac';

describe('RBAC Middleware and Utility Tests', () => {
  describe('matchesPermission', () => {
    it('should return true for exact matches', () => {
      expect(matchesPermission('students:read', 'students:read')).toBe(true);
      expect(matchesPermission('attendance:mark', 'attendance:mark')).toBe(true);
    });

    it('should return true for global wildcard * or all', () => {
      expect(matchesPermission('*', 'students:read')).toBe(true);
      expect(matchesPermission('*', 'finance:export')).toBe(true);
      expect(matchesPermission('all', 'attendance:view')).toBe(true);
    });

    it('should return true for resource wildcards (e.g. students:*)', () => {
      expect(matchesPermission('students:*', 'students:read')).toBe(true);
      expect(matchesPermission('students:*', 'students:create')).toBe(true);
      expect(matchesPermission('students:*', 'students:delete')).toBe(true);
      expect(matchesPermission('students:*', 'teachers:read')).toBe(false);
    });

    it('should return false for unmatched permissions', () => {
      expect(matchesPermission('students:read', 'students:write')).toBe(false);
      expect(matchesPermission('finance:view', 'admissions:review')).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('should return true if any granted permission matches', () => {
      const granted = ['students:read', 'attendance:*'];
      expect(hasPermission(granted, 'students:read')).toBe(true);
      expect(hasPermission(granted, 'attendance:mark')).toBe(true);
      expect(hasPermission(granted, 'attendance:view')).toBe(true);
    });

    it('should return false if no granted permission matches', () => {
      const granted = ['students:read'];
      expect(hasPermission(granted, 'students:delete')).toBe(false);
      expect(hasPermission(granted, 'finance:view')).toBe(false);
    });
  });

  describe('requirePermissions middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      next = jest.fn();
    });

    it('should return 401 if req.user is missing', () => {
      const middleware = requirePermissions('students:read');
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authenticated' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should bypass checks for SuperAdmin role', () => {
      req.user = { id: 'sa-1', role: 'SuperAdmin', permissions: [] };
      const middleware = requirePermissions('restricted:super:special');
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow access when user has all required permissions', () => {
      req.user = {
        id: 'u-1',
        role: 'Admin',
        permissions: ['students:read', 'students:create'],
      };
      const middleware = requirePermissions('students:read', 'students:create');
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow access via resource wildcard (e.g. students:*)', () => {
      req.user = {
        id: 'u-2',
        role: 'Teacher',
        permissions: ['students:*', 'attendance:mark'],
      };
      const middleware = requirePermissions('students:read', 'attendance:mark');
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user is missing one or more required permissions', () => {
      req.user = {
        id: 'u-3',
        role: 'Teacher',
        permissions: ['students:read'],
      };
      const middleware = requirePermissions('students:read', 'students:delete');
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Forbidden: Missing required permission(s): students:delete',
        requiredPermissions: ['students:read', 'students:delete'],
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireAnyPermission middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      next = jest.fn();
    });

    it('should return 401 if req.user is missing', () => {
      const middleware = requireAnyPermission('students:read', 'attendance:mark');
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should bypass checks for SuperAdmin role', () => {
      req.user = { id: 'sa-2', role: 'SuperAdmin', permissions: [] };
      const middleware = requireAnyPermission('any:permission');
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow access if user has at least one matching permission', () => {
      req.user = {
        id: 'u-4',
        role: 'Accountant',
        permissions: ['finance:view'],
      };
      const middleware = requireAnyPermission('students:view', 'finance:view');
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 if user has none of the allowed permissions', () => {
      req.user = {
        id: 'u-5',
        role: 'Parent',
        permissions: ['portal:access'],
      };
      const middleware = requireAnyPermission('finance:view', 'admin:manage');
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Forbidden: Requires at least one of the following permissions: finance:view, admin:manage',
        allowedPermissions: ['finance:view', 'admin:manage'],
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
