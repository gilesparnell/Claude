---
name: X-link evaluation workflow
description: How to handle x.com links the user drops with "is this Claude tip worth setting up" — verify, evaluate, classify risk, and decide whether to auto-apply or pause.
type: feedback
originSessionId: aad14fff-c167-4ad9-bb79-5a3b6e343e58
---
When the user drops an x.com (or any social) link about a Claude Code / Claude setup tip, follow this workflow:

1. **Fetch** the post content using the `compound-engineering:agent-browser` skill (X blocks WebFetch behind a login wall, but agent-browser works without auth for public posts).
2. **Evaluate** against a rubric:
   - *Applicable?* Does it match the user's actual stack (Claude Code CLI, current MCP servers, current skills)?
   - *Real?* Cross-check against what's already verifiable in-session (system prompt, available tools, installed plugins). For unverifiable claims, use `claude-code-guide` agent or `compound-engineering:context7` MCP to check official docs before recommending.
   - *Safe?* Anything that grants an external surface (phone, chat app, webhook) the ability to drive Claude Code = risky.
   - *Net win?* Effort to set up vs. how often the user benefits.
   - *Conflicts?* Does it clash with anything in CLAUDE.md or existing setup?
3. **Give the verdict first** — short writeup, before touching anything: worth it / skip / worth it with modifications, plus *why*. Be honest about which claims you verified vs. which you're taking on faith from the post.
4. **Risk classification**:
   - **Low-risk** (new slash command, harmless skill, doc-only tweak, model dropdown change): **auto-apply** without asking.
   - **Risky** (hooks, permission grants, auto-accept, anything granting external control of CC, anything that touches secrets/auth, MCP servers, `--no-verify`-style bypasses): **pause and ask for explicit go/no-go per change**.
5. **Implement** (if approved), then verify it actually loaded.

**Why:** User is time-pressed, sees lots of X tips daily, and currently copy-pastes posts manually because the X API was painful to set up. Wants to offload the "is this real and worth it" judgement, but does not want unauthorised risky changes to their CC setup. They explicitly said: "always pause for risky, once you've given me your perspective. Fine to proceed with low risk."

**How to apply:** Trigger this workflow any time the user drops a social link (x.com, threads, bsky, mastodon, reddit, hn) and the framing is "is this worth setting up" or similar. Don't trigger for general "look at this" links — wait for the setup-evaluation framing. Always lead with the verdict and the verification status of each claim, not with implementation steps.
