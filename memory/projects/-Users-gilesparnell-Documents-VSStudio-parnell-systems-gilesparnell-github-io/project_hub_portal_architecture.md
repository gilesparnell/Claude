---
name: hub-portal-architecture
description: How the hub-and-spoke portal system works — card linking rules, design system, activation pattern
type: project
---

# Hub Portal Architecture

## Structure
- **Hub portal**: `gilesparnell.github.io` (user site repo, serves from root)
- **Per-project docs portals**: Serve from `/docs` on `main` via GitHub Pages (e.g., `gilesparnell.github.io/SprintTracker/`)
- **Knowledge Portal**: `gilesparnell.github.io/Claude/` (shared `portal.css` across 8 pages)

## Card Linking Rules
- Cards link to **docs portals ONLY** when one exists — via stretched `<a class="card-title">` on the `<h2>`
- If no docs portal exists, the card is **display-only** (no click navigation)
- **GitHub icon** in the card footer is the **only** way to reach a repo — never via the card title
- To activate a new project card: wrap its `<h2>` in `<a href="DOCS_URL" class="card-title">`

## Design System: Deep Ocean Tech
- Fonts: Satoshi (headings, 700/900) + Outfit (body, 300-600) from Fontshare/Google Fonts
- Palette: bg-deep `#0a0c10`, bg-surface `#12151c`, accent `#38bfa0` (teal), text-primary `#e8eaf0`
- Cards: Glassmorphism with `rgba(18,21,28,0.92)` background over animated mesh gradient
- Effects: Cursor glow via `--mouse-x`/`--mouse-y` CSS vars, staggered fadeUp animations
- Bento grid: `repeat(4, 1fr)` on hub, `repeat(3, 1fr)` on project portals

## Projects with Docs Portals (as of 2026-04-01)
- Claude Knowledge Portal → `gilesparnell.github.io/Claude/`
- Sprint Tracker → `gilesparnell.github.io/SprintTracker/`
