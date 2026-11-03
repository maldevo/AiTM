/* SHADOWPROOF — curriculum index */
(function () {
  const modules = window.SHADOWPROOF_MODULES || [];
  const byId = {};
  modules.forEach((m) => { byId[m.id] = m; });

  const tiers = [
    {
      id: 1,
      name: 'Human-targeted attacks',
      short: 'The bait',
      desc: 'The messages, links, and attachments that target your judgment before your tools ever see them.',
      accent: '#57e6a1'
    },
    {
      id: 2,
      name: 'Identity & access',
      short: 'The keys',
      desc: 'The prompts, codes, permissions, and passwords that decide who gets in — and who stays out.',
      accent: '#7fb8ff'
    },
    {
      id: 3,
      name: 'Physical & environmental',
      short: 'The room',
      desc: 'The doors, devices, networks, and shared spaces that surround the work itself.',
      accent: '#ffcf7a'
    },
    {
      id: 4,
      name: 'Human & operational',
      short: 'The response',
      desc: 'The everyday decisions that contain a mistake and turn a near miss into a lesson.',
      accent: '#ff8b8b'
    }
  ];

  const tierById = {};
  tiers.forEach((t) => { tierById[t.id] = t; });

  window.SHADOWPROOF = {
    modules,
    byId,
    tiers,
    tierById,
    get(id) { return byId[id] || null; },
    byTier(tier) { return modules.filter((m) => m.tier === Number(tier)); },
    totalModules: modules.length,
    totalQuestions: modules.reduce((n, m) => n + m.questions.length, 0),
    estimatedMinutes: modules.reduce((n, m) => n + parseInt(m.time, 10), 0),
    passThreshold(module) { return Math.ceil(module.questions.length * 0.75); }
  };
  window.SP = window.SP || {};
  window.SP.SHADOWPROOF = window.SHADOWPROOF;
})();
