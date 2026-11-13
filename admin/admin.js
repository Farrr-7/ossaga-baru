/**
 * OSSAGA - Admin & Member Dashboard Controller
 * Mengatur otorisasi berbasis role (Superadmin, Admin, Anggota OSIS via NIS),
 * interaksi CRUD untuk semua entitas, presensi mandiri, notulensi internal,
 * dan kartu anggota digital.
 */

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Cek Autentikasi Pengguna
  currentUser = OssagaDB.getCurrentUser();
  if (!currentUser) {
    alert('Akses ditolak. Silakan login terlebih dahulu untuk mengakses portal ini.');
    window.location.href = '../auth/login.html';
    return;
  }

  // 2. Terapkan Izin Akses Berdasarkan Role
  applyRolePermissions();

  // 3. Render Info Topbar & Profil Pengguna
  renderUserProfile();

  // 4. Render Tab Aktif Pertama (Overview)
  renderOverview();

  // 5. Setup Event Listener Navigasi Menu Sidebar
  setupSidebarNavigation();
});

// ================= PERMISSION & ROLE SETUP =================
function applyRolePermissions() {
  const role = currentUser.role;

  // Elemen-elemen yang hanya boleh diakses Superadmin
  const superadminOnlyEls = document.querySelectorAll('.superadmin-only');
  superadminOnlyEls.forEach(el => {
    el.style.display = (role === 'superadmin') ? '' : 'none';
  });

  // Elemen-elemen yang boleh diakses Superadmin & Admin
  const adminOnlyEls = document.querySelectorAll('.admin-only');
  adminOnlyEls.forEach(el => {
    el.style.display = (role === 'superadmin' || role === 'admin') ? '' : 'none';
  });

  // Label badge role di header
  const roleBadge = document.getElementById('topbar-role-badge');
  if (roleBadge) {
    if (role === 'superadmin') {
      roleBadge.className = 'badge badge-gold';
      roleBadge.innerHTML = '<span class="badge-dot"></span> Super Administrator';
    } else if (role === 'admin') {
      roleBadge.className = 'badge badge-primary';
      roleBadge.innerHTML = '<span class="badge-dot"></span> Admin Pengurus';
    } else {
      roleBadge.className = 'badge badge-success';
      roleBadge.innerHTML = '<span class="badge-dot"></span> Fungsionaris (NIS)';
    }
  }
}

function renderUserProfile() {
  document.getElementById('topbar-user-name').textContent = currentUser.nama;
  document.getElementById('topbar-user-nis').textContent = `NIS: ${currentUser.nis} • ${currentUser.kelas || ''}`;
  const avatarEl = document.getElementById('topbar-user-avatar');
  if (avatarEl && currentUser.avatar) {
    avatarEl.src = currentUser.avatar;
  }
}

// ================= SIDEBAR NAVIGATION =================
function setupSidebarNavigation() {
  const menuLinks = document.querySelectorAll('.sidebar-item a');
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute('data-tab');
      if (!targetTab) return;

      // Update Active Menu
      document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
      link.parentElement.classList.add('active');

      // Tampilkan Tab
      switchTab(targetTab);
    });
  });

  // Mobile Toggle
  const mobToggle = document.getElementById('admin-sidebar-toggle');
  const sidebar = document.querySelector('.admin-sidebar');
  if (mobToggle && sidebar) {
    mobToggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });
  }
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
  const activeSec = document.getElementById(`tab-${tabId}`);
  if (activeSec) {
    activeSec.classList.add('active');
  }

  // Panggil renderer khusus per tab
  if (tabId === 'overview') renderOverview();
  if (tabId === 'anggota') renderAnggotaTable();
  if (tabId === 'notulensi') renderNotulensiList();
  if (tabId === 'presensi') renderPresensiTab();
  if (tabId === 'berita') renderBeritaTable();
  if (tabId === 'agenda') renderAgendaTable();
  if (tabId === 'proker') renderProkerTable();
  if (tabId === 'galeri-admin') renderGaleriAdmin();
  if (tabId === 'aspirasi') renderAspirasiTable();
  if (tabId === 'kta') renderKTADigital();
  if (tabId === 'pengaturan') renderPengaturanForm();
}

