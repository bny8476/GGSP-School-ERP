import { ApiError } from '../utils/ApiError';

describe('ApiError Utility', () => {
  it('should construct an ApiError with statusCode and message', () => {
    const error = new ApiError(404, 'Resource not found');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Resource not found');
    expect(error.isOperational).toBe(true);
  });

  it('should support non-operational errors', () => {
    const error = new ApiError(500, 'Database error', false);
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(false);
  });
});
