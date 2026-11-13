<?php
/**
 * REST API OSSAGA (PHP Native + MySQL PDO)
 * Keamanan:
 * - password_hash() (BCRYPT) & password_verify()
 * - Prepared Statements (Anti SQL Injection)
 * - PHP Session Authentication & session_regenerate_id(true)
 * - Validasi Kuota 30 Fungsionaris (NIS)
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config.php';

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

switch ($action) {
    // ================= 1. LOGIN KEAMANAN TINGGI =================
    case 'login':
        $identifier = trim($input['identifier'] ?? '');
        $password = $input['password'] ?? '';

        if (!$identifier || !$password) {
            echo json_encode(['success' => false, 'message' => 'NIS/Username dan kata sandi wajib diisi!']);
            exit;
        }

        // Cari user berdasarkan NIS, username, atau email
        $stmt = $pdo->prepare("SELECT * FROM users WHERE (nis = ? OR username = ? OR email = ?) LIMIT 1");
        $stmt->execute([$identifier, $identifier, $identifier]);
        $user = $stmt->fetch();

        if ($user) {
            $isPasswordValid = false;

            // 1. Cek apakah password tersimpan dalam bentuk Bcrypt Hash
            if (password_verify($password, $user['password'])) {
                $isPasswordValid = true;
            } elseif ($password === $user['password']) {
                // 2. Jika password lama masih plain-text, lakukan auto-upgrade ke Bcrypt Hash
                $isPasswordValid = true;
                $newHash = password_hash($password, PASSWORD_BCRYPT);
                $updateHash = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                $updateHash->execute([$newHash, $user['id']]);
            }

            if ($isPasswordValid) {
                if ($user['status'] !== 'aktif') {
                    echo json_encode(['success' => false, 'message' => 'Akun berstatus nonaktif atau menunggu persetujuan.']);
                    exit;
                }

                // Session Regeneration untuk mencegah Session Fixation
                session_regenerate_id(true);
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['nis'] = $user['nis'];
                $_SESSION['role'] = $user['role'];
                $_SESSION['nama'] = $user['nama'];
                $_SESSION['logged_in'] = true;

                unset($user['password']); // Hapus hash dari output response
                echo json_encode([
                    'success' => true,
                    'message' => 'Login berhasil!',
                    'user' => $user
                ]);
                exit;
            }
        }

        echo json_encode(['success' => false, 'message' => 'Nomor NIS/Username atau kata sandi tidak cocok!']);
        break;

    // ================= 2. REGISTER ANGGOTA MANDIRI (KUOTA 30) =================
    case 'register':
        $nis = trim($input['nis'] ?? '');
        $nama = trim($input['nama'] ?? '');
        $kelas = trim($input['kelas'] ?? '');
        $jabatan = trim($input['jabatan'] ?? '');
        $telepon = trim($input['telepon'] ?? '');
        $email = trim($input['email'] ?? ($nis . '@ossaga.sch.id'));
        $password = $input['password'] ?? '';

        if (!$nis || !$nama || !$kelas || !$password) {
            echo json_encode(['success' => false, 'message' => 'Seluruh kolom bertanda wajib tidak boleh kosong!']);
            exit;
        }

        if (strlen($password) < 6) {
            echo json_encode(['success' => false, 'message' => 'Kata sandi minimal 6 karakter demi keamanan!']);
            exit;
        }

        // Cek duplikasi NIS
        $checkStmt = $pdo->prepare("SELECT id FROM users WHERE nis = ?");
        $checkStmt->execute([$nis]);
        if ($checkStmt->fetch()) {
            echo json_encode(['success' => false, 'message' => "NIS $nis sudah terdaftar di sistem!"]);
            exit;
        }

        // Validasi Kuota 30 Fungsionaris
        $quotaStmt = $pdo->query("SELECT COUNT(*) AS total FROM users WHERE role = 'anggota' AND status = 'aktif'");
        $currentCount = (int)$quotaStmt->fetch()['total'];

        $setStmt = $pdo->query("SELECT kuota_anggota FROM pengaturan LIMIT 1");
        $maxQuota = (int)($setStmt->fetch()['kuota_anggota'] ?? 30);

        if ($currentCount >= $maxQuota) {
            echo json_encode([
                'success' => false,
                'message' => "Pendaftaran ditutup! Kuota $maxQuota fungsionaris OSIS periode ini telah terpenuhi."
            ]);
            exit;
        }

        // Hash Password menggunakan Bcrypt
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $avatar = "https://ui-avatars.com/api/?name=" . urlencode($nama) . "&background=0A192F&color=60A5FA";

        $insert = $pdo->prepare("INSERT INTO users (nis, nama, email, role, kelas, jabatan, telepon, password, status, avatar) VALUES (?, ?, ?, 'anggota', ?, ?, ?, ?, 'aktif', ?)");
        $insert->execute([$nis, $nama, $email, $kelas, $jabatan, $telepon, $hashedPassword, $avatar]);

        echo json_encode([
            'success' => true,
            'message' => "Pendaftaran berhasil! Nomor Urut Anggota (" . ($currentCount + 1) . "/$maxQuota). Silakan login menggunakan NIS Anda.",
            'nis' => $nis
        ]);
        break;

    // ================= 3. CEK SESI AUTENTIKASI =================
    case 'check_session':
        if (!empty($_SESSION['logged_in']) && !empty($_SESSION['user_id'])) {
            $stmt = $pdo->prepare("SELECT id, nis, nama, email, role, kelas, jabatan, avatar, status FROM users WHERE id = ? LIMIT 1");
            $stmt->execute([$_SESSION['user_id']]);
            $user = $stmt->fetch();
            if ($user && $user['status'] === 'aktif') {
                echo json_encode(['authenticated' => true, 'user' => $user]);
                exit;
            }
        }
        echo json_encode(['authenticated' => false]);
        break;

    // ================= 4. LOGOUT AMAN =================
    case 'logout':
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Anda telah berhasil keluar dari sesi.']);
        break;

    // ================= 5. DATA PUBLIK =================
    case 'get_public_data':
        $pengaturan = $pdo->query("SELECT * FROM pengaturan LIMIT 1")->fetch();
        $berita = $pdo->query("SELECT * FROM berita ORDER BY tanggal DESC LIMIT 6")->fetchAll();
        $agenda = $pdo->query("SELECT * FROM agenda ORDER BY tanggal ASC LIMIT 6")->fetchAll();
        $proker = $pdo->query("SELECT * FROM proker ORDER BY target_tanggal ASC")->fetchAll();
        $galeri = $pdo->query("SELECT * FROM galeri ORDER BY id DESC LIMIT 9")->fetchAll();
        $aspirasi = $pdo->query("SELECT * FROM aspirasi ORDER BY tanggal DESC LIMIT 6")->fetchAll();
        
        $anggotaCount = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'anggota' AND status = 'aktif'")->fetchColumn();

        echo json_encode([
            'success' => true,
            'pengaturan' => $pengaturan,
            'berita' => $berita,
            'agenda' => $agenda,
            'proker' => $proker,
            'galeri' => $galeri,
            'aspirasi' => $aspirasi,
            'anggota_count' => $anggotaCount,
            'max_quota' => (int)($pengaturan['kuota_anggota'] ?? 30)
        ]);
        break;

    // ================= 6. KIRIM ASPIRASI PUBLIK =================
    case 'submit_aspirasi':
        $nama = trim($input['nama_pengirim'] ?? 'Siswa Anonim');
        $kelas = trim($input['kelas'] ?? 'Umum');
        $kontak = trim($input['kontak'] ?? '-');
        $kategori = trim($input['kategori'] ?? 'Umum');
        $pesan = trim($input['pesan'] ?? '');

        if (!$pesan) {
            echo json_encode(['success' => false, 'message' => 'Pesan aspirasi tidak boleh kosong!']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO aspirasi (nama_pengirim, kelas, kontak, kategori, pesan, status) VALUES (?, ?, ?, ?, ?, 'Menunggu')");
        $stmt->execute([$nama, $kelas, $kontak, $kategori, $pesan]);

        echo json_encode(['success' => true, 'message' => 'Aspirasi Anda berhasil dikirim ke pengurus OSIS!']);
        break;

    // ================= 7. PRESENSI MANDIRI ANGGOTA =================
    case 'submit_presensi':
        $nis = trim($input['nis'] ?? '');
        $nama = trim($input['nama'] ?? '');
        $agenda = trim($input['agenda_judul'] ?? 'Rapat Pleno OSIS');
        $status = trim($input['status'] ?? 'Hadir');
        $keterangan = trim($input['keterangan'] ?? '-');
        $waktu = date('H:i') . ' WIB';
        $tanggal = date('Y-m-d');

        $stmt = $pdo->prepare("INSERT INTO presensi (nis, nama, agenda_judul, tanggal, waktu, status, keterangan) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$nis, $nama, $agenda, $tanggal, $waktu, $status, $keterangan]);

        echo json_encode(['success' => true, 'message' => 'Presensi berhasil dicatat secara resmi!']);
        break;

    default:
        echo json_encode([
            'status' => 'online',
            'api' => 'OSSAGA Secure API v2.0',
            'security' => 'Bcrypt Hashes, Prepared Statements, Session Protection',
            'endpoints' => ['login', 'register', 'check_session', 'logout', 'get_public_data', 'submit_aspirasi', 'submit_presensi']
        ]);
        break;
}
