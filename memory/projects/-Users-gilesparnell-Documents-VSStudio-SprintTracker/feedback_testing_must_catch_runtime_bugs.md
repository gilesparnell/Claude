---
name: Testing must catch runtime bugs
description: Unit tests alone are insufficient - must include build validation and integration tests that exercise the actual runtime (Next.js, framework constraints)
type: feedback
---

User was frustrated that the app broke immediately on first use despite having 29 passing unit tests. The root cause: `"use server"` files in Next.js require ALL exported functions to be `async`, but Vitest unit tests run in plain Node.js and don't enforce this. The tests passed but the app crashed at runtime.

Key lessons:
1. Always include a `next build` integration test that catches compile-time/type-check violations the unit test runtime cannot
2. Unit tests running outside the framework runtime give false confidence - add at least one integration-level test per major feature surface
3. When building with Next.js server actions: every function in a `"use server"` file MUST be async, and all callers must `await` them
4. The DB type `BetterSQLite3Database<Record<string, never>>` doesn't accept a schema-typed DB instance - use `BetterSQLite3Database<any>` for action functions that receive db as a parameter
