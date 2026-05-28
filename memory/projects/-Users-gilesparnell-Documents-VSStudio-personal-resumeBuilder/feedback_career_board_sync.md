---
name: career-board-sync
description: "Whenever investigating / evaluating / adding / reranking / re-scoping a career role, update docs/diagrams/career-options.html (the canonical visual decision board) in the same session so it never drifts from the plan + job-search memory."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c166c580-c2c0-4661-9cb1-66d762631f56
---

**Whenever a career role is investigated, evaluated, added, removed, reranked, or re-scoped — update `docs/diagrams/career-options.html` to match, in the same session.**

This page is the canonical *visual* decision board: a fit×comp quadrant + ranked role cards (comp bars against the A$298k cash / A$334k TRP floor, why-fit / watch-out columns, ruled-out contrast). Giles explicitly values it ("great artefact").

**Why:** it's his at-a-glance career decision board. If it goes stale relative to the career plan (`docs/plans/2026-04-29-002-career-progression-options.md`) and the job-search memories, it stops being useful and becomes actively misleading. He asked for it to be kept current as a standing rule.

**How to apply:**
- Treat the HTML page as a sync target *alongside* the plan doc and [[project-job-search-state]] — not instead of them. Update all the relevant surfaces.
- Reflect changes in both the **card** and the matching **quadrant dot**: a new/removed role, a rerank, a status change (target ↔ exploring ↔ ruled-out), a comp-band revision, or changed fit/risk reasoning.
- Keep all figures in **AUD** (A$) and keep the "indicative estimate, verify per role" framing — comp numbers are estimates, not offers.
- It's a self-contained "Deep Ocean Tech" page (no shared CSS); pure HTML anchors + CSS for the clickable bubbles / back-links — no JS logic.
- After editing, **verify the render** (Puppeteer is a project dep — screenshot the changed region) before claiming done.
- It's a docs page → no version bump / CHANGELOG needed.

Related: [[project-job-search-state]], [[user-background-skillset]], [[project-comp-floor]].
