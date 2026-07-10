'use strict';
// portal-lib.js — pure, testable building blocks for the knowledge portal.
// No file I/O here: the CLI (build-docs-index.js) does the reading/writing and
// calls these. Kept side-effect-free so node --test can exercise them directly.

const { marked } = require('marked');

// ── helpers ─────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const titleize = (slug) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// Collapse a (possibly folded) description to one sentence for cards/index.
function oneLiner(text, max = 180) {
  if (!text) return '';
  const flat = String(text).replace(/\s+/g, ' ').trim();
  const dot = flat.indexOf('. ');
  let s = dot > 40 && dot < max ? flat.slice(0, dot + 1) : flat;
  if (s.length > max) s = s.slice(0, max - 1).replace(/\s\S*$/, '') + '…';
  return s;
}

const flat = (text) => String(text == null ? '' : text).replace(/\s+/g, ' ').trim();

// Drop a leading top-level "# Heading" from a markdown body — the detail page
// already renders the skill title, so a repeated H1 is redundant.
function stripLeadingH1(md) {
  return String(md || '').replace(/^\s*#[^#\n][^\n]*\n+/, '');
}

// ── frontmatter ─────────────────────────────────────────────────────────────
function parseFrontmatter(content) {
  const m = String(content || '').match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  const lines = m[1].split('\n');
  let key = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const item = line.match(/^\s+-\s+(.+)/);
    if (item) {
      if (key) (out[key] = Array.isArray(out[key]) ? out[key] : []).push(item[1].trim().replace(/^['"]|['"]$/g, ''));
      continue;
    }
    const kv = line.match(/^(\w[\w-]*):\s*(.*)/);
    if (!kv) continue;
    key = kv[1];
    const raw = kv[2].trim();
    if (/^[>|][+-]?$/.test(raw)) {
      const fold = raw[0] === '>';
      const collected = [];
      while (i + 1 < lines.length && (lines[i + 1].trim() === '' || /^\s/.test(lines[i + 1]))) {
        collected.push(lines[++i].trim());
      }
      out[key] = collected.join(fold ? ' ' : '\n').replace(/\s+/g, fold ? ' ' : '\n').trim();
      continue;
    }
    out[key] = raw.replace(/^['"]|['"]$/g, '') || null;
  }
  return out;
}

// ── index entry for one skill ────────────────────────────────────────────────
// The fix lives here: url points at a real per-skill page, and every skill that
// exists on disc is published (the old `Boolean(fm.title)` gate silently hid the
// 12 runtime-only skills that carry `name:` but no `title:`).
function buildSkillEntry(slug, fm = {}) {
  const tags = [];
  if (fm.category) tags.push(fm.category);
  if (fm.scope) tags.push(fm.scope);
  return {
    type: 'skill',
    title: fm.title || titleize(slug),
    desc: oneLiner(fm.description),
    tags,
    url: `skills/${slug}.html`,
    meta: slug,
    published: true,
  };
}

// ── markdown ──────────────────────────────────────────────────────────────────
function renderMarkdown(md) {
  if (!md) return '';
  return marked.parse(String(md), { mangle: false, headerIds: true });
}

// ── skill detail page ─────────────────────────────────────────────────────────
const NAV = [
  ['../index.html', 'Home'],
  ['../all.html', 'All Docs'],
  ['../skills.html', 'Skills'],
  ['../walkthroughs.html', 'Walkthroughs'],
  ['../templates.html', 'Templates'],
  ['../changelog.html', 'Changelog'],
];

function renderSkillPage(slug, fm = {}, bodyHtml = '') {
  const title = fm.title || titleize(slug);
  const desc = flat(fm.description);
  const icon = fm.icon ? `<span class="skill-page-icon">${fm.icon}</span>` : '';
  const badge = (label, val) => (val ? `<span class="skill-badge"><span class="skill-badge-k">${esc(label)}</span>${esc(val)}</span>` : '');
  const badges = [badge('scope', fm.scope), badge('category', fm.category), badge('version', fm.version)].filter(Boolean).join('');

  const triggers = Array.isArray(fm.triggers) ? fm.triggers.filter(Boolean) : [];
  const checks = Array.isArray(fm.checks) ? fm.checks.filter(Boolean) : [];
  const checksLabel = fm['checks-label'] || 'Rules';

  const triggersSection = triggers.length
    ? `<section class="skill-triggers"><h2>When it fires</h2><ul class="skill-trigger-list">${triggers.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>`
    : '';
  const checksSection = checks.length
    ? `<section class="skill-checks"><h2>${esc(checksLabel)}</h2><ul class="skill-check-list">${checks.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></section>`
    : '';
  const bodySection = bodyHtml
    ? `<section class="skill-doc">${bodyHtml}</section>`
    : '';

  const source = `https://github.com/gilesparnell/Claude/blob/main/skills/${slug}/SKILL.md`;
  const nav = NAV.map(([href, label]) => `<a href="${href}"${label === 'Skills' ? ' class="active"' : ''}>${label}</a>`).join('\n      ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} — Skills — gilesparnell</title>
<link rel="stylesheet" href="../portal.css">
</head>
<body>
<div class="mesh-bg" aria-hidden="true"><div class="blob"></div><div class="blob"></div><div class="blob"></div><div class="blob"></div></div>

<header class="site-header">
  <div class="header-inner">
    <a href="https://gilesparnell.github.io/" class="header-brand">
      <div class="header-logo">PS</div>
      <span class="header-name">Parnell Systems</span>
    </a>
    <nav class="header-nav">
      ${nav}
    </nav>
  </div>
</header>

<main class="skill-page">
  <a class="skill-back" href="../skills.html">&larr; All skills</a>
  <div class="skill-page-head">
    ${icon}
    <div>
      <h1 class="skill-page-title">${esc(title)}</h1>
      ${desc ? `<p class="skill-page-desc">${esc(desc)}</p>` : ''}
      ${badges ? `<div class="skill-badges">${badges}</div>` : ''}
    </div>
  </div>
  ${triggersSection}
  ${checksSection}
  ${bodySection}
  <div class="skill-source"><a href="${source}">View <code>SKILL.md</code> source &rarr;</a></div>
</main>

<footer class="site-footer">
  <span>gilesparnell &middot; Skills</span>
  <span>Generated from <code>skills/${esc(slug)}/SKILL.md</code></span>
</footer>
</body>
</html>
`;
}

module.exports = { esc, titleize, oneLiner, parseFrontmatter, buildSkillEntry, renderMarkdown, renderSkillPage, stripLeadingH1 };
