import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

// Batasi percobaan login/register per IP untuk meredam brute force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.authRateLimitMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, _res, next) => next(new AppError(429, 'Terlalu banyak percobaan, coba lagi nanti')),
});