// ================= 1. TAB OVERVIEW =================
function renderOverview() {
  const users = OssagaDB.getUsers();
  const anggota = users.filter(u => u.role === 'anggota' && u.status === 'aktif');
  const maxQuota = OssagaDB.getMaxKuota();
  const berita = OssagaDB.getBerita();
  const proker = OssagaDB.getProker();
  const aspirasi = OssagaDB.getAspirasi();

  document.getElementById('stat-anggota-count').textContent = `${anggota.length} / ${maxQuota}`;
  document.getElementById('stat-proker-count').textContent = proker.length;
  document.getElementById('stat-berita-count').textContent = berita.length;
  document.getElementById('stat-aspirasi-count').textContent = aspirasi.filter(a => a.status === 'Menunggu').length;

  // Banner Sambutan Dashboard
  const welcomeText = document.getElementById('dashboard-welcome-text');
  if (welcomeText) {
    welcomeText.textContent = `Selamat datang kembali, ${currentUser.nama}. Anda masuk dengan peran ${currentUser.role.toUpperCase()} (NIS: ${currentUser.nis}).`;
  }

  // Notifikasi Presensi Cepat untuk Anggota
  const quickPresensiBox = document.getElementById('quick-presensi-box');
  if (quickPresensiBox) {
    if (currentUser.role === 'anggota') {
      quickPresensiBox.style.display = 'block';
    } else {
      quickPresensiBox.style.display = 'none';
    }
  }

  // Proker Berjalan
  const listOngoing = document.getElementById('overview-proker-list');
  if (listOngoing) {
    listOngoing.innerHTML = proker.slice(0, 4).map(p => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: rgba(10, 25, 47, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); margin-bottom: 10px;">
        <div>
          <div style="font-weight: 700; font-size: 0.95rem; color: var(--white);">${p.nama}</div>
          <div style="font-size: 0.8rem; color: var(--light-blue); margin-top: 3px;">${p.sekbid} • Target: ${formatTanggal(p.target_tanggal)}</div>
        </div>
        <span class="badge ${p.status === 'Terlaksana' ? 'badge-success' : 'badge-primary'}">${p.progress}%</span>
      </div>
    `).join('');
  }
}

// ================= 2. TAB DATA 30 ANGGOTA OSIS =================
function renderAnggotaTable() {
  const tbody = document.getElementById('anggota-table-body');
  if (!tbody) return;

  const users = OssagaDB.getUsers();
  const anggotaList = users.filter(u => u.role === 'anggota');
  const activeCount = anggotaList.filter(u => u.status === 'aktif').length;
  const maxQuota = OssagaDB.getMaxKuota();

  const quotaInfo = document.getElementById('anggota-quota-summary');
  if (quotaInfo) {
    quotaInfo.textContent = `Status: ${activeCount} dari ${maxQuota} Fungsionaris Terisi (${maxQuota - activeCount} Kursi Kosong)`;
  }

  tbody.innerHTML = anggotaList.map((u, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${u.avatar}" alt="" style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-electric);">
          <div>
            <strong style="color: var(--white);">${u.nama}</strong>
            <div style="font-size: 0.75rem; color: var(--text-dim);">${u.email || '-'}</div>
          </div>
        </div>
      </td>
      <td><span class="badge badge-primary">NIS: ${u.nis}</span></td>
      <td>${u.kelas}</td>
      <td>${u.jabatan}</td>
      <td>${u.telepon}</td>
      <td>
        <span class="badge ${u.status === 'aktif' ? 'badge-success' : 'badge-danger'}">
          ${u.status}
        </span>
      </td>
      <td>
        ${currentUser.role === 'superadmin' || currentUser.role === 'admin' ? `
          <button class="btn btn-secondary btn-sm" onclick="editUser('${u.id}')">Edit</button>
          ${currentUser.role === 'superadmin' ? `
            <button class="btn btn-secondary btn-sm" style="color: #ef4444;" onclick="deleteUserPrompt('${u.id}')">Hapus</button>
          ` : ''}
        ` : `<span style="font-size: 0.8rem; color: var(--text-dim);">Lihat Saja</span>`}
      </td>
    </tr>
  `).join('');
}

// Tambah / Edit User Modal
function openUserModal(isEdit = false, userData = null) {
  const modal = document.getElementById('admin-modal');
  const title = document.getElementById('admin-modal-title');
  const body = document.getElementById('admin-modal-body');

  title.textContent = isEdit ? 'Perbarui Data Fungsionaris' : 'Registrasi Anggota Baru';
  body.innerHTML = `
    <form id="form-manage-user" onsubmit="handleSaveUser(event)">
      <input type="hidden" id="user-m-id" value="${userData ? userData.id : ''}">
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">NIS (Wajib)*</label>
          <input type="text" id="user-m-nis" class="form-control" value="${userData ? userData.nis : ''}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Role Akses*</label>
          <select id="user-m-role" class="form-control" ${currentUser.role !== 'superadmin' ? 'disabled' : ''}>
            <option value="anggota" ${userData && userData.role === 'anggota' ? 'selected' : ''}>Anggota OSIS (Maks 30)</option>
            <option value="admin" ${userData && userData.role === 'admin' ? 'selected' : ''}>Admin Pengurus</option>
            <option value="superadmin" ${userData && userData.role === 'superadmin' ? 'selected' : ''}>Super Administrator</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Nama Lengkap*</label>
        <input type="text" id="user-m-nama" class="form-control" value="${userData ? userData.nama : ''}" required>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Kelas*</label>
          <input type="text" id="user-m-kelas" class="form-control" value="${userData ? userData.kelas : 'XI'}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Jabatan / Sekbid*</label>
          <input type="text" id="user-m-jabatan" class="form-control" value="${userData ? userData.jabatan : 'Anggota Sekbid'}" required>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Nomor WhatsApp</label>
          <input type="text" id="user-m-wa" class="form-control" value="${userData ? userData.telepon : ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Kata Sandi Akun*</label>
          <input type="text" id="user-m-pass" class="form-control" value="${userData ? userData.password : '123456'}" required>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Status Keaktifan</label>
        <select id="user-m-status" class="form-control">
          <option value="aktif" ${userData && userData.status === 'aktif' ? 'selected' : ''}>Aktif</option>
          <option value="nonaktif" ${userData && userData.status === 'nonaktif' ? 'selected' : ''}>Nonaktif</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
        Simpan Data Pengguna
      </button>
    </form>
  `;

  modal.classList.add('active');
}

function editUser(userId) {
  const user = OssagaDB.getUsers().find(u => u.id === userId);
  if (user) openUserModal(true, user);
}

function handleSaveUser(e) {
  e.preventDefault();
  const id = document.getElementById('user-m-id').value;
  const nis = document.getElementById('user-m-nis').value.trim();
  const role = document.getElementById('user-m-role').value;
  const nama = document.getElementById('user-m-nama').value.trim();
  const kelas = document.getElementById('user-m-kelas').value.trim();
  const jabatan = document.getElementById('user-m-jabatan').value.trim();
  const telepon = document.getElementById('user-m-wa').value.trim();
  const pass = document.getElementById('user-m-pass').value;
  const status = document.getElementById('user-m-status').value;

  const payload = {
    nis, role, nama, kelas, jabatan, telepon, password: pass, status
  };
  if (id) payload.id = id;

  const res = OssagaDB.saveUser(payload);
  showToast(res.message, 'success');
  closeAdminModal();
  renderAnggotaTable();
}

function deleteUserPrompt(userId) {
  if (confirm('Yakin ingin menghapus pengguna ini dari database?')) {
    const res = OssagaDB.deleteUser(userId);
    if (res.success) {
      showToast(res.message, 'success');
      renderAnggotaTable();
    } else {
      showToast(res.message, 'error');
    }
  }
}

// ================= 3. TAB NOTULENSI RAPAT INTERNAL =================
function renderNotulensiList() {
  const container = document.getElementById('notulensi-container');
  if (!container) return;

  const list = OssagaDB.getNotulensi();
  if (list.length === 0) {
    container.innerHTML = '<p class="text-muted">Belum ada arsip notulensi rapat.</p>';
    return;
  }

  container.innerHTML = list.map(n => `
    <div class="card" style="margin-bottom: 20px; border-left: 4px solid var(--electric-blue);">
      <div class="card-body">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <span class="badge badge-primary"><span class="badge-dot"></span> Rapat Pengurus OSIS</span>
            <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: 8px;">
              <svg class="icon-svg" viewBox="0 0 24 24" style="width: 14px; height: 14px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${formatTanggal(n.tanggal)}
            </span>
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-top: 6px; color: var(--white);">${n.judul}</h3>
          </div>
          <span class="badge badge-success">${n.status || 'Disahkan'}</span>
        </div>

        <div style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;">
          <strong>Pimpinan Rapat:</strong> ${n.pimpinan} • <strong>Notulis/Sekretaris:</strong> ${n.sekretaris} • <strong>Kehadiran:</strong> ${n.peserta_hadir || '30'} Fungsionaris
        </div>

        <div style="background: rgba(10, 25, 47, 0.6); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 14px; margin-bottom: 12px; font-size: 0.92rem;">
          <strong style="color: var(--light-blue);">Poin Keputusan Rapat:</strong>
          <p style="white-space: pre-line; margin-top: 6px; color: #e2e8f0;">${n.keputusan}</p>
        </div>

        ${currentUser.role === 'superadmin' || currentUser.role === 'admin' ? `
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button class="btn btn-secondary btn-sm" onclick="editNotulensi('${n.id}')">Edit</button>
            <button class="btn btn-secondary btn-sm" style="color: #ef4444;" onclick="deleteNotulensiPrompt('${n.id}')">Hapus</button>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function openNotulensiModal(isEdit = false, data = null) {
  const modal = document.getElementById('admin-modal');
  const title = document.getElementById('admin-modal-title');
  const body = document.getElementById('admin-modal-body');

  title.textContent = isEdit ? 'Perbarui Notulensi Rapat' : 'Catat Notulensi Rapat Baru';
  body.innerHTML = `
    <form id="form-notulensi" onsubmit="handleSaveNotulensi(event)">
      <input type="hidden" id="not-id" value="${data ? data.id : ''}">
      <div class="form-group">
        <label class="form-label">Judul Agenda Rapat*</label>
        <input type="text" id="not-judul" class="form-control" value="${data ? data.judul : ''}" required>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Tanggal Pelaksanaan*</label>
          <input type="date" id="not-tanggal" class="form-control" value="${data ? data.tanggal : new Date().toISOString().slice(0, 10)}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Jumlah Fungsionaris Hadir</label>
          <input type="number" id="not-hadir" class="form-control" value="${data ? data.peserta_hadir : '30'}" max="30">
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Pimpinan Rapat*</label>
          <input type="text" id="not-pimpinan" class="form-control" value="${data ? data.pimpinan : currentUser.nama}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Sekretaris / Notulis*</label>
          <input type="text" id="not-sekretaris" class="form-control" value="${data ? data.sekretaris : 'Sekretaris 1'}" required>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Keputusan & Poin Kesepakatan Sidang*</label>
        <textarea id="not-keputusan" class="form-control" style="min-height: 120px;" required>${data ? data.keputusan : ''}</textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width: 100%;">Simpan Notulensi Kedinasan</button>
    </form>
  `;
  modal.classList.add('active');
}

function editNotulensi(id) {
  const not = OssagaDB.getNotulensi().find(n => n.id === id);
  if (not) openNotulensiModal(true, not);
}

function handleSaveNotulensi(e) {
  e.preventDefault();
  const id = document.getElementById('not-id').value;
  const judul = document.getElementById('not-judul').value.trim();
  const tanggal = document.getElementById('not-tanggal').value;
  const peserta_hadir = document.getElementById('not-hadir').value;
  const pimpinan = document.getElementById('not-pimpinan').value.trim();
  const sekretaris = document.getElementById('not-sekretaris').value.trim();
  const keputusan = document.getElementById('not-keputusan').value.trim();

  const payload = { judul, tanggal, peserta_hadir, pimpinan, sekretaris, keputusan };
  if (id) payload.id = id;

  const res = OssagaDB.saveNotulensi(payload);
  showToast(res.message, 'success');
  closeAdminModal();
  renderNotulensiList();
}

function deleteNotulensiPrompt(id) {
  if (confirm('Hapus notulensi rapat ini?')) {
    OssagaDB.deleteNotulensi(id);
    showToast('Notulensi berhasil dihapus');
    renderNotulensiList();
  }
}

// ================= 4. TAB PRESENSI KEGIATAN INTERNAL =================
function renderPresensiTab() {
  const tbody = document.getElementById('presensi-table-body');
  if (!tbody) return;

  const list = OssagaDB.getPresensi();
  tbody.innerHTML = list.map((p, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><strong>${p.nama}</strong><br><small style="color: var(--light-blue);">NIS: ${p.nis}</small></td>
      <td>${p.agenda_judul}</td>
      <td>${p.tanggal}</td>
      <td>${p.waktu}</td>
      <td>
        <span class="badge ${p.status === 'Hadir' ? 'badge-success' : 'badge-warning'}">
          ${p.status}
        </span>
      </td>
      <td>${p.keterangan || '-'}</td>
    </tr>
  `).join('');
}

// Tombol Absen Cepat Anggota OSIS (Menggunakan NIS login saat ini)
function submitAbsenMandiri(status = 'Hadir') {
  const agendaList = OssagaDB.getAgenda();
  const agendaJudul = agendaList.length > 0 ? agendaList[0].judul : 'Kegiatan Rutin OSIS';

  const res = OssagaDB.catatPresensi({
    agenda_judul: agendaJudul,
    user_id: currentUser.id,
    nis: currentUser.nis,
    nama: currentUser.nama,
    status: status,
    keterangan: 'Presensi mandiri via portal website'
  });

  if (res.success) {
    showToast(`Presensi berhasil diverifikasi: ${currentUser.nama} (${status})`, 'success');
    renderPresensiTab();
    renderOverview();
  }
}

// ================= 5. TAB KELOLA BERITA =================
function renderBeritaTable() {
  const tbody = document.getElementById('berita-table-body');
  if (!tbody) return;

  const list = OssagaDB.getBerita();
  tbody.innerHTML = list.map((b, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${b.gambar}" alt="" style="width: 44px; height: 34px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-subtle);">
          <strong style="color: var(--white);">${b.judul}</strong>
        </div>
      </td>
      <td><span class="badge badge-primary">${b.kategori}</span></td>
      <td>${formatTanggal(b.tanggal)}</td>
      <td>${b.penulis}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editBerita('${b.id}')">Edit</button>
        <button class="btn btn-secondary btn-sm" style="color: #ef4444;" onclick="deleteBeritaPrompt('${b.id}')">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function openBeritaModal(isEdit = false, data = null) {
  const modal = document.getElementById('admin-modal');
  const title = document.getElementById('admin-modal-title');
  const body = document.getElementById('admin-modal-body');

  title.textContent = isEdit ? 'Sunting Warta Publikasi' : 'Tulis Warta Baru';
  body.innerHTML = `
    <form id="form-manage-berita" onsubmit="handleSaveBerita(event)">
      <input type="hidden" id="brt-id" value="${data ? data.id : ''}">
      <div class="form-group">
        <label class="form-label">Judul Warta / Artikel*</label>
        <input type="text" id="brt-judul" class="form-control" value="${data ? data.judul : ''}" required>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Kategori*</label>
          <input type="text" id="brt-kategori" class="form-control" value="${data ? data.kategori : 'Kegiatan'}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Penulis / Redaktur*</label>
          <input type="text" id="brt-penulis" class="form-control" value="${data ? data.penulis : currentUser.nama}" required>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">URL Gambar Sampul</label>
        <input type="url" id="brt-gambar" class="form-control" value="${data ? data.gambar : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'}">
      </div>
      <div class="form-group">
        <label class="form-label">Ringkasan Eksekutif*</label>
        <textarea id="brt-ringkasan" class="form-control" rows="2" required>${data ? data.ringkasan : ''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Naskah Lengkap Warta*</label>
        <textarea id="brt-konten" class="form-control" rows="6" required>${data ? data.konten : ''}</textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width: 100%;">Publikasikan Warta</button>
    </form>
  `;
  modal.classList.add('active');
}

function editBerita(id) {
  const b = OssagaDB.getBeritaById(id);
  if (b) openBeritaModal(true, b);
}

function handleSaveBerita(e) {
  e.preventDefault();
  const id = document.getElementById('brt-id').value;
  const judul = document.getElementById('brt-judul').value.trim();
  const kategori = document.getElementById('brt-kategori').value.trim();
  const penulis = document.getElementById('brt-penulis').value.trim();
  const gambar = document.getElementById('brt-gambar').value.trim();
  const ringkasan = document.getElementById('brt-ringkasan').value.trim();
  const konten = document.getElementById('brt-konten').value.trim();

  const payload = { judul, kategori, penulis, gambar, ringkasan, konten };
  if (id) payload.id = id;

  const res = OssagaDB.saveBerita(payload);
  showToast(res.message, 'success');
  closeAdminModal();
  renderBeritaTable();
}

function deleteBeritaPrompt(id) {
  if (confirm('Hapus warta ini?')) {
    OssagaDB.deleteBerita(id);
    showToast('Warta berhasil dihapus');
    renderBeritaTable();
  }
}

// ================= 6. TAB KELOLA AGENDA =================
function renderAgendaTable() {
  const tbody = document.getElementById('agenda-table-body');
  if (!tbody) return;

  const list = OssagaDB.getAgenda();
  tbody.innerHTML = list.map((a, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><strong style="color: var(--white);">${a.judul}</strong></td>
      <td>${formatTanggal(a.tanggal)}</td>
      <td>${a.waktu}</td>
      <td>${a.lokasi}</td>
      <td><span class="badge badge-primary">${a.kategori}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editAgenda('${a.id}')">Edit</button>
        <button class="btn btn-secondary btn-sm" style="color: #ef4444;" onclick="deleteAgendaPrompt('${a.id}')">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function openAgendaModal(isEdit = false, data = null) {
  const modal = document.getElementById('admin-modal');
  const title = document.getElementById('admin-modal-title');
  const body = document.getElementById('admin-modal-body');

  title.textContent = isEdit ? 'Perbarui Jadwal Agenda' : 'Tambah Agenda Baru';
  body.innerHTML = `
    <form id="form-manage-agenda" onsubmit="handleSaveAgenda(event)">
      <input type="hidden" id="agd-id" value="${data ? data.id : ''}">
      <div class="form-group">
        <label class="form-label">Nama Acara / Agenda*</label>
        <input type="text" id="agd-judul" class="form-control" value="${data ? data.judul : ''}" required>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Tanggal Pelaksanaan*</label>
          <input type="date" id="agd-tanggal" class="form-control" value="${data ? data.tanggal : ''}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Waktu (WIB)*</label>
          <input type="text" id="agd-waktu" class="form-control" value="${data ? data.waktu : '08:00 - Selesai'}" required>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Lokasi / Ruang*</label>
          <input type="text" id="agd-lokasi" class="form-control" value="${data ? data.lokasi : 'Aula Utama'}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Kategori*</label>
          <input type="text" id="agd-kategori" class="form-control" value="${data ? data.kategori : 'Kedinasan'}" required>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Deskripsi Agenda</label>
        <textarea id="agd-deskripsi" class="form-control" rows="3">${data ? data.deskripsi : ''}</textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width: 100%;">Simpan Agenda Kegiatan</button>
    </form>
  `;
  modal.classList.add('active');
}

function editAgenda(id) {
  const a = OssagaDB.getAgenda().find(x => x.id === id);
  if (a) openAgendaModal(true, a);
}

function handleSaveAgenda(e) {
  e.preventDefault();
  const id = document.getElementById('agd-id').value;
  const judul = document.getElementById('agd-judul').value.trim();
  const tanggal = document.getElementById('agd-tanggal').value;
  const waktu = document.getElementById('agd-waktu').value.trim();
  const lokasi = document.getElementById('agd-lokasi').value.trim();
  const kategori = document.getElementById('agd-kategori').value.trim();
  const deskripsi = document.getElementById('agd-deskripsi').value.trim();

  const payload = { judul, tanggal, waktu, lokasi, kategori, deskripsi };
  if (id) payload.id = id;

  const res = OssagaDB.saveAgenda(payload);
  showToast(res.message, 'success');
  closeAdminModal();
  renderAgendaTable();
}

function deleteAgendaPrompt(id) {
  if (confirm('Hapus agenda ini?')) {
    OssagaDB.deleteAgenda(id);
    showToast('Agenda dihapus');
    renderAgendaTable();
  }
}

// ================= 7. TAB KELOLA PROKER =================
function renderProkerTable() {
  const tbody = document.getElementById('proker-table-body');
  if (!tbody) return;

  const list = OssagaDB.getProker();
  tbody.innerHTML = list.map((p, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><strong style="color: var(--white);">${p.nama}</strong><br><small style="color: var(--light-blue);">${p.sekbid}</small></td>
      <td>${p.anggaran}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="progress-bar-bg" style="width: 80px; height: 6px;">
            <div class="progress-bar-fill" style="width: ${p.progress}%;"></div>
          </div>
          <span>${p.progress}%</span>
        </div>
      </td>
      <td><span class="badge ${p.status === 'Terlaksana' ? 'badge-success' : 'badge-warning'}">${p.status}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editProker('${p.id}')">Edit</button>
        <button class="btn btn-secondary btn-sm" style="color: #ef4444;" onclick="deleteProkerPrompt('${p.id}')">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function openProkerModal(isEdit = false, data = null) {
  const modal = document.getElementById('admin-modal');
  const title = document.getElementById('admin-modal-title');
  const body = document.getElementById('admin-modal-body');

  title.textContent = isEdit ? 'Perbarui Program Kerja' : 'Tambah Program Kerja Baru';
  body.innerHTML = `
    <form id="form-manage-proker" onsubmit="handleSaveProker(event)">
      <input type="hidden" id="prk-id" value="${data ? data.id : ''}">
      <div class="form-group">
        <label class="form-label">Nama Program Kerja*</label>
        <input type="text" id="prk-nama" class="form-control" value="${data ? data.nama : ''}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Seksi Bidang (Sekbid) Penanggung Jawab*</label>
        <input type="text" id="prk-sekbid" class="form-control" value="${data ? data.sekbid : 'Sekbid 1'}" required>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Alokasi Anggaran</label>
          <input type="text" id="prk-anggaran" class="form-control" value="${data ? data.anggaran : 'Rp 0'}">
        </div>
        <div class="form-group">
          <label class="form-label">Persentase Capaian (%)</label>
          <input type="number" id="prk-progress" class="form-control" min="0" max="100" value="${data ? data.progress : 0}">
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Status Proker*</label>
          <select id="prk-status" class="form-control">
            <option value="Mendatang" ${data && data.status === 'Mendatang' ? 'selected' : ''}>Mendatang</option>
            <option value="Sedang Berjalan" ${data && data.status === 'Sedang Berjalan' ? 'selected' : ''}>Sedang Berjalan</option>
            <option value="Terlaksana" ${data && data.status === 'Terlaksana' ? 'selected' : ''}>Terlaksana</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Target Tanggal Pelaksanaan</label>
          <input type="date" id="prk-target" class="form-control" value="${data ? data.target_tanggal : ''}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Tujuan & Sasaran Strategis</label>
        <textarea id="prk-tujuan" class="form-control" rows="2">${data ? data.tujuan : ''}</textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width: 100%;">Simpan Program Kerja</button>
    </form>
  `;
  modal.classList.add('active');
}

function editProker(id) {
  const p = OssagaDB.getProker().find(x => x.id === id);
  if (p) openProkerModal(true, p);
}

function handleSaveProker(e) {
  e.preventDefault();
  const id = document.getElementById('prk-id').value;
  const nama = document.getElementById('prk-nama').value.trim();
  const sekbid = document.getElementById('prk-sekbid').value.trim();
  const anggaran = document.getElementById('prk-anggaran').value.trim();
  const progress = parseInt(document.getElementById('prk-progress').value) || 0;
  const status = document.getElementById('prk-status').value;
  const target_tanggal = document.getElementById('prk-target').value;
  const tujuan = document.getElementById('prk-tujuan').value.trim();

  const payload = { nama, sekbid, anggaran, progress, status, target_tanggal, tujuan };
  if (id) payload.id = id;

  const res = OssagaDB.saveProker(payload);
  showToast(res.message, 'success');
  closeAdminModal();
  renderProkerTable();
}

function deleteProkerPrompt(id) {
  if (confirm('Hapus program kerja ini?')) {
    OssagaDB.deleteProker(id);
    showToast('Program kerja dihapus');
    renderProkerTable();
  }
}

// ================= TAB MANAJEMEN GALERI =================
function renderGaleriAdmin() {
  const tbody = document.getElementById('galeri-table-body');
  if (!tbody) return;

  const list = OssagaDB.getGaleri();
  tbody.innerHTML = list.map((g, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>
        <img src="${g.url}" alt="${g.judul}" style="width: 60px; height: 42px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-subtle);">
      </td>
      <td><strong style="color: var(--white);">${g.judul}</strong></td>
      <td><span class="badge badge-primary">${g.kategori}</span></td>
      <td style="max-width: 250px; font-size: 0.85rem; color: var(--text-muted);">${g.deskripsi}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editGaleri('${g.id}')">Edit</button>
        <button class="btn btn-secondary btn-sm" style="color: #ef4444;" onclick="deleteGaleriPrompt('${g.id}')">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function openGaleriModal(isEdit = false, data = null) {
  const modal = document.getElementById('admin-modal');
  const title = document.getElementById('admin-modal-title');
  const body = document.getElementById('admin-modal-body');

  title.textContent = isEdit ? 'Sunting Foto Dokumentasi' : 'Tambah Dokumentasi Baru';
  body.innerHTML = `
    <form id="form-manage-galeri" onsubmit="handleSaveGaleri(event)">
      <input type="hidden" id="gal-id" value="${data ? data.id : ''}">
      <div class="form-group">
        <label class="form-label">Judul Foto Dokumentasi*</label>
        <input type="text" id="gal-judul" class="form-control" value="${data ? data.judul : ''}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Kategori Foto*</label>
        <select id="gal-kategori" class="form-control">
          <option value="Kegiatan" ${data && data.kategori === 'Kegiatan' ? 'selected' : ''}>Kegiatan</option>
          <option value="Pelantikan" ${data && data.kategori === 'Pelantikan' ? 'selected' : ''}>Pelantikan</option>
          <option value="Lomba" ${data && data.kategori === 'Lomba' ? 'selected' : ''}>Lomba & Prestasi</option>
          <option value="Pentas Seni" ${data && data.kategori === 'Pentas Seni' ? 'selected' : ''}>Pentas Seni</option>
          <option value="Sosial" ${data && data.kategori === 'Sosial' ? 'selected' : ''}>Bakti Sosial</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">URL Foto / Berkas Digital*</label>
        <input type="url" id="gal-url" class="form-control" value="${data ? data.url : ''}" placeholder="https://..." required oninput="previewGaleriImg(this.value)">
      </div>
      <div id="gal-preview-wrap" style="margin-bottom: 16px; text-align: center;">
        <img id="gal-preview-img" src="${data ? data.url : ''}" style="max-height: 180px; border-radius: 8px; border: 1px solid var(--border-electric); ${data ? '' : 'display: none;'}">
      </div>
      <div class="form-group">
        <label class="form-label">Keterangan Dokumentasi</label>
        <textarea id="gal-deskripsi" class="form-control" rows="3">${data ? data.deskripsi : ''}</textarea>
      </div>
      <button type="submit" class="btn btn-primary" style="width: 100%;">Simpan ke Galeri</button>
    </form>
  `;
  modal.classList.add('active');
}

function previewGaleriImg(url) {
  const img = document.getElementById('gal-preview-img');
  if (img) {
    if (url.trim()) {
      img.src = url;
      img.style.display = 'inline-block';
    } else {
      img.style.display = 'none';
    }
  }
}

function editGaleri(id) {
  const g = OssagaDB.getGaleri().find(x => x.id === id);
  if (g) openGaleriModal(true, g);
}

function handleSaveGaleri(e) {
  e.preventDefault();
  const id = document.getElementById('gal-id').value;
  const judul = document.getElementById('gal-judul').value.trim();
  const kategori = document.getElementById('gal-kategori').value;
  const url = document.getElementById('gal-url').value.trim();
  const deskripsi = document.getElementById('gal-deskripsi').value.trim();

  const payload = { judul, kategori, url, deskripsi };
  if (id) payload.id = id;

  const res = OssagaDB.saveGaleri(payload);
  showToast(res.message, 'success');
  closeAdminModal();
  renderGaleriAdmin();
}

function deleteGaleriPrompt(id) {
  if (confirm('Hapus foto ini dari galeri?')) {
    OssagaDB.deleteGaleri(id);
    showToast('Foto galeri berhasil dihapus');
    renderGaleriAdmin();
  }
}

// ================= 8. TAB KELOLA ASPIRASI =================
function renderAspirasiTable() {
  const tbody = document.getElementById('aspirasi-table-body');
  if (!tbody) return;

  const list = OssagaDB.getAspirasi();
  tbody.innerHTML = list.map((a, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><strong style="color: var(--white);">${a.nama_pengirim}</strong><br><small style="color: var(--light-blue);">Kelas: ${a.kelas} • WA: ${a.kontak}</small></td>
      <td><span class="badge badge-primary">${a.kategori}</span></td>
      <td style="max-width: 250px;">
        <div style="font-size: 0.88rem; color: #e2e8f0;">${a.pesan}</div>
        ${a.balasan ? `<div style="font-size: 0.78rem; color: var(--light-blue); margin-top: 4px; padding-left: 8px; border-left: 2px solid var(--electric-blue);">Tanggapan: ${a.balasan}</div>` : ''}
      </td>
      <td><span class="badge ${a.status === 'Selesai' ? 'badge-success' : 'badge-warning'}">${a.status}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openBalasAspirasiModal('${a.id}')">Tanggapi</button>
        <button class="btn btn-secondary btn-sm" style="color: #ef4444;" onclick="deleteAspirasiPrompt('${a.id}')">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function openBalasAspirasiModal(id) {
  const a = OssagaDB.getAspirasi().find(x => x.id === id);
  if (!a) return;

  const modal = document.getElementById('admin-modal');
  const title = document.getElementById('admin-modal-title');
  const body = document.getElementById('admin-modal-body');

  title.textContent = 'Respon & Tindak Lanjut Aspirasi';
  body.innerHTML = `
    <form id="form-balas-aspirasi" onsubmit="handleBalasAspirasi(event, '${id}')">
      <div style="background: rgba(10, 25, 47, 0.7); border: 1px solid var(--border-subtle); padding: 14px; border-radius: 8px; margin-bottom: 16px;">
        <div style="font-size: 0.82rem; color: var(--light-blue);">Pengirim: <strong style="color: var(--white);">${a.nama_pengirim}</strong> (${a.kelas})</div>
        <p style="margin-top: 6px; font-weight: 600; color: #e2e8f0;">"${a.pesan}"</p>
      </div>

      <div class="form-group">
        <label class="form-label">Status Aspirasi*</label>
        <select id="asp-m-status" class="form-control">
          <option value="Menunggu" ${a.status === 'Menunggu' ? 'selected' : ''}>Menunggu</option>
          <option value="Diterima" ${a.status === 'Diterima' ? 'selected' : ''}>Diterima</option>
          <option value="Diproses" ${a.status === 'Diproses' ? 'selected' : ''}>Diproses Pengurus</option>
          <option value="Selesai" ${a.status === 'Selesai' ? 'selected' : ''}>Selesai / Terwujud</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Tanggapan Resmi Dewan Pengurus*</label>
        <textarea id="asp-m-balasan" class="form-control" rows="4" placeholder="Tuliskan tanggapan kedinasan atau rencana tindak lanjut..." required>${a.balasan || ''}</textarea>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%;">Publikasikan Tanggapan Resmi</button>
    </form>
  `;
  modal.classList.add('active');
}

function handleBalasAspirasi(e, id) {
  e.preventDefault();
  const status = document.getElementById('asp-m-status').value;
  const balasan = document.getElementById('asp-m-balasan').value.trim();

  const res = OssagaDB.balasAspirasi(id, status, balasan);
  showToast(res.message, 'success');
  closeAdminModal();
  renderAspirasiTable();
}

function deleteAspirasiPrompt(id) {
  if (confirm('Hapus data aspirasi ini?')) {
    OssagaDB.deleteAspirasi(id);
    showToast('Aspirasi berhasil dihapus');
    renderAspirasiTable();
  }
}

// ================= 9. TAB KARTU TANDA ANGGOTA (KTA) DIGITAL =================
function renderKTADigital() {
  const container = document.getElementById('kta-container');
  if (!container) return;

  const p = OssagaDB.getPengaturan();

  container.innerHTML = `
    <div class="kta-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 12px;">
        <div>
          <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--light-blue); font-weight: 700;">KARTU TANDA ANGGOTA RESMI</div>
          <div style="font-weight: 800; font-size: 1.15rem; color: #ffffff;">${p.nama_organisasi}</div>
        </div>
        <div style="width: 38px; height: 38px; background: linear-gradient(135deg, var(--royal-blue), var(--electric-blue)); color: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; border: 1px solid var(--border-glow);">OS</div>
      </div>

      <div style="display: flex; gap: 18px; align-items: center; margin-bottom: 20px;">
        <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}" style="width: 82px; height: 82px; border-radius: 14px; object-fit: cover; border: 2px solid var(--electric-blue); box-shadow: var(--glow-electric);">
        <div>
          <div style="font-size: 1.25rem; font-weight: 800; color: #ffffff;">${currentUser.nama}</div>
          <div style="font-size: 0.9rem; color: var(--light-blue); font-weight: 700;">${currentUser.jabatan}</div>
          <div style="font-size: 0.82rem; color: #cbd5e1; margin-top: 4px;">NIS: <strong>${currentUser.nis}</strong> • Kelas: ${currentUser.kelas}</div>
        </div>
      </div>

      <div style="background: rgba(10, 25, 47, 0.7); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
        <div>
          <span style="color: var(--text-dim);">Masa Bakti:</span><br>
          <strong style="color: #ffffff;">Periode ${p.periode}</strong>
        </div>
        <div>
          <span style="color: var(--text-dim);">Status Keanggotaan:</span><br>
          <span class="badge badge-success" style="padding: 2px 8px; font-size: 0.68rem;"><span class="badge-dot"></span> Terverifikasi Aktif</span>
        </div>
        <div style="text-align: right;">
          <span style="color: var(--text-dim);">Kode Verifikasi:</span><br>
          <strong style="font-family: monospace; color: var(--light-blue);">#${currentUser.nis}</strong>
        </div>
      </div>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <button class="btn btn-primary btn-sm" onclick="window.print()">
        <svg class="icon-svg" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Cetak / Unduh KTA Digital
      </button>
    </div>
  `;
}

// ================= 10. TAB PENGATURAN & DATABASE (SUPERADMIN) =================
function renderPengaturanForm() {
  const p = OssagaDB.getPengaturan();
  document.getElementById('cfg-sekolah').value = p.nama_sekolah;
  document.getElementById('cfg-organisasi').value = p.nama_organisasi;
  document.getElementById('cfg-periode').value = p.periode;
  document.getElementById('cfg-kuota').value = p.kuota_anggota || 30;
  document.getElementById('cfg-slogan').value = p.slogan;
  document.getElementById('cfg-email').value = p.email;
  document.getElementById('cfg-telepon').value = p.telepon;
  document.getElementById('cfg-visi').value = p.visi;
}

function handleSavePengaturan(e) {
  e.preventDefault();
  const settings = {
    nama_sekolah: document.getElementById('cfg-sekolah').value.trim(),
    nama_organisasi: document.getElementById('cfg-organisasi').value.trim(),
    periode: document.getElementById('cfg-periode').value.trim(),
    kuota_anggota: parseInt(document.getElementById('cfg-kuota').value) || 30,
    slogan: document.getElementById('cfg-slogan').value.trim(),
    email: document.getElementById('cfg-email').value.trim(),
    telepon: document.getElementById('cfg-telepon').value.trim(),
    visi: document.getElementById('cfg-visi').value.trim()
  };

  const res = OssagaDB.updatePengaturan(settings);
  showToast(res.message, 'success');
}

function handleExportDatabase() {
  OssagaDB.exportJSON();
  showToast('Database berhasil diekspor ke file JSON');
}

function handleImportDatabase(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const res = OssagaDB.importJSON(event.target.result);
    if (res.success) {
      alert('Database berhasil diimpor. Halaman akan dimuat ulang.');
      window.location.reload();
    } else {
      showToast(res.message, 'error');
    }
  };
  reader.readAsText(file);
}

function handleResetDatabase() {
  if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh database ke pengaturan bawaan (1 Superadmin, Pengurus Bawaan, dan kuota 30 fungsionaris)? Tindakan ini tidak dapat dibatalkan.')) {
    OssagaDB.resetToDefault();
    alert('Database telah direset ke kondisi awal.');
    window.location.reload();
  }
}

// ================= MODAL & LOGOUT HELPERS =================
function closeAdminModal() {
  const m = document.getElementById('admin-modal');
  if (m) m.classList.remove('active');
}

function handleLogout() {
  if (confirm('Apakah Anda yakin ingin keluar dari sesi portal ini?')) {
    OssagaDB.logout();
    window.location.href = '../auth/login.html';
  }
}

function showToast(msg, type = 'success') {
  let c = document.getElementById('toast-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toast-container';
    document.body.appendChild(c);
  }
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  const icon = type === 'error'
    ? `<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    : `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  t.innerHTML = `${icon} <span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 300);
  }, 4000);
}
