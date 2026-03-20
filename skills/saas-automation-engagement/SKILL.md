---
name: saas-automation-engagement
description: >
  Use this skill whenever you are starting a new client automation engagement for a
  SaaS/SME client. Triggers include: new client discovery sessions, requests to build
  API integrations, CRM automation, workflow automation, or any project that requires
  a Technical Spec + Scope of Work + Proposal. This skill guides you through the full
  engagement lifecycle: feasibility → architecture → spec → testing framework →
  client-facing documents. Use when you receive meeting notes, a loom transcript, or a
  requirements doc from a new client and need to produce deliverables.
license: allconvos.ai internal — not for redistribution
version: 1.0
---

# Skill: SaaS Automation Client Engagement

## Overview

This skill covers the end-to-end process for scoping, specifying, and proposing a
custom automation integration for an SME client. It is designed to be reusable across
any client — not just FSCA. Replace client-specific names, APIs, and rules with the
new client's details.

---

## Phase 0: Feasibility Check

Before any documents are produced, answer these questions:

### API Feasibility Checklist
- [ ] Does the target platform have an official REST/GraphQL API?
- [ ] What authentication model does it use? (OAuth2, API key, session token)
- [ ] Which API scopes are needed for the automation? (read, write, webhooks)
- [ ] Are there rate limits that could affect a scheduled batch job?
- [ ] Can the automation run server-to-server (no browser/UI automation needed)?
- [ ] Is a test/sandbox environment available from the platform?

### Claude Code Feasibility
Claude Code can be used to build and run this automation if:
- The target platform has a documented REST API
- Authentication can be handled via environment variables (OAuth tokens, API keys)
- The automation is scheduled (cron) or event-driven (webhook), not UI-based
- All business logic is deterministic (no judgment calls required for standard cases)

If UI automation is required (no API), consider Playwright/Puppeteer — note that this
is more brittle and harder to maintain.

---

## Phase 1: Discovery → Requirements Extraction

When given meeting notes, a transcript, or a requirements doc, extract the following:

### Business Context Template
```
CLIENT: [name]
PLATFORM: [CRM / software they use]
MANUAL PROCESS: [what they currently do manually]
TRIGGER: [what starts the process — email, reminder, time, event]
VOLUME: [how many items per day/month]
BUSINESS RULES: [list every rule — timing, routing, classification, exceptions]
EDGE CASES: [what doesn't fit the normal rules]
OUT OF SCOPE (Phase 1): [what is explicitly deferred]
DEPENDENCIES: [what we need from the client before we can build]
```

### Questions to Always Ask the Client
1. "What are the 5 most common scenarios the automation will handle?"
2. "What are the cases where a human MUST be involved — the automation cannot decide?"
3. "What does success look like? How will you know it's working correctly?"
4. "Who in your team will be the go-to contact for testing sign-off?"
5. "Can you provide a test/sandbox environment separate from production?"
6. "Are your business rules fully documented, or held in someone's head?"

---

## Phase 2: Architecture Design

### Standard Architecture Pattern (Server-Side Automation)

```
TRIGGER (cron / webhook)
    → ENGINE (Node.js TypeScript)
        → CLASSIFIER (keyword/rule matching on incoming data)
        → RULE EVALUATOR (apply business rules from config.json)
        → API CLIENT (read/write to target platform)
        → AUDIT LOGGER (structured JSON, immutable)
        → REPORT GENERATOR (human-readable output)
        → ERROR HANDLER (per-item, non-blocking)
```

### Technology Stack (Default)
| Layer | Technology | Notes |
|-------|-----------|-------|
| Language | TypeScript (Node.js) | Type safety, great API ecosystem |
| HTTP Client | Axios | Retry logic, interceptors |
| Scheduler | AWS EventBridge / GitHub Actions cron | Platform-agnostic |
| Config | JSON file + env vars | Rules without code changes |
| Testing | Jest + nock | Unit + integration |
| Logging | Structured JSON | CloudWatch / file |
| Deployment | AWS Lambda / Vercel Edge | Serverless, low cost |

