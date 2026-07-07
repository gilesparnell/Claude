---
name: e2e-feature-test
title: End-to-End Feature Test
scope: global
category: code
icon: 🧪
description: Full end-to-end feature testing — generates an exhaustive test matrix, drives the browser UI via agent-browser, verifies backend state (database, API responses), and produces a pass/fail report. Use after building a feature with both frontend and backend components. Triggers on 'test this feature end to end', 'e2e test', 'full feature test', 'usability test this', 'test the whole feature', 'browser and backend test'.
triggers:
  - e2e test
  - end to end test
  - full feature test
  - usability test
  - test the whole feature
  - browser and backend test
argument-hint: "[feature description or 'current' to auto-detect from recent changes]"
allowed-tools: Bash(npx agent-browser:*), Bash(agent-browser:*)
checks-label: Rules
checks:
  - Never claim a test passes without screenshot or command output evidence
  - Always verify backend state after frontend actions (database, API, logs)
  - Re-snapshot after every navigation or DOM mutation
  - Test both happy path AND failure/edge cases
  - Close the browser session when done
version: 1.0
---

# End-to-End Feature Test

Full-stack feature testing that drives the browser UI and verifies backend state in a single workflow.

## Use `agent-browser` Only For Browser Automation

This workflow uses the `agent-browser` CLI exclusively. Do not use any alternative browser automation system, browser MCP integration, or built-in browser-control tool.

## Prerequisites

- **TDD-first skill has been applied** — all unit, integration, and system tests must already be written and passing before running this skill. This skill is the post-build acceptance gate, NOT a substitute for TDD. If TDD hasn't been done, stop and do it first.
- Local development server running (e.g., `bin/dev`, `rails server`, `npm run dev`)
- `agent-browser` CLI installed
- Database accessible for backend verification (e.g., `psql`, `rails console`, `sqlite3`, or API endpoints)

## Relationship to TDD-First

```
Development:   /tdd-first  →  Write tests → RED → Implement → GREEN → Full suite
Acceptance:    /e2e-feature-test  →  Drive real browser → Verify UI + backend → Report
```

TDD ensures the code is correct via automated test suites. This skill ensures the **running application** behaves correctly from a real user's perspective — filling actual forms, clicking actual buttons, checking actual database records. Both are required. Neither replaces the other.

## Workflow

### Phase 1: Setup & Discovery

#### 1.1 Verify agent-browser

```bash
command -v agent-browser >/dev/null 2>&1 && echo "Ready" || (echo "Installing..." && npm install -g agent-browser && agent-browser install)
```

If installation fails, inform the user and stop.

#### 1.2 Ask Browser Mode

Ask the user:

```
How do you want to run the tests?

1. Headed (watch) — Opens visible browser so you can see tests run
2. Headless (faster) — Runs in background, faster but invisible
```

Store the choice. Use `--headed` flag when option 1 is selected.

#### 1.3 Determine Feature Scope

**If feature description provided:** Use it to identify the components under test.

**If 'current' or empty:** Auto-detect from recent changes:

```bash
git diff --name-only main...HEAD
```

Read the changed files to understand what the feature does. Identify:
- **Frontend routes/pages** affected
- **Backend endpoints/controllers** involved
- **Database tables/models** touched
- **Business logic/validations** that should be enforced

#### 1.4 Detect Dev Server Port

Use this priority:
1. Explicit `--port` argument from user
2. `AGENTS.md` / `CLAUDE.md` port references
3. `package.json` dev/start scripts
4. `.env` / `.env.local` / `.env.development` files
5. Default: `3000`

#### 1.5 Verify Server is Running

```bash
agent-browser open http://localhost:${PORT}
agent-browser wait --load networkidle
agent-browser snapshot -i
```

If server is not running, tell the user to start it and re-run.

### Phase 2: Test Matrix Generation

This is the core differentiator. Before running any tests, generate a comprehensive test matrix.

#### 2.1 Analyse the Feature

Read all relevant source files (views, controllers, models, migrations, API routes, frontend components) to understand:
- Every user-facing interaction (forms, buttons, links, toggles)
- Every validation rule (required fields, format checks, uniqueness)
- Every state transition (create, update, delete, status changes)
- Every error condition (invalid input, permission denied, not found)
- Every backend side-effect (database writes, emails, external API calls)

