'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { build } = require('./build-docs-index');

let root;

before(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'portal-build-'));
  fs.mkdirSync(path.join(root, 'skills', 'alpha-skill'), { recursive: true });
  fs.mkdirSync(path.join(root, 'skills', 'bravo-skill'), { recursive: true });
  fs.mkdirSync(path.join(root, 'skills', 'learned'), { recursive: true }); // must be ignored
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'skills', 'alpha-skill', 'SKILL.md'),
    '---\ntitle: Alpha Skill\ncategory: code\nscope: global\ntriggers:\n  - do alpha\nchecks:\n  - alpha rule\ndescription: The alpha skill.\n---\n## Usage\n\nRun alpha like this.\n',
  );
  // bravo has runtime-only frontmatter (name, no title) — must still publish + get a page
  fs.writeFileSync(
    path.join(root, 'skills', 'bravo-skill', 'SKILL.md'),
    '---\nname: bravo-skill\ndescription: The bravo skill.\n---\nBravo body content.\n',
  );
  fs.writeFileSync(path.join(root, 'skills', 'learned', 'note.md'), 'not a skill');
  fs.writeFileSync(path.join(root, 'docs', 'walkthroughs.html'), '<html></html>');
  fs.writeFileSync(path.join(root, 'docs', 'templates.html'), '<html></html>');
});

after(() => fs.rmSync(root, { recursive: true, force: true }));

test('build: writes a detail page per skill', () => {
  build({ root });
  assert.ok(fs.existsSync(path.join(root, 'docs', 'skills', 'alpha-skill.html')));
  assert.ok(fs.existsSync(path.join(root, 'docs', 'skills', 'bravo-skill.html')));
});

test('build: index skill urls point at per-skill pages, not the listing', () => {
  build({ root });
  const idx = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'docs-index.json'), 'utf8'));
  const skills = idx.entries.filter((e) => e.type === 'skill');
  assert.equal(skills.length, 2); // learned/ excluded
  for (const s of skills) assert.match(s.url, /^skills\/[a-z-]+\.html$/);
  assert.ok(!skills.some((s) => s.url === 'skills.html'));
});

test('build: runtime-only skill (no title) is still published', () => {
  build({ root });
  const idx = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'docs-index.json'), 'utf8'));
  const bravo = idx.entries.find((e) => e.meta === 'bravo-skill');
  assert.equal(bravo.published, true);
  assert.equal(idx.counts.unpublished_skills, 0);
});

test('build: renders the SKILL.md body and frontmatter into the page', () => {
  build({ root });
  const alpha = fs.readFileSync(path.join(root, 'docs', 'skills', 'alpha-skill.html'), 'utf8');
  assert.match(alpha, /Run alpha like this/); // body
  assert.match(alpha, /do alpha/);            // trigger
  assert.match(alpha, /alpha rule/);          // check
});
