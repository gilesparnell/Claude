---
name: Compute Efficiency & Credit Conservation
description: Mandatory defaults for minimising Claude credit burn — Explore/Plan subagents, parallel tool calls, /ce:plan-beta + /ce:work-beta as default workflow, challenge expensive skills. Applies every session, every task.
type: feedback
originSessionId: dca29f33-f50e-4e87-9934-d8267916b1ed
---
## Rule: Default to the Lightest Approach That Gets the Job Done

Giles is on Claude Max and burns credits fast when I'm sloppy. **Every session, every task — apply these defaults without being asked.** They compound.

---

## Default 1 — Use Explore / Plan subagents aggressively

Whenever a task needs more than ~3 searches or reads across the codebase, spawn a subagent instead of running the searches in the main context.

- **Explore subagent** — use for "find X in the codebase", "how does Y work", "where does Z live". Returns a summary, not raw tool output. The main Opus context sees a paragraph, not 20 grep hits.
- **Plan subagent** — use for "design how to build X", "what's the best approach for Y". Returns a step-by-step plan to the main context. Opus doesn't do the walking, just receives the destination.

**Why:** subagents run on cheaper models (Haiku/Sonnet), keep the main Opus context window lean, and the summary they return is cache-warm for follow-up turns. Running a 15-grep investigation in the main context burns full Opus tokens on every subsequent message.

**Triggers that should make me reach for a subagent without asking:**
- Open-ended question that'll need >3 queries to answer
- Search that spans multiple directories or naming conventions
- "How do I do X in this codebase" when the answer isn't obvious
- Anything I'm tempted to run `find` / `grep` / `ls` on three times in a row
- Before any large refactor — send an Explore agent to map the terrain first

**Do not spawn a subagent when:**
- The answer is one targeted Read or Grep away
- I already know the exact file path
- The task is tiny (under ~10 lines) and despatch overhead > savings

---

## Default 2 — Parallelise tool calls ruthlessly

Independent tool calls MUST go in the same message, not sequentially. Every sequential call when the calls don't depend on each other is wasted wall-clock time AND wasted prompt cache (every round-trip re-reads the full context).

**When there's no data dependency between calls, they go in ONE message:**
- Multiple file reads → parallel
- Multiple greps → parallel
- Read + grep + bash `ls` → parallel
- Multiple edits to different files → parallel
- Audit-style investigations → ALL the discovery calls go in one message

**Only serialise when the next call genuinely needs output from the previous one:**
- `git diff` → then `git commit` using the diff to write the message
- `vercel env add` → then `vercel deploy` to pick up the new env
- Read file → then edit the file using exact content from the read

**If Giles says "you're being sequential" → apologise briefly, batch the rest in parallel.** This is a real lever.

---

## Default 3 — Use `/ce:plan-beta` then `/ce:work-beta` for any non-trivial work

These are the default workflow for anything over ~3 files or ~50 lines of real code. Stop freelancing with ad-hoc todos and edits.

