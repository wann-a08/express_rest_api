import { authService } from '../services/auth.service.js';

export const authController = {
  async register(req, res) {
    const user = await authService.register(req.validated.body);
    res.status(201).json({ success: true, message: 'Registrasi berhasil', data: user });
  },

  async login(req, res) {
    const data = await authService.login(req.validated.body);
    res.json({ success: true, message: 'Login berhasil', data });
  },

  async me(req, res) {
    const user = await authService.me(req.user.id);
    res.json({ success: true, data: user });
  },
};
