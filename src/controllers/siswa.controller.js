import { siswaService } from '../services/siswa.service.js';

export const siswaController = {
  async list(req, res) {
    const { data, meta } = await siswaService.list(req.validated.query);
    res.json({ success: true, data, meta });
  },

  async get(req, res) {
    const siswa = await siswaService.getById(req.validated.params.id);
    res.json({ success: true, data: siswa });
  },

  async create(req, res) {
    const siswa = await siswaService.create(req.validated.body);
    res.status(201).json({ success: true, message: 'Siswa berhasil dibuat', data: siswa });
  },

  async update(req, res) {
    const siswa = await siswaService.update(req.validated.params.id, req.validated.body);
    res.json({ success: true, message: 'Siswa berhasil diperbarui', data: siswa });
  },

  async remove(req, res) {
    await siswaService.remove(req.validated.params.id);
    res.status(204).send();
  },
};