#### 2.2 Build the Test Matrix

Categorise tests into these groups:

| Category | What to Test |
|----------|-------------|
| **Happy Path** | Normal successful flow from start to finish |
| **Input Validation** | Required fields, format validation, length limits, type checks |
| **Edge Cases** | Empty inputs, boundary values, special characters, very long strings |
| **Error Handling** | Invalid submissions, server errors, network issues |
| **State Verification** | Database records created/updated/deleted correctly |
| **UI Feedback** | Success messages, error messages, loading states, redirects |
| **Permissions** | Access control (if applicable) — logged in vs out, roles |
| **Idempotency** | Double-submit, back button, refresh after submit |
| **Responsive** | Mobile viewport if the feature has responsive behaviour |

Present the test matrix to the user before running:

```markdown
## Test Matrix for [Feature Name]

### Happy Path (N tests)
- [ ] HP-1: [description]
- [ ] HP-2: [description]

### Input Validation (N tests)
- [ ] IV-1: [description]
- [ ] IV-2: [description]

### Edge Cases (N tests)
- [ ] EC-1: [description]

### Error Handling (N tests)
- [ ] EH-1: [description]

### Backend State (N tests)
- [ ] BS-1: [description]

### UI Feedback (N tests)
- [ ] UF-1: [description]

Total: N tests

Proceed with all tests? Or select specific categories?
```

Wait for user confirmation. They may choose to run all, select categories, or adjust the matrix.

### Phase 3: Execute Tests

Run each test case following this pattern:

#### 3.1 Per-Test Workflow

For each test case:

**Step 1 — Setup:** Reset to a known state if needed (navigate to starting page, clear forms).

```bash
agent-browser open "http://localhost:${PORT}/[route]"
agent-browser wait --load networkidle
agent-browser snapshot -i
```

**Step 2 — Capture pre-state (backend):** Before the action, capture the current backend state for comparison.

```bash
# Examples — adapt to the project's stack:
# Rails:
rails runner "puts User.count"
# SQL:
psql -d mydb -c "SELECT count(*) FROM users;"
# API:
curl -s http://localhost:${PORT}/api/users | jq '.length'
# SQLite:
sqlite3 db/development.sqlite3 "SELECT count(*) FROM users;"
```

**Step 3 — Perform frontend action:** Use agent-browser to interact with the UI exactly as a user would.

```bash
agent-browser fill @e1 "test value"
agent-browser click @e3
agent-browser wait --load networkidle
agent-browser snapshot -i
```

**Step 4 — Verify frontend result:** Check the UI shows the expected outcome.

```bash
agent-browser snapshot -i          # Check for success/error messages
agent-browser screenshot test-name.png  # Visual evidence
agent-browser get url              # Verify redirect happened
```

**Step 5 — Verify backend state:** Confirm the backend reflects the action.

```bash
# Check database was updated
rails runner "puts User.last.to_json"
# Check API returns new data
curl -s http://localhost:${PORT}/api/users/latest | jq '.'
# Check logs for expected entries
tail -20 log/development.log
```

**Step 6 — Record result:**

```
[PASS] HP-1: Create new user with valid data
  Frontend: Success message displayed, redirected to /users/5
  Backend: User record created (id=5, name="Test User", email="test@example.com")
  Screenshot: hp-1-create-user.png
```

or

```
[FAIL] IV-2: Submit form with invalid email
  Expected: Validation error on email field
  Actual: Form submitted successfully — no validation!
  Frontend: Redirected to /users/6 (should not have)
  Backend: User created with invalid email "notanemail"
  Screenshot: iv-2-invalid-email-FAIL.png
```

#### 3.2 Headed Mode

When running headed, prefix browser commands with `--headed`:

```bash
agent-browser --headed open "http://localhost:${PORT}/[route]"
agent-browser --headed snapshot -i
agent-browser --headed click @e1
```

#### 3.3 Backend Verification Strategies

Adapt to the project's stack. Detect the stack from project files:

