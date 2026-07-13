---
title: Versioning Discipline
scope: global
category: workflow
icon: &#128290;
description: Every deployed project tracks a human-readable version, displays it in-app, and bumps it with a CHANGELOG entry in the same commit as every shipping PR.
triggers:
  - version bump
  - changelog entry
  - semver
  - release entry
  - in-app version display
checks-label: Rules
checks:
  - Bump version + CHANGELOG in the same commit as the code change
  - Display vX.Y.Z (sha7) in footer, /health, or --version
  - CHANGELOG entries have "What's new" then "Under the hood"
  - Extend recent entries as version ranges instead of diary-of-fixes headings
version: 1.0
---


# Versioning Discipline (MANDATORY)

Every project that ships code to a deployed environment MUST track a human-readable version and display it in-app. Every PR that ships code MUST bump that version and add a CHANGELOG entry **in the same commit as the code change**. This is non-negotiable.

Why: I want to be able to look at a deployed app and tell, in two seconds, which version is running. "Is this the version with the fix?" is a real question and the answer should never require opening DevTools.

## Source of truth for the version number

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

## Bump rules (semver)

- **patch** (`0.0.x`) — bug fix, copy tweak, dependency bump, refactor with no behaviour change
- **minor** (`0.x.0`) — new feature, new page/route, new tracked event, new env var, new public API
- **major** (`x.0.0`) — breaking change. Ask before bumping major.

Don't be afraid of `1.0.0`. Semver 1.0 means "stable interface, backwards-compatible changes go in 1.x" — it does NOT mean "complete forever" or "massive audience". A solo project with real users in production has earned 1.0.

## CHANGELOG.md format

Every project gets a `CHANGELOG.md` at the repo root. Each release entry has **two** subsections, in this order:

1. **What's new** — customer-facing outcomes, written in the user's language. Things they'll notice, feel, or ask about. No file names, no function names, no architectural justification. If someone who has never seen the code read it, they should understand what changed for them.

2. **Under the hood** — technical detail for future-me debugging. File paths, function names, rationale, links to issues, why-we-chose-X-over-Y. This section is rendered in a dimmer visual style on any in-app changelog page so the user-facing bullets dominate.

Template: see WLC `CHANGELOG.md` for the reference format.

> **Good** What's new bullet: *"Job descriptions you paste now auto-format with one click"* — outcome-focused, no code references.
> **Bad**: *"Added auto-format function to JobDescriptionEditor.tsx"* — names a file, not a user outcome.

## When to create a new entry vs. extend an existing one

**Don't let the changelog become a diary of "fixing the previous fix."** If a PR lands within the same development burst as the one before it (rough rule: within the last ~72 hours, or still actively polishing a just-shipped feature), **extend the previous entry in place** instead of creating a new heading. Update the heading to a version range like `[0.10.0 → 0.10.3]` so the range tells the story of multi-stage delivery.

| Situation | Action |
|---|---|
| New user-visible feature, new page, new tracked event | **New entry** with the current version as the heading |
| Bug fix or polish on a feature shipped in the last ~72 hours | **Extend the previous entry**. Update the heading to a range (`[X.Y.Z → X.Y.Z+n]`). Fold new detail into the existing "Under the hood". |
| Bug fix in something that's been stable for weeks/months | **New entry** — this is a legit regression worth its own heading |
| Pure dep bump / refactor with no user impact | **Extend the previous entry** with a one-line "Under the hood" note, or new entry if no recent one exists |

`package.json` still bumps on every PR so the footer always shows the exact deploy. The CHANGELOG collapses related churn into a single narrative. The version in the footer may be higher than the most recent heading in the changelog — that's expected, the range in the heading signals the span.

**Rule of thumb:** reading the /changelog page for the first time should feel like reading a product newsletter, not a commit log. Each entry answers "what did this release do for me?" — not "what bug did Claude accidentally ship last week?"

## In-app display

Display the version somewhere unambiguous and persistent:
- **Web frontend**: small monospace text in the page footer, low contrast, doesn't compete with content. Format: `vX.Y.Z (sha7)`
- **`/health` endpoint** (if it exists): include version + build timestamp in the response
- **Backend service / CLI**: log the version on startup; expose it via `--version` flag and/or a `/version` endpoint
- **Mobile app**: standard "About" screen + crash report metadata

## When you can skip the bump

ONLY skip the version bump for PRs that touch:
- Documentation only (README, CHANGELOG itself, project CLAUDE.md)
- Repository-meta files (.gitignore, .editorconfig)
- Local-only tooling that doesn't ship (test helpers that aren't run in CI)

If you're unsure → bump. The cost of an unnecessary patch bump is zero. The cost of a deploy that doesn't update the version is "I can't tell what's running."

## Bootstrap step for new projects

When starting a new project (or onboarding to one without versioning):

1. Set the version source (`package.json` etc.) to a starting value:
   - Brand new project → `0.1.0`
   - Project that's already in real use → `0.9.0` or `1.0.0` depending on stability
2. Create `CHANGELOG.md` at repo root with the conventions header + first entry
3. Wire the version into the build-time injection (Vite `define`, Webpack `DefinePlugin`, etc.)
4. Add the version display to the footer / health endpoint / CLI
5. Add this rule (and the bump-on-every-PR commitment) to the project's local `CLAUDE.md` so it's discoverable from the project root, not just the global one

Reference implementation: WLC repo.
