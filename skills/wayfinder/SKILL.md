---
title: Wayfinder
scope: global
category: workflow
icon: &#129517;
description: Plan work too big for one agent session as a shared map of investigation tickets on the issue tracker, resolved one per session until the way to the destination is clear.
triggers:
  - wayfinder
  - chart a map for
  - this is too big for one session
  - work through the map
checks-label: Principles
checks:
  - Plan, don't do — tickets resolve decisions, not deliverables
  - One ticket per session, claimed by assignment before any work
  - Fog of war — ticket only what you can phrase sharply; the rest stays in Not yet specified
  - Refer to tickets by name, never bare issue numbers
version: 1.1
---

# Wayfinder

Installed from [mattpocock/skills](https://github.com/mattpocock/skills) v1.1.0 (8 Jul 2026), unmodified. Part of the Wayfinder cluster: `grilling`, `domain-modeling`, `prototype`, `setup-matt-pocock-skills`.

A loose idea has arrived — too big for one agent session, and wrapped in fog: the way from here to the **destination** isn't visible yet. Wayfinding is about finding that way, not charging at the destination. This skill charts the way as a **shared map** on the repo's issue tracker, then works its tickets one at a time until the route is clear.

## The Map

A single issue labelled `wayfinder:map` — the canonical artefact. Its tickets are child issues. The map is an **index**, not a store: Destination, Notes, Decisions so far (one gist line per closed ticket), Not yet specified (in-scope fog too dim to ticket), Out of scope (consciously ruled out).

## Tickets

Child issues, each holding one question sized to a single agent session, labelled `wayfinder:<type>`:

- **Research** (AFK) — reading docs/APIs; produces a linked markdown summary
- **Prototype** (HITL) — cheap concrete artefact to react to, via /prototype
- **Grilling** (HITL) — conversation via /grilling and /domain-modelling; the default
- **Task** (HITL or AFK) — manual work that unblocks a decision (provisioning, data moves)

A session **claims** a ticket by assigning it before any work. Blocking uses the tracker's native dependency edges; the **frontier** is the open, unblocked, unclaimed children.

## Invocation

**Chart the map** (one session): name the destination via grilling, map the frontier breadth-first, create the map + specifiable tickets, wire blocking in a second pass, stop.

**Work through the map** (per session): load the low-res map, choose or take the next frontier ticket, claim it, resolve it with the skills the Notes name, post a resolution comment, close it, append to Decisions so far, graduate newly-sharp fog into tickets. **Never resolve more than one ticket per session.**

Full text lives in the runtime skill at `~/.claude/skills/wayfinder/SKILL.md`.
