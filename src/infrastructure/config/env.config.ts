import {
  DATABASE_URI,
  POSTGRES_URL_NON_POOLING,
} from '@core/constant/env.constant';

import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),

  // Database
  DB_SSL_ENABLED: Joi.boolean().default(false),
  POSTGRES_URL_NON_POOLING: Joi.string(),
  DATABASE_URI: Joi.string(),


})
  .or(POSTGRES_URL_NON_POOLING, DATABASE_URI)
  .messages({
    'object.missing':
      '"POSTGRES_URL_NON_POOLING" or "DATABASE_URI" is required',
  });
