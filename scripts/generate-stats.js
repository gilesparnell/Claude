#!/usr/bin/env node
// generate-stats.js
// Runs on every push via GitHub Action.
// 1. Reads all skills/*/SKILL.md frontmatter → regenerates skills.html cards
// 2. Counts content folders → patches stat numbers in index.html and skills.html
// 3. Reads decisions/*.md → regenerates decisions.html ADR cards

const fs   = require('fs');
const path = require('path');

const ROOT    = path.join(__dirname, '..');
const DOCS    = path.join(ROOT, 'docs');
const SKILLS  = path.join(ROOT, 'skills');
const DECS    = path.join(ROOT, 'decisions');
const DIAGS   = path.join(ROOT, 'docs', 'diagrams');
const TMPLS   = path.join(ROOT, 'project-template');
const SCRIPTS = path.join(ROOT, 'scripts');

// ── Helpers ────────────────────────────────────────────────────────────────

function readFile(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

function countDirs(dir) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir)
    .filter(f => fs.statSync(path.join(dir, f)).isDirectory() && !f.startsWith('.'))
    .length;
}

function countFiles(dir, ext) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(ext) && !f.startsWith('_') && !f.startsWith('.'))
    .length;
}

// Minimal YAML frontmatter parser (no dependencies needed)
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const yaml = match[1];
  const result = {};
  let currentKey = null;
  for (const line of yaml.split('\n')) {
    // Array item
    if (line.match(/^\s+-\s+(.+)/)) {
      const val = line.match(/^\s+-\s+(.+)/)[1].trim();
      if (currentKey) {
        if (!Array.isArray(result[currentKey])) result[currentKey] = [];
        result[currentKey].push(val);
      }
      continue;
    }
    // Key: value
    const kv = line.match(/^(\w[\w-]*):\s*(.*)/);
    if (kv) {
      currentKey = kv[1];
      const val = kv[2].trim().replace(/^['"]|['"]$/g, '');
      result[currentKey] = val || null;
    }
  }
  return result;
}

// ── Colour map ─────────────────────────────────────────────────────────────

const COLOR_MAP = {
  blue:   { band: 'var(--blue-bg)',   badge: 'var(--blue-bg)',   text: 'var(--blue-text)',   border: 'var(--blue-border)'   },
  purple: { band: 'var(--purple-bg)', badge: 'var(--purple-bg)', text: 'var(--purple-text)', border: 'var(--purple-border)' },
  teal:   { band: 'var(--teal-bg)',   badge: 'var(--teal-bg)',   text: 'var(--teal-text)',   border: 'var(--teal-border)'   },
  coral:  { band: 'var(--coral-bg)',  badge: 'var(--coral-bg)',  text: 'var(--coral-text)',  border: 'var(--coral-border)'  },
  amber:  { band: 'var(--amber-bg)',  badge: 'var(--amber-bg)',  text: 'var(--amber-text)',  border: 'var(--amber-border)'  },
  green:  { band: 'var(--green-bg)',  badge: 'var(--green-bg)',  text: 'var(--green-text)',  border: 'var(--green-border)'  },
  navy:   { band: 'var(--navy-bg)',   badge: 'var(--navy-bg)',   text: 'var(--navy-text)',   border: 'var(--navy-border)'   },
};

const CAT_COLOR = {
  code:       'blue',
  frontend:   'coral',
  workflow:   'amber',
  saas:       'green',
  engagement: 'navy',
  tooling:    'purple',
  testing:    'teal',
};

function colorForCategory(cat) {
  return COLOR_MAP[CAT_COLOR[cat] || 'blue'];
}

// ── Read all skills ────────────────────────────────────────────────────────

function readSkills() {
  if (!fs.existsSync(SKILLS)) return [];
  return fs.readdirSync(SKILLS)
    .filter(f => fs.statSync(path.join(SKILLS, f)).isDirectory() && !f.startsWith('.'))
    .map(slug => {
      const skillFile = path.join(SKILLS, slug, 'SKILL.md');
      const content   = readFile(skillFile);
      const fm        = parseFrontmatter(content);
      return { slug, ...fm };
    })
    .filter(s => s.title); // skip skills without frontmatter
}

// ── Generate skill card HTML ───────────────────────────────────────────────

function skillCard(skill) {
  const cat   = skill.category || 'code';
  const color = colorForCategory(cat);
  const icon  = skill.icon || '&#128196;';
  const scope = skill.scope || 'global';
  const scopeStyle = scope === 'global'
    ? 'background:var(--teal-bg);color:var(--teal-text);border-color:var(--teal-border)'
    : 'background:var(--blue-bg);color:var(--blue-text);border-color:var(--blue-border)';

  const triggers = (Array.isArray(skill.triggers) ? skill.triggers : [])
    .map(t => `            <span class="trigger">${t}</span>`)
    .join('\n');

  const checkLabel = skill['checks-label'] || 'Key rules';
  const checks = (Array.isArray(skill.checks) ? skill.checks : [])
    .map(c => `            <div class="check-item"><span class="check-dot"></span>${c}</div>`)
    .join('\n');

  return `
    <!-- ${skill.title.toUpperCase()} -->
    <div class="skill-card" data-category="${cat}" data-scope="${scope}">
      <div class="skill-band" style="background:${color.band}">
        <div>
          <div class="skill-name">${skill.title}</div>
          <div class="skill-slug">${skill.slug}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
          <span class="skill-icon">${icon}</span>
          <span class="cat-badge" style="${scopeStyle}">${scope}</span>
          <span class="cat-badge" style="background:${color.badge};color:${color.text};border-color:${color.border}">${cat}</span>
        </div>
      </div>
      <div class="skill-body">
        <div class="skill-desc">${skill.description || ''}</div>
        <div>
          <div class="triggers-label">Triggers on</div>
          <div class="triggers">
${triggers}
          </div>
        </div>
        <div>
          <div class="triggers-label">${checkLabel}</div>
          <div class="checks">
${checks}
          </div>
        </div>
      </div>
    </div>`;
}

// ── Read all decisions ─────────────────────────────────────────────────────

function readDecisions() {
  if (!fs.existsSync(DECS)) return [];
  return fs.readdirSync(DECS)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .sort()
    .map(f => {
      const content = readFile(path.join(DECS, f));
      const fm      = parseFrontmatter(content);
      const num     = f.replace('.md','').toUpperCase();
      return { num, ...fm };
    })
    .filter(d => d.title);
}

// ── Generate ADR card HTML ─────────────────────────────────────────────────

const STATUS_CLASS = { accepted: 'status-accepted', proposed: 'status-proposed', deprecated: 'status-deprecated' };

function adrCard(d) {
  const statusClass = STATUS_CLASS[d.status] || 'status-proposed';
  const tags = (Array.isArray(d.tags) ? d.tags : [])
    .map(t => `<span class="tag">${t}</span>`).join('\n          ');
  return `
    <div class="adr-card" data-category="${d.category || 'architecture'}">
      <div class="adr-num">${d.num}</div>
      <div class="adr-body">
        <div class="adr-title">${d.title}</div>
        <div class="adr-desc">${d.description || ''}</div>
        <div class="adr-meta">
          <span class="adr-status ${statusClass}">${d.status || 'proposed'}</span>
          ${tags}
          <span style="font-size:11px;color:var(--text3);font-family:var(--mono)">${d.date || ''}</span>
        </div>
      </div>
    </div>`;
}

// ── Patch HTML between markers ─────────────────────────────────────────────

function patchBetween(html, startMarker, endMarker, newContent) {
  const start = html.indexOf(startMarker);
  const end   = html.indexOf(endMarker);
  if (start === -1 || end === -1) {
    console.warn(`  WARNING: markers not found — ${startMarker}`);
    return html;
  }
  return html.slice(0, start + startMarker.length) + '\n' + newContent + '\n  ' + html.slice(end);
}

function patchStat(html, id, value) {
  return html
    .replace(new RegExp(`(<span class="stat-n" id="${id}">)[^<]*(</span>)`), `$1${value}$2`)
    .replace(new RegExp(`(<span class="card-count" id="count-${id}">)[^<]*(</span>)`), `$1${value} ${id}<\/span>`);
}

// ── Main ───────────────────────────────────────────────────────────────────

const skills    = readSkills();
const decisions = readDecisions();

const stats = {
  skills:       skills.length || countDirs(SKILLS),
  walkthroughs: countFiles(DIAGS, '.html'),
  decisions:    decisions.length || countFiles(DECS, '.md'),
  templates:    countDirs(TMPLS) + countFiles(SCRIPTS, '.sh'),
};

console.log('Stats:', stats);
console.log('Skills found:', skills.map(s => s.slug));
console.log('Decisions found:', decisions.map(d => d.num));

// ── Patch skills.html ──────────────────────────────────────────────────────

const skillsFile = path.join(DOCS, 'skills.html');
if (skills.length > 0 && fs.existsSync(skillsFile)) {
  let html = readFile(skillsFile);
  const cardsHTML = skills.map(skillCard).join('\n');

  html = patchBetween(html,
    '<!-- AUTO-GENERATED SKILLS START -->',
    '<!-- AUTO-GENERATED SKILLS END -->',
    cardsHTML
  );
  html = patchStat(html, 'skill-count', stats.skills);
  // Update categories count
  const cats = new Set(skills.map(s => s.category || 'code'));
  html = html.replace(
    /(<span class="stat-n" id="cat-count">)[^<]*(<\/span>)/,
    `$1${cats.size}$2`
  );
  // Update trigger phrases count
  const totalTriggers = skills.reduce((acc, s) => acc + (Array.isArray(s.triggers) ? s.triggers.length : 0), 0);
  html = html.replace(
    /(<span class="stat-n">)\d+\+(<\/span>\s*<span class="stat-l">Trigger phrases)/,
    `$1${totalTriggers}+$2`
  );

  fs.writeFileSync(skillsFile, html);
  console.log('Patched: skills.html');
}

// ── Patch decisions.html ───────────────────────────────────────────────────

const decisionsFile = path.join(DOCS, 'decisions.html');
if (decisions.length > 0 && fs.existsSync(decisionsFile)) {
  let html = readFile(decisionsFile);
  const adrsHTML = decisions.map(adrCard).join('\n');

  html = patchBetween(html,
    '<!-- AUTO-GENERATED ADRS START -->',
    '<!-- AUTO-GENERATED ADRS END -->',
    adrsHTML
  );
  const accepted = decisions.filter(d => d.status === 'accepted').length;
  const proposed = decisions.filter(d => d.status === 'proposed').length;
  html = html.replace(/(<span class="stat-n" id="adr-count">)[^<]*(<\/span>)/, `$1${decisions.length}$2`);
  html = html.replace(/(<span class="stat-n" id="accepted-count">)[^<]*(<\/span>)/, `$1${accepted}$2`);
  html = html.replace(/(<span class="stat-n" id="proposed-count">)[^<]*(<\/span>)/, `$1${proposed}$2`);

  fs.writeFileSync(decisionsFile, html);
  console.log('Patched: decisions.html');
}

// ── Discover plan progress diagrams ────────────────────────────────────

function readPlanProgress() {
  if (!fs.existsSync(DIAGS)) return [];
  return fs.readdirSync(DIAGS)
    .filter(f => f.endsWith('-progress.html'))
    .map(f => {
      const content = readFile(path.join(DIAGS, f));
      // Extract title from <div class="page-title">...</div>
      const titleMatch = content.match(/<div class="page-title">(.*?)<\/div>/);
      // Extract percentage from <span class="progress-pct">XX%</span>
      const pctMatch = content.match(/<span class="progress-pct">(\d+)%<\/span>/);
      // Extract date from <div class="page-date">Last updated: (.*?)</div>
      const dateMatch = content.match(/<div class="page-date">Last updated:\s*(.*?)<\/div>/);
      // Extract task stats from progress-stat spans
      const doneMatch = content.match(/(\d+) tasks? done/);
      const progressMatch = content.match(/(\d+) in progress/);
      const blockedMatch = content.match(/(\d+) blocked/);
      const remainMatch = content.match(/(\d+) remaining/);

      return {
        file: f,
        title: titleMatch ? titleMatch[1] : f.replace(/-progress\.html$/, '').replace(/-/g, ' '),
        pct: pctMatch ? parseInt(pctMatch[1]) : 0,
        date: dateMatch ? dateMatch[1].trim() : '',
        done: doneMatch ? parseInt(doneMatch[1]) : 0,
        inProgress: progressMatch ? parseInt(progressMatch[1]) : 0,
        blocked: blockedMatch ? parseInt(blockedMatch[1]) : 0,
        remaining: remainMatch ? parseInt(remainMatch[1]) : 0,
      };
    });
}

function planColor(pct) {
  if (pct >= 75) return 'green';
  if (pct >= 40) return 'blue';
  if (pct >= 10) return 'amber';
  return 'teal';
}

function planCard(plan, index) {
  const color = planColor(plan.pct);
  return `
    <a href="diagrams/${plan.file}" class="plan-card plan-${color}" style="text-decoration:none">
      <div class="plan-band">
        <div>
          <div class="plan-num">Plan #${index + 1}</div>
          <div class="plan-name">${plan.title}</div>
        </div>
        <div class="plan-pct">${plan.pct}%</div>
      </div>
      <div class="plan-bar-track"><div class="plan-bar-fill" style="width:${plan.pct}%"></div></div>
      <div class="plan-meta">
        <div class="plan-stat"><span class="plan-dot done"></span> ${plan.done} done</div>
        <div class="plan-stat"><span class="plan-dot progress"></span> ${plan.inProgress} in progress</div>
        <div class="plan-stat"><span class="plan-dot blocked"></span> ${plan.blocked} blocked</div>
        <div class="plan-stat"><span class="plan-dot todo"></span> ${plan.remaining} remaining</div>
      </div>
      <div class="plan-footer">
        <span class="plan-link">View full progress diagram &#8594;</span>
        <div class="plan-updated">Last updated: ${plan.date}</div>
      </div>
    </a>`;
}

// ── Patch project-status.html ─────────────────────────────────────────

const plans = readPlanProgress();
console.log('Plans found:', plans.map(p => p.file));

const statusFile = path.join(DOCS, 'project-status.html');
if (plans.length > 0 && fs.existsSync(statusFile)) {
  let html = readFile(statusFile);
  const plansHTML = plans.map(planCard).join('\n');

  html = patchBetween(html,
    '<!-- AUTO-GENERATED PLANS START -->',
    '<!-- AUTO-GENERATED PLANS END -->',
    plansHTML
  );
  html = html.replace(
    /(<span class="stat-n" id="plan-count">)[^<]*(<\/span>)/,
    `$1${plans.length}$2`
  );

  fs.writeFileSync(statusFile, html);
  console.log('Patched: project-status.html');
}

// ── Patch index.html stats ─────────────────────────────────────────────────

const indexFile = path.join(DOCS, 'index.html');
if (fs.existsSync(indexFile)) {
  let html = readFile(indexFile);
  html = patchStat(html, 'stat-skills',       stats.skills);
  html = patchStat(html, 'stat-walkthroughs', stats.walkthroughs);
  html = patchStat(html, 'stat-decisions',    stats.decisions);
  html = patchStat(html, 'stat-templates',    stats.templates);
  fs.writeFileSync(indexFile, html);
  console.log('Patched: index.html');
}

console.log('\nDone — portal fully regenerated.');
