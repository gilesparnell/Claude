---
name: systematic-debugging
title: Systematic Debugging
scope: global
category: code
icon: 🔍
description: Root-cause-first debugging methodology. Use when encountering any bug, test failure, or unexpected behaviour — before proposing fixes. Enforces evidence gathering, pattern analysis, hypothesis testing, and defence-in-depth validation. Adapted from obra/superpowers.
triggers:
  - bug
  - test failure
  - unexpected behaviour
  - debugging
  - why is this broken
  - it doesn't work
  - fix this
checks-label: Rules
checks:
  - No fixes without root cause investigation first
  - Read error messages completely before acting
  - Reproduce consistently before hypothesising
  - One hypothesis at a time — smallest possible change
  - Create a failing test before implementing a fix
  - If 3+ fixes fail, question the architecture
  - Trace bugs backward through the call stack to find the source
  - Add defence-in-depth validation at every layer
version: 1.0
---

# Systematic Debugging

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

## When to Use

Use for ANY technical issue: test failures, bugs, unexpected behaviour, performance problems, build failures, integration issues.

Use ESPECIALLY when:
- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- You don't fully understand the issue

## The Four Phases

Complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

BEFORE attempting ANY fix:

1. **Read error messages carefully** — don't skip past errors or warnings. Read stack traces completely. Note line numbers, file paths, error codes.

2. **Reproduce consistently** — can you trigger it reliably? What are the exact steps? If not reproducible, gather more data — don't guess.

3. **Check recent changes** — git diff, recent commits, new dependencies, config changes, environmental differences.

4. **Gather evidence in multi-component systems** — before proposing fixes, add diagnostic instrumentation at each component boundary. Log what enters and exits each component. Run once to gather evidence showing WHERE it breaks, THEN analyse.

5. **Trace data flow** — where does the bad value originate? What called this with the bad value? Keep tracing up until you find the source. Fix at source, not at symptom.

### Phase 2: Pattern Analysis

1. **Find working examples** — locate similar working code in the same codebase.
2. **Compare against references** — if implementing a pattern, read the reference implementation completely.
3. **Identify differences** — list every difference between working and broken, however small.
4. **Understand dependencies** — what other components, settings, config, or environment does this need?

### Phase 3: Hypothesis and Testing

1. **Form a single hypothesis** — state clearly: "I think X is the root cause because Y."
2. **Test minimally** — make the SMALLEST possible change. One variable at a time.
3. **Verify before continuing** — did it work? If not, form a NEW hypothesis. Don't layer fixes.
4. **When you don't know** — say so. Don't pretend. Research more.

### Phase 4: Implementation

1. **Create a failing test case** — simplest possible reproduction. MUST have before fixing.
2. **Implement a single fix** — address the root cause. ONE change at a time. No "while I'm here" improvements.
3. **Verify the fix** — test passes? No other tests broken? Issue actually resolved?
4. **If the fix doesn't work** — STOP. If fewer than 3 attempts, return to Phase 1. If 3+ attempts, question the architecture (see below).

### When 3+ Fixes Fail: Question Architecture

Pattern indicating an architectural problem:
- Each fix reveals new shared state/coupling in a different place
- Fixes require massive refactoring
- Each fix creates new symptoms elsewhere

STOP and question fundamentals:
- Is this pattern fundamentally sound?
- Should we refactor architecture vs continue fixing symptoms?
- Discuss with the user before attempting more fixes.

## Red Flags — STOP and Follow Process

If you catch yourself thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- "One more fix attempt" (when already tried 2+)

ALL of these mean: STOP. Return to Phase 1.

## Root Cause Tracing

Bugs often manifest deep in the call stack. Your instinct is to fix where the error appears — that's treating a symptom.

1. **Observe the symptom** — what error, where?
2. **Find the immediate cause** — what code directly causes it?
3. **Ask: what called this?** — trace up the call chain.
4. **Keep tracing** — what value was passed? Where did it come from?
5. **Find the original trigger** — fix at the source.

When you can't trace manually, add instrumentation: log before the dangerous operation (not after it fails), include directory/cwd/env/stack context, use `console.error()` in tests (loggers may be suppressed).

## Defence-in-Depth Validation

After finding and fixing the root cause, add validation at EVERY layer data passes through:

| Layer | Purpose | Example |
|-------|---------|---------|
| Entry point | Reject obviously invalid input | Validate not empty, exists, correct type |
| Business logic | Ensure data makes sense for this operation | Domain-specific constraints |
| Environment guards | Prevent dangerous ops in specific contexts | Refuse destructive actions in test env |
| Debug instrumentation | Capture context for forensics | Stack traces, state logging |

Single validation: "We fixed the bug." Multiple layers: "We made the bug impossible."

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|---------------|------------------|
| 1. Root Cause | Read errors, reproduce, check changes, gather evidence | Understand WHAT and WHY |
| 2. Pattern | Find working examples, compare | Identify differences |
| 3. Hypothesis | Form theory, test minimally | Confirmed or new hypothesis |
| 4. Implementation | Create test, fix, verify | Bug resolved, tests pass |
