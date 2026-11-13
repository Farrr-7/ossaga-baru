/**
 * OSSAGA - Modern Interactive Web Controller
 * Theme: Modern Creative • Futuristic • Premium Dark Navy
 * Features: Real-time search, category filtering, animated counters,
 * scroll reveal, interactive lightbox, modal detail, aspirasi submission,
 * and user session authentication sync.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi Database Bawaan
  if (typeof OssagaDB !== 'undefined') {
    OssagaDB.init();
  }

  // 1. Setup Navigasi & Status Autentikasi Pengguna
  setupUserNav();
  setupMobileNav();

  // 2. Render Seluruh Section
  renderOrgInfo();
  renderQuotaInfo();
  renderMeetTheTeam();
  renderBerita();
  renderAgenda();
  renderProker();
  renderStruktur();
  renderGaleri();
  renderAspirasi();
  setupAspirasiForm();

  // 3. Setup Interaktivitas, Sekbid Hover & Arcade Game
  setupSekbidInteractions();
  setupArcadeGame();
  setupSearchAndFilters();
  setupScrollReveal();
  setupAnimatedCounters();
});

// ================= TOAST NOTIFICATION =================
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = `<svg class="icon-svg" viewBox="0 0 24 24" style="color: var(--light-blue);"><polyline points="20 6 9 17 4 12"/></svg>`;
  if (type === 'error') {
    iconSvg = `<svg class="icon-svg" viewBox="0 0 24 24" style="color: #ef4444;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  } else if (type === 'warning') {
    iconSvg = `<svg class="icon-svg" viewBox="0 0 24 24" style="color: #f59e0b;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  }

  toast.innerHTML = `
    <span style="display: flex; align-items: center;">${iconSvg}</span>
    <span style="flex-grow: 1;">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ================= 1. USER AUTH & NAVBAR =================
function setupUserNav() {
  const user = OssagaDB.getCurrentUser();
  const navActions = document.getElementById('nav-user-actions');
  if (!navActions) return;

  if (user) {
    let dashboardTitle = 'Dashboard Anggota';
    let roleBadge = 'Anggota OSIS';
    if (user.role === 'superadmin') {
      dashboardTitle = 'Super Admin Panel';
      roleBadge = 'Super Admin';
    } else if (user.role === 'admin') {
      dashboardTitle = 'Admin Pengurus';
      roleBadge = 'Admin';
    }

    navActions.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="text-align: right; display: none;" class="nav-user-info">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--white);">${user.nama.split(' ')[0]}</div>
          <div style="font-size: 0.72rem; color: var(--light-blue); font-weight: 600;">NIS: ${user.nis || '-'}</div>
        </div>
        <a href="admin/index.html" class="btn btn-primary btn-sm">
          <svg class="icon-svg" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          ${dashboardTitle}
        </a>
        <button onclick="handleLogout()" class="btn btn-secondary btn-sm" title="Keluar">
          <svg class="icon-svg" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Keluar
        </button>
      </div>
    `;
  } else {
    navActions.innerHTML = `
      <a href="auth/register.html" class="btn btn-gold btn-sm">
        <svg class="icon-svg" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
        Daftar Anggota
      </a>
      <a href="auth/login.html" class="btn btn-primary btn-sm">
        <svg class="icon-svg" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Login Pengurus
      </a>
    `;
  }
}

function handleLogout() {
  OssagaDB.logout();
  showToast('Anda telah berhasil keluar dari sesi.');
  setTimeout(() => {
    window.location.reload();
  }, 600);
}

function setupMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Tutup menu mobile ketika link diklik
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Modal Global Close Handlers
  const modal = document.getElementById('global-modal');
  if (modal) {
    modal.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => modal.classList.remove('active'));
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

// ================= 2. INFO ORGANISASI & KUOTA =================
function renderOrgInfo() {
  const p = OssagaDB.getPengaturan();
  
  document.querySelectorAll('.school-name').forEach(el => el.textContent = p.nama_sekolah);
  document.querySelectorAll('.org-name').forEach(el => el.textContent = p.nama_organisasi);
  document.querySelectorAll('.org-slogan').forEach(el => el.textContent = p.slogan);
  
  const visiEl = document.getElementById('visi-text');
  if (visiEl) visiEl.textContent = p.visi;

  const misiContainer = document.getElementById('misi-list');
  if (misiContainer && p.misi) {
    misiContainer.innerHTML = p.misi.map((m, idx) => `
      <li style="display: flex; gap: 14px; margin-bottom: 16px; align-items: flex-start;">
        <span style="background: linear-gradient(135deg, var(--royal-blue), var(--electric-blue)); color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; flex-shrink: 0; box-shadow: 0 0 10px rgba(37, 131, 232, 0.4);">${idx + 1}</span>
        <span style="color: var(--text-muted); font-size: 0.96rem; line-height: 1.6;">${m}</span>
      </li>
    `).join('');
  }

  // Sambutan Ketua
  if (p.sambutan_ketua) {
    const sambutanNama = document.getElementById('sambutan-nama');
    const sambutanKelas = document.getElementById('sambutan-kelas');
    const sambutanTeks = document.getElementById('sambutan-teks');
    const sambutanFoto = document.getElementById('sambutan-foto');

    if (sambutanNama) sambutanNama.textContent = p.sambutan_ketua.nama;
    if (sambutanKelas) sambutanKelas.textContent = p.sambutan_ketua.kelas;
    if (sambutanTeks) sambutanTeks.textContent = `"${p.sambutan_ketua.teks}"`;
    if (sambutanFoto && p.sambutan_ketua.foto) sambutanFoto.src = p.sambutan_ketua.foto;
  }
}

function renderQuotaInfo() {
  const activeCount = OssagaDB.getAnggotaCount();
  const maxQuota = OssagaDB.getMaxKuota();
  const percentage = Math.min(100, Math.round((activeCount / maxQuota) * 100));
  const remaining = Math.max(0, maxQuota - activeCount);

  const quotaText = document.getElementById('quota-text');
  const quotaBar = document.getElementById('quota-bar');
  const quotaRemaining = document.getElementById('quota-remaining');

  if (quotaText) quotaText.textContent = `${activeCount} / ${maxQuota} Anggota Terdaftar`;
  if (quotaBar) quotaBar.style.width = `${percentage}%`;
  if (quotaRemaining) {
    quotaRemaining.textContent = remaining > 0 
      ? `Tersisa ${remaining} slot kuota aktif login berbasis NIS.`
      : `Kuota 30 Anggota OSIS periode ini telah lengkap!`;
  }
}

// ================= 3. MEET THE TEAM (BPH LEADERSHIP) =================
function renderMeetTheTeam() {
  const container = document.getElementById('team-grid');
  if (!container) return;

  const users = OssagaDB.getUsers();
  // Filter pimpinan utama
  const leaders = [
    {
      nama: "Muhammad Arya Pratama",
      jabatan: "Ketua Umum OSIS",
      nis: "23241001",
      kelas: "XI MIPA 1",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    },
    {
      nama: "Siti Nurhaliza",
      jabatan: "Wakil Ketua Umum",
      nis: "23241002",
      kelas: "XI MIPA 2",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
    },
    {
      nama: "Rifqi Maulana",
      jabatan: "Sekretaris Umum",
      nis: "23241003",
      kelas: "XI IPS 1",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    },
    {
      nama: "Annisa Rahmawati",
      jabatan: "Bendahara Umum",
      nis: "23241004",
      kelas: "XI IPS 2",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80"
    }
  ];

  container.innerHTML = leaders.map(l => `
    <div class="team-card reveal">
      <div class="team-avatar-wrap">
        <img src="${l.avatar}" alt="${l.nama}" loading="lazy">
      </div>
      <div class="team-info">
        <h4 class="team-name">${l.nama}</h4>
        <div class="team-role">${l.jabatan}</div>
        <div class="team-nis">NIS: ${l.nis} • Kelas ${l.kelas}</div>
      </div>
    </div>
  `).join('');
}

// ================= 4. BERITA & PENGUMUMAN DENGAN FILTER & SEARCH =================
let currentBeritaFilter = 'all';
let currentBeritaSearch = '';

function renderBerita(category = currentBeritaFilter, query = currentBeritaSearch) {
  const container = document.getElementById('berita-grid');
  if (!container) return;

  currentBeritaFilter = category;
  currentBeritaSearch = query;

  let list = OssagaDB.getBerita(12);

  // Filter Kategori
  if (category !== 'all') {
    list = list.filter(b => b.kategori.toLowerCase() === category.toLowerCase());
  }

  // Filter Real-time Search
  if (query.trim() !== '') {
    const q = query.toLowerCase();
    list = list.filter(b => b.judul.toLowerCase().includes(q) || b.ringkasan.toLowerCase().includes(q) || b.kategori.toLowerCase().includes(q));
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--primary-navy); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
        <p style="color: var(--text-dim); font-size: 1.05rem;">Tidak ditemukan berita atau pengumuman yang sesuai kata kunci.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(b => `
    <article class="card reveal">
      <div class="card-img-wrap">
        <span class="badge badge-primary card-badge">${b.kategori}</span>
        <img src="${b.gambar}" alt="${b.judul}" loading="lazy">
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span style="display: inline-flex; align-items: center; gap: 6px;">
            <svg class="icon-svg" viewBox="0 0 24 24" style="width: 14px; height: 14px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${formatTanggal(b.tanggal)}
          </span>
          <span style="display: inline-flex; align-items: center; gap: 6px;">
            <svg class="icon-svg" viewBox="0 0 24 24" style="width: 14px; height: 14px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            ${b.penulis}
          </span>
        </div>
        <h3 class="card-title">${b.judul}</h3>
        <p class="card-text">${b.ringkasan}</p>
        <div class="card-footer">
          <button onclick="bacaBeritaLengkap('${b.id}')" class="btn btn-secondary btn-sm" style="width: 100%;">
            Baca Selengkapnya
            <svg class="icon-svg" viewBox="0 0 24 24" style="width: 13px; height: 13px; margin-left: 6px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

function bacaBeritaLengkap(id) {
  const b = OssagaDB.getBeritaById(id);
  if (!b) return;

  const modal = document.getElementById('global-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = b.judul;
  modalBody.innerHTML = `
    <div style="margin-bottom: 16px;">
      <span class="badge badge-primary"><span class="badge-dot"></span> ${b.kategori}</span>
      <span style="font-size: 0.85rem; color: var(--text-dim); margin-left: 10px;">${formatTanggal(b.tanggal)} • Penulis: ${b.penulis}</span>
    </div>
    <img src="${b.gambar}" alt="${b.judul}" style="width: 100%; max-height: 380px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--border-electric);">
    <div style="line-height: 1.8; color: #cbd5e1; font-size: 1rem; white-space: pre-line;">
      ${b.konten}
    </div>
  `;

  modal.classList.add('active');
}

// ================= 5. AGENDA & KALENDER KEGIATAN =================
function renderAgenda() {
  const container = document.getElementById('agenda-list');
  if (!container) return;

  const agenda = OssagaDB.getAgenda(6);
  if (agenda.length === 0) {
    container.innerHTML = '<p class="text-muted" style="text-align: center; grid-column: 1/-1;">Belum ada agenda mendatang.</p>';
    return;
  }

  container.innerHTML = agenda.map(a => {
    const d = new Date(a.tanggal);
    const day = isNaN(d) ? '15' : d.getDate();
    const month = isNaN(d) ? 'DES' : d.toLocaleString('id-ID', { month: 'short' }).toUpperCase();

    return `
      <div class="agenda-card reveal">
        <div class="agenda-date-box">
          <span class="agenda-day">${day}</span>
          <span class="agenda-month">${month}</span>
        </div>
        <div class="agenda-info">
          <div style="display: flex; gap: 8px; margin-bottom: 6px; align-items: center;">
            <span class="badge badge-primary" style="font-size: 0.7rem;"><span class="badge-dot"></span> ${a.kategori}</span>
            <span style="font-size: 0.75rem; color: var(--light-blue); display: inline-flex; align-items: center; gap: 5px;">
              <svg class="icon-svg" viewBox="0 0 24 24" style="width: 13px; height: 13px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${a.waktu}
            </span>
          </div>
          <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 6px; color: var(--white);">${a.judul}</h4>
          <p style="font-size: 0.86rem; color: var(--text-dim); margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <svg class="icon-svg" viewBox="0 0 24 24" style="width: 14px; height: 14px; color: var(--light-blue);"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${a.lokasi}
          </p>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${a.deskripsi}</p>
        </div>
      </div>
    `;
  }).join('');
}

// ================= 6. PROGRAM KERJA (PROKER) =================
let currentProkerFilter = 'all';

function renderProker(status = currentProkerFilter) {
  const container = document.getElementById('proker-grid');
  if (!container) return;

  currentProkerFilter = status;
  let prokerList = OssagaDB.getProker();

  if (status !== 'all') {
    const s = status.toLowerCase();
    prokerList = prokerList.filter(p => {
      const ps = p.status.toLowerCase();
      if (s === 'rencana' || s === 'mendatang') {
        return ps.includes('rencana') || ps.includes('mendatang');
      }
      if (s === 'sedang berjalan' || s === 'berjalan') {
        return ps.includes('berjalan');
      }
      if (s === 'terlaksana' || s === 'selesai') {
        return ps.includes('terlaksana') || ps.includes('selesai');
      }
      return ps === s;
    });
  }

  if (prokerList.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
        <p style="color: var(--text-dim); font-size: 1rem;">Belum ada program kerja dengan status "${status}".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = prokerList.map(p => {
    let badgeClass = 'badge-primary';
    if (p.status === 'Terlaksana') badgeClass = 'badge-success';
    if (p.status === 'Sedang Berjalan') badgeClass = 'badge-royal';

    return `
      <div class="proker-card reveal revealed">
        <div class="proker-header">
          <span class="proker-sekbid">${p.sekbid}</span>
          <span class="badge ${badgeClass}">${p.status}</span>
        </div>
        <h4 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; color: var(--white);">${p.nama}</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px; min-height: 42px;">${p.tujuan}</p>
        
        <div class="proker-meter" style="margin-top: auto;">
          <div class="progress-bar-bg" style="height: 7px; background: var(--secondary-navy);">
            <div class="progress-bar-fill" style="width: ${p.progress}%;"></div>
          </div>
          <div class="proker-stats">
            <span style="color: var(--light-blue);">Progress: ${p.progress}%</span>
            <span>Target: ${formatTanggal(p.target_tanggal)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ================= 7. STRUKTUR ORGANISASI & KUOTA 30 ANGGOTA =================
function renderStruktur() {
  const container = document.getElementById('struktur-grid');
  if (!container) return;

  const users = OssagaDB.getUsers();
  // Ambil fungsionaris aktif (maksimal 30 fungsionaris)
  const members = users.filter(u => u.status === 'aktif' && (u.role === 'admin' || u.role === 'anggota')).slice(0, 8);

  container.innerHTML = members.map(u => `
    <div class="org-member-card reveal revealed">
      <img src="${u.avatar}" alt="${u.nama}" class="org-avatar">
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--white); margin-bottom: 4px;">${u.nama}</h4>
      <div class="org-role">${u.jabatan}</div>
      <div class="org-nis">NIS: ${u.nis} • Kelas: ${u.kelas}</div>
    </div>
  `).join('');
}

// ================= 8. GALERI LENSA OSSAGA & LIGHTBOX =================
let currentGaleriFilter = 'all';

function renderGaleri(kategori = currentGaleriFilter) {
  const container = document.getElementById('galeri-grid');
  if (!container) return;

  currentGaleriFilter = kategori;
  let galeri = OssagaDB.getGaleri();

  if (kategori !== 'all') {
    const k = kategori.toLowerCase();
    galeri = galeri.filter(g => {
      const gk = (g.kategori || '').toLowerCase();
      if (k === 'ldks') {
        return gk.includes('ldks') || gk.includes('kader') || gk.includes('pengkaderan');
      }
      if (k === 'porseni') {
        return gk.includes('porseni') || gk.includes('seni') || gk.includes('olahraga');
      }
      if (k === 'kegiatan') {
        return gk.includes('kegiatan') || gk.includes('organisasi') || gk.includes('bph') || gk.includes('event');
      }
      return gk === k || gk.includes(k);
    });
  }

  if (galeri.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
        <p style="color: var(--text-dim); font-size: 1rem;">Belum ada dokumentasi untuk kategori "${kategori}".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = galeri.map(g => `
    <div class="gallery-item reveal revealed" onclick="previewFoto('${g.url}', '${g.judul}', '${g.deskripsi}')">
      <img src="${g.url}" alt="${g.judul}" loading="lazy">
      <div class="gallery-item-overlay">
        <span class="badge badge-primary" style="margin-bottom: 6px; width: fit-content;">${g.kategori}</span>
        <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--white);">${g.judul}</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted);">${g.deskripsi}</p>
      </div>
    </div>
  `).join('');
}

function previewFoto(url, judul, deskripsi) {
  const modal = document.getElementById('global-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = judul;
  modalBody.innerHTML = `
    <div class="lightbox-content">
      <img src="${url}" alt="${judul}" class="lightbox-img">
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 14px; text-align: center;">${deskripsi}</p>
    </div>
  `;

  modal.classList.add('active');
}

// ================= 9. KOTAK ASPIRASI PUBLIK =================
function renderAspirasi() {
  const container = document.getElementById('aspirasi-public-list');
  if (!container) return;

  const list = OssagaDB.getAspirasi().slice(0, 5);
  if (list.length === 0) {
    container.innerHTML = '<p class="text-muted" style="text-align: center; padding: 20px;">Belum ada aspirasi publik.</p>';
    return;
  }

  container.innerHTML = list.map(a => {
    let badgeClass = 'badge-royal';
    if (a.status === 'Selesai') badgeClass = 'badge-success';

    return `
      <div class="aspirasi-item reveal">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 700; font-size: 0.92rem; color: var(--white);">
            ${a.nama_pengirim} <span style="font-weight: 400; color: var(--text-dim); font-size: 0.8rem;">(${a.kelas})</span>
          </div>
          <span class="badge ${badgeClass}" style="font-size: 0.7rem;">${a.status}</span>
        </div>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px; line-height: 1.55;">"${a.pesan}"</p>
        ${a.balasan ? `
          <div style="background: rgba(37, 131, 232, 0.1); border-left: 3px solid var(--electric-blue); padding: 12px 14px; border-radius: 6px; font-size: 0.84rem; color: var(--light-blue);">
            <strong style="color: var(--white); display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span class="badge-dot"></span> Tanggapan Resmi Dewan Pengurus:
            </strong>
            ${a.balasan}
          </div>
        ` : ''}
        <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 10px; text-align: right;">
          ${formatTanggal(a.tanggal)} • Kategori: ${a.kategori}
        </div>
      </div>
    `;
  }).join('');
}

function setupAspirasiForm() {
  const form = document.getElementById('aspirasi-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nama = document.getElementById('asp-nama').value;
    const kelas = document.getElementById('asp-kelas').value;
    const kontak = document.getElementById('asp-kontak').value;
    const kategori = document.getElementById('asp-kategori').value;
    const pesan = document.getElementById('asp-pesan').value;

    if (!pesan.trim()) {
      showToast('Pesan aspirasi tidak boleh kosong!', 'error');
      return;
    }

    const res = OssagaDB.submitAspirasi({
      nama_pengirim: nama || 'Siswa Anonim',
      kelas: kelas || 'Umum',
      kontak: kontak || '-',
      kategori: kategori,
      pesan: pesan
    });

    if (res.success) {
      showToast(res.message, 'success');
      form.reset();
      renderAspirasi();
    }
  });
}

// ================= 10. REAL-TIME SEARCH & FILTER EVENT LISTENERS =================
function setupSearchAndFilters() {
  // Search Berita
  const beritaSearchInput = document.getElementById('berita-search-input');
  if (beritaSearchInput) {
    beritaSearchInput.addEventListener('input', (e) => {
      renderBerita(currentBeritaFilter, e.target.value);
    });
  }

  // Filter Kategori Berita
  document.querySelectorAll('.berita-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.berita-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter') || 'all';
      renderBerita(cat, currentBeritaSearch);
    });
  });

  // Filter Proker
  document.querySelectorAll('.proker-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.proker-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const status = btn.getAttribute('data-status') || 'all';
      renderProker(status);
    });
  });

  // Filter Galeri
  document.querySelectorAll('.galeri-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.galeri-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-galeri') || 'all';
      renderGaleri(cat);
    });
  });
}

// ================= 11. SCROLL REVEAL & ANIMATED COUNTERS =================
function setupScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(r => r.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(r => observer.observe(r));
}

function setupAnimatedCounters() {
  const counterEls = document.querySelectorAll('.animated-counter');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        const duration = 1200;
        const step = target / (duration / 25);
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            entry.target.textContent = target + (entry.target.getAttribute('data-suffix') || '');
            clearInterval(timer);
          } else {
            entry.target.textContent = Math.floor(current) + (entry.target.getAttribute('data-suffix') || '');
          }
        }, 25);

        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counterEls.forEach(el => observer.observe(el));
}

// Format Tanggal Bahasa Indonesia
function formatTanggal(isoDate) {
  if (!isoDate) return '-';
  try {
    const d = new Date(isoDate);
    if (isNaN(d)) return isoDate;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (e) {
    return isoDate;
  }
}

// ================= 12. SEKBID HOVER & DETAIL CARD INTERACTION =================
function setupSekbidInteractions() {
  const cards = document.querySelectorAll('.skill-pill-card[data-sekbid]');
  if (!cards.length) return;

  cards.forEach(card => {
    const nomor = card.getAttribute('data-sekbid');

    // Hover event
    card.addEventListener('mouseenter', () => {
      showSekbidDetail(nomor);
    });

    // Click event (especially for mobile or touch screens)
    card.addEventListener('click', () => {
      showSekbidDetail(nomor);
    });
  });

  // Tampilkan Sekbid 01 secara default
  showSekbidDetail('01');
}

function showSekbidDetail(nomor) {
  const display = document.getElementById('sekbid-detail-display');
  if (!display) return;

  // Active state pada pill
  document.querySelectorAll('.skill-pill-card').forEach(c => {
    if (c.getAttribute('data-sekbid') === nomor) {
      c.classList.add('active-sekbid');
    } else {
      c.classList.remove('active-sekbid');
    }
  });

  const s = OssagaDB.getSekbidByNomor(nomor);
  if (!s) return;

  display.innerHTML = `
    <div class="sekbid-detail-card" style="border-left: 4px solid ${s.warna};">
      <div class="sekbid-detail-header">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div class="sekbid-badge-number" style="background: ${s.bg}; border: 2px solid ${s.border}; color: ${s.warna};">
            ${s.nomor}
          </div>
          <div>
            <h4 style="font-size: 1.25rem; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">${s.nama}</h4>
            <div style="font-size: 0.82rem; color: var(--neon-lime); font-family: var(--font-mono);">
              Koordinator: <strong style="color: #FFFFFF;">${s.koordinator}</strong>
            </div>
          </div>
        </div>
        <a href="#proker" class="btn-dark-pill" style="padding: 7px 16px; font-size: 0.78rem;" onclick="filterProkerBySekbid('${s.nomor}')">
          Jelajahi Proker Terkait ↗
        </a>
      </div>
      <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin: 16px 0 0 0;">
        ${s.deskripsi}
      </p>
      <div class="sekbid-proker-chips-wrap">
        <span style="font-size: 0.75rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-dim); text-transform: uppercase;">
          Program Kerja Unggulan:
        </span>
        <div class="sekbid-proker-chips">
          ${(s.prokerUtama || []).map(p => `
            <span class="proker-chip" style="border-color: ${s.border}40;">
              <span style="color: ${s.warna}; font-size: 0.65rem;">●</span> ${p}
            </span>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function filterProkerBySekbid(nomor) {
  const el = document.getElementById('proker');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ================= 13. SAGARA ARCADE & INTERACTIVE ZONE =================
// Web Audio Synthesizer for Retro 8-bit Sounds
const ArcadeAudio = {
  ctx: null,
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playTone(freq, type = 'sine', duration = 0.12, gainVal = 0.1) {
    try {
      if (!this.ctx) this.init();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  },
  catchItem() {
    this.playTone(587, 'triangle', 0.08, 0.12);
    setTimeout(() => this.playTone(880, 'triangle', 0.12, 0.12), 60);
  },
  gemItem() {
    this.playTone(523, 'sine', 0.06, 0.15);
    setTimeout(() => this.playTone(659, 'sine', 0.06, 0.15), 50);
    setTimeout(() => this.playTone(784, 'sine', 0.08, 0.15), 100);
    setTimeout(() => this.playTone(1046, 'sine', 0.16, 0.15), 150);
  },
  hitBomb() {
    this.playTone(160, 'sawtooth', 0.22, 0.18);
  },
  gameOver() {
    this.playTone(320, 'sawtooth', 0.15, 0.15);
    setTimeout(() => this.playTone(260, 'sawtooth', 0.18, 0.15), 120);
    setTimeout(() => this.playTone(200, 'sawtooth', 0.22, 0.15), 260);
    setTimeout(() => this.playTone(140, 'sawtooth', 0.4, 0.15), 450);
  }
};

// Mode switcher
window.switchArcadeMode = function(mode) {
  const catchTab = document.getElementById('tab-game-catch');
  const quizTab = document.getElementById('tab-game-quiz');
  const catchView = document.getElementById('arcade-catch-view');
  const quizView = document.getElementById('arcade-quiz-view');
  const modeLabel = document.getElementById('arcade-current-mode');

  if (mode === 'catch') {
    if (catchTab) catchTab.classList.add('active');
    if (quizTab) quizTab.classList.remove('active');
    if (catchView) catchView.style.display = 'block';
    if (quizView) quizView.style.display = 'none';
    if (modeLabel) modeLabel.textContent = '2D Action Runner';
  } else {
    if (catchTab) catchTab.classList.remove('active');
    if (quizTab) quizTab.classList.add('active');
    if (catchView) catchView.style.display = 'none';
    if (quizView) quizView.style.display = 'block';
    if (modeLabel) modeLabel.textContent = 'Trivia & Asesmen';
    renderTriviaQuestion();
  }
};

function setupArcadeGame() {
  const canvas = document.getElementById('arcadeCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('arcade-overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayDesc = document.getElementById('overlay-desc');
  const playBtn = document.getElementById('overlay-btn-play');
  const startBtn = document.getElementById('btn-start-arcade');
  const scoreEl = document.getElementById('game-score');
  const timerEl = document.getElementById('game-timer');
  const comboEl = document.getElementById('game-combo');
  const highscoreEl = document.getElementById('game-highscore');

  let highscore = parseInt(localStorage.getItem('ossaga_arcade_highscore') || '0', 10);
  if (highscoreEl) highscoreEl.textContent = highscore;

  let gameState = 'ready'; // 'ready', 'playing', 'gameover'
  let score = 0;
  let combo = 1;
  let timeLeft = 30;
  let timerInterval = null;
  let animId = null;

  // Player properties
  const player = {
    x: 400,
    y: 380,
    width: 64,
    height: 54,
    speed: 8.5,
    dx: 0,
    color: '#7C3AED'
  };

  let items = [];
  let particles = [];
  let floatingTexts = [];
  let lastSpawn = 0;

  // Key tracking
  const keys = { left: false, right: false };

  window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
    if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    if (e.code === 'Space' && gameState !== 'playing') {
      const arcadeEl = document.getElementById('arcade');
      const rect = arcadeEl ? arcadeEl.getBoundingClientRect() : null;
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
        e.preventDefault();
        startGame();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
    if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
  });

  // Mobile Touch Controls
  const ctrlLeft = document.getElementById('ctrl-left');
  const ctrlRight = document.getElementById('ctrl-right');
  if (ctrlLeft) {
    ctrlLeft.addEventListener('touchstart', (e) => { e.preventDefault(); keys.left = true; });
    ctrlLeft.addEventListener('touchend', (e) => { e.preventDefault(); keys.left = false; });
    ctrlLeft.addEventListener('mousedown', () => { keys.left = true; });
    ctrlLeft.addEventListener('mouseup', () => { keys.left = false; });
  }
  if (ctrlRight) {
    ctrlRight.addEventListener('touchstart', (e) => { e.preventDefault(); keys.right = true; });
    ctrlRight.addEventListener('touchend', (e) => { e.preventDefault(); keys.right = false; });
    ctrlRight.addEventListener('mousedown', () => { keys.right = true; });
    ctrlRight.addEventListener('mouseup', () => { keys.right = false; });
  }

  // Mouse move pointer inside canvas
  canvas.addEventListener('mousemove', (e) => {
    if (gameState !== 'playing') return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, mouseX));
  });

  // Touch move on canvas
  canvas.addEventListener('touchmove', (e) => {
    if (gameState !== 'playing') return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const touchX = (e.touches[0].clientX - rect.left) * scaleX;
    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, touchX));
  });

  function spawnItem() {
    const r = Math.random();
    let type = 'star';
    let val = 10;
    let color = '#FBBF24';
    let speed = 3.5 + Math.random() * 2.5;

    if (r < 0.45) {
      type = 'star'; // Aspirasi
      val = 10;
      color = '#FBBF24';
    } else if (r < 0.65) {
      type = 'gem'; // Proker
      val = 25;
      color = '#38BDF8';
      speed += 1;
    } else if (r < 0.85) {
      type = 'scroll'; // Ide
      val = 15;
      color = '#D4F838';
    } else {
      type = 'bomb'; // Deadline
      val = -15;
      color = '#EF4444';
      speed += 1.5;
    }

    items.push({
      x: 40 + Math.random() * (canvas.width - 80),
      y: -20,
      radius: 16,
      type,
      val,
      color,
      speed,
      angle: 0,
      spin: (Math.random() - 0.5) * 0.1
    });
  }

  function addExplosion(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 4;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        radius: 2 + Math.random() * 3,
        color,
        alpha: 1,
        life: 25
      });
    }
  }

  function addFloatingText(x, y, text, color) {
    floatingTexts.push({
      x,
      y,
      text,
      color,
      alpha: 1,
      vy: -1.5,
      life: 30
    });
  }

  function startGame() {
    ArcadeAudio.init();
    gameState = 'playing';
    score = 0;
    combo = 1;
    timeLeft = 30;
    items = [];
    particles = [];
    floatingTexts = [];
    player.x = canvas.width / 2;

    if (scoreEl) scoreEl.textContent = '0';
    if (timerEl) timerEl.textContent = '30s';
    if (comboEl) comboEl.textContent = 'x1';
    if (overlay) overlay.classList.add('hidden');
    if (startBtn) startBtn.style.display = 'none';

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timerEl) timerEl.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);

    lastSpawn = performance.now();
    cancelAnimationFrame(animId);
    loop(performance.now());
  }

  function endGame() {
    clearInterval(timerInterval);
    gameState = 'gameover';
    ArcadeAudio.gameOver();

    if (score > highscore) {
      highscore = score;
      localStorage.setItem('ossaga_arcade_highscore', highscore.toString());
      if (highscoreEl) highscoreEl.textContent = highscore;
    }

    let rankTitle = 'Anggota Teladan ⭐';
    if (score >= 350) rankTitle = 'Ketua OSIS Legendaris 👑';
    else if (score >= 200) rankTitle = 'Fungsionaris Bintang Sagara 🚀';
    else if (score >= 100) rankTitle = 'Pengurus Proaktif 🔥';

    if (overlayTitle) overlayTitle.innerHTML = `GAME SELESAI! 🎉<br><span style="font-size: 1.3rem; color: var(--neon-lime);">${rankTitle}</span>`;
    if (overlayDesc) overlayDesc.innerHTML = `Skor Akhir: <strong style="color: #fff; font-size: 1.2rem;">${score}</strong> • High Score: <strong style="color: var(--neon-lime);">${highscore}</strong><br>Terus kobarkan semangat kepemimpinan dan dedikasi bagi OSSAGA!`;
    if (playBtn) playBtn.textContent = 'Main Lagi (Spasi)';
    if (overlay) overlay.classList.remove('hidden');
    if (startBtn) {
      startBtn.style.display = 'inline-flex';
      startBtn.textContent = 'Main Lagi ▶';
    }
  }

  if (playBtn) playBtn.addEventListener('click', startGame);
  if (startBtn) startBtn.addEventListener('click', startGame);

  function drawPlayer(x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Glowing catch basket
    ctx.beginPath();
    ctx.ellipse(0, 8, 38, 14, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212, 248, 56, 0.2)';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#D4F838';
    ctx.stroke();

    // Purple Hoodie Body
    ctx.fillStyle = '#7C3AED';
    ctx.beginPath();
    ctx.roundRect(-22, 10, 44, 28, 8);
    ctx.fill();

    // Head
    ctx.fillStyle = '#FCD34D';
    ctx.beginPath();
    ctx.arc(0, -6, 16, 0, Math.PI * 2);
    ctx.fill();

    // Dark Anime Hair
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(0, -10, 17, Math.PI, Math.PI * 2);
    ctx.lineTo(16, -4);
    ctx.lineTo(8, -6);
    ctx.lineTo(0, -2);
    ctx.lineTo(-8, -6);
    ctx.lineTo(-16, -4);
    ctx.closePath();
    ctx.fill();

    // Headphones with Neon Lime Accent
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(-16, -6, 5, 0, Math.PI * 2);
    ctx.arc(16, -6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#D4F838';
    ctx.beginPath();
    ctx.arc(0, -10, 18, Math.PI + 0.3, -0.3);
    ctx.stroke();

    // Friendly Eyes & Wink
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(5, -6, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Wink Left
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-5, -6, 3, Math.PI * 0.2, Math.PI * 0.9);
    ctx.stroke();

    // Smiling Mouth
    ctx.beginPath();
    ctx.arc(0, -1, 4, 0, Math.PI);
    ctx.stroke();

    ctx.restore();
  }

  function loop(now) {
    if (gameState !== 'playing') return;

    // Movement
    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;
    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));

    // Clear Canvas
    ctx.fillStyle = '#080C14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Spawn items
    if (now - lastSpawn > 600 - Math.min(300, score * 0.5)) {
      spawnItem();
      lastSpawn = now;
    }

    // Update & Draw Items
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      it.y += it.speed;
      it.angle += it.spin;

      ctx.save();
      ctx.translate(it.x, it.y);
      ctx.rotate(it.angle);

      if (it.type === 'star') {
        ctx.fillStyle = it.color;
        ctx.shadowColor = it.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          ctx.lineTo(Math.cos((18 + s * 72) * Math.PI / 180) * 16, -Math.sin((18 + s * 72) * Math.PI / 180) * 16);
          ctx.lineTo(Math.cos((54 + s * 72) * Math.PI / 180) * 7, -Math.sin((54 + s * 72) * Math.PI / 180) * 7);
        }
        ctx.closePath();
        ctx.fill();
      } else if (it.type === 'gem') {
        ctx.fillStyle = it.color;
        ctx.shadowColor = it.color;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(0, -16);
        ctx.lineTo(14, 0);
        ctx.lineTo(0, 16);
        ctx.lineTo(-14, 0);
        ctx.closePath();
        ctx.fill();
      } else if (it.type === 'scroll') {
        ctx.fillStyle = it.color;
        ctx.shadowColor = it.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(-12, -10, 24, 20);
        ctx.fillStyle = '#000000';
        ctx.fillRect(-8, -4, 16, 2);
        ctx.fillRect(-8, 2, 12, 2);
      } else {
        ctx.fillStyle = it.color;
        ctx.shadowColor = it.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, 2, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(-3, -16, 6, 8);
      }
      ctx.restore();

      // Check collision
      const catchDistX = Math.abs(it.x - player.x);
      const catchDistY = Math.abs(it.y - player.y);

      if (catchDistX < 36 && catchDistY < 24) {
        if (it.type === 'bomb') {
          score = Math.max(0, score + it.val);
          combo = 1;
          ArcadeAudio.hitBomb();
          addExplosion(it.x, it.y, '#EF4444');
          addFloatingText(it.x, it.y - 10, '-15 DEADLINE!', '#EF4444');
        } else {
          const addedScore = it.val * combo;
          score += addedScore;
          if (it.type === 'gem') {
            combo = Math.min(5, combo + 1);
            ArcadeAudio.gemItem();
          } else {
            ArcadeAudio.catchItem();
          }
          addExplosion(it.x, it.y, it.color);
          addFloatingText(it.x, it.y - 10, `+${addedScore} ${combo > 1 ? 'x' + combo : ''}`, it.color);
        }

        if (scoreEl) scoreEl.textContent = score;
        if (comboEl) comboEl.textContent = `x${combo}`;
        items.splice(i, 1);
        continue;
      }

      if (it.y > canvas.height + 30) {
        items.splice(i, 1);
      }
    }

    // Update Particles
    for (let p = particles.length - 1; p >= 0; p--) {
      const pt = particles[p];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.alpha -= 0.035;
      if (pt.alpha <= 0) {
        particles.splice(p, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, pt.alpha);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Floating Texts
    for (let f = floatingTexts.length - 1; f >= 0; f--) {
      const ft = floatingTexts[f];
      ft.y += ft.vy;
      ft.alpha -= 0.03;
      if (ft.alpha <= 0) {
        floatingTexts.splice(f, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 14px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    // Draw Player
    drawPlayer(player.x, player.y);

    animId = requestAnimationFrame(loop);
  }

  // Pre-render ready state
  ctx.fillStyle = '#080C14';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPlayer(canvas.width / 2, player.y);

  // Setup Trivia Mode
  setupTriviaMode();
}

// ================= TRIVIA KEPEMIMPINAN OSIS =================
const triviaQuestions = [
  {
    q: "Apa fungsi utama dari Badan Pengurus Harian (BPH) dalam struktur kepengurusan OSSAGA?",
    options: [
      "Mengkoordinasi, mengarahkan, dan mengevaluasi seluruh kebijakan serta program kerja sekbid",
      "Hanya bertugas membuat absensi dan daftar hadir kegiatan harian",
      "Memutuskan segala hal sendiri tanpa musyawarah dengan perwakilan sekbid",
      "Mengurus perlengkapan panggung saat acara sekolah berlangsung"
    ],
    answer: 0,
    hint: "BPH merupakan pucuk kepemimpinan koordinatif yang menjaga visi misi dan sinergi 10 Seksi Bidang."
  },
  {
    q: "Jika terjadi perbedaan pendapat antardivisi saat menyusun jadwal proker, langkah kepemimpinan terbaik adalah...",
    options: [
      "Membatalkan seluruh kegiatan yang memicu perbedaan pendapat",
      "Musyawarah mufakat untuk mencari titik temu dan kesepakatan terbaik bagi sekolah",
      "Menentukan pemenang berdasarkan siapa yang bersuara paling keras",
      "Mengabaikan masalah tersebut sampai selesai dengan sendirinya"
    ],
    answer: 1,
    hint: "Asas musyawarah untuk mufakat adalah identitas sejati calon pemimpin Pancasilais di SMA Negeri 1 SAGARA."
  },
  {
    q: "Siapa saja yang berhak mengirimkan aspirasi, kritik, dan saran melalui Kotak Aspirasi Publik OSSAGA?",
    options: [
      "Seluruh siswa-siswi SMAN 1 SAGARA secara terbuka dan bebas tanpa wajib login",
      "Hanya 30 anggota inti fungsionaris OSIS yang memiliki NIS terdaftar",
      "Hanya guru pembina dan kepala sekolah",
      "Hanya perwakilan ketua kelas (MPK)"
    ],
    answer: 0,
    hint: "Portal OSSAGA menjunjung tinggi transparansi dan demokrasi: seluruh siswa bebas bersuara kapan saja!"
  },
  {
    q: "Program Latihan Dasar Kepemimpinan Siswa (LDKS) diselenggarakan dengan tujuan utama untuk...",
    options: [
      "Menambah beban tugas harian siswa baru",
      "Membentuk karakter disiplin, integritas, dan kemampuan manajemen organisasi bagi kader pemimpin",
      "Menghabiskan anggaran sisa tahunan OSIS",
      "Mengadakan rekreasi tanpa materi kepemimpinan"
    ],
    answer: 1,
    hint: "LDKS adalah kawah candradimuka pengkaderan fungsionaris OSIS yang tangguh dan berkarakter mulia."
  },
  {
    q: "Nilai utama yang diusung oleh Kabinet 'Nawa Cita Nawasena' OSSAGA 2026/2027 adalah...",
    options: [
      "Monoton, kaku, dan menutup diri dari perkembangan digital",
      "Kreatif, Kolaboratif, Berintegritas, dan Menginspirasi",
      "Mengutamakan popularitas pribadi pengurus di atas kepentingan bersama",
      "Bekerja secara individual tanpa koordinasi tim"
    ],
    answer: 1,
    hint: "Nawa Cita Nawasena bermakna 9 harapan menuju masa depan yang cerah, kreatif, dan berintegritas tinggi."
  }
];

let currentQuestionIdx = 0;
let triviaScore = 0;
let answered = false;

function setupTriviaMode() {
  currentQuestionIdx = 0;
  triviaScore = 0;
  answered = false;
  renderTriviaQuestion();
}

function renderTriviaQuestion() {
  const container = document.getElementById('trivia-container');
  if (!container) return;

  if (currentQuestionIdx >= triviaQuestions.length) {
    let badge = 'Calon Pemimpin Hebat! 🌟';
    if (triviaScore === 5) badge = 'Pemimpin Visioner Paripurna! 👑';
    else if (triviaScore >= 3) badge = 'Kader Berdedikasi Tinggi! 🚀';

    container.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🏆</div>
        <div class="trivia-question-number" style="font-size: 0.95rem;">HASIL KUIS KEPEMIMPINAN</div>
        <h3 style="font-size: 1.8rem; font-weight: 900; color: #FFFFFF; margin-bottom: 8px;">${badge}</h3>
        <p style="color: var(--text-muted); font-size: 1.05rem; margin-bottom: 24px;">
          Kamu berhasil menjawab benar <strong style="color: var(--neon-lime); font-size: 1.4rem;">${triviaScore}</strong> dari <strong style="color: #fff;">${triviaQuestions.length}</strong> pertanyaan!
        </p>
        <button class="btn-lime" onclick="setupTriviaMode()" style="padding: 12px 30px; font-size: 0.95rem;">
          Ulangi Kuis ↺
        </button>
      </div>
    `;
    return;
  }

  const q = triviaQuestions[currentQuestionIdx];
  answered = false;

  const labels = ['A', 'B', 'C', 'D'];

  container.innerHTML = `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <span class="trivia-question-number">PERTANYAAN ${currentQuestionIdx + 1} DARI ${triviaQuestions.length}</span>
        <span style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--neon-lime); font-weight: 700;">Skor: ${triviaScore * 20}/100</span>
      </div>
      <h3 class="trivia-question-text">${q.q}</h3>
      <div class="trivia-options-grid">
        ${q.options.map((opt, i) => `
          <button class="trivia-opt-btn" onclick="handleAnswerOption(${i})" id="trivia-opt-${i}">
            <span class="trivia-opt-label">${labels[i]}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
      <div id="trivia-explanation" style="display: none; padding: 14px 18px; border-radius: var(--radius-sm); font-size: 0.88rem; line-height: 1.5; margin-top: 14px;"></div>
      <div id="trivia-next-wrap" style="display: none; margin-top: 20px; text-align: right;">
        <button class="btn-dark-pill" onclick="nextTriviaQuestion()" style="padding: 10px 24px; font-size: 0.85rem; border-color: var(--neon-lime); color: var(--neon-lime);">
          Lanjut ke Pertanyaan Berikutnya →
        </button>
      </div>
    </div>
  `;
}

window.handleAnswerOption = function(idx) {
  if (answered) return;
  answered = true;
  ArcadeAudio.init();

  const q = triviaQuestions[currentQuestionIdx];
  const expBox = document.getElementById('trivia-explanation');
  const nextWrap = document.getElementById('trivia-next-wrap');
  const selectedBtn = document.getElementById(`trivia-opt-${idx}`);
  const correctBtn = document.getElementById(`trivia-opt-${q.answer}`);

  if (idx === q.answer) {
    triviaScore++;
    ArcadeAudio.catchItem();
    if (selectedBtn) selectedBtn.classList.add('correct');
    if (expBox) {
      expBox.style.display = 'block';
      expBox.style.background = 'rgba(16, 185, 129, 0.15)';
      expBox.style.border = '1px solid #10B981';
      expBox.style.color = '#34D399';
      expBox.innerHTML = `<strong>Tepat sekali!</strong> ${q.hint}`;
    }
  } else {
    ArcadeAudio.hitBomb();
    if (selectedBtn) selectedBtn.classList.add('wrong');
    if (correctBtn) correctBtn.classList.add('correct');
    if (expBox) {
      expBox.style.display = 'block';
      expBox.style.background = 'rgba(239, 68, 68, 0.15)';
      expBox.style.border = '1px solid #EF4444';
      expBox.style.color = '#F87171';
      expBox.innerHTML = `<strong>Kurang tepat.</strong> ${q.hint}`;
    }
  }

  if (nextWrap) nextWrap.style.display = 'block';
};

window.nextTriviaQuestion = function() {
  currentQuestionIdx++;
  renderTriviaQuestion();
};
