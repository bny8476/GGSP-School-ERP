import { Request, Response } from 'express';
import { registerUser } from '../controllers/authController';
import User from '../models/User';
import Role from '../models/Role';

jest.mock('../models/User');
jest.mock('../models/Role');
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('registerUser Security Test (Phase 1.1)', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret_key';
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
  });

  it('should ignore roleName: "SuperAdmin" in body and create a Parent account', async () => {
    req = {
      body: {
        firstName: 'Hacker',
        lastName: 'User',
        email: 'hacker@example.com',
        password: 'password123',
        roleName: 'SuperAdmin', // Attempted privilege escalation
      },
    };

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (Role.findOne as jest.Mock).mockImplementation(({ name }: { name: string }) => {
      if (name === 'Parent') {
        return Promise.resolve({ _id: 'parent_role_id', name: 'Parent' });
      }
      return Promise.resolve(null);
    });
    (User.create as jest.Mock).mockResolvedValue({
      id: 'user_123',
      firstName: 'Hacker',
      lastName: 'User',
      email: 'hacker@example.com',
      role: 'parent_role_id',
    });

    await registerUser(req as Request, res as Response);

    // Verify Role lookup searched for Parent and NOT SuperAdmin
    expect(Role.findOne).toHaveBeenCalledWith({ name: 'Parent' });
    expect(Role.findOne).not.toHaveBeenCalledWith({ name: 'SuperAdmin' });

    // Verify response contains role: 'Parent' and cookie was set
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.cookie).toHaveBeenCalledWith('token', expect.any(String), expect.any(Object));
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        role: 'Parent',
      })
    );
  });
});
