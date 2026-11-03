/* ============================================================
   SHADOWPROOF — shared UI helpers
   ============================================================ */
(function () {
  const store = window.SP.store;

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function rich(text) {
    let out = escapeHtml(text);
    out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    out = out.replace(/\n/g, '<br>');
    return out;
  }

  function initials(name) {
    return String(name || '?')
      .trim()
      .split(/\s+/)
      .map((n) => n[0] || '')
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  function icon(name, cls) { return window.SP.icon(name, cls); }

  function brand(size) {
    return `<a class="brand" href="index.html" aria-label="SHADOWPROOF home">
      <span class="brand-mark">${window.SP.brandMark}</span>
      <span class="brand-name">Shadowproof<small>ADVERSARIAL TRAINING</small></span>
    </a>`;
  }

  function navLinks(active, user) {
    const links = user
      ? [
          { href: 'dashboard.html', label: 'Dashboard', key: 'dashboard' },
          { href: 'dashboard.html#modules', label: 'Modules', key: 'modules' },
          { href: 'roadmap.html', label: 'Roadmap', key: 'roadmap' }
        ]
      : [
          { href: 'index.html#how', label: 'How it works', key: 'how' },
          { href: 'index.html#modules', label: 'Modules', key: 'modules' },
          { href: 'index.html#explainer', label: 'Attack library', key: 'explainer' },
          { href: 'roadmap.html', label: 'Roadmap', key: 'roadmap' }
        ];
    if (user && user.role === 'admin') {
      links.splice(2, 0, { href: 'admin.html', label: 'Analytics', key: 'admin' });
    }
    return links.map((l) => `<a class="nav-link ${active === l.key ? 'active' : ''}" href="${l.href}">${l.label}</a>`).join('');
  }

  function mountHeader(opts) {
    const options = opts || {};
    const active = options.active || '';
    const user = store.currentUser();
    const el = document.getElementById('siteHeader');
    if (!el) return user;
    const authArea = user
      ? `<div class="user-menu" id="userMenu">
          <button class="user-trigger" id="userTrigger" aria-haspopup="true" aria-expanded="false">
            <span class="avatar">${escapeHtml(initials(user.name))}</span>
            <span class="user-name">${escapeHtml(user.name.split(' ')[0])}</span>
            ${icon('chevronDown', 'chev')}
          </button>
          <div class="user-dropdown" id="userDropdown" role="menu">
            <div class="who">
              <strong>${escapeHtml(user.name)}</strong>
              <span>${escapeHtml(user.email)}</span>
            </div>
            <a href="dashboard.html" role="menuitem">${icon('grid')} Dashboard</a>
            <a href="dashboard.html#badges" role="menuitem">${icon('award')} Badges</a>
            <a href="certificate.html" role="menuitem">${icon('certificate')} Certificate</a>
            <a href="account.html" role="menuitem">${icon('settings')} Account settings</a>
            ${user.role === 'admin' ? `<a href="admin.html" role="menuitem">${icon('users')} Workspace analytics</a>` : ''}
            <button type="button" class="danger" id="signOutBtn" role="menuitem">${icon('logout')} Sign out</button>
          </div>
        </div>`
      : `<a class="btn btn-ghost btn-sm" href="signin.html">Sign in</a>
         <a class="btn btn-primary btn-sm" href="signin.html?mode=register"><span class="btn-label">Start training</span><span class="arrow">→</span></a>`;

    el.innerHTML = `
      <header class="site-header">
        <div class="nav container">
          ${brand()}
          <nav class="nav-links" aria-label="Main navigation">${navLinks(active, user)}</nav>
          <div class="nav-actions">
            <button class="theme-toggle" data-theme-toggle type="button" aria-label="Toggle light and dark theme" title="Toggle theme">
              ${icon('sun', 'icon-sun')}${icon('moon', 'icon-moon')}
            </button>
            ${authArea}
            <button class="theme-toggle mobile-toggle" id="mobileToggle" type="button" aria-label="Open menu" aria-expanded="false">
              ${icon('menu')}
            </button>
          </div>
        </div>
      </header>
      <div class="mobile-menu" id="mobileMenu">
        ${navLinks(active, user)}
        ${user ? `<a href="certificate.html">${icon('certificate')} Certificate</a><a href="account.html">${icon('settings')} Account settings</a><button class="btn btn-ghost" id="mobileSignOut" type="button">Sign out</button>` : `<a href="signin.html">Sign in</a><a class="btn btn-primary" href="signin.html?mode=register">Start training</a>`}
      </div>`;

    const trigger = document.getElementById('userTrigger');
    const dropdown = document.getElementById('userDropdown');
    if (trigger && dropdown) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = dropdown.classList.toggle('open');
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', () => {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
      dropdown.addEventListener('click', (e) => e.stopPropagation());
    }
    const signOut = document.getElementById('signOutBtn');
    if (signOut) signOut.addEventListener('click', () => doSignOut());
    const mobileSignOut = document.getElementById('mobileSignOut');
    if (mobileSignOut) mobileSignOut.addEventListener('click', () => doSignOut());

    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        mobileToggle.innerHTML = open ? icon('x') : icon('menu');
      });
    }
    return user;
  }

  function doSignOut() {
    if (!window.confirm('Sign out of this local workspace? Your progress stays saved on this device.')) return;
    store.logout();
    window.location.href = 'index.html';
  }

  function bindThemeToggles() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-theme-toggle]');
      if (!btn) return;
      window.SP.theme.toggle();
    });
  }

  function toast(message, type, title) {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      stack.setAttribute('role', 'status');
      stack.setAttribute('aria-live', 'polite');
      document.body.appendChild(stack);
    }
    const el = document.createElement('div');
    const t = type || 'info';
    const ic = t === 'success' ? 'circleCheck' : t === 'error' ? 'circleAlert' : 'info';
    el.className = `toast ${t}`;
    el.innerHTML = `${icon(ic)}<div>${title ? `<strong>${escapeHtml(title)}</strong>` : ''}${escapeHtml(message)}</div>`;
    stack.appendChild(el);
    const remove = () => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 260);
    };
    setTimeout(remove, 4200);
    el.addEventListener('click', remove);
  }

  function initReveal(root) {
    const nodes = (root || document).querySelectorAll('[data-reveal]');
    if (!nodes.length) return;
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    nodes.forEach((n) => io.observe(n));
  }

  function formatDate(iso, opts) {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString(undefined, opts || { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) { return '—'; }
  }

  function formatDateTime(iso) {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    } catch (e) { return '—'; }
  }

  function relative(iso) {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000) return 'just now';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return formatDate(iso);
  }

  function plural(n, one, many) { return `${n} ${n === 1 ? one : (many || `${one}s`)}`; }

  function badgeSVG(module, size) {
    if (!module) return '';
    const accent = module.accent || 'var(--accent)';
    const num = String(module.num || '').slice(-2);
    const id = `spg-${module.id}`;
    const variant = (module.id.charCodeAt(0) + module.id.length) % 3;
    const rings = [
      `<circle cx="32" cy="32" r="25" fill="none" stroke="${accent}" stroke-width="1" opacity=".45" stroke-dasharray="2 4"/>`,
      `<circle cx="32" cy="32" r="25" fill="none" stroke="${accent}" stroke-width="1.2" opacity=".5"/><circle cx="32" cy="32" r="19" fill="none" stroke="${accent}" stroke-width=".6" opacity=".35"/>`,
      `<polygon points="32,6 55,19 55,45 32,58 9,45 9,19" fill="none" stroke="${accent}" stroke-width="1" opacity=".45"/>`
    ][variant];
    return `<svg class="badge-svg" width="${size || 64}" height="${size || 64}" viewBox="0 0 64 64" role="img" aria-label="${escapeHtml(module.title)} badge">
      <defs>
        <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${accent}" stop-opacity=".22"/>
          <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#${id})"/>
      ${rings}
      <circle cx="32" cy="32" r="14" fill="none" stroke="${accent}" stroke-width="1.4" opacity=".75"/>
      <text x="32" y="36.5" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="${accent}">${num}</text>
      <circle cx="32" cy="6.5" r="1.4" fill="${accent}"/>
      <circle cx="32" cy="57.5" r="1.4" fill="${accent}"/>
      <circle cx="6.5" cy="32" r="1.4" fill="${accent}"/>
      <circle cx="57.5" cy="32" r="1.4" fill="${accent}"/>
    </svg>`;
  }

  function openModal(html, opts) {
    const options = opts || {};
    let backdrop = document.getElementById('spModal');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'spModal';
      backdrop.className = 'modal-backdrop';
      backdrop.innerHTML = '<div class="modal" role="dialog" aria-modal="true"></div>';
      document.body.appendChild(backdrop);
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
      });
    }
    const modal = backdrop.querySelector('.modal');
    modal.innerHTML = `<div class="modal-head"><h3>${options.title || ''}</h3><button class="modal-close" type="button" aria-label="Close">${icon('x')}</button></div><div class="modal-body">${html}</div>`;
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelector('button, [href], input, select, textarea');
    if (focusable) setTimeout(() => focusable.focus(), 60);
    return modal;
  }

  function closeModal() {
    const backdrop = document.getElementById('spModal');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function confirmDialog({ title, body, confirmText, cancelText, danger }) {
    return new Promise((resolve) => {
      const modal = openModal(`
        <p style="font-size:13px;line-height:1.7;color:var(--text-2);margin-bottom:20px">${rich(body || '')}</p>
        <div class="row" style="justify-content:flex-end">
          <button class="btn btn-ghost" data-cancel type="button">${escapeHtml(cancelText || 'Cancel')}</button>
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-confirm type="button">${escapeHtml(confirmText || 'Confirm')}</button>
        </div>`, { title: title || 'Confirm' });
      modal.querySelector('[data-cancel]').addEventListener('click', () => { closeModal(); resolve(false); });
      modal.querySelector('[data-confirm]').addEventListener('click', () => { closeModal(); resolve(true); });
      const bd = document.getElementById('spModal');
      const onClose = (e) => { if (e.target === bd) resolve(false); };
      bd.addEventListener('click', onClose, { once: true });
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
    }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      return Promise.resolve(true);
    } catch (e) { return Promise.resolve(false); }
  }

  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type: type || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function guard(redirectTo) {
    const user = store.currentUser();
    if (!user) {
      const next = redirectTo || (location.pathname.split('/').pop() + location.hash);
      location.replace(`signin.html?next=${encodeURIComponent(next)}`);
      return null;
    }
    store.touchSession();
    return user;
  }

  function redirectIfAuthed() {
    const user = store.currentUser();
    if (user) {
      const params = new URLSearchParams(location.search);
      const next = params.get('next');
      location.replace(next && /^[a-z0-9_.-]+(\.html)?/i.test(next) && !next.startsWith('//') ? next : 'dashboard.html');
      return true;
    }
    return false;
  }

  function initialsAvatar(name, cls) {
    return `<span class="avatar ${cls || ''}">${escapeHtml(initials(name))}</span>`;
  }

  function mountFooter() {
    const el = document.getElementById('siteFooter');
    if (!el) return;
    el.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              ${brand()}
              <p>Adversarial security awareness for people who have real work to do. Sixteen short stories, one local workspace, zero data leaving this browser.</p>
            </div>
            <div class="footer-col">
              <h5>Learn</h5>
              <a href="dashboard.html#modules">All modules</a>
              <a href="dashboard.html#badges">Badge case</a>
              <a href="certificate.html">Certificate</a>
              <a href="index.html#explainer">Attack library</a>
            </div>
            <div class="footer-col">
              <h5>Workspace</h5>
              <a href="signin.html">Sign in</a>
              <a href="admin.html">Team analytics</a>
              <a href="account.html">Account settings</a>
              <a href="roadmap.html">2027 roadmap</a>
              <a href="legacy/index.html">Original prototypes</a>
            </div>
            <div class="footer-col">
              <h5>Trust</h5>
              <a href="index.html#privacy">Local-first privacy</a>
              <a href="index.html#accessibility">Accessibility</a>
              <a href="index.html#how">How it works</a>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} SHADOWPROOF — a security awareness prototype.</span>
            <span class="mono">LOCAL WORKSPACE · NO TRACKING · NO SERVER</span>
          </div>
        </div>
      </footer>`;
  }

  function ringSVG(percent, size, stroke, centerHtml, cls) {
    const s = size || 148;
    const r = 65;
    const circ = 2 * Math.PI * r;
    const p = Math.max(0, Math.min(100, percent || 0));
    return `<div class="ring ${cls || ''}" style="--p:${p};width:${s}px;height:${s}px">
      <svg viewBox="0 0 148 148" aria-hidden="true">
        <circle class="track" cx="74" cy="74" r="${r}" fill="none" stroke-width="7"/>
        <circle class="fill" cx="74" cy="74" r="${r}" fill="none" stroke-width="7" stroke-dasharray="${circ}" stroke-dashoffset="${circ - (circ * p / 100)}"/>
      </svg>
      <div class="ring-center">${centerHtml || `<span class="big">${p}%</span><span class="small">complete</span>`}</div>
    </div>`;
  }

  function confetti(colors) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const wrap = document.createElement('div');
    wrap.className = 'confetti';
    const palette = colors || ['#57e6a1', '#b79bff', '#ffc46b', '#7fb8ff', '#ff7a8a'];
    for (let i = 0; i < 44; i++) {
      const s = document.createElement('span');
      s.style.left = `${Math.random() * 100}%`;
      s.style.background = palette[i % palette.length];
      s.style.setProperty('--d', `${1.6 + Math.random() * 1.8}s`);
      s.style.setProperty('--delay', `${Math.random() * 0.5}s`);
      s.style.setProperty('--x', `${(Math.random() - 0.5) * 240}px`);
      s.style.width = `${4 + Math.random() * 6}px`;
      s.style.height = `${7 + Math.random() * 8}px`;
      wrap.appendChild(s);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 4600);
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function storageLabel(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  window.SP.ui = {
    escapeHtml,
    rich,
    initials,
    icon,
    brand,
    mountHeader,
    mountFooter,
    bindThemeToggles,
    toast,
    initReveal,
    formatDate,
    formatDateTime,
    relative,
    plural,
    badgeSVG,
    openModal,
    closeModal,
    confirm: confirmDialog,
    copyText,
    downloadFile,
    guard,
    redirectIfAuthed,
    initialsAvatar,
    ringSVG,
    confetti,
    scrollToId,
    storageLabel
  };
})();
