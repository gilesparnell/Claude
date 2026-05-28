#!/usr/bin/env node
// build-docs-index.js  (PROTOTYPE)
// Emits docs/docs-index.json — a single unified, queryable index of every
// portal entry (skills, walkthroughs, decisions, templates) for the
// sidebar + list + command-palette prototype at docs/all.html.
//
// Sources, in order of how structured they are:
//   skills      → skills/<slug>/SKILL.md frontmatter  (inclusive: includes the
//                 12 skills missing a `title:` that generate-stats.js drops)
//   decisions   → decisions/*.md frontmatter
//   walkthroughs→ parsed from docs/walkthroughs.html cards (no structured source yet)
//   templates   → parsed from docs/templates.html cards   (no structured source yet)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const SKILLS = path.join(ROOT, 'skills');
const DECS = path.join(ROOT, 'decisions');

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
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
    // Block scalar (folded ">" or literal "|") — collect indented follow-on lines.
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

const titleize = (slug) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// description fields sometimes use folded YAML (">") so collapse whitespace,
// then take the first sentence as a one-liner.
function oneLiner(text, max = 180) {
  if (!text) return '';
  const flat = String(text).replace(/\s+/g, ' ').trim();
  const dot = flat.indexOf('. ');
  let s = dot > 40 && dot < max ? flat.slice(0, dot + 1) : flat;
  if (s.length > max) s = s.slice(0, max - 1).replace(/\s\S*$/, '') + '…';
  return s;
}

const stripTags = (html) =>
  html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#8594;/g, '').replace(/&mdash;/g, '—').replace(/\s+/g, ' ').trim();

// ── Skills ───────────────────────────────────────────────────────────────
function readSkills() {
  if (!fs.existsSync(SKILLS)) return [];
  const NON_SKILL_DIRS = new Set(['learned']); // storage dir, not a real skill
  return fs.readdirSync(SKILLS)
    .filter((f) => fs.statSync(path.join(SKILLS, f)).isDirectory() && !f.startsWith('.') && !NON_SKILL_DIRS.has(f))
    .map((slug) => {
      const fm = parseFrontmatter(read(path.join(SKILLS, slug, 'SKILL.md')));
      const tags = [];
      if (fm.category) tags.push(fm.category);
      if (fm.scope) tags.push(fm.scope);
      return {
        type: 'skill',
        title: fm.title || titleize(slug),
        desc: oneLiner(fm.description),
        tags,
        url: 'skills.html',
        meta: slug,
        published: Boolean(fm.title), // false → currently invisible on the portal
      };
    });
}

// ── Decisions ────────────────────────────────────────────────────────────
function readDecisions() {
  if (!fs.existsSync(DECS)) return [];
  return fs.readdirSync(DECS)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .sort()
    .map((f) => {
      const fm = parseFrontmatter(read(path.join(DECS, f)));
      const body = read(path.join(DECS, f)).replace(/^---\n[\s\S]*?\n---/, '');
      return {
        type: 'decision',
        title: fm.title || f.replace('.md', '').toUpperCase(),
        desc: oneLiner(fm.description || body),
        tags: Array.isArray(fm.tags) ? fm.tags : [],
        url: 'decisions.html',
        meta: f.replace('.md', '').toUpperCase(),
        date: fm.date || '',
        status: fm.status || '',
        published: true,
      };
    })
    .filter((d) => d.title);
}

// ── Walkthroughs (parsed from the hand-authored index) ─────────────────────
function readWalkthroughs() {
  const html = read(path.join(DOCS, 'walkthroughs.html'));
  if (!html) return [];
  const out = [];
  const blocks = html.split('<div class="wt-card"').slice(1);
  for (const b of blocks) {
    if (/data-category="placeholder"/.test(b)) continue;
    const title = b.match(/class="wt-title">([\s\S]*?)<\/div>/);
    if (!title) continue;
    const desc = b.match(/class="wt-desc">([\s\S]*?)<\/div>/);
    const href = b.match(/href="([^"]+)"\s+class="wt-link"/);
    const tags = [...b.matchAll(/class="tag">([\s\S]*?)<\/span>/g)].map((m) => stripTags(m[1]));
    out.push({
      type: 'walkthrough',
      title: stripTags(title[1]),
      desc: desc ? oneLiner(stripTags(desc[1])) : '',
      tags,
      url: href ? href[1] : 'walkthroughs.html',
      published: true,
    });
  }
  return out;
}

// ── Templates (parsed from the hand-authored index) ────────────────────────
function readTemplates() {
  const html = read(path.join(DOCS, 'templates.html'));
  if (!html) return [];
  const out = [];
  const blocks = html.split('<div class="template-card"').slice(1);
  for (const b of blocks) {
    const name = b.match(/class="template-name">([\s\S]*?)<\/div>/);
    if (!name) continue;
    const desc = b.match(/class="template-desc">([\s\S]*?)<\/div>/);
    const type = b.match(/class="template-type"[^>]*>([\s\S]*?)<\/div>/);
    const p = b.match(/class="template-path">([\s\S]*?)<\/div>/);
    out.push({
      type: 'template',
      title: stripTags(name[1]),
      desc: desc ? oneLiner(stripTags(desc[1])) : '',
      tags: type ? [stripTags(type[1])] : [],
      url: 'templates.html',
      meta: p ? stripTags(p[1]) : '',
      published: true,
    });
  }
  return out;
}

const entries = [
  ...readSkills(),
  ...readWalkthroughs(),
  ...readDecisions(),
  ...readTemplates(),
];

const index = {
  generated: new Date().toISOString(),
  counts: {
    skill: entries.filter((e) => e.type === 'skill').length,
    walkthrough: entries.filter((e) => e.type === 'walkthrough').length,
    decision: entries.filter((e) => e.type === 'decision').length,
    template: entries.filter((e) => e.type === 'template').length,
    unpublished_skills: entries.filter((e) => e.type === 'skill' && !e.published).length,
  },
  entries,
};

fs.writeFileSync(path.join(DOCS, 'docs-index.json'), JSON.stringify(index, null, 2));
console.log('Wrote docs/docs-index.json');
console.log('Counts:', index.counts);
