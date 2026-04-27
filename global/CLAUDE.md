# Global Rules — Parnell Systems

## ⚠️ STOP — Timezone (MANDATORY, applies to every response)

**Giles is in Australia/Sydney. Never output a raw UTC timestamp.**

Before sending any response that contains a timestamp — from git, GitHub, Vercel, Supabase, PostHog, Sentry, CLI output, file mtime, database created_at, any source — **convert it to Australia/Sydney local time and append the timezone suffix**.

- ✅ `PR merged at 9:46 pm AEST (13 Apr 2026)`
- ✅ `deployed 5 minutes ago`
- ❌ `PR merged at 2026-04-13T11:46:30Z` — UTC raw, unreadable
- ❌ `deployed at 21:46` — no timezone, ambiguous
- ❌ `Mon Apr 13 2026 11:46 GMT+0000` — still UTC, still forbidden

**Timezone to use:**
- Outside DST (early April → early October): **AEST (UTC+10)**
- Inside DST (early October → early April): **AEDT (UTC+11)**

DST boundaries in NSW/VIC/QLD/ACT/TAS: starts first Sunday of October, ends first Sunday of April. If the date in question is between those, use AEDT. Otherwise AEST.

**Self-check before sending:** if your draft response contains `Z`, `GMT`, `UTC`, or any 24h time without a visible `AEST`/`AEDT` suffix next to it → **stop and convert before sending**. This check runs on every response, every tool output quote, every CLI output excerpt. No exceptions.

For durations ("5 minutes ago", "yesterday") no conversion is needed.

## Personal Identity (Read Before Every Task)
Before starting any task, read these identity files to understand who you're working with:
- `~/.claude/identity/about-me.md` — role, expertise, current priorities, working style
- `~/.claude/identity/voice-profile.md` — writing tone, communication preferences, beliefs
- `~/.claude/identity/anti-ai-writing-style.md` — banned words, rejected patterns, formatting rules

These files define how to communicate with me. Follow them.

## Compute Efficiency Defaults (MANDATORY)

I am on Claude Max and burn credits fast when Claude is sloppy. **Apply these defaults on every session, every task — not just when asked.** The full rule lives in the `feedback_credit_efficiency` auto-memory; this section exists so it's discoverable from the global CLAUDE.md without a memory lookup.

### 1. Use Explore / Plan subagents aggressively
Whenever a task needs more than ~3 searches or reads across the codebase, **spawn a subagent** (`Explore` for "find/search/how does X work"; `Plan` for "design the approach for Y"). Subagents run on cheaper models and return summaries, keeping the main Opus context window lean. Running 15 greps in the main context burns Opus tokens on every subsequent turn; a subagent returns one paragraph.

Trigger without being asked:
- Open-ended question needing > 3 queries
- Investigation across multiple directories or naming conventions
- Before any large refactor — map the terrain with an Explore agent first
- Audit-style tasks ("what's the current state of X?")

### 2. Parallelise tool calls ruthlessly
Independent tool calls MUST go in the same message, not sequentially. Multiple Reads, Greps, Bash commands — if they don't depend on each other, they batch in one response. Sequential calls burn one full context round-trip per call and break prompt cache warming.

Only serialise when the next call genuinely needs the previous call's output.

### 3. Default to `/ce:plan-beta` then `/ce:work-beta` for non-trivial work
Anything touching > 2 files or > 50 lines of real code gets a plan first. The plan is written once and serves as cache-warm reference for every execution turn. Without a plan, every turn re-derives scope and re-locks decisions in the main context.

Skip `/ce:plan-beta` for single-line fixes, renames, typos, pure research, or questions.

### 4. Challenge expensive skills before launching
Before `/deepen-plan`, `/document-review`, `/ce-review`, or anything spawning > 2 research agents — **ask "is this worth the cost?"** Push back when 1–2 targeted lookups achieve the same result. See the full incident (2026-03-31, `/deepen-plan` burned 23% of monthly credits on a business doc) in the memory file.

### 5. Default to codex-cli for build; keep Claude for thinking
Once plan, strategy, and direction are clear, **outsource everything you can to codex-cli**. Claude is for higher-level thinking — planning, strategy, architecture, ambiguous debugging, judgement calls. Codex is the builder — it's cheaper per token and the 5-hour usage window exists because Claude is being used for work Codex should handle. See the dedicated **Claude vs Codex Routing** section below for the full split, the `Execution target:` tag format, and the "state which runner is active" requirement.

