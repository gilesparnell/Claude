---
name: Claude vs Codex Routing
description: Route work explicitly at plan time. Claude for thinking/strategy/judgement; Codex for build from a clear spec. Every plan unit needs an Execution target tag. Every working update must announce the active runner.
type: feedback
originSessionId: 68614c1b-24c5-491a-8816-afec5baa551b
---
## Rule: Claude Thinks, Codex Builds

**Why:** Claude per-token cost ≫ Codex per-token cost. The 5-hour usage window that keeps forcing Giles to build supervisor scripts is a downstream symptom — the upstream fix is routing the work correctly in the first place. Giles explicitly asked for this rule on 2026-04-17 after noticing he was context-switching between Codex and Claude mid-task because of credit exhaustion, which is exactly the anti-pattern this prevents.

**How to apply:**

### The split

- **Claude executes directly:** planning, strategy, architecture, ambiguous debugging, code/security review, trade-off calls, writing plan documents themselves (`/ce:plan`, `/ce:plan-beta`), security-sensitive code.
- **Codex executes by default for everything else:** implementation from a clear spec, mechanical refactors, renames, codemods, test implementation from signatures Claude wrote, volume rollouts, boilerplate, scaffolding, config files, applying review feedback already reasoned through.

### Plan tags (MANDATORY)

Every implementation unit in a `/ce:plan` or `/ce:plan-beta` document MUST carry:

```
Execution target: codex-delegate   # default — use this unless justified otherwise
Execution target: claude           # must justify why Codex can't do it
Execution target: hybrid           # Claude scaffolds, Codex fills in volume — spell out handoff point
```

Every plan MUST have a **Routing summary** block at the top: count per runner + one-sentence rationale for each `claude`-tagged unit.

### Working-update tag (MANDATORY)

Every response that produces or is about to produce code states the active runner at the top, one line:

- `Runner: Claude — Unit 2 is tagged claude (ambiguous, needs exploration).`
- `Runner: Codex — delegating Unit 4 via Execution target: codex-delegate.`
- `Runner: switching — design phase done, Units 5–18 handing off to Codex.`

This makes mis-routing visible. If Giles sees `Runner: Claude` on something mechanical, that's a signal to challenge it.

### Mid-execution switches

Legitimate only when **work type changes**. Never switch runners because credits ran out — that's the symptom of bad routing at plan time. Record every switch in `docs/handoff/handoff.md` with the reason.

### Skip the tag when

- Single-line fixes, typos, doc tweaks (too small to plan)
- Pure research or questions with no code output
- Spike/throwaway work explicitly not going into a plan

### Canonical source

Full rule, table, and rationale live in `~/.claude/CLAUDE.md` → "Claude vs Codex Routing (MANDATORY)". This memory is the discoverability pointer.
