/* ============================================================
   SHADOWPROOF — data-driven module player
   ============================================================ */
(function () {
  const store = window.SP.store;
  const ui = window.SP.ui;
  const SP = window.SP;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let user = null;
  let mod = null;
  let brief = null;
  let scenes = [];
  let mode = 'cover';
  let sceneIndex = 0;
  let canContinue = true;
  let flowStep = 0;
  let flowTimer = null;
  let simAnswered = false;
  let classifyAnswers = {};
  let openedGallery = new Set();
  let checkState = {};
  let quizIndex = 0;
  let quizAnswers = [];
  let quizAnswered = [];
  let quizResult = null;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    user = ui.guard('module.html' + location.search);
    if (!user) return;
    ui.mountHeader({ active: 'modules' });
    ui.mountFooter();
    ui.bindThemeToggles();
    user = store.currentUser();

    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    mod = SP.SHADOWPROOF.get(id);
    if (!mod) {
      renderMissing();
      return;
    }
    document.title = `${mod.title} · Module ${mod.num} · SHADOWPROOF`;
    document.documentElement.style.setProperty('--mod-accent', mod.accent);
    brief = mod.scenes.find((s) => s.type === 'brief') || {
      eyebrow: `Tier ${String(mod.tier).padStart(2, '0')}`,
      title: mod.title,
      lede: mod.desc,
      stats: []
    };
    scenes = mod.scenes.filter((s) => s.type !== 'brief');

    const p = store.getModuleProgress(user.id, mod.id);
    if (p && (p.status === 'completed' || p.sceneIndex > 0)) {
      sceneIndex = Math.min(p.sceneIndex || 0, scenes.length - 1);
      mode = 'scene';
    }
    renderAll();
    bindKeyboard();
  }

  function renderMissing() {
    const top = document.getElementById('moduleTop');
    if (top) top.innerHTML = '';
    const shell = document.getElementById('moduleShell');
    if (shell) {
      shell.innerHTML = `<div class="locked-state">
        <span class="icon-box danger">${ui.icon('circleAlert')}</span>
        <h2>Module not found</h2>
        <p>The module you asked for does not exist in this workspace. It may have been renamed or the link is incomplete.</p>
        <a class="btn btn-primary" href="dashboard.html#modules">Browse all modules ${ui.icon('arrowRight')}</a>
      </div>`;
    }
    const nav = document.getElementById('sceneNavbar');
    if (nav) nav.innerHTML = '';
    ui.mountFooter();
  }

  function renderAll() {
    renderTop();
    const shell = document.getElementById('moduleShell');
    if (!shell) return;
    if (mode === 'cover') {
      shell.innerHTML = renderCover();
      wireCover();
    } else if (mode === 'scene') {
      const scene = scenes[sceneIndex];
      shell.innerHTML = renderScene(scene);
      wireScene(scene);
    } else if (mode === 'quiz-intro') {
      shell.innerHTML = renderQuizIntro();
      wireQuizIntro();
    } else if (mode === 'quiz') {
      shell.innerHTML = renderQuizQuestion();
      wireQuizQuestion();
    } else if (mode === 'result') {
      shell.innerHTML = renderResult();
      wireResult();
    }
    renderNav();
    if (mode === 'scene') {
      const title = document.getElementById('sceneTitle');
      if (title) setTimeout(() => title.focus({ preventScroll: true }), 40);
    }
  }

  function progressPercent() {
    if (mode === 'cover') return 0;
    if (mode === 'result') return 100;
    if (mode === 'quiz' || mode === 'quiz-intro') return 100;
    return Math.round(((sceneIndex + 1) / (scenes.length + 1)) * 100);
  }

  function renderTop() {
    const top = document.getElementById('moduleTop');
    if (!top) return;
    const pct = progressPercent();
    top.innerHTML = `<div class="module-top">
      <div class="mt-inner">
        <a class="mt-back" href="dashboard.html#modules">${ui.icon('arrowLeft')} Modules</a>
        <div class="mt-title"><span class="mt-num">${mod.num}</span><span class="mt-name">${ui.escapeHtml(mod.title)}</span></div>
        <div class="mt-right">
          <span class="mt-pct">${pct}%</span>
          <div class="mt-bar"><div class="progress"><span style="width:${pct}%"></span></div></div>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- cover ---------------- */
  function renderCover() {
    const p = store.getModuleProgress(user.id, mod.id);
    const done = p && p.status === 'completed';
    return `<div class="module-page">
      <section class="module-cover" style="--cover:${mod.accent}">
        <div class="mc-num">${mod.num}</div>
        <div class="mc-eyebrow">Tier ${String(mod.tier).padStart(2, '0')} · ${ui.escapeHtml(SP.SHADOWPROOF.tierById[mod.tier] ? SP.SHADOWPROOF.tierById[mod.tier].name : 'Module')}</div>
        <h1 class="mc-title">${ui.rich(brief.title)}</h1>
        <div class="mc-sub">${ui.escapeHtml(mod.subtitle)}</div>
        <p class="mc-lede">${ui.rich(brief.lede)}</p>
        <div class="mc-meta">
          <span class="pill">${ui.icon('clock', 'icon-sm')} ${mod.time}</span>
          <span class="pill ${mod.risk === 'High' ? 'pill-danger' : mod.risk === 'Critical' ? 'pill-danger' : 'pill-warn'}">${ui.icon('alert', 'icon-sm')} ${mod.risk} risk</span>
          <span class="pill">${ui.icon('layers', 'icon-sm')} ${scenes.length} scenes</span>
          <span class="pill cover">${ui.icon('award', 'icon-sm')} ${mod.questions.length}-question check</span>
          ${done ? `<span class="pill pill-accent">${ui.icon('check', 'icon-sm')} Completed · ${p.score}/${p.total}</span>` : ''}
        </div>
        <div class="mc-objectives">
          ${mod.objectives.map((o, i) => `<div class="mc-objective"><span class="o-num">0${i + 1} · OBJECTIVE</span><span class="o-text">${ui.escapeHtml(o)}</span></div>`).join('')}
        </div>
        <div class="mc-start">
          <button class="btn btn-primary btn-lg" id="startModule" type="button">${done ? 'Review from the beginning' : p && p.sceneIndex > 0 ? 'Resume module' : 'Begin module'} ${ui.icon('arrowRight', 'arrow')}</button>
          <span class="fine">${brief.note || 'No real credentials are collected. This is a safe simulation.'}</span>
        </div>
        <div class="mc-cover-icon">${ui.icon(mod.icon)}</div>
      </section>
    </div>`;
  }

  function wireCover() {
    const start = document.getElementById('startModule');
    if (!start) return;
    start.addEventListener('click', () => {
      store.saveProgress(user.id, mod.id, 0, scenes.length);
      mode = 'scene';
      sceneIndex = 0;
      resetSceneState();
      renderAll();
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- scene dispatch ---------------- */
  function renderScene(scene) {
    let body = '';
    if (scene.type === 'story') body = renderStory(scene);
    else if (scene.type === 'flow') body = renderFlow(scene);
    else if (scene.type === 'sim') body = renderSim(scene);
    else if (scene.type === 'classify') body = renderClassify(scene);
    else if (scene.type === 'rules') body = renderRules(scene);
    else if (scene.type === 'gallery') body = renderGallery(scene);
    else if (scene.type === 'transcript') body = renderTranscript(scene);
    else if (scene.type === 'debrief') body = renderDebrief(scene);
    else body = `<div class="prose-block"><p>${ui.rich(scene.lede || '')}</p></div>`;

    return `<div class="module-page">
      <div class="scene-stage">
        <article class="scene">
          <header class="scene-head">
            <div class="scene-label">${ui.escapeHtml(scene.label || '')}</div>
            <h1 class="scene-title" id="sceneTitle" tabindex="-1">${ui.rich(scene.title || '')}</h1>
            ${scene.lede ? `<p class="scene-lede">${ui.rich(scene.lede)}</p>` : ''}
          </header>
          ${body}
        </article>
      </div>
    </div>`;
  }

  function resetSceneState() {
    flowStep = 0;
    simAnswered = false;
    classifyAnswers = {};
    openedGallery = new Set();
    checkState = {};
    clearTimeout(flowTimer);
    const scene = scenes[sceneIndex];
    canContinue = !scene || !['sim', 'classify', 'gallery'].includes(scene.type);
    if (scene && scene.type === 'gallery') canContinue = false;
  }

  function renderStory(scene) {
    return `<div class="prose-block">${(scene.paragraphs || []).map((p) => `<p>${ui.rich(p)}</p>`).join('')}</div>
      ${scene.callout ? `<div class="scene-callout ${scene.callout.tone || 'info'}">
        <div class="co-icon">${ui.icon(scene.callout.tone === 'good' ? 'shieldCheck' : scene.callout.tone === 'warn' ? 'alert' : scene.callout.tone === 'danger' ? 'circleAlert' : 'info')}</div>
        <div><strong>${ui.escapeHtml(scene.callout.title)}</strong><p>${ui.rich(scene.callout.body)}</p></div>
      </div>` : ''}
      ${scene.quote ? `<blockquote class="scene-quote">“${ui.rich(scene.quote)}”</blockquote>` : ''}`;
  }

  function renderFlow(scene) {
    return `<div class="flow" id="flowDiagram">
      ${(scene.nodes || []).map((n, i) => `<button class="flow-node ${i === flowStep ? 'active' : ''} ${i < flowStep ? 'done' : ''}" data-flow="${i}" type="button">
        <span class="fn-icon">${ui.icon(n.icon)}</span>
        <span>
          <span class="fn-idx">STEP 0${i + 1}</span>
          <span class="fn-title" style="display:block">${ui.escapeHtml(n.label)}</span>
          <span class="fn-detail" style="display:block">${ui.rich(n.detail || '')}</span>
        </span>
      </button>`).join('')}
    </div>
    <div class="flow-toolbar">
      <button class="btn btn-ghost btn-sm" id="replayFlow" type="button">${ui.icon('play')} Replay sequence</button>
      <span class="hint">Tap a step to read what is happening.</span>
    </div>
    ${scene.caption ? `<div class="flow-caption">${ui.icon('info', 'icon-sm')} ${ui.rich(scene.caption)}</div>` : ''}`;
  }

  function renderSim(scene) {
    const c = scene.context || { kind: 'phone', name: 'Unknown', meta: '' };
    const kind = c.kind || 'phone';
    const video = kind === 'video';
    return `<div class="sim-layout">
      <div class="device kind-${kind}" id="simDevice">
        <div class="device-head">
          <span class="avatar">${ui.escapeHtml(kind === 'chat' ? '#' : (c.name || '?').split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase())}</span>
          <div><div class="dh-name">${ui.escapeHtml(c.name || 'Unknown')}</div><div class="dh-meta">${ui.escapeHtml(c.meta || '')}</div></div>
        </div>
        <div class="device-body">
          ${video ? `<div class="video-person"><div class="vp-face">${ui.icon('user')}</div><div class="vp-name">${ui.escapeHtml(c.name || 'Video call')}</div><div class="vp-meta">${ui.escapeHtml(c.meta || 'Live')}</div></div>` : ''}
          ${(scene.messages || []).map((m, i) => `<div class="msg ${m.from || 'them'}" style="animation-delay:${Math.min(i * 0.06, 0.4)}s">${ui.rich(m.text)}${m.time ? `<span class="msg-time">${ui.escapeHtml(m.time)}</span>` : ''}</div>`).join('')}
        </div>
        ${kind === 'phone' || kind === 'chat' ? `<div class="device-foot"><span class="fake-input">Message</span>${ui.icon('arrowRight')}</div>` : ''}
      </div>
      <div>
        <div class="choices" id="simChoices">
          ${(scene.choices || []).map((ch, i) => `<button class="choice" data-choice="${i}" type="button">
            <span class="c-letter">${String.fromCharCode(65 + i)}</span>
            <span>${ui.rich(ch.label)}</span>
          </button>`).join('')}
        </div>
        <div id="simFeedback"></div>
        ${scene.hint ? `<div class="sim-hint">${ui.icon('info')}<span>${ui.rich(scene.hint)}</span></div>` : ''}
      </div>
    </div>`;
  }

  function renderClassify(scene) {
    return `<div class="classify-score" id="classifyScore">
      <span>Classified <strong id="classifyCount">0 / ${scene.items.length}</strong></span>
      <div class="bar progress"><span id="classifyBar" style="width:0%"></span></div>
      <span>Correct <strong id="classifyCorrect">0</strong></span>
    </div>
    <div class="classify" style="margin-top:12px" id="classifyList">
      ${scene.items.map((item, i) => `<div class="classify-item" data-classify="${i}">
        <div class="ci-head">
          <span class="ci-from"><span class="avatar">${ui.escapeHtml((item.from || '?').slice(0, 2).toUpperCase())}</span>${ui.escapeHtml(item.from)}</span>
          <span class="ci-meta">${ui.escapeHtml(item.meta || '')}</span>
        </div>
        <div class="ci-text">${ui.rich(item.text)}</div>
        <div class="ci-actions">
          <button class="ci-btn scam" data-verdict="scam" type="button">Scam</button>
          <button class="ci-btn legit" data-verdict="legit" type="button">Legitimate</button>
        </div>
        <div class="ci-result" id="ciResult${i}"></div>
      </div>`).join('')}
    </div>`;
  }

  function renderRules(scene) {
    return `<div class="rules">${(scene.rules || []).map((r, i) => `<div class="rule">
      <span class="rule-num">RULE ${String(i + 1).padStart(2, '0')}</span>
      <div class="rule-title">${ui.rich(r.title)}</div>
      <div class="rule-body">${ui.rich(r.body)}</div>
    </div>`).join('')}</div>`;
  }

  function renderGallery(scene) {
    return `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;flex-wrap:wrap">
      <span class="pill">${ui.icon('grid', 'icon-sm')} Inspect at least 3 scenarios</span>
      <span class="tag" id="galleryCount">0 opened</span>
    </div>
    <div class="gallery">${(scene.items || []).map((item, i) => `<button class="gallery-card" data-gallery="${i}" type="button">
      <span class="gc-tag">${ui.escapeHtml(item.tag)}</span>
      <span class="gc-title">${ui.escapeHtml(item.title)}</span>
      <span class="gc-hint">${ui.icon('arrowUpRight')} Open scenario</span>
    </button>`).join('')}</div>`;
  }

  function renderTranscript(scene) {
    return `<div class="call">
      <div class="call-head"><span>◉ CALL RECORDING · INBOUND · TUESDAY 14:47</span><span class="live">LIVE</span></div>
      <div class="call-body">
        ${(scene.lines || []).map((l, i) => `<div class="call-line ${l.speaker === 'You' ? 'you' : ''}" style="animation-delay:${Math.min(i * 0.05, 0.5)}s">
          <span class="speaker">${ui.escapeHtml(l.speaker)}</span>
          <div class="line-text">${ui.rich(l.text)}${l.tell ? `<button class="tell" data-tell="${i}" type="button">${ui.icon('eye')} TELL</button>` : ''}
            ${l.tell ? `<div class="tell-body" id="tellBody${i}">${ui.rich(l.tell)}</div>` : ''}
          </div>
        </div>`).join('')}
      </div>
    </div>
    ${scene.caption ? `<p class="call-caption">“${ui.rich(scene.caption)}”</p>` : ''}`;
  }

  function renderDebrief(scene) {
    return `<div class="debrief-grid">
      <div>
        <div class="takeaway">
          <div class="tk-label">The takeaway</div>
          <p>“${ui.rich(scene.takeaway || '')}”</p>
        </div>
        <div class="check-list">
          ${(scene.checklist || []).map((c, i) => `<button class="check-item" data-check="${i}" type="button">
            <span class="box">${ui.icon('check')}</span>
            <span><span class="ct">${ui.escapeHtml(c.title)}</span><span class="cb">${ui.rich(c.body)}</span></span>
          </button>`).join('')}
        </div>
      </div>
      <aside>
        <div class="report-card">
          <div class="rc-head">${ui.icon('siren')} If it happens to you</div>
          <p>Report it through your official security channel immediately. Speed matters more than certainty. You will not be in trouble for reporting a mistake.</p>
          <a class="btn btn-ghost btn-sm" href="module.html?id=reporting" style="width:100%">Open reporting module ${ui.icon('arrowRight')}</a>
        </div>
        <div class="report-card" style="margin-top:12px">
          <div class="rc-head">${ui.icon('book')} Keep learning</div>
          <p>This module counts toward your certificate. Finish the knowledge check to earn the badge.</p>
          <button class="btn btn-soft btn-sm" id="debriefQuiz" type="button" style="width:100%">Take the check ${ui.icon('arrowRight')}</button>
        </div>
      </aside>
    </div>`;
  }

  function wireScene(scene) {
    if (scene.type === 'flow') wireFlow();
    if (scene.type === 'sim') wireSim(scene);
    if (scene.type === 'classify') wireClassify(scene);
    if (scene.type === 'gallery') wireGallery(scene);
    if (scene.type === 'transcript') wireTranscript();
    if (scene.type === 'debrief') wireDebrief();
    setContinue(canContinue);
  }

  function wireFlow() {
    const nodes = [...document.querySelectorAll('[data-flow]')];
    nodes.forEach((n) => n.addEventListener('click', () => {
      clearTimeout(flowTimer);
      flowStep = Number(n.dataset.flow);
      paintFlow();
    }));
    const replay = document.getElementById('replayFlow');
    if (replay) replay.addEventListener('click', () => {
      clearTimeout(flowTimer);
      flowStep = 0;
      paintFlow();
      const advance = () => {
        if (flowStep >= nodes.length - 1) return;
        flowStep++;
        paintFlow();
        flowTimer = setTimeout(advance, 1500);
      };
      flowTimer = setTimeout(advance, 500);
    });
    paintFlow();
  }

  function paintFlow() {
    document.querySelectorAll('[data-flow]').forEach((n, i) => {
      n.classList.toggle('active', i === flowStep);
      n.classList.toggle('done', i < flowStep);
    });
  }

  function wireSim(scene) {
    const choices = [...document.querySelectorAll('#simChoices [data-choice]')];
    choices.forEach((btn) => btn.addEventListener('click', () => {
      if (simAnswered) return;
      simAnswered = true;
      const choice = scene.choices[Number(btn.dataset.choice)];
      choices.forEach((b) => {
        b.disabled = true;
        b.classList.remove('selected');
      });
      btn.classList.add('selected', choice.verdict);
      const fb = document.getElementById('simFeedback');
      const tone = choice.verdict === 'good' ? 'good' : choice.verdict === 'bad' ? 'bad' : 'neutral';
      const iconName = tone === 'good' ? 'circleCheck' : tone === 'bad' ? 'circleX' : 'circleAlert';
      const title = tone === 'good' ? 'Strong move' : tone === 'bad' ? 'That is the trap' : 'Partially right';
      fb.innerHTML = `<div class="feedback show ${tone}">
        <span class="fb-icon">${ui.icon(iconName)}</span>
        <div><strong>${title}</strong><p>${ui.rich(choice.feedback)}</p></div>
      </div>`;
      setContinue(true);
    }));
  }

  function wireClassify(scene) {
    const items = [...document.querySelectorAll('[data-classify]')];
    const total = items.length;
    const update = () => {
      const count = Object.keys(classifyAnswers).length;
      const correct = Object.values(classifyAnswers).filter((v) => v.correct).length;
      const cEl = document.getElementById('classifyCount');
      const ccEl = document.getElementById('classifyCorrect');
      const bar = document.getElementById('classifyBar');
      if (cEl) cEl.textContent = `${count} / ${total}`;
      if (ccEl) ccEl.textContent = correct;
      if (bar) bar.style.width = `${Math.round((count / total) * 100)}%`;
      setContinue(count === total);
    };
    items.forEach((card) => {
      const idx = Number(card.dataset.classify);
      card.querySelectorAll('[data-verdict]').forEach((btn) => btn.addEventListener('click', () => {
        if (classifyAnswers[idx]) return;
        const item = scene.items[idx];
        const given = btn.dataset.verdict;
        const correct = given === item.verdict;
        classifyAnswers[idx] = { given, correct };
        card.classList.add(correct ? 'correct' : 'incorrect');
        card.querySelectorAll('[data-verdict]').forEach((b) => { b.disabled = true; });
        const result = document.getElementById(`ciResult${idx}`);
        result.className = `ci-result show ${correct ? 'good' : 'bad'}`;
        result.innerHTML = `${ui.icon(correct ? 'circleCheck' : 'circleX')}<span><strong>${correct ? 'Correct.' : `Not quite — this is ${item.verdict === 'scam' ? 'a scam' : 'legitimate'}.`}</strong> ${ui.rich(item.reason)}</span>`;
        update();
      }));
    });
    update();
  }

  function wireGallery(scene) {
    const cards = [...document.querySelectorAll('[data-gallery]')];
    const update = () => {
      const count = document.getElementById('galleryCount');
      if (count) count.textContent = `${openedGallery.size} opened`;
      setContinue(openedGallery.size >= 3);
    };
    cards.forEach((card) => card.addEventListener('click', () => {
      const idx = Number(card.dataset.gallery);
      openedGallery.add(idx);
      card.style.borderColor = 'var(--accent-line)';
      const item = scene.items[idx];
      ui.openModal(`
        <div class="gallery-detail">
          <div class="gd-tag">${ui.escapeHtml(item.tag)}</div>
          <h3>${ui.escapeHtml(item.title)}</h3>
          <p>${ui.rich(item.body)}</p>
          <div class="gd-signs">
            <div class="eyebrow" style="margin-bottom:2px">What to look for</div>
            ${(item.signs || []).map((s) => `<div class="s">${ui.icon('alert')}<span>${ui.rich(s)}</span></div>`).join('')}
          </div>
          <div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn btn-primary btn-sm" data-close type="button">Got it</button></div>
        </div>`, { title: 'Scenario detail' });
      const modal = document.getElementById('spModal');
      const close = modal.querySelector('[data-close]');
      if (close) close.addEventListener('click', ui.closeModal);
      update();
    }));
    update();
  }

  function wireTranscript() {
    document.querySelectorAll('[data-tell]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const body = document.getElementById(`tellBody${btn.dataset.tell}`);
        if (!body) return;
        const open = body.classList.toggle('show');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  function wireDebrief() {
    document.querySelectorAll('[data-check]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.check;
        checkState[idx] = !checkState[idx];
        btn.classList.toggle('checked', !!checkState[idx]);
      });
    });
    const q = document.getElementById('debriefQuiz');
    if (q) q.addEventListener('click', () => showQuizIntro());
  }

  /* ---------------- quiz ---------------- */
  function renderQuizIntro() {
    const p = store.getModuleProgress(user.id, mod.id);
    const done = p && p.status === 'completed';
    return `<div class="module-page"><div class="quiz-wrap">
      <div class="quiz-intro">
        ${ui.badgeSVG(mod, 84)}
        <span class="eyebrow">${mod.questions.length} questions · ${SP.SHADOWPROOF.passThreshold(mod)} to pass</span>
        <h2>${ui.rich('Prove the *pattern.*')}</h2>
        <p>You have reached the knowledge check for <strong>${ui.escapeHtml(mod.title)}</strong>. Each answer comes with an explanation. ${done ? 'You have already earned this badge — a retake will keep your best score.' : 'Pass to earn the module badge and mark it complete.'}</p>
        <div class="result-actions">
          <button class="btn btn-primary btn-lg" id="quizStart" type="button">${done ? 'Retake the check' : 'Start the check'} ${ui.icon('arrowRight', 'arrow')}</button>
          <button class="btn btn-ghost" id="quizBack" type="button">Review scenes</button>
        </div>
      </div>
    </div></div>`;
  }

  function wireQuizIntro() {
    const start = document.getElementById('quizStart');
    if (start) start.addEventListener('click', startQuiz);
    const back = document.getElementById('quizBack');
    if (back) back.addEventListener('click', () => { mode = 'scene'; sceneIndex = scenes.length - 1; renderAll(); });
  }

  function startQuiz() {
    mode = 'quiz';
    quizIndex = 0;
    quizAnswers = [];
    quizAnswered = [];
    quizResult = null;
    renderAll();
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }

  function renderQuizQuestion() {
    const q = mod.questions[quizIndex];
    const answered = quizAnswered[quizIndex];
    return `<div class="module-page"><div class="quiz-wrap">
      <div class="quiz-card">
        <div class="quiz-top">
          <div class="quiz-dots">${mod.questions.map((_, i) => `<span class="${i === quizIndex ? 'active' : i < quizIndex ? 'done' : ''}"></span>`).join('')}</div>
          <span class="quiz-count">${String(quizIndex + 1).padStart(2, '0')} / ${String(mod.questions.length).padStart(2, '0')}</span>
        </div>
        <h2 class="quiz-q">${ui.rich(q.question)}</h2>
        <div class="quiz-options" id="quizOptions">
          ${q.options.map((opt, i) => {
            let cls = '';
            if (answered) {
              if (i === q.correct) cls = 'correct';
              else if (i === quizAnswers[quizIndex]) cls = 'wrong';
            }
            return `<button class="quiz-option ${cls}" data-answer="${i}" type="button" ${answered ? 'disabled' : ''}>
              <span class="q-letter">${String.fromCharCode(65 + i)}</span><span>${ui.rich(opt)}</span>
            </button>`;
          }).join('')}
        </div>
        <div class="quiz-feedback ${answered ? 'show' : ''}" id="quizFeedback">
          ${answered ? `<strong>${quizAnswers[quizIndex] === q.correct ? 'Correct.' : 'Not quite.'}</strong>${ui.rich(q.explanation)}` : ''}
        </div>
        <div class="quiz-actions">
          <button class="btn btn-ghost btn-sm" id="quizQuit" type="button">Exit check</button>
          <button class="btn btn-primary ${answered ? '' : 'is-disabled'}" id="quizNext" type="button" ${answered ? '' : 'disabled'}>${quizIndex === mod.questions.length - 1 ? 'See result' : 'Next question'} ${ui.icon('arrowRight')}</button>
        </div>
      </div>
    </div></div>`;
  }

  function wireQuizQuestion() {
    const q = mod.questions[quizIndex];
    document.querySelectorAll('[data-answer]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (quizAnswered[quizIndex]) return;
        const given = Number(btn.dataset.answer);
        quizAnswers[quizIndex] = given;
        quizAnswered[quizIndex] = true;
        const opts = [...document.querySelectorAll('[data-answer]')];
        opts.forEach((b) => {
          const i = Number(b.dataset.answer);
          b.disabled = true;
          if (i === q.correct) b.classList.add('correct');
          else if (i === given) b.classList.add('wrong');
        });
        const fb = document.getElementById('quizFeedback');
        fb.classList.add('show');
        fb.innerHTML = `<strong>${given === q.correct ? 'Correct.' : 'Not quite.'}</strong>${ui.rich(q.explanation)}`;
        const next = document.getElementById('quizNext');
        next.disabled = false;
        next.classList.remove('is-disabled');
      });
    });
    const next = document.getElementById('quizNext');
    if (next) next.addEventListener('click', () => {
      if (!quizAnswered[quizIndex]) return;
      if (quizIndex < mod.questions.length - 1) {
        quizIndex++;
        renderAll();
      } else {
        finishQuiz();
      }
    });
    const quit = document.getElementById('quizQuit');
    if (quit) quit.addEventListener('click', async () => {
      const ok = await ui.confirm({ title: 'Exit the knowledge check?', body: 'Your answers for this attempt will be discarded. Your scene progress is saved.', confirmText: 'Exit check' });
      if (ok) { mode = 'quiz-intro'; renderAll(); }
    });
  }

  function finishQuiz() {
    const result = store.submitAssessment(user.id, mod.id, quizAnswers);
    quizResult = result;
    mode = 'result';
    renderAll();
    if (result.passed) {
      ui.confetti([mod.accent, '#57e6a1', '#b79bff', '#ffc46b']);
      store.logEvent(user.id, 'module.complete', mod.id, { score: result.score });
    }
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }

  function renderResult() {
    const r = quizResult;
    const pct = Math.round((r.score / r.total) * 100);
    const nextMod = SP.SHADOWPROOF.modules.find((m) => {
      if (m.id === mod.id) return false;
      const p = store.getModuleProgress(user.id, m.id);
      return !p || p.status !== 'completed';
    });
    const cert = store.certificate(user.id);
    return `<div class="module-page"><div class="quiz-wrap">
      <div class="quiz-card">
        <div class="quiz-result">
          <div class="result-ring ${r.passed ? '' : 'fail'}" style="--p:${pct}">
            <svg viewBox="0 0 148 148" aria-hidden="true">
              <circle class="track" cx="74" cy="74" r="70" fill="none" stroke-width="7"/>
              <circle class="fill" cx="74" cy="74" r="70" fill="none" stroke-width="7" stroke-dasharray="440" stroke-dashoffset="${440 - (440 * pct / 100)}"/>
            </svg>
            <div class="rr-center"><div class="score">${r.score}<span style="font-size:.45em;color:var(--text-3)">/${r.total}</span></div><div class="of">${pct}%</div></div>
          </div>
          <span class="eyebrow">${r.passed ? 'Badge earned' : 'Not passed yet'}</span>
          <h2>${ui.rich(r.passed ? 'That is the *pattern.*' : 'Close. *Try once more.*')}</h2>
          <p>${r.passed ? `You passed the ${ui.escapeHtml(mod.title)} check. The badge is saved to your profile.` : `You need ${r.threshold} of ${r.total} correct to pass. Review the explanations below, then retake the check.`}</p>
          ${r.passed && r.badge ? `<div class="badge-earned">
            ${ui.badgeSVG(mod, 64)}
            <div><div class="be-title">${ui.escapeHtml(mod.title)} badge</div><div class="be-sub">${r.badge.score}/${r.badge.total} · ${ui.formatDate(r.badge.earnedAt)}</div><div class="be-code">${r.badge.badgeCode}</div></div>
          </div>` : ''}
          <div class="result-tips">
            ${r.results.map((res, i) => `<div class="result-tip ${res.correct ? 'good' : 'bad'}">
              ${ui.icon(res.correct ? 'circleCheck' : 'circleX')}
              <span><strong>Q${i + 1}</strong> ${res.correct ? 'Correct' : 'Review this one'} · ${ui.escapeHtml(shorten(mod.questions[i].question, 70))}</span>
            </div>`).join('')}
          </div>
          <div class="result-actions">
            ${r.passed
              ? `<a class="btn btn-primary" href="${nextMod ? `module.html?id=${nextMod.id}` : 'dashboard.html'}">${nextMod ? `Next: ${ui.escapeHtml(nextMod.title)}` : 'Back to dashboard'} ${ui.icon('arrowRight')}</a>
                 <a class="btn btn-ghost" href="dashboard.html">Dashboard</a>
                 ${cert.eligible ? `<a class="btn btn-ghost" href="certificate.html">${ui.icon('certificate')} Certificate</a>` : ''}`
              : `<button class="btn btn-primary" id="retryQuiz" type="button">${ui.icon('rotate')} Retake the check</button>
                 <button class="btn btn-ghost" id="reviewAgain" type="button">Review scenes</button>`}
          </div>
        </div>
      </div>
    </div></div>`;
  }

  function wireResult() {
    const retry = document.getElementById('retryQuiz');
    if (retry) retry.addEventListener('click', startQuiz);
    const review = document.getElementById('reviewAgain');
    if (review) review.addEventListener('click', () => { mode = 'scene'; sceneIndex = 0; resetSceneState(); renderAll(); });
  }

  function shorten(text, n) {
    const s = String(text || '');
    return s.length > n ? `${s.slice(0, n - 1)}…` : s;
  }

  function showQuizIntro() {
    mode = 'quiz-intro';
    renderAll();
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }

  /* ---------------- bottom navigation ---------------- */
  function renderNav() {
    const nav = document.getElementById('sceneNavbar');
    if (!nav) return;
    if (mode === 'cover' || mode === 'result') {
      nav.innerHTML = '';
      return;
    }
    const dots = [
      ...scenes.map((_, i) => `<button class="sn-dot ${mode === 'scene' && i === sceneIndex ? 'active' : mode === 'scene' && i < sceneIndex ? 'done' : mode !== 'scene' ? 'done' : ''}" data-dot="${i}" type="button" aria-label="Scene ${i + 1}"></button>`),
      `<button class="sn-dot ${mode !== 'scene' ? 'active' : ''}" data-dot="quiz" type="button" aria-label="Knowledge check"></button>`
    ].join('');
    const label = mode === 'scene' ? `Scene ${sceneIndex + 1} of ${scenes.length}` : mode === 'quiz-intro' ? 'Knowledge check' : `Question ${quizIndex + 1} of ${mod.questions.length}`;
    const navContinue = mode === 'quiz' ? !!quizAnswered[quizIndex] : canContinue;
    nav.innerHTML = `<div class="scene-navbar"><div class="sn-inner">
      <button class="btn btn-ghost btn-sm" id="navBack" type="button">${ui.icon('arrowLeft')} Back</button>
      <div class="sn-stage">${dots}<span class="sn-label">${label}</span></div>
      <button class="btn btn-primary btn-sm ${navContinue ? '' : 'is-disabled'}" id="navNext" type="button" ${navContinue ? '' : 'disabled'}>
        ${mode === 'scene' && sceneIndex === scenes.length - 1 ? 'Knowledge check' : mode === 'quiz-intro' ? 'Start check' : 'Continue'} ${ui.icon('arrowRight')}
      </button>
    </div></div>`;
    const back = document.getElementById('navBack');
    if (back) back.addEventListener('click', goBack);
    const next = document.getElementById('navNext');
    if (next) next.addEventListener('click', goNext);
    nav.querySelectorAll('[data-dot]').forEach((d) => d.addEventListener('click', () => {
      clearTimeout(flowTimer);
      if (d.dataset.dot === 'quiz') { showQuizIntro(); return; }
      mode = 'scene';
      sceneIndex = Number(d.dataset.dot);
      resetSceneState();
      renderAll();
    }));
  }

  function goBack() {
    if (mode === 'quiz') {
      if (quizIndex > 0) { quizIndex--; renderAll(); }
      else showQuizIntro();
      return;
    }
    if (mode === 'quiz-intro') { mode = 'scene'; sceneIndex = scenes.length - 1; resetSceneState(); renderAll(); return; }
    if (sceneIndex > 0) {
      sceneIndex--;
      resetSceneState();
      store.saveProgress(user.id, mod.id, sceneIndex, scenes.length);
      renderAll();
    } else {
      mode = 'cover';
      renderAll();
    }
  }

  function goNext() {
    if (!canContinue) return;
    if (mode === 'quiz-intro') { startQuiz(); return; }
    if (mode === 'quiz') {
      const next = document.getElementById('quizNext');
      if (next) next.click();
      return;
    }
    if (sceneIndex < scenes.length - 1) {
      sceneIndex++;
      resetSceneState();
      store.saveProgress(user.id, mod.id, sceneIndex, scenes.length);
      renderAll();
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    } else {
      store.saveProgress(user.id, mod.id, scenes.length - 1, scenes.length);
      showQuizIntro();
    }
  }

  function setContinue(value) {
    canContinue = value;
    const next = document.getElementById('navNext');
    if (!next) return;
    next.disabled = !value;
    next.classList.toggle('is-disabled', !value);
  }

  function bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, select')) return;
      if (document.querySelector('.modal-backdrop.open')) return;
      if (mode === 'cover' || mode === 'result') return;
      if (e.key === 'ArrowRight' && canContinue) goNext();
      if (e.key === 'ArrowLeft') goBack();
    });
  }
})();
