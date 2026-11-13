/**
 * OSSAGA Database & Data Management Engine
 * Mendukung penyimpanan lokal persisten (LocalStorage), seed data otomatis,
 * validasi kuota 30 anggota, multi-role (superadmin, admin, anggota),
 * dan fungsi ekspor/impor database.
 */

const DB_KEY = 'OSSAGA_DATABASE_V1';
const SESSION_KEY = 'OSSAGA_SESSION_USER';
const MAX_ANGGOTA_KUOTA = 30;

// Data Default / Seed Data
const defaultDatabase = {
  pengaturan: {
    nama_sekolah: 'SMA Negeri 1 SAGARA',
    nama_organisasi: 'OSSAGA (OSIS SMA Negeri 1)',
    kabinet: 'Kabinet Nawa Cita Nawasena',
    periode: '2026/2027',
    slogan: 'Kreatif, Kolaboratif, Berintegritas, dan Menginspirasi',
    deskripsi_singkat: 'Wadah aspirasi, kreasi, dan pengkaderan calon pemimpin masa depan SMA Negeri 1 SAGARA.',
    visi: 'Mewujudkan OSIS SMA Negeri 1 SAGARA sebagai organisasi yang progresif, inklusif, berlandaskan akhlak mulia, serta tanggap terhadap kemajuan ilmu pengetahuan dan teknologi demi melahirkan generasi yang unggul dan berdaya saing.',
    misi: [
      'Menumbuhkan nilai-nilai keimanan, ketaqwaan, dan budi pekerti luhur di lingkungan sekolah.',
      'Meningkatkan rasa solidaritas, kekeluargaan, dan sinergi antar sesama siswa, dewan guru, dan ekstrakurikuler.',
      'Mengoptimalkan pemanfaatan teknologi digital dalam tata kelola administrasi dan publikasi kegiatan sekolah.',
      'Menampung serta memperjuangkan aspirasi, bakat, minat, dan potensi siswa di bidang akademik maupun non-akademik.',
      'Menciptakan iklim lingkungan sekolah yang disiplin, ramah lingkungan, sportif, dan berprestasi.'
    ],
    kuota_anggota: 30,
    email: 'info@ossaga.sch.id',
    telepon: '+62 812-3456-7890',
    alamat: 'Jl. Pendidikan Bhakti No. 45, Kampus Prestasi',
    instagram: '@ossaga_official',
    youtube: 'OSSAGA Official TV',
    tiktok: '@ossaga_creators',
    sambutan_ketua: {
      nama: 'Muhammad Arya Pratama',
      kelas: 'XI MIPA 1',
      foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      teks: 'Assalamu’alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera untuk kita semua. Selamat datang di portal resmi OSSAGA SMA Negeri 1 SAGARA. Website ini dirancang sebagai jembatan transparansi informasi dan ruang kolaborasi terbuka antara pengurus OSIS dengan seluruh warga sekolah. Mari bersama-sama kita wujudkan lingkungan belajar yang aktif, suportif, dan penuh karya nyata!'
    }
  },

  // 1 Superadmin, 2 Admin BPH, dan Anggota OSIS awal
  users: [
    {
      id: 'usr_superadmin',
      nis: 'SA001',
      username: 'superadmin',
      email: 'superadmin@ossaga.sch.id',
      nama: 'Super Administrator OSSAGA',
      role: 'superadmin',
      kelas: 'Guru / IT Pembina',
      jabatan: 'Kepala Pusat Data & Pengembang Sistem',
      telepon: '081299990001',
      password: 'superadmin123',
      status: 'aktif',
      joined_at: '2026-07-01T08:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 'usr_admin_pembina',
      nis: 'ADM001',
      username: 'pembina',
      email: 'pembina@ossaga.sch.id',
      nama: 'Dra. Hj. Siti Rahmawati, M.Pd.',
      role: 'admin',
      kelas: 'Pembina OSIS',
      jabatan: 'Pembina Utama Kesiswaan & OSIS',
      telepon: '081299990002',
      password: 'admin123',
      status: 'aktif',
      joined_at: '2026-07-01T08:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 'usr_admin_ketua',
      nis: '23241001',
      username: 'ketua',
      email: 'ketua.osis@ossaga.sch.id',
      nama: 'Muhammad Arya Pratama',
      role: 'admin',
      kelas: 'XI MIPA 1',
      jabatan: 'Ketua Umum OSIS',
      telepon: '081299991001',
      password: 'admin123',
      status: 'aktif',
      joined_at: '2026-07-10T09:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
    },
    // Contoh Anggota OSIS (dari total kuota 30 orang)
    {
      id: 'usr_anggota_01',
      nis: '23241002',
      email: 'nadia.putri@ossaga.sch.id',
      nama: 'Nadia Putri Maharani',
      role: 'anggota',
      kelas: 'XI IPS 2',
      jabatan: 'Wakil Ketua OSIS',
      telepon: '081299991002',
      password: 'anggota123',
      status: 'aktif',
      joined_at: '2026-07-15T09:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 'usr_anggota_02',
      nis: '23241003',
      email: 'rizky.fauzan@ossaga.sch.id',
      nama: 'Rizky Fauzan Anshori',
      role: 'anggota',
      kelas: 'XI MIPA 3',
      jabatan: 'Sekretaris 1',
      telepon: '081299991003',
      password: 'anggota123',
      status: 'aktif',
      joined_at: '2026-07-15T09:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 'usr_anggota_03',
      nis: '23241004',
      email: 'anisa.zahra@ossaga.sch.id',
      nama: 'Anisa Zahra Lestari',
      role: 'anggota',
      kelas: 'XI MIPA 2',
      jabatan: 'Bendahara 1',
      telepon: '081299991004',
      password: 'anggota123',
      status: 'aktif',
      joined_at: '2026-07-15T09:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 'usr_anggota_04',
      nis: '23241005',
      email: 'bagas.wicaksono@ossaga.sch.id',
      nama: 'Bagas Satria Wicaksono',
      role: 'anggota',
      kelas: 'X-E1',
      jabatan: 'Koordinator Sekbid 1 (Ketaqwaan)',
      telepon: '081299991005',
      password: 'anggota123',
      status: 'aktif',
      joined_at: '2026-07-16T10:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 'usr_anggota_05',
      nis: '23241006',
      email: 'clarissa.angel@ossaga.sch.id',
      nama: 'Clarissa Angelina',
      role: 'anggota',
      kelas: 'X-E3',
      jabatan: 'Koordinator Sekbid 5 (Bela Negara)',
      telepon: '081299991006',
      password: 'anggota123',
      status: 'aktif',
      joined_at: '2026-07-16T10:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80'
    },
    {
      id: 'usr_anggota_06',
      nis: '23241007',
      email: 'fajar.ilham@ossaga.sch.id',
      nama: 'Fajar Ilham Ramadhan',
      role: 'anggota',
      kelas: 'XI IPS 1',
      jabatan: 'Koordinator Sekbid 9 (TIK & Publikasi)',
      telepon: '081299991007',
      password: 'anggota123',
      status: 'aktif',
      joined_at: '2026-07-16T10:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80'
    }
  ],

  // Berita & Artikel Publik
  berita: [
    {
      id: 'brt_01',
      judul: 'Pentas Seni & Budaya OSSAGA FEST 2026 Sukses Mengguncang Panggung Utama!',
      slug: 'pentas-seni-budaya-ossaga-fest-2026',
      ringkasan: 'Ribuan siswa dan tamu undangan larut dalam kemeriahan pentas karya kolaborasi ekstrakurikuler serta penampilan bintang tamu spektakuler.',
      konten: 'Pentas Seni tahunan SMA Negeri 1 SAGARA kembali membuktikan kreativitas tanpa batas generasi muda. Dibuka langsung oleh Kepala Sekolah dan didukung penuh oleh dewan guru, acara ini menghadirkan beragam parade budaya Nusantara, teater musikal, pameran seni rupa digital, dan bazar kewirausahaan siswa. Suksesnya acara ini tidak lepas dari kerja keras 30 pengurus OSIS dan antusiasme seluruh siswa.',
      kategori: 'Kegiatan',
      penulis: 'Sekbid 8 (Seni & Sastra)',
      tanggal: '2026-11-05',
      gambar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      views: 342
    },
    {
      id: 'brt_02',
      judul: 'Latihan Dasar Kepemimpinan Siswa (LDKS) Cetak Calon Penggerak Berkarakter',
      slug: 'latihan-dasar-kepemimpinan-siswa-ldks-2026',
      ringkasan: 'Selama tiga hari di Bumi Perkemahan Mandiri, para calon pengurus digembleng kedisiplinan, problem solving, dan manajemen organisasi modern.',
      konten: 'Sebanyak 30 calon fungsionaris OSIS mengikuti serangkaian materi manajemen konflik, etika kepemimpinan, teknik persidangan, hingga simulasi krisis manajemen. Program ini bertujuan membekali anggota OSIS agar mampu menjadi teladan inspiratif di kelas maupun lingkungan masyarakat luas.',
      kategori: 'Pengkaderan',
      penulis: 'Sekretaris OSIS',
      tanggal: '2026-10-22',
      gambar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      views: 289
    },
    {
      id: 'brt_03',
      judul: 'Gerakan Sekolah Hijau (Green School Project): Donasi 500 Bibit Tanaman Edukasi',
      slug: 'gerakan-sekolah-hijau-donasi-500-bibit',
      ringkasan: 'Sekbid Lingkungan Hidup OSSAGA meluncurkan bank sampah organik dan kebun hidroponik mandiri di rooftop gedung baru.',
      konten: 'Komitmen menciptakan lingkungan belajar yang asri dan berkelanjutan diwujudkan melalui penanaman tanaman hias dan hidroponik sayur. Program ini terintegrasi langsung dengan kurikulum proyek P5 sekolah dan mengajak seluruh kelas berpartisipasi aktif dalam lomba kebersihan kelas mingguan.',
      kategori: 'Sosial',
      penulis: 'Sekbid 7 (Lingkungan Hidup)',
      tanggal: '2026-10-14',
      gambar: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      views: 215
    },
    {
      id: 'brt_04',
      judul: 'Peringatan Hari Pahlawan: Lomba Cipta Puisi & Monolog Kebangsaan Antar Kelas',
      slug: 'peringatan-hari-pahlawan-lomba-cipta-puisi-monolog',
      ringkasan: 'Meneladani perjuangan pahlawan dengan karya sastra dan kreasi drama bertema integritas generasi Z dalam memajukan bangsa.',
      konten: 'Suasana khidmat dan penuh semangat menyelimuti aula sekolah saat para perwakilan kelas menampilkan monolog patriotik. Juara 1 berhasil diraih oleh kelas XI MIPA 2 dengan karya monolog bertajuk "Bunga Gugur di Tapal Batas".',
      kategori: 'Akademik & Seni',
      penulis: 'Sekbid 3 (Budi Pekerti)',
      tanggal: '2026-11-10',
      gambar: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      views: 184
    }
  ],

  // Agenda & Kegiatan
  agenda: [
    {
      id: 'agd_01',
      judul: 'Class Meeting Semester Ganjil 2026 (SAGARA League)',
      tanggal: '2026-12-14',
      waktu: '07:30 - 15:00 WIB',
      lokasi: 'Lapangan Olahraga & Gedung Olahraga (GOR)',
      kategori: 'Olahraga & Seni',
      penanggung_jawab: 'Sekbid Olahraga & Kesehatan',
      status: 'Mendatang',
      deskripsi: 'Turnamen futsal, basket 3 on 3, badminton, e-sport Mobile Legends, dan lomba tarik suara antar kelas setelah ujian semester.'
    },
    {
      id: 'agd_02',
      judul: 'Bakti Sosial & Santunan Kasih Akhir Tahun',
      tanggal: '2026-12-20',
      waktu: '08:00 - 12:30 WIB',
      lokasi: 'Panti Asuhan Kasih Bangsa & Warga Sekitar Sekolah',
      kategori: 'Sosial',
      penanggung_jawab: 'Sekbid Ketaqwaan & Sekbid Sosial',
      status: 'Mendatang',
      deskripsi: 'Penyaluran sembako, buku bacaan, dan pakaian layak pakai hasil penggalangan dana sukarela seluruh siswa SMA Negeri 1.'
    },
    {
      id: 'agd_03',
      judul: 'Rapat Pleno Bulanan Evaluasi Proker Periode I',
      tanggal: '2026-11-28',
      waktu: '15:30 - 17:30 WIB',
      lokasi: 'Ruang Rapat OSIS (Internal)',
      kategori: 'Rapat Internal',
      penanggung_jawab: 'BPH (Ketua & Sekretaris)',
      status: 'Mendatang',
      deskripsi: 'Rapat koordinasi 30 pengurus OSIS beserta Pembina untuk mengevaluasi realisasi program kerja bulan Oktober-November.'
    },
    {
      id: 'agd_04',
      judul: 'Workshop Pemanfaatan Artificial Intelligence untuk Pelajar Kreatif',
      tanggal: '2026-11-20',
      waktu: '09:00 - 12:00 WIB',
      lokasi: 'Laboratorium Komputer Multimedia',
      kategori: 'Teknologi',
      penanggung_jawab: 'Sekbid 9 (TIK)',
      status: 'Mendatang',
      deskripsi: 'Pelatihan dasar prompt engineering, ethical AI, dan pembuatan portofolio digital bersama praktisi industri teknologi.'
    }
  ],

  // Program Kerja (Proker)
  proker: [
    {
      id: 'prk_01',
      nama: 'OSSAGA FEST (Pentas Seni & Pameran Karya)',
      sekbid: 'Sekbid 8 - Kesenian & Budaya',
      tujuan: 'Menumbuhkan ekspresi seni, bakat kreatif, dan jiwa kewirausahaan siswa.',
      anggaran: 'Rp 18.500.000',
      progress: 100,
      status: 'Terlaksana',
      target_tanggal: '2026-11-05'
    },
    {
      id: 'prk_02',
      nama: 'Latihan Dasar Kepemimpinan Siswa (LDKS)',
      sekbid: 'BPH & Sekbid Bela Negara',
      tujuan: 'Pelatihan karakter kepemimpinan, kepribadian tangguh, dan kekompakan organisasi.',
      anggaran: 'Rp 12.000.000',
      progress: 100,
      status: 'Terlaksana',
      target_tanggal: '2026-10-22'
    },
    {
      id: 'prk_03',
      nama: 'SAGARA League Class Meeting 2026',
      sekbid: 'Sekbid Olahraga & Prestasi',
      tujuan: 'Refreshing pasca ujian semester dan seleksi bibit atlet olahraga sekolah.',
      anggaran: 'Rp 8.500.000',
      progress: 65,
      status: 'Sedang Berjalan',
      target_tanggal: '2026-12-14'
    },
    {
      id: 'prk_04',
      nama: 'Digitalisasi Aspirasi & Website Interaktif OSIS',
      sekbid: 'Sekbid 9 - TIK & Publikasi',
      tujuan: 'Transparansi informasi, pelaporan terpusat, dan database keanggotaan terintegrasi.',
      anggaran: 'Rp 3.000.000',
      progress: 90,
      status: 'Sedang Berjalan',
      target_tanggal: '2026-11-25'
    },
    {
      id: 'prk_05',
      nama: 'OSSAGA Berbagi (Bakti Sosial Akhir Tahun)',
      sekbid: 'Sekbid 1 & Sekbid 6 (Sosial)',
      tujuan: 'Peningkatan kepedulian sosial terhadap masyarakat prasejahtera di lingkungan sekitar.',
      anggaran: 'Rp 6.000.000',
      progress: 30,
      status: 'Rencana',
      target_tanggal: '2026-12-20'
    },
    {
      id: 'prk_06',
      nama: 'Pekan Literasi & Gelar Karya Ilmiah Remaja',
      sekbid: 'Sekbid 4 - Prestasi Akademik',
      tujuan: 'Mendorong budaya membaca, riset mini, dan lomba debat bahasa Indonesia & Inggris.',
      anggaran: 'Rp 5.000.000',
      progress: 15,
      status: 'Rencana',
      target_tanggal: '2027-01-25'
    },
    {
      id: 'prk_07',
      nama: 'Workshop AI & Pemrograman Web Generasi Muda',
      sekbid: 'Sekbid 9 - TIK & Publikasi',
      tujuan: 'Membekali fungsionaris dan siswa dengan skill teknologi masa depan.',
      anggaran: 'Rp 4.500.000',
      progress: 10,
      status: 'Rencana',
      target_tanggal: '2027-02-10'
    }
  ],

  // Kotak Aspirasi & Suara Siswa (Publik bisa mengirim tanpa login)
  aspirasi: [
    {
      id: 'asp_01',
      nama_pengirim: 'Siswa Kelas XI MIPA',
      kelas: 'XI MIPA 3',
      kontak: 'siswa@email.com',
      kategori: 'Fasilitas Sekolah',
      pesan: 'Mohon dibantu usulan penambahan dispenser air minum di koridor lantai 2 gedung barat agar siswa tidak perlu turun ke kantin saat istirahat singkat.',
      tanggal: '2026-11-08',
      status: 'Diproses',
      balasan: 'Terima kasih atas masukannya! Usulan ini sudah masuk dalam notulensi koordinasi OSIS dengan pihak sarana prasarana sekolah.'
    },
    {
      id: 'asp_02',
      nama_pengirim: 'Anonim (Penggemar Musik)',
      kelas: 'X-E2',
      kontak: '-',
      kategori: 'Kegiatan Siswa',
      pesan: 'Bisa tidak saat istirahat kedua disetelkan lagu-lagu santai atau podcast karya siswa melalui pengeras suara sekolah?',
      tanggal: '2026-11-10',
      status: 'Diterima',
      balasan: 'Ide bagus! Sekbid 9 sedang merancang program "OSSAGA Radio Break" setiap hari Selasa dan Kamis.'
    },
    {
      id: 'asp_03',
      nama_pengirim: 'Perwakilan Ekstrakurikuler Paskibra',
      kelas: 'XI IPS 1',
      kontak: '0813xxxxxx',
      kategori: 'Ekstrakurikuler',
      pesan: 'Jadwal latihan di lapangan utama mohon diatur pembagian harinya secara adil dengan ekskul futsal dan basket.',
      tanggal: '2026-11-11',
      status: 'Selesai',
      balasan: 'Jadwal pemakaian lapangan terpadu sudah diterbitkan dan disepakati oleh seluruh ketua ekskul per tanggal 12 November.'
    }
  ],

  // Notulensi Rapat Internal (HANYA UNTUK 30 ANGGOTA & ADMIN YG LOGIN)
  notulensi: [
    {
      id: 'not_01',
      judul: 'Rapat Koordinasi Persiapan Final SAGARA League 2026',
      tanggal: '2026-11-10',
      pimpinan: 'Muhammad Arya Pratama (Ketua OSIS)',
      sekretaris: 'Rizky Fauzan Anshori',
      ringkasan: 'Pembahasan teknis wasit luar, rundown pembukaan, izin aparat keamanan, dan sponsor air mineral.',
      keputusan: '1. Pendaftaran turnamen ditutup 5 Desember 2026.\n2. Technical Meeting diadakan 10 Desember 2026 di Aula.\n3. Tiap seksi wajib mengumpulkan RAB detail ke Bendahara paling lambat Jumat ini.',
      peserta_hadir: 28,
      status: 'Final'
    },
    {
      id: 'not_02',
      judul: 'Evaluasi Pasca OSSAGA FEST 2026 & LPJ Keuangan',
      tanggal: '2026-11-06',
      pimpinan: 'Dra. Hj. Siti Rahmawati (Pembina)',
      sekretaris: 'Anisa Zahra Lestari (Bendahara)',
      ringkasan: 'Laporan pertanggungjawaban dana sponsorship dan tiket masuk pensi.',
      keputusan: '1. Terdapat sisa surplus kas sebesar Rp 2.450.000 yang akan dialokasikan untuk kas Baksos Akhir Tahun.\n2. Seluruh kuitansi pengeluaran telah diverifikasi lengkap oleh Pembina.',
      peserta_hadir: 30,
      status: 'Disetujui'
    }
  ],

  // Presensi Kehadiran Internal Anggota OSIS
  presensi: [
    {
      id: 'prs_01',
      agenda_id: 'agd_03',
      agenda_judul: 'Rapat Evaluasi Proker November',
      tanggal: '2026-11-10',
      user_id: 'usr_anggota_01',
      nis: '23241002',
      nama: 'Nadia Putri Maharani',
      waktu: '15:28 WIB',
      status: 'Hadir',
      keterangan: 'Tepat waktu'
    },
    {
      id: 'prs_02',
      agenda_id: 'agd_03',
      agenda_judul: 'Rapat Evaluasi Proker November',
      tanggal: '2026-11-10',
      user_id: 'usr_anggota_02',
      nis: '23241003',
      nama: 'Rizky Fauzan Anshori',
      waktu: '15:30 WIB',
      status: 'Hadir',
      keterangan: 'Tepat waktu'
    },
    {
      id: 'prs_03',
      agenda_id: 'agd_03',
      agenda_judul: 'Rapat Evaluasi Proker November',
      tanggal: '2026-11-10',
      user_id: 'usr_anggota_05',
      nis: '23241006',
      nama: 'Clarissa Angelina',
      waktu: '15:45 WIB',
      status: 'Izin',
      keterangan: 'Mengikuti bimbingan olimpiade sains'
    }
  ],

  // 10 Seksi Bidang (Sekbid) dengan Detail Lengkap
  sekbid: [
    {
      nomor: '01',
      nama: 'Keimanan & Ketaqwaan Terhadap Tuhan YME',
      singkat: 'Keagamaan & Moral',
      koordinator: 'Fahri Alamsyah (XI MIPA 2)',
      deskripsi: 'Membina kerohanian, memupuk toleransi beragama, mengkoordinir peringatan hari besar keagamaan, dan pembiasaan ibadah bersama di lingkungan sekolah.',
      proker: ['Pesantren Kilat Ramadhan', 'Jum\'at Berkah Berbagi', 'Peringatan Hari Besar Islam & Kristen'],
      color: '#38BDF8'
    },
    {
      nomor: '02',
      nama: 'Budi Pekerti Luhur & Akhlak Mulia',
      singkat: 'Budi Pekerti & Adab',
      koordinator: 'Siti Nurhaliza (XI IPS 1)',
      deskripsi: 'Menanamkan budaya tata krama 5S (Senyum, Sapa, Salam, Sopan, Santun), mempelopori gerakan anti-bullying, dan penegakan etika disiplin siswa.',
      proker: ['Kampanye Sekolah Ramah Anak', 'Gerakan Budaya 5S', 'Duta Karakter Pelajar Teladan'],
      color: '#C084FC'
    },
    {
      nomor: '03',
      nama: 'Wawasan Kebangsaan & Bela Negara',
      singkat: 'Bela Negara & Disiplin',
      koordinator: 'Dimas Aditya (XI MIPA 4)',
      deskripsi: 'Meningkatkan jiwa patriotisme, kedisiplinan tata upacara bendera, kesadaran hukum pelajar, serta koordinasi ekstrakurikuler paskibra.',
      proker: ['LDKS Kepemimpinan Tangguh', 'Pawai Kebangsaan 17 Agustus', 'Pelatihan Tata Upacara Bendera'],
      color: '#F87171'
    },
    {
      nomor: '04',
      nama: 'Prestasi Akademik, Sains, & Teknologi',
      singkat: 'Akademik & Prestasi',
      koordinator: 'Clarissa Angelina (XI MIPA 1)',
      deskripsi: 'Mengembangkan daya saing intelektual siswa, pembinaan olimpiade sains (KSN), dan pengelolaan klinik belajar kelompok tutor sebaya.',
      proker: ['SAGARA Science Olympiad', 'Klinik Belajar Tutor Sebaya', 'Gelar Karya Tulis Ilmiah Remaja'],
      color: '#60A5FA'
    },
    {
      nomor: '05',
      nama: 'Demokrasi, HAM, & Pendidikan Politik',
      singkat: 'Demokrasi & HAM',
      koordinator: 'Bima Sakti (XI IPS 2)',
      deskripsi: 'Memberikan pendidikan politik santun, simulasi pemilihan ketua OSIS (Pilketos) secara langsung dan transparan, serta advokasi hak siswa.',
      proker: ['Pilketos E-Voting Transparan', 'Debat Terbuka Kandidat', 'Forum Parlemen Siswa Terbuka'],
      color: '#34D399'
    },
    {
      nomor: '06',
      nama: 'Kreativitas, Keterampilan, & Kewirausahaan',
      singkat: 'Kreativitas Usaha',
      koordinator: 'Zahra Aulia (XI IPS 3)',
      deskripsi: 'Menumbuhkan jiwa enterpreneur muda, pemanfaatan barang daur ulang bernilai ekonomis, dan pengelolaan stan bazar market day siswa.',
      proker: ['SAGARA Student Market Day', 'Workshop Bisnis Digital Pelajar', 'Produksi Merchandise OSSAGA'],
      color: '#FB923C'
    },
    {
      nomor: '07',
      nama: 'Kualitas Jasmani, Kesehatan, & Gizi',
      singkat: 'Jasmani & Olahraga',
      koordinator: 'Kevin Pratama (XI MIPA 3)',
      deskripsi: 'Menggalakkan olahraga rutin, pemantauan kebersihan lingkungan dan kantin sehat, aksi donor darah, serta pencegahan zat berbahaya.',
      proker: ['SAGARA League Class Meeting', 'Senam Kebugaran Jumat', 'Aksi Donor Darah PMR-OSIS'],
      color: '#FBBF24'
    },
    {
      nomor: '08',
      nama: 'Sastra, Budaya, & Seni Pertunjukan',
      singkat: 'Seni & Budaya',
      koordinator: 'Alya Putri (XI Bahasa)',
      deskripsi: 'Melestarikan seni tradisional dan kontemporer, memfasilitasi minat band musik, sanggar tari, teater, dan pentas seni akbar tahunan.',
      proker: ['Pentas Seni OSSAGA FEST', 'Festival Bulan Bahasa', 'Pameran Karya Seni Rupa Siswa'],
      color: '#F472B6'
    },
    {
      nomor: '09',
      nama: 'Teknologi Informasi & Komunikasi (TIK)',
      singkat: 'TIK & Publikasi',
      koordinator: 'Muhammad Raihan (XI MIPA 1)',
      deskripsi: 'Mengelola digitalisasi organisasi, website resmi OSSAGA, media sosial (Instagram/TikTok), dan peliputan multimedia seluruh program kerja.',
      proker: ['Pengembangan Web Portal OSSAGA', 'Workshop AI & Coding Pelajar', 'Podcast OSIS Talks'],
      color: '#E9D5FF'
    },
    {
      nomor: '10',
      nama: 'Komunikasi Bahasa Asing & Global',
      singkat: 'Bahasa Asing',
      koordinator: 'Jessica Natalie (XI Bahasa)',
      deskripsi: 'Memfasilitasi kecakapan bahasa internasional (Inggris, Jepang, Jerman), lomba debat bahasa asing, dan forum diplomasi pelajar.',
      proker: ['English Day Routine', 'Speech & Storytelling Contest', 'SAGARA Model United Nations'],
      color: '#86EFAC'
    }
  ],

  // Galeri Dokumentasi Kegiatan (Mendukung filter: Kegiatan, LDKS, Porseni)
  galeri: [
    // Kategori: Kegiatan
    {
      id: 'gal_01',
      judul: 'Pelantikan 30 Fungsionaris OSSAGA Periode Baru',
      kategori: 'Kegiatan',
      tanggal: '2026-08-17',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      deskripsi: 'Pengucapan ikrar sumpah fungsionaris di hadapan Kepala Sekolah dan dewan pembina OSIS.'
    },
    {
      id: 'gal_02',
      judul: 'Aksi Bersih Lingkungan & Penanaman 100 Bibit Pohon',
      kategori: 'Kegiatan',
      tanggal: '2026-10-14',
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      deskripsi: 'Gerakan peduli lingkungan hijau untuk mewujudkan sekolah yang asri dan bebas sampah plastik.'
    },
    {
      id: 'gal_03',
      judul: 'Diskusi Terbuka Parlemen & Kotak Aspirasi Siswa',
      kategori: 'Kegiatan',
      tanggal: '2026-09-09',
      url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
      deskripsi: 'Forum dengar aspirasi bulanan bersama perwakilan kelas dan pembina OSIS.'
    },

    // Kategori: LDKS
    {
      id: 'gal_04',
      judul: 'Outbound & Survival LDKS di Kaki Pegunungan',
      kategori: 'LDKS',
      tanggal: '2026-10-21',
      url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
      deskripsi: 'Latihan ketangguhan fisik, kekompakan tim, dan problem solving kepemimpinan di alam terbuka.'
    },
    {
      id: 'gal_05',
      judul: 'Malam Renungan Api Unggun & Ikrar Pemimpin',
      kategori: 'LDKS',
      tanggal: '2026-10-22',
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      deskripsi: 'Momen khidmat penguatan mental, integritas, dan rasa persaudaraan fungsionaris LDKS.'
    },
    {
      id: 'gal_06',
      judul: 'Simulasi Tanggap Darurat & Manajemen Organisasi LDKS',
      kategori: 'LDKS',
      tanggal: '2026-10-23',
      url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
      deskripsi: 'Pembekalan tata kelola administrasi, etika kepemimpinan, dan mitigasi konflik organisasi.'
    },

    // Kategori: Porseni
    {
      id: 'gal_07',
      judul: 'Malam Puncak Pentas Seni OSSAGA FEST 2026',
      kategori: 'Porseni',
      tanggal: '2026-11-05',
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      deskripsi: 'Penampilan band kolaborasi siswa, tari kontemporer, dan bintang tamu di panggung megah utama.'
    },
    {
      id: 'gal_08',
      judul: 'Pertandingan Final Futsal & E-Sport SAGARA League',
      kategori: 'Porseni',
      tanggal: '2026-06-18',
      url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      deskripsi: 'Sorak sorai suporter kelas mendukung perwakilan tim kebanggaannya dalam ajang porseni antarkelas.'
    },
    {
      id: 'gal_09',
      judul: 'Pameran Karya Seni Rupa & Instalasi Kreatif Siswa',
      kategori: 'Porseni',
      tanggal: '2026-11-04',
      url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80',
      deskripsi: 'Eksplorasi karya lukis, fotografi, dan kerajinan tangan siswa SMAN 1 SAGARA dalam galeri seni.'
    }
  ]
};

