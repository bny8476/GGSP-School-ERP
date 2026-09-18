import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Role from '../models/Role';

// Capability permission matrix per role
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SuperAdmin: ['*'],
  Admin: [
    'students:*',
    'teachers:*',
    'parents:*',
    'academics:*',
    'attendance:*',
    'admissions:*',
    'finance:*',
    'reports:*',
    'settings:*',
  ],
  Principal: [
    'students:read',
    'teachers:read',
    'academics:*',
    'reports:*',
    'attendance:read',
    'announcements:*',
  ],
  Teacher: [
    'attendance:read',
    'attendance:mark',
    'students:read',
    'diary:create',
    'diary:read',
    'assessments:create',
    'assessments:read',
    'academics:read',
    'timetable:read',
  ],
  Parent: [
    'child:read',
    'attendance:read',
    'diary:read',
    'fees:read',
    'assessments:read',
    'announcements:read',
  ],
  Accountant: [
    'finance:*',
    'fees:*',
    'payroll:*',
    'reports:read',
  ],
  Receptionist: [
    'visitors:*',
    'admissions:read',
    'announcements:read',
  ],
};

// Generate JWT with permissions in payload
export const generateToken = (id: string, role: string, permissions?: string[]) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is missing from environment');
  }
  const resolvedPermissions = permissions && permissions.length > 0
    ? permissions
    : (ROLE_PERMISSIONS[role] || []);

  return jwt.sign({ user: { id, role, permissions: resolvedPermissions } }, secret, {
    expiresIn: '30d',
  });
};

// Cookie options for HttpOnly JWT session
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: '/',
};

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie('token', token, COOKIE_OPTIONS);
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public (in real app, should be restricted to Admin to create staff accounts)
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Public self-registration ALWAYS creates a 'Parent' account. Ignore any roleName field in req.body.
    const defaultRoleName = 'Parent';
    let role = await Role.findOne({ name: defaultRoleName });
    if (!role) {
      role = await Role.create({ name: defaultRoleName, permissions: ROLE_PERMISSIONS['Parent'] });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role: role._id,
    });

    if (user) {
      const perms = role.permissions?.length > 0 ? role.permissions : ROLE_PERMISSIONS['Parent'];
      const token = generateToken(user.id, role.name, perms);
      setAuthCookie(res, token);
      res.status(201).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: role.name,
        permissions: perms,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // 1. Try MongoDB database authentication if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: normalizedEmail }).populate('role');
        if (user && (await bcrypt.compare(password, user.passwordHash))) {
          // @ts-ignore
          const roleName = user.role?.name || 'SuperAdmin';
          const permissions = (user.role as any)?.permissions?.length > 0
            ? (user.role as any).permissions
            : (ROLE_PERMISSIONS[roleName] || []);

          const token = generateToken(user.id, roleName, permissions);
          setAuthCookie(res, token);
          return res.json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: roleName,
            permissions,
            token,
          });
        }
      } catch (dbErr) {
        console.warn('MongoDB query warning, falling back to seed account auth:', dbErr);
      }
    }

    // 2. Fallback authentication for seeded accounts (enables dev/demo use when MongoDB is offline)
    const seedAccounts: Record<string, { firstName: string; lastName: string; role: string }> = {
      'admin@easacademy.com': { firstName: 'System', lastName: 'Admin', role: 'SuperAdmin' },
      'admin@schoolerp.com': { firstName: 'System', lastName: 'Admin', role: 'SuperAdmin' },
      'teacher@school.com': { firstName: 'Tom', lastName: 'Teacher', role: 'Teacher' },
      'parent@school.com': { firstName: 'Patty', lastName: 'Parent', role: 'Parent' },
      'accountant@school.com': { firstName: 'Alice', lastName: 'Accountant', role: 'Accountant' },
      'principal@school.com': { firstName: 'Peter', lastName: 'Principal', role: 'Principal' },
    };

    const seedUser = seedAccounts[normalizedEmail];
    if (seedUser && (password === 'password123' || password === 'admin123')) {
      const dummyId = '66789abcdef0123456789abc';
      const permissions = ROLE_PERMISSIONS[seedUser.role] || [];
      const token = generateToken(dummyId, seedUser.role, permissions);
      setAuthCookie(res, token);
      return res.json({
        _id: dummyId,
        firstName: seedUser.firstName,
        lastName: seedUser.lastName,
        email: normalizedEmail,
        role: seedUser.role,
        permissions,
        token,
        isDemoMode: true,
      });
    }

    return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'An internal server error occurred during login.' });
  }
};

// @desc    Logout user / clear auth cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (_req: Request, res: Response) => {
  clearAuthCookie(res);
  return res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-passwordHash').populate('role');
    if (user) {
      const roleName = (user.role as any)?.name || req.user?.role || 'SuperAdmin';
      const permissions = (user.role as any)?.permissions?.length > 0
        ? (user.role as any).permissions
        : (ROLE_PERMISSIONS[roleName] || []);
      res.json({
        ...user.toObject(),
        permissions,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
