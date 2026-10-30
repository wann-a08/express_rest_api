import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const ROUNDS = 12;
// Hash dummy: dipakai saat akun tidak ada supaya waktu respons tetap mirip
// (mencegah user enumeration lewat timing)
const DUMMY_HASH = bcrypt.hashSync('dummy-password', ROUNDS);

const signToken = (account) =>
  jwt.sign({ sub: String(account.id), username: account.username }, env.jwt.secret, {
    algorithm: 'HS256',
    expiresIn: env.jwt.expiresIn,
  });

const findPublicById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, username, email, created_at, updated_at FROM accounts  WHERE id = ?',
    [id],
  );
  return rows[0];
};

// Ambil nama key dari pesan error duplikat MySQL/MariaDB:
//   MariaDB: "... for key 'email'"   MySQL 8: "... for key 'accounts.email'"
const duplicateKey = (err) => /for key '(?:[^'.]*\.)?([^']+)'/.exec(err.sqlMessage || '')?.[1];

export const authService = {
  async register({ username, email, password }) {
    const hash = await bcrypt.hash(password, ROUNDS);
    try {
      const [result] = await pool.query(
        'INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)',
        [username, email, hash],
      );
      return findPublicById(result.insertId);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        const key = duplicateKey(err);
        if (key === 'email') throw new AppError(409, 'Email sudah terdaftar');
        if (key === 'username') throw new AppError(409, 'Username sudah dipakai');
        throw new AppError(409, 'Username atau email sudah dipakai');
      }
      throw err;
    }
  },

  async login({ identifier, password }) {
    // Username tidak boleh mengandung '@' (lihat validasi register) dan email selalu
    // mengandung '@', jadi identifier pasti merujuk ke tepat satu kolom.
    const column = identifier.includes('@') ? 'email' : 'username'; // konstanta, bukan input user
    const [rows] = await pool.query(
      `SELECT id, username, email, password, created_at, updated_at FROM accounts WHERE ${column} = ?`,
      [identifier],
    );
    const account = rows[0];
    const valid = await bcrypt.compare(password, account ? account.password : DUMMY_HASH);
    // Pesan sama untuk akun tidak ada maupun password salah
    if (!account || !valid) throw new AppError(401, 'Username/email atau password salah');

    const { password: _hash, ...user } = account;
    return { token: signToken(account), tokenType: 'Bearer', expiresIn: env.jwt.expiresIn, user };
  },

  async me(id) {
    const user = await findPublicById(id);
    if (!user) throw new AppError(401, 'Akun tidak ditemukan');
    return user;
  },
};
