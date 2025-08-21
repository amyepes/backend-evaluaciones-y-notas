import * as z from 'zod';

export const envValidationSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),

  NODE_ENV: z.enum(['development', 'production'])
    .default('development'),

  DATABASE_URL: z.string()
    .min(1, 'DATABASE_URL is required'),

  DIRECT_URL: z.string()
    .min(1, 'DIRECT_URL is required'),

  SECRET_KEY: z.string()
    .min(32, 'SECRET_KEY must be at least 32 characters')
    .default('SECRET_KEY'),
}).strict();