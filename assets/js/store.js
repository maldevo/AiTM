/* ============================================================
   SHADOWPROOF — local-first repository
   Everything lives in this browser. No network, no server.
   ============================================================ */
(function () {
  const K = {
    users: 'sp:users:v2',
    session: 'sp:session:v2',
    progress: 'sp:progress:v2',
    badges: 'sp:badges:v2',
    attempts: 'sp:attempts:v2',
    events: 'sp:events:v2'
  };
  const SESSION_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('SHADOWPROOF: could not persist', key, e);
      return false;
    }
  }

  function uid(prefix) {
    return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  }

  function now() { return new Date().toISOString(); }

  function normalizeEmail(email) { return String(email || '').trim().toLowerCase(); }

  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizeEmail(email));
  }

  function users() { return read(K.users, []); }
  function saveUsers(list) { return write(K.users, list); }
  function progressAll() { return read(K.progress, {}); }
  function saveProgressAll(map) { return write(K.progress, map); }
  function badgesAll() { return read(K.badges, {}); }
  function saveBadgesAll(map) { return write(K.badges, map); }
  function attemptsAll() { return read(K.attempts, {}); }
  function saveAttemptsAll(map) { return write(K.attempts, map); }
  function eventsAll() { return read(K.events, []); }
  function saveEvents(list) { return write(K.events, list.slice(0, 800)); }
  function sessionRaw() { return read(K.session, null); }

  function publicUser(user) {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      dept: user.dept || '',
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt || null
    };
  }

  function findUserByEmail(email) {
    const target = normalizeEmail(email);
    return users().find((u) => normalizeEmail(u.email) === target) || null;
  }

  function findUserById(id) {
    return users().find((u) => u.id === id) || null;
  }

  /* ---------------- password hashing ---------------- */
  const enc = new TextEncoder();

  function bufToB64(buf) {
    let binary = '';
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function b64ToBuf(b64) {
    const binary = atob(b64);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  }

  async function derive(password, saltB64) {
    const salt = b64ToBuf(saltB64);
    if (window.crypto && window.crypto.subtle) {
      try {
        const key = await window.crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
        const bits = await window.crypto.subtle.deriveBits(
          { name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' },
          key,
          256
        );
        return { hash: bufToB64(bits), algo: 'pbkdf2-sha256' };
      } catch (e) {
        /* fall through to local fallback */
      }
    }
    // Local-only fallback for contexts without WebCrypto (e.g. some file:// views).
    let seed = 2166136261;
    for (let i = 0; i < salt.length; i++) seed = (seed ^ salt[i]) >>> 0, seed = Math.imul(seed, 16777619) >>> 0;
    const input = `${saltB64}:${password}`;
    let a = seed, b = 0x9e3779b9, c = 0x85ebca6b, d = 0xc2b2ae35;
    for (let i = 0; i < 24000; i++) {
      for (let j = 0; j < input.length; j++) {
        const code = input.charCodeAt(j) + i;
        a = Math.imul(a ^ code, 2654435761) >>> 0;
        b = Math.imul(b + code, 1597334677) >>> 0;
        c = Math.imul(c ^ (a >>> 7), 2246822519) >>> 0;
        d = Math.imul(d + (b >>> 5), 3266489917) >>> 0;
      }
    }
    const word = (n) => n.toString(16).padStart(8, '0');
    return { hash: word(a) + word(b) + word(c) + word(d), algo: 'local-fallback' };
  }

  async function makePasswordRecord(password) {
    const salt = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(salt);
    else for (let i = 0; i < salt.length; i++) salt[i] = Math.floor(Math.random() * 256);
    const saltB64 = bufToB64(salt);
    const { hash, algo } = await derive(password, saltB64);
    return { salt: saltB64, hash, algo, createdAt: now() };
  }

  async function verifyPasswordRecord(password, record) {
    if (!record || !record.salt || !record.hash) return false;
    const { hash } = await derive(password, record.salt);
    if (hash.length !== record.hash.length) return false;
    let diff = 0;
    for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ record.hash.charCodeAt(i);
    return diff === 0;
  }

  function passwordStrength(password) {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  }

  /* ---------------- session ---------------- */
  function currentUser() {
    const s = sessionRaw();
    if (!s || !s.userId) return null;
    if (s.createdAt && Date.now() - new Date(s.createdAt).getTime() > SESSION_MAX_AGE) {
      try { localStorage.removeItem(K.session); } catch (e) {}
      return null;
    }
    const user = findUserById(s.userId);
    if (!user || user.status !== 'active') {
      try { localStorage.removeItem(K.session); } catch (e) {}
      return null;
    }
    return publicUser(user);
  }

  function setSession(userId) {
    write(K.session, { userId, createdAt: now(), lastSeenAt: now() });
  }

  function touchSession() {
    const s = sessionRaw();
    if (s) { s.lastSeenAt = now(); write(K.session, s); }
  }

  /* ---------------- events ---------------- */
  function logEvent(userId, type, moduleId, meta) {
    const list = eventsAll();
    list.unshift({
      id: uid('ev'),
      userId: userId || null,
      type,
      moduleId: moduleId || null,
      meta: meta || null,
      createdAt: now()
    });
    saveEvents(list);
  }

  function userEvents(userId, limit) {
    return eventsAll().filter((e) => e.userId === userId).slice(0, limit || 20);
  }

  /* ---------------- auth ---------------- */
  async function register({ name, email, dept, password }) {
    const cleanName = String(name || '').trim();
    const cleanEmail = normalizeEmail(email);
    const errors = {};
    if (cleanName.length < 2) errors.name = 'Please enter your full name.';
    if (!validEmail(cleanEmail)) errors.email = 'Enter a valid email address.';
    if (!password || password.length < 8) errors.password = 'Use at least 8 characters.';
    if (password && passwordStrength(password) < 2) errors.password = 'Add a mix of letters, numbers, or symbols.';
    if (findUserByEmail(cleanEmail)) errors.email = 'An account with this email already exists on this device.';
    if (Object.keys(errors).length) return { ok: false, errors };

    const isFirst = users().length === 0;
    const record = await makePasswordRecord(password);
    const user = {
      id: uid('u'),
      name: cleanName,
      email: cleanEmail,
      dept: String(dept || '').trim(),
      role: isFirst ? 'admin' : 'learner',
      status: 'active',
      createdAt: now(),
      lastLoginAt: now(),
      password: record
    };
    const list = users();
    list.push(user);
    saveUsers(list);
    setSession(user.id);
    logEvent(user.id, 'user.register', null, { role: user.role });
    logEvent(user.id, 'user.login', null, { method: 'password' });
    return { ok: true, user: publicUser(user), isFirst };
  }

  async function login(email, password) {
    const user = findUserByEmail(email);
    if (!user) return { ok: false, error: 'No account matches that email on this device.' };
    if (user.status !== 'active') return { ok: false, error: 'This account is suspended. Ask the workspace owner to restore it.' };
    const valid = await verifyPasswordRecord(password, user.password);
    if (!valid) return { ok: false, error: 'That password does not match. Try again.' };
    const list = users();
    const row = list.find((u) => u.id === user.id);
    row.lastLoginAt = now();
    saveUsers(list);
    setSession(user.id);
    logEvent(user.id, 'user.login', null, { method: 'password' });
    return { ok: true, user: publicUser(row) };
  }

  function logout() {
    const u = currentUser();
    if (u) logEvent(u.id, 'user.logout');
    try { localStorage.removeItem(K.session); } catch (e) {}
  }

  function signInAs(userId) {
    const user = findUserById(userId);
    if (!user || user.status !== 'active') return false;
    const list = users();
    const row = list.find((u) => u.id === userId);
    row.lastLoginAt = now();
    saveUsers(list);
    setSession(userId);
    logEvent(userId, 'user.login', null, { method: 'profile' });
    return true;
  }

  function listLocalProfiles() {
    return users().map((u) => ({ ...publicUser(u), hasPassword: !!u.password }));
  }

  function updateProfile({ name, dept }) {
    const me = currentUser();
    if (!me) return { ok: false, error: 'Not signed in.' };
    const clean = String(name || '').trim();
    if (clean.length < 2) return { ok: false, error: 'Name is too short.' };
    const list = users();
    const row = list.find((u) => u.id === me.id);
    row.name = clean;
    row.dept = String(dept || '').trim();
    saveUsers(list);
    logEvent(me.id, 'user.profile_update');
    return { ok: true, user: publicUser(row) };
  }

  async function changePassword(current, next) {
    const me = currentUser();
    if (!me) return { ok: false, error: 'Not signed in.' };
    const list = users();
    const row = list.find((u) => u.id === me.id);
    const valid = await verifyPasswordRecord(current, row.password);
    if (!valid) return { ok: false, error: 'Current password is incorrect.' };
    if (!next || next.length < 8) return { ok: false, error: 'New password must be at least 8 characters.' };
    row.password = await makePasswordRecord(next);
    saveUsers(list);
    logEvent(me.id, 'user.password_change');
    return { ok: true };
  }

  /* ---------------- progress & assessment ---------------- */
  function getProgress(userId) {
    const all = progressAll();
    return all[userId] || {};
  }

  function getModuleProgress(userId, moduleId) {
    return getProgress(userId)[moduleId] || null;
  }

  function saveProgress(userId, moduleId, sceneIndex, totalScenes) {
    if (!userId || !moduleId) return null;
    const all = progressAll();
    const userMap = all[userId] || (all[userId] = {});
    const isNew = !userMap[moduleId];
    const existing = userMap[moduleId] || {
      moduleId,
      status: 'in_progress',
      sceneIndex: 0,
      totalScenes: totalScenes || 0,
      startedAt: now(),
      updatedAt: now()
    };
    existing.sceneIndex = existing.status === 'completed' ? existing.sceneIndex : Math.max(0, sceneIndex | 0);
    existing.totalScenes = totalScenes || existing.totalScenes;
    existing.updatedAt = now();
    userMap[moduleId] = existing;
    saveProgressAll(all);
    if (isNew) logEvent(userId, 'module.start', moduleId);
    return existing;
  }

  function gradeModule(moduleId, answers) {
    const mod = window.SHADOWPROOF && window.SHADOWPROOF.get(moduleId);
    if (!mod) return null;
    const results = mod.questions.map((q, i) => {
      const given = Number(answers[i]);
      const correct = given === q.correct;
      return { index: i, given, correctIndex: q.correct, correct, explanation: q.explanation };
    });
    const score = results.filter((r) => r.correct).length;
    const total = mod.questions.length;
    const threshold = window.SHADOWPROOF.passThreshold(mod);
    return { results, score, total, threshold, passed: score >= threshold };
  }

  function submitAssessment(userId, moduleId, answers) {
    const mod = window.SHADOWPROOF && window.SHADOWPROOF.get(moduleId);
    if (!mod) return { ok: false, error: 'Module not found.' };
    const graded = gradeModule(moduleId, answers);
    const allAttempts = attemptsAll();
    const attempt = {
      id: uid('at'),
      moduleId,
      score: graded.score,
      total: graded.total,
      passed: graded.passed,
      answers: answers.slice(),
      createdAt: now()
    };
    (allAttempts[userId] || (allAttempts[userId] = [])).unshift(attempt);
    allAttempts[userId] = allAttempts[userId].slice(0, 100);
    saveAttemptsAll(allAttempts);

    let badge = null;
    if (graded.passed) {
      const all = progressAll();
      const userMap = all[userId] || (all[userId] = {});
      const existing = userMap[moduleId] || {};
      const completedAt = existing.completedAt || now();
      userMap[moduleId] = {
        ...existing,
        moduleId,
        status: 'completed',
        sceneIndex: existing.sceneIndex || 0,
        totalScenes: existing.totalScenes || mod.scenes.length,
        score: graded.score,
        total: graded.total,
        startedAt: existing.startedAt || now(),
        updatedAt: now(),
        completedAt
      };
      saveProgressAll(all);

      const badges = badgesAll();
      const userBadges = badges[userId] || (badges[userId] = {});
      const prev = userBadges[moduleId];
      badge = {
        moduleId,
        badgeCode: prev ? prev.badgeCode : `SHDW-${moduleId.slice(0, 5).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        score: prev ? Math.max(prev.score, graded.score) : graded.score,
        total: graded.total,
        earnedAt: prev ? prev.earnedAt : now()
      };
      userBadges[moduleId] = badge;
      saveBadgesAll(badges);
      logEvent(userId, 'module.pass', moduleId, { score: graded.score, total: graded.total });
      logEvent(userId, 'badge.earned', moduleId, { badgeCode: badge.badgeCode });
    } else {
      logEvent(userId, 'module.fail', moduleId, { score: graded.score, total: graded.total });
    }
    return { ok: true, ...graded, badge, attemptId: attempt.id };
  }

  function getBadges(userId) {
    const badges = badgesAll()[userId] || {};
    return badges;
  }

  function getBadge(userId, moduleId) {
    return (badgesAll()[userId] || {})[moduleId] || null;
  }

  function attemptsFor(userId, moduleId) {
    const list = attemptsAll()[userId] || [];
    return moduleId ? list.filter((a) => a.moduleId === moduleId) : list;
  }

  function resetProgress(userId) {
    const p = progressAll();
    delete p[userId];
    saveProgressAll(p);
    const b = badgesAll();
    delete b[userId];
    saveBadgesAll(b);
    const a = attemptsAll();
    delete a[userId];
    saveAttemptsAll(a);
    logEvent(userId, 'progress.reset');
  }

  /* ---------------- dashboard aggregates ---------------- */
  function dashboard(userId) {
    const me = findUserById(userId);
    if (!me) return null;
    const modules = (window.SHADOWPROOF && window.SHADOWPROOF.modules) || [];
    const progress = getProgress(userId);
    const badges = getBadges(userId);
    const attempts = attemptsFor(userId);
    const completed = modules.filter((m) => progress[m.id] && progress[m.id].status === 'completed');
    const inProgress = modules.filter((m) => progress[m.id] && progress[m.id].status !== 'completed');
    const next = modules.find((m) => !progress[m.id] || progress[m.id].status !== 'completed') || null;
    const totalScenes = modules.reduce((n, m) => n + m.scenes.length, 0);
    const seenScenes = modules.reduce((n, m) => {
      const p = progress[m.id];
      return n + (p && p.status === 'completed' ? m.scenes.length : (p ? Math.min(m.scenes.length, (p.sceneIndex || 0) + 1) : 0));
    }, 0);
    const minutes = Math.round((seenScenes / Math.max(1, totalScenes)) * modules.reduce((n, m) => n + parseInt(m.time, 10), 0));
    const avg = attempts.length ? Math.round(attempts.reduce((n, a) => n + (a.score / a.total) * 100, 0) / attempts.length) : null;
    return {
      user: publicUser(me),
      modules,
      progress,
      badges,
      attempts,
      completed,
      inProgress,
      next,
      stats: {
        totalModules: modules.length,
        completedCount: completed.length,
        percent: Math.round((completed.length / Math.max(1, modules.length)) * 100),
        badges: Object.keys(badges).length,
        minutes,
        avgScore: avg,
        scenesSeen: seenScenes,
        totalScenes
      },
      events: userEvents(userId, 12),
      certificate: certificate(userId)
    };
  }

  function certificate(userId) {
    const me = findUserById(userId);
    if (!me) return null;
    const modules = (window.SHADOWPROOF && window.SHADOWPROOF.modules) || [];
    const progress = getProgress(userId);
    const completed = modules.filter((m) => progress[m.id] && progress[m.id].status === 'completed');
    const eligible = modules.length > 0 && completed.length === modules.length;
    const newest = completed.reduce((latest, m) => {
      const t = progress[m.id].completedAt || '';
      return t > latest ? t : latest;
    }, '');
    return {
      eligible,
      completedCount: completed.length,
      total: modules.length,
      code: eligible ? `SHDW-CERT-${String(me.id).slice(-4).toUpperCase()}-${new Date(newest || Date.now()).getFullYear()}` : null,
      issuedAt: eligible ? newest : null,
      name: me.name,
      dept: me.dept || '',
      scoreAvg: (() => {
        const list = attemptsFor(userId);
        if (!list.length) return null;
        return Math.round(list.reduce((n, a) => n + (a.score / a.total) * 100, 0) / list.length);
      })()
    };
  }

  /* ---------------- admin ---------------- */
  function adminOverview() {
    const allUsers = users();
    const allProgress = progressAll();
    const allBadges = badgesAll();
    const allAttempts = attemptsAll();
    const allEvents = eventsAll();
    const modules = (window.SHADOWPROOF && window.SHADOWPROOF.modules) || [];
    const moduleIds = modules.map((m) => m.id);

    let completions = 0;
    const perModuleMap = {};
    moduleIds.forEach((id) => { perModuleMap[id] = { completions: 0, totalScore: 0, attempts: 0 }; });
    Object.values(allProgress).forEach((userMap) => {
      Object.entries(userMap).forEach(([mid, p]) => {
        if (p.status === 'completed') {
          completions++;
          if (perModuleMap[mid]) perModuleMap[mid].completions++;
        }
      });
    });
    const attemptList = Object.values(allAttempts).flat();
    attemptList.forEach((a) => {
      if (perModuleMap[a.moduleId]) {
        perModuleMap[a.moduleId].totalScore += (a.score / a.total) * 100;
        perModuleMap[a.moduleId].attempts++;
      }
    });
    const perModule = modules.map((m) => {
      const row = perModuleMap[m.id] || { completions: 0, totalScore: 0, attempts: 0 };
      return {
        moduleId: m.id,
        title: m.title,
        tier: m.tier,
        accent: m.accent,
        completions: row.completions,
        avgScore: row.attempts ? Math.round(row.totalScore / row.attempts) : 0,
        attempts: row.attempts
      };
    });

    const tiers = (window.SHADOWPROOF ? window.SHADOWPROOF.tiers : []).map((t) => {
      const ids = modules.filter((m) => m.tier === t.id).map((m) => m.id);
      const count = ids.reduce((n, id) => n + (perModuleMap[id] ? perModuleMap[id].completions : 0), 0);
      return { id: t.id, name: t.name, accent: t.accent, completions: count };
    });

    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      days.push({ day: key, count: allEvents.filter((e) => String(e.createdAt).slice(0, 10) === key).length });
    }

    const scoreDistribution = [0, 1, 2, 3, 4].map((score) => ({
      score,
      count: attemptList.filter((a) => a.score === score).length
    }));

    const active7d = new Set(allEvents.filter((e) => Date.now() - new Date(e.createdAt).getTime() < 7 * 86400000).map((e) => e.userId).filter(Boolean)).size;
    const newUsers = allUsers.filter((u) => Date.now() - new Date(u.createdAt).getTime() < 30 * 86400000).length;
    const avgScore = attemptList.length ? Math.round(attemptList.reduce((n, a) => n + (a.score / a.total) * 100, 0) / attemptList.length) : 0;
    const completionRate = allUsers.length ? Math.round((completions / (allUsers.length * Math.max(1, modules.length))) * 100) : 0;

    return {
      totals: {
        users: allUsers.length,
        activeUsers: allUsers.filter((u) => u.status === 'active').length,
        admins: allUsers.filter((u) => u.role === 'admin').length,
        active7d,
        newUsers,
        completions,
        badges: Object.values(allBadges).reduce((n, b) => n + Object.keys(b).length, 0),
        attempts: attemptList.length,
        avgScore,
        completionRate,
        modules: modules.length
      },
      perModule,
      tiers,
      activity: days,
      scoreDistribution,
      recent: allEvents.slice(0, 25).map((e) => {
        const u = allUsers.find((x) => x.id === e.userId);
        return { ...e, userName: u ? u.name : 'Unknown', userEmail: u ? u.email : '' };
      }),
      modulesById: Object.fromEntries(modules.map((m) => [m.id, m]))
    };
  }

  function adminListUsers({ search = '', page = 1, limit = 10, sort = 'createdAt', dir = 'desc' } = {}) {
    const allProgress = progressAll();
    const allBadges = badgesAll();
    let rows = users().map((u) => ({
      ...publicUser(u),
      completed: Object.values(allProgress[u.id] || {}).filter((p) => p.status === 'completed').length,
      badges: Object.keys(allBadges[u.id] || {}).length
    }));
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.dept || '').toLowerCase().includes(q));
    }
    const dirSign = dir === 'asc' ? 1 : -1;
    rows.sort((a, b) => {
      const av = a[sort] || '';
      const bv = b[sort] || '';
      if (av < bv) return -1 * dirSign;
      if (av > bv) return 1 * dirSign;
      return 0;
    });
    const total = rows.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(Math.max(1, page), pages);
    const slice = rows.slice((safePage - 1) * limit, safePage * limit);
    return { users: slice, total, page: safePage, pages, limit };
  }

  function adminUserDetail(userId) {
    const user = findUserById(userId);
    if (!user) return null;
    return {
      user: publicUser(user),
      progress: getProgress(userId),
      badges: getBadges(userId),
      attempts: attemptsFor(userId),
      events: userEvents(userId, 30)
    };
  }

  function setUserRole(userId, role) {
    if (!['admin', 'learner'].includes(role)) return { ok: false, error: 'Invalid role.' };
    const list = users();
    const row = list.find((u) => u.id === userId);
    if (!row) return { ok: false, error: 'User not found.' };
    if (row.role === 'admin' && role !== 'admin') {
      const admins = list.filter((u) => u.role === 'admin' && u.status === 'active');
      if (admins.length <= 1) return { ok: false, error: 'The workspace must keep at least one active admin.' };
    }
    row.role = role;
    saveUsers(list);
    const me = currentUser();
    logEvent(me ? me.id : null, 'admin.role_change', null, { target: userId, role });
    return { ok: true, user: publicUser(row) };
  }

  function setUserStatus(userId, status) {
    if (!['active', 'suspended'].includes(status)) return { ok: false, error: 'Invalid status.' };
    const list = users();
    const row = list.find((u) => u.id === userId);
    if (!row) return { ok: false, error: 'User not found.' };
    const me = currentUser();
    if (me && me.id === userId && status === 'suspended') return { ok: false, error: 'You cannot suspend your own account.' };
    if (row.role === 'admin' && status === 'suspended') {
      const admins = list.filter((u) => u.role === 'admin' && u.status === 'active');
      if (admins.length <= 1) return { ok: false, error: 'The workspace must keep at least one active admin.' };
    }
    row.status = status;
    saveUsers(list);
    if (status === 'suspended') {
      // Remove active sessions for the suspended user by checking the current session.
      const s = sessionRaw();
      if (s && s.userId === userId) {
        try { localStorage.removeItem(K.session); } catch (e) {}
      }
    }
    logEvent(me ? me.id : null, 'admin.status_change', null, { target: userId, status });
    return { ok: true, user: publicUser(row) };
  }

  function adminExportCsv() {
    const modules = (window.SHADOWPROOF && window.SHADOWPROOF.modules) || [];
    const allProgress = progressAll();
    const allBadges = badgesAll();
    const header = ['Name', 'Email', 'Department', 'Role', 'Status', 'Joined', 'Last login', 'Modules completed', 'Badges', ...modules.map((m) => `${m.num} ${m.title}`)];
    const rows = users().map((u) => {
      const prog = allProgress[u.id] || {};
      const badges = allBadges[u.id] || {};
      const completed = Object.values(prog).filter((p) => p.status === 'completed').length;
      return [
        u.name, u.email, u.dept || '', u.role, u.status, u.createdAt, u.lastLoginAt || '', completed, Object.keys(badges).length,
        ...modules.map((m) => {
          const p = prog[m.id];
          if (!p) return '';
          if (p.status === 'completed') return `${p.score}/${p.total}`;
          return `in progress ${p.sceneIndex + 1}/${p.sceneCount || p.totalScenes || m.scenes.length}`;
        })
      ];
    });
    const escape = (v) => {
      const s = String(v == null ? '' : v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    return [header, ...rows].map((r) => r.map(escape).join(',')).join('\r\n');
  }

  function resetWorkspace() {
    [K.users, K.session, K.progress, K.badges, K.attempts, K.events].forEach((k) => {
      try { localStorage.removeItem(k); } catch (e) {}
    });
  }

  function resetAllDataForUser(userId) {
    resetProgress(userId);
  }

  function storageBytes() {
    let total = 0;
    Object.values(K).forEach((k) => {
      try { total += (localStorage.getItem(k) || '').length; } catch (e) {}
    });
    return total;
  }

  function exportUserData(userId) {
    const me = findUserById(userId);
    if (!me) return null;
    return {
      exportedAt: now(),
      product: 'SHADOWPROOF',
      version: 2,
      user: publicUser(me),
      progress: getProgress(userId),
      badges: getBadges(userId),
      attempts: attemptsFor(userId),
      events: userEvents(userId, 200),
      certificate: certificate(userId)
    };
  }

  window.SP = window.SP || {};
  window.SP.store = {
    KEYS: K,
    currentUser,
    touchSession,
    register,
    login,
    logout,
    signInAs,
    listLocalProfiles,
    updateProfile,
    changePassword,
    passwordStrength,
    validEmail,
    getProgress,
    getModuleProgress,
    saveProgress,
    submitAssessment,
    gradeModule,
    getBadges,
    getBadge,
    attemptsFor,
    resetProgress,
    dashboard,
    certificate,
    adminOverview,
    adminListUsers,
    adminUserDetail,
    setUserRole,
    setUserStatus,
    adminExportCsv,
    resetWorkspace,
    storageBytes,
    exportUserData,
    logEvent,
    userEvents
  };
})();
