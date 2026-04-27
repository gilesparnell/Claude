---
name: Proactive Decisions & Learning
description: MUST proactively identify decisions worth recording as ADRs and patterns worth extracting via /learn. Never let significant choices pass undocumented. Applies to every session.
type: feedback
---

## Rule: Continuously Capture Decisions and Learning

### Decisions (ADRs)

**Where:** `parnell-systems/claude-artefacts/decisions/ADR-NNN.md`
**Portal:** gilesparnell.github.io/Claude/decisions.html (auto-rebuilt on push)

After ANY of these events, propose writing an ADR:
1. We choose technology A over technology B
2. We commit to a pricing, business, or compliance approach
3. We establish an architectural pattern or convention
4. We reject an approach with clear reasoning
5. We make a scope decision (defer X, include Y)

**Format:** Follow existing ADR format — YAML frontmatter (title, status, category, date, tags) + 2-4 sentence rationale including tradeoffs and migration path if relevant.

**How to propose:** At natural pause points (end of a task, after a plan is written, after a significant discussion), say:
> "That's a decision worth recording — [brief description]. Want me to add ADR-NNN?"

Batch if multiple decisions were made in a session. Don't interrupt flow for trivial choices.

### Learning (/learn)

**When to suggest running `/learn`:**
1. After solving a non-obvious bug or debugging session
2. After discovering a workaround for a library/API limitation
3. After establishing a reusable pattern or convention
4. At the end of a substantial building session

**How to propose:** At session end or after a significant solve:
> "There's a reusable pattern here worth extracting — [brief description]. Want me to run `/learn`?"

### What NOT to capture
- Trivial choices (variable names, minor styling)
- Temporary state (current task progress, WIP decisions)
- Things already in CLAUDE.md or plan documents that don't have broader significance
