---
name: tdd-first
description: >
  MANDATORY test-first development for ALL non-trivial code — no trigger words needed.
  Any time Claude or Codex produces a function, class, endpoint, service, or module,
  tests MUST be written and confirmed failing BEFORE implementation code exists.
  Enforces a full test suite: unit tests, integration tests, and system/E2E tests.
  Supports TypeScript (Vitest/Jest), Python (pytest), Node.js (Jest/Mocha), and Go.
  This skill is always active. It does not require the user to say 'TDD' or 'test first' —
  it applies automatically whenever code is being produced.
  NOTHING IS DONE until all tests pass. You must run the full suite before declaring completion.
---

# Test-First Development (TDD) Skill

## Core Rule

**Never write implementation code before its tests exist and have been confirmed to fail.**

**Never declare work complete until the full test suite passes.**

This is not a suggestion. This is not opt-in. This is the mandatory workflow for every piece of non-trivial code produced in any session — whether the user asks for TDD or not.

```
1. Write tests (unit + integration + system)  →  2. Run tests (confirm RED)  →  3. Write code  →  4. Run tests (confirm GREEN)  →  5. Refactor (tests stay GREEN)  →  6. Run full suite (DONE only when all pass)
```

If you catch yourself writing implementation first, STOP. Delete or stash it. Write the test. Then implement.

**This skill is ALWAYS ACTIVE.** It does not require the user to say "TDD", "test first", or any specific trigger phrase. Any time you are about to write a function, class, endpoint, service, or module — this skill applies. The user should never need to remind you to write tests first. If they do, you have failed to follow this skill.

---

## When This Skill Applies

**ALWAYS applies when producing code that contains logic — no exceptions, no trigger words needed:**
- Writing a new function, method, class, or module
- Adding a new API endpoint or route handler
- Writing business logic, data transformations, or validation
- Adding error handling for specific failure modes
- Implementing a feature from a plan or spec
- Fixing a bug (write the test that reproduces it FIRST)
- Modifying existing logic (write tests covering current behavior FIRST, then modify)

**The ONLY exceptions — skip TDD for these and ONLY these:**
- Pure configuration files (env vars, tailwind config, tsconfig, pyproject.toml)
- CSS/styling-only changes with no logic
- Import rewiring or re-exports with no behavior
- README or documentation edits
- One-line type alias additions
- Renaming files with no logic change
- Adding dependencies (package.json, requirements.txt)
- React component JSX-only changes with zero conditional logic

**When in doubt, write the test.** The cost of an unnecessary test is near zero. The cost of untested code compounds.

---

## The Three Test Layers

Every non-trivial feature requires tests at multiple layers. Not just unit tests — the full pyramid.

### Layer 1: Unit Tests (ALWAYS required)

Test individual functions, methods, and classes in isolation.

**Scope:** Single function or class. Dependencies mocked at system boundaries only.
**Speed:** Milliseconds. Run hundreds in seconds.
**When to write:** For EVERY function, method, or class that contains logic.

```
Minimum per function: 1 happy path + 1 sad path + 1 edge case = 3 tests
```

**What to test:**
- Pure logic, calculations, transformations
- Validation rules
- Error handling branches
- State transitions
- Return values and side effects

### Layer 2: Integration Tests (Required for features that cross boundaries)

Test how multiple units work together, especially across system boundaries.

**Scope:** Multiple modules interacting. Real database, real file system, real HTTP calls to internal services. External APIs mocked.
**Speed:** Seconds. Run dozens per minute.
**When to write:** For ANY code that:
- Reads from or writes to a database
- Calls an API route handler
- Uses middleware or auth layers
- Combines multiple services/modules
- Processes data through a pipeline

**What to test:**
- Database queries return correct data (use a test database or transactions that rollback)
- API routes return correct status codes and response shapes
- Server actions mutate state correctly and revalidate paths
- Multi-step workflows complete end-to-end within the backend
- Error propagation across module boundaries

**Integration test patterns by stack:**

```typescript
// Next.js API route integration test (TypeScript/Vitest)
describe("POST /api/analysis", () => {
  it("returns 200 with correlation data for valid entries", async () => {
    // Arrange: seed test database with known entries
    await db.diaryEntry.createMany({ data: testEntries });

    // Act: call the route handler directly
    const req = new NextRequest("http://localhost/api/analysis", { method: "POST" });
    const res = await POST(req);

    // Assert: response shape and data
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.suspectFoods).toBeInstanceOf(Array);
    expect(data.suspectFoods[0]).toHaveProperty("correlationScore");
  });

  it("returns 404 when no diary entries exist", async () => { ... });
  it("returns 401 when session is invalid", async () => { ... });
});
```

