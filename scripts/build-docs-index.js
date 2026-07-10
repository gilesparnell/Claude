#!/usr/bin/env node
// build-docs-index.js — regenerates the portal's queryable index AND a detail
// page per skill. Run on every push via .github/workflows/build-portal.yml.
//
// Sources:
//   skills       → skills/<slug>/SKILL.md  → docs/skills/<slug>.html + index entry
//   walkthroughs → parsed from docs/walkthroughs.html cards (real per-card URLs)
//   templates    → parsed from docs/templates.html cards
// (No decisions/ in this public repo — that content stays private, by design.)

'use strict';
const fs = require('fs');
const path = require('path');
const lib = require('./portal-lib');

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
const stripFrontmatter = (md) => md.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();
const stripTags = (html) =>
  html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#8594;/g, '').replace(/&mdash;/g, '—').replace(/\s+/g, ' ').trim();

// ── Skills: emit a page each, return index entries ──────────────────────────
function buildSkills(SKILLS, SKILLS_OUT) {
  if (!fs.existsSync(SKILLS)) return [];
  const IGNORE = new Set(['learned']);
  fs.mkdirSync(SKILLS_OUT, { recursive: true });
  return fs.readdirSync(SKILLS)
    .filter((f) => {
      const p = path.join(SKILLS, f);
      return fs.statSync(p).isDirectory() && !f.startsWith('.') && !IGNORE.has(f) && fs.existsSync(path.join(p, 'SKILL.md'));
    })
    .sort()
    .map((slug) => {
      const raw = read(path.join(SKILLS, slug, 'SKILL.md'));
      const fm = lib.parseFrontmatter(raw);
      const bodyHtml = lib.renderMarkdown(lib.stripLeadingH1(stripFrontmatter(raw)));
      fs.writeFileSync(path.join(SKILLS_OUT, `${slug}.html`), lib.renderSkillPage(slug, fm, bodyHtml));
      return lib.buildSkillEntry(slug, fm);
    });
}

// ── Walkthroughs (parsed from the hand-authored index — real per-card URLs) ──
function readWalkthroughs(DOCS) {
  const html = read(path.join(DOCS, 'walkthroughs.html'));
  if (!html) return [];
  const out = [];
  for (const b of html.split('<div class="wt-card"').slice(1)) {
    if (/data-category="placeholder"/.test(b)) continue;
    const title = b.match(/class="wt-title">([\s\S]*?)<\/div>/);
    if (!title) continue;
    const desc = b.match(/class="wt-desc">([\s\S]*?)<\/div>/);
    const href = b.match(/href="([^"]+)"\s+class="wt-link"/);
    const tags = [...b.matchAll(/class="tag">([\s\S]*?)<\/span>/g)].map((m) => stripTags(m[1]));
    out.push({
      type: 'walkthrough',
      title: stripTags(title[1]),
      desc: desc ? lib.oneLiner(stripTags(desc[1])) : '',
      tags,
      url: href ? href[1] : 'walkthroughs.html',
      published: true,
    });
  }
  return out;
}

// ── Templates: card metadata from templates.html + a page per CLAUDE.md ──────
function readTemplates(ROOT, DOCS, TPL_OUT) {
  const html = read(path.join(DOCS, 'templates.html'));
  if (!html) return [];
  const out = [];
  for (const b of html.split('<div class="template-card"').slice(1)) {
    const name = b.match(/class="template-name">([\s\S]*?)<\/div>/);
    if (!name) continue;
    const desc = b.match(/class="template-desc">([\s\S]*?)<\/div>/);
    const type = b.match(/class="template-type"[^>]*>([\s\S]*?)<\/div>/);
    const p = b.match(/class="template-path">([\s\S]*?)<\/div>/);
    const relPath = p ? stripTags(p[1]) : '';
    const title = stripTags(name[1]);
    const descText = desc ? stripTags(desc[1]) : '';
    // slug = the directory under project-templates/ (project-templates/<slug>/CLAUDE.md)
    const slugMatch = relPath.match(/project-templates\/([^/]+)\//);
    const slug = slugMatch ? slugMatch[1] : null;
    let url = 'templates.html';
    if (slug) {
      fs.mkdirSync(TPL_OUT, { recursive: true });
      const bodyHtml = lib.renderMarkdown(lib.stripLeadingH1(read(path.join(ROOT, relPath))));
      fs.writeFileSync(path.join(TPL_OUT, `${slug}.html`), lib.renderTemplatePage(slug, { title, desc: descText }, bodyHtml));
      url = `templates/${slug}.html`;
    }
    out.push({
      type: 'template',
      title,
      desc: lib.oneLiner(descText),
      tags: type ? [stripTags(type[1])] : [],
      url,
      meta: relPath,
      published: true,
    });
  }
  return out;
}

function build({ root } = {}) {
  const ROOT = root || path.join(__dirname, '..');
  const DOCS = path.join(ROOT, 'docs');
  const SKILLS = path.join(ROOT, 'skills');
  const SKILLS_OUT = path.join(DOCS, 'skills');
  const TPL_OUT = path.join(DOCS, 'templates');

  const entries = [
    ...buildSkills(SKILLS, SKILLS_OUT),
    ...readWalkthroughs(DOCS),
    ...readTemplates(ROOT, DOCS, TPL_OUT),
  ];

  const index = {
    counts: {
      skill: entries.filter((e) => e.type === 'skill').length,
      walkthrough: entries.filter((e) => e.type === 'walkthrough').length,
      template: entries.filter((e) => e.type === 'template').length,
      unpublished_skills: entries.filter((e) => e.type === 'skill' && !e.published).length,
    },
    entries,
  };

  fs.writeFileSync(path.join(DOCS, 'docs-index.json'), JSON.stringify(index, null, 2));
  return index;
}

module.exports = { build };

// Run when invoked directly.
if (require.main === module) {
  const index = build();
  console.log('Wrote docs/docs-index.json and docs/skills/*.html');
  console.log('Counts:', index.counts);
}
