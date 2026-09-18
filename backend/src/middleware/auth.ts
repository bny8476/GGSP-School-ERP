import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  user: {
    id: string;
    role: string;
    permissions?: string[];
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
  let token: string | undefined;

  // 1. Check HttpOnly cookie first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback to Authorization: Bearer <token> header for legacy/API clients
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is missing from environment');
    }
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Attach user from payload to request
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error('JWT Verification error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
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



