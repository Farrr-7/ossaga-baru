-- ============================================================
-- DATABASE SKEMA: OSSAGA (OSIS SMA NEGERI 1 SAGARA)
-- Mendukung 1 Superadmin, Beberapa Admin, dan Kuota 30 Anggota (Login NIS)
-- Kompatibel dengan MySQL 5.7+ / MariaDB 10.3+ / phpMyAdmin
-- ============================================================

CREATE DATABASE IF NOT EXISTS `ossaga_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ossaga_db`;

-- 1. TABEL PENGATURAN ORGANISASI
DROP TABLE IF EXISTS `pengaturan`;
CREATE TABLE `pengaturan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_sekolah` VARCHAR(150) NOT NULL DEFAULT 'SMA Negeri 1 SAGARA',
  `nama_organisasi` VARCHAR(150) NOT NULL DEFAULT 'OSSAGA (OSIS SMA Negeri 1)',
  `kabinet` VARCHAR(100) NOT NULL DEFAULT 'Kabinet Nawa Cita Nawasena',
  `periode` VARCHAR(50) NOT NULL DEFAULT '2026/2027',
  `slogan` VARCHAR(255) NOT NULL,
  `kuota_anggota` INT NOT NULL DEFAULT 30,
  `email` VARCHAR(100) DEFAULT 'info@ossaga.sch.id',
  `telepon` VARCHAR(50) DEFAULT '+62 812-3456-7890',
  `alamat` TEXT,
  `visi` TEXT,
  `misi` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `pengaturan` (`id`, `nama_sekolah`, `nama_organisasi`, `kabinet`, `periode`, `slogan`, `kuota_anggota`, `email`, `telepon`, `alamat`, `visi`, `misi`) VALUES
(1, 'SMA Negeri 1 SAGARA', 'OSSAGA (OSIS SMA Negeri 1)', 'Kabinet Nawa Cita Nawasena', '2026/2027', 
'Kreatif, Kolaboratif, Berintegritas, dan Menginspirasi', 30, 'info@ossaga.sch.id', '+62 812-3456-7890', 
'Jl. Pendidikan Bhakti No. 45, Kampus Prestasi', 
'Mewujudkan OSIS SMA Negeri 1 SAGARA sebagai organisasi yang progresif, inklusif, berlandaskan akhlak mulia, serta tanggap terhadap kemajuan ilmu pengetahuan dan teknologi demi melahirkan generasi yang unggul dan berdaya saing.',
'1. Menumbuhkan nilai-nilai keimanan, ketaqwaan, dan budi pekerti luhur.\n2. Meningkatkan solidaritas dan sinergi antar sesama siswa dan guru.\n3. Mengoptimalkan pemanfaatan teknologi digital.\n4. Menampung dan memperjuangkan aspirasi siswa.\n5. Menciptakan iklim sekolah yang disiplin, sportif, dan berprestasi.');

