---
title: "Claude Loops Explained: When to Build One, and Where They Actually Fit"
description: "What a loop is, the four-question test for whether you need one, and concrete examples from real projects"
category: claude
tags: [loop, ScheduleWakeup, CronCreate, hooks, sub-agents, verification]
---

# Claude Loops Explained

A prompt gives you one answer and waits. A loop is a goal Claude keeps working toward — plan, do the work, check the result against a real gate, fix the weakest point, repeat — until the goal is met or a stop condition fires. This walkthrough covers what actually makes something a loop (not just "running it more than once"), the test for whether a task deserves one, and where loops fit in this workspace today.

---

## The Five Parts of a Real Loop

```text
DISCOVER  →  work out what needs doing
PLAN      →  decide how to do it
EXECUTE   →  do the work
VERIFY    →  check it against the goal
ITERATE   →  not there yet? feed the result back in and repeat
```

Three parts are where people get it wrong:

- **Verify is the whole point.** Without a real check — a test suite, a type check, a lint pass, a build — you don't have a loop, you have Claude agreeing with itself on repeat. The model that did the work is a bad judge of its own work; see [Sub-Agents](#sub-agents-keep-the-maker-away-from-the-checker) below.
- **State is what makes it learn.** Each pass needs to remember what already failed, or it repeats the same mistake. `docs/handoff/handoff.md` (see the global CLAUDE.md "Plan Execution Continuity" rule) is exactly this — a record a fresh session or loop iteration reads before continuing.
- **A stop condition keeps it sane.** Every real loop needs two exits: success, and a hard limit ("after 8 iterations, stop and report"). Skip this and it runs all night for nothing.

---

## The Four-Question Test

Don't build a loop unless **all four** are true. Miss one, keep it a manual prompt or a one-off `/ce-work` task.

| # | Question | Why it matters |
|---|---|---|
| 1 | Does the task repeat at least weekly? | Less than that, the setup cost never pays back |
| 2 | Can something automatically reject bad output? | A test, type check, build, or lint — not "does this look right to me" |
| 3 | Can the agent do the work end-to-end? | If it hands half the job back to a human, it's not a loop |
| 4 | Is "done" objective? | If quality is a judgement call, a human still wins |

Most tasks fail #2 or #4. Content review, visual/UI polish, strategy docs, marketing copy — all judgement-heavy, all bad loop candidates. **Code with a real test suite is the easiest thing to verify**, which is why loops took off there first.

---

## The Building Blocks — Mapped to What You Already Have

| Block | Role | Your tool |
|---|---|---|
| **The automation** (heartbeat) | Triggers the loop on a cadence, not a one-off | `/loop` (in-session, 1-min minimum, dies with the session) · `ScheduleWakeup` (self-paced, dynamic) · `CronCreate` / Routines (cloud, cron or webhook, survives laptop close) · hooks (fire on lifecycle events) |
| **The skill** | Reusable instructions the loop reads every run | Any file in `~/.claude/skills/` or `.claude/skills/` — write once, call by name |
| **Sub-agents** | Separate the maker from the checker | The `Agent` tool — spawn a reviewer with different instructions (or a stronger model) than the one that wrote the code |
| **Connectors** | Act, don't suggest | `gh`, MCP servers, `Bash` — what lets a loop open the PR instead of describing it |
| **The verifier** | The gate that rejects bad work | Your actual test/lint/build command — this is the one block that decides if the loop helps or just spends tokens |

You already have a runtime-selection table for the automation layer in your global CLAUDE.md ("Choosing a Runtime") — this walkthrough doesn't replace that, it explains *why* you'd reach for any of those rows in the first place.

### Sub-Agents: Keep the Maker Away from the Checker

The single most useful structural trick. The model that wrote the code is too generous grading its own homework. A second agent — different instructions, sometimes a stronger model — catches what the first one talked itself into. In this workspace that's the difference between letting the same session `git commit` after writing code, versus spawning `compound-engineering:review:code-simplicity-reviewer` or `code-review` as a genuinely separate pass.

---

## The Cost, and Why Most Loops Should Stay Manual

Loops run on tokens, and the cost compounds, not adds. Every iteration re-reads the full context — goal, code, last result, what failed — and that context grows each pass. A loop that runs ten times doesn't cost ten prompts; it costs ten prompts that each get bigger. Add a separate checker agent and you've doubled the read cost for the quality gain.

