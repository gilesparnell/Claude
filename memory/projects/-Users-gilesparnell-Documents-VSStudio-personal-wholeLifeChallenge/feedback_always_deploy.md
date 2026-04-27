---
name: Always deploy after code changes
description: After any code change, always commit, push a branch, open a PR, and set auto-merge — never leave changes as local unstaged edits
type: feedback
originSessionId: 018f44cb-666d-4138-9efc-5d51e3bf2d2c
---
After making code changes, always ship them immediately:
1. `git add` the changed files
2. `git commit` with a conventional commit message
3. Push to a feature branch (branch protection blocks direct push to master)
4. `gh pr create` to open a PR
5. `gh pr merge --auto --squash` to enable squash auto-merge once CI passes

**Why:** Changes left as local unstaged edits are invisible to the user and never reach Vercel. The user explicitly wants squash merges — they keep the master history clean and each PR lands as a single commit on master.

**How to apply:** Every session that produces code changes ends with a deployed PR using `--squash` flag. Never use `--merge` or `--rebase`. After enabling auto-merge, confirm CI status and mention when the PR has merged and Vercel is deploying.