-- 2. TABEL USERS & ANGGOTA (SUPERADMIN, ADMIN, & ANGGOTA NIS)
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nis` VARCHAR(30) UNIQUE NOT NULL COMMENT 'Nomor Induk Siswa untuk login',
  `username` VARCHAR(50) NULL,
  `email` VARCHAR(100) NULL,
  `password` VARCHAR(255) NOT NULL,
  `nama` VARCHAR(150) NOT NULL,
  `role` ENUM('superadmin', 'admin', 'anggota') NOT NULL DEFAULT 'anggota',
  `kelas` VARCHAR(50) NOT NULL,
  `jabatan` VARCHAR(100) NOT NULL,
  `telepon` VARCHAR(30) DEFAULT NULL,
  `status` ENUM('aktif', 'pending', 'nonaktif') NOT NULL DEFAULT 'aktif',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data: 1 Superadmin, 2 Admin, dan Contoh Anggota OSIS awal (dari batas 30 orang)
INSERT INTO `users` (`nis`, `username`, `email`, `password`, `nama`, `role`, `kelas`, `jabatan`, `telepon`, `status`, `avatar`) VALUES
('SA001', 'superadmin', 'superadmin@ossaga.sch.id', 'superadmin123', 'Super Administrator OSSAGA', 'superadmin', 'Guru / IT Pembina', 'Kepala Pusat Data & Pengembang Sistem', '081299990001', 'aktif', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80'),
('ADM001', 'pembina', 'pembina@ossaga.sch.id', 'admin123', 'Dra. Hj. Siti Rahmawati, M.Pd.', 'admin', 'Pembina OSIS', 'Pembina Utama Kesiswaan & OSIS', '081299990002', 'aktif', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'),
('23241001', 'ketua', 'ketua.osis@ossaga.sch.id', 'admin123', 'Muhammad Arya Pratama', 'admin', 'XI MIPA 1', 'Ketua Umum OSIS', '081299991001', 'aktif', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'),
('23241002', NULL, 'nadia.putri@ossaga.sch.id', 'anggota123', 'Nadia Putri Maharani', 'anggota', 'XI IPS 2', 'Wakil Ketua OSIS', '081299991002', 'aktif', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'),
('23241003', NULL, 'rizky.fauzan@ossaga.sch.id', 'anggota123', 'Rizky Fauzan Anshori', 'anggota', 'XI MIPA 3', 'Sekretaris 1', '081299991003', 'aktif', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'),
('23241004', NULL, 'anisa.zahra@ossaga.sch.id', 'anggota123', 'Anisa Zahra Lestari', 'anggota', 'XI MIPA 2', 'Bendahara 1', '081299991004', 'aktif', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80'),
('23241005', NULL, 'bagas.satria@ossaga.sch.id', 'anggota123', 'Bagas Satria Wicaksono', 'anggota', 'X-E1', 'Koordinator Sekbid 1 (Ketaqwaan)', '081299991005', 'aktif', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'),
('23241006', NULL, 'clarissa.angelina@ossaga.sch.id', 'anggota123', 'Clarissa Angelina', 'anggota', 'X-E3', 'Koordinator Sekbid 5 (Bela Negara)', '081299991006', 'aktif', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80');

-- 3. TABEL BERITA & ARTIKEL PUBLIK
DROP TABLE IF EXISTS `berita`;
CREATE TABLE `berita` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `judul` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `ringkasan` TEXT NOT NULL,
  `konten` LONGTEXT NOT NULL,
  `kategori` VARCHAR(80) NOT NULL,
  `penulis` VARCHAR(100) NOT NULL,
  `gambar` VARCHAR(255) DEFAULT NULL,
  `views` INT DEFAULT 1,
  `tanggal` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `berita` (`judul`, `slug`, `ringkasan`, `konten`, `kategori`, `penulis`, `gambar`, `views`, `tanggal`) VALUES
('Pentas Seni & Budaya OSSAGA FEST 2026 Sukses Mengguncang Panggung Utama!', 'pentas-seni-budaya-ossaga-fest-2026', 'Ribuan siswa dan tamu undangan larut dalam kemeriahan pentas karya kolaborasi ekstrakurikuler serta penampilan bintang tamu spektakuler.', 'Pentas Seni tahunan SMA Negeri 1 SAGARA kembali membuktikan kreativitas tanpa batas generasi muda...', 'Kegiatan', 'Sekbid 8 (Seni)', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', 342, '2026-11-05'),
('Latihan Dasar Kepemimpinan Siswa (LDKS) Cetak Calon Penggerak Berkarakter', 'ldks-2026', 'Selama tiga hari di Bumi Perkemahan Mandiri, para calon pengurus digembleng kedisiplinan dan problem solving.', 'Sebanyak 30 calon fungsionaris OSIS mengikuti serangkaian materi manajemen konflik dan etika kepemimpinan...', 'Pengkaderan', 'Sekretaris OSIS', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80', 289, '2026-10-22');

-- 4. TABEL AGENDA KEGIATAN PUBLIK
DROP TABLE IF EXISTS `agenda`;
CREATE TABLE `agenda` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `judul` VARCHAR(255) NOT NULL,
  `tanggal` DATE NOT NULL,
  `waktu` VARCHAR(80) NOT NULL,
  `lokasi` VARCHAR(150) NOT NULL,
  `kategori` VARCHAR(80) NOT NULL,
  `penanggung_jawab` VARCHAR(100) DEFAULT NULL,
  `deskripsi` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `agenda` (`judul`, `tanggal`, `waktu`, `lokasi`, `kategori`, `penanggung_jawab`, `deskripsi`) VALUES
('Class Meeting Semester Ganjil 2026 (SAGARA League)', '2026-12-14', '07:30 - 15:00 WIB', 'GOR & Lapangan Olahraga', 'Olahraga', 'Sekbid 7', 'Turnamen olahraga dan e-sport antar kelas setelah ujian semester.'),
('Bakti Sosial & Santunan Kasih Akhir Tahun', '2026-12-20', '08:00 - 12:30 WIB', 'Panti Asuhan Kasih Bangsa', 'Sosial', 'Sekbid 1 & 6', 'Penyaluran donasi sembako dan buku dari seluruh siswa.');

-- 5. TABEL PROGRAM KERJA (PROKER)
DROP TABLE IF EXISTS `proker`;
CREATE TABLE `proker` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(200) NOT NULL,
  `sekbid` VARCHAR(120) NOT NULL,
  `tujuan` TEXT,
  `anggaran` VARCHAR(80) DEFAULT 'Rp 0',
  `progress` INT DEFAULT 0,
  `status` ENUM('Mendatang', 'Sedang Berjalan', 'Terlaksana') DEFAULT 'Mendatang',
  `target_tanggal` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `proker` (`nama`, `sekbid`, `tujuan`, `anggaran`, `progress`, `status`, `target_tanggal`) VALUES
('OSSAGA FEST 2026', 'Sekbid 8 - Kesenian', 'Menumbuhkan ekspresi seni dan jiwa kewirausahaan siswa.', 'Rp 18.500.000', 100, 'Terlaksana', '2026-11-05'),
('LDKS Pengurus Baru', 'BPH & Bela Negara', 'Pelatihan karakter kepemimpinan dan kekompakan organisasi.', 'Rp 12.000.000', 100, 'Terlaksana', '2026-10-22'),
('SAGARA League 2026', 'Sekbid Olahraga', 'Penyaluran minat bakat atletik dan refreshing ujian.', 'Rp 8.500.000', 65, 'Sedang Berjalan', '2026-12-14');

-- 6. TABEL ASPIRASI & SUARA SISWA (PUBLIK)
DROP TABLE IF EXISTS `aspirasi`;
CREATE TABLE `aspirasi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_pengirim` VARCHAR(100) DEFAULT 'Siswa Anonim',
  `kelas` VARCHAR(50) DEFAULT 'Umum',
  `kontak` VARCHAR(100) DEFAULT '-',
  `kategori` VARCHAR(80) DEFAULT 'Umum',
  `pesan` TEXT NOT NULL,
  `status` ENUM('Menunggu', 'Diterima', 'Diproses', 'Selesai') DEFAULT 'Menunggu',
  `balasan` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `aspirasi` (`nama_pengirim`, `kelas`, `kontak`, `kategori`, `pesan`, `status`, `balasan`) VALUES
('Siswa Kelas XI MIPA', 'XI MIPA 3', 'siswa@email.com', 'Fasilitas Sekolah', 'Mohon dibantu usulan penambahan dispenser air minum di koridor lantai 2.', 'Diproses', 'Terima kasih atas masukannya! Usulan ini sudah masuk dalam notulensi rapat dengan sarpras.'),
('Perwakilan Ekskul Paskibra', 'XI IPS 1', '0813xxxxxx', 'Ekstrakurikuler', 'Jadwal latihan di lapangan utama mohon diatur pembagian harinya secara adil.', 'Selesai', 'Jadwal pemakaian lapangan terpadu sudah diterbitkan per 12 November.');

-- 7. TABEL NOTULENSI RAPAT (INTERNAL 30 ANGGOTA & ADMIN)
DROP TABLE IF EXISTS `notulensi`;
CREATE TABLE `notulensi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `judul` VARCHAR(255) NOT NULL,
  `tanggal` DATE NOT NULL,
  `pimpinan` VARCHAR(100) NOT NULL,
  `sekretaris` VARCHAR(100) NOT NULL,
  `peserta_hadir` INT DEFAULT 30,
  `keputusan` LONGTEXT NOT NULL,
  `status` VARCHAR(50) DEFAULT 'Final',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `notulensi` (`judul`, `tanggal`, `pimpinan`, `sekretaris`, `peserta_hadir`, `keputusan`) VALUES