**Use `/ce:plan-beta` when:**
- Feature, bug fix, or refactor touching > 2 files
- Anything with real architectural decisions to document
- Multi-phase rollouts (like the Rob's Gardens SEO work)
- Any work where the plan itself needs review before execution

**Skip `/ce:plan-beta` when:**
- Single-line fix, rename, typo, import rewire
- A one-file edit with no decisions
- Exploratory research (use Explore subagent instead)
- A question (use conversation)

**Then `/ce:work-beta` executes the plan.** Reads the plan file, works the units in dependency order, respects `Execution note` markers (including `Execution target: external-delegate` for codex-cli handoff).

**Why this saves credit:** the plan is written ONCE and serves as cache-warm reference for every execution turn. Without a plan, every turn re-derives scope, re-locks decisions, and re-plans in the main context. With a plan, the context stays tight and the execution phase just works the list.

**Giles has been under-using these — make `/ce:plan-beta` the default suggestion for any ambitious task, not the exception.**

---

## Default 4 — Challenge expensive skills before launching

Before invoking `/deepen-plan`, `/document-review`, `/ce-review`, or any skill that spawns multiple research agents — **always ask "is this worth the cost?"**

### Incident (2026-03-31)
- `/deepen-plan` on a business/GTM strategy plan launched 3 background research agents (~60+ web searches each)
- `/document-review` then re-read the 900+ line document for minor fixes
- Combined: ~23% of monthly credit allocation for improvements that could have been done with 2–3 targeted lookups and direct edits

### When to push back
1. Can I answer this with 1–2 targeted searches instead of a full skill?
2. Is this a code/implementation plan (where grounding prevents expensive mistakes) or a business/strategy document (where the cost of a mistake is lower)?
3. How many agents will this spawn? If > 2, is each one genuinely earning its keep?
4. Is the document already good enough to act on? "Good enough to start" beats "perfect but expensive".

### Skills that are often overkill for business/strategy documents
- `/deepen-plan-beta` — designed for complex software implementation plans. For business plans, do targeted research on 2–3 weak spots instead.
- `/document-review` — only worth it if the document has structural problems. For minor fixes, edit directly.
- `/ce-review` with full agent suite — reserve for code PRs, not documents.

### Skills that are usually worth the cost
- `/ce:plan-beta` — the initial planning pass is high-value for non-trivial work
- `/ce:work-beta` — structured execution from a plan
- Targeted research agents for specific questions (compliance, pricing, technical decisions)

### How to challenge Giles
> "That skill will launch X agents and cost roughly Y% of credits. I can achieve the same result by [simpler approach]. Want me to do that instead, or is the full skill worth it here?"

Never silently comply with an expensive command. The 5 seconds it takes to challenge saves real money.

---

## Default 5 — Default to codex-cli for build; keep Claude for thinking

**Once plan, strategy, and direction are clear, outsource everything I can to codex-cli.** Codex is the default builder. Claude stays for judgement calls only.

**Claude executes directly when:**
- Planning, strategy, architectural decisions, approach design
- Ambiguous problems, root-cause debugging, multi-file reasoning
- Code review, security review, trade-off calls, design critique
- Writing plan documents themselves (`/ce:plan`, `/ce:plan-beta`)
- Security-sensitive code where Claude writes AND reviews (auth, sessions, crypto)

**Codex executes by default for everything else, especially:**
- Implementation from a clear spec
- Mechanical refactors, renames, codemods
- Test implementation from signatures I wrote
- Volume rollouts (N near-identical components from one reference)
- Boilerplate, scaffolding, config files
- Applying review feedback that's already been reasoned through

**Plan-level requirement:** every `/ce:plan` / `/ce:plan-beta` implementation unit MUST carry an `Execution target:` tag — `codex-delegate` (default), `claude` (must justify why), or `hybrid` (spell out the handoff point). Plans without tags are incomplete. Top of every plan must include a **Routing summary** block: count per runner + one-sentence rationale for each `claude`-tagged unit.

**Working-update requirement:** every response where code is produced or about to be produced MUST state which runner is active at the top, one line, no ceremony:
- `Runner: Claude — Unit 2 is tagged claude (ambiguous, needs exploration).`
- `Runner: Codex — delegating Unit 4 via Execution target: codex-delegate.`
- `Runner: switching — design phase done, Units 5–18 handing off to Codex.`

If Giles sees `Runner: Claude` on something mechanical, that's a signal to challenge the routing.

**Why:** Claude per-token cost ≫ Codex per-token cost. The 5-hour usage window exists because Claude is being used for work Codex should handle. Route correctly at plan time and the rate-limit problem shrinks.

**Mid-execution switches happen only when work type changes**, not because credits ran out. Running out of credits mid-unit is the symptom of bad routing at plan time — fix the plan, don't paper over it. Record switches in `docs/handoff/handoff.md`.

Full rule and table live in `~/.claude/CLAUDE.md` → "Claude vs Codex Routing (MANDATORY)".

---

## Default 6 — Session hygiene

- **End long sessions when a phase is done.** Long running sessions pay full-context tax on every turn. A fresh `/ce:work-beta` call reading the plan file is cheaper than a 40-turn session carrying everything.
- **Write good plans so execution phases don't re-plan.** Decisions locked in the plan = no re-litigation at execution time.
- **Prefer edit-then-verify over read-verify-edit-verify.** One round trip instead of two where possible.
- **Monitor tool beats polling loops.** Already a documented global rule — worth restating here because it's part of the same cost pattern.

---

## Summary — the one-line rule

> **Explore/Plan subagents for research, parallel tool calls for investigation, /ce:plan-beta + /ce:work-beta for execution, challenge anything that spawns > 2 agents, default to Codex for build + Claude for thinking (announce runner every turn), end sessions when phases finish.**

This runs on every task without being asked. If I catch myself doing it the slow way, stop and restart the right way.
