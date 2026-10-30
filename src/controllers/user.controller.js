import { userService } from '../services/user.service.js';

export const userController = {
  async list(req, res) {
    const { data, meta } = await userService.list(req.validated.query);
    res.json({ success: true, data, meta });
  },

  async get(req, res) {
    const user = await userService.getById(req.validated.params.id);
    res.json({ success: true, data: user });
  },

  async create(req, res) {
    const user = await userService.create(req.validated.body);
    res.status(201).json({ success: true, message: 'User berhasil dibuat', data: user });
  },

  async update(req, res) {
    const user = await userService.update(req.validated.params.id, req.validated.body);
    res.json({ success: true, message: 'User berhasil diperbarui', data: user });
  },

  async remove(req, res) {
    await userService.remove(req.validated.params.id);
    res.status(204).send();
  },
};
