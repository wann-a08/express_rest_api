USE express_api;

-- Jalankan SEKALI untuk database yang tabel `accounts`-nya sudah ada.
-- Kolom dibuat NULL dulu supaya akun lama tidak error (UNIQUE mengizinkan banyak NULL).
-- Akun lama tetap bisa login pakai username; akun baru wajib punya email dari aplikasi.
ALTER TABLE accounts ADD COLUMN email VARCHAR(150) NULL UNIQUE AFTER username;

-- Setelah SEMUA akun lama punya email, kunci jadi wajib:
-- ALTER TABLE accounts MODIFY email VARCHAR(150) NOT NULL;