```python
# Python integration test (pytest with test DB)
class TestAnalysisPipeline:
    def test_full_pipeline_produces_report(self, test_db, sample_entries):
        """Integration: extraction → correlation → report generation"""
        result = run_analysis(test_db, sample_entries)
        assert result.suspect_foods is not None
        assert len(result.suspect_foods) > 0
        assert result.detective_report contains "PRIME SUSPECTS"

    def test_pipeline_handles_empty_database(self, test_db):
        result = run_analysis(test_db, [])
        assert result.status == "insufficient_data"
```

### Layer 3: System / E2E Tests (Required for user-facing features)

Test the complete feature from the user's perspective. The full stack, end-to-end.

**Scope:** Entire application. Real browser or HTTP client. Real database. External services mocked at the network boundary.
**Speed:** Seconds to minutes per test. Run a focused set.
**When to write:** For ANY feature that:
- Adds a new page or route users navigate to
- Changes a user-facing workflow (form submission, navigation, data display)
- Involves multiple request/response cycles
- Has critical business logic the user depends on

**What to test:**
- Page renders with correct content for various data states
- Form submission creates/updates records and redirects correctly
- Navigation between pages works
- Empty states, error states, and loading states render
- Auth-protected pages redirect when unauthenticated

**System test patterns:**

```typescript
// System test: full page render with data (Next.js + Vitest)
describe("Analysis Page (system)", () => {
  it("renders suspect foods when analysis has been run", async () => {
    // Arrange: seed DB with entries + a cached analysis report
    await seedTestData();

    // Act: render the page server component
    const html = await renderPage("/diary/analysis");

    // Assert: key content present
    expect(html).toContain("Prime Suspects");
    expect(html).toContain("Dairy");
    expect(html).toContain("correlation");
  });

  it("shows empty state when no entries exist", async () => {
    const html = await renderPage("/diary/analysis");
    expect(html).toContain("Log some meals to begin");
  });

  it("shows insufficient data message with fewer than 10 entries", async () => {
    await seedTestData({ entryCount: 5 });
    const html = await renderPage("/diary/analysis");
    expect(html).toContain("needs at least 10 data points");
  });
});
```

```bash
# E2E with Playwright (if project uses it)
npx playwright test e2e/analysis.spec.ts
```

### Which Layers Apply When?

| Change Type | Unit | Integration | System |
|---|---|---|---|
| Pure utility function | ✅ | ❌ | ❌ |
| Database query / Prisma call | ✅ | ✅ | ❌ |
| API route handler | ✅ | ✅ | ❌ |
| Server action with DB + redirect | ✅ | ✅ | ✅ |
| New page with data fetching | ❌ | ✅ | ✅ |
| New user-facing feature (full) | ✅ | ✅ | ✅ |
| Bug fix | ✅ (reproduction) | Maybe | Maybe |
| Multi-step pipeline (extraction → correlation → report) | ✅ per step | ✅ pipeline | ✅ page |

---

## Step 1: Detect the Test Runner

Before writing any test, identify the project's test infrastructure. Check in this order:

### TypeScript / JavaScript
```bash
# Check package.json for test script and dependencies
cat package.json | grep -E '"test"|"vitest"|"jest"|"mocha"|"playwright"'
```

| Signal | Runner | Command |
|---|---|---|
| `vitest` in devDependencies or scripts | **Vitest** | `npx vitest run` |
| `jest` in devDependencies or `jest.config` exists | **Jest** | `npx jest` |
| `mocha` in devDependencies | **Mocha** | `npx mocha` |
| `playwright` in devDependencies | **Playwright** (E2E) | `npx playwright test` |
| None found | **Vitest** (install it) | `npm i -D vitest` |

### Python
```bash
# Check for pytest
pip list 2>/dev/null | grep pytest || cat pyproject.toml 2>/dev/null | grep pytest || cat requirements*.txt 2>/dev/null | grep pytest
```

