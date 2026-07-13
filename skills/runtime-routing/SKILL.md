---
title: Runtime &amp; Runner Routing
scope: global
category: tooling
icon: &#128256;
description: Route work to the right runner and runtime — Claude vs codex-cli switch rules and rationale, plus choosing between local Claude, claude-supervisor, Anthropic Routines, /loop, and desktop scheduled tasks.
triggers:
  - codex delegation
  - supervisor
  - schedule a routine
  - usage window hit
  - runner switch
checks-label: Rules
checks:
  - Runner switches only when work type changes, never because credits ran out
  - 5h-window mid-task → supervisor; webhook/cron work → Routines
  - In-session polling → /loop; judgement and design → local Claude
  - Fix mis-routing in the plan, don't paper over it
version: 1.0
---


# Runtime & Runner Routing

Companion detail to the always-loaded "Claude vs Codex Routing" summary in `~/.claude/CLAUDE.md` (the split table, tag format, and Runner announcements live there). This skill holds the revision rules, the rationale, and the runtime selection table.

## When to revise the runner tag mid-execution

Mid-execution switches happen only when the **work type changes**, not when the tool feels slow or when one runner is temporarily rate-limited. Legitimate switches:
- Tagged `codex-delegate` but the spec turned out ambiguous → escalate to `claude`, update the plan, then continue
- Tagged `claude` but the design phase is done and the remaining work is mechanical → hand off to `codex-delegate`
- Rate limit hit on one side → record in `docs/handoff/handoff.md` and resume on the other side only if the *work type* is appropriate for that runner

**Never switch runners mid-unit because credits ran out.** That's the symptom of bad routing at plan time. Fix the plan, don't paper over it.

## Why the Claude/Codex rule exists

Claude (Opus/Sonnet) is significantly more expensive per token than Codex. When Claude's strengths (judgement, design, ambiguity) aren't needed, using Claude for execution is waste. The 5-hour usage window that keeps forcing supervisor scripts is a downstream symptom — the upstream fix is routing the work correctly in the first place. Tagging plans and announcing the runner in every update makes mis-routing visible, which is the only way to stop doing it.

## Choosing a Runtime — Local Claude, Supervisor, Routines, /loop

The 5-hour usage window can hit during the day, not just at night. "Out of credits mid-task" is a frequent lived reality, not an edge case. Route work to the right runtime based on what kind of execution it needs, not on what time it is.

| Runtime | Where it runs | Good for | Not good for |
|---|---|---|---|
| **Local Claude Code** (interactive terminal) | Laptop, terminal open | Judgement, design, ambiguous debugging, planning | Anything the moment you hit the 5h window |
| **claude-supervisor** (tmux + fresh `--print` runs) | Laptop, tmux persists | Long-running plan execution on local repos; uncommitted state; overnight grind; daytime grind when the window hits mid-task | Scheduled triggers; webhook-driven work; work that needs to keep running when laptop is closed |
| **Anthropic Routines** ([docs](https://code.claude.com/docs/en/routines)) | Anthropic cloud | Cron-scheduled runs, GitHub-webhook-triggered runs, API-triggered runs; work that survives laptop close; 15 runs/day on Max | Work against uncommitted local state (Routines do a fresh clone); minute-level schedules (min interval is 1 hour) |
| **`/loop`** (inside an active Claude session) | Your current session | Polling during active work ("check the deploy every 5 min"); 1-minute minimum | Unattended runs (dies when session ends); scheduled work beyond the session |
| **Desktop scheduled tasks** (Claude Code desktop app) | Laptop, app open | Local cron while the desktop app is running; 1-minute minimum | Headless/scripted use; anything when the app is closed |

**Routing heuristics:**

- **Hit the 5-hour window mid-day on a local plan?** → kick it to the supervisor so it can auto-retry after the window resets. The daytime case is exactly the same shape as the overnight case; treat them the same.
- **Work that doesn't need local uncommitted state and fits in 15 runs/day?** → prefer a Routine. Zero local infra, survives laptop close, officially maintained by Anthropic.
- **GitHub-webhook-triggered work** (review on PR open, bump deps on release) → always a Routine, never a supervisor.
- **One-off scheduled task during an active session** (watch this deploy) → `/loop`.
- **Interactive judgement + design** → just Claude in the terminal; don't over-engineer.

**Why this matters:** building a supervisor doesn't fix the routing problem — it just papers over the symptom. If the same task keeps hitting the window, the upstream fix is either (a) routing the build portion to Codex per the Claude vs Codex Routing rule, or (b) moving scheduled/webhook parts of the work to Routines so they're not competing for the interactive window.
