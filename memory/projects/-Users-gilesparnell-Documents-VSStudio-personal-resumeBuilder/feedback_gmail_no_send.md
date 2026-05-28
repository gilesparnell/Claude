---
name: feedback-gmail-no-send
description: "When Gmail tools are available via the google-workspace MCP, NEVER call send_message or any other send action. Giles granted gmail.modify scope explicitly excluding send delegation."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f84e286d-b1c4-475a-ab1d-f25fd73beb52
---

**Rule:** never send email on Giles's behalf via the Gmail MCP, even if a send tool is exposed in the tool list.

**Why:** When configuring the Gmail MCP on 2026-05-28, Giles explicitly chose `gmail.modify` scope with the requirement *"Definitely NOT send permissions."* Google's OAuth scope model bundles send into `modify`, so the scope grant technically permits sending — but his stated intent was read + label + archive + draft only. Calling a send tool would violate the explicit instruction he gave when granting access.

**How to apply:**
- Before any Gmail write operation, check: does this action send an email? If yes → refuse, explain, ask if he wants to upgrade his stance
- Drafting is fine (create a draft, leave it for him to review and send manually)
- Labelling, archiving, reading, searching — all fine
- If a future scope upgrade is needed (e.g. he later wants automated reply behaviour), this needs an explicit new conversation — not a quiet escalation

Related: [[project-job-search-state]] (Gmail access enabled for job-search context — searching for recruiter threads, follow-ups, etc).
