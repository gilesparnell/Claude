---
name: code-quality
description: Use this skill when reviewing, auditing, or improving code quality. Triggers on requests like 'review this code', 'check code quality', 'clean this up', 'audit this file', or 'make this production-ready'.
---

# Code Quality Review Skill

This skill guides a thorough code quality review. Work through each section systematically.

## What to Check

### 1. Correctness
- Does the code do what it claims?
- Are edge cases handled? (null/undefined, empty arrays, network failures)
- Are there off-by-one errors?
- Is error handling explicit and meaningful?

### 2. Readability
- Are names descriptive and consistent?
- Are functions small and focused?
- Is the code self-documenting, or does it need comments to be understood?
- Are there any "clever" tricks that sacrifice clarity?

### 3. Performance
- Are there any obvious N+1 query patterns?
- Are expensive operations inside loops when they could be hoisted?
- Are large data structures being unnecessarily copied?

### 4. Security
- Is user input validated and sanitised?
- Are there any potential injection points (SQL, shell, etc.)?
- Are secrets or credentials hardcoded anywhere?
- Are permissions/authorisation checks in place where needed?

### 5. Maintainability
- Is there duplicated logic that should be extracted?
- Are there magic numbers or strings that should be constants?
- Is the code testable? (no hidden dependencies, side effects isolated)

### 6. Deployed Output Verification (for visual/CSS changes)
- Are the intended CSS classes present in the deployed HTML?
- Do compiled CSS variable values match what was set in source?
- Are known-bad patterns absent (e.g. `backdrop-blur` on content cards)?
- If a `verify-deploy.sh` script exists, has it been run and passed?

## Output Format

Structure your review as:

**Summary** — one paragraph overall assessment

**Issues** — list each issue with:
- Severity: `critical` / `major` / `minor` / `suggestion`
- Location: file + line number
- Description: what's wrong
- Fix: how to address it

**Positives** — what's done well (always include this)

## Gotchas

- Don't flag style issues as "critical" — reserve that for correctness and security problems
- Don't rewrite working code just because you'd do it differently — focus on actual problems
- If you'd need more context to assess something fully, say so rather than guessing
- Check for commented-out code and flag it for removal
