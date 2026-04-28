---
name: SprintTracker Current State
description: Sprint Tracker current version, shipped features, and what remains as of 2026-04-28
type: project
---

## Version: 0.13.3 (live on Vercel)

**Note:** Earlier version of this file reflected state at 2026-04-01 (v~0.9.x, 88% complete). This file supersedes it.

## What's Shipped Since April 2026

- **v0.10.0** — Create-product dialogue in backlog, wider desktop layout; build error fixes
- **v0.11.x** — Admin page fixes (badge alignment, live session name sync, conditional admin icon, backlog product default); mobile sign-out button; Next.js 16 revalidateTag fix
- **v0.12.x** — Light "day work" mode toggle with system autodetect; extended to sidebar, drawer, mobile top bar; React hydration mismatch (#418) fixed
- **v0.13.x** — Rename backlogs inline; surface parent story on tasks; parent story picker in Edit Task modal; always-show parent story picker fix

## Kanban drag-and-drop
Shipped and documented in roadmap. PR merged, docs updated.

## Current architecture
- Next.js 15 App Router + TypeScript
- Turso (libSQL) in production — migration `0004_sudden_catseye.sql` applied to production
- Auth via NextAuth v5
- Vercel deployment, branch protection + CI required

## What remains (from roadmap)
- **P0:** Playwright E2E tests, API route integration tests
- **P1:** Keyboard shortcuts, archive status for stories
- **P2:** Bidirectional ClickUp sync (plan exists in docs/plans/), global search (FTS5), burndown/velocity charts
- **P3:** Bulk ops, sprint templates, file attachments, custom fields, permissions, webhooks

## Key files
- `docs/plans/2026-04-01-002-feat-sprint-tracker-roadmap-plan.md` — full prioritised roadmap
- `docs/user-guide.html` — visual user guide
- `docs/diagrams/plan-progress.html` — progress dashboard

## Working tree state (check on next session)
As of early April, there were uncommitted changes (dev auth bypass, lazy-loaded widgets, SidebarNavLink memo, ProductManager UI). Verify these were committed before assuming the tree is clean.
