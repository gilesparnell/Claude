---
title: Monitor Recipes
scope: global
category: tooling
icon: &#128225;
description: Standard Monitor-tool recipes and rules — watch dev servers, deploys, and CI with event-driven monitors instead of polling, and compound what fires into promoted recipes.
triggers:
  - dev server start
  - watch this deploy
  - CI watcher
  - tail logs
  - set up a monitor
checks-label: Rules
checks:
  - Monitors over polling — free when silent, wake on matched events
  - Always pipe stderr with 2>&1 into the grep filter
  - Bounded tasks get timeout_ms, not persistent true
  - Log monitor outcomes to .learnings/monitors/ and promote weekly
version: 1.0
---


# Background Monitoring (Monitor tool)

Prefer the native Monitor tool over polling, `/loop`, or re-running `run_in_background` checks. Monitors are free when silent — only wake on matched events.

## When to start a monitor automatically

Start a persistent monitor without asking whenever I:
- Run a dev server (LiveKit agent, Next.js, Supabase local, etc.)
- Kick off a deploy to Vercel or a long build
- Open a PR and want status tracking
- Tail logs for a service I'm actively debugging

For bounded tasks (test runs, single deploys), use `timeout_ms` instead of `persistent: true` so the watcher auto-kills.

## Standard monitor recipes (global defaults)

**Dev server (persistent, wake on errors only)**
- Command: `<dev command> 2>&1 | grep -iE 'error|warn|exception|trace|disconnect|ECONN'`
- `persistent: true`
- Always pipe stderr with `2>&1` — stderr alone does not trigger events.

**Vercel deploy watcher (bounded)**
- Command: `vercel logs <url> --follow 2>&1 | grep -iE 'error|failed|5[0-9]{2}'`
- `timeout_ms`: 600000 (10 min, adjust to deploy length)

**PR / CI watcher (persistent)**
- Command: `while true; do gh pr status --json state,statusCheckRollup 2>&1 | grep -iE 'FAILURE|ERROR'; sleep 60; done`
- `persistent: true`

## Monitor rules

1. Never poll with repeated prompts when a Monitor can do the job.
2. Batch filter patterns with `grep -iE` — multi-line events within 200ms auto-group into one notification.
3. Name monitors descriptively (`livekit-dev`, `vercel-sprints-deploy`) so I can see what's running.
4. When a monitor fires, investigate the event first, then decide whether to keep the monitor running or tear it down.
5. Don't start overlapping monitors on the same command — check existing monitors before launching a new one.
6. If a filter is too noisy (firing on warnings I don't care about), tighten the regex rather than ignoring notifications.

## Monitor learnings

When a monitor fires and I investigate the event, log the outcome to `.learnings/monitors/` using the template. Takes 30 seconds and compounds.

## Monitor learnings → CLAUDE.md promotion

Weekly (or on-demand), scan `.learnings/monitors/*.md` and:

1. Group entries by `monitor_name`.
2. For each monitor, compute:
   - signal ratio = true_positive / (true_positive + false_positive + noise)
   - false_negative count
3. Flag for promotion:
   - Monitors with signal ratio < 0.5 over 5+ entries → filter is too loose, promote the tightened regex from the entries.
   - Monitors with any false_negative → promote the missing pattern into the standard recipe in this skill.
   - Monitors with signal ratio > 0.8 over 5+ entries → promote as a canonical recipe (mark the entries `promoted: true`).
4. When promoting, update the relevant recipe in this skill and append a one-line changelog at the bottom.
5. Never delete learnings entries — just flip `promoted: true`.
