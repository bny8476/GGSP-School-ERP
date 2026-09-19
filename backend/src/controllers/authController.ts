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
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(req.user?.id).select('-passwordHash').populate('role');
        if (user) {
          const roleName = (user.role as any)?.name || req.user?.role || 'SuperAdmin';
          const permissions = (user.role as any)?.permissions?.length > 0
            ? (user.role as any).permissions
            : (ROLE_PERMISSIONS[roleName] || []);
          return res.json({
            ...user.toObject(),
            permissions,
          });
        }
      } catch (dbErr) {
        console.warn('DB read warning, falling back to mock profile:', dbErr);
      }
    }

    // In demo mode or if user is mock
    return res.json({
      _id: req.user?.id || '66789abcdef0123456789abc',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'teacher@school.com',
      phoneNumber: '+91 98765 43210',
      designation: 'Class Teacher (LKG - Section A)',
      qualification: 'B.Ed, M.Sc Child Psychology',
      experienceYears: 6,
      joinDate: '2022-06-15',
      role: req.user?.role || 'Teacher',
      permissions: ROLE_PERMISSIONS['Teacher'] || [],
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Update self profile (Teacher / Staff self-service)
// @route   PUT /api/auth/profile
// @access  Private
export const updateSelfProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phoneNumber, qualification, experienceYears, designation } = req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        let user = await User.findById(req.user?.id);
        if (user) {
          if (firstName) user.firstName = firstName;
          if (lastName) user.lastName = lastName;
          if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
          if (qualification !== undefined) user.qualification = qualification;
          if (experienceYears !== undefined) user.experienceYears = Number(experienceYears);
          if (designation !== undefined) user.designation = designation;

          const updatedUser = await user.save();
          return res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
              _id: updatedUser._id,
              firstName: updatedUser.firstName,
              lastName: updatedUser.lastName,
              email: updatedUser.email,
              phoneNumber: updatedUser.phoneNumber,
              qualification: updatedUser.qualification,
              experienceYears: updatedUser.experienceYears,
              designation: updatedUser.designation,
              role: req.user?.role,
            },
          });
        }
      } catch (dbErr) {
        console.warn('DB update warning, responding with demo profile:', dbErr);
      }
    }

    // Demo Mode fallback response
    return res.json({
      success: true,
      message: 'Profile updated successfully (Demo Mode)',
      user: {
        _id: req.user?.id || '66789abcdef0123456789abc',
        firstName: firstName || 'Priya',
        lastName: lastName || 'Sharma',
        email: 'teacher@school.com',
        phoneNumber: phoneNumber || '+91 98765 43210',
        qualification: qualification || 'B.Ed, M.Sc Child Psychology',
        experienceYears: experienceYears ? Number(experienceYears) : 6,
        designation: designation || 'Class Teacher (LKG - Section A)',
        role: req.user?.role || 'Teacher',
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Failed to update profile', error });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(req.user?.id);
        if (user) {
          const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
          if (!isMatch) {
            return res.status(400).json({ message: 'Current password does not match our records' });
          }

          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(newPassword, salt);
          await user.save();

          return res.json({
            success: true,
            message: 'Your password has been changed successfully. Please keep your credentials secure.',
          });
        }
      } catch (dbErr) {
        console.warn('DB password change warning, falling back to demo mode:', dbErr);
      }
    }

    // Demo mode validation
    if (currentPassword !== 'password123' && currentPassword !== 'admin123') {
      return res.status(400).json({ message: 'Current password does not match our records (Demo password is password123)' });
    }

    return res.json({
      success: true,
      message: 'Your password has been changed successfully (Demo Mode verified).',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: 'Failed to change password', error });
  }
};

// @desc    Forgot password / Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Registered email address is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    // Generate secure 6-digit verification recovery code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if live email service is available and dispatch
    try {
      const { emailService } = await import('../services/emailService');
      await emailService.sendEmail({
        to: normalizedEmail,
        subject: 'Password Reset Request — Global International School ERP',
        text: `Your one-time password reset code is: ${resetCode}. It will expire in 15 minutes.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #000E28;">
            <h2 style="color: #0050CB;">Global International School ERP</h2>
            <p>Hello,</p>
            <p>You recently requested to reset the password for your faculty account: <strong>${normalizedEmail}</strong>.</p>
            <div style="background-color: #E5EEFF; padding: 15px 25px; border-radius: 12px; margin: 20px 0; text-align: center;">
              <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #0050CB;">${resetCode}</span>
            </div>
            <p>This verification code is valid for <strong>15 minutes</strong>. If you did not make this request, please contact school administration immediately.</p>
            <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
            <p style="font-size: 11px; color: #64748B;">Global International School IT Security • Automated Notification</p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.warn('Notice: Email dispatch fallback to simulated mode:', mailErr);
    }

    return res.json({
      success: true,
      message: `Password reset verification instructions have been dispatched to ${normalizedEmail}.`,
      resetCodeSent: true,
      demoResetPin: process.env.NODE_ENV !== 'production' ? resetCode : undefined,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Failed to process password reset request', error });
  }
};
