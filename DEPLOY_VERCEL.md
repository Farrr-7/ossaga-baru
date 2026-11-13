# PANDUAN DEPLOY WEBSITE OSSAGA KE VERCEL

Website **OSSAGA (OSIS SMA Negeri 1 SAGARA)** telah dirancang dengan arsitektur **Zero-Backend Client Engine (`db.js`)**. Seluruh fungsionalitas:
- Multi-tier login (1 Superadmin, Admin Sekbid, 30 Anggota Pengurus via NIS)
- Sistem Presensi Rapat & Unduh Rekap CSV
- Notulensi Digital dengan Filter
- Manajemen CRUD Program Kerja (Proker) & Progress Tracker
- Publikasi Berita/Warta & Manajemen Agenda
- Kotak Aspirasi Siswa Terbuka
- Kartu Tanda Anggota (KTA) Digital

Berjalan **100% fungsional, cepat, dan aman** di platform hosting statis global seperti **Vercel** tanpa memerlukan server Apache atau runtime PHP.

---

## 3 METODE MUDAH DEPLOY KE VERCEL

### METODE 1: DEPLOY VIA GITHUB (Sangat Direkomendasikan)
Metode ini adalah standar industri dan paling praktis karena website akan otomatis ter-update setiap kali ada perubahan kode.

1. **Buat Repository di GitHub**:
   - Buka [GitHub.com](https://github.com) dan login ke akun Anda.
   - Buat repository baru, misalnya bernama `ossaga-portal` (pilih *Public* atau *Private*).
2. **Push Folder Proyek ke GitHub**:
   Buka terminal di folder proyek (`C:\xampp\htdocs\ossaga` atau folder Downloads) lalu jalankan:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - OSSAGA Bespoke Portal"
   git branch -M main
   git remote add origin https://github.com/USERNAME-ANDA/ossaga-portal.git
   git push -u origin main
   ```
3. **Import ke Vercel**:
   - Masuk ke [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
   - Klik tombol **"Add New..."** lalu pilih **"Project"**.
   - Pilih repository `ossaga-portal` yang baru dibuat, lalu klik **"Import"**.
   - Pada bagian **Build and Output Settings**, biarkan default (karena OSSAGA adalah project statis HTML/CSS/JS murni).
   - Klik tombol **"Deploy"**.
   - Dalam hitungan 15-30 detik, website OSSAGA Anda sudah live dengan URL publik (contoh: `https://ossaga-portal.vercel.app`)!

---

### METODE 2: DEPLOY CEPAT VIA VERCEL CLI
Jika Anda memiliki Node.js terinstal di komputer, Anda bisa deploy langsung dari terminal dalam 1 langkah tanpa git:

1. Buka PowerShell atau Command Prompt di folder proyek:
   ```bash
   cd C:\xampp\htdocs\ossaga
   ```
2. Jalankan perintah Vercel CLI:
   ```bash
   npx vercel
   ```
3. Ikuti petunjuk interaktif di layar:
   - *Set up and deploy?* Ketik `y` lalu Enter.
   - *Which scope?* Pilih akun Vercel Anda.
   - *Link to existing project?* Ketik `n` (jika proyek baru).
   - *What's your project's name?* Ketik `ossaga-portal` lalu Enter.
   - *In which directory is your code located?* Ketik `./` lalu Enter.
4. Tunggu beberapa detik, URL deployment instan akan langsung muncul di terminal.
5. Untuk deploy ke production domain, jalankan:
   ```bash
   npx vercel --prod
   ```

---

### METODE 3: DEPLOY VIA DRAG & DROP (VERCEL DASHBOARD)
Bagi pengguna yang tidak ingin menggunakan terminal atau git:

1. Buka dashboard Vercel di browser: [vercel.com/dashboard](https://vercel.com/dashboard).
2. Klik tombol **"Add New..."** -> **"Project"**.
3. Di bagian bawah import Git, terdapat opsi **"Deploy a Project"** atau kunjungi [vercel.com/new](https://vercel.com/new).
4. Kompres folder OSSAGA menjadi format `.zip`, atau seret (drag-and-drop) folder `C:\xampp\htdocs\ossaga` langsung ke area upload Vercel.
5. Vercel akan otomatis mendeteksi konfigurasi `vercel.json` dan mempublikasikan situs.

---

## KONFIGURASI `vercel.json` YANG DISERTAKAN

Proyek ini telah dilengkapi file `vercel.json` otomatis dengan pengaturan:
1. **Clean URLs (`cleanUrls: true`)**: Mengizinkan URL tanpa ekstensi `.html` (misal: `/admin` langsung membuka halaman portal admin).
2. **URL Aliases & Rewrites**:
   - `/` -> `/index.html` (Halaman Publik Utama)
   - `/admin` -> `/admin/index.html` (Dashboard Fungsionaris & Admin)
   - `/login` -> `/auth/login.html` (Login NIS & Admin)
   - `/register` -> `/auth/register.html` (Pendaftaran Mandiri Anggota)
   - `/index.php` -> `/index.html` (Kompatibilitas redirect link lama)
3. **Security Headers**: Dilengkapi header proteksi XSS, Clickjacking, dan MIME-sniffing.
4. **Asset Caching**: Cache jangka panjang untuk file gambar, font, dan stylesheet agar loading situs secepat kilat.

---

## KREDENSIAL BAWAAN SISTEM (UNTUK UJI COBA)

Sistem database OSSAGA telah diinisialisasi dengan akun awal:

| Peran (Role) | Username / NIS | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **1 Superadmin** | `superadmin` / `SA001` | `superadmin123` | Akses penuh manajemen sistem, data anggota, pengaturan, reset database |
| **Admin Pembina** | `pembina` / `ADM001` | `admin123` | Kelola berita, agenda, proker, notulensi, persetujuan aspirasi |
| **Admin Ketua OSIS** | `ketua` / `23241001` | `admin123` | Kelola berita, agenda, proker, aspirasi |
| **Anggota OSIS (NIS)** | `23241002` (Wakil Ketua) | `anggota123` | Portal internal, KTA digital, presensi rapat, notulensi internal |
| **Anggota OSIS (NIS)** | `23241003` (Sekretaris) | `anggota123` | Portal internal, KTA digital, presensi rapat, notulensi internal |
| **Publik / Siswa Umum** | *Tanpa Akun* | *Tanpa Password* | Bebas membaca profil, visi-misi, pimpinan, warta, proker, dan kirim aspirasi |

*Catatan: Siswa lain dapat mendaftar mandiri secara online melalui halaman Registrasi hingga batas kuota 30 fungsionaris terpenuhi.*
