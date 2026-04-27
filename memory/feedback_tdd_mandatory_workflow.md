---
name: TDD is mandatory in the dev workflow
description: TDD-first skill must ALWAYS be applied during development. The e2e-feature-test skill is the post-build acceptance gate, not a replacement. TDD first, then e2e.
type: feedback
---

The `/tdd-first` skill is a NON-NEGOTIABLE part of every development workflow. It must fire automatically whenever code is being produced — no trigger words needed. Giles has confirmed this is a clear decision.

## Workflow order:
1. **TDD-first** (during development) — write tests before code, confirm RED, implement, confirm GREEN, run full suite
2. **e2e-feature-test** (after feature is built) — drive real browser, verify UI + backend state in the running app

These are sequential. TDD is the development discipline. E2E feature test is the final acceptance validation using a real browser against the running app.

Never skip TDD. Never treat e2e-feature-test as a substitute for writing proper unit/integration/system tests during development.
