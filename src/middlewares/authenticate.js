import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

// Pakai di route yang butuh login: router.get('/x', authenticate, handler)
export const authenticate = (req, _res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'Token tidak ditemukan, gunakan header Authorization: Bearer <token>'));
  }
  try {
    // algorithms dikunci ke HS256 supaya token "alg: none" atau algoritma lain ditolak
    const payload = jwt.verify(token, env.jwt.secret, { algorithms: ['HS256'] });
    req.user = { id: Number(payload.sub), username: payload.username };
    next();
  } catch (err) {
    next(new AppError(401, err.name === 'TokenExpiredError' ? 'Token sudah kedaluwarsa' : 'Token tidak valid'));
  }
};