### 6. Session hygiene
End long sessions when a phase finishes. A fresh `/ce:work-beta` call reading the plan file is cheaper than a 40-turn session carrying full context. Write tight plans so execution phases don't re-plan. Prefer edit-then-verify over read-verify-edit-verify.

### One-line rule
> **Explore/Plan subagents for research, parallel tool calls for investigation, /ce:plan-beta + /ce:work-beta for execution, challenge anything spawning > 2 agents, delegate volume to codex, end sessions when phases finish.**

## Adoption Discipline (MANDATORY)

When I ask to adopt any recommendation set — `/insights` reports, audit outputs, third-party suggestions, "these best practices", anything that arrives as a list of things to add — **do not produce a flat to-do list**. Produce an explicit **accept / reject / defer** triage against current state first. The plan follows the triage, not the other way round.

### Pre-flight triage rule
For any "adopt X" / "add these" / "implement these recommendations" request:
1. Read the target files holistically (not grep for literal strings — semantic overlap is what matters).
2. Classify each recommendation as **accept**, **reject** (already covered, overlapping, or not worth the cost), or **defer** (valuable but out of scope).
3. **The reject column must exist.** If it's empty, re-check for overlap — it almost always means I missed existing coverage.
4. Present the triage before writing any plan. Only then build the plan from the accepted items.

Why: on 2026-04-21, I was asked to adopt seven `/insights` recommendations and built a plan to add all seven without checking overlap. Three were already covered by existing CLAUDE.md sections or always-active skills (`verification-before-completion`, Shipping Discipline, Compute Efficiency Defaults, Project Status Catch-Up). The user had to prompt me to pause and think. Triage-first prevents that class of failure.

### CLAUDE.md growth brake
`~/.claude/CLAUDE.md` is loaded into every conversation, every turn. Bloat has a real per-turn cost.

- Any proposal that would add **>20 lines** to `~/.claude/CLAUDE.md` requires a paired proposal for what to **remove** or **migrate to a skill**.
- Prefer skills over prose rules. If a behaviour only matters in specific contexts, a skill with triggers is cheaper than a prose rule loaded every turn. `verification-before-completion` and `tdd-first` are the reference pattern.
- Candidates to migrate out when the file grows: long procedural sections that read like a checklist (Versioning Discipline, Shipping Discipline) are better as invokable skills than as always-loaded prose.

## Claude vs Codex Routing (MANDATORY)

Two coding agents run on my local system: **Claude Code** (you) and **codex-cli**. They have different strengths and different per-token costs. Route work to the right one explicitly, at plan time — not by accident of which terminal is open.

### The split

| Work type | Runner |
|---|---|
| Planning, strategy, architectural decisions, approach design | **Claude** |
| Ambiguous problems, root-cause debugging, multi-file reasoning | **Claude** |
| Code review, security review, trade-off calls, design critique | **Claude** |
| Writing the plan document itself (`/ce:plan`, `/ce:plan-beta`) | **Claude** |
| Implementation from a clear spec | **Codex** |
| Mechanical refactors, renames, codemods | **Codex** |
| Test implementation from signatures I wrote | **Codex** |
| Volume rollouts (N near-identical components from one reference) | **Codex** |
| Boilerplate, scaffolding, config files | **Codex** |
| Applying review feedback that's already been reasoned through | **Codex** |

**One-line rule:** **once plan, strategy, and direction are clear, outsource everything you can to Codex.** Claude stays in the loop only for judgement calls during execution, not for line-by-line implementation. The ratio target is "Claude writes the plan, Codex writes the code."

### How this shows up in plans (`/ce:plan`, `/ce:plan-beta`)

Every implementation unit inside a plan document MUST carry an explicit runner tag. This is not optional — plans without tags are incomplete.

```markdown
### Unit 3: Wire auth middleware into API routes
Execution target: codex-delegate
Reason: spec is tight, pattern established in Unit 2, mechanical wiring
...
```

Allowed values:
- `codex-delegate` — codex-cli executes this unit from the spec. **This is the default.**
- `claude` — Claude executes directly. Must justify *why* Codex can't do it (ambiguous, judgement-heavy, foundational decision still being made).
- `hybrid` — Claude scaffolds the shape, Codex fills in volume. Spell out the handoff point explicitly.

Plans produced via `/ce:plan` / `/ce:plan-beta` MUST include a **"Routing summary"** block at the top: count of units per runner, and one sentence per `claude`-tagged unit explaining why it can't be delegated. This makes the split visible at a glance.

