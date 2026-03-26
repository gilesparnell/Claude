---
name: tdd-first
description: >
  MANDATORY test-first development for ALL non-trivial code — no trigger words needed.
  Any time Claude or Codex produces a function, class, endpoint, service, or module,
  tests MUST be written and confirmed failing BEFORE implementation code exists.
  Supports TypeScript (Vitest/Jest), Python (pytest), Node.js (Jest/Mocha), and Go.
  This skill is always active. It does not require the user to say 'TDD' or 'test first' —
  it applies automatically whenever code is being produced.
---

# Test-First Development (TDD) Skill

## Core Rule

**Never write implementation code before its tests exist and have been confirmed to fail.**

This is not a suggestion. This is not opt-in. This is the mandatory workflow for every piece of non-trivial code produced in any session — whether the user asks for TDD or not.

```
1. Write tests (happy + sad paths)  →  2. Run tests (confirm RED)  →  3. Write code  →  4. Run tests (confirm GREEN)  →  5. Refactor (tests stay GREEN)
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

**If no tests exist yet:** Apply these standards and create the directory structure before writing the first test:

#### TypeScript / JavaScript — Colocated (Industry Standard)

```
src/
  utils/
    calculateDiscount.ts          ← implementation
    calculateDiscount.test.ts     ← test (same directory, .test.ts suffix)
  services/
    userService.ts
    userService.test.ts
  api/
    routes/
      orders.ts
      orders.test.ts
```

**Rules:**
- Test file lives next to the implementation file, same directory
- Naming: `{filename}.test.ts` (not `.spec.ts` unless project already uses `.spec.ts`)
- This is the default for Vitest, Jest, and Mocha with minimal config
- For React components with logic: `ComponentName.test.tsx`
- No `__tests__/` directories unless the project already uses them

#### Python — Separate `tests/` Directory (pytest Standard)

```
project_root/
  src/                            ← or package_name/
    utils/
      calculate_discount.py
    services/
      user_service.py
  tests/                          ← mirrors src/ structure
    utils/
      test_calculate_discount.py
    services/
      test_user_service.py
    conftest.py                   ← shared fixtures
```

**Rules:**
- Test directory mirrors the source directory structure
- Naming: `test_{module_name}.py` (pytest discovery convention)
- `conftest.py` at `tests/` root for shared fixtures
- Create `tests/__init__.py` if needed for imports (usually not with pytest)
- Create subdirectories to mirror source structure — do not dump all tests in flat `tests/`

#### Node.js (non-TypeScript) — Colocated

Same as TypeScript but with `.test.js` suffix.

#### Go — Colocated (Language Requirement)

```
pkg/
  discount/
    calculator.go
    calculator_test.go            ← Go requires colocated test files
```

**Rules:**
- Go enforces colocated tests — this is not a choice
- Test file: `{filename}_test.go`
- Test package: same package or `{package}_test` for black-box testing

#### API Route Handlers / Serverless Functions

```
api/                              ← Vercel serverless or similar
  demo-token.ts
  demo-token.test.ts              ← colocated
  health/
    demos.ts
    demos.test.ts
```

**Rules:**
- API route tests are colocated with the route handler
- Test the handler function directly (import and call it), not via HTTP

### Directory Creation

**If the test directory structure does not exist, create it before writing tests:**

```bash
# Python — create tests/ mirror structure
mkdir -p tests/utils tests/services

# TypeScript/JS — no action needed (colocated, directories already exist)
# Go — no action needed (colocated, directories already exist)
```

**Never skip writing tests because the directory doesn't exist. Create it.**

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
