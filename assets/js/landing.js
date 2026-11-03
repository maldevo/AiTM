/* ============================================================
   SHADOWPROOF — landing interactions
   ============================================================ */
(function () {
  const store = window.SP.store;
  const ui = window.SP.ui;
  const SP = window.SP;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const user = ui.mountHeader({ active: 'home' });
    ui.mountFooter();
    ui.bindThemeToggles();
    ui.initReveal();
    renderHeroCta(user);
    renderModules();
    initHeroTrace();
    initExplainer();
    initCounters();
    initPlatformChart();
  }

  function renderHeroCta(user) {
    const primary = document.getElementById('heroPrimary');
    const secondary = document.getElementById('heroSecondary');
    if (!primary || !secondary) return;
    if (user) {
      primary.href = 'dashboard.html';
      primary.innerHTML = `Continue training ${ui.icon('arrowRight', 'arrow')}`;
      secondary.href = 'dashboard.html#modules';
      secondary.textContent = 'Browse 16 modules';
    }
  }

  function renderModules() {
    const wrap = document.getElementById('modulePreview');
    if (!wrap) return;
    const picks = ['aitm', 'bec', 'smishing', 'vishing', 'social-eng', 'reporting'];
    const mods = picks.map((id) => SP.SHADOWPROOF.get(id)).filter(Boolean);
    wrap.innerHTML = mods.map((m, i) => `
      <a class="mcard" href="module.html?id=${m.id}" style="--mc-accent:${m.accent}" data-reveal data-reveal-delay="${(i % 3) + 1}">
        <div class="mcard-top">
          <div class="tier-line"></div>
          <span class="icon-box">${ui.icon(m.icon)}</span>
        </div>
        <div>
          <div class="mnum">MODULE ${m.num} · TIER ${String(m.tier).padStart(2, '0')}</div>
          <h3>${ui.escapeHtml(m.title)}</h3>
          <div class="sub">${ui.escapeHtml(m.subtitle)}</div>
        </div>
        <p>${ui.escapeHtml(m.desc)}</p>
        <div class="mcard-foot">
          <span class="meta">${ui.icon('clock', 'icon-sm')} ${m.time} <span>·</span> ${m.risk} risk</span>
          <span class="go">${ui.icon('arrowRight')}</span>
        </div>
      </a>`).join('');
    ui.initReveal(wrap);
  }

  /* ---------------- hero attack replay ---------------- */
  const traceSteps = [
    { icon: 'mail', label: 'The bait email', sub: '“Shared document expires in 24h”', state: 'delivered', log: '<span class="ts">09:47</span> mail delivered · subject “Action required”' },
    { icon: 'browser', label: 'The clone', sub: 'login.rnicrosoft-secure.com', state: 'served', log: '<span class="ts">09:47</span> proxy page served · lookalike domain' },
    { icon: 'shield', label: 'Real Microsoft', sub: 'Credentials relayed upstream', state: 'relayed', log: '<span class="ts">09:47</span> credentials forwarded → login.microsoftonline.com' },
    { icon: 'smartphone', label: 'Real MFA prompt', sub: '“Approve sign-in? Atlanta, GA”', state: 'waiting', log: '<span class="ts">09:48</span> <span class="ok">✓</span> genuine MFA challenge sent to victim' },
    { icon: 'cookie', label: 'Session cookie', sub: 'Copied before it reaches you', state: 'stolen', log: '<span class="ts">09:48</span> <span class="bad">⚠</span> session cookie copied by proxy', danger: true },
    { icon: 'ghost', label: 'Attacker inbox', sub: 'Authenticated · no MFA needed', state: 'takeover', log: '<span class="ts">09:48</span> <span class="bad">⚠</span> attacker imports cookie · session active', danger: true }
  ];

  function initHeroTrace() {
    const flow = document.getElementById('heroTrace');
    if (!flow) return;
    flow.innerHTML = `<div class="trace-flow">
      <span class="trace-packet" id="tracePacket"></span>
      ${traceSteps.map((s, i) => `
        <div class="trace-row ${s.danger ? 'danger' : ''}" data-trace="${i}">
          <span class="node">${ui.icon(s.icon)}</span>
          <div><div class="label">${s.label}</div><div class="sub">${s.sub}</div></div>
          <span class="state">${s.state}</span>
        </div>`).join('')}
    </div>
    <div class="trace-log" id="traceLog"></div>`;
    const rows = [...flow.querySelectorAll('.trace-row')];
    const packet = document.getElementById('tracePacket');
    const log = document.getElementById('traceLog');
    let index = -1;
    let timer = null;

    function setActive(i) {
      rows.forEach((r, n) => {
        r.classList.toggle('active', n === i);
        r.classList.toggle('done', n < i);
      });
      if (i >= 0) {
        const row = rows[i];
        packet.style.top = `${row.offsetTop + 14}px`;
      }
      const line = document.createElement('div');
      line.className = 'log-line';
      line.innerHTML = traceSteps[i].log;
      log.innerHTML = '';
      log.appendChild(line);
    }

    function tick() {
      index++;
      if (index >= traceSteps.length) {
        index = -1;
        setTimeout(tick, 1600);
        return;
      }
      setActive(index);
      timer = setTimeout(tick, index === traceSteps.length - 1 ? 2600 : 1900);
    }

    if (reduced) {
      setActive(3);
      rows.slice(0, 4).forEach((r) => r.classList.add('done'));
      return;
    }
    setTimeout(tick, 700);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { clearTimeout(timer); timer = null; }
      else if (!timer) { timer = setTimeout(tick, 900); }
    });
  }

  /* ---------------- explainer ---------------- */
  const attacks = [
    {
      id: 'aitm',
      name: 'AiTM',
      eyebrow: 'Identity attack',
      title: 'The ghost in the login',
      desc: 'The attacker proxies the real sign-in page, relays your password, and steals the session cookie after MFA. The login is genuine — the middle is not.',
      stages: [
        { icon: 'mail', label: 'Bait', detail: 'A shared-document email moves you to a lookalike link.' },
        { icon: 'browser', label: 'Proxy', detail: 'A pixel-perfect clone forwards every keystroke upstream.' },
        { icon: 'smartphone', label: 'MFA relay', detail: 'The real service sends a real prompt. You approve it.' },
        { icon: 'cookie', label: 'Session stolen', detail: 'The cookie is copied. The attacker becomes you.' }
      ]
    },
    {
      id: 'bec',
      name: 'BEC',
      eyebrow: 'Social engineering',
      title: 'The CEO who needs a favor',
      desc: 'No malware. Just a familiar name, an unknown number, and a request that is hard to reverse. BEC turns helpfulness into a payment rail.',
      stages: [
        { icon: 'smartphone', label: 'Off-channel', detail: 'A text from a new number claims to be your CEO.' },
        { icon: 'briefcase', label: 'Authority', detail: 'A title, a project, and a reason to skip procedure.' },
        { icon: 'gift', label: 'The ask', detail: 'Gift cards, a wire, or new bank details.' },
        { icon: 'siren', label: 'The loss', detail: 'Money leaves before anyone verifies the person.' }
      ]
    },
    {
      id: 'quishing',
      name: 'Quishing',
      eyebrow: 'QR attack',
      title: 'The door with no address',
      desc: 'A QR code hides its destination. Attackers paste them over real codes or send them in email to move you off a monitored device.',
      stages: [
        { icon: 'qr', label: 'The square', detail: 'Printed, pasted, or emailed. It encodes any URL.' },
        { icon: 'smartphone', label: 'The scan', detail: 'Your phone decodes it and shows a preview.' },
        { icon: 'browser', label: 'The clone', detail: 'A familiar brand page asks for a login or card.' },
        { icon: 'key', label: 'The capture', detail: 'Credentials or payment details leave your device.' }
      ]
    },
    {
      id: 'vishing',
      name: 'Vishing',
      eyebrow: 'Voice attack',
      title: 'The voice that knows your name',
      desc: 'A caller claims to be IT, reads your public details, and asks for the one thing that finishes the login: the MFA code.',
      stages: [
        { icon: 'phone', label: 'The call', detail: 'A confident caller already knows your name and team.' },
        { icon: 'alert', label: 'The story', detail: 'A sign-in from another country creates urgency.' },
        { icon: 'smartphone', label: 'The code', detail: '“Read me the six digits so we can secure it.”' },
        { icon: 'ghost', label: 'The takeover', detail: 'The code completes a real sign-in. The call ends.' }
      ]
    },
    {
      id: 'ransomware',
      name: 'Ransomware',
      eyebrow: 'Malware',
      title: 'The invoice that encrypts',
      desc: 'An archive with a script inside. One execution spreads across shared drives, locks files, and leaves a countdown on the desktop.',
      stages: [
        { icon: 'mail', label: 'Delivery', detail: 'A fake invoice or resume arrives with a ZIP.' },
        { icon: 'cursor', label: 'Execution', detail: 'A script runs behind a decoy document.' },
        { icon: 'network', label: 'Spread', detail: 'Shared drives and credentials are reached.' },
        { icon: 'lock', label: 'Encryption', detail: 'Files lock. A ransom note appears.' }
      ]
    }
  ];

  function initExplainer() {
    const tabs = document.getElementById('explainTabs');
    const flow = document.getElementById('explainFlow');
    const copy = document.getElementById('explainCopy');
    if (!tabs || !flow || !copy) return;

    let attackIndex = 0;
    let stepIndex = 0;
    let timer = null;
    let paused = false;

    tabs.innerHTML = attacks.map((a, i) => `<button class="explainer-tab ${i === 0 ? 'active' : ''}" data-attack="${i}" type="button">${a.name}</button>`).join('');

    function render() {
      const a = attacks[attackIndex];
      copy.innerHTML = `
        <div class="eyebrow">${a.eyebrow}</div>
        <h3>${ui.escapeHtml(a.title)}</h3>
        <p>${ui.escapeHtml(a.desc)}</p>
        <div class="explain-steps" id="explainSteps"></div>
        <div class="explainer-progress" id="explainProgress"></div>`;
      const stepsEl = copy.querySelector('#explainSteps');
      const progEl = copy.querySelector('#explainProgress');
      stepsEl.innerHTML = a.stages.map((s, i) => `
        <button class="explain-step ${i === stepIndex ? 'active' : ''}" data-step="${i}" type="button">
          <span class="n">0${i + 1}</span>
          <span><span class="t">${s.label}</span><span class="d">${s.detail}</span></span>
        </button>`).join('');
      progEl.innerHTML = a.stages.map((_, i) => `<span class="${i < stepIndex ? 'done' : ''}"><i style="width:${i < stepIndex ? 100 : i === stepIndex ? 55 : 0}%"></i></span>`).join('');
      flow.innerHTML = `<span class="mf-connector"></span><span class="mf-packet" id="mfPacket"></span>${a.stages.map((s, i) => `
        <div class="mf-node ${i === stepIndex ? 'active' : ''} ${i < stepIndex ? 'done' : ''}">
          <span class="n">${ui.icon(s.icon)}</span>
          <span><span class="t">${s.label}</span><br><span class="d">${s.detail}</span></span>
        </div>`).join('')}`;
      const packet = document.getElementById('mfPacket');
      const nodes = [...flow.querySelectorAll('.mf-node')];
      if (nodes[stepIndex]) packet.style.top = `${nodes[stepIndex].offsetTop + 14}px`;
      tabs.querySelectorAll('.explainer-tab').forEach((t, i) => t.classList.toggle('active', i === attackIndex));
      stepsEl.querySelectorAll('.explain-step').forEach((s, i) => s.addEventListener('click', () => { stepIndex = i; paused = true; render(); resetTimer(); }));
    }

    function next() {
      const a = attacks[attackIndex];
      if (stepIndex < a.stages.length - 1) {
        stepIndex++;
      } else {
        attackIndex = (attackIndex + 1) % attacks.length;
        stepIndex = 0;
      }
      render();
    }

    function resetTimer() {
      clearInterval(timer);
      timer = null;
      if (reduced || paused) return;
      timer = setInterval(next, 3400);
    }

    tabs.querySelectorAll('.explainer-tab').forEach((t) => {
      t.addEventListener('click', () => {
        attackIndex = Number(t.dataset.attack);
        stepIndex = 0;
        paused = true;
        render();
        resetTimer();
      });
    });

    render();
    resetTimer();
  }

  /* ---------------- counters ---------------- */
  function initCounters() {
    const nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;
    const animate = (el) => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      if (reduced || !Number.isFinite(target)) { el.textContent = prefix + target + suffix; return; }
      const start = performance.now();
      const dur = 1200;
      const frame = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };
    if (!('IntersectionObserver' in window)) { nodes.forEach(animate); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    nodes.forEach((n) => io.observe(n));
  }

  function initPlatformChart() {
    const wrap = document.getElementById('pmBars');
    if (!wrap) return;
    const heights = [38, 52, 41, 68, 57, 76, 63, 88, 72, 94, 81, 96];
    wrap.innerHTML = heights.map((h) => `<div class="bar"><i style="height:${h}%"></i></div>`).join('');
  }
})();
