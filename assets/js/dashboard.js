/* ============================================================
   SHADOWPROOF — learner dashboard
   ============================================================ */
(function () {
  const store = window.SP.store;
  const ui = window.SP.ui;
  const SP = window.SP;

  let user = null;
  let data = null;
  let filters = { tier: 'all', status: 'all', q: '' };

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    user = ui.guard('dashboard.html');
    if (!user) return;
    ui.mountHeader({ active: 'dashboard' });
    ui.mountFooter();
    ui.bindThemeToggles();
    user = store.currentUser();
    data = store.dashboard(user.id);
    render();
    const welcome = sessionStorage.getItem('sp:welcome');
    if (welcome) {
      sessionStorage.removeItem('sp:welcome');
      setTimeout(() => ui.toast(welcome === 'admin' ? 'Workspace created. You are the workspace admin — open Workspace analytics from the menu.' : 'Workspace created. Pick a module when you are ready.', 'success', 'Welcome to SHADOWPROOF'), 400);
    }
    if (location.hash) setTimeout(() => ui.scrollToId(location.hash.slice(1)), 80);
  }

  function renderSide() {
    const rail = document.getElementById('sideRail');
    if (!rail) return;
    const s = data.stats;
    rail.innerHTML = `
      <div class="side-label">Your workspace</div>
      <a class="side-link active" href="dashboard.html">${ui.icon('grid')} Overview</a>
      <a class="side-link" href="#modules">${ui.icon('layers')} Modules <span class="count">${s.totalModules}</span></a>
      <a class="side-link" href="#badges">${ui.icon('award')} Badges <span class="count">${s.badges}</span></a>
      <a class="side-link" href="certificate.html">${ui.icon('certificate')} Certificate</a>
      <a class="side-link" href="roadmap.html">${ui.icon('compass')} Roadmap</a>
      <a class="side-link" href="account.html">${ui.icon('settings')} Settings</a>
      ${user.role === 'admin' ? `<a class="side-link" href="admin.html">${ui.icon('users')} Analytics</a>` : ''}
      <div class="side-spacer"></div>
      <div class="side-card">
        <div class="sc-title">${ui.icon('chart')} Your progress</div>
        <p>${s.completedCount} of ${s.totalModules} modules · ${s.badges} badges</p>
        <div class="progress" style="margin-top:10px"><span style="width:${s.percent}%"></span></div>
        <div class="between" style="margin-top:8px"><span class="tag">${s.percent}%</span><span class="tag">${ui.storageLabel(store.storageBytes())} local</span></div>
      </div>`;
  }

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }

  function render() {
    const root = document.getElementById('dashRoot');
    if (!root) return;
    const s = data.stats;
    const continueModule = (data.inProgress[0] || data.next);
    const cert = data.certificate;
    const allDone = s.completedCount === s.totalModules;

    renderSide();

    root.innerHTML = `
      <div class="app-head" id="top">
        <div>
          <div class="eyebrow">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          <h1>${greeting()}, ${ui.escapeHtml(user.name.split(' ')[0])}.</h1>
          <p class="sub">${allDone ? 'You have completed the full suite. Review a story or collect your certificate.' : `You have ${s.totalModules - s.completedCount} modules left. Ten minutes at a time.`}</p>
        </div>
        <div class="row">
          <a class="btn btn-ghost btn-sm" href="certificate.html">${ui.icon('certificate')} Certificate</a>
          <a class="btn btn-primary btn-sm" href="${continueModule ? `module.html?id=${continueModule.id}` : 'dashboard.html#modules'}">${continueModule ? 'Continue' : 'Review'} ${ui.icon('arrowRight')}</a>
        </div>
      </div>

      <div class="dash-hero">
        <section class="welcome-card">
          <span class="pill pill-accent">${ui.icon('zap', 'icon-sm')} ${allDone ? 'Suite complete' : 'Your next move'}</span>
          <h2>${ui.rich(allDone ? 'You finished the *whole story.*' : 'Small habits. *Real defense.*')}</h2>
          <p>${allDone ? 'Every module and badge is complete. Your certificate is ready to print or save.' : 'The attacks in this suite are designed to get past tools by targeting people. Every module is a short interactive story with a knowledge check at the end.'}</p>
          <div class="row">
            <a class="btn btn-primary" href="${allDone ? 'certificate.html' : (continueModule ? `module.html?id=${continueModule.id}` : 'dashboard.html#modules')}">${allDone ? 'View certificate' : `Continue ${ui.escapeHtml(continueModule ? continueModule.title : '')}`} ${ui.icon('arrowRight', 'arrow')}</a>
            <a class="btn btn-ghost" href="#modules">Browse all modules</a>
          </div>
        </section>
        <aside class="ring-card" aria-label="Overall progress">
          ${ui.ringSVG(s.percent, 148, null, `<span class="big">${s.percent}%</span><span class="small">complete</span>`)}
          <div>
            <div class="rc-label">${s.completedCount} of ${s.totalModules} modules</div>
            <div class="rc-sub">${s.badges} badge${s.badges === 1 ? '' : 's'} earned</div>
          </div>
        </aside>
      </div>

      <div class="stat-tiles">
        <div class="tile"><div><div class="t-val">${s.completedCount}<span style="font-size:.6em;color:var(--text-4)">/${s.totalModules}</span></div><div class="t-lab">Modules complete</div></div><span class="icon-box accent">${ui.icon('shieldCheck')}</span></div>
        <div class="tile"><div><div class="t-val">${s.badges}</div><div class="t-lab">Badges earned</div></div><span class="icon-box violet">${ui.icon('award')}</span></div>
        <div class="tile"><div><div class="t-val">${s.minutes}<span style="font-size:.55em;color:var(--text-4)"> min</span></div><div class="t-lab">Learning time</div></div><span class="icon-box info">${ui.icon('clock')}</span></div>
        <div class="tile"><div><div class="t-val">${s.avgScore == null ? '—' : `${s.avgScore}%`}</div><div class="t-lab">Average check score</div></div><span class="icon-box warn">${ui.icon('target')}</span></div>
      </div>

      ${continueModule ? `
      <section class="continue-card">
        <div>
          <div class="cc-top">
            <span class="pill" style="color:${continueModule.accent};border-color:color-mix(in srgb, ${continueModule.accent} 30%, transparent)">Module ${continueModule.num} · ${ui.escapeHtml(continueModule.subtitle)}</span>
            <span class="tag">${continueModule.time}</span>
          </div>
          <h3>${ui.escapeHtml(continueModule.title)}</h3>
          <p>${ui.escapeHtml(continueModule.desc)}</p>
          <div class="cc-progress">
            <div class="progress"><span style="width:${progressPercent(continueModule.id)}%"></span></div>
            <span class="pct">${progressPercent(continueModule.id)}%</span>
          </div>
        </div>
        <div class="row" style="flex-wrap:nowrap">
          <div class="cc-art">${ui.icon(continueModule.icon)}</div>
          <a class="btn btn-primary" href="module.html?id=${continueModule.id}">${data.progress[continueModule.id] ? 'Resume' : 'Start'} ${ui.icon('arrowRight')}</a>
        </div>
      </section>` : ''}

      <div class="dash-columns">
        <div class="dash-col">
          <section id="modules">
            <div class="panel-head">
              <h3>${ui.icon('grid')} All modules</h3>
              <span class="tag">${s.completedCount} completed</span>
            </div>
            <div class="filter-bar">
              <label class="search">
                ${ui.icon('search')}
                <input class="input" id="moduleSearch" type="search" placeholder="Search modules…" aria-label="Search modules" value="${ui.escapeHtml(filters.q)}">
              </label>
              <div class="filter-pills" id="tierPills">
                ${['all', '1', '2', '3', '4'].map((t) => `<button class="filter-pill ${filters.tier === t ? 'active' : ''}" data-tier="${t}" type="button">${t === 'all' ? 'All tiers' : `Tier ${t}`}</button>`).join('')}
              </div>
              <select class="select" id="statusSelect" aria-label="Filter by status" style="min-height:40px;width:auto;border-radius:999px;font-size:11.5px;padding:0 34px 0 14px">
                <option value="all" ${filters.status === 'all' ? 'selected' : ''}>Any status</option>
                <option value="progress" ${filters.status === 'progress' ? 'selected' : ''}>In progress</option>
                <option value="complete" ${filters.status === 'complete' ? 'selected' : ''}>Completed</option>
                <option value="new" ${filters.status === 'new' ? 'selected' : ''}>Not started</option>
              </select>
            </div>
            <div id="moduleGrid" class="module-grid-app"></div>
          </section>

          <section id="badges">
            <div class="panel-head">
              <h3>${ui.icon('award')} Badge case</h3>
              <span class="tag">${s.badges} of ${s.totalModules}</span>
            </div>
            <div class="badge-grid" id="badgeGrid"></div>
          </section>
        </div>

        <aside class="dash-col">
          <section class="card" style="padding:20px">
            <div class="panel-head"><h3>${ui.icon('flame')} Activity</h3></div>
            <div class="activity" id="activityFeed"></div>
          </section>

          <section class="card" style="padding:20px">
            <div class="panel-head"><h3>${ui.icon('certificate')} Certificate</h3></div>
            <p style="font-size:12px;color:var(--text-3);line-height:1.6;margin-bottom:14px">${cert.eligible ? 'You completed every module. Your certificate is ready to print or save as PDF.' : `Complete all ${cert.total} modules to unlock your certificate. You are ${cert.total - cert.completedCount} away.`}</p>
            <div class="progress" style="margin-bottom:14px"><span style="width:${Math.round((cert.completedCount / cert.total) * 100)}%"></span></div>
            <a class="btn ${cert.eligible ? 'btn-primary' : 'btn-ghost'} btn-sm" href="certificate.html" style="width:100%">${cert.eligible ? 'View certificate' : 'See requirements'} ${ui.icon('arrowRight')}</a>
          </section>

          <section class="side-card" style="margin-top:0">
            <div class="sc-title">${ui.icon('shieldCheck')} Local workspace</div>
            <p>Your profile, progress, and badges live in this browser only. Nothing is sent to a server.</p>
            <div class="row" style="justify-content:space-between;margin-top:10px">
              <span class="tag">${ui.storageLabel(store.storageBytes())} stored</span>
              <button class="btn btn-ghost btn-sm" id="resetBtn" type="button">Reset progress</button>
            </div>
          </section>
        </aside>
      </div>`;

    renderGrid();
    renderBadges();
    renderActivity();
    bind();
  }

  function progressPercent(id) {
    const p = data.progress[id];
    const mod = SP.SHADOWPROOF.get(id);
    if (!p || !mod) return 0;
    if (p.status === 'completed') return 100;
    return Math.round((Math.min(mod.scenes.length, (p.sceneIndex || 0) + 1) / mod.scenes.length) * 100);
  }

  function moduleStatus(id) {
    const p = data.progress[id];
    if (!p) return 'new';
    return p.status === 'completed' ? 'complete' : 'progress';
  }

  function renderGrid() {
    const wrap = document.getElementById('moduleGrid');
    if (!wrap) return;
    const q = filters.q.trim().toLowerCase();
    const mods = SP.SHADOWPROOF.modules.filter((m) => {
      if (filters.tier !== 'all' && String(m.tier) !== filters.tier) return false;
      const st = moduleStatus(m.id);
      if (filters.status === 'progress' && st !== 'progress') return false;
      if (filters.status === 'complete' && st !== 'complete') return false;
      if (filters.status === 'new' && st !== 'new') return false;
      if (q && !`${m.title} ${m.subtitle} ${m.desc} ${m.num}`.toLowerCase().includes(q)) return false;
      return true;
    });
    if (!mods.length) {
      wrap.innerHTML = `<div class="empty" style="grid-column:1/-1">
        <span class="icon-box">${ui.icon('search')}</span>
        <h3>No modules match</h3>
        <p>Try a different search term or clear the filters to see all sixteen modules.</p>
        <button class="btn btn-ghost btn-sm" id="clearFilters" type="button">Clear filters</button>
      </div>`;
      const clear = document.getElementById('clearFilters');
      if (clear) clear.addEventListener('click', () => {
        filters = { tier: 'all', status: 'all', q: '' };
        render();
      });
      return;
    }
    wrap.innerHTML = mods.map((m, i) => {
      const st = moduleStatus(m.id);
      const pct = progressPercent(m.id);
      const label = st === 'complete' ? 'Completed' : st === 'progress' ? 'In progress' : 'Not started';
      return `<a class="mcard-app ${st === 'complete' ? 'is-complete' : ''}" href="module.html?id=${m.id}" style="--mc-accent:${m.accent}">
        <div class="ma-top">
          <div>
            <div class="ma-num">MODULE ${m.num} · TIER ${String(m.tier).padStart(2, '0')}</div>
            <h3>${ui.escapeHtml(m.title)}</h3>
            <div class="ma-sub">${ui.escapeHtml(m.subtitle)}</div>
          </div>
          <span class="ma-icon">${ui.icon(m.icon)}</span>
        </div>
        <p>${ui.escapeHtml(m.desc)}</p>
        <div class="ma-progress"><div class="progress"><span style="width:${pct}%"></span></div><span>${pct}%</span></div>
        <div class="ma-foot">
          <span class="meta">${ui.icon('clock', 'icon-sm')} ${m.time} · ${m.risk}</span>
          <span class="status ${st === 'complete' ? 'done' : st === 'progress' ? 'progress' : 'new'}">${st === 'complete' ? ui.icon('check', 'icon-sm') : st === 'progress' ? ui.icon('play', 'icon-sm') : ''} ${label}</span>
        </div>
      </a>`;
    }).join('');
    ui.initReveal(wrap);
  }

  function renderBadges() {
    const wrap = document.getElementById('badgeGrid');
    if (!wrap) return;
    wrap.innerHTML = SP.SHADOWPROOF.modules.map((m) => {
      const b = data.badges[m.id];
      return `<button class="badge-card ${b ? '' : 'locked'}" data-badge="${m.id}" type="button" aria-label="${ui.escapeHtml(m.title)} ${b ? 'badge earned' : 'badge locked'}">
        ${b ? '' : `<span class="lock">${ui.icon('lock')}</span>`}
        ${ui.badgeSVG(m, 58)}
        <span class="b-title">${ui.escapeHtml(m.title)}</span>
        <span class="b-date">${b ? ui.formatDate(b.earnedAt) : 'Locked'}</span>
      </button>`;
    }).join('');
    wrap.querySelectorAll('[data-badge]').forEach((el) => {
      el.addEventListener('click', () => {
        const m = SP.SHADOWPROOF.get(el.dataset.badge);
        const b = data.badges[m.id];
        if (!b) {
          ui.toast(`Pass the ${m.title} knowledge check to earn this badge.`, 'info', 'Badge locked');
          return;
        }
        const modal = ui.openModal(`
          <div style="text-align:center;display:grid;gap:10px;justify-items:center;padding:6px 0 4px">
            ${ui.badgeSVG(m, 130)}
            <div class="eyebrow badge-modal-accent" style="--bm-accent:${m.accent};margin-top:6px">Module ${m.num} · ${ui.escapeHtml(m.subtitle)}</div>
            <h3 style="font-size:1.45rem">${ui.escapeHtml(m.title)}</h3>
            <span class="pill pill-accent">${ui.icon('check', 'icon-sm')} ${b.score}/${b.total} · ${ui.formatDate(b.earnedAt)}</span>
            <div class="mono" style="font-size:10px;color:var(--text-4);letter-spacing:.08em;word-break:break-all">${b.badgeCode}</div>
          </div>
          <div class="row" style="justify-content:center;margin-top:18px">
            <button class="btn btn-ghost btn-sm" data-copy type="button">${ui.icon('copy')} Copy badge ID</button>
            <a class="btn btn-primary btn-sm" href="module.html?id=${m.id}">Review module ${ui.icon('arrowRight')}</a>
          </div>`, { title: 'Earned badge' });
        modal.querySelector('[data-copy]').addEventListener('click', async () => {
          const ok = await ui.copyText(b.badgeCode);
          ui.toast(ok ? 'Badge ID copied.' : 'Could not copy on this browser.', ok ? 'success' : 'error');
        });
      });
    });
  }

  const eventMeta = {
    'user.register': { icon: 'user', label: 'Created your workspace account', tone: '' },
    'user.login': { icon: 'logout', label: 'Signed in', tone: '' },
    'user.logout': { icon: 'logout', label: 'Signed out', tone: '' },
    'user.profile_update': { icon: 'edit', label: 'Updated your profile', tone: '' },
    'user.password_change': { icon: 'key', label: 'Changed password', tone: '' },
    'module.start': { icon: 'play', label: 'Started a module', tone: '' },
    'module.pass': { icon: 'circleCheck', label: 'Passed a knowledge check', tone: 'good' },
    'module.fail': { icon: 'circleX', label: 'Attempted a knowledge check', tone: 'bad' },
    'badge.earned': { icon: 'award', label: 'Earned a badge', tone: 'good' },
    'progress.reset': { icon: 'rotate', label: 'Reset learning progress', tone: 'bad' }
  };

  function renderActivity() {
    const wrap = document.getElementById('activityFeed');
    if (!wrap) return;
    if (!data.events.length) {
      wrap.innerHTML = `<div class="empty" style="padding:26px 16px;border:0;background:transparent">
        <span class="icon-box">${ui.icon('clock')}</span>
        <h3 style="font-size:.95rem">No activity yet</h3>
        <p style="font-size:11.5px">Start a module and your progress will appear here.</p>
      </div>`;
      return;
    }
    wrap.innerHTML = data.events.slice(0, 8).map((e) => {
      const meta = eventMeta[e.type] || { icon: 'info', label: e.type, tone: '' };
      const mod = e.moduleId ? SP.SHADOWPROOF.get(e.moduleId) : null;
      const label = mod ? `${meta.label.replace(' a module', '')} · ${mod.title}` : meta.label;
      const score = e.meta && e.meta.score != null ? `${e.meta.score}/${e.meta.total}` : '';
      return `<div class="activity-item">
        <span class="ai-icon ${meta.tone}">${ui.icon(meta.icon)}</span>
        <div><div class="ai-title">${ui.escapeHtml(label)}</div><div class="ai-sub">${score ? `Score ${score}` : ui.escapeHtml(mod ? mod.subtitle : '')}</div></div>
        <span class="ai-time">${ui.relative(e.createdAt)}</span>
      </div>`;
    }).join('');
  }

  function bind() {
    const search = document.getElementById('moduleSearch');
    if (search) {
      let debounce = null;
      search.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => { filters.q = search.value; renderGrid(); }, 120);
      });
    }
    document.querySelectorAll('#tierPills [data-tier]').forEach((b) => {
      b.addEventListener('click', () => {
        filters.tier = b.dataset.tier;
        document.querySelectorAll('#tierPills [data-tier]').forEach((x) => x.classList.toggle('active', x === b));
        renderGrid();
      });
    });
    const status = document.getElementById('statusSelect');
    if (status) status.addEventListener('change', () => { filters.status = status.value; renderGrid(); });
    const reset = document.getElementById('resetBtn');
    if (reset) {
      reset.addEventListener('click', async () => {
        const ok = await ui.confirm({
          title: 'Reset learning progress?',
          body: 'This clears your module progress, badges, and attempt history on this device. Your account remains. **This cannot be undone.**',
          confirmText: 'Reset progress',
          danger: true
        });
        if (!ok) return;
        store.resetProgress(user.id);
        data = store.dashboard(user.id);
        render();
        ui.toast('Learning progress reset.', 'success');
      });
    }
  }
})();
