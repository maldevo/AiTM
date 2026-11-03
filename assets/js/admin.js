/* ============================================================
   SHADOWPROOF — local workspace analytics (admin)
   ============================================================ */
(function () {
  const store = window.SP.store;
  const ui = window.SP.ui;
  const SP = window.SP;

  let user = null;
  let overview = null;
  let table = null;
  let state = { search: '', page: 1, sort: 'createdAt', dir: 'desc', limit: 8 };
  let detailId = null;

  const eventMeta = {
    'user.register': { icon: 'user', label: 'created an account', tone: 'good' },
    'user.login': { icon: 'logout', label: 'signed in', tone: '' },
    'user.logout': { icon: 'logout', label: 'signed out', tone: '' },
    'module.start': { icon: 'play', label: 'started a module', tone: '' },
    'module.pass': { icon: 'circleCheck', label: 'passed a knowledge check', tone: 'good' },
    'module.fail': { icon: 'circleX', label: 'failed a knowledge check', tone: 'bad' },
    'module.complete': { icon: 'award', label: 'completed a module', tone: 'good' },
    'badge.earned': { icon: 'award', label: 'earned a badge', tone: 'good' },
    'progress.reset': { icon: 'rotate', label: 'reset their progress', tone: 'warn' },
    'admin.role_change': { icon: 'users', label: 'changed a role', tone: 'warn' },
    'admin.status_change': { icon: 'shield', label: 'changed an account status', tone: 'warn' }
  };

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    user = ui.guard('admin.html');
    if (!user) return;
    ui.mountHeader({ active: 'admin' });
    ui.mountFooter();
    ui.bindThemeToggles();
    user = store.currentUser();
    if (!user || user.role !== 'admin') {
      renderDenied();
      return;
    }
    overview = store.adminOverview();
    table = store.adminListUsers(state);
    render();
    bindGlobal();
  }

  function renderDenied() {
    const root = document.getElementById('adminRoot');
    if (!root) return;
    root.innerHTML = `<div class="locked-state">
      <span class="icon-box danger">${ui.icon('lock')}</span>
      <h2>Workspace access only</h2>
      <p>This analytics view is available to workspace admins. The first profile created on this device becomes the admin; an admin can promote another local profile.</p>
      <a class="btn btn-primary" href="dashboard.html">Back to dashboard ${ui.icon('arrowRight')}</a>
    </div>`;
    renderSide([]);
  }

  function render() {
    const s = overview.totals;
    const root = document.getElementById('adminRoot');
    if (!root) return;
    root.innerHTML = `
      <div class="app-head" id="top">
        <div>
          <div class="eyebrow">Workspace analytics · local device</div>
          <h1>Team <em class="serif" style="font-style:italic">insights.</em></h1>
          <p class="sub">A clear view of completion, scores, and engagement across the profiles in this browser.</p>
        </div>
        <div class="row">
          <button class="btn btn-ghost btn-sm" id="exportBtn" type="button">${ui.icon('download')} Export CSV</button>
          <a class="btn btn-primary btn-sm" href="dashboard.html">${ui.icon('grid')} Learner view</a>
        </div>
      </div>

      <div class="admin-banner">
        ${ui.icon('info')}
        <span><strong>Local workspace.</strong> These numbers reflect real profiles and progress stored in this browser only. There is no server, no tracking, and no external reporting. ${s.users === 1 ? 'Invite a colleague to create a second profile on this device to compare progress.' : ''}</span>
      </div>

      <div class="kpi-grid">
        ${kpi('Learners', s.users, `${s.activeUsers} active · ${s.admins} admin${s.admins === 1 ? '' : 's'}`, 'users', 'var(--accent-soft)')}
        ${kpi('Completion rate', s.completionRate + '%', `${s.completions} module completions`, 'chart', 'var(--violet-soft)', true)}
        ${kpi('Average score', s.avgScore + '%', `${s.attempts} knowledge checks`, 'target', 'var(--info-soft)')}
        ${kpi('Badges earned', s.badges, `${s.active7d} active in 7 days`, 'award', 'var(--warn-soft)')}
      </div>

      <div class="admin-charts">
        <section class="chart-card">
          <div class="chart-head">
            <div><h3>${ui.icon('chart')} Completions by module</h3><div class="sub">Number of learners who passed each knowledge check.</div></div>
            <div class="chart-legend"><span><i></i> Completed</span></div>
          </div>
          <div class="bar-list" id="moduleBars"></div>
        </section>
        <section class="chart-card">
          <div class="chart-head">
            <div><h3>${ui.icon('trendingUp')} 14-day activity</h3><div class="sub">Learning events across the workspace.</div></div>
          </div>
          <div id="activityChart"></div>
        </section>
      </div>

      <div class="admin-charts" style="grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr)">
        <section class="chart-card">
          <div class="chart-head"><div><h3>${ui.icon('layers')} Completion by tier</h3><div class="sub">Where the workspace is investing attention.</div></div></div>
          <div id="tierDonut"></div>
        </section>
        <section class="chart-card">
          <div class="chart-head"><div><h3>${ui.icon('target')} Knowledge check scores</h3><div class="sub">Distribution of attempt results out of four.</div></div></div>
          <div id="scoreBars"></div>
        </section>
      </div>

      <div class="admin-lower">
        <section class="card" style="padding:20px">
          <div class="panel-head"><h3>${ui.icon('flame')} Recent activity</h3><span class="tag">Workspace-wide</span></div>
          <div class="feed-list" id="adminFeed"></div>
        </section>
        <section class="card" style="padding:20px">
          <div class="panel-head"><h3>${ui.icon('trendingUp')} Most completed</h3></div>
          <div class="feed-list" id="topModules"></div>
        </section>
      </div>

      <section id="people">
        <div class="panel-head">
          <h3>${ui.icon('users')} Learners</h3>
          <span class="tag">${table.total} profile${table.total === 1 ? '' : 's'}</span>
        </div>
        <div class="admin-toolbar">
          <label class="search">${ui.icon('search')}<input class="input" id="userSearch" type="search" placeholder="Search name, email, or department…" value="${ui.escapeHtml(state.search)}" aria-label="Search learners"></label>
          <div class="spacer"></div>
          <select class="select" id="sortSelect" style="min-height:40px;width:auto;border-radius:999px;font-size:11.5px;padding:0 34px 0 14px" aria-label="Sort learners">
            <option value="createdAt:desc" ${state.sort === 'createdAt' && state.dir === 'desc' ? 'selected' : ''}>Newest first</option>
            <option value="createdAt:asc" ${state.sort === 'createdAt' && state.dir === 'asc' ? 'selected' : ''}>Oldest first</option>
            <option value="name:asc" ${state.sort === 'name' && state.dir === 'asc' ? 'selected' : ''}>Name A–Z</option>
            <option value="lastLoginAt:desc" ${state.sort === 'lastLoginAt' && state.dir === 'desc' ? 'selected' : ''}>Recently active</option>
          </select>
          <button class="btn btn-danger btn-sm" id="resetWorkspace" type="button">${ui.icon('trash')} Reset workspace</button>
        </div>
        <div class="table-wrap">
          <table class="data">
            <thead><tr>
              <th>Learner</th><th>Department</th><th>Role</th><th>Progress</th><th>Badges</th><th>Last active</th><th>Status</th><th></th>
            </tr></thead>
            <tbody id="usersBody"></tbody>
          </table>
        </div>
        <div class="pagination" id="pagination"></div>
      </section>`;

    renderSide(s);
    renderBars();
    renderActivityChart();
    renderDonut();
    renderScores();
    renderFeed();
    renderTopModules();
    renderUsers();
    bind();
  }

  function kpi(label, value, sub, icon, tint, percent) {
    return `<div class="kpi" style="--kpi-color:${tint}">
      <div class="k-top"><span class="k-label">${label}</span><span class="k-icon">${ui.icon(icon)}</span></div>
      <div class="k-value">${value}${percent ? '<em> of capacity</em>' : ''}</div>
      <div class="k-sub">${sub}</div>
    </div>`;
  }

  function renderSide(s) {
    const rail = document.getElementById('sideRail');
    if (!rail) return;
    const saved = (window.SP.store.storageBytes ? window.SP.store.storageBytes() : 0);
    rail.innerHTML = `
      <div class="side-label">Workspace</div>
      <a class="side-link active" href="#top">${ui.icon('chart')} Overview</a>
      <a class="side-link" href="#people">${ui.icon('users')} Learners <span class="count">${s.users || 0}</span></a>
      <a class="side-link" href="dashboard.html#modules">${ui.icon('grid')} Modules <span class="count">${SP.SHADOWPROOF.totalModules}</span></a>
      <a class="side-link" href="roadmap.html">${ui.icon('compass')} Roadmap</a>
      <a class="side-link" href="account.html">${ui.icon('settings')} Settings</a>
      <div class="side-spacer"></div>
      <div class="side-card">
        <div class="sc-title">${ui.icon('shieldCheck')} Local workspace</div>
        <p>${ui.storageLabel(saved)} of local data · no server · no tracking.</p>
        <div class="progress" style="margin-top:10px"><span style="width:${Math.min(100, (saved / (5 * 1024 * 1024)) * 100)}%"></span></div>
      </div>`;
  }

  function renderBars() {
    const wrap = document.getElementById('moduleBars');
    if (!wrap) return;
    const users = Math.max(1, overview.totals.users);
    const max = Math.max(1, ...overview.perModule.map((m) => m.completions));
    const sorted = [...overview.perModule].sort((a, b) => b.completions - a.completions);
    wrap.innerHTML = sorted.map((m) => `<div class="bar-row">
      <span class="bl" title="${ui.escapeHtml(m.title)}">${ui.escapeHtml(m.title)}</span>
      <span class="bt"><i style="--bc:${m.accent};width:${Math.round((m.completions / max) * 100)}%"></i></span>
      <span class="bv">${m.completions}/${users}</span>
    </div>`).join('');
  }

  function renderActivityChart() {
    const wrap = document.getElementById('activityChart');
    if (!wrap) return;
    const data = overview.activity;
    const total = data.reduce((n, d) => n + d.count, 0);
    if (!total) {
      wrap.innerHTML = `<div class="chart-empty">${ui.icon('chart')}<div>No activity yet. Learner events will appear here.</div></div>`;
      return;
    }
    const W = 560, H = 180, padL = 26, padR = 8, padT = 14, padB = 26;
    const max = Math.max(1, ...data.map((d) => d.count));
    const stepX = (W - padL - padR) / Math.max(1, data.length - 1);
    const y = (v) => padT + (1 - v / max) * (H - padT - padB);
    const points = data.map((d, i) => [padL + i * stepX, y(d.count)]);
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const area = `${line} L${points[points.length - 1][0]},${H - padB} L${points[0][0]},${H - padB} Z`;
    const dots = points.map((p, i) => `<circle class="dot" cx="${p[0]}" cy="${p[1]}" r="2.6"><title>${data[i].day}: ${data[i].count} events</title></circle>`).join('');
    const grid = [0, 0.5, 1].map((f) => `<line class="grid-line" x1="${padL}" x2="${W - padR}" y1="${padT + f * (H - padT - padB)}" y2="${padT + f * (H - padT - padB)}"/>`).join('');
    const labels = [0, 6, 13].map((i) => `<text class="axis-label" x="${points[i][0]}" y="${H - 6}" text-anchor="middle">${data[i].day.slice(5)}</text>`).join('');
    wrap.innerHTML = `<svg class="line-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Activity over the last 14 days">
      <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".26"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
      ${grid}${area ? `<path class="area" d="${area}"/>` : ''}<path class="line" d="${line}"/>${dots}${labels}
    </svg>`;
  }

  function renderDonut() {
    const wrap = document.getElementById('tierDonut');
    if (!wrap) return;
    const tiers = overview.tiers;
    const total = tiers.reduce((n, t) => n + t.completions, 0);
    if (!total) {
      wrap.innerHTML = `<div class="chart-empty">${ui.icon('layers')}<div>No completions yet. Tier progress appears after the first pass.</div></div>`;
      return;
    }
    const r = 54, c = 2 * Math.PI * r;
    let offset = 0;
    const segs = tiers.map((t) => {
      const frac = t.completions / total;
      const len = frac * c;
      const seg = `<circle class="d-seg" cx="74" cy="74" r="${r}" fill="none" stroke="${t.accent}" stroke-width="14" stroke-dasharray="${len} ${c - len}" stroke-dashoffset="${-offset}"><title>${ui.escapeHtml(t.name)}: ${t.completions}</title></circle>`;
      offset += len;
      return seg;
    }).join('');
    wrap.innerHTML = `<div class="donut-wrap">
      <div class="donut">
        <svg viewBox="0 0 148 148"><circle class="d-track" cx="74" cy="74" r="${r}" fill="none" stroke-width="14"/>${segs}</svg>
        <div class="d-center"><div class="v">${total}</div><div class="l">completions</div></div>
      </div>
      <div class="donut-legend">
        ${tiers.map((t) => `<div class="dl"><i style="background:${t.accent}"></i>${ui.escapeHtml(t.name)}<b>${t.completions}</b></div>`).join('')}
      </div>
    </div>`;
  }

  function renderScores() {
    const wrap = document.getElementById('scoreBars');
    if (!wrap) return;
    const dist = overview.scoreDistribution;
    const total = dist.reduce((n, d) => n + d.count, 0);
    if (!total) {
      wrap.innerHTML = `<div class="chart-empty">${ui.icon('target')}<div>No knowledge checks attempted yet.</div></div>`;
      return;
    }
    const max = Math.max(1, ...dist.map((d) => d.count));
    wrap.innerHTML = `<div class="bar-list">
      ${dist.map((d) => `<div class="bar-row">
        <span class="bl">${d.score} of 4 correct ${d.score >= 3 ? '· pass' : ''}</span>
        <span class="bt"><i style="width:${Math.round((d.count / max) * 100)}%;--bc:${d.score >= 3 ? 'var(--accent)' : 'var(--danger)'}"></i></span>
        <span class="bv">${d.count}</span>
      </div>`).join('')}
    </div>`;
  }

  function renderFeed() {
    const wrap = document.getElementById('adminFeed');
    if (!wrap) return;
    if (!overview.recent.length) {
      wrap.innerHTML = `<div class="chart-empty">${ui.icon('clock')}<div>No activity yet.</div></div>`;
      return;
    }
    wrap.innerHTML = overview.recent.slice(0, 8).map((e) => {
      const meta = eventMeta[e.type] || { icon: 'info', label: e.type, tone: '' };
      const mod = e.moduleId ? overview.modulesById[e.moduleId] : null;
      return `<div class="feed-item">
        <span class="fi-icon ${meta.tone}">${ui.icon(meta.icon)}</span>
        <div><div class="fi-title"><strong>${ui.escapeHtml(e.userName || 'Unknown')}</strong> ${ui.escapeHtml(meta.label)}${mod ? ` · ${ui.escapeHtml(mod.title)}` : ''}</div><div class="fi-sub">${e.meta && e.meta.score != null ? `Score ${e.meta.score}/${e.meta.total}` : ui.escapeHtml(e.userEmail || '')}</div></div>
        <span class="fi-time">${ui.relative(e.createdAt)}</span>
      </div>`;
    }).join('');
  }

  function renderTopModules() {
    const wrap = document.getElementById('topModules');
    if (!wrap) return;
    const top = [...overview.perModule].sort((a, b) => b.completions - a.completions).slice(0, 5);
    const max = Math.max(1, top[0] ? top[0].completions : 1);
    wrap.innerHTML = top.map((m, i) => `<div class="bar-row" style="grid-template-columns:22px 1fr 42px">
      <span class="mono" style="font-size:9px;color:var(--text-4)">0${i + 1}</span>
      <div><div style="font-size:11px;color:var(--text-2)">${ui.escapeHtml(m.title)}</div><span class="bt" style="display:block;margin-top:4px"><i style="width:${Math.round((m.completions / max) * 100)}%;--bc:${m.accent}"></i></span></div>
      <span class="bv">${m.completions}</span>
    </div>`).join('');
  }

  function renderUsers() {
    const body = document.getElementById('usersBody');
    if (!body) return;
    if (!table.users.length) {
      body.innerHTML = `<tr><td colspan="8"><div class="empty" style="border:0;background:transparent;padding:34px 16px"><span class="icon-box">${ui.icon('search')}</span><h3>No learners match</h3><p>Try a different search term.</p></div></td></tr>`;
      renderPagination();
      return;
    }
    body.innerHTML = table.users.map((u) => {
      const pct = Math.round((u.completed / SP.SHADOWPROOF.totalModules) * 100);
      return `<tr>
        <td><div class="user-cell"><span class="avatar">${ui.escapeHtml(ui.initials(u.name))}</span><div><div class="uc-name">${ui.escapeHtml(u.name)}</div><div class="uc-email">${ui.escapeHtml(u.email)}</div></div></div></td>
        <td>${ui.escapeHtml(u.dept || '—')}</td>
        <td><span class="pill ${u.role === 'admin' ? 'pill-violet' : 'pill-neutral'}">${u.role === 'admin' ? 'Admin' : 'Learner'}</span></td>
        <td><div class="mini-progress"><div class="progress"><span style="width:${pct}%"></span></div><span>${u.completed}/${SP.SHADOWPROOF.totalModules}</span></div></td>
        <td>${u.badges}</td>
        <td>${u.lastLoginAt ? ui.relative(u.lastLoginAt) : '—'}</td>
        <td><span class="pill ${u.status === 'active' ? 'pill-accent' : 'pill-danger'}">${u.status}</span></td>
        <td><button class="btn btn-ghost btn-sm" data-user="${u.id}" type="button">View</button></td>
      </tr>`;
    }).join('');
    body.querySelectorAll('[data-user]').forEach((btn) => btn.addEventListener('click', () => openUser(btn.dataset.user)));
    renderPagination();
  }

  function renderPagination() {
    const wrap = document.getElementById('pagination');
    if (!wrap) return;
    const { page, pages, total, limit } = table;
    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(total, page * limit);
    const nums = [];
    for (let i = 1; i <= pages; i++) {
      if (pages > 7 && i !== 1 && i !== pages && Math.abs(i - page) > 1) {
        if (nums[nums.length - 1] !== '…') nums.push('…');
      } else nums.push(i);
    }
    wrap.innerHTML = `<span class="info">Showing ${start}–${end} of ${total}</span>
      <div class="controls">
        <button data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''} type="button">Prev</button>
        ${nums.map((n) => n === '…' ? `<button disabled type="button">…</button>` : `<button data-page="${n}" class="${n === page ? 'active' : ''}" type="button">${n}</button>`).join('')}
        <button data-page="${page + 1}" ${page >= pages ? 'disabled' : ''} type="button">Next</button>
      </div>`;
    wrap.querySelectorAll('[data-page]').forEach((b) => b.addEventListener('click', () => {
      const p = Number(b.dataset.page);
      if (!p || p < 1 || p > pages) return;
      state.page = p;
      table = store.adminListUsers(state);
      renderUsers();
    }));
  }

  function openUser(id) {
    const detail = store.adminUserDetail(id);
    if (!detail) return;
    const u = detail.user;
    const completed = Object.values(detail.progress).filter((p) => p.status === 'completed').length;
    const attempts = detail.attempts.slice(0, 5);
    const isSelf = u.id === user.id;
    const modal = ui.openModal(`
      <div class="user-cell" style="margin-bottom:16px"><span class="avatar avatar-lg">${ui.escapeHtml(ui.initials(u.name))}</span><div><div class="uc-name" style="font-size:14px">${ui.escapeHtml(u.name)}</div><div class="uc-email">${ui.escapeHtml(u.email)}</div><div style="margin-top:5px"><span class="pill ${u.role === 'admin' ? 'pill-violet' : 'pill-neutral'}">${u.role}</span> <span class="pill ${u.status === 'active' ? 'pill-accent' : 'pill-danger'}">${u.status}</span></div></div></div>
      <div class="drawer-section">
        <h4>Overview</h4>
        <div class="drawer-kv"><span class="k">Department</span><span class="v">${ui.escapeHtml(u.dept || '—')}</span></div>
        <div class="drawer-kv"><span class="k">Joined</span><span class="v">${ui.formatDate(u.createdAt)}</span></div>
        <div class="drawer-kv"><span class="k">Last active</span><span class="v">${u.lastLoginAt ? ui.relative(u.lastLoginAt) : '—'}</span></div>
        <div class="drawer-kv"><span class="k">Modules completed</span><span class="v">${completed} / ${SP.SHADOWPROOF.totalModules}</span></div>
        <div class="drawer-kv"><span class="k">Badges</span><span class="v">${Object.keys(detail.badges).length}</span></div>
      </div>
      <div class="drawer-section">
        <h4>Module progress</h4>
        <div class="drawer-modules">
          ${SP.SHADOWPROOF.modules.map((m) => {
            const p = detail.progress[m.id];
            const done = p && p.status === 'completed';
            return `<div class="drawer-module ${done ? 'done' : ''}"><span class="dot"></span><span>${ui.escapeHtml(m.title)}</span><span class="m-score">${done ? `score ${p.score}/${p.total}` : p ? `scene ${(p.sceneIndex || 0) + 1}` : 'not started'}</span></div>`;
          }).join('')}
        </div>
      </div>
      ${attempts.length ? `<div class="drawer-section"><h4>Recent attempts</h4>${attempts.map((a) => {
        const m = SP.SHADOWPROOF.get(a.moduleId);
        return `<div class="drawer-kv"><span class="k">${ui.escapeHtml(m ? m.title : a.moduleId)}</span><span class="v">${a.score}/${a.total} · ${a.passed ? 'pass' : 'fail'}</span></div>`;
      }).join('')}</div>` : ''}
      <div class="drawer-section">
        <h4>Account controls</h4>
        <div class="row" style="gap:8px;margin-bottom:10px">
          <select class="status-select" id="roleSelect" aria-label="Account role" ${isSelf ? 'disabled' : ''}>
            <option value="learner" ${u.role === 'learner' ? 'selected' : ''}>Learner</option>
            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
          <select class="status-select" id="statusSelect" aria-label="Account status" ${isSelf ? 'disabled' : ''}>
            <option value="active" ${u.status === 'active' ? 'selected' : ''}>Active</option>
            <option value="suspended" ${u.status === 'suspended' ? 'selected' : ''}>Suspended</option>
          </select>
          <button class="btn btn-soft btn-sm" id="saveUser" type="button" ${isSelf ? 'disabled' : ''}>Save</button>
        </div>
        ${isSelf ? '<p style="font-size:10px;color:var(--text-4);margin-bottom:10px">You cannot change your own role or status.</p>' : ''}
        <div class="danger-zone">
          <p>Reset this learner's modules, badges, and attempt history. Their account stays.</p>
          <button class="btn btn-danger btn-sm" id="resetUser" type="button">Reset their progress</button>
        </div>
      </div>`, { title: 'Learner detail' });

    modal.querySelector('#saveUser').addEventListener('click', () => {
      const role = modal.querySelector('#roleSelect').value;
      const status = modal.querySelector('#statusSelect').value;
      let result = { ok: true };
      if (role !== u.role) result = store.setUserRole(u.id, role);
      if (!result.ok) { ui.toast(result.error, 'error'); return; }
      if (status !== u.status) result = store.setUserStatus(u.id, status);
      if (!result.ok) { ui.toast(result.error, 'error'); return; }
      ui.closeModal();
      refresh();
      ui.toast('Account updated.', 'success');
    });
    modal.querySelector('#resetUser').addEventListener('click', async () => {
      const ok = await ui.confirm({ title: 'Reset this learner?', body: `This clears ${ui.escapeHtml(u.name)}'s progress, badges, and attempts. The account remains.`, confirmText: 'Reset learner', danger: true });
      if (!ok) return;
      store.resetProgress(u.id);
      ui.closeModal();
      refresh();
      ui.toast('Learner progress reset.', 'success');
    });
  }

  function refresh() {
    overview = store.adminOverview();
    table = store.adminListUsers(state);
    render();
  }

  function bind() {
    const search = document.getElementById('userSearch');
    if (search) {
      let t = null;
      search.addEventListener('input', () => {
        clearTimeout(t);
        t = setTimeout(() => {
          state.search = search.value;
          state.page = 1;
          table = store.adminListUsers(state);
          renderUsers();
        }, 150);
      });
    }
    const sort = document.getElementById('sortSelect');
    if (sort) sort.addEventListener('change', () => {
      const [field, dir] = sort.value.split(':');
      state.sort = field;
      state.dir = dir;
      state.page = 1;
      table = store.adminListUsers(state);
      renderUsers();
    });
    const exp = document.getElementById('exportBtn');
    if (exp) exp.addEventListener('click', () => {
      const csv = store.adminExportCsv();
      ui.downloadFile(`shadowproof-learners-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv;charset=utf-8');
      ui.toast('CSV exported for this device.', 'success');
    });
    const reset = document.getElementById('resetWorkspace');
    if (reset) reset.addEventListener('click', async () => {
      const ok = await ui.confirm({ title: 'Reset the entire workspace?', body: 'This deletes every local profile, all progress, badges, attempts, and activity on this device. **This cannot be undone.** Export a CSV first if you need the data.', confirmText: 'Delete workspace', danger: true });
      if (!ok) return;
      store.resetWorkspace();
      location.href = 'index.html';
    });
  }

  function bindGlobal() {
    window.addEventListener('hashchange', () => ui.scrollToId(location.hash.slice(1)));
  }
})();
