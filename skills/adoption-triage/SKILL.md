---
title: Adoption Triage
scope: global
category: workflow
icon: &#9878;
description: Accept/reject/defer triage before adopting any recommendation set — insights reports, audits, best-practice lists — plus the CLAUDE.md growth brake that keeps global rules lean.
triggers:
  - adopt these recommendations
  - implement these suggestions
  - add these best practices
  - insights report
checks-label: Rules
checks:
  - Triage against current state before any plan — never a flat to-do list
  - The reject column must exist; empty means missed overlap
  - Present the triage first, then plan from accepted items only
  - Additions of >20 lines to CLAUDE.md require paired removals or a skill
version: 1.0
---


# Adoption Discipline (MANDATORY)

When I ask to adopt any recommendation set — `/insights` reports, audit outputs, third-party suggestions, "these best practices", anything that arrives as a list of things to add — **do not produce a flat to-do list**. Produce an explicit **accept / reject / defer** triage against current state first. The plan follows the triage, not the other way round.

## Pre-flight triage rule

For any "adopt X" / "add these" / "implement these recommendations" request:
1. Read the target files holistically (not grep for literal strings — semantic overlap is what matters).
2. Classify each recommendation as **accept**, **reject** (already covered, overlapping, or not worth the cost), or **defer** (valuable but out of scope).
3. **The reject column must exist.** If it's empty, re-check for overlap — it almost always means I missed existing coverage.
4. Present the triage before writing any plan. Only then build the plan from the accepted items.

Why: on 2026-04-21, I was asked to adopt seven `/insights` recommendations and built a plan to add all seven without checking overlap. Three were already covered by existing CLAUDE.md sections or always-active skills (`verification-before-completion`, Shipping Discipline, Compute Efficiency Defaults, Project Status Catch-Up). The user had to prompt me to pause and think. Triage-first prevents that class of failure.

## CLAUDE.md growth brake

`~/.claude/CLAUDE.md` is loaded into every conversation, every turn. Bloat has a real per-turn cost.

- Any proposal that would add **>20 lines** to `~/.claude/CLAUDE.md` requires a paired proposal for what to **remove** or **migrate to a skill**.
- Prefer skills over prose rules. If a behaviour only matters in specific contexts, a skill with triggers is cheaper than a prose rule loaded every turn. `verification-before-completion` and `tdd-first` are the reference pattern.
- Candidates to migrate out when the file grows: long procedural sections that read like a checklist are better as invokable skills than as always-loaded prose (Versioning Discipline, Shipping Discipline, and others were migrated to skills on 2026-07-13 under exactly this rule).
