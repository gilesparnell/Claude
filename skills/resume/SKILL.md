---
title: /resume
scope: global
category: workflow
icon: ⏮
description: Load plans, handoff log, git log, and open PRs before continuing work. Summarise in three bullets, then ask which thread to pull. Prevents speculative continuation.
triggers:
  - continue
  - resume
  - where were we
  - catch me up
  - what's the latest
checks-label: Steps
checks:
  - Read most recent plan + docs/handoff/handoff.md top entry
  - Check git log + gh pr list for in-flight work
  - Summarise in three bullets — plan, in-flight, next
  - Ask user to pick a thread; never start work speculatively
version: 1.0
---