| Signal | Runner | Command |
|---|---|---|
| `pytest` installed or in requirements | **pytest** | `pytest` |
| `unittest` imports in existing tests | **unittest** | `python -m unittest` |
| None found | **pytest** (install it) | `pip install pytest` |

### Go
```bash
# Go has built-in testing
go test ./...
```

**If no test runner exists in the project, install one before proceeding. Do not skip tests because infrastructure is missing.**

---

## Step 2: Write the Tests FIRST

For every unit of work, write tests at all applicable layers.

### Unit Test Coverage (Per Function)

#### Happy Path Tests
The expected behavior when inputs are valid and conditions are normal.

```
- What does this function return when given valid input?
- What state change occurs on success?
- What does the API respond with for a well-formed request?
```

#### Sad Path Tests
The expected behavior when things go wrong.

```
- What happens with null/undefined/empty input?
- What happens when a dependency fails (network, DB, API)?
- What happens with malformed or out-of-range input?
- What error type is thrown and what message does it carry?
```

#### Edge Cases
Boundary conditions that often hide bugs.

```
- Zero, negative, or very large numbers
- Empty strings, empty arrays, empty objects
- Unicode, special characters, extremely long strings
- Concurrent access (if applicable)
- First item, last item, single item in a collection
```

### Integration Test Coverage (Per Feature Boundary)

```
- Does the database query return the right shape with real data?
- Does the API route handle auth, validation, and response correctly?
- Does the server action mutate state AND revalidate correctly?
- Do multiple modules compose correctly (data flows end to end)?
- Do errors propagate correctly across boundaries?
```

### System Test Coverage (Per User-Facing Feature)

```
- Does the page render correctly with real data?
- Does the page handle empty/insufficient/error states?
- Does the full workflow complete (submit → process → display result)?
- Are auth requirements enforced?
```

### Test Naming Convention

Use descriptive names that read as specifications:

**TypeScript/JavaScript:**
```typescript
// Unit tests
describe("calculateCorrelation", () => {
  it("returns high score when food co-occurs with pain in 80% of appearances", () => { ... })
  it("returns zero when food never precedes pain", () => { ... })
  it("handles ingredient with only one appearance", () => { ... })
})

// Integration tests
describe("runAnalysis server action", () => {
  it("extracts ingredients, computes correlations, and saves report to DB", () => { ... })
  it("skips extraction for entries already processed", () => { ... })
  it("returns error state when Claude API fails", () => { ... })
})

// System tests
describe("Analysis page", () => {
  it("renders suspect foods list after analysis is run", () => { ... })
  it("shows 'log some meals' when diary is empty", () => { ... })
})
```

**Python:**
```python
# Unit tests
class TestCalculateCorrelation:
    def test_returns_high_score_for_frequent_pain_cooccurrence(self): ...
    def test_returns_zero_when_food_never_precedes_pain(self): ...

# Integration tests
class TestAnalysisPipeline:
    def test_full_pipeline_saves_report(self, test_db): ...
    def test_handles_claude_api_timeout(self, mock_anthropic): ...

# System tests
class TestAnalysisPage:
    def test_renders_suspect_foods(self, client, seeded_db): ...
    def test_shows_empty_state(self, client, empty_db): ...
```

### Test File Placement — Standardised Convention

**Every project MUST have a consistent test file structure. Apply these conventions every time — do not improvise.**

Before writing the first test in a project, check if a test structure already exists:

```bash
# TypeScript/JS
find . -name "*.test.ts" -o -name "*.test.js" -o -name "*.spec.ts" -o -name "*.spec.js" | head -5

# Python
find . -name "test_*.py" -o -name "*_test.py" | head -5

# Go
find . -name "*_test.go" | head -5
```

**If tests already exist:** Follow the existing convention exactly. Do not mix colocated and separated styles in the same project.

**If no tests exist yet:** Apply these standards:

#### TypeScript / JavaScript — Colocated with Layer Suffixes

```
src/
  utils/
    calculateCorrelation.ts                 ← implementation
    calculateCorrelation.test.ts            ← unit tests
  services/
    analysisService.ts
    analysisService.test.ts                 ← unit tests
  api/
    analysis/
      route.ts
      route.test.ts                         ← unit + integration tests
__tests__/                                  ← system/E2E tests (separate)
  integration/
    analysis-pipeline.test.ts
  system/
    analysis-page.test.ts
  e2e/                                      ← Playwright if used
    analysis.spec.ts
```

