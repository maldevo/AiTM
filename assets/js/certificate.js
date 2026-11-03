/* ============================================================
   SHADOWPROOF — certificate of completion
   ============================================================ */
(function () {
  const store = window.SP.store;
  const ui = window.SP.ui;
  const SP = window.SP;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const user = ui.guard('certificate.html');
    if (!user) return;
    ui.mountHeader({ active: 'dashboard' });
    ui.mountFooter();
    ui.bindThemeToggles();
    const me = store.currentUser();
    const cert = store.certificate(me.id);
    const dash = store.dashboard(me.id);
    render(me, cert, dash);
  }

  function renderSide(user, dash) {
    const rail = document.getElementById('sideRail');
    if (!rail) return;
    rail.innerHTML = `
      <div class="side-label">Your workspace</div>
      <a class="side-link" href="dashboard.html">${ui.icon('grid')} Overview</a>
      <a class="side-link" href="dashboard.html#modules">${ui.icon('layers')} Modules</a>
      <a class="side-link" href="dashboard.html#badges">${ui.icon('award')} Badges</a>
      <a class="side-link active" href="certificate.html">${ui.icon('certificate')} Certificate</a>
      <a class="side-link" href="roadmap.html">${ui.icon('compass')} Roadmap</a>
      <a class="side-link" href="account.html">${ui.icon('settings')} Settings</a>
      <div class="side-spacer"></div>
      <div class="side-card">
        <div class="sc-title">${ui.icon('shieldCheck')} Local certificate</div>
        <p>Generated from your local progress. Not a professional certification or credential.</p>
      </div>`;
  }

  function render(user, cert, dash) {
    renderSide(user, dash);
    const root = document.getElementById('certRoot');
    if (!root) return;

    if (!cert.eligible) {
      const remaining = cert.total - cert.completedCount;
      root.innerHTML = `
        <div class="app-head"><div><div class="eyebrow">Certificate of completion</div><h1>Your certificate is <em class="serif" style="font-style:italic">in progress.</em></h1><p class="sub">Complete every module to unlock the printable certificate.</p></div></div>
        <div class="grid g2" style="align-items:start">
          <div class="panel" style="display:grid;gap:14px">
            <span class="pill pill-warn">${ui.icon('lock', 'icon-sm')} Locked · ${remaining} module${remaining === 1 ? '' : 's'} remaining</span>
            <div class="progress thick"><span style="width:${Math.round((cert.completedCount / cert.total) * 100)}%"></span></div>
            <div class="between"><span class="tag">${cert.completedCount} of ${cert.total} completed</span><span class="tag">${Math.round((cert.completedCount / cert.total) * 100)}%</span></div>
            <p class="lede" style="font-size:13px">A certificate is issued only when all sixteen modules have a passed knowledge check. There is no shortcut — the point is the habit, not the document.</p>
            <a class="btn btn-primary" href="dashboard.html#modules" style="width:max-content">Continue learning ${ui.icon('arrowRight')}</a>
          </div>
          <div class="card">
            <div class="panel-head"><h3>${ui.icon('award')} Completed modules</h3></div>
            <div class="drawer-modules">
              ${SP.SHADOWPROOF.modules.map((m) => {
                const p = store.getModuleProgress(user.id, m.id);
                const done = p && p.status === 'completed';
                return `<div class="drawer-module ${done ? 'done' : ''}"><span class="dot"></span><span>${ui.escapeHtml(m.title)}</span><span class="m-score">${done ? `${p.score}/${p.total}` : '—'}</span></div>`;
              }).join('')}
            </div>
          </div>
        </div>`;
      return;
    }

    root.innerHTML = `
      <div class="app-head">
        <div><div class="eyebrow">Certificate of completion</div><h1>Ready to <em class="serif" style="font-style:italic">print.</em></h1><p class="sub">Use your browser's print dialog to save a PDF or print a copy.</p></div>
        <div class="row"><button class="btn btn-ghost btn-sm" id="copyCert" type="button">${ui.icon('copy')} Copy ID</button><button class="btn btn-primary btn-sm" id="printCert" type="button">${ui.icon('printer')} Print / Save PDF</button></div>
      </div>
      <div class="cert-wrap">
        <article class="certificate" aria-label="Certificate of completion for ${ui.escapeHtml(user.name)}">
          <div class="cert-top">
            <div class="cert-brand"><span style="color:var(--accent);width:24px;height:24px;display:inline-flex">${window.SP.brandMark}</span> SHADOWPROOF</div>
            <div class="cert-kicker">Adversarial Training Suite · ${new Date().getFullYear()}</div>
          </div>
          <div class="cert-body">
            <div class="pretitle">Certificate of Completion</div>
            <h1>Security Awareness</h1>
            <div class="name">${ui.escapeHtml(cert.name)}</div>
            ${cert.dept ? `<div class="muted" style="font-size:11px">${ui.escapeHtml(cert.dept)}</div>` : ''}
            <p>Has completed all ${cert.total} interactive modules of the SHADOWPROOF adversarial security awareness suite, including knowledge checks on phishing, identity, physical, and operational risks.</p>
          </div>
          <div class="cert-bottom">
            <div class="cert-meta"><span class="l">Issued</span><span class="v">${ui.formatDate(cert.issuedAt)}</span></div>
            <div class="cert-meta"><span class="l">Verification</span><span class="v mono" style="font-size:9px">${ui.escapeHtml(cert.code)}</span></div>
            <div class="cert-meta"><span class="l">Average score</span><span class="v">${cert.scoreAvg == null ? '—' : `${cert.scoreAvg}%`}</span></div>
            <div class="cert-seal">${ui.badgeSVG(SP.SHADOWPROOF.get('reporting'), 64)}</div>
          </div>
        </article>
      </div>
      <p style="text-align:center;font-size:10.5px;color:var(--text-4);max-width:48ch;margin:0 auto">This is a training record generated from local progress in this browser. It is not a professional certification, accreditation, or proof of employment.</p>`;

    const print = document.getElementById('printCert');
    if (print) print.addEventListener('click', () => window.print());
    const copy = document.getElementById('copyCert');
    if (copy) copy.addEventListener('click', async () => {
      const ok = await ui.copyText(cert.code);
      ui.toast(ok ? 'Certificate ID copied.' : 'Could not copy on this browser.', ok ? 'success' : 'error');
    });
  }
})();
