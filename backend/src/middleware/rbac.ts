import { Request, Response, NextFunction } from 'express';

// Check if a single granted permission pattern satisfies the required permission (supports both colon and dot notation)
export const matchesPermission = (granted: string, required: string): boolean => {
  if (granted === '*' || granted === 'all') return true;
  const normGranted = granted.replace(/\./g, ':').toLowerCase();
  const normRequired = required.replace(/\./g, ':').toLowerCase();

  if (normGranted === normRequired) return true;

  // Check resource wildcard (e.g. 'students:*' matches 'students:read' and 'students:create')
  if (normGranted.endsWith(':*')) {
    const grantedResource = normGranted.slice(0, -2);
    const [requiredResource] = normRequired.split(':');
    return grantedResource === requiredResource;
  }

  return false;
};

// Check if an array of granted permissions satisfies a required permission
export const hasPermission = (grantedList: string[], required: string): boolean => {
  return grantedList.some((granted) => matchesPermission(granted, required));
};

/**
 * Middleware: Requires the authenticated caller to possess ALL specified permissions.
 * SuperAdmin and '*' automatically satisfy this requirement.
 */
export const requirePermissions = (...requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Role SuperAdmin always bypasses permission restrictions (case-insensitive)
    if (String(req.user.role || '').toLowerCase() === 'superadmin') {
      next();
      return;
    }

    const userPermissions: string[] = req.user.permissions || [];

    const missingPermissions = requiredPermissions.filter(
      (required) => !hasPermission(userPermissions, required)
    );

    if (missingPermissions.length > 0) {
      res.status(403).json({
        message: `Forbidden: Missing required permission(s): ${missingPermissions.join(', ')}`,
        requiredPermissions,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware: Requires the authenticated caller to possess AT LEAST ONE of the specified permissions.
 */
export const requireAnyPermission = (...allowedPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    if (String(req.user.role || '').toLowerCase() === 'superadmin') {
      next();
      return;
    }

    const userPermissions: string[] = req.user.permissions || [];

    const hasAny = allowedPermissions.some((perm) => hasPermission(userPermissions, perm));

    if (!hasAny) {
      res.status(403).json({
        message: `Forbidden: Requires at least one of the following permissions: ${allowedPermissions.join(', ')}`,
        allowedPermissions,
      });
      return;
    }

    next();
  };
};
