/* SHADOWPROOF — theme bootstrap (runs before paint) */
(function () {
  const KEY = 'sp:theme:v1';
  let stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) { /* storage blocked */ }
  const systemLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const theme = stored === 'light' || stored === 'dark' ? stored : (systemLight ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  const initialMeta = document.querySelector('meta[name="theme-color"]');
  if (initialMeta) initialMeta.setAttribute('content', theme === 'light' ? '#f5f6f2' : '#080b0c');

  function apply(next, persist) {
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.style.colorScheme = next;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'light' ? '#f5f6f2' : '#080b0c');
    if (persist) {
      try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
    }
    window.dispatchEvent(new CustomEvent('sp:theme', { detail: { theme: next } }));
  }

  window.SP = window.SP || {};
  window.SP.theme = {
    get() { return document.documentElement.getAttribute('data-theme'); },
    set(next) { apply(next === 'light' ? 'light' : 'dark', true); },
    toggle() { apply(this.get() === 'light' ? 'dark' : 'light', true); },
    reset() { try { localStorage.removeItem(KEY); } catch (e) {} apply(systemLight ? 'light' : 'dark', false); }
  };

  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => {
      let has = null;
      try { has = localStorage.getItem(KEY); } catch (e) {}
      if (!has) apply(e.matches ? 'light' : 'dark', false);
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
})();
