import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'Database URI is required'),
  JWT_ACCESS_SECRET: z.string().min(8, 'JWT Access Secret must be at least 8 characters'),
  JWT_REFRESH_SECRET: z.string().min(8, 'JWT Refresh Secret must be at least 8 characters').optional(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  CORS_ORIGINS: z.string().optional(),
  REDIS_URL: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
});

// Normalize environment aliases for backward compatibility
const rawEnv = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/global_international_erp',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'super_secret_jwt_school_erp_token_key_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET ? `${process.env.JWT_SECRET}_refresh` : 'super_secret_refresh_token_key_2026'),
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
  CLIENT_URL: process.env.CLIENT_URL || process.env.FRONTEND_URL,
  CORS_ORIGINS: process.env.CORS_ORIGINS,
  REDIS_URL: process.env.REDIS_URL,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
};

// In production, strictly enforce no fallback secrets
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET && !process.env.JWT_ACCESS_SECRET) {
    console.error('FATAL: JWT_ACCESS_SECRET / JWT_SECRET must be configured in production');
    process.exit(1);
  }
  if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
    console.error('FATAL: MONGODB_URI / MONGO_URI must be configured in production');
    process.exit(1);
  }
}

const parsedEnv = envSchema.safeParse(rawEnv);

if (!parsedEnv.success) {
  console.error('FATAL: Invalid environment configuration:', parsedEnv.error.format());
  process.exit(1);
}

export const env = {
  ...parsedEnv.data,
  JWT_REFRESH_SECRET: parsedEnv.data.JWT_REFRESH_SECRET || `${parsedEnv.data.JWT_ACCESS_SECRET}_refresh`,
};

export default env;