// Database Service Object
const OssagaDB = {
  // Inisialisasi Database
  init: function() {
    let existing = null;
    try {
      existing = JSON.parse(localStorage.getItem(DB_KEY));
    } catch (e) {
      existing = null;
    }

    if (!existing) {
      localStorage.setItem(DB_KEY, JSON.stringify(defaultDatabase));
      console.log('OSSAGA DB: Database default berhasil diinisialisasi.');
    } else {
      // Auto-sinkronisasi data sekbid, galeri (kategori baru), dan proker
      let updated = false;

      // Sinkronisasi data Sekbid
      if (!existing.sekbid || existing.sekbid.length === 0) {
        existing.sekbid = defaultDatabase.sekbid;
        updated = true;
      }

      // Pastikan galeri memiliki foto kategori Kegiatan, LDKS, dan Porseni
      const hasLdks = existing.galeri && existing.galeri.some(g => (g.kategori || '').toLowerCase() === 'ldks');
      const hasPorseni = existing.galeri && existing.galeri.some(g => (g.kategori || '').toLowerCase() === 'porseni');
      const hasKegiatan = existing.galeri && existing.galeri.some(g => (g.kategori || '').toLowerCase() === 'kegiatan');
      
      if (!hasLdks || !hasPorseni || !hasKegiatan) {
        existing.galeri = defaultDatabase.galeri;
        updated = true;
      }

      // Pastikan proker memiliki status Rencana
      const hasRencana = existing.proker && existing.proker.some(p => (p.status || '').toLowerCase() === 'rencana');
      if (!hasRencana) {
        existing.proker = defaultDatabase.proker;
        updated = true;
      }

      if (updated) {
        localStorage.setItem(DB_KEY, JSON.stringify(existing));
        console.log('OSSAGA DB: Database berhasil disinkronisasi ke versi terbaru.');
      }
    }
  },

  // Ambil Seluruh Database
  getAllData: function() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(DB_KEY)) || defaultDatabase;
    } catch (e) {
      console.error('Gagal membaca database lokal:', e);
      return defaultDatabase;
    }
  },

  // Simpan Seluruh Database
  saveAllData: function(data) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Gagal menyimpan data ke database lokal:', e);
      return false;
    }
  },

  // Reset ke data awal pabrik
  resetToDefault: function() {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDatabase));
    return true;
  },

  // Ekspor Database ke format JSON
  exportJSON: function() {
    const data = this.getAllData();
    const str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", str);
    dlAnchor.setAttribute("download", `ossaga_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  },

  // Impor Database dari JSON
  importJSON: function(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.users && parsed.pengaturan && parsed.berita) {
        this.saveAllData(parsed);
        return { success: true, message: 'Database berhasil dipulihkan!' };
      }
      return { success: false, message: 'Format file JSON tidak valid.' };
    } catch (e) {
      return { success: false, message: 'Gagal membaca file JSON: ' + e.message };
    }
  },

  // ================= USERS & AUTENTIKASI =================
  getUsers: function() {
    return this.getAllData().users || [];
  },

  getAnggotaList: function() {
    return this.getUsers().filter(u => u.role === 'anggota');
  },

  getAnggotaCount: function() {
    return this.getAnggotaList().filter(u => u.status === 'aktif').length;
  },

  getMaxKuota: function() {
    const settings = this.getPengaturan();
    return settings.kuota_anggota || MAX_ANGGOTA_KUOTA;
  },

  // Login Function (NIS atau Username/Email + Password)
  login: function(identifier, password) {
    const users = this.getUsers();
    const cleanId = String(identifier).trim().toLowerCase();
    
    const user = users.find(u => {
      const matchNis = String(u.nis).trim().toLowerCase() === cleanId;
      const matchEmail = u.email && u.email.toLowerCase() === cleanId;
      const matchUser = u.username && u.username.toLowerCase() === cleanId;
      return (matchNis || matchEmail || matchUser) && u.password === password;
    });

    if (!user) {
      return { success: false, message: 'NIS / Username / Email atau password salah.' };
    }

    if (user.status !== 'aktif') {
      return { success: false, message: 'Akun Anda berstatus nonaktif atau sedang menunggu persetujuan.' };
    }

    // Set Session
    const sessionData = {
      id: user.id,
      nis: user.nis,
      nama: user.nama,
      role: user.role,
      kelas: user.kelas,
      jabatan: user.jabatan,
      avatar: user.avatar,
      loginAt: new Date().toISOString()
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData)); // backup persistent

    return { success: true, user: sessionData };
  },

  // Cek Session Aktif
  getCurrentUser: function() {
    try {
      const s = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  },

  // Logout
  logout: function() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  },

  // Pendaftaran Mandiri Anggota OSIS dengan NIS (Maksimal 30 Orang)
  registerAnggota: function(formData) {
    const db = this.getAllData();
    const cleanNis = String(formData.nis).trim();

    if (!cleanNis) {
      return { success: false, message: 'NIS wajib diisi!' };
    }

    // Cek apakah NIS sudah terdaftar
    const existing = db.users.find(u => String(u.nis).trim() === cleanNis);
    if (existing) {
      return { success: false, message: `NIS ${cleanNis} sudah terdaftar atas nama ${existing.nama}. Silakan login.` };
    }

    // Cek kuota 30 anggota aktif
    const activeAnggota = db.users.filter(u => u.role === 'anggota' && u.status === 'aktif');
    const maxKuota = this.getMaxKuota();

    if (activeAnggota.length >= maxKuota) {
      return {
        success: false,
        message: `Pendaftaran ditutup! Kuota 30 anggota OSIS periode ini sudah penuh (${activeAnggota.length}/${maxKuota}). Hubungi Super Admin atau Pembina.`
      };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      nis: cleanNis,
      nama: formData.nama.trim(),
      email: formData.email ? formData.email.trim() : `${cleanNis}@ossaga.sch.id`,
      role: 'anggota',
      kelas: formData.kelas || 'X',
      jabatan: formData.jabatan || 'Anggota Muda OSIS',
      telepon: formData.telepon || '-',
      password: formData.password || '123456',
      status: 'aktif', // Langsung aktif atau pending sesuai setting
      joined_at: new Date().toISOString(),
      avatar: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.nama)}&background=1e3a8a&color=fff&size=256`
    };

    db.users.push(newUser);
    this.saveAllData(db);

    return {
      success: true,
      message: `Pendaftaran berhasil! Selamat bergabung di OSSAGA. Nomor Anggota (${activeAnggota.length + 1}/${maxKuota}). Silakan login dengan NIS Anda.`,
      user: newUser
    };
  },

  // Super Admin / Admin: Tambah / Update / Hapus User
  saveUser: function(userData) {
    const db = this.getAllData();
    if (userData.id) {
      const idx = db.users.findIndex(u => u.id === userData.id);
      if (idx !== -1) {
        db.users[idx] = { ...db.users[idx], ...userData };
        this.saveAllData(db);
        return { success: true, message: 'Data user berhasil diperbarui' };
      }
    } else {
      // User Baru
      userData.id = 'usr_' + Date.now();
      if (!userData.joined_at) userData.joined_at = new Date().toISOString();
      db.users.push(userData);
      this.saveAllData(db);
      return { success: true, message: 'User baru berhasil ditambahkan' };
    }
  },

  deleteUser: function(userId) {
    const db = this.getAllData();
    const target = db.users.find(u => u.id === userId);
    if (!target) return { success: false, message: 'User tidak ditemukan' };
    if (target.role === 'superadmin') {
      return { success: false, message: 'Superadmin tidak boleh dihapus demi keamanan sistem!' };
    }
    db.users = db.users.filter(u => u.id !== userId);
    this.saveAllData(db);
    return { success: true, message: 'User berhasil dihapus' };
  },

  // ================= PENGATURAN =================
  getPengaturan: function() {
    return this.getAllData().pengaturan || defaultDatabase.pengaturan;
  },

  updatePengaturan: function(settings) {
    const db = this.getAllData();
    db.pengaturan = { ...db.pengaturan, ...settings };
    this.saveAllData(db);
    return { success: true, message: 'Pengaturan website berhasil disimpan!' };
  },

  // ================= BERITA =================
  getBerita: function(limit = null) {
    const b = this.getAllData().berita || [];
    b.sort((x, y) => new Date(y.tanggal) - new Date(x.tanggal));
    return limit ? b.slice(0, limit) : b;
  },

  getBeritaById: function(id) {
    return (this.getAllData().berita || []).find(item => item.id === id);
  },

  saveBerita: function(beritaData) {
    const db = this.getAllData();
    if (beritaData.id) {
      const idx = db.berita.findIndex(b => b.id === beritaData.id);
      if (idx !== -1) {
        db.berita[idx] = { ...db.berita[idx], ...beritaData };
      }
    } else {
      beritaData.id = 'brt_' + Date.now();
      if (!beritaData.tanggal) beritaData.tanggal = new Date().toISOString().slice(0, 10);
      beritaData.views = 1;
      db.berita.unshift(beritaData);
    }
    this.saveAllData(db);
    return { success: true, message: 'Berita berhasil disimpan' };
  },

  deleteBerita: function(id) {
    const db = this.getAllData();
    db.berita = db.berita.filter(b => b.id !== id);
    this.saveAllData(db);
    return { success: true, message: 'Berita berhasil dihapus' };
  },

  // ================= AGENDA =================
  getAgenda: function(limit = null) {
    const a = this.getAllData().agenda || [];
    a.sort((x, y) => new Date(x.tanggal) - new Date(y.tanggal));
    return limit ? a.slice(0, limit) : a;
  },

  saveAgenda: function(agendaData) {
    const db = this.getAllData();
    if (agendaData.id) {
      const idx = db.agenda.findIndex(a => a.id === agendaData.id);
      if (idx !== -1) {
        db.agenda[idx] = { ...db.agenda[idx], ...agendaData };
      }
    } else {
      agendaData.id = 'agd_' + Date.now();
      db.agenda.push(agendaData);
    }
    this.saveAllData(db);
    return { success: true, message: 'Agenda berhasil disimpan' };
  },

  deleteAgenda: function(id) {
    const db = this.getAllData();
    db.agenda = db.agenda.filter(a => a.id !== id);
    this.saveAllData(db);
    return { success: true, message: 'Agenda berhasil dihapus' };
  },

  // ================= PROKER =================
  getProker: function() {
    return this.getAllData().proker || [];
  },

  saveProker: function(prokerData) {
    const db = this.getAllData();
    if (prokerData.id) {
      const idx = db.proker.findIndex(p => p.id === prokerData.id);
      if (idx !== -1) {
        db.proker[idx] = { ...db.proker[idx], ...prokerData };
      }
    } else {
      prokerData.id = 'prk_' + Date.now();
      db.proker.push(prokerData);
    }
    this.saveAllData(db);
    return { success: true, message: 'Program kerja berhasil disimpan' };
  },

  deleteProker: function(id) {
    const db = this.getAllData();
    db.proker = db.proker.filter(p => p.id !== id);
    this.saveAllData(db);
    return { success: true, message: 'Program kerja berhasil dihapus' };
  },

  // ================= ASPIRASI (Publik kirim, Admin kelola) =================
  getAspirasi: function() {
    const a = this.getAllData().aspirasi || [];
    a.sort((x, y) => new Date(y.tanggal) - new Date(x.tanggal));
    return a;
  },

  submitAspirasi: function(aspData) {
    const db = this.getAllData();
    const newAsp = {
      id: 'asp_' + Date.now(),
      nama_pengirim: aspData.nama_pengirim || 'Siswa Tanpa Nama',
      kelas: aspData.kelas || 'Umum',
      kontak: aspData.kontak || '-',
      kategori: aspData.kategori || 'Umum',
      pesan: aspData.pesan,
      tanggal: new Date().toISOString().slice(0, 10),
      status: 'Menunggu',
      balasan: ''
    };
    db.aspirasi.unshift(newAsp);
    this.saveAllData(db);
    return { success: true, message: 'Aspirasi Anda berhasil dikirim! Terima kasih atas partisipasinya.' };
  },

  balasAspirasi: function(id, status, balasan) {
    const db = this.getAllData();
    const idx = db.aspirasi.findIndex(a => a.id === id);
    if (idx !== -1) {
      db.aspirasi[idx].status = status;
      db.aspirasi[idx].balasan = balasan;
      this.saveAllData(db);
      return { success: true, message: 'Status aspirasi diperbarui' };
    }
    return { success: false, message: 'Aspirasi tidak ditemukan' };
  },

  deleteAspirasi: function(id) {
    const db = this.getAllData();
    db.aspirasi = db.aspirasi.filter(a => a.id !== id);
    this.saveAllData(db);
    return { success: true, message: 'Aspirasi dihapus' };
  },

  // ================= NOTULENSI (Internal 30 Anggota & Admin) =================
  getNotulensi: function() {
    return this.getAllData().notulensi || [];
  },

  saveNotulensi: function(notulensiData) {
    const db = this.getAllData();
    if (notulensiData.id) {
      const idx = db.notulensi.findIndex(n => n.id === notulensiData.id);
      if (idx !== -1) {
        db.notulensi[idx] = { ...db.notulensi[idx], ...notulensiData };
      }
    } else {
      notulensiData.id = 'not_' + Date.now();
      if (!notulensiData.tanggal) notulensiData.tanggal = new Date().toISOString().slice(0, 10);
      db.notulensi.unshift(notulensiData);
    }
    this.saveAllData(db);
    return { success: true, message: 'Notulensi rapat berhasil disimpan' };
  },

  deleteNotulensi: function(id) {
    const db = this.getAllData();
    db.notulensi = db.notulensi.filter(n => n.id !== id);
    this.saveAllData(db);
    return { success: true, message: 'Notulensi rapat berhasil dihapus' };
  },

  // ================= PRESENSI INTERNAL =================
  getPresensi: function() {
    return this.getAllData().presensi || [];
  },

  catatPresensi: function(presensiData) {
    const db = this.getAllData();
    const now = new Date();
    const newPrs = {
      id: 'prs_' + Date.now(),
      agenda_id: presensiData.agenda_id || 'agd_umum',
      agenda_judul: presensiData.agenda_judul || 'Kegiatan Rutin OSIS',
      tanggal: now.toISOString().slice(0, 10),
      user_id: presensiData.user_id,
      nis: presensiData.nis,
      nama: presensiData.nama,
      waktu: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      status: presensiData.status || 'Hadir',
      keterangan: presensiData.keterangan || '-'
    };
    db.presensi.unshift(newPrs);
    this.saveAllData(db);
    return { success: true, message: 'Presensi berhasil dicatat!', presensi: newPrs };
  },

  // ================= GALERI =================
  getGaleri: function() {
    return this.getAllData().galeri || [];
  },

  saveGaleri: function(item) {
    const db = this.getAllData();
    if (item.id) {
      const idx = db.galeri.findIndex(g => g.id === item.id);
      if (idx !== -1) db.galeri[idx] = { ...db.galeri[idx], ...item };
    } else {
      item.id = 'gal_' + Date.now();
      db.galeri.unshift(item);
    }
    this.saveAllData(db);
    return { success: true, message: 'Foto galeri berhasil disimpan' };
  },

  deleteGaleri: function(id) {
    const db = this.getAllData();
    db.galeri = db.galeri.filter(g => g.id !== id);
    this.saveAllData(db);
    return { success: true, message: 'Foto galeri berhasil dihapus' };
  },

  // ================= 10 SEKSI BIDANG (SEKBID) =================
  getSekbid: function() {
    return this.getAllData().sekbid || defaultDatabase.sekbid || [];
  },

  getSekbidByNomor: function(nomor) {
    const list = this.getSekbid();
    return list.find(s => s.nomor === nomor) || null;
  }
};

// Inisialisasi awal saat skrip dimuat
OssagaDB.init();
