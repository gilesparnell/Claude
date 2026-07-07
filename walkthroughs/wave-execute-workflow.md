---
title: "Wave Execute: Parallel Plan Execution"
description: "End-to-end walkthrough of the brainstorm → plan → wave-execute workflow for medium-to-large features"
category: workflow
tags: [ce-brainstorm, ce-plan, wave-execute, parallel, agents]
---

# Wave Execute Workflow

How to go from idea to shipped feature using the brainstorm → plan → wave-execute pipeline. This walkthrough uses a real-world example: adding a client portal to a SaaS application.

---

## When to Use This Workflow

| Task size | Recommended flow |
|---|---|
| Trivial (no plan needed) | Just do it directly |
| Small (1–4 tasks) | `ce-work` |
| **Medium–Large (5+ tasks)** | **`ce-brainstorm` → `ce-plan` → `/wave-execute`** |

Use this workflow when:
- The feature has 5+ distinct implementation tasks
- Some tasks are independent and could run in parallel
- You want to avoid context rot on longer builds
- You want clean, atomic commits per task

---

## The Example: Client Portal for a SaaS App

We want to add a client-facing portal where customers can view their invoices, download reports, and update their billing details.

---

## Step 1: Brainstorm (`ce-brainstorm`)

Start a conversation and describe what you want:

```
I want to add a client portal to the app. Customers should be able to
view invoices, download PDF reports, and update their billing details.
```

Claude will enter brainstorm mode and ask you questions **one at a time**:

```
What authentication do your customers currently use?
→ They log in with email/password via NextAuth

Where does invoice data live?
→ Stripe — we use it for all billing

Should the portal be a separate app or part of the existing dashboard?
→ Part of the existing Next.js app, under /portal

Do customers need to manage team members or just their own account?
→ Just their own account for now
```

After enough questions, Claude proposes 2–3 approaches with trade-offs and a recommendation. You pick one (or adjust), and Claude produces a **spec document**.

**Output:** A requirements doc saved to your project (e.g. `docs/specs/2026-03-30-client-portal-design.md`)

**Time:** 5–10 minutes of Q&A

---

## Step 2: Plan (`ce-plan`)

Once the spec is approved:

```
/ce-plan docs/specs/2026-03-30-client-portal-design.md
```

Or simply say "plan this" — Claude will pick up the spec from the brainstorm.

Claude produces a structured plan with numbered tasks, file paths, and dependencies:

```markdown
### Task 1: Database schema for portal access
**Files:**
- Create: prisma/migrations/xxx_add_portal_access.sql
- Modify: prisma/schema.prisma

### Task 2: Stripe invoice sync service
**Files:**
- Create: src/services/stripe-sync.ts
- Create: src/types/invoice.ts

### Task 3: Portal authentication middleware
**Files:**
- Create: src/middleware/portal-auth.ts
- Modify: src/middleware.ts

### Task 4: Invoice list API endpoint
**Files:**
- Create: src/app/api/portal/invoices/route.ts
**Depends on:** Task 1, Task 2

### Task 5: PDF report generation
**Files:**
- Create: src/services/pdf-report.ts
- Create: src/app/api/portal/reports/[id]/route.ts
**Depends on:** Task 2

### Task 6: Billing details API endpoint
**Files:**
- Create: src/app/api/portal/billing/route.ts
**Depends on:** Task 1, Task 3

### Task 7: Portal dashboard page
**Files:**
- Create: src/app/portal/page.tsx
- Create: src/app/portal/layout.tsx
**Depends on:** Task 3, Task 4

### Task 8: Invoice detail + PDF download page
**Files:**
- Create: src/app/portal/invoices/[id]/page.tsx
**Depends on:** Task 4, Task 5

### Task 9: Billing settings page
**Files:**
- Create: src/app/portal/billing/page.tsx
**Depends on:** Task 6

### Task 10: Integration tests
**Files:**
- Create: tests/portal/portal.test.ts
**Depends on:** Task 7, Task 8, Task 9
```

**Output:** A plan file (e.g. `docs/plans/2026-03-30-client-portal-plan.md`)

**Time:** 2–5 minutes

---

## Step 3: Wave Execute (`/wave-execute`)

Now the interesting part:

```
/wave-execute docs/plans/2026-03-30-client-portal-plan.md
```