('Rapat Koordinasi Persiapan Final SAGARA League 2026', '2026-11-10', 'Muhammad Arya Pratama (Ketua)', 'Rizky Fauzan Anshori', 28, '1. Pendaftaran turnamen ditutup 5 Desember 2026.\n2. Technical Meeting diadakan 10 Desember di Aula.\n3. Tiap seksi wajib mengumpulkan RAB ke Bendahara.'),
('Evaluasi Pasca OSSAGA FEST 2026 & LPJ Keuangan', '2026-11-06', 'Dra. Hj. Siti Rahmawati (Pembina)', 'Anisa Zahra Lestari', 30, '1. Terdapat sisa surplus kas sebesar Rp 2.450.000 dialokasikan untuk Baksos Akhir Tahun.\n2. Seluruh kuitansi pengeluaran telah diverifikasi lengkap.');

-- 8. TABEL PRESENSI KEHADIRAN INTERNAL
DROP TABLE IF EXISTS `presensi`;
CREATE TABLE `presensi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `nis` VARCHAR(30) NOT NULL,
  `nama` VARCHAR(150) NOT NULL,
  `agenda_judul` VARCHAR(200) NOT NULL,
  `tanggal` DATE NOT NULL,
  `waktu` VARCHAR(50) NOT NULL,
  `status` ENUM('Hadir', 'Izin', 'Sakit', 'Alfa') DEFAULT 'Hadir',
  `keterangan` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `presensi` (`nis`, `nama`, `agenda_judul`, `tanggal`, `waktu`, `status`, `keterangan`) VALUES
('23241002', 'Nadia Putri Maharani', 'Rapat Koordinasi SAGARA League', '2026-11-10', '15:28 WIB', 'Hadir', 'Tepat waktu'),
('23241003', 'Rizky Fauzan Anshori', 'Rapat Koordinasi SAGARA League', '2026-11-10', '15:30 WIB', 'Hadir', 'Tepat waktu');

-- 9. TABEL GALERI DOKUMENTASI KEGIATAN
DROP TABLE IF EXISTS `galeri`;
CREATE TABLE `galeri` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `judul` VARCHAR(200) NOT NULL,
  `kategori` VARCHAR(80) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `galeri` (`judul`, `kategori`, `url`, `deskripsi`) VALUES
('Keseruan Malam Puncak OSSAGA FEST 2026', 'Pentas Seni', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', 'Penampilan spektakuler band kolaborasi siswa dan bintang tamu.'),
('Pelantikan Resmi Fungsionaris OSIS 2026/2027', 'Pelantikan', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80', 'Pengambilan sumpah jabatan 30 fungsionaris di hadapan Kepala Sekolah.'),
('Upacara Hari Pahlawan Nasional', 'Kegiatan', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80', 'Petugas upacara dari fungsionaris OSIS dan perwakilan ekskul Paskibra.'),
('Final Turnamen Bola Basket Antar Kelas', 'Lomba', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80', 'Pertandingan sengit memperebutkan piala bergilir Kepala Sekolah.');
