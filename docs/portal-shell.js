/* portal-shell.js — shared sidebar + ⌘K command palette + list renderer.
 * Include on any portal page:
 *   <script defer src="portal-shell.js"></script>
 * Page hooks (all optional):
 *   <aside class="dock-side" id="portal-side" data-page="skills"></aside>
 *   <input  class="inline-filter" id="portal-filter">
 *   <div    id="portal-active"></div>
 *   <div    id="portal-list" data-type="skill"></div>   // omit to keep page's own content
 * data-page  → which nav item is active: all|skills|walkthroughs|decisions|templates|home
 * data-type  → which entry type the list shows: all|skill|walkthrough|decision|template
 */
(function () {
  const TYPE_META = {
    skill:       { label: 'Skills',       page: 'skills.html',       color: 'var(--blue)' },
    walkthrough: { label: 'Walkthroughs', page: 'walkthroughs.html', color: 'var(--purple)' },
    template:    { label: 'Templates',    page: 'templates.html',    color: 'var(--amber)' },
  };
  const TYPE_ORDER = ['skill', 'walkthrough', 'template'];
  const esc = (s) => (s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let DATA = { entries: [] };
  let activeTag = null;
  let query = '';
  let listEl = null;      // #portal-list (may be null on card pages)
  let pageType = 'all';   // type the list shows

  // ── data helpers ──────────────────────────────────────────────────────────
  function rowMatches(e) {
    if (pageType !== 'all' && e.type !== pageType) return false;
    if (activeTag && !(e.tags || []).map((t) => t.toLowerCase()).includes(activeTag.toLowerCase())) return false;
    if (query) {
      const hay = (e.title + ' ' + e.desc + ' ' + (e.tags || []).join(' ') + ' ' + e.type).toLowerCase();
      if (!query.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  }

  // ── sidebar ────────────────────────────────────────────────────────────────
  function renderSidebar(side) {
    const activePage = side.dataset.page || 'all';
    const counts = { all: DATA.entries.length };
    TYPE_ORDER.forEach((t) => (counts[t] = DATA.entries.filter((e) => e.type === t).length));

    const navItem = (href, key, label, color, count) =>
      `<a class="nav-item ${activePage === key ? 'active' : ''}" href="${href}">
        <span class="dot" style="background:${color}"></span><span>${label}</span>
        <span class="n">${count}</span></a>`;

    let nav = navItem('all.html', 'all', 'All', 'var(--text2)', counts.all);
    TYPE_ORDER.forEach((t) => (nav += navItem(TYPE_META[t].page, t + 's', TYPE_META[t].label, TYPE_META[t].color, counts[t])));
    // map plural data-page values
    nav = nav.replace('skills.html', 'skills.html'); // (kept explicit for clarity)

    const freq = {};
    DATA.entries.forEach((e) => (e.tags || []).forEach((t) => (freq[t] = (freq[t] || 0) + 1)));
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 18);
    const tags = top.map(([t]) => {
      if (listEl) return `<button class="tag-chip ${activeTag === t ? 'active' : ''}" data-tag="${esc(t)}">${esc(t)}</button>`;
      return `<a class="tag-chip" href="all.html?tag=${encodeURIComponent(t)}">${esc(t)}</a>`;
    }).join('');

    side.innerHTML =
      `<button class="cmdk-trigger" data-open-cmd>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <span class="grow">Search everything…</span><kbd>⌘K</kbd></button>
      <div class="side-group"><div class="side-label">Browse</div>${nav}</div>
      <div class="side-group"><div class="side-label">Filter by tag</div><div class="tag-cloud">${tags}</div></div>`;

    side.querySelector('[data-open-cmd]').addEventListener('click', openCmd);
    if (listEl) side.querySelectorAll('.tag-chip[data-tag]').forEach((b) =>
      b.addEventListener('click', () => { activeTag = activeTag === b.dataset.tag ? null : b.dataset.tag; renderList(); renderSidebar(side); }));
  }

  // ── list ─────────────────────────────────────────────────────────────────
  function renderList() {
    if (!listEl) return;
    const shown = DATA.entries.filter(rowMatches);
    const sub = document.getElementById('portal-sub');
    if (sub) sub.textContent = `${shown.length} of ${DATA.entries.length} entries`;

    const af = document.getElementById('portal-active');
    if (af) {
      const bits = [];
      if (activeTag) bits.push(`tag <b>${esc(activeTag)}</b>`);
      if (query) bits.push(`“<b>${esc(query)}</b>”`);
      af.innerHTML = bits.length ? `Filtering by ${bits.join(' · ')} &nbsp;<button data-clear>clear</button>` : '';
      const clr = af.querySelector('[data-clear]');
      if (clr) clr.addEventListener('click', () => { activeTag = null; query = ''; const f = document.getElementById('portal-filter'); if (f) f.value = ''; renderList(); const s = document.getElementById('portal-side'); if (s) renderSidebar(s); });
    }

    if (!shown.length) { listEl.innerHTML = '<div class="empty">No entries match.</div>'; return; }
    const groups = pageType === 'all' ? TYPE_ORDER : [pageType];
    let h = '';
    groups.forEach((t) => {
      const g = shown.filter((e) => e.type === t);
      if (!g.length) return;
      if (pageType === 'all')
        h += `<div class="grp-head"><span class="dot" style="width:8px;height:8px;border-radius:3px;background:${TYPE_META[t].color}"></span>${TYPE_META[t].label} <span class="gn">(${g.length})</span></div>`;
      g.forEach((e) => {
        const tags = (e.tags || []).slice(0, 4).map((x) => `<span class="rtag">${esc(x)}</span>`).join('');
        const unpub = e.published === false ? '<span class="badge-unpub">unpublished</span>' : '';
        const right = e.date ? `<span class="rdate">${esc(e.date)}</span>` : (e.meta && e.type !== 'skill' ? `<span class="rdate">${esc(e.meta)}</span>` : '');
        h += `<a class="row" href="${esc(e.url)}">
          <span class="rdot" style="background:${TYPE_META[t].color}"></span>
          <div class="rbody"><div class="rtitle">${esc(e.title)} ${unpub}</div>
          <div class="rdesc">${esc(e.desc)}</div><div class="rmeta">${tags}${right}</div></div></a>`;
      });
    });
    listEl.innerHTML = h;
  }

  // ── command palette ────────────────────────────────────────────────────────
  let pagefind = null, pfTried = false, cmdSel = 0, cmdItems = [], cmdTimer;
  async function initPagefind() {
    if (pfTried) return; pfTried = true;
    try { pagefind = await import('./pagefind/pagefind.js'); await pagefind.options({}); }
    catch (e) { pagefind = null; }
  }
  function overlay() { return document.getElementById('cmdk'); }
  function openCmd() { overlay().classList.add('open'); const i = document.getElementById('cmdk-input'); i.focus(); i.select(); initPagefind(); runCmd(i.value); }
  function closeCmd() { overlay().classList.remove('open'); }

  function indexMatches(q) {
    if (!q) return DATA.entries.slice(0, 8);
    const ws = q.toLowerCase().split(/\s+/);
    return DATA.entries.map((e) => {
      const hay = (e.title + ' ' + e.desc + ' ' + (e.tags || []).join(' ')).toLowerCase();
      let score = 0; ws.forEach((w) => { if (e.title.toLowerCase().includes(w)) score += 3; else if (hay.includes(w)) score += 1; });
      return { e, score };
    }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 8).map((x) => x.e);
  }

  async function runCmd(q) {
    q = (q || '').trim();
    const idx = indexMatches(q).map((e) => ({ title: e.title, url: e.url, sub: e.desc, type: e.type, color: TYPE_META[e.type].color }));
    let pf = [];
    if (q && pagefind) {
      try {
        const s = await pagefind.search(q);
        const data = await Promise.all(s.results.slice(0, 5).map((r) => r.data()));
        pf = data.map((d) => ({ title: (d.meta && d.meta.title) || d.url.replace(/^.*\//, ''), url: d.url.replace(/^\//, ''), sub: (d.excerpt || '').replace(/<[^>]+>/g, ''), type: 'page', color: 'var(--text3)' }));
      } catch (e) {}
    }
    const seen = new Set(idx.map((i) => i.url));
    pf = pf.filter((p) => !seen.has(p.url));
    renderCmd(idx, pf, q);
  }

  function renderCmd(idx, pf, q) {
    cmdItems = [...idx, ...pf]; cmdSel = 0;
    const box = document.getElementById('cmdk-results');
    if (!cmdItems.length) { box.innerHTML = `<div class="cmdk-empty">No matches for “${esc(q)}”.</div>`; return; }
    const item = (it, i) => `<a class="cmdk-item ${i === 0 ? 'sel' : ''}" data-i="${i}" href="${esc(it.url)}">
      <span class="cdot" style="background:${it.color}"></span>
      <div class="ctext"><div class="ctitle">${esc(it.title)}</div><div class="cex">${esc(it.sub || '')}</div></div>
      <span class="ctype">${it.type}</span></a>`;
    let h = '';
    if (idx.length) { h += '<div class="cmdk-sec">Entries</div>'; idx.forEach((it, i) => (h += item(it, i))); }
    if (pf.length) { h += '<div class="cmdk-sec">Full-text matches</div>'; pf.forEach((it, i) => (h += item(it, idx.length + i))); }
    box.innerHTML = h;
    box.querySelectorAll('.cmdk-item').forEach((el, i) => el.addEventListener('mouseenter', () => { cmdSel = i; paintSel(); }));
  }
  function paintSel() { document.querySelectorAll('.cmdk-item').forEach((el, i) => el.classList.toggle('sel', i === cmdSel)); }

  function injectOverlay() {
    const d = document.createElement('div');
    d.className = 'cmdk-overlay'; d.id = 'cmdk';
    d.innerHTML = `<div class="cmdk">
      <input class="cmdk-input" id="cmdk-input" type="text" placeholder="Search skills, walkthroughs, templates…" autocomplete="off">
      <div class="cmdk-results" id="cmdk-results"></div>
      <div class="cmdk-foot"><span><kbd>↑↓</kbd>navigate</span><span><kbd>↵</kbd>open</span><span><kbd>esc</kbd>close</span></div></div>`;
    d.addEventListener('click', (e) => { if (e.target === d) closeCmd(); });
    document.body.appendChild(d);
    const input = document.getElementById('cmdk-input');
    input.addEventListener('input', (e) => { clearTimeout(cmdTimer); cmdTimer = setTimeout(() => runCmd(e.target.value), 120); });
  }

  // ── boot ───────────────────────────────────────────────────────────────────
  function boot() {
    injectOverlay();
    window.PortalShell = { open: openCmd };  // let other pages (e.g. projects.html) open the palette
    listEl = document.getElementById('portal-list');
    if (listEl) pageType = listEl.dataset.type || 'all';

    // header search button(s)
    document.querySelectorAll('[data-open-cmd]').forEach((b) => b.addEventListener('click', openCmd));

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmd(); return; }
      if (e.key === '/' && document.activeElement === document.body) { e.preventDefault(); openCmd(); return; }
      if (!overlay().classList.contains('open')) return;
      if (e.key === 'Escape') closeCmd();
      else if (e.key === 'ArrowDown') { e.preventDefault(); cmdSel = Math.min(cmdSel + 1, cmdItems.length - 1); paintSel(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); cmdSel = Math.max(cmdSel - 1, 0); paintSel(); }
      else if (e.key === 'Enter' && cmdItems[cmdSel]) location.href = cmdItems[cmdSel].url;
    });

    const filter = document.getElementById('portal-filter');
    if (filter) filter.addEventListener('input', (e) => { query = e.target.value.trim(); renderList(); });

    fetch('docs-index.json').then((r) => r.json()).then((d) => {
      DATA = d;
      // Keep any home-page hero stats in sync with the single source of truth.
      if (d.counts) {
        const map = { 'stat-skills': d.counts.skill, 'stat-walkthroughs': d.counts.walkthrough, 'stat-decisions': d.counts.decision, 'stat-templates': d.counts.template };
        Object.entries(map).forEach(([id, v]) => { const el = document.getElementById(id); if (el && v != null) el.textContent = v; });
      }
      const params = new URLSearchParams(location.search);
      if (params.get('tag')) activeTag = params.get('tag');
      const side = document.getElementById('portal-side');
      if (side) renderSidebar(side);
      renderList();
      const q = params.get('q');
      if (q !== null) { const i = document.getElementById('cmdk-input'); i.value = q; openCmd(); }
    }).catch(() => { const sub = document.getElementById('portal-sub'); if (sub) sub.textContent = 'Failed to load docs-index.json'; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