### How this shows up in working updates

**Every response where code is produced or about to be produced MUST state which runner is active.** State it at the top of the response, one line, no ceremony:

- `Runner: Claude — Unit 2 is tagged claude (ambiguous failure mode, needs codebase exploration first).`
- `Runner: Codex — delegating Unit 4 via Execution target: codex-delegate.`
- `Runner: switching — Claude finished the design phase; Units 5–18 are mechanical, handing off to Codex.`

This is not ceremonial — it's so I can see at a glance whether expensive Claude tokens are being burned on work Codex should be doing. If I see `Runner: Claude` on something that looks mechanical, that's a signal to challenge the routing.

### When to revise the tag mid-execution

Mid-execution switches happen only when the **work type changes**, not when the tool feels slow or when one runner is temporarily rate-limited. Legitimate switches:
- Tagged `codex-delegate` but the spec turned out ambiguous → escalate to `claude`, update the plan, then continue
- Tagged `claude` but the design phase is done and the remaining work is mechanical → hand off to `codex-delegate`
- Rate limit hit on one side → record in `docs/handoff/handoff.md` and resume on the other side only if the *work type* is appropriate for that runner

**Never switch runners mid-unit because credits ran out.** That's the symptom of bad routing at plan time. Fix the plan, don't paper over it.

### Skip the tag when

- Single-line fixes, typos, doc tweaks (too small to plan)
- Pure research / questions with no code output
- Spike/throwaway work explicitly not going into a plan

### Why this rule exists

Claude (Opus/Sonnet) is significantly more expensive per token than Codex. When Claude's strengths (judgement, design, ambiguity) aren't needed, using Claude for execution is waste. The 5-hour usage window that keeps forcing me to build supervisor scripts is a downstream symptom — the upstream fix is routing the work correctly in the first place. Tagging plans and announcing the runner in every update makes mis-routing visible, which is the only way to stop doing it.

## Choosing a Runtime — Local Claude, Supervisor, Routines, /loop

The 5-hour usage window can hit during the day, not just at night. "Out of credits mid-task" is a frequent lived reality, not an edge case. Route work to the right runtime based on what kind of execution it needs, not on what time it is.

