Fetch all unresolved review comments for this branch's PR, then fix them.

## Process

1. **Find the PR** — run `gh pr view --json number,url,headRefName` to identify the current branch's PR.

2. **Fetch unresolved comments** — run `gh api repos/{owner}/{repo}/pulls/{number}/comments` and filter to comments where the review thread is unresolved. Also check `gh api repos/{owner}/{repo}/pulls/{number}/reviews` for top-level review comments.

3. **Group by file** — organise comments by file path and line number. Show me a summary table:
   | File | Line | Reviewer | Comment |
   |------|------|----------|---------|

4. **Address each comment** — for each unresolved comment:
   - Read the relevant file and surrounding context
   - Understand what the reviewer is asking for
   - Make the requested change (or explain why it shouldn't be changed)
   - After fixing, reply to the comment thread confirming the fix with `gh api` POST

5. **Verify** — run the project's test suite and linter to confirm nothing broke.

6. **Commit** — create a single commit with message: `fix: address PR review feedback`

7. **Report** — show me what was fixed and what (if anything) needs manual discussion with the reviewer.
