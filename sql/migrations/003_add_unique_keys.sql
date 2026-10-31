USE `db_swaswan`;

-- Jalankan SEKALI di database db_swaswan yang sudah ada (dump awal belum punya UNIQUE).
-- Gagal dengan "Duplicate entry" kalau sudah ada data kembar: bereskan datanya dulu.
ALTER TABLE `users`
  ADD UNIQUE KEY `uq_users_username` (`username`),
  ADD UNIQUE KEY `uq_users_email` (`email`);

ALTER TABLE `data_siswa`
  ADD UNIQUE KEY `uq_data_siswa_nipd` (`nipd`);