| Runtime | Where it runs | Good for | Not good for |
|---|---|---|---|
| **Local Claude Code** (interactive terminal) | Laptop, terminal open | Judgement, design, ambiguous debugging, planning | Anything the moment you hit the 5h window |
| **claude-supervisor** (tmux + fresh `--print` runs) | Laptop, tmux persists | Long-running plan execution on local repos; uncommitted state; overnight grind; daytime grind when the window hits mid-task | Scheduled triggers; webhook-driven work; work that needs to keep running when laptop is closed |
| **Anthropic Routines** ([docs](https://code.claude.com/docs/en/routines)) | Anthropic cloud | Cron-scheduled runs, GitHub-webhook-triggered runs, API-triggered runs; work that survives laptop close; 15 runs/day on Max | Work against uncommitted local state (Routines do a fresh clone); minute-level schedules (min interval is 1 hour) |
| **`/loop`** (inside an active Claude session) | Your current session | Polling during active work ("check the deploy every 5 min"); 1-minute minimum | Unattended runs (dies when session ends); scheduled work beyond the session |
| **Desktop scheduled tasks** (Claude Code desktop app) | Laptop, app open | Local cron while the desktop app is running; 1-minute minimum | Headless/scripted use; anything when the app is closed |

**Routing heuristics:**

- **Hit the 5-hour window mid-day on a local plan?** → kick it to the supervisor so it can auto-retry after the window resets. The daytime case is exactly the same shape as the overnight case; treat them the same.
- **Work that doesn't need local uncommitted state and fits in 15 runs/day?** → prefer a Routine. Zero local infra, survives laptop close, officially maintained by Anthropic.
- **GitHub-webhook-triggered work** (review on PR open, bump deps on release) → always a Routine, never a supervisor.
- **One-off scheduled task during an active session** (watch this deploy) → `/loop`.
- **Interactive judgement + design** → just Claude in the terminal; don't over-engineer.

**Why this matters:** building a supervisor doesn't fix the routing problem — it just papers over the symptom. If the same task keeps hitting the window, the upstream fix is either (a) routing the build portion to Codex per the Claude vs Codex Routing rule, or (b) moving scheduled/webhook parts of the work to Routines so they're not competing for the interactive window.

## Plan Execution Continuity (MANDATORY)

When working through a detailed plan (e.g. via `/ce:work-beta`, the `claude-supervisor` tool, or any multi-step implementation), maintain two living files per project so a fresh session — Claude or Codex — can resume without the previous run's context. These files exist to survive token-limit resets, session restarts, the claude-supervisor auto-restart flow, and runner handoffs.

### Files

**`docs/decisions/decisions.md`** — project-local decision log for in-flight plan work.
- Append an entry whenever a non-trivial choice is made: tool/library selection, API shape, data model, scope cut, trade-off resolution, rejected alternative, runner-routing change
- Each entry: date (Australia/Sydney), one-line title, 2–4 sentence rationale, link(s) to relevant files/PRs
- Cheap and fast — these are tactical decisions within the current plan, not architectural ADRs
- **Promote to a cross-project ADR** (in `parnell-systems/claude-artefacts/decisions/`) only when the decision has impact outside this project or establishes a long-lived architectural pattern. Never merge the two — project-local stays project-local

**`docs/handoff/handoff.md`** — running log of significant completed work, written as a handoff to the next session.
- Append an entry every time a significant piece of work is finished (a plan phase, a feature, a non-trivial fix, a milestone, a runner switch)
- Each entry: date (Australia/Sydney), what was completed, current runner, what's next, any gotchas / in-progress state a fresh session would need to resume safely
- **Newest entry at the top** so a fresh session reads the most recent first
- Structured so a new Claude *or* Codex session can read the most recent entry and pick up the plan mid-flight

### When to update

- **During plan execution**: after every completed unit, before moving to the next, decide whether this completion warrants a handoff entry or a decisions entry (or both)
- **At session end** (approaching token limits, `/compact`, `claude-supervisor` restart, or mid-task stop): always append a handoff entry describing current state and the next step, **even if mid-unit**. This is exactly the state that gets lost on a token-limit kill
- **On runner switch**: log both the decision (in `decisions.md`) and the handoff state (in `handoff.md`) before the switch fires
- **Never batch at session end** — update incrementally as work lands. Deferred sweeps are exactly what fails when the session dies unexpectedly

### Relationship to existing conventions

- **Existing ADR flow** (`parnell-systems/claude-artefacts/decisions/ADR-NNN.md`, portal-published) = cross-project architectural decisions. Unchanged.
- **New `docs/decisions/decisions.md`** = project-local, tactical, lives alongside the plan. Complements the ADR flow, doesn't replace it.
- **New `docs/handoff/handoff.md`** = the runner-handoff and restart-continuity mechanism. No equivalent existed before.
- **Supervisor integration**: `claude-supervisor` reads both files on every fresh run via its `HANDOFF_FILE` / `DECISIONS_FILE` config. Defaults point at these paths.

### Skip when

- Single-file throwaway edits / typo fixes with no plan
- Pure research or questions that don't result in code
- Project has no `/docs/` directory AND no plan — don't create scaffolding just to write one entry; wait until there's a plan

## Timezone

See the ⚠️ STOP rule at the top of this file — all timestamps go through Australia/Sydney conversion before being shown. This section exists as a landmark so the rule is discoverable via section headings; the actual rule lives at the top.

## Project Documentation Standard (MANDATORY)

Every project MUST have documentation following this standard. This is non-negotiable.

### Structure
Each project has its **own** GitHub Pages site in its `docs/` folder:

```
docs/
├── index.html                    # Project homepage (bento grid, glass cards)
├── user-guide.html               # End-user documentation
└── diagrams/
    └── plan-progress.html        # Visual progress dashboard (workstream cards)
```

### Exemplar
**SprintTracker** is the reference implementation:
- URL: https://gilesparnell.github.io/SprintTracker/
- Repo: /Users/gilesparnell/Documents/VSStudio/parnell-systems/sprint-tracker/docs/

Copy the SprintTracker page structure, design system, and component patterns exactly.

### Hub Integration
The hub page at **gilesparnell.github.io/** links to each project's docs site.
- Repo: /Users/gilesparnell/Documents/VSStudio/parnell-systems/gilesparnell.github.io/
- Each project card links to `gilesparnell.github.io/<repo-name>/`
- Update the hub card when creating project docs

### GitHub Pages Setup
Enable GitHub Pages on the repo: serve from `/docs` on `main` branch.
```bash
gh api repos/gilesparnell/<repo>/pages -X POST -f "source[branch]=main" -f "source[path]=/docs"
```

### Design System: "Deep Ocean Tech"
- Fonts: Satoshi (display), Outfit (body)
- Dark theme (#0a0c10), mesh background blobs, glassmorphism cards
- Cursor glow on hover, teal accent (#38bfa0)
- Self-contained CSS per page (no shared stylesheet for project sites)

### What NOT To Do
- NEVER put project docs in the Claude Knowledge Portal (claude-artefacts repo)
- NEVER use Proof for documentation
- NEVER create standalone markdown files as documentation output
- The Claude portal (gilesparnell.github.io/Claude/) is for skills, walkthroughs, decisions, templates — NOT project docs

## Versioning Discipline (MANDATORY)

Every project that ships code to a deployed environment MUST track a human-readable version and display it in-app. Every PR that ships code MUST bump that version and add a CHANGELOG entry **in the same commit as the code change**. This is non-negotiable.

Why: I want to be able to look at a deployed app and tell, in two seconds, which version is running. "Is this the version with the fix?" is a real question and the answer should never require opening DevTools.

### Source of truth for the version number

Find the project's canonical version field and bump that. Order of preference:

| Project type | Version lives in |
|---|---|
| Node / JS / TS | `package.json` `version` field |
| Python | `pyproject.toml` `[project] version` (or `setup.py` `version=`) |
| Ruby gem | `lib/<gem>/version.rb` `VERSION` constant |
| Rust | `Cargo.toml` `[package] version` |
| Go | git tag (no in-tree version), CHANGELOG still applies |
| Anything else | `VERSION` file at repo root, plain text |

If the project is a frontend deployed to Vercel/Netlify/etc., **also inject the build-time git SHA** alongside the semver. Display them together as `vX.Y.Z (sha7)` so the semver gives a human-readable anchor and the SHA gives the unambiguous identifier.

For Vite frontends, the pattern is in `vite.config.js`:
```js
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))
const sha = process.env.VERCEL_GIT_COMMIT_SHA
  || execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()

export default defineConfig({
  define: {
    __APP_SEMVER__: JSON.stringify(pkg.version),
    __APP_VERSION__: JSON.stringify(sha),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
```
WLC's `src/lib/version.js` is the reference implementation — copy that pattern.

### Bump rules (semver)

- **patch** (`0.0.x`) — bug fix, copy tweak, dependency bump, refactor with no behaviour change
- **minor** (`0.x.0`) — new feature, new page/route, new tracked event, new env var, new public API
- **major** (`x.0.0`) — breaking change. Ask before bumping major.

Don't be afraid of `1.0.0`. Semver 1.0 means "stable interface, backwards-compatible changes go in 1.x" — it does NOT mean "complete forever" or "massive audience". A solo project with real users in production has earned 1.0.

### CHANGELOG.md format

Every project gets a `CHANGELOG.md` at the repo root. Each release entry has **two** subsections, in this order:

1. **What's new** — customer-facing outcomes, written in the user's language. Things they'll notice, feel, or ask about. No file names, no function names, no architectural justification. If someone who has never seen the code read it, they should understand what changed for them.

2. **Under the hood** — technical detail for future-me debugging. File paths, function names, rationale, links to issues, why-we-chose-X-over-Y. This section is rendered in a dimmer visual style on any in-app changelog page so the user-facing bullets dominate.

Template:

```markdown
# Changelog

All notable changes. Bumped on every PR that ships to production.

## Conventions
- patch (0.0.x) — bug fixes, copy tweaks, dependency bumps
- minor (0.x.0) — new features, new pages, new tracked events
- major (x.0.0) — breaking changes

Each entry is split into:
- **What's new** — customer-facing outcomes
- **Under the hood** — technical detail (rendered dimmer in-app)

---

## [0.4.2] — 2026-04-15

### What's new
- Short bullet on what the user will notice. Plain language, outcome-focused.
- Avoid "we added / we fixed" — say what happens for the user now.

### Under the hood
- Short bullet on the technical change. File paths and rationale welcome here.
- Why we did it this way rather than alternatives, if non-obvious.
```

### When to create a new entry vs. extend an existing one

**Don't let the changelog become a diary of "fixing the previous fix."** If a PR lands within the same development burst as the one before it (rough rule: within the last ~72 hours, or still actively polishing a just-shipped feature), **extend the previous entry in place** instead of creating a new heading. Update the heading to a version range like `[0.10.0 → 0.10.3]` so the range tells the story of multi-stage delivery.

| Situation | Action |
|---|---|
| New user-visible feature, new page, new tracked event | **New entry** with the current version as the heading |
| Bug fix or polish on a feature shipped in the last ~72 hours | **Extend the previous entry**. Update the heading to a range (`[X.Y.Z → X.Y.Z+n]`). Fold new detail into the existing "Under the hood". |
| Bug fix in something that's been stable for weeks/months | **New entry** — this is a legit regression worth its own heading |
| Pure dep bump / refactor with no user impact | **Extend the previous entry** with a one-line "Under the hood" note, or new entry if no recent one exists |

`package.json` still bumps on every PR so the footer always shows the exact deploy. The CHANGELOG collapses related churn into a single narrative. The version in the footer may be higher than the most recent heading in the changelog — that's expected, the range in the heading signals the span.

**Rule of thumb:** reading the /changelog page for the first time should feel like reading a product newsletter, not a commit log. Each entry answers "what did this release do for me?" — not "what bug did Claude accidentally ship last week?"

If you're building an in-app changelog page that reads this file, use the WLC reference implementation: `src/lib/parseChangelog.js` + `src/lib/annotateChangelogBlocks.js` + `src/pages/Changelog.jsx` in the wholeLifeChallenge repo. `annotateChangelogBlocks` walks the parsed blocks and tags each one with a `dim` flag based on which h3 section it sits under, and the page renders dim content in `textDim` / `textFaint` instead of full-contrast.

### In-app display

Display the version somewhere unambiguous and persistent:
- **Web frontend**: small monospace text in the page footer, low contrast, doesn't compete with content. Format: `vX.Y.Z (sha7)`
- **`/health` endpoint** (if it exists): include version + build timestamp in the response
- **Backend service / CLI**: log the version on startup; expose it via `--version` flag and/or a `/version` endpoint
- **Mobile app**: standard "About" screen + crash report metadata

### When you can skip the bump

ONLY skip the version bump for PRs that touch:
- Documentation only (README, CHANGELOG itself, project CLAUDE.md)
- Repository-meta files (.gitignore, .editorconfig)
- Local-only tooling that doesn't ship (test helpers that aren't run in CI)

If you're unsure → bump. The cost of an unnecessary patch bump is zero. The cost of a deploy that doesn't update the version is "I can't tell what's running."

### Bootstrap step for new projects

When starting a new project (or onboarding to one without versioning):

1. Set the version source (`package.json` etc.) to a starting value:
   - Brand new project → `0.1.0`
   - Project that's already in real use → `0.9.0` or `1.0.0` depending on stability
2. Create `CHANGELOG.md` at repo root with the conventions header + first entry
3. Wire the version into the build-time injection (Vite `define`, Webpack `DefinePlugin`, etc.)
4. Add the version display to the footer / health endpoint / CLI
5. Add this rule (and the bump-on-every-PR commitment) to the project's local `CLAUDE.md` so it's discoverable from the project root, not just the global one

WLC is the reference implementation: see `package.json`, `vite.config.js`, `src/lib/version.js`, `CHANGELOG.md`, and `CLAUDE.md` in the wholeLifeChallenge repo for the full pattern.

## Shipping Discipline (MANDATORY)

These rules apply to every project that ships code to a deployed environment. They're the safety net that lets me move fast without breaking things — for myself, six months from now, late at night, on a sketchy WiFi connection, two beers in.

### Branch protection on the default branch

Every project MUST have branch protection on `master` / `main` with the following rules enabled:

- **Require a pull request before merging** — no direct pushes, even solo. Set required approvals to 0 if I'm the only reviewer; the PR flow itself is what matters.
- **Require status checks to pass before merging** — name the CI check explicitly (e.g. `Lint · Test · Build`). Merge button stays grey until CI is green.
- **Require branch to be up to date before merging** — catches "tests passed on the branch but break on master because of an unrelated merge in between".
- **Block force pushes** — git history on the default branch is immutable.
- **Block deletions** — the default branch can't be deleted.

Set this up in the first hour of any new project, before the first PR lands. For existing projects without it, flag and offer to add it.

How to set it up: GitHub Settings → Branches → Add classic branch protection rule (or Settings → Rules → Rulesets if I prefer the new UI). Verify with `gh api repos/<owner>/<repo>/rules/branches/<branch>` — should return a non-empty array with `pull_request`, `required_status_checks`, `non_fast_forward`, and `deletion` rule types.

### Tests must pass before merge — no bypassing

Branch protection enforces "CI green to merge" at the GitHub level. The companion rule at the developer level: **never bypass git hooks or CI**.

- **Never** use `git commit --no-verify` or `git push --no-verify` unless I have explicitly asked for it for a one-off reason
- **Never** use `--no-gpg-sign` / `--no-edit` / similar to skip verification steps
- If a pre-commit hook is failing, **fix the underlying issue**, don't bypass the hook
- If a CI check is failing, **fix the failure**, don't disable the check
- If a test is flaky, fix the flake or quarantine it explicitly with a tracking issue, don't `.skip` it silently

The whole point of having tests + hooks + CI is that they catch the things I'd otherwise miss. Bypassing them defeats the purpose.

### Observability — scaled to project size

The right level of observability depends on the project's blast radius and audience. Don't pre-emptively wire Sentry + PostHog + `/health` on a 50-line throwaway script. Don't ship a real-users app with zero error visibility either.

Default by project profile:

| Project profile | Error tracking | Health endpoint | Product analytics |
|---|---|---|---|
| Solo throwaway / prototype / "just for me" | optional | skip | skip |
| Small project, handful of trusted users I know personally | **yes** (Sentry) | optional | skip |
| Real users I don't personally know | **yes** | **yes** (where applicable) | optional |
| Anything with paid tier, business logic, or compliance exposure | **yes** | **yes** | **yes** |

**Default to the minimum needed for the project's profile.** Adding observability later is cheap; ripping out unused instrumentation isn't free either (extra deps, extra config, extra bundle weight, an extra service to manage).

When I do wire any of these, do them properly:

**Error tracking** (Sentry or equivalent) — when the project profile says yes:
- Initialised in the entry point (`main.jsx`, `_app.tsx`, etc.) before the framework mounts
- `ignoreErrors` filter for known-benign noise (browser quirks, library internals) to protect the free-tier quota
- `sendDefaultPii: false` — never send raw URLs/query params/form data
- Source maps uploaded so stack traces are readable in production
- User identified by ID only, never email or display name

**Health endpoint** (where applicable) — for any project with a backend dependency:
- Web frontends: a `/health` page that pings the backend and renders OK / DOWN + version + build time
- Backend services: a `/health` (or `/healthz`) HTTP endpoint returning JSON with status + version + dependency check results
- Trivial to add; useful for manual debugging even before any monitoring is wired

**Product analytics** (PostHog or equivalent) — only when there's a real product question to answer:
- Don't add this just because. Add it when you have a question like "are people using feature X?" that you can't answer any other way.
- MUST go through a thin wrapper module that enforces PII rules in one place — never call `posthog.capture` (or equivalent) directly from feature code
- PII strip on every track call: drop `email`, `name`, `*_text`, `display_name`, `phone`, etc. from properties before they hit the network
- User identified by Supabase/Auth0/etc. UUID, never email
- `autocapture: false` and `disable_session_recording: true` by default — only track events I explicitly choose
- WLC's `src/lib/analytics.js` is the reference implementation when this rule fires

### Database migrations are explicit, never auto-applied on deploy

Database schema changes are the highest-blast-radius operation in any project. They MUST require an explicit human action to apply, never run automatically on deploy.

- Migrations live in version control (`supabase/migrations/`, `db/migrate/`, `prisma/migrations/`, etc.)
- They are written **idempotently** wherever possible — `DROP IF EXISTS` + `ADD`, `CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, etc.
- `DO $$ ... EXCEPTION` blocks for Postgres so a partial-failure doesn't leave the schema in a wedged state
- After applying, **always run a verification query** (e.g. `SELECT conname FROM pg_constraint WHERE conrelid = '...'::regclass`) to confirm the migration actually landed — "no rows returned" on a DDL statement does NOT prove anything was added
- Document the apply steps in the PR description so future-me knows what to do
- For Supabase specifically: paste the migration into the Dashboard → SQL Editor → New Query → Run, then verify with the inspection query

If a project DOES have automated migration apply (e.g. Rails, Django on a managed deploy pipeline), still verify the migration ran by checking the migration table after deploy.

### When in doubt

If I'm unsure whether one of these rules applies → apply it anyway. The cost of an unnecessary safety net is zero. The cost of skipping one is "production was broken / data was lost / users saw a stack trace and I didn't know why."

## Project Status Catch-Up

When asked "what's the latest", "where are we", "catch me up", "continue", "resume", or similar on any project:

1. **Plans first** — glob for `**/plan*`, `**/plans/**`, `**/roadmap*` and
   read the most recent plan to understand the overall scope, phases, and
   current workstream.
2. **Handoff if present** — read the top entry of `docs/handoff/handoff.md` (per the Plan Execution Continuity rule) if the file exists.
3. **Then git log** — check recent commits for activity since the plan was
   last updated. Also check `gh pr list --state all --limit 10` when the project has a remote.
4. **Present in plan context** — frame the status in terms of which
   phases/workstreams are complete, in progress, and upcoming. Raw commit
   lists without plan context are not useful.
5. **No speculative continuation.** If there's no plan, no handoff, and no obvious active thread, **stop** — summarise what you found in three bullets and ask the user to pick a thread or describe a new goal. Do not invent work to do. The `/resume` skill automates this flow.

## Background Monitoring (Monitor tool)

Prefer the native Monitor tool over polling, `/loop`, or re-running
`run_in_background` checks. Monitors are free when silent — only wake
on matched events.

### When to start a monitor automatically

Start a persistent monitor without asking whenever I:
- Run a dev server (LiveKit agent, Next.js, Supabase local, etc.)
- Kick off a deploy to Vercel or a long build
- Open a PR and want status tracking
- Tail logs for a service I'm actively debugging

For bounded tasks (test runs, single deploys), use `timeout_ms` instead
of `persistent: true` so the watcher auto-kills.

### Standard monitor recipes (global defaults)

**Dev server (persistent, wake on errors only)**
- Command: `<dev command> 2>&1 | grep -iE 'error|warn|exception|trace|disconnect|ECONN'`
- `persistent: true`
- Always pipe stderr with `2>&1` — stderr alone does not trigger events.

**Vercel deploy watcher (bounded)**
- Command: `vercel logs <url> --follow 2>&1 | grep -iE 'error|failed|5[0-9]{2}'`
- `timeout_ms`: 600000 (10 min, adjust to deploy length)

**PR / CI watcher (persistent)**
- Command: `while true; do gh pr status --json state,statusCheckRollup 2>&1 | grep -iE 'FAILURE|ERROR'; sleep 60; done`
- `persistent: true`

### Monitor rules

1. Never poll with repeated prompts when a Monitor can do the job.
2. Batch filter patterns with `grep -iE` — multi-line events within
   200ms auto-group into one notification.
3. Name monitors descriptively (`livekit-dev`, `vercel-sprints-deploy`)
   so I can see what's running.
4. When a monitor fires, investigate the event first, then decide
   whether to keep the monitor running or tear it down.
5. Don't start overlapping monitors on the same command — check
   existing monitors before launching a new one.
6. If a filter is too noisy (firing on warnings I don't care about),
   tighten the regex rather than ignoring notifications.

### Monitor learnings

When a monitor fires and I investigate the event, log the outcome
to `.learnings/monitors/` using the template. Takes 30 seconds
and compounds.

### Monitor learnings → CLAUDE.md promotion

Weekly (or on-demand), scan `.learnings/monitors/*.md` and:

1. Group entries by `monitor_name`.
2. For each monitor, compute:
   - signal ratio = true_positive / (true_positive + false_positive + noise)
   - false_negative count
3. Flag for promotion:
   - Monitors with signal ratio < 0.5 over 5+ entries → filter is too
     loose, promote the tightened regex from the entries.
   - Monitors with any false_negative → promote the missing pattern
     into the standard recipe in CLAUDE.md.
   - Monitors with signal ratio > 0.8 over 5+ entries → promote as
     a canonical recipe (mark the entries `promoted: true`).
4. When promoting, update the relevant recipe in the Background
   Monitoring section of CLAUDE.md and append a one-line changelog
   at the bottom.
5. Never delete learnings entries — just flip `promoted: true`.

## Per-Project CLAUDE.md Snippets

Copy-paste blocks for per-project `CLAUDE.md` files. Kept here (not in the global rules above) because they're project-specific and shouldn't load on every session.

### Test Execution

Drop into a project's `CLAUDE.md` under `## Testing` or `## Development Workflow` when the project has memory-pressure sensitive tests or background test watchers (vitest, jest --watch, etc.).

```markdown
## Test Execution
- Run tests sequentially (not in parallel) to avoid memory pressure and flaky results
- Before running `git add -A` or `git status`, check for lingering background processes (vitest, dev servers) with `jobs` or `ps`
- Kill stale background test processes before git operations
```

