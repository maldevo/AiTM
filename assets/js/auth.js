/* ============================================================
   SHADOWPROOF — sign in / create local profile
   ============================================================ */
(function () {
  const store = window.SP.store;
  const ui = window.SP.ui;
  let mode = 'signin';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    if (ui.redirectIfAuthed()) return;
    ui.mountHeader({ active: '' });
    ui.bindThemeToggles();
    const params = new URLSearchParams(location.search);
    mode = params.get('mode') === 'register' ? 'register' : 'signin';
    render();
    initArt();
  }

  function safeNext() {
    const params = new URLSearchParams(location.search);
    const next = params.get('next');
    if (!next) return null;
    if (next.startsWith('//') || next.includes(':') || !/^[a-z0-9_.-]+(\.html)?([?#].*)?$/i.test(next)) return null;
    return next;
  }

  function go() {
    const next = safeNext();
    location.replace(next || 'dashboard.html');
  }

  function render() {
    const box = document.getElementById('authBox');
    if (!box) return;
    const profiles = store.listLocalProfiles();
    const firstEver = profiles.length === 0;
    box.innerHTML = `
      <div class="ab-head">
        <h2>${mode === 'signin' ? 'Welcome back.' : 'Create your workspace.'}</h2>
        <p>${mode === 'signin' ? 'Sign in to continue your training on this device.' : 'One local profile. No email verification. No server.'}</p>
      </div>
      <div class="auth-tabs" role="tablist">
        <button class="auth-tab ${mode === 'signin' ? 'active' : ''}" data-mode="signin" type="button" role="tab" aria-selected="${mode === 'signin'}">Sign in</button>
        <button class="auth-tab ${mode === 'register' ? 'active' : ''}" data-mode="register" type="button" role="tab" aria-selected="${mode === 'register'}">Create account</button>
      </div>
      <div id="authError" class="form-error" role="alert"></div>
      ${mode === 'signin' ? renderSignin(profiles) : renderRegister(firstEver)}
      <div class="auth-note">
        ${ui.icon('shieldCheck')}
        <span><strong>Local-first privacy.</strong> Your profile, progress, and badges are stored in this browser's local storage. Nothing is sent to a server, and clearing browser data removes the workspace.</span>
      </div>`;

    box.querySelectorAll('[data-mode]').forEach((tab) => {
      tab.addEventListener('click', () => {
        mode = tab.dataset.mode;
        const url = new URL(location.href);
        if (mode === 'register') url.searchParams.set('mode', 'register'); else url.searchParams.delete('mode');
        history.replaceState({}, '', url);
        render();
      });
    });
    if (mode === 'signin') wireSignin(profiles);
    else wireRegister(firstEver);
  }

  function renderSignin(profiles) {
    const profileList = profiles.length
      ? `<div class="profile-list">
          <div class="eyebrow" style="margin-bottom:2px">Profiles on this device</div>
          ${profiles.slice(0, 5).map((p) => `<button class="profile-row" data-profile="${ui.escapeHtml(p.email)}" type="button">
            <span class="avatar">${ui.escapeHtml(ui.initials(p.name))}</span>
            <span><span class="pr-name">${ui.escapeHtml(p.name)}</span><span class="pr-meta" style="display:block">${ui.escapeHtml(p.email)}</span></span>
            <span class="pr-role pill ${p.role === 'admin' ? 'pill-violet' : 'pill-neutral'}">${p.role === 'admin' ? 'Admin' : 'Learner'}</span>
            <span class="go">${ui.icon('chevronRight')}</span>
          </button>`).join('')}
        </div>`
      : '';
    return `<form class="auth-form" id="signinForm" novalidate>
      ${profileList}
      <div class="field" id="f-email">
        <label for="email">Email or username</label>
        <input class="input" id="email" name="email" type="email" autocomplete="username" placeholder="you@company.com" required>
        <span class="help">The email you used when creating this workspace.</span>
      </div>
      <div class="field" id="f-password">
        <label for="password">Password</label>
        <div class="input-wrap">
          <input class="input" id="password" name="password" type="password" autocomplete="current-password" placeholder="Your password" required>
          <button class="peek" type="button" data-peek="password" aria-label="Show password">${ui.icon('eye')}</button>
        </div>
      </div>
      <div class="submit-row"><button class="btn btn-primary btn-lg" type="submit" id="submitBtn">Sign in ${ui.icon('arrowRight')}</button></div>
      <div class="auth-alt">New here? <button type="button" data-mode="register">Create a local account</button></div>
    </form>`;
  }

  function renderRegister(firstEver) {
    return `<form class="auth-form" id="registerForm" novalidate>
      ${firstEver ? `<div class="admin-banner" style="margin-bottom:0">${ui.icon('shieldCheck')}<span><strong>First account.</strong> This profile becomes the workspace admin and can view local team analytics.</span></div>` : ''}
      <div class="field" id="f-name">
        <label for="name">Full name</label>
        <input class="input" id="name" name="name" type="text" autocomplete="name" placeholder="Alex Chen" required>
      </div>
      <div class="row-2">
        <div class="field" id="f-email">
          <label for="email">Email</label>
          <input class="input" id="email" name="email" type="email" autocomplete="email" placeholder="you@company.com" required>
        </div>
        <div class="field" id="f-dept">
          <label for="dept">Department <span style="color:var(--text-4);font-weight:400">(optional)</span></label>
          <input class="input" id="dept" name="dept" type="text" autocomplete="organization-title" placeholder="Finance">
        </div>
      </div>
      <div class="field" id="f-password">
        <label for="password">Password</label>
        <div class="input-wrap">
          <input class="input" id="password" name="password" type="password" autocomplete="new-password" placeholder="At least 8 characters" required>
          <button class="peek" type="button" data-peek="password" aria-label="Show password">${ui.icon('eye')}</button>
        </div>
        <div class="password-meter" id="meter" data-score="0">
          <div class="pm-bars"><span></span><span></span><span></span><span></span></div>
          <div class="pm-label"><span id="meterLabel">Use 8+ characters</span><span>Local only</span></div>
        </div>
      </div>
      <div class="field" id="f-confirm">
        <label for="confirm">Confirm password</label>
        <div class="input-wrap">
          <input class="input" id="confirm" name="confirm" type="password" autocomplete="new-password" placeholder="Repeat password" required>
          <button class="peek" type="button" data-peek="confirm" aria-label="Show password">${ui.icon('eye')}</button>
        </div>
      </div>
      <label class="checkbox" style="margin-top:2px">
        <input type="checkbox" id="ack" required>
        <span>I understand this workspace is stored only in this browser and is not a corporate identity system.</span>
      </label>
      <div class="submit-row"><button class="btn btn-primary btn-lg" type="submit" id="submitBtn">Create account ${ui.icon('arrowRight')}</button></div>
      <div class="auth-alt">Already have a profile? <button type="button" data-mode="signin">Sign in</button></div>
    </form>`;
  }

  function wireSignin(profiles) {
    document.querySelectorAll('[data-profile]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const email = document.getElementById('email');
        email.value = btn.dataset.profile;
        const pass = document.getElementById('password');
        pass.focus();
        ui.toast('Profile selected. Enter its password to continue.', 'info');
      });
    });
    wirePeeks();
    const form = document.getElementById('signinForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      if (!email || !password) { showError('Enter your email and password to continue.'); return; }
      setLoading(true, 'Signing in…');
      const res = await store.login(email, password);
      if (!res.ok) { setLoading(false); showError(res.error); return; }
      ui.toast(`Welcome back, ${res.user.name.split(' ')[0]}.`, 'success');
      setTimeout(go, 200);
    });
  }

  function wireRegister(firstEver) {
    wirePeeks();
    const form = document.getElementById('registerForm');
    const password = document.getElementById('password');
    password.addEventListener('input', () => updateMeter(password.value));
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const dept = document.getElementById('dept').value;
      const pass = password.value;
      const confirm = document.getElementById('confirm').value;
      const ack = document.getElementById('ack').checked;
      if (!name.trim() || !email.trim() || !pass) { showError('Fill in your name, email, and password.'); return; }
      if (!store.validEmail(email)) { showError('Enter a valid email address.'); return; }
      if (pass.length < 8) { showError('Use a password with at least 8 characters.'); return; }
      if (pass !== confirm) { showError('The two passwords do not match.'); return; }
      if (!ack) { showError('Please acknowledge the local storage notice.'); return; }
      setLoading(true, 'Creating workspace…');
      const res = await store.register({ name, email, dept, password: pass });
      if (!res.ok) {
        setLoading(false);
        showError(Object.values(res.errors)[0] || 'Could not create the account.');
        return;
      }
      sessionStorage.setItem('sp:welcome', res.isFirst ? 'admin' : 'learner');
      setTimeout(go, 200);
    });
  }

  function updateMeter(value) {
    const score = store.passwordStrength(value);
    const meter = document.getElementById('meter');
    const label = document.getElementById('meterLabel');
    if (!meter || !label) return;
    meter.dataset.score = String(score);
    const labels = ['Use 8+ characters', 'Weak', 'Fair', 'Good', 'Strong'];
    label.textContent = labels[score] || labels[0];
  }

  function wirePeeks() {
    document.querySelectorAll('[data-peek]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.peek);
        if (!input) return;
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = ui.icon(show ? 'x' : 'eye');
        btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
    });
  }

  function setLoading(loading, text) {
    const btn = document.getElementById('submitBtn');
    if (!btn) return;
    if (loading) {
      btn.disabled = true;
      btn.dataset.original = btn.innerHTML;
      btn.innerHTML = `${ui.icon('loader')} ${text || 'Working…'}`;
      btn.style.opacity = '.75';
    } else {
      btn.disabled = false;
      if (btn.dataset.original) btn.innerHTML = btn.dataset.original;
      btn.style.opacity = '';
    }
  }

  function showError(message) {
    const box = document.getElementById('authError');
    if (!box) return;
    box.className = 'form-error show';
    box.innerHTML = `${ui.icon('circleAlert')}<span>${ui.escapeHtml(message)}</span>`;
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideError() {
    const box = document.getElementById('authError');
    if (box) box.classList.remove('show');
  }

  function initArt() {
    const rows = [...document.querySelectorAll('.ap-row')];
    if (!rows.length) return;
    rows[0]?.classList.add('on');
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rows.forEach((r) => r.classList.add('on'));
      return;
    }
    let i = 0;
    setInterval(() => {
      rows.forEach((r, n) => r.classList.toggle('on', n === i));
      i = (i + 1) % rows.length;
    }, 1800);
  }
})();
