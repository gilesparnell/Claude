---
title: Plan Execution Continuity
scope: global
category: workflow
icon: &#128203;
description: Two living files per project — docs/decisions/decisions.md and docs/handoff/handoff.md — so a fresh Claude or Codex session can resume mid-plan after token-limit resets, restarts, or runner handoffs.
triggers:
  - plan execution
  - handoff entry
  - decision log
  - session ending mid-task
  - runner switch
checks-label: Rules
checks:
  - decisions.md — append every non-trivial choice with date + rationale
  - handoff.md — newest entry at top, written for the next session
  - Always write a handoff entry at session end, even mid-unit
  - Never batch updates at session end — log incrementally
version: 1.0
---


# Plan Execution Continuity (MANDATORY)

When working through a detailed plan (e.g. via `/ce:work-beta`, the `claude-supervisor` tool, or any multi-step implementation), maintain two living files per project so a fresh session — Claude or Codex — can resume without the previous run's context. These files exist to survive token-limit resets, session restarts, the claude-supervisor auto-restart flow, and runner handoffs.

## Files

**`docs/decisions/decisions.md`** — project-local decision log for in-flight plan work.
- Append an entry whenever a non-trivial choice is made: tool/library selection, API shape, data model, scope cut, trade-off resolution, rejected alternative, runner-routing change
- Each entry: date (Australia/Sydney), one-line title, 2–4 sentence rationale, link(s) to relevant files/PRs
- Cheap and fast — these are tactical decisions within the current plan, not architectural ADRs
- **Promote to a cross-project decision record** (kept in a separate private repo) only when the decision has impact outside this project or establishes a long-lived architectural pattern. Never merge the two — project-local stays project-local

> Example: `## 2026-05-10 AEST — Chose Zod for API validation` — Zod over Yup: first-class TS inference, smaller bundle. Yup rejected: type wrapping overhead. See `app/api/generate-profile/route.ts`.

**`docs/handoff/handoff.md`** — running log of significant completed work, written as a handoff to the next session.
- Append an entry every time a significant piece of work is finished (a plan phase, a feature, a non-trivial fix, a milestone, a runner switch)
- Each entry: date (Australia/Sydney), what was completed, current runner, what's next, any gotchas / in-progress state a fresh session would need to resume safely
- **Newest entry at the top** so a fresh session reads the most recent first
- Structured so a new Claude *or* Codex session can read the most recent entry and pick up the plan mid-flight

> Example: `## 2026-05-10 AEST — Phase 2 complete` — Runner: Claude→Codex. Units 4–6 done. Next: Unit 7 — CVPreview reads from Supabase on load. Gotcha: RLS not yet enabled on `profiles` table — don't ship Unit 8 before that's done.

## When to update

- **During plan execution**: after every completed unit, before moving to the next, decide whether this completion warrants a handoff entry or a decisions entry (or both)
- **At session end** (approaching token limits, `/compact`, `claude-supervisor` restart, or mid-task stop): always append a handoff entry describing current state and the next step, **even if mid-unit**. This is exactly the state that gets lost on a token-limit kill
- **On runner switch**: log both the decision (in `decisions.md`) and the handoff state (in `handoff.md`) before the switch fires
- **Never batch at session end** — update incrementally as work lands. Deferred sweeps are exactly what fails when the session dies unexpectedly

## Relationship to architecture decision records

`docs/decisions/decisions.md` = project-local, tactical. Cross-project architectural decisions live in a separate private repo. Never merge the two. `claude-supervisor` reads both files via `HANDOFF_FILE` / `DECISIONS_FILE` config on every fresh run.

## Skip when

- Single-file throwaway edits / typo fixes with no plan
- Pure research or questions that don't result in code
- Project has no `/docs/` directory AND no plan — don't create scaffolding just to write one entry; wait until there's a plan
