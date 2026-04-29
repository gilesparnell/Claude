---
name: Project Folder Structure Standard
description: Standard folder structure to enforce from day one on all new projects — prevents organic cruft accumulation
type: feedback
originSessionId: b56b5bd2-19be-4d6b-bce0-38e10ecfad96
---
Enforce this structure at project creation, not organically. Root is for config only. Every other category gets its own folder even if empty on day one.

**Why:** The resume project grew from scripts + markdown into a full Next.js app without enforcing a restructure checkpoint. Root accumulated scripts, content, generated outputs, and design artefacts. `/docs/plans` was added later but didn't pull the rest into shape. Result: ~130–175 MB of cruft and a confusing root. Prevention is one `mkdir` at init.

**How to apply:** When starting any new project (or when a project visibly outgrows its initial shape), scaffold this full tree before writing any code. Call it out explicitly: "Setting up standard folder structure now."

## Standard Structure

```
project-root/
├── app/ or src/        # Application source code (Next.js app/, or src/ for others)
├── components/         # UI components (frontend projects)
├── lib/                # Shared utilities, core logic
├── scripts/            # Build, export, migration, utility scripts — never loose at root
├── content/            # Source content (markdown, copy, data files edited by hand)
├── exports/            # Generated outputs (HTML, PDFs, images) — never edit directly
├── design/             # Design assets, mockups, PDFs, screenshots
├── __tests__/          # All test files — never scattered at root
├── docs/
│   ├── plans/          # Planning documents
│   ├── decisions/      # Decision log (per Plan Execution Continuity rule)
│   └── handoff/        # Handoff log (per Plan Execution Continuity rule)
└── [root: config only] # package.json, tsconfig, .env.example, README, .gitignore
```

## Non-negotiable rules

1. **Root is config only.** No scripts, no content files, no generated outputs, no test files at root.
2. **scripts/ from day one** — even if it only has one file. Prevents the "just put it at root for now" habit.
3. **content/ vs exports/ split** — source material you edit goes in `content/`, generated outputs go in `exports/`. Never mix.
4. **design/ for all design artefacts** — PDFs, screenshots, mockups, HTML previews. Not `ClaudeDesignWork/` or any ad-hoc name.
5. **tests never at root** — `__tests__/` or `tests/` alongside source, never `profile.test.mjs` floating at root.
6. **docs/plans/ + docs/decisions/ + docs/handoff/** — always present on any project with a plan (per Plan Execution Continuity rule).

## Enforcement checkpoint

When a project that started small grows into a real app (adds a framework, adds a database, ships to production), call a restructure checkpoint before continuing. Don't wait until it's a mess.
