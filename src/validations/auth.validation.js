import { z } from 'zod';

// bcrypt hanya memakai 72 byte pertama password, jadi dibatasi 72
const password = z.string().min(8, 'Password minimal 8 karakter').max(72, 'Password maksimal 72 karakter');

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9_.]+$/, 'Username hanya boleh huruf, angka, titik, dan underscore'),
  email: z
    .string({ error: 'Email wajib diisi' })
    .trim()
    .toLowerCase()
    .email('Format email tidak valid')
    .max(150),
  password,
});

const loginId = z.string().trim().toLowerCase().min(1).max(150);

// `identifier` = username ATAU email. `username` tetap diterima sebagai alias
// supaya client lama yang mengirim { username, password } tidak rusak.
export const loginSchema = z
  .object({
    identifier: loginId.optional(),
    username: loginId.optional(),
    password: z.string().min(1).max(72),
  })
  .refine((d) => d.identifier || d.username, {
    message: 'identifier (username atau email) wajib diisi',
    path: ['identifier'],
  })
  .transform(({ identifier, username, password }) => ({
    identifier: identifier ?? username,
    password,
  }));