**Rules:**
- Unit tests: colocated with implementation (`{filename}.test.ts`)
- Integration tests: `__tests__/integration/` or colocated if testing a single boundary
- System/E2E tests: `__tests__/system/` or `e2e/`
- Naming: `{filename}.test.ts` (not `.spec.ts` unless project already uses `.spec.ts`)

#### Python — Separate `tests/` Directory with Layer Subdirectories

```
project_root/
  src/
    utils/
      calculate_correlation.py
    services/
      analysis_service.py
  tests/
    unit/
      utils/
        test_calculate_correlation.py
      services/
        test_analysis_service.py
    integration/
      test_analysis_pipeline.py
    system/
      test_analysis_page.py
    conftest.py                             ← shared fixtures
```

#### Go — Colocated (Language Requirement)

```
pkg/
  analysis/
    correlation.go
    correlation_test.go                     ← unit tests
    correlation_integration_test.go         ← integration (use build tags)
```

#### API Route Handlers / Serverless Functions

```
api/
  analysis/
    route.ts
    route.test.ts                           ← unit + integration tests
```

### Directory Creation

**If the test directory structure does not exist, create it before writing tests:**

```bash
# TypeScript — create system/integration test directories
mkdir -p __tests__/integration __tests__/system

# Python — create layered test directories
mkdir -p tests/unit tests/integration tests/system

# Go — no action needed (colocated)
```

**Never skip writing tests because the directory doesn't exist. Create it.**

---

## Step 3: Confirm RED

**Run the tests. They MUST fail.**

```bash
# TypeScript — unit tests
npx vitest run path/to/module.test.ts

# TypeScript — full suite
npx vitest run

# Python — unit tests
pytest tests/unit/test_module.py -v

# Python — full suite
pytest -v

# Go
go test ./path/to/... -v -run TestFunctionName
```

**What to check:**
- Tests fail because the function/class/module **does not exist yet** or **returns wrong values**
- Tests do NOT fail because of syntax errors, import errors, or test infrastructure problems
- Each test fails for the RIGHT reason (e.g., "function not found" or "expected X but got undefined")

