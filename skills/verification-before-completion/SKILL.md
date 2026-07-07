---
name: verification-before-completion
title: Verification Before Completion
scope: global
category: code
icon: ✅
description: Prevents premature completion claims. Use before claiming work is done, fixed, or passing — requires running verification commands and confirming output before making any success assertions. Evidence before claims, always. Adapted from obra/superpowers.
triggers:
  - done
  - fixed
  - tests pass
  - it works
  - ready for review
  - complete
  - all good
checks-label: Rules
checks:
  - No completion claims without fresh verification evidence
  - Run the actual verification command in this message before claiming success
  - Read full output and check exit code
  - Never use "should", "probably", or "seems to" for status claims
  - No expressing satisfaction before verification
  - Verify agent-delegated work independently
  - Check requirements line-by-line, not just test results
version: 1.0
---

# Verification Before Completion

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

BEFORE claiming any status or expressing satisfaction:

1. **IDENTIFY** — what command proves this claim?
2. **RUN** — execute the FULL command (fresh, complete)
3. **READ** — full output, check exit code, count failures
4. **VERIFY** — does output confirm the claim?
   - If NO: state actual status with evidence
   - If YES: state claim WITH evidence
5. **ONLY THEN** — make the claim

Skip any step = unverified assertion, not verification.

## What Requires Verification

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| Tests pass | Test command output: 0 failures | Previous run, "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, extrapolation |
| Build succeeds | Build command: exit 0 | Linter passing, logs look good |
| Bug fixed | Test original symptom: passes | Code changed, assumed fixed |
| Regression test works | Red-green cycle verified | Test passes once |
| Agent completed | VCS diff shows changes | Agent reports "success" |
| Requirements met | Line-by-line checklist | Tests passing |

## Red Flags — STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!")
- About to commit/push/PR without verification
- Trusting agent success reports without checking
- Relying on partial verification
- Thinking "just this once"

## Correct Patterns

**Tests:**
```
RUN the test command → SEE "34/34 pass" → THEN say "All tests pass"
NEVER say "Should pass now" or "Looks correct"
```

**Regression tests (TDD red-green):**
```
Write test → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)
NEVER say "I've written a regression test" without red-green verification
```

**Build:**
```
Run build → See exit 0 → THEN say "Build passes"
NEVER say "Linter passed" as proxy for build success
```

**Requirements:**
```
Re-read plan → Create checklist → Verify each item → Report gaps or completion
NEVER say "Tests pass, phase complete" without checking requirements
```

**Agent delegation:**
```
Agent reports success → Check VCS diff → Verify changes → Report actual state
NEVER trust agent reports without independent verification
```

## Rationalisation Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence is not evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter is not compiler |
| "Agent said success" | Verify independently |
| "Partial check is enough" | Partial proves nothing |

## When to Apply

ALWAYS before:
- ANY variation of success/completion claims
- ANY expression of satisfaction about work state
- Committing, PR creation, task completion
- Moving to the next task
- Delegating to agents

## The Bottom Line

Run the command. Read the output. THEN claim the result. This is non-negotiable.
