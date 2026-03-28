---
title: TDD-First Enforcement
scope: global
category: code
icon: &#128308;
description: Mandatory test-first development for all non-trivial code. No trigger words needed — always active. Enforces the FULL test pyramid — unit, integration, and system/E2E tests. RED-GREEN-REFACTOR cycle for TypeScript, Python, Node.js, and Go. Nothing is "done" until the complete test suite passes.
triggers:
  - always active — no trigger needed
  - write tests first
  - TDD
  - test first
  - run the tests
  - is this tested
checks-label: Rules
checks:
  - Always active — no trigger words needed
  - Three test layers enforced — unit + integration + system/E2E
  - Tests written BEFORE implementation (happy + sad + edge)
  - RED confirmed before code, GREEN confirmed after
  - Full test suite MUST pass before declaring anything "done"
  - Standardised test file placement per runtime and layer
  - Bug fixes start with a reproduction test
  - No mocking internal modules — mock only external boundaries
version: 3.0
---


