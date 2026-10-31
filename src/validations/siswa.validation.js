import { z } from 'zod';

export const KELAS = ['10', '11', '12'];
export const JURUSAN = ['RPL', 'DKV', 'BIDI', 'TKJ', 'AK'];
export const JENIS_KELAMIN = ['L', 'P'];

// Kolom ENUM di DB bertipe string; JSON sering mengirim angka (10) -> jadikan string
const toStr = (v) => (typeof v === 'number' ? String(v) : v);
const toUpper = (v) => (typeof v === 'string' ? v.trim().toUpperCase() : v);

const nipd = z.string({ error: 'NIPD wajib diisi' }).trim().min(1, 'NIPD wajib diisi').max(50);
const namaLengkap = z.string({ error: 'Nama lengkap wajib diisi' }).trim().min(1, 'Nama lengkap wajib diisi').max(50);
const jenisKelamin = z.preprocess(toUpper, z.enum(JENIS_KELAMIN, { error: 'Jenis kelamin harus L atau P' }));
const kelas = z.preprocess(toStr, z.enum(KELAS, { error: 'Kelas harus 10, 11, atau 12' }));
const jurusan = z.preprocess(toUpper, z.enum(JURUSAN, { error: `Jurusan harus salah satu: ${JURUSAN.join(', ')}` }));

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createSiswaSchema = z.object({
  nipd,
  nama_lengkap: namaLengkap,
  jenis_kelamin: jenisKelamin,
  alamat: z.string().trim().max(50).nullable().optional(),
  kelas,
  jurusan,
});

export const updateSiswaSchema = createSiswaSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Minimal satu field harus diisi',
  });

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().max(100).optional(), // cari di nama_lengkap / nipd
  kelas: kelas.optional(),
  jurusan: jurusan.optional(),
  jenis_kelamin: jenisKelamin.optional(),
});
