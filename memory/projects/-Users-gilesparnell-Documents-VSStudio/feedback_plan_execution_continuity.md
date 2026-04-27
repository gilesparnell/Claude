---
name: Plan Execution Continuity
description: Maintain docs/decisions/decisions.md and docs/handoff/handoff.md per project during plan execution. Update incrementally as work lands, not in a deferred sweep. Lets a fresh Claude or Codex session resume without prior context.
type: feedback
originSessionId: 68614c1b-24c5-491a-8816-afec5baa551b
---
## Rule: Keep Decisions and Handoff Files Living During Plan Execution

**Why:** Giles hits token-limit resets mid-plan, uses `claude-supervisor` for overnight runs (which spawns fresh sessions), and switches between Claude and Codex based on work type. All three cases need durable state outside the conversation so the next session — same runner or different — can resume mid-flight. This pattern was formalised on 2026-04-17 after research confirmed the community has converged on the same plan/handoff/decisions shape (meridian, Continuous-Claude-v3, JD Hodges handoff prompt).

**How to apply:**

### Files (folder pattern, not flat files)

**`docs/decisions/decisions.md`** — project-local tactical decision log.
- Append on every non-trivial choice: tool/library selection, API shape, data model, scope cut, trade-off resolution, rejected alternative, runner-routing change
- Format: date (Australia/Sydney) + one-line title + 2–4 sentence rationale + links to files/PRs
- Distinct from cross-project ADRs in `parnell-systems/claude-artefacts/decisions/`. Promote only when the decision is cross-project or long-lived architectural.

**`docs/handoff/handoff.md`** — running log of significant completed work, newest entry at the top.
- Append on every plan phase complete, feature landed, non-trivial fix, milestone, runner switch, or session-end-mid-task
- Format: date (Australia/Sydney) + what was completed + current runner + what's next + gotchas / in-progress state
- Written as a handoff to the next session — Claude OR Codex — so either can resume

### Update cadence

- **During execution:** after every completed unit, before moving to the next
- **At session end:** always append a handoff entry describing current state and next step, even if mid-unit. This is the state that gets lost on token-limit kill
- **On runner switch:** log the decision AND the handoff state before the switch fires
- **Never batch** — incremental updates, not deferred sweeps. The supervisor's whole reason for existing is that deferred sweeps don't survive unexpected session death

### Supervisor integration

`claude-supervisor` reads both files on every fresh run via `HANDOFF_FILE` / `DECISIONS_FILE` config. Defaults updated 2026-04-17 to point at the folder pattern (`docs/handoff/handoff.md`, `docs/decisions/decisions.md`).

### Skip when

- Single-file throwaway edits / typo fixes with no plan
- Pure research or questions that don't result in code
- Project has no `/docs/` directory AND no plan — don't scaffold just to write one entry

### Canonical source

Full rule lives in `~/.claude/CLAUDE.md` → "Plan Execution Continuity (MANDATORY)". This memory is the discoverability pointer.
