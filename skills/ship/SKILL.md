---
name: ship
description: Verified PR ship workflow — tests, lint, commit, push, open PR, then VERIFY merge before claiming done. Triggers on 'ship this', 'ship it', 'push and PR', 'wrap up and ship', 'open a PR and merge', 'ready to ship'. Use when a branch is ready for production and the user wants a single-command procedure. Do NOT use for WIP pushes, draft PRs, or exploratory commits.
---

# /ship — Verified ship procedure

This skill terminates the "claimed merged but wasn't" failure mode. It is a procedure, not a script. Follow the steps in order; never skip the verification step at the end.

## Runner announcement

Before step 1, state: `Runner: Claude — /ship procedure`. If the user has already delegated implementation to Codex for this branch, announce the switch: `Runner: Codex finished the build; Claude running /ship from here.`

## Procedure

1. **Run the full test suite sequentially.** One-shot, not `--watch`:
   - `npm test -- --run` (Vitest), `pytest` (Python), `rspec` (Ruby), `go test ./...`, etc.
   - If tests fail: stop. Do not proceed. Report the failure.
   - If the project is one where a subset is acceptable, the user must say so explicitly for this run — never assume.

2. **Lint and typecheck.** Run the project's configured linters and type checkers. Fix any failures before proceeding. Never use `--no-verify` to bypass hooks (per Shipping Discipline in global CLAUDE.md).

3. **Commit with a conventional-commits message.** Delegate the mechanics to the `git-conventions` skill — do not re-derive the format here. Co-authorship footer per the repo's convention.

4. **Push the branch** and **open the PR** with `gh pr create`. Fill title and body per the project's PR template if one exists. Include a Test plan checklist.

5. **Wait for the user to merge.** Do not self-merge unless the user has explicitly asked for auto-merge behaviour.

6. **VERIFY the merge.** Invoke the `verification-before-completion` skill. At minimum, run and show:
   - `gh pr view <num> --json state,mergedAt,mergeCommit`
   - If a Vercel or similar preview deploy is attached, show the deployment status output.

7. **Only then report "shipped"** — never before step 6 output is visible.

## Rules

- Never claim "merged", "shipped", or "deployed" without showing verification output from step 6. Prose reassurance without evidence = violation.
- Never bypass git hooks, CI checks, or signing with `--no-verify` / `--no-gpg-sign` / similar.
- Never `--amend` a pushed commit. Create a new commit instead.
- If the user selected "Squash and merge" on GitHub, the verification query still applies — `gh pr view` reports state correctly regardless of merge method.
- On branch-protection failure (required check red, review missing), stop at step 5 and report the blocker. Do not retry in a loop.

## Integration with other skills

- `verification-before-completion` — required for step 6. This skill does not re-implement that logic.
- `git-conventions` — owns the commit message format for step 3.
- `tdd-first` — should already have shipped tests alongside the implementation. `/ship` does not write new tests.

## Why this skill exists

Multiple past sessions reported PRs as "merged" when they weren't, caused rebases and cleanup, and burned trust. Having a single procedure that enforces evidence at the claim point eliminates the class.
