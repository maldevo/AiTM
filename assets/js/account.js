/* ============================================================
   SHADOWPROOF — account settings (local profile)
   ============================================================ */
(function () {
  const store = window.SP.store;
  const ui = window.SP.ui;
  const SP = window.SP;
  let user = null;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    user = ui.guard('account.html');
    if (!user) return;
    ui.mountHeader({ active: '' });
    ui.bindThemeToggles();
    user = store.currentUser();
    render();
  }

  function render() {
    const dash = store.dashboard(user.id);
    const cert = dash.certificate;
    const rail = document.getElementById('sideRail');
    if (rail) {
      rail.innerHTML = `
        <div class="side-label">Your workspace</div>
        <a class="side-link" href="dashboard.html">${ui.icon('grid')} Overview</a>
        <a class="side-link" href="dashboard.html#modules">${ui.icon('layers')} Modules <span class="count">${dash.stats.totalModules}</span></a>
        <a class="side-link" href="dashboard.html#badges">${ui.icon('award')} Badges <span class="count">${dash.stats.badges}</span></a>
        <a class="side-link" href="certificate.html">${ui.icon('certificate')} Certificate</a>
        <a class="side-link active" href="account.html">${ui.icon('settings')} Settings</a>
        ${user.role === 'admin' ? `<a class="side-link" href="admin.html">${ui.icon('users')} Analytics</a>` : ''}
        <div class="side-spacer"></div>
        <div class="side-card">
          <div class="sc-title">${ui.icon('shieldCheck')} Local profile</div>
          <p>${ui.storageLabel(store.storageBytes())} stored in this browser. No server, no tracking.</p>
          <div class="progress" style="margin-top:10px"><span style="width:${dash.stats.percent}%"></span></div>
        </div>`;
    }

    const root = document.getElementById('accountRoot');
    if (!root) return;
    root.innerHTML = `
      <div class="app-head">
        <div>
          <div class="eyebrow">Account</div>
          <h1>Settings &amp; <em class="serif" style="font-style:italic">privacy.</em></h1>
          <p class="sub">Everything here lives on this device. Nothing is transmitted or verified.</p>
        </div>
        <div class="row"><span class="pill ${user.role === 'admin' ? 'pill-violet' : 'pill-neutral'}">${user.role === 'admin' ? 'Workspace admin' : 'Learner'}</span><span class="pill">${dash.stats.completedCount}/${dash.stats.totalModules} modules</span></div>
      </div>

      <div class="settings-grid">
        <section class="settings-card">
          <div class="settings-head"><div><h3>${ui.icon('user')} Profile</h3><p>The name shown on your badges and certificate.</p></div><span class="avatar avatar-lg">${ui.escapeHtml(ui.initials(user.name))}</span></div>
          <form id="profileForm" class="auth-form" novalidate>
            <div class="row-2">
              <div class="field"><label for="pname">Full name</label><input class="input" id="pname" value="${ui.escapeHtml(user.name)}" required></div>
              <div class="field"><label for="pdept">Department</label><input class="input" id="pdept" value="${ui.escapeHtml(user.dept || '')}" placeholder="Optional"></div>
            </div>
            <div class="field"><label for="pemail">Email</label><input class="input" id="pemail" value="${ui.escapeHtml(user.email)}" disabled><span class="help">The local identifier for this profile. It cannot be changed.</span></div>
            <div class="row" style="justify-content:space-between">
              <span class="fine" style="font-size:10.5px;color:var(--text-4)">Joined ${ui.formatDate(user.createdAt)}</span>
              <button class="btn btn-primary btn-sm" type="submit">Save profile</button>
            </div>
          </form>
        </section>

        <section class="settings-card">
          <div class="settings-head"><div><h3>${ui.icon('key')} Password</h3><p>Protects this local profile from casual access on a shared device.</p></div></div>
          <form id="passwordForm" class="auth-form" novalidate>
            <div class="field"><label for="currentPw">Current password</label><input class="input" id="currentPw" type="password" autocomplete="current-password" required></div>
            <div class="row-2">
              <div class="field"><label for="newPw">New password</label><input class="input" id="newPw" type="password" autocomplete="new-password" required></div>
              <div class="field"><label for="confirmPw">Confirm</label><input class="input" id="confirmPw" type="password" autocomplete="new-password" required></div>
            </div>
            <div class="password-meter" id="meter" data-score="0"><div class="pm-bars"><span></span><span></span><span></span><span></span></div><div class="pm-label"><span id="meterLabel">Use 8+ characters</span><span>Local only</span></div></div>
            <div class="row" style="justify-content:flex-end"><button class="btn btn-primary btn-sm" type="submit">Update password</button></div>
          </form>
        </section>

        <section class="settings-card">
          <div class="settings-head"><div><h3>${ui.icon('sun')} Appearance</h3><p>Both palettes are fully designed. Your choice is saved on this device.</p></div></div>
          <div class="theme-choices" id="themeChoices">
            <button class="theme-choice" data-theme-choice="light" type="button"><span class="tc-swatch light"></span><span><strong>Light</strong><small>Warm, paper-like</small></span></button>
            <button class="theme-choice" data-theme-choice="dark" type="button"><span class="tc-swatch dark"></span><span><strong>Dark</strong><small>Low light, high focus</small></span></button>
            <button class="theme-choice" data-theme-choice="system" type="button"><span class="tc-swatch system"></span><span><strong>System</strong><small>Follow this device</small></span></button>
          </div>
        </section>

        <section class="settings-card">
          <div class="settings-head"><div><h3>${ui.icon('database')} Your data</h3><p>${ui.storageLabel(store.storageBytes())} stored locally across ${dash.stats.completedCount} completed modules and ${dash.stats.badges} badges.</p></div></div>
          <div class="settings-actions">
            <button class="btn btn-ghost btn-sm" id="exportData" type="button">${ui.icon('download')} Export my data (JSON)</button>
            <button class="btn btn-ghost btn-sm" id="resetProgress" type="button">${ui.icon('rotate')} Reset learning progress</button>
            <button class="btn btn-ghost btn-sm" id="signOut" type="button">${ui.icon('logout')} Sign out</button>
          </div>
          <div class="settings-note">${ui.icon('info')} <span>This is a training prototype, not a corporate identity system. Clearing browser data deletes the workspace permanently.</span></div>
        </section>
      </div>`;

    wire(dash);
    paintTheme();
  }

  function wire(dash) {
    const profile = document.getElementById('profileForm');
    profile.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('pname').value;
      const dept = document.getElementById('pdept').value;
      const res = store.updateProfile({ name, dept });
      if (!res.ok) { ui.toast(res.error, 'error'); return; }
      user = store.currentUser();
      ui.mountHeader({ active: '' });
      ui.bindThemeToggles();
      ui.toast('Profile updated.', 'success');
      render();
    });

    const pw = document.getElementById('passwordForm');
    const newPw = document.getElementById('newPw');
    newPw.addEventListener('input', () => {
      const score = store.passwordStrength(newPw.value);
      const meter = document.getElementById('meter');
      const label = document.getElementById('meterLabel');
      if (!meter || !label) return;
      meter.dataset.score = String(score);
      label.textContent = ['Use 8+ characters', 'Weak', 'Fair', 'Good', 'Strong'][score];
    });
    pw.addEventListener('submit', async (e) => {
      e.preventDefault();
      const current = document.getElementById('currentPw').value;
      const next = newPw.value;
      const confirm = document.getElementById('confirmPw').value;
      if (!current || !next) { ui.toast('Fill in the current and new password.', 'error'); return; }
      if (next !== confirm) { ui.toast('The new passwords do not match.', 'error'); return; }
      if (next.length < 8) { ui.toast('Use at least 8 characters.', 'error'); return; }
      const res = await store.changePassword(current, next);
      if (!res.ok) { ui.toast(res.error, 'error'); return; }
      pw.reset();
      document.getElementById('meter').dataset.score = '0';
      document.getElementById('meterLabel').textContent = 'Use 8+ characters';
      ui.toast('Password updated for this local profile.', 'success');
    });

    document.querySelectorAll('[data-theme-choice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const choice = btn.dataset.themeChoice;
        if (choice === 'system') window.SP.theme.reset();
        else window.SP.theme.set(choice);
        paintTheme();
      });
    });

    const exp = document.getElementById('exportData');
    exp.addEventListener('click', () => {
      const data = store.exportUserData(user.id);
      ui.downloadFile(`shadowproof-${user.email.split('@')[0]}-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2), 'application/json');
      ui.toast('Your local training record was exported.', 'success');
    });

    const reset = document.getElementById('resetProgress');
    reset.addEventListener('click', async () => {
      const ok = await ui.confirm({ title: 'Reset learning progress?', body: 'This clears your module progress, badges, and attempt history on this device. Your profile remains. **This cannot be undone.**', confirmText: 'Reset progress', danger: true });
      if (!ok) return;
      store.resetProgress(user.id);
      ui.toast('Learning progress reset.', 'success');
      render();
    });

    const out = document.getElementById('signOut');
    out.addEventListener('click', () => {
      if (!window.confirm('Sign out of this local workspace? Your progress stays saved on this device.')) return;
      store.logout();
      location.href = 'index.html';
    });
  }

  function paintTheme() {
    const current = window.SP.theme.get();
    let stored = null;
    try { stored = localStorage.getItem('sp:theme:v1'); } catch (e) {}
    const active = stored ? current : 'system';
    document.querySelectorAll('[data-theme-choice]').forEach((b) => b.classList.toggle('active', b.dataset.themeChoice === active));
  }
})();
