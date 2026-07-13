---
title: Setup Matt Pocock Skills
scope: global
category: tooling
icon: &#128295;
description: One-time per-repo configuration for the Wayfinder cluster — records which issue tracker the repo uses (GitHub/GitLab/local markdown) and where domain docs live, in docs/agents/*.md.
triggers:
  - setup matt pocock skills
  - configure wayfinder for this repo
  - set up the issue tracker config
checks-label: Steps
checks:
  - Explore the repo first (remote, CLAUDE.md, existing docs/agents/)
  - One section, one answer — lead with the recommended choice
  - Records choices in docs/agents/issue-tracker.md and domain.md
  - Edits the existing CLAUDE.md/AGENTS.md; never creates a duplicate
version: 1.1
---

# Setup Matt Pocock Skills

Installed from [mattpocock/skills](https://github.com/mattpocock/skills) v1.1.0, unmodified. Configuration wizard for the Wayfinder cluster — run once per repo before first use of `wayfinder`.

Scaffolds the per-repo configuration the engineering skills assume: **issue tracker** (GitHub via `gh` by default; GitLab and local-markdown supported — seed templates ship with the runtime skill), **triage labels** (skipped here — the `triage` skill is not installed), and **domain docs** layout (single-context `CONTEXT.md` + `docs/adr/` for almost every repo).

Choices are recorded in `docs/agents/issue-tracker.md` and `docs/agents/domain.md`, with a pointer block added to the repo's existing `CLAUDE.md`. Prompt-driven: explore, present findings, confirm, then write.

Full text at `~/.claude/skills/setup-matt-pocock-skills/SKILL.md`.
