import { Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { z } from 'zod';

describe('Validation Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  const testSchema = z.object({
    body: z.object({
      email: z.string().email(),
      age: z.number().min(18),
    }),
  });

  beforeEach(() => {
    req = { body: {}, query: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should call next() when request payload matches schema', () => {
    req.body = { email: 'test@example.com', age: 25 };
    const middleware = validate(testSchema);

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 validation error when payload is invalid', () => {
    req.body = { email: 'not-an-email', age: 12 };
    const middleware = validate(testSchema);

    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Validation Error'),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
