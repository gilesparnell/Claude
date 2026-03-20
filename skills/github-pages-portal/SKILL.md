---
name: github-pages-portal
description: >
  Use this skill whenever you need to build or maintain a self-updating GitHub Pages
  knowledge portal. Triggers include: adding a new section to the portal, updating
  portal pages, creating a GitHub Action for auto-deployment, or setting up a new
  static site that auto-regenerates from repo folder contents. Also use when asked
  to "add this to the portal" or "make the pages update automatically".
license: allconvos.ai internal — not for redistribution
version: 1.0
---

# Skill: GitHub Pages Knowledge Portal

## Overview

A GitHub Pages portal where the repo IS the database. Folders become pages,
markdown files become cards, and a GitHub Action regenerates HTML on every push.
You never edit HTML manually — push content, pages update themselves.

---

## Portal Architecture

```
repo/
├── .github/
│   └── workflows/
│       └── build-portal.yml   ← Triggers on push, runs generate-stats.js
├── docs/                      ← GitHub Pages root (set in repo Settings)
│   ├── portal.css             ← Shared design system — imported by ALL pages
│   ├── index.html             ← Home dashboard
│   ├── skills.html            ← Skills library
│   ├── walkthroughs.html      ← Visual explainers
│   ├── decisions.html         ← Architecture Decision Records
│   ├── templates.html         ← Scripts and config templates
│   └── changelog.html         ← Auto-generated from git history via GitHub API
├── scripts/
│   └── generate-stats.js      ← Reads folder counts, patches HTML stat numbers
├── skills/                    → skills.html
├── decisions/                 → decisions.html
├── project-template/          → templates.html
└── walkthroughs/ (or diagrams/) → walkthroughs.html
```

---

## Design System

All pages import `portal.css` — a shared stylesheet with CSS variables, components,
and dark mode support. Never add page-specific styles that duplicate portal.css rules.

### Key CSS Variables
```css
--bg, --bg2, --bg3          /* surface backgrounds */
--text, --text2, --text3    /* text hierarchy */
--border, --border2         /* border opacity levels */
--font, --mono              /* typefaces */
--blue, --teal, --amber, --coral, --purple, --green, --navy  /* accent colours */
/* Each colour also has: --{colour}-bg, --{colour}-text, --{colour}-border */
```

### Standard Page Structure
Every page follows this exact structure:
1. `<header class="site-header">` — logo, nav, GitHub button
2. `<div class="hero">` — eyebrow, title with `<em>` accent, subtitle, stats
3. `<div class="page-nav">` — sticky filter/tab bar
4. `<div class="wrap">` — main content area
5. `<footer class="site-footer">` — attribution + hint

### Card Accent Colours
Each portal section has a colour identity:
- Skills → blue (`--blue-bg`, gradient `accent-blue`)
- Walkthroughs → teal (`--teal-bg`, gradient `accent-teal`)
- Decisions → amber (`--amber-bg`, gradient `accent-amber`)
- Templates → coral (`--coral-bg`, gradient `accent-coral`)
- Changelog → purple (`--purple-bg`, gradient `accent-purple`)
- Engagement skills → navy (`--navy-bg`)

---

## Adding a New Portal Section

### Step 1 — Create the content folder
```bash
mkdir -p decisions/
```

### Step 2 — Create the HTML page
Copy the structure from an existing page (e.g. `decisions.html`). Update:
- `<title>` and hero text
- `<nav>` active link
- Content grid and cards
- Footer hint text

### Step 3 — Add to navigation
Update the `<nav class="header-nav">` block in ALL existing pages to include the
new page link. The nav must be consistent across all pages.

### Step 4 — Add a card on index.html
Add a new `.card` to the `.portal-grid` on `index.html` with the section's colour
accent, description, tags, and link.

### Step 5 — Update generate-stats.js
Add a stat counter for the new folder:
```javascript
const stats = {
  // existing stats...
  decisions: countFiles(path.join(ROOT, 'decisions'), '.md'),
  // add new:
  yourSection: countDirs(path.join(ROOT, 'your-folder')),
};
```

### Step 6 — Commit and push
The GitHub Action handles the rest.

---

## GitHub Action Pattern

The workflow (`build-portal.yml`) runs on every push to main:
1. Checks out repo with full history (`fetch-depth: 0`)
2. Runs `generate-stats.js` to patch stat numbers in HTML
3. Commits any changes back with `[skip ci]` to avoid loops
4. GitHub Pages serves the updated `docs/` folder

### Preventing CI loops
Always add `[skip ci]` to the auto-commit message:
```yaml
git commit -m "chore: auto-update portal stats [skip ci]"
```

---

## Changelog Page Pattern

The changelog page fetches live from the GitHub API — no generation needed:
```javascript
fetch('https://api.github.com/repos/{owner}/{repo}/commits?per_page=50')
  .then(r => r.json())
  .then(commits => { /* render */ })
```

Conventional Commits format makes this work well. Badge mapping:
- `feat:` → teal badge
- `fix:` → coral badge
- `chore:`, `refactor:`, `test:`, `ci:` → grey badge
- `docs:` → blue badge

---

## Activity Feed Pattern

The home page hero shows recent commits live from GitHub API.
Color-codes by commit type using the same badge mapping.
Uses `timeAgo()` helper for human-readable timestamps.

---

## Skill Card Structure (skills.html)

Each skill card has:
- `.skill-band` with coloured background — contains name, slug, icon, category badge
- `.skill-body` with description, triggers, and checks/principles

To add a new skill card:
1. Add the HTML block to `skills.html`
2. Set `data-category="your-category"` on `.skill-card`
3. Add a filter button to `.page-nav` if it's a new category
4. Update the category count in the hero stats

---

## ADR (Architecture Decision Record) Structure

Each ADR card shows:
- ADR number (ADR-001, ADR-002...)
- Title — the decision made
- Description — context and rationale
- Status badge: `accepted`, `proposed`, or `deprecated`
- Tags and date

To add an ADR:
1. Add a `.adr-card` block to `decisions.html`
2. Set `data-category` to the appropriate category
3. Increment the ADR number sequentially
4. Optionally create a markdown file in `decisions/` for full detail

---

## GitHub Pages Setup

In repo Settings → Pages:
- Source: Deploy from branch
- Branch: `main`
- Folder: `/docs`

The portal is then live at `https://{username}.github.io/{repo}/`

---

## Style Rules

- No emoji in card titles, headings, or body text
- Warning symbol (WARNING:) acceptable for callout labels
- Dark mode is mandatory — all colours via CSS variables only
- No hardcoded hex colours in HTML — always use CSS variables
- Font weight: 400 body, 600 headings — no 700
- All links open in `_blank` when pointing to GitHub
- Sticky `.page-nav` always has `z-index: 10`

---

## Reuse Checklist for a New Portal

- [ ] Copy `portal.css` to the new repo's `docs/` folder
- [ ] Create `index.html` from the home page template
- [ ] Create section pages for each content area
- [ ] Set up `generate-stats.js` with correct folder paths
- [ ] Create `.github/workflows/build-portal.yml`
- [ ] Enable GitHub Pages in repo Settings → Pages → `/docs`
- [ ] Commit and push — portal goes live automatically
- [ ] Verify dark mode renders correctly
- [ ] Verify changelog page loads commits from GitHub API
