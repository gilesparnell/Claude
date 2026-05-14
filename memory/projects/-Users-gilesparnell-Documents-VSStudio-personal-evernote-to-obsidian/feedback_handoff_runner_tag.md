---
name: feedback-handoff-runner-tag
description: "When the latest handoff entry tags the runner as \"human (operator)\", draft the next command and stop — do not auto-launch long batch jobs even if asked to \"get the commands issued\""
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 67f84581-fd52-443f-8ae8-2991bfa93ef0
---

When `docs/handoff/handoff.md`'s newest entry tags **Runner for next turn: human (operator)** in this project, draft the next command in a fenced code block and stop. The user fires it. Applies especially to anything in `scripts/classify/` that writes vault frontmatter or runs >10 minutes — `classify_vault.py`, `fix_evernote_titles.py`, `migrate_vault.py`, `sample_classified.py` (writes are fine, the LM runs are not).

**Why:** On 2026-05-14 PM AEST, the handoff said "Runner for next turn: human (operator). Continue chunking AWS." The user said "let's get the commands issued to run the next AWS chunk (2000)" — I read that as "execute" and auto-launched a ~3.3-hour `classify_vault.py --limit 2000 --html` batch that writes frontmatter on ~2000 vault notes. The user pushed back: every prior chunk in this project they have run themselves so they can watch LM Studio, choose overnight vs. daytime timing, and audit between runs. "Get the commands issued" in their phrasing means "draft them ready to issue," not "run them yourself."

**How to apply:**
- Read the top entry of `docs/handoff/handoff.md` before proposing any batch run. If it tags `human (operator)` as the runner, default to drafting only.
- Long-running classifier invocations (`classify_vault.py`, `fix_evernote_titles.py`, `migrate_vault.py`) are always operator-fired — present the exact command, note expected runtime and side effects, and wait. Pre-flight checks (LM Studio health, no stale processes, checkpoint state, archiving prior review queue) are still fair game and helpful to run unprompted.
- Setting up a Monitor on an already-running job after the user asks is fine — that's reactive observability, not auto-launch.
- This rule overrides ambiguity in the user's phrasing. "Get the commands issued," "run the next chunk," "kick off X" all mean "draft and wait" when the handoff tags the human as runner. Only proceed without confirmation if the user has explicitly said "you run it" or named me as the runner.

Related: [[feedback-credit-efficiency]] (global), [[plan-execution-continuity]] (handoff is the source of truth for runner state).
