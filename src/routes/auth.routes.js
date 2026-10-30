import { Router } from 'express';
import { authController as c } from '../controllers/auth.controller.js';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), h(c.register));
router.post('/login', authLimiter, validate(loginSchema), h(c.login));
router.get('/me', authenticate, h(c.me));

export default router;
