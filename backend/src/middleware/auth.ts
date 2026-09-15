import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  user: {
    id: string;
    role: string;
    campusId?: string;
  };
}

// Extend Express Request object to include user, campusId, and requestId
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload['user'];
      campusId?: string;
      requestId?: string;
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is missing from environment');
      }
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // Get user from the token payload and attach to request
      req.user = decoded.user;

      next();
      return;
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: `User role ${req.user?.role} is not authorized to access this route`,
      });
      return;
    }
    next();
  };
};

/**
 * Data-level Scope Authorization Middleware
 * Verifies that caller is either in allowed privileged roles OR matches the target userId parameter.
 */
export const authorizeDataOwnerOrRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const isPrivileged = allowedRoles.includes(req.user.role);
    const isOwner = req.params.id === req.user.id || req.params.userId === req.user.id;

    if (!isPrivileged && !isOwner) {
      res.status(403).json({
        message: 'Access denied: You do not have permission to view or modify this resource.',
      });
      return;
    }

    next();
  };
};


export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || !['SuperAdmin', 'Admin', 'admin', 'superadmin'].includes(req.user.role)) {
    res.status(403).json({ message: 'Access denied. Administrative privileges required.' });
    return;
  }
  next();
};

export const checkPermission = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // SuperAdmin / Admin has full permission bypass
    if (['SuperAdmin', 'Admin', 'admin', 'superadmin'].includes(req.user.role)) {
      next();
      return;
    }

    // For other roles, grant access if request user exists
    next();
  };
};

export const authenticate = protect;
export const authorizeRoles = authorize;

export const authorizeCampusScope = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  // SuperAdmin has global campus access
  const isSuperAdmin = ['SuperAdmin', 'Admin', 'admin', 'superadmin'].includes(req.user.role);
  if (isSuperAdmin) {
    req.campusId = (req.headers['x-campus-id'] as string) || req.user.campusId;
    next();
    return;
  }

  // Scope user to their assigned campus
  req.campusId = req.user.campusId;
  next();
};



