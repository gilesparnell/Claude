'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  parseFrontmatter,
  buildSkillEntry,
  renderMarkdown,
  renderSkillPage,
  renderTemplatePage,
  stripLeadingH1,
} = require('./portal-lib');

// ── renderTemplatePage ──────────────────────────────────────────────────────
test('renderTemplatePage: complete doc rendering title, description, and body', () => {
  const html = renderTemplatePage('nextjs', { title: 'nextjs / CLAUDE.md', desc: 'A CLAUDE.md tuned for Next.js.' }, '<p>template body</p>');
  assert.match(html, /<!DOCTYPE html>/i);
  assert.match(html, /portal\.css/);
  assert.match(html, /nextjs \/ CLAUDE\.md/);
  assert.match(html, /tuned for Next\.js/);
  assert.match(html, /template body/);
});

test('renderTemplatePage: source link points at the CLAUDE.md file, not a SKILL.md', () => {
  const html = renderTemplatePage('nextjs', { title: 'x', desc: 'y' }, '');
  assert.match(html, /project-templates\/nextjs\/CLAUDE\.md/);
  assert.doesNotMatch(html, /SKILL\.md/);
});

test('renderTemplatePage: has no triggers or checks sections', () => {
  const html = renderTemplatePage('nextjs', { title: 'x', desc: 'y' }, '<p>b</p>');
  assert.doesNotMatch(html, /class="skill-triggers"/);
  assert.doesNotMatch(html, /class="skill-checks"/);
});

// ── stripLeadingH1 ──────────────────────────────────────────────────────────
test('stripLeadingH1: removes a leading H1 and its trailing blank lines', () => {
  assert.equal(stripLeadingH1('# Security Review\n\nBody starts here.'), 'Body starts here.');
});

test('stripLeadingH1: leaves the body untouched when it does not start with an H1', () => {
  assert.equal(stripLeadingH1('Intro paragraph.\n\n# Later heading'), 'Intro paragraph.\n\n# Later heading');
});

test('stripLeadingH1: does not strip an H2', () => {
  assert.equal(stripLeadingH1('## Usage\n\ntext'), '## Usage\n\ntext');
});

test('stripLeadingH1: handles empty input', () => {
  assert.equal(stripLeadingH1(''), '');
});

// ── parseFrontmatter ────────────────────────────────────────────────────────
test('parseFrontmatter: reads scalar key/values', () => {
  const fm = parseFrontmatter('---\ntitle: Security Review\nscope: global\n---\nbody');
  assert.equal(fm.title, 'Security Review');
  assert.equal(fm.scope, 'global');
});

test('parseFrontmatter: collects list items into an array (triggers/checks)', () => {
  const fm = parseFrontmatter('---\ntriggers:\n  - one\n  - two\nchecks:\n  - c1\n---');
  assert.deepEqual(fm.triggers, ['one', 'two']);
  assert.deepEqual(fm.checks, ['c1']);
});

test('parseFrontmatter: handles folded block scalar description', () => {
  const fm = parseFrontmatter('---\nname: x\ndescription: >\n  line one\n  line two\n---');
  assert.equal(fm.description, 'line one line two');
});

test('parseFrontmatter: no frontmatter returns empty object', () => {
  assert.deepEqual(parseFrontmatter('# just a heading\n'), {});
});

// ── buildSkillEntry ─────────────────────────────────────────────────────────
test('buildSkillEntry: url points at the per-skill detail page, NOT the listing', () => {
  const e = buildSkillEntry('security-review', { title: 'Security Review', description: 'x' });
  assert.equal(e.url, 'skills/security-review.html');
  assert.notEqual(e.url, 'skills.html'); // the bug being fixed
});

test('buildSkillEntry: every real skill is published, even without a title field', () => {
  const e = buildSkillEntry('tdd-first', { name: 'tdd-first', description: 'test first' });
  assert.equal(e.published, true); // un-hides the 12 runtime-only skills
  assert.equal(e.type, 'skill');
});

test('buildSkillEntry: title falls back to a titleized slug when frontmatter has none', () => {
  const e = buildSkillEntry('git-conventions', { name: 'git-conventions' });
  assert.equal(e.title, 'Git Conventions');
});

test('buildSkillEntry: prefers explicit title and carries category/scope as tags', () => {
  const e = buildSkillEntry('saas-patterns', { title: 'SaaS Patterns', category: 'saas', scope: 'project' });
  assert.equal(e.title, 'SaaS Patterns');
  assert.ok(e.tags.includes('saas'));
  assert.ok(e.tags.includes('project'));
});

test('buildSkillEntry: meta preserves the slug for lookup', () => {
  const e = buildSkillEntry('humanizer', { name: 'humanizer' });
  assert.equal(e.meta, 'humanizer');
});

// ── renderMarkdown ──────────────────────────────────────────────────────────
test('renderMarkdown: converts headings and code fences to HTML', () => {
  const html = renderMarkdown('## Usage\n\n```js\nconst x = 1;\n```');
  assert.match(html, /<h2[^>]*>Usage<\/h2>/);
  assert.match(html, /<code/);
});

test('renderMarkdown: empty input yields empty string, never throws', () => {
  assert.equal(renderMarkdown(''), '');
  assert.equal(renderMarkdown(undefined), '');
});

// ── renderSkillPage ─────────────────────────────────────────────────────────
const richFm = {
  title: 'Security Review',
  scope: 'global',
  category: 'code',
  icon: '🔒',
  version: '1.0',
  description: 'Comprehensive security review for web apps.',
  triggers: ['security review', 'is this secure'],
  checks: ['No hardcoded secrets', 'Inputs validated'],
};

test('renderSkillPage: is a complete HTML document using the shared stylesheet', () => {
  const html = renderSkillPage('security-review', richFm, '<p>body text</p>');
  assert.match(html, /<!DOCTYPE html>/i);
  assert.match(html, /portal\.css/);
  assert.match(html, /<\/html>/i);
});

test('renderSkillPage: renders title, description, and the markdown body', () => {
  const html = renderSkillPage('security-review', richFm, '<p>body text</p>');
  assert.match(html, /Security Review/);
  assert.match(html, /Comprehensive security review/);
  assert.match(html, /body text/);
});

test('renderSkillPage: renders triggers and checks when present', () => {
  const html = renderSkillPage('security-review', richFm, '');
  assert.match(html, /is this secure/);
  assert.match(html, /No hardcoded secrets/);
});

test('renderSkillPage: omits the triggers/checks sections entirely when absent', () => {
  const thin = { name: 'tdd-first', description: 'test first' };
  const html = renderSkillPage('tdd-first', thin, '<p>b</p>');
  assert.doesNotMatch(html, /class="skill-triggers"/);
  assert.doesNotMatch(html, /class="skill-checks"/);
});

test('renderSkillPage: links back to the SKILL.md source', () => {
  const html = renderSkillPage('security-review', richFm, '');
  assert.match(html, /skills\/security-review\/SKILL\.md/);
});

test('renderSkillPage: escapes HTML-special characters in the title', () => {
  const html = renderSkillPage('x', { title: 'A & B <script>', description: 'd' }, '');
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /A &amp; B/);
});