The metric that matters: **cost per accepted change**, not tokens spent or iterations run. If you toss 6 of 10 loop outputs, you're doing the review work the loop was supposed to save you. Below a 50% accept rate, it's costing more than it gives back.

This is exactly the substance behind your existing **Compute Efficiency Defaults** rule (global CLAUDE.md) — "challenge expensive skills before launching," "delegate volume to Codex." A loop with no real gate doesn't crash, it bills you in silence.

**The build order that actually survives:**

```text
1. Get ONE manual run reliable first.
2. Turn that into a skill (save the instructions).
3. Wrap the skill in a loop (add the gate + stop condition).
4. THEN put it on a schedule.
```

Skipping ahead — scheduling something you haven't proven reliable by hand — is how loops fail while you're not watching.

---

## Concrete Examples From a Real Workspace

Surveyed against the four-question test. Most projects in a typical workspace are **not** good loop candidates right now — that's a normal, correct outcome, not a gap to fill.

### 1. `platform-app` — genuine 4/4 candidate

Has Jest (unit + integration), ESLint, Prisma, and real GitHub Actions CI. This is the one project in the workspace with an actual automated gate already wired up.

**Loop spec:**
```text
GOAL: every test in the CI-gated suite passes, lint is clean, no type errors.

EACH ITERATION:
  1. pull latest CI failure (or run the suite locally)
  2. pick the single highest-impact failure
  3. write the smallest change that fixes it
  4. re-run tests, lint, and type checker

VERIFY: green CI + zero lint warnings
STOP WHEN: verify passes, OR 8 iterations reached
ON STOP: summarize what changed and what still fails
```
**Runtime:** since CI is already the gate, a GitHub-webhook-triggered **Routine** is the right automation layer here (per your runtime table — "GitHub-webhook-triggered work → always a Routine, never a supervisor"). Fires on PR open or push, not on a schedule.

### 2. `tracker-app` and `builder-app` — 3.5/4, needs a hook first

Both have real test suites (Vitest for one; `node --test` + `vitest` for the other) but **no CI workflow**. The verifier exists locally, it's just not wired to a gate yet.

**What's missing before this is a loop:** a pre-push hook or a scheduled `npm test && npm run test:ts` run. Building the loop before the gate exists is exactly the "skip step 4" failure mode above.

**Once wired:** a nightly `CronCreate` routine ("keep build/tests green") is a reasonable fit — infrequent enough that a Routine's 1-hour minimum interval isn't a constraint, and it doesn't need local uncommitted state.

### 3. Everything else — correctly NOT a loop candidate

Marketing sites, content-driven apps, and most client sites: either no CI, trivial/stub test scripts, judgement-heavy work (visual polish, marketing copy, go-to-market strategy), or low-recurrence. Forcing a loop onto these fails question #2 or #4 — the honest move is to keep using `ce-work` / manual prompts, not manufacture a fake verifier just to justify automation.

---

## The Manual Version (No Coding Agent Required)

You can feel how a loop works in a single Claude chat, no scheduling involved:

```text
You will work in a loop until the task meets the bar.

TASK: [describe exactly what you want produced]

SUCCESS CRITERIA (be strict, no soft passes):
- [criterion 1]
- [criterion 2]
- [criterion 3]

LOOP PROTOCOL, repeat every turn:
1. PLAN   - state the single next step.
2. DO     - produce or improve the work.
3. VERIFY - score the result 1-10 on each criterion, brutally honest.
4. DECIDE - if every criterion is 8+, print "FINAL" and stop.
            Otherwise print "ITERATING" and fix the weakest point first.

RULES:
- Never call it done until every criterion is 8 or higher.
- Do not ask questions. Make a sensible assumption, note it, keep going.
```

This has DISCOVER/PLAN/EXECUTE/VERIFY/ITERATE, but no automation layer — you're still the trigger. It becomes a real loop the moment you wrap it in `/loop`, a hook, or a Routine.

---

## Quick Reference

```text
Repeats weekly + has a real gate + agent can finish it + "done" is objective
  → build the loop (skill → gate → schedule, in that order)

Missing the gate (tests exist, no CI)
  → wire a hook or scheduled check FIRST, loop comes after

Judgment-heavy, low-recurrence, or no automatic verifier
  → keep it manual. This is most tasks. Don't force it.
```