### Extensibility Principles
- ALL business rules go in `config.json`, not in code
- Keywords, queue/folder mappings, timing rules → all configurable
- Adding a new category/type = edit config, not code
- Adding a new region/location = edit config, not code
- New platform integrations → new API client module, same engine

---

## Phase 3: Technical Specification Structure

The technical spec must include ALL of the following sections:

1. **Purpose & Background** — what problem this solves, what the manual process is
2. **System Architecture** — deployment model, component diagram, high-level flow
3. **API Integration** — authentication, required scopes, key endpoints, base URLs
4. **Business Rules Engine** — classification logic, routing matrix, timing rules, exceptions
5. **Data Model & Configuration** — config.json schema, audit log schema
6. **Error Handling & Resilience** — per-scenario error behaviour, retry policy, idempotency
7. **Testing Framework** — test categories, fixture table (min 10 scenarios), report format
8. **Test Account Requirements** — what the client needs to set up for safe testing
9. **Extensibility Design** — how to add new types/regions without code changes
10. **Deliverables & Acceptance Criteria** — what done looks like, per deliverable

### Test Fixture Table (Always Include)
Every engagement must have a minimum of 10 test scenarios covering:
- Happy path for each major job/item type
- Each geographic region / routing destination
- Edge case: unknown type → flag, do not process
- Edge case: unknown location → flag, do not process
- Edge case: duplicate → skip (idempotency)
- Edge case: special keyword override (e.g. "book in")

---

## Phase 4: Scope of Work (Client-Facing)

The SOW is for the client — NO technical jargon. Write it as if explaining to a
smart non-technical business owner.

### SOW Sections
1. The Problem We Are Solving (in their language)
2. What We Will Build (feature callouts, plain English)
3. What Is Out of Scope (Phase 1 boundaries, clearly stated)
4. How We Will Prove It Works (testing approach, test account, sign-off)
5. What We Need From You (client dependencies, with WHO and WHEN)
6. Indicative Timeline (phases, durations)
7. Assumptions & Constraints

### SOW Writing Rules
- Use callout boxes for key features (plain text label + title + description — no emoji)
- Use tables for "What We Need From You" — always include WHO and WHEN columns
- Never use acronyms without spelling them out first
- Frame testing as a confidence mechanism, not a technical process
- Always end with a clear dependency on the client (they must act first)
- The only permitted emoji is ⚠️ for warnings and critical dependencies. No other
  emoji or emoticons anywhere in any document.

---

## Phase 5: Proposal (Pricing & Terms)

### Pricing Model
Use **fixed-price per phase** for SME clients. Hourly rates create anxiety.

#### Standard Day Rates (AUD, adjust to market)
- Senior developer / architect: $900/day
- Standard development: $900/day
- Project management: $600/day

#### Phase 1 Typical Breakdown (API Automation)
| Activity | Days | Cost |
|----------|------|------|
| Discovery & architecture | 2 | $1,800 |
| Core engine development | 4 | $3,600 |
| Rules config & unit testing | 2 | $1,800 |
| E2E test account run | 1 | $900 |
| Test report & client review | 1 | $900 |
| Deployment & handover | 1 | $900 |
| PM & comms | 0.7 | $600 |
| **TOTAL** | **~11.7** | **$10,500** |

Adjust complexity multiplier for:
- Simple (few rules, 1 platform): 0.7× — ~$7,500
- Standard (moderate rules, 1–2 platforms): 1.0× — ~$10,500
- Complex (many rules, 3+ platforms, AI classification): 1.5× — ~$15,000+

#### Payment Milestones
- 50% on signing (kick-off)
- 25% on test report sign-off
- 25% on go-live + handover

### Standard Terms Checklist
- [ ] IP transfers to client on final payment
- [ ] 30-day post-launch support included
- [ ] Confidentiality — data stays within agreed infrastructure
- [ ] Scope change process — any additions discussed and priced separately
- [ ] Liability limited to fees paid
- [ ] Governing law: NSW Australia
- [ ] Proposal valid for 30 days

### Ongoing Support Options (offer post go-live)
| Plan | Hours/month | Price/month |
|------|------------|-------------|
| Monitoring only | 0 | $200 |
| Monitoring + support | 2 | $450 |
| Retainer | 8 | $1,200 |

---

