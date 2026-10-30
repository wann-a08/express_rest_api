import { pool } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

const COLUMNS = 'id, name, email, created_at, updated_at';

export const userService = {
  async list({ page, limit, search }) {
    const offset = (page - 1) * limit;
    const where = search ? 'WHERE name LIKE ? OR email LIKE ?' : '';
    const params = search ? [`%${search}%`, `%${search}%`] : [];

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM users ${where}`, params);
    const [rows] = await pool.query(
      `SELECT ${COLUMNS} FROM users ${where} ORDER BY id ASC LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    return {
      data: rows,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(id) {
    const [rows] = await pool.query(`SELECT ${COLUMNS} FROM users WHERE id = ?`, [id]);
    if (!rows.length) throw new AppError(404, 'User tidak ditemukan');
    return rows[0];
  },

  async create({ name, email }) {
    const [result] = await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    return this.getById(result.insertId);
  },

  async update(id, fields) {
    await this.getById(id); // pastikan ada, 404 kalau tidak
    const keys = Object.keys(fields);
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, [...Object.values(fields), id]);
    return this.getById(id);
  },

  async remove(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (!result.affectedRows) throw new AppError(404, 'User tidak ditemukan');
  },
};
