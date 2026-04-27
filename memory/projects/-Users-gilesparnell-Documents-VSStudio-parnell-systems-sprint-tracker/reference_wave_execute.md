---
name: wave-execute-workflow
description: Parallel task execution workflow - brainstorm → plan → wave-execute with fresh agents per task
type: reference
---

Wave Execute is a parallel execution system invoked with `/wave-execute`. Full docs at:
https://gilesparnell.github.io/Claude/diagrams/wave-execute-workflow.html

Three phases: brainstorm (clarify requirements) → plan (numbered tasks with dependencies) → wave-execute (group into waves, spawn parallel agents).

Rules:
- Tasks within a wave run simultaneously with independent agent instances
- Each agent gets fresh context (prevents quality degradation)
- Waves execute sequentially (downstream awaits upstream)
- Trivial tasks: execute directly. 1-4 tasks: simpler flow. 5+ tasks: full wave-execute.