## Phase 6: Document Production

### Files to Produce Per Engagement
1. `[CLIENT]_Technical_Specification.docx` — for developer / Claude Code
2. `[CLIENT]_Scope_of_Work.docx` — for client (non-technical)
3. `[CLIENT]_Proposal.docx` — for client (pricing + terms + sign-off page)
4. `[CLIENT]_Test_Report.html` — generated after test run (use the test framework)

### Document Style Rules
- Brand colours: deep navy (#1E3A5F) for headings, mid blue (#2E86AB) for subheadings
- Font: Calibri throughout, 11pt body
- All tables: striped rows, navy header, full borders
- Headers and footers on every page
- Callout boxes for important information (shaded background, top border accent)
- Sign-off page in Proposal: two-column table, one per party
- NO emoticons or emoji anywhere in any document, with one exception: the warning
  symbol (⚠️) may be used in callout boxes to flag risks, warnings, or critical
  dependencies. No other emoji or emoticon is permitted anywhere in any document —
  not in headings, body text, table cells, or callout titles.

### Callout Box Labels (use these — emoji-free except where noted)
| Purpose | Label to use |
|---|---|
| Important note | NOTE: |
| Warning or risk | ⚠️  WARNING: |
| Action required | ACTION REQUIRED: |
| Recommendation | RECOMMENDED: |
| To be confirmed | TO BE CONFIRMED: |
| Key dependency | ⚠️  CRITICAL DEPENDENCY: |
| Phase 2 item | PHASE 2: |
| Trust / relationship | NOTE: |

---

## Phase 7: Claude Code Build Instructions

When handing off to Claude Code to implement, provide:

```markdown
# Build Instructions for Claude Code

## Context
[Brief description of what this automation does]

## Tech Stack
- TypeScript + Node.js
- Axios for HTTP
- Jest for testing
- AWS Lambda (or specify alternative)

## Config File
The file `config.json` contains all business rules. Do not hardcode any rules in
the engine. Read all keywords, queue mappings, and timing rules from config.

## Key Files to Create
- `src/engine.ts` — main orchestration loop
- `src/classifier.ts` — job type and location detection
- `src/ruleEngine.ts` — applies business rules from config
- `src/apiClient.ts` — all calls to [platform] API
- `src/auditLogger.ts` — structured JSON logging
- `src/reportGenerator.ts` — HTML test report
- `config.json` — all externalisable business rules
- `tests/` — Jest test suite with fixtures

## Business Rules
[Paste the full rules from the technical spec here]

## Test Fixtures
[Paste the fixture table from the technical spec here]

## API Reference
[Paste the endpoint table from the technical spec here]

## Acceptance Criteria
[Paste the deliverables table from the technical spec here]
```

---

## Common Pitfalls to Avoid

1. **Starting code before rules are fully documented** — always get written business
   rules from the client before building. "No reflex" principle: automation cannot
   infer context.

2. **Building directly on production** — always insist on a test account/environment.

3. **Hardcoding business rules** — every rule must be in config.json. Clients change
   their minds; code changes are expensive, config changes are cheap.

4. **Silent failures** — every item that cannot be processed must be logged and
   surfaced. Never silently swallow errors.

5. **Over-promising Phase 1** — scope tightly. Better to deliver Phase 1 fast and
   earn Phase 2 than to over-scope and under-deliver.

6. **UI automation instead of API** — always check if an official API exists before
   building Playwright/browser automation. API-based solutions are 10× more resilient.

7. **Not getting sign-off on test results** — the test report is the client's
   confidence mechanism. Never go live without explicit sign-off.

---

## Reuse Checklist for New Engagements

- [ ] Run Phase 0 feasibility check
- [ ] Fill in Business Context Template
- [ ] Identify all business rules (ask the five discovery questions)
- [ ] Map architecture to Standard Architecture Pattern above
- [ ] Produce Technical Spec using the 10-section structure
- [ ] Produce SOW using the 7-section structure (no jargon)
- [ ] Produce Proposal using pricing model + standard terms
- [ ] Create minimum 10 test fixtures
- [ ] Confirm test environment exists before starting build
- [ ] Provide Claude Code build instructions with full context