Claude analyses the dependency graph and presents:

```
## Wave Execution Plan

**Source:** docs/plans/2026-03-30-client-portal-plan.md
**Total tasks:** 10 across 4 waves

| Wave | Tasks       | What it builds                           | Parallel? |
|------|-------------|------------------------------------------|-----------|
| 1    | 1, 2, 3     | Schema, Stripe sync, portal auth         | Yes (3)   |
| 2    | 4, 5, 6     | Invoice API, PDF reports, billing API    | Yes (3)   |
| 3    | 7, 8, 9     | Dashboard, invoice page, billing page    | Yes (3)   |
| 4    | 10          | Integration tests                        | Sequential|

Proceed? (yes / adjust / sequential)
```

**You say "yes"** and execution begins:

### Wave 1 (3 parallel agents)
- Agent A: Creates the database migration and updates the schema
- Agent B: Builds the Stripe invoice sync service
- Agent C: Creates the portal authentication middleware

Each agent works in an **isolated git worktree** with a **fresh context** — no accumulated context rot. Each commits its work atomically.

```
## Wave 1 Complete

| Task | Status | Commit | What it built                    |
|------|--------|--------|----------------------------------|
| 1    | Done   | a1b2c3 | Portal access schema + migration |
| 2    | Done   | d4e5f6 | Stripe invoice sync service      |
| 3    | Done   | g7h8i9 | Portal auth middleware           |
```

### Wave 2 (3 parallel agents)
Now that the schema, sync service, and auth exist, the API endpoints can be built:
- Agent D: Invoice list endpoint (uses schema from Task 1 + sync from Task 2)
- Agent E: PDF report generation (uses sync from Task 2)
- Agent F: Billing details endpoint (uses schema from Task 1 + auth from Task 3)

### Wave 3 (3 parallel agents)
With all APIs ready, the frontend pages can be built in parallel.

### Wave 4 (sequential)
Integration tests run last, covering all the pieces together.

### Final Report

```
## Wave Execution Complete

Total: 10 tasks across 4 waves
Passed: 10 | Failed: 0 | Skipped: 0

Commits:
- a1b2c3 feat: portal access schema + migration
- d4e5f6 feat: stripe invoice sync service
- g7h8i9 feat: portal auth middleware
- j1k2l3 feat: invoice list API endpoint
- m4n5o6 feat: PDF report generation
- p7q8r9 feat: billing details API endpoint
- s1t2u3 feat: portal dashboard page
- v4w5x6 feat: invoice detail + PDF download page
- y7z8a9 feat: billing settings page
- b1c2d3 test: portal integration tests
```

**Time:** Depends on task complexity, but waves run in parallel — so a 10-task plan that would take ~30 minutes sequentially might complete in ~15 minutes across 4 waves.

---

## What Happens If Something Fails

If an agent in Wave 2 fails (say the PDF service hits an issue):

```
Wave 2: Task 5 (PDF report generation) failed.
Error: puppeteer not found — dependency missing from package.json

Options:
1. Retry (fix and re-run just this task)
2. Skip (continue without it — dependent tasks may also fail)
3. Stop (investigate before continuing)
```

You choose. Waves 3 and 4 adapt accordingly.

---

## When NOT to Use Wave Execute

- **Bug fixes** — just fix it directly, no plan needed
- **Small features** (1–4 tasks) — `ce-work` is faster, no orchestration overhead
- **Highly sequential work** where every task depends on the previous — waves can't help
- **Exploratory work** where you don't know the tasks yet — brainstorm first

---

## Quick Reference

```
# Full workflow
ce-brainstorm → ce-plan → /wave-execute plan.md

# Skip brainstorm (you already know what to build)
ce-plan → /wave-execute plan.md

# Skip planning (you already have a plan)
/wave-execute path/to/any-plan.md

# Fall back to simple execution
ce-work (for small tasks)
```

---

## Your Active Skills During Wave Execute

Every agent spawned by `/wave-execute` inherits your global skills:

- **tdd-first** — tests written before implementation
- **systematic-debugging** — root-cause-first if anything breaks
- **verification-before-completion** — evidence before claiming done
- **security-review** — triggers if tasks touch auth/input/secrets
- **git-conventions** — clean atomic commits
- **code-quality** — enforced on every edit

The agents don't just execute tasks — they execute them to your standards.