**If tests pass at this stage, something is wrong:**
- The function already exists (you're duplicating work)
- The test is not actually asserting anything meaningful
- The test is importing a mock instead of the real module

Fix the test before proceeding.

---

## Step 4: Write the Implementation

Now — and only now — write the code that makes the tests pass.

**Rules during implementation:**
- Write the **minimum code** to make the current failing test pass
- Do not add behavior that no test covers
- Do not optimize prematurely — correctness first
- If you realize you need more behavior, go back to Step 2 and write a test for it first

---

## Step 5: Confirm GREEN

**Run the tests again. They MUST all pass.**

```bash
# Same commands as Step 3
npx vitest run path/to/module.test.ts
pytest tests/test_module.py -v
go test ./path/to/... -v
```

**What to check:**
- ALL tests pass (not just the new ones)
- No warnings about skipped or pending tests (unless intentionally marked)
- Test output is clean — no console.log noise, no deprecation warnings

**If any test fails:**
- Fix the implementation, not the test (unless the test had a genuine bug)
- Do not weaken assertions to make tests pass
- Do not add `skip` or `xit` to hide failures

---

## Step 6: Refactor (Optional)

With green tests as your safety net:
- Remove duplication
- Improve naming
- Simplify logic
- Extract helpers if genuinely reused

**After every refactor, run tests again.** If they break, your refactor changed behavior — revert it.

---

## Step 7: Run the FULL Suite Before Declaring Done

**THIS IS MANDATORY. Nothing is "done" until the full test suite passes.**

```bash
# TypeScript — run ALL tests (unit + integration + system)
npx vitest run

# Python — run ALL tests
pytest -v

# Go — run ALL tests
go test ./... -v

# If Playwright E2E exists
npx playwright test
```

**Checklist before saying "done":**
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All system/E2E tests pass
- [ ] No skipped tests (unless pre-existing and documented)
- [ ] No flaky tests (run twice if unsure)
- [ ] Test output is clean — no warnings, no console noise

**If ANY test fails, you are NOT done.** Fix the failure, run the suite again. Repeat until green.

---

## Output Format

When working in TDD mode, structure your output as:

```
TDD CYCLE: [what you're building]

STEP 1 — Tests written:
- Unit: [file paths, N tests]
- Integration: [file paths, N tests]
- System: [file paths, N tests]

STEP 2 — RED confirmed:
- [test runner command]
- [N] tests failed (expected)
- Failures: [brief list of why each fails]

STEP 3 — Implementation:
- [file path]: [what was implemented]

STEP 4 — GREEN confirmed:
- [test runner command]
- [N] tests passed, 0 failed

STEP 5 — Refactored: [what changed, or "no refactoring needed"]

STEP 6 — FULL SUITE:
- [test runner command for full suite]
- Unit: [N] passed | Integration: [N] passed | System: [N] passed
- ✅ ALL TESTS GREEN — work complete
```

---

## Common Anti-Patterns to Reject

| Anti-Pattern | Why It's Wrong | What to Do Instead |
|---|---|---|
| Writing implementation then tests | Tests shaped by implementation, not requirements | Delete impl, write test, re-implement |
| Only unit tests, no integration | Units work alone but break together | Add integration tests for every boundary |
| Only happy path tests | Bugs live in sad paths and edge cases | Minimum: 1 happy, 1 sad, 1 edge per function |
| Mocking everything | Tests pass but nothing actually works | Mock only external boundaries (APIs, DBs in unit tests). Use real DBs in integration tests |
| Tests that mirror implementation | Refactoring breaks tests even when behavior is unchanged | Test behavior and outputs, not internal method calls |
| `expect(result).toBeTruthy()` | Passes for almost anything | Assert specific values: `expect(result).toBe(42)` |
| Giant test files with shared state | One failure cascades, impossible to debug | Each test sets up its own state. No shared mutable state between tests |
| Skipping RED confirmation | You don't know if the test actually tests anything | Always run and see the failure before implementing |
| Declaring done without running full suite | Other tests may have broken | ALWAYS run the full suite before declaring done |
| No system tests for new pages | Page may not render, may crash with real data | Add at least one render test per new page |

---

## Integration with Existing Workflows

### With `/ce:work` plans
If a plan unit has `Execution note: test-first`, this skill's full cycle applies automatically. If no execution note exists, apply this skill for any unit that produces logic. The full suite must pass before marking a plan unit as complete.

### With `/ce:plan`
When planning, flag implementation units that will need TDD in acceptance criteria:
```markdown
- [ ] Unit tests written before implementation (happy + sad + edge)
- [ ] Integration tests for database/API boundaries
- [ ] System tests for new pages and user-facing workflows
- [ ] All tests confirmed RED before implementation
- [ ] All tests confirmed GREEN after implementation
- [ ] Full test suite passes before declaring done
```

### With bug fixes
**Every bug fix starts with a failing test that reproduces the bug.** This proves the fix works and prevents regression. The test is more valuable than the fix.

```
1. Write test that reproduces the reported bug → confirm RED
2. Fix the bug → confirm GREEN
3. Run full suite → confirm no regressions
4. The test now permanently guards against this regression
```

### Completion Gate

**You MUST NOT tell the user something is "done", "ready", "complete", "finished", or "working" unless:**
1. The full test suite has been run in the current session
2. All tests pass (unit + integration + system)
3. The test output has been shown or summarised to the user

If tests haven't been run, say "Implementation complete — running tests now" and run them. If tests fail, say "Tests failing — fixing now" and fix them. Only after green do you say "done."

---

## Quick Reference Card

```
┌──────────────────────────────────────────────┐
│            TDD-FIRST CYCLE v3.0              │
│                                              │
│  1. DETECT  → Find test runner               │
│  2. WRITE   → Unit + Integration + System    │
│  3. RED     → Run tests, confirm fail        │
│  4. CODE    → Minimum to pass                │
│  5. GREEN   → Run tests, confirm pass        │
│  6. REFACTOR → Clean up, tests stay green    │
│  7. FULL SUITE → ALL tests pass = DONE       │
│                                              │
│  Skip for: config, CSS, docs, renames        │
│  Never skip for: logic, APIs, services       │
│                                              │
│  Three layers:                               │
│    Unit: every function (3+ tests each)      │
│    Integration: every boundary crossing      │
│    System: every user-facing feature         │
│                                              │
│  NOTHING IS DONE UNTIL ALL TESTS PASS        │
│                                              │
│  Bug fix = reproduction test FIRST           │
└──────────────────────────────────────────────┘
```
