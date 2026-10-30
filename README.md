# Express REST API

REST API dengan Express 5, MySQL (`mysql2`), validasi `zod`, dan error handling terpusat.

## Setup

```bash
npm install
cp .env.example .env        # isi kredensial DB dan JWT_SECRET (lihat komentar di file)
mysql -u root -p < sql/schema.sql
npm run dev                 # development, auto-restart via nodemon (atau: npm start untuk production)
```

## Struktur

```
src/
├── config/        env.js, db.js (connection pool)
├── routes/        definisi endpoint
├── controllers/   handle request/response
├── services/      query & business logic
├── validations/   skema zod
├── middlewares/   validate, errorHandler
└── utils/         AppError, asyncHandler
```

## Endpoint

| Method | URL               | Keterangan                                   |
|--------|-------------------|----------------------------------------------|
| GET    | /api/health       | Health check                                 |
| GET    | /api/users        | List (`?page=1&limit=10&search=kata`)        |
| GET    | /api/users/:id    | Detail                                       |
| POST   | /api/users        | Buat user `{ "name", "email" }`              |
| PUT    | /api/users/:id    | Update parsial (`name` dan/atau `email`)     |
| DELETE | /api/users/:id    | Hapus (204)                                  |
| POST   | /api/auth/register | Buat akun `{ "username", "email", "password" }` |
| POST   | /api/auth/login   | Login `{ "identifier", "password" }`, balikin JWT |
| GET    | /api/auth/me      | Profil akun login (butuh Bearer token)       |

Error response: `{ "success": false, "message": "...", "errors": [...] }`
(400 JSON rusak, 404 tidak ketemu, 409 duplikat, 422 validasi gagal).

## Menambah resource baru

Buat `xxx.validation.js`, `xxx.service.js`, `xxx.controller.js`, `xxx.routes.js`,
lalu daftarkan di `src/routes/index.js`.

## Autentikasi (JWT)

- Tabel `accounts`: `id`, `username`, `email`, `password` (hash bcrypt), `created_at`, `updated_at`.
- DB lama yang sudah punya `accounts`: jalankan `sql/migrations/002_add_email_to_accounts.sql` sekali.
- Login: `POST /api/auth/login` dengan `{ "identifier", "password" }` -> `data.token`.
  `identifier` boleh username atau email (field `username` lama tetap diterima sebagai alias).
- Kirim token di header `Authorization: Bearer <token>`.
- Lindungi route lain dengan middleware `authenticate`:

```js
import { authenticate } from '../middlewares/authenticate.js';
router.get('/rahasia', authenticate, handler); // req.user = { id, username }
```

- `JWT_SECRET` wajib (min 32 karakter), server menolak start kalau kosong.
- Token berlaku `JWT_EXPIRES_IN` (default 1h). Login/register dibatasi `AUTH_RATE_LIMIT_MAX`
  percobaan per 15 menit per IP (default 10). Kalau di belakang reverse proxy,
  set `app.set('trust proxy', 1)` supaya IP klien terbaca benar.
