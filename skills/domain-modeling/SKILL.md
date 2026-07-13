---
title: Domain Modelling
scope: global
category: code
icon: &#128218;
description: Actively build and sharpen a project's domain model — challenge fuzzy terms, stress-test with edge-case scenarios, and write the glossary (CONTEXT.md) and ADRs the moment they crystallise.
triggers:
  - pin down the terminology
  - domain model
  - ubiquitous language
  - record an architectural decision
checks-label: Rules
checks:
  - Challenge terms that conflict with the CONTEXT.md glossary immediately
  - Update CONTEXT.md inline as terms resolve — never batch
  - CONTEXT.md is a glossary only, devoid of implementation detail
  - ADRs only when hard-to-reverse AND surprising AND a real trade-off
version: 1.1
---

# Domain Modelling

Installed from [mattpocock/skills](https://github.com/mattpocock/skills) v1.1.0, unmodified. Part of the Wayfinder cluster. Supporting formats ship with the runtime skill: `CONTEXT-FORMAT.md`, `ADR-FORMAT.md`.

Actively build and sharpen the project's domain model while designing: challenge terms against the existing glossary, propose precise canonical terms for vague ones, stress-test relationships with concrete edge-case scenarios, and cross-reference claims against the code — surfacing contradictions.

`CONTEXT.md` lives at the repo root (or per-context in monorepos via `CONTEXT-MAP.md`), created lazily when the first term resolves. ADRs go to `docs/adr/` and are offered sparingly: only when the decision is hard to reverse, surprising without context, and the result of a real trade-off.

Full text at `~/.claude/skills/domain-modeling/SKILL.md`.
