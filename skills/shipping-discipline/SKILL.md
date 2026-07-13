---
title: Shipping Discipline
scope: global
category: workflow
icon: &#128674;
description: The safety net for every deployed project — branch protection on main, never bypass hooks or CI, observability scaled to blast radius, and explicit human-applied database migrations.
triggers:
  - new repo setup
  - branch protection
  - database migration
  - wire up Sentry
  - health endpoint
  - pre-commit failing
checks-label: Rules
checks:
  - Branch protection on main in the first hour of any project
  - Never --no-verify; fix the failure, not the check
  - Observability scaled to project profile (Sentry / health / analytics)
  - Migrations explicit, idempotent, and verified with a query after apply
version: 1.0
---


# Shipping Discipline (MANDATORY)

These rules apply to every project that ships code to a deployed environment. They're the safety net that lets me move fast without breaking things — for myself, six months from now, late at night, on a sketchy WiFi connection, two beers in.

## Branch protection on the default branch

Every project MUST have branch protection on `master` / `main` with the following rules enabled:

- **Require a pull request before merging** — no direct pushes, even solo. Set required approvals to 0 if I'm the only reviewer; the PR flow itself is what matters.
- **Require status checks to pass before merging** — name the CI check explicitly (e.g. `Lint · Test · Build`). Merge button stays grey until CI is green.
- **Require branch to be up to date before merging** — catches "tests passed on the branch but break on master because of an unrelated merge in between".
- **Block force pushes** — git history on the default branch is immutable.
- **Block deletions** — the default branch can't be deleted.

Set this up in the first hour of any new project, before the first PR lands. For existing projects without it, flag and offer to add it.

How to set it up: GitHub Settings → Branches → Add classic branch protection rule (or Settings → Rules → Rulesets if I prefer the new UI). Verify with `gh api repos/<owner>/<repo>/rules/branches/<branch>` — should return a non-empty array with `pull_request`, `required_status_checks`, `non_fast_forward`, and `deletion` rule types.

## Tests must pass before merge — no bypassing

Branch protection enforces "CI green to merge" at the GitHub level. The companion rule at the developer level: **never bypass git hooks or CI**.

- **Never** use `git commit --no-verify` or `git push --no-verify` unless I have explicitly asked for it for a one-off reason
- **Never** use `--no-gpg-sign` / `--no-edit` / similar to skip verification steps
- If a pre-commit hook is failing, **fix the underlying issue**, don't bypass the hook
- If a CI check is failing, **fix the failure**, don't disable the check
- If a test is flaky, fix the flake or quarantine it explicitly with a tracking issue, don't `.skip` it silently

The whole point of having tests + hooks + CI is that they catch the things I'd otherwise miss. Bypassing them defeats the purpose.

## Observability — scaled to project size

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

## Database migrations are explicit, never auto-applied on deploy

Database schema changes are the highest-blast-radius operation in any project. They MUST require an explicit human action to apply, never run automatically on deploy.

- Migrations live in version control (`supabase/migrations/`, `db/migrate/`, `prisma/migrations/`, etc.)
- They are written **idempotently** wherever possible — `DROP IF EXISTS` + `ADD`, `CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, etc.
- `DO $$ ... EXCEPTION` blocks for Postgres so a partial-failure doesn't leave the schema in a wedged state
- After applying, **always run a verification query** (e.g. `SELECT conname FROM pg_constraint WHERE conrelid = '...'::regclass`) to confirm the migration actually landed — "no rows returned" on a DDL statement does NOT prove anything was added
- Document the apply steps in the PR description so future-me knows what to do
- For Supabase specifically: paste the migration into the Dashboard → SQL Editor → New Query → Run, then verify with the inspection query

If a project DOES have automated migration apply (e.g. Rails, Django on a managed deploy pipeline), still verify the migration ran by checking the migration table after deploy.

## When in doubt

If I'm unsure whether one of these rules applies → apply it anyway. The cost of an unnecessary safety net is zero. The cost of skipping one is "production was broken / data was lost / users saw a stack trace and I didn't know why."

## Per-Project CLAUDE.md Snippets

Copy-paste blocks for per-project `CLAUDE.md` files, for projects with memory-pressure sensitive tests or background test watchers (vitest, jest --watch, etc.). Drop under `## Testing` or `## Development Workflow`:

```markdown
## Test Execution
- Run tests sequentially (not in parallel) to avoid memory pressure and flaky results
- Before running `git add -A` or `git status`, check for lingering background processes (vitest, dev servers) with `jobs` or `ps`
- Kill stale background test processes before git operations
```