| Stack | How to verify backend |
|-------|----------------------|
| **Rails** | `rails runner`, `rails console`, read `log/development.log` |
| **Django** | `python manage.py shell -c`, check Django logs |
| **Node/Express** | `curl` API endpoints, check stdout/logs |
| **Next.js** | `curl` API routes, check `.next` server logs |
| **Laravel** | `php artisan tinker --execute`, check `storage/logs` |
| **SQLite** | `sqlite3 <db-path> "<SQL>"` |
| **PostgreSQL** | `psql -d <db> -c "<SQL>"` |
| **MySQL** | `mysql -e "<SQL>" <db>` |
| **MongoDB** | `mongosh --eval "<JS>"` |

### Phase 4: Failure Handling

When a test fails:

1. **Capture evidence:**
   ```bash
   agent-browser screenshot FAIL-test-id.png
   agent-browser snapshot -i  # Capture DOM state
   ```

2. **Ask the user:**

   ```
   Test Failed: [test-id] — [description]

   Issue: [what went wrong]
   Evidence: [screenshot path, backend state]

   How to proceed?
   1. Fix now — I'll debug and fix, then re-run this test
   2. Log and continue — Record failure, move to next test
   3. Stop — End testing here
   ```

3. **If "Fix now":** Investigate the root cause, propose a fix, apply it, re-run the specific failing test. If it passes, continue with remaining tests.

4. **If "Log and continue":** Record the failure with full details, continue testing.

5. **If "Stop":** Proceed to the summary with tests completed so far.

### Phase 5: Cleanup

Always close the browser session:

```bash
agent-browser close
```

### Phase 6: Test Report

Present a comprehensive report:

```markdown
## E2E Feature Test Report

**Feature:** [name/description]
**Server:** http://localhost:${PORT}
**Date:** [timestamp]
**Mode:** Headed / Headless

### Summary

| Category | Passed | Failed | Skipped | Total |
|----------|--------|--------|---------|-------|
| Happy Path | 3 | 0 | 0 | 3 |
| Input Validation | 4 | 1 | 0 | 5 |
| Edge Cases | 2 | 0 | 1 | 3 |
| Error Handling | 2 | 0 | 0 | 2 |
| Backend State | 3 | 0 | 0 | 3 |
| UI Feedback | 2 | 1 | 0 | 3 |
| **Total** | **16** | **2** | **1** | **19** |

### Failures

#### [FAIL] IV-2: Submit form with invalid email
- **Expected:** Validation error displayed
- **Actual:** Form submitted, invalid record created
- **Root Cause:** Missing email format validation on User model
- **Evidence:** FAIL-iv-2.png
- **Backend:** User(id=6) created with email="notanemail"

#### [FAIL] UF-3: Error message styling on failed save
- **Expected:** Red error banner with message
- **Actual:** Raw error text without styling
- **Evidence:** FAIL-uf-3.png

### Skipped

#### [SKIP] EC-3: Unicode emoji in name field
- **Reason:** Requires database UTF-8mb4 config verification

### Backend Verification Summary

| Check | Status | Details |
|-------|--------|---------|
| Records created correctly | PASS | 3 users created with correct attributes |
| Records not created on validation failure | FAIL | 1 invalid record slipped through |
| Associations set correctly | PASS | User->Profile link verified |
| Cleanup/deletion works | PASS | Soft-delete sets deleted_at |

### Screenshots
All screenshots saved to: `./e2e-screenshots/[feature-name]/`

### Result: FAIL (16/19 passed, 2 failures, 1 skipped)
```

## Quick Usage

```bash
# Test the feature you just built (auto-detect from git diff)
/e2e-feature-test current

# Test a specific feature by description
/e2e-feature-test "user registration form with email verification"

# Test on a specific port
/e2e-feature-test current --port 5000
```

## Key Principles

1. **Evidence over assertion** — Every pass/fail must have a screenshot or command output backing it
2. **Frontend + backend** — Never test UI without checking the database, never check the database without testing the UI
3. **Exhaustive matrix** — Generate more test cases than the developer thought of. Cover validation, edge cases, error paths, not just the happy path
4. **User perspective** — Interact with the app exactly as a real user would. Use the actual UI, not API shortcuts
5. **Fail fast, fix fast** — When something fails, offer to fix it immediately rather than accumulating a list of problems
