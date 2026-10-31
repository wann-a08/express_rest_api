import { pool } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

const COLUMNS = 'id, nipd, nama_lengkap, jenis_kelamin, alamat, kelas, jurusan, created_at, updated_at';
// Whitelist kolom yang boleh ditulis; nama kolom di SQL hanya berasal dari daftar ini
const WRITABLE = ['nipd', 'nama_lengkap', 'jenis_kelamin', 'alamat', 'kelas', 'jurusan'];

const escapeLike = (s) => s.replace(/[\\%_]/g, '\\$&');

const pick = (fields) => WRITABLE.filter((k) => fields[k] !== undefined);

const rethrowDuplicate = (err) => {
  if (err.code === 'ER_DUP_ENTRY') throw new AppError(409, 'NIPD sudah terdaftar');
  throw err;
};

export const siswaService = {
  async list({ page, limit, search, kelas, jurusan, jenis_kelamin }) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('(nama_lengkap LIKE ? OR nipd LIKE ?)');
      params.push(`%${escapeLike(search)}%`, `%${escapeLike(search)}%`);
    }
    if (kelas) { conditions.push('kelas = ?'); params.push(kelas); }
    if (jurusan) { conditions.push('jurusan = ?'); params.push(jurusan); }
    if (jenis_kelamin) { conditions.push('jenis_kelamin = ?'); params.push(jenis_kelamin); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM data_siswa ${where}`, params);
    const [rows] = await pool.query(
      `SELECT ${COLUMNS} FROM data_siswa ${where} ORDER BY id ASC LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    return {
      data: rows,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id) {
    const [rows] = await pool.query(`SELECT ${COLUMNS} FROM data_siswa WHERE id = ?`, [id]);
    if (!rows.length) throw new AppError(404, 'Siswa tidak ditemukan');
    return rows[0];
  },

  async create(fields) {
    const keys = pick(fields);
    try {
      const [result] = await pool.query(
        `INSERT INTO data_siswa (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`,
        keys.map((k) => fields[k]),
      );
      return this.getById(result.insertId);
    } catch (err) {
      return rethrowDuplicate(err);
    }
  },

  async update(id, fields) {
    await this.getById(id); // pastikan ada, 404 kalau tidak
    const keys = pick(fields);
    try {
      await pool.query(
        `UPDATE data_siswa SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`,
        [...keys.map((k) => fields[k]), id],
      );
    } catch (err) {
      rethrowDuplicate(err);
    }
    return this.getById(id);
  },

  async remove(id) {
    const [result] = await pool.query('DELETE FROM data_siswa WHERE id = ?', [id]);
    if (!result.affectedRows) throw new AppError(404, 'Siswa tidak ditemukan');
  },
};
