---
name: Project Documentation Standard
description: Each project has its own docs/ folder served via GitHub Pages. Hub page links to each project. Exemplar is SprintTracker. Never put project docs in the Claude knowledge portal.
type: reference
---

## Project Documentation Standard

### The Pattern (MANDATORY)
Each project has its **own** GitHub Pages site in its `docs/` folder, served at `gilesparnell.github.io/<repo-name>/`. The hub page at `gilesparnell.github.io/` links to each project's docs.

### Exemplar: SprintTracker
- **URL:** https://gilesparnell.github.io/SprintTracker/
- **Repo:** /Users/gilesparnell/Documents/VSStudio/parnell-systems/sprint-tracker/docs/
- **Files:**
  - `docs/index.html` — Project homepage (bento grid with glass cards, Satoshi/Outfit fonts, mesh background)
  - `docs/diagrams/plan-progress.html` — Visual progress dashboard (workstream cards with task-level status)
  - `docs/user-guide.html` — End-user guide (TOC grid, concept cards, flow diagrams, ref tables, tips)

### Hub Page
- **URL:** https://gilesparnell.github.io/
- **Repo:** /Users/gilesparnell/Documents/VSStudio/parnell-systems/gilesparnell.github.io/
- Each project card links to `gilesparnell.github.io/<repo-name>/`

### Claude Knowledge Portal (SEPARATE — not for project docs)
- **URL:** https://gilesparnell.github.io/Claude/
- **Repo:** /Users/gilesparnell/Documents/VSStudio/parnell-systems/claude-artefacts/
- Contains: skills, walkthroughs, decisions, templates, changelog
- Has its own project-status.html for Parnell Systems business plans (GTM etc.)
- **NOT for client project documentation**

### Design System: "Deep Ocean Tech"
- Fonts: Satoshi (headings/display), Outfit (body)
- Dark theme (#0a0c10 bg), glassmorphism cards, mesh background blobs
- Cursor glow effects on hover (card::after radial-gradient)
- Accent: teal #38bfa0
- All pages self-contained CSS (no shared portal.css for project sites)

### Key Rules
1. When user asks for project documentation, create it in the **project's own docs/ folder**
2. Follow the SprintTracker exemplar exactly (index.html, diagrams/plan-progress.html, user-guide.html)
3. Update the hub page card to link to the project's docs site
4. NEVER put project docs in the Claude knowledge portal
5. NEVER use Proof for documentation
6. GitHub Pages must be enabled on the repo (serve from /docs on main branch)
