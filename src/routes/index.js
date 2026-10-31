import { Router } from 'express';
import authRoutes from './auth.routes.js';
import siswaRoutes from './siswa.routes.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ success: true, status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/siswa', siswaRoutes);

export default router;
