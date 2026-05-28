---
name: code-review
description: Use this skill when preparing code for review, reviewing a PR, or doing an adversarial review pass. Triggers on 'review this PR', 'prepare this for review', 'adversarial review', 'fresh eyes on this'.
---

# Code Review Skill

## Adversarial Review Mode

When doing a full review, spawn a "fresh eyes" perspective — pretend you've never seen this codebase and are reading this code for the first time.

Ask yourself:
1. Would a new engineer understand what this code does without documentation?
2. What could go wrong at runtime that isn't handled?
3. What edge cases did the author probably not think about?
4. What will this look like in 6 months when the context is gone?

## Review Checklist

### Before Looking at Code
- [ ] Is the PR description clear? Does it explain *why*, not just *what*?
- [ ] Is the scope appropriate? (Not too big, not a trivial one-liner PR)

### Code Quality
- [ ] No obvious bugs or logic errors
- [ ] Error handling is explicit
- [ ] No hardcoded values that should be config
- [ ] No dead code or commented-out blocks
- [ ] No obvious performance issues

### Security
- [ ] User input is validated and sanitised
- [ ] No secrets or credentials in code
- [ ] Permissions are checked where needed

### Tests
- [ ] New logic has test coverage
- [ ] Tests are meaningful (not just hitting 100% line coverage)
- [ ] Edge cases are tested

### Documentation
- [ ] Complex logic has comments explaining *why*
- [ ] Public APIs / functions have clear names
- [ ] README updated if needed

## Feedback Tone

- Be specific — "this could cause a null pointer exception on line 42 when X" not "this looks risky"
- Distinguish between blocking issues and suggestions — use labels: `blocking`, `suggestion`, `nit`
- Acknowledge good work — if something is well done, say so

## Gotchas

- Don't block PRs over style preferences that aren't covered by a linter
- Don't ask for changes that are out of scope for this PR — file a separate issue
- Separate "I would have done this differently" from "this is actually wrong"
