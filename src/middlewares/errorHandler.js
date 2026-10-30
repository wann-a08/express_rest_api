import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export const notFound = (req, _res, next) => {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} tidak ditemukan`));
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  // JSON body rusak
  if (err.type === 'entity.parse.failed') {
    err = new AppError(400, 'Body JSON tidak valid');
  }
  // Duplicate entry MySQL (mis. email sudah dipakai)
  if (err.code === 'ER_DUP_ENTRY') {
    err = new AppError(409, 'Data sudah ada (duplikat)');
  }

  const status = err.statusCode || 500;
  if (status >= 500) console.error(err);

  res.status(status).json({
    success: false,
    message: status >= 500 && env.nodeEnv === 'production' ? 'Internal server error' : err.message,
    ...(err.details && { errors: err.details }),
  });
};
