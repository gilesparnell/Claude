---
name: Check plans folder for project status
description: When asked "what's the latest" on a project, read the plans folder first to give context of the overall plan, not just raw commits
type: feedback
originSessionId: d028f848-178a-40cc-bfc4-ad4ea4ac544e
---
When asked "what's the latest" or "where are we" on a project, always check the plans folder (e.g. `plans/`, `docs/plans/`, or similar) first to understand the overall plan and current phase before looking at git log.

**Why:** Raw git commits give no context about the bigger picture. The user wants to know where things stand relative to the plan — what phase we're in, what's done, what's next — not just a list of recent commits.

**How to apply:** On any "what's the latest" / "catch me up" / "where did we leave off" question:
1. Find and read the project's plan files first (glob for `**/plan*`, `**/plans/**`)
2. Then check git log for recent activity
3. Present status in terms of the plan: which phases/workstreams are complete, what's in progress, what's next
