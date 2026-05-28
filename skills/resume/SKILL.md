---
name: resume
description: Load context before resuming work — read recent plans, handoff log, git log, and open PRs, summarise in three bullets, then ask the user which thread to pull. Triggers on 'continue', 'resume', 'where were we', 'catch me up', 'what's the latest', 'what were we doing'. Use at the start of any session with no clear goal stated. Do NOT start implementation work before the user confirms a thread.
---

# /resume — Load context before resuming work

This skill turns "continue prior work" from a speculative void into a specific thread pickup. It is the automation of the Project Status Catch-Up rule in the global CLAUDE.md.

## Runner announcement

Before step 1, state: `Runner: Claude — /resume context load`. The work the user picks *after* the summary may be delegated to Codex per the routing rules, but the summary step itself is a judgement call that stays with Claude.

## Procedure

1. **Find recent plans.** Glob for `**/plan*`, `**/plans/**`, `**/roadmap*`. Read the most recent one to understand scope, phases, and current workstream. If the file matches the per-project docs convention (`docs/plans/YYYY-MM-DD-NNN-*-plan.md`), prefer the highest-numbered most-recent entry.

2. **Check the handoff log.** If `docs/handoff/handoff.md` exists, read the top entry. The Plan Execution Continuity rule requires newest-first ordering, so the top entry is the most recent resumable state. Note the date — if it's stale (>2 weeks), flag it rather than treating it as load-bearing.

3. **Check the decisions log.** If `docs/decisions/decisions.md` exists, skim the top few entries for recent technical calls that might shape the next step.

4. **Git context.** Run `git log --oneline -20` to see recent commits. If the repo has a remote, also run `gh pr list --state all --limit 10` to see open and recent PRs.

5. **Summarise in three bullets:**
   - **What plan is active** — name the plan file, its current phase, and the active workstream.
   - **What was in flight** — the last thing that landed or was in progress, per the handoff log + git log.
   - **What looks ready to pick up** — the most likely next step, framed as a concrete thread (e.g. "Unit 4 of the beta-plan is tagged codex-delegate and ready to execute").

6. **Ask the user to pick a thread.** Use the platform's blocking question tool when available. Example question: "Which of these should I continue, or describe a new goal?"

7. **Do not start work** until the user confirms. Speculative continuation is the failure mode this skill exists to prevent.

## Fallbacks

- **No `plans/` directory:** proceed with steps 2–6 using whatever is available; flag the absence and suggest creating a plan if the next step is non-trivial.
- **No `docs/handoff/handoff.md`:** rely on git log + PR list. Flag the absence and suggest creating the file per Plan Execution Continuity if the project is active.
- **No git remote:** skip the PR list step; git log alone is fine.
- **Empty state (new repo, no commits, no plans, no handoff):** report that explicitly — "this appears to be a fresh repo, nothing to resume" — and ask what the goal is.

## Rules

- Never infer work to do from thin signals. "There's an open PR" is not "continue that PR" — surface it, let the user decide.
- Never start implementation inside step 5. The summary is read-only; implementation waits for the user's reply in step 6.
- Keep the summary to three bullets. Longer summaries are a sign the skill is doing too much.
- The Runner announcement in step 0 is for the summary phase. When the user picks a thread, re-evaluate the runner per the Claude-vs-Codex routing rules.

## Why this skill exists

Four recent sessions started with "continue" and Claude had no context, leading to speculative work and user exits. Automating the catch-up procedure with a stop-and-ask gate at the end reclaims those sessions.
