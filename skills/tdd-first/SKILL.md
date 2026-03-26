---
name: tdd-first
description: >
  Enforces test-first development for all non-trivial code. Write failing tests (happy + sad paths),
  verify they fail, implement code, verify they pass. Triggers automatically when writing new functions,
  classes, endpoints, services, or modules. Supports TypeScript (Vitest/Jest), Python (pytest), and
  Node.js (Jest/Mocha). Triggers on 'write', 'implement', 'build', 'add', 'create' when followed by
  code-producing intent. Also triggers on 'TDD', 'test first', 'test-first', 'tests first'.
---

# Test-First Development (TDD) Skill

## Core Rule

**Never write implementation code before its tests exist and have been confirmed to fail.**

This is not a suggestion. This is the workflow. Every non-trivial piece of code follows this cycle:

```
1. Write tests (happy + sad paths)  →  2. Run tests (confirm RED)  →  3. Write code  →  4. Run tests (confirm GREEN)  →  5. Refactor (tests stay GREEN)
```

If you catch yourself writing implementation first, STOP. Delete or stash it. Write the test. Then implement.

---

## When This Skill Applies

**ALWAYS applies when:**
- Writing a new function, method, class, or module
- Adding a new API endpoint or route handler
- Writing business logic, data transformations, or validation
- Adding error handling for specific failure modes
- Implementing a feature from a plan or spec
- Fixing a bug (write the test that reproduces it FIRST)

**SKIP this workflow for:**
- Pure configuration files (env vars, tailwind config, tsconfig)
- CSS/styling-only changes with no logic
- Import rewiring or re-exports with no behavior
- README or documentation edits
- One-line type alias additions
- Renaming files with no logic change
- Adding dependencies (package.json, requirements.txt)

**When in doubt, write the test.** The cost of an unnecessary test is near zero. The cost of untested code compounds.

---

## Step 1: Detect the Test Runner

Before writing any test, identify the project's test infrastructure. Check in this order:

### TypeScript / JavaScript
```bash
# Check package.json for test script and dependencies
cat package.json | grep -E '"test"|"vitest"|"jest"|"mocha"'
```

| Signal | Runner | Command |
|---|---|---|
| `vitest` in devDependencies or scripts | **Vitest** | `npx vitest run` |
| `jest` in devDependencies or `jest.config` exists | **Jest** | `npx jest` |
| `mocha` in devDependencies | **Mocha** | `npx mocha` |
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

For every unit of work, write tests covering:

### Happy Path Tests
The expected behavior when inputs are valid and conditions are normal.

```
- What does this function return when given valid input?
- What state change occurs on success?
- What does the API respond with for a well-formed request?
```

### Sad Path Tests
The expected behavior when things go wrong.

```
- What happens with null/undefined/empty input?
- What happens when a dependency fails (network, DB, API)?
- What happens with malformed or out-of-range input?
- What error type is thrown and what message does it carry?
```

### Edge Cases
Boundary conditions that often hide bugs.

```
- Zero, negative, or very large numbers
- Empty strings, empty arrays, empty objects
- Unicode, special characters, extremely long strings
- Concurrent access (if applicable)
- First item, last item, single item in a collection
```

### Test Naming Convention

Use descriptive names that read as specifications:

**TypeScript/JavaScript:**
```typescript
describe("calculateDiscount", () => {
  it("applies 10% discount when order exceeds $100", () => { ... })
  it("returns 0 discount for orders under $50", () => { ... })
  it("throws InvalidAmountError when amount is negative", () => { ... })
  it("handles zero amount without throwing", () => { ... })
})
```

**Python:**
```python
class TestCalculateDiscount:
    def test_applies_10_percent_discount_when_order_exceeds_100(self): ...
    def test_returns_zero_discount_for_orders_under_50(self): ...
    def test_raises_invalid_amount_error_when_amount_is_negative(self): ...
    def test_handles_zero_amount_without_raising(self): ...
```

### Test File Placement

Follow the project's existing convention. If none exists:

| Runtime | Convention |
|---|---|
| TypeScript/JS (Vitest) | `src/path/to/module.test.ts` (colocated) |
| TypeScript/JS (Jest) | `__tests__/module.test.ts` or colocated |
| Python (pytest) | `tests/test_module.py` |
| Go | `path/to/module_test.go` (colocated, required by Go) |

---

## Step 3: Confirm RED

**Run the tests. They MUST fail.**

```bash
# TypeScript
npx vitest run path/to/module.test.ts

# Python
pytest tests/test_module.py -v

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

## Output Format

When working in TDD mode, structure your output as:

```
TDD CYCLE: [what you're building]

STEP 1 — Tests written:
- [test file path]
- Happy: [N tests listed]
- Sad: [N tests listed]
- Edge: [N tests listed]

STEP 2 — RED confirmed:
- [test runner command]
- [N] tests failed (expected)
- Failures: [brief list of why each fails — e.g., "function not found", "returns undefined"]

STEP 3 — Implementation:
- [file path]: [what was implemented]

STEP 4 — GREEN confirmed:
- [test runner command]
- [N] tests passed, 0 failed

STEP 5 — Refactored: [what changed, or "no refactoring needed"]
```

---

## Common Anti-Patterns to Reject

| Anti-Pattern | Why It's Wrong | What to Do Instead |
|---|---|---|
| Writing implementation then tests | Tests shaped by implementation, not requirements | Delete impl, write test, re-implement |
| Tests that only cover happy path | Bugs live in sad paths and edge cases | Minimum: 1 happy, 1 sad, 1 edge per function |
| Mocking everything | Tests pass but nothing actually works | Mock only external boundaries (APIs, DBs). Use real objects internally |
| Tests that mirror implementation | Refactoring breaks tests even when behavior is unchanged | Test behavior and outputs, not internal method calls |
| `expect(result).toBeTruthy()` | Passes for almost anything | Assert specific values: `expect(result).toBe(42)` |
| Giant test files with shared state | One failure cascades, impossible to debug | Each test sets up its own state. No shared mutable state between tests |
| Skipping RED confirmation | You don't know if the test actually tests anything | Always run and see the failure before implementing |

---

## Integration with Existing Workflows

### With `/ce:work` plans
If a plan unit has `Execution note: test-first`, this skill's full cycle applies automatically. If no execution note exists, apply this skill for any unit that produces logic.

### With `/ce:plan`
When planning, flag implementation units that will need TDD in acceptance criteria:
```markdown
- [ ] Tests written before implementation (happy + sad + edge)
- [ ] All tests confirmed RED before implementation
- [ ] All tests confirmed GREEN after implementation
```

### With bug fixes
**Every bug fix starts with a failing test that reproduces the bug.** This proves the fix works and prevents regression. The test is more valuable than the fix.

```
1. Write test that reproduces the reported bug → confirm RED
2. Fix the bug → confirm GREEN
3. The test now permanently guards against this regression
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────┐
│           TDD-FIRST CYCLE               │
│                                         │
│  1. DETECT  → Find test runner          │
│  2. WRITE   → Tests (happy/sad/edge)    │
│  3. RED     → Run tests, confirm fail   │
│  4. CODE    → Minimum to pass           │
│  5. GREEN   → Run tests, confirm pass   │
│  6. REFACTOR → Clean up, tests stay green│
│                                         │
│  Skip for: config, CSS, docs, renames   │
│  Never skip for: logic, APIs, services  │
│                                         │
│  Minimum per function:                  │
│    1 happy + 1 sad + 1 edge = 3 tests   │
│                                         │
│  Bug fix = reproduction test FIRST      │
└─────────────────────────────────────────┘
```
