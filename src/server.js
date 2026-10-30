import app from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';

const start = async () => {
  try {
    await pool.query('SELECT 1'); // fail-fast kalau DB tidak bisa diakses
    const server = app.listen(env.port, () => {
      console.log(`Server jalan di http://localhost:${env.port}/api`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} diterima, shutting down...`);
      server.close(async () => {
        await pool.end();
        process.exit(0);
      });
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('Gagal start server:', err.message);
    process.exit(1);
  }
};

start();
