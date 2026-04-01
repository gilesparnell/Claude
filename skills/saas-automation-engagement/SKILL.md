---
title: SaaS Automation Engagement
scope: project
category: engagement
icon: &#128196;
description: End-to-end playbook for new client automation engagements — from feasibility through discovery, architecture, technical spec, proposal, documentation, and Claude Code handoff.
triggers:
  - new client engagement
  - build a proposal
  - automation project
  - scope this work
  - new client project
  - client onboarding
checks-label: Phases
checks:
  - Feasibility and API check
  - Discovery and requirements (→ docs/requirements/)
  - Architecture and design (→ docs/design/)
  - Technical spec + SOW + Proposal
  - Build plan (→ docs/plans/ via ce:plan)
  - Project portal setup (→ docs/index.html)
  - Testing framework and Claude Code handoff
  - User guide scaffolding (→ docs/user-guide/)
version: 2.0
---

# SaaS Automation Engagement Playbook

End-to-end workflow for new client automation engagements. Every phase produces documentation that lives in the project's `docs/` folder per the project-docs-standard skill.

## Phase 1: Feasibility & API Check

Before committing to any engagement:
1. Identify the client's core systems (CRM, accounting, communication tools)
2. Check API availability and authentication methods
3. Assess integration complexity (REST, webhooks, OAuth, API keys)
4. Document any blockers or risks

**Output:** Go/no-go decision with rationale

## Phase 2: Discovery & Requirements

Deep dive into the client's current workflow:
1. Map the current manual process end-to-end
2. Identify automation candidates (repetitive, rule-based, high-volume)
3. Define success criteria with the client
4. Document edge cases and business rules

**Output:** `docs/requirements/YYYY-MM-DD-client-name-requirements.md`

## Phase 3: Architecture & Design

Design the technical solution:
1. System architecture diagram
2. Data flow mapping
3. Integration points and protocols
4. Error handling and retry strategy
5. Security and auth design

**Output:** `docs/design/client-name-architecture.md`

## Phase 4: Technical Spec + SOW + Proposal

Produce the client-facing documents:
1. Technical specification (internal)
2. Statement of Work (contractual)
3. Proposal with pricing tiers (Starter / Business / Professional)
4. Combine Proposal and SOW into one document — client signs once

**Output:** Word/PDF proposal document

## Phase 5: Build Plan

Create the implementation plan:
1. Run `ce:plan` for the engagement
2. Break into implementation waves
3. Define verification criteria per wave
4. Include documentation tasks in every wave

**Output:** `docs/plans/YYYY-MM-DD-NNN-client-name-plan.md`

## Phase 6: Project Portal & Docs Setup

Set up the project documentation structure:
1. Create `docs/` folder with all standard subdirectories
2. Build `docs/index.html` project portal (Deep Ocean Tech design)
3. Move all Phase 2-5 outputs into the correct docs/ locations
4. Add project card to hub portal (gilesparnell.github.io)

**Output:** Complete `docs/` structure per project-docs-standard

## Phase 7: Build & Handoff

Execute the plan with Claude Code:
1. Run `ce:work` on the build plan
2. Write tests first (TDD enforcement)
3. Update docs as features ship:
   - User guide for each UI feature
   - API docs for each endpoint
   - ADRs for each significant decision
4. Generate progress diagrams with plan-tracker

**Output:** Working system + complete documentation

## Phase 8: User Guide & Onboarding

Before handoff to client:
1. Write end-user guide covering all features
2. Document onboarding flow
3. Create admin/config guide if applicable
4. Update changelog

**Output:** `docs/user-guide/` with complete documentation

## Key Rules

- **Documentation is not optional.** Every phase produces docs that go into the standard structure.
- **No emoji in professional documents** except warning symbols for risks.
- **Three-tier pricing** works well: no-code, MVP with UI (recommended), full custom.
- **Combine Proposal and SOW** into one document.
- **Business rules must be written down.** The automation has no reflex.
- **Phase 2 modules scaffold in Phase 1.** Define interfaces early, swap stubs for real implementations later.
