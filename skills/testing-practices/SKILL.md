---
name: testing-practices
description: Use this skill when writing tests, setting up test infrastructure, or when asked about how to test something. Triggers on 'write tests for this', 'add test coverage', 'how do I test this', 'set up testing'.
---

# Testing Practices Skill

## Testing Philosophy

Tests are documentation. A good test suite tells the story of how the system is supposed to behave.

- Test **behaviour**, not implementation — if you can refactor without changing tests, you're testing the right thing
- Tests should be **DAMP** (Descriptive And Meaningful Phrases), not DRY — duplication in tests is acceptable if it aids clarity
- One assertion per test where possible — makes failures easier to diagnose

## Test Structure

Use the Arrange / Act / Assert pattern:

```javascript
it('returns null when user is not found', () => {
  // Arrange
  const repo = new UserRepository({ users: [] })

  // Act
  const result = repo.findById('nonexistent-id')

  // Assert
  expect(result).toBeNull()
})
```

## Naming Tests

Format: `it('<does something> when <condition>')`

Good examples:
- `it('throws an error when email is invalid')`
- `it('returns an empty array when no results match')`
- `it('sends a welcome email after successful registration')`

Bad examples:
- `it('works')`
- `it('test user creation')`
- `it('should work correctly')`

## What to Test

**Always test:**
- Business logic and domain rules
- Edge cases: empty input, null, zero, very large values
- Error paths and failure modes
- Public API of modules/classes

**Don't bother testing:**
- Framework internals (e.g. that React renders a div)
- Simple getters/setters with no logic
- Third-party library behaviour

## Test Types

- **Unit tests** — isolated logic, fast, no I/O
- **Integration tests** — test real interactions between components (prefer these for user-facing flows)
- **E2E tests** — use sparingly for critical user journeys only

## Gotchas

- Never test implementation details — if your test breaks when you rename a private method, it's testing the wrong thing
- Avoid testing through the UI when a unit test would do — E2E tests are slow and brittle
- Don't mock what you don't own — use test doubles for third-party services
- Flaky tests are worse than no tests — fix or delete them
- Keep test files next to the code they test, not in a separate `__tests__` folder (unless the framework requires it)
