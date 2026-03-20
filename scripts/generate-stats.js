#!/usr/bin/env node
// generate-stats.js
// Reads repo folder structure and updates stat counts in HTML pages.
// Run by GitHub Actions on every push to main.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');

function countDirs(dir) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter(f => {
    const full = path.join(dir, f);
    return fs.statSync(full).isDirectory() && !f.startsWith('.');
  }).length;
}

function countFiles(dir, ext) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter(f => f.endsWith(ext) && !f.startsWith('_')).length;
}

const stats = {
  skills:       countDirs(path.join(ROOT, 'skills')),
  walkthroughs: countFiles(path.join(ROOT, 'docs', 'diagrams'), '.html'),
  decisions:    countFiles(path.join(ROOT, 'decisions'), '.md'),
  templates:    countDirs(path.join(ROOT, 'project-template')) + countFiles(path.join(ROOT, 'scripts'), '.sh'),
};

console.log('Stats:', stats);

// Update index.html stat numbers
function patchHTML(file, replacements) {
  if (!fs.existsSync(file)) { console.warn(`Skipping ${file} — not found`); return; }
  let html = fs.readFileSync(file, 'utf8');
  for (const [id, value] of Object.entries(replacements)) {
    html = html.replace(
      new RegExp(`(<span class="stat-n" id="${id}">)[^<]*(</span>)`),
      `$1${value}$2`
    );
    html = html.replace(
      new RegExp(`(<span class="card-count" id="count-${id}">)[^<]*(</span>)`),
      `$1${value} ${id === 'skills' ? 'skills' : id}<\/span>`
    );
  }
  fs.writeFileSync(file, html);
  console.log(`Patched: ${path.basename(file)}`);
}

patchHTML(path.join(DOCS, 'index.html'), {
  'stat-skills':       stats.skills,
  'stat-walkthroughs': stats.walkthroughs,
  'stat-decisions':    stats.decisions,
  'stat-templates':    stats.templates,
});

patchHTML(path.join(DOCS, 'skills.html'), {
  'skill-count': stats.skills,
});

console.log('Done — portal stats updated.');
