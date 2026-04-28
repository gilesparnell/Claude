---
name: WLC Current State
description: Whole Life Challenge tracker — current version, shipped features, and architecture as of 2026-04-28
type: project
---

## Version: 0.22.4 (live on Vercel)

**Note:** Earlier memory file `project_wlc_admin_config_sync.md` reflects v0.11.0 state (16 Apr 2026). This file supersedes it for current state.

## What's Shipped (0.11.0 → 0.22.4)

- **0.14.x** — Supabase selfReport + bonusApplied round-trip fixed; pure-logic tests opt out of jsdom (6.5× faster); notification re-notify fixes
- **0.15.x** — Edit past reflections from Journal; swipe day nav on CheckIn; trackpad/mouse-wheel swipe; tap date to reset to today
- **0.16.x** — Custom sleep hours per user; opt-in sharing of wellness + journal entries; always-visible OwnerSelector
- **0.17.x** — Opt-in sharing for exercise + mobility; user display name in hamburger menu
- **0.18.x** — Update toast summary + shareable per-version changelog links; /changelog public + mobile PWA fix; HTML entity decoding in changelog parser
- **0.19.x** — Preserve admin display-name edits; force Google account picker; macOS trackpad swipe fix; scoring breakdown table in leaderboard modal
- **0.20.x** — Yesterday gaps card; day-by-day habit grid; consistency analysis
- **0.21.x** — Collapsible Progress page sections with localStorage persistence
- **0.22.x** — Mobile habit grid; 6-section Progress page layout; bonus celebration overlay with confetti burst; login bug fix for pre-existing bonuses; "Patterns We're Seeing" moved into Habit Trends section

## Architecture (current)

### Data stores
- **Supabase** — user profiles, check-ins, journal entries, notifications, leaderboard
- **localStorage (`wlc-admin-config`)** — challenge dates, exercise/mobilise types, global hydration/sleep defaults. Still per-device, still drifts across devices. Not yet synced to Supabase.
- **`profiles.preferences` (Supabase jsonb)** — per-user overrides for `hydrationTargetMl`, `hydrationIncrementMl`, `sleepTargetHours`. Merged via `getEffectiveConfig(profile)`.

### Key invariants
- `DEFAULT_CONFIG.challengeStart` in `adminConfig.js` and `FALLBACK_START` in `dates.js` must stay manually in sync — dates tests catch drift
- `getEffectiveConfig(profile)` for user-facing surfaces; `getConfig()` for admin UI only
- `PERSONALISABLE_KEYS` whitelist in `sanitisePreferences` — any unknown key in preferences blob is stripped

## Deployment
- Vercel, auto-deploy from master
- Always ship via PR with squash merge (`gh pr merge --auto --squash`). Never direct push to master.
