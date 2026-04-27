---
name: WLC admin config is localStorage-only, with a per-user Supabase override layer (post-0.11.0)
description: The admin config (challenge dates, exercise/mobilise types, scoring) still lives only in localStorage per-device. Three hydration/sleep fields gained a per-user Supabase override via profiles.preferences in 0.11.0. Everything else still drifts across devices.
type: project
originSessionId: f2c9c203-7bd5-4b04-8015-f60825c399a7
---
The Whole Life Challenge admin config is split across two stores after 0.11.0 (shipped 16 Apr 2026):

## Still localStorage-only (per-device, drifts across devices)

`src/lib/adminConfig.js` keeps the **admin global** in `localStorage` under `wlc-admin-config`. No Supabase sync. This covers:

- `challengeStart`, `challengeDays` — the big drift hazard
- `exerciseTypes`, `mobilizeTypes` — admin-defined dropdown options
- `hydrationTargetMl`, `hydrationIncrementMl`, `sleepTargetHours` — **global defaults**, which each user can override (see below)

**Why:** The app was built quickly as a personal tracker — multi-device admin sync wasn't in scope, and hasn't been asked for.

**How to apply:** When touching anything date- or admin-config-related:
1. `DEFAULT_CONFIG.challengeStart` in `adminConfig.js` AND `FALLBACK_START` in `dates.js` must be kept manually in sync. The dates tests catch drift.
2. If you change challenge dates, assume at least one device has a stale localStorage override — either tell the user to revisit the Admin page on every device, or clear storage. The PR #6 bug (mobile showed "day 2 / 75", desktop showed "day 1") was caused by this.
3. Moving `wlc-admin-config` to Supabase would fix this entirely. Not done yet.

## Per-user Supabase-backed overrides (added in 0.11.0)

Three fields have a per-user override layer on `profiles.preferences` (jsonb column, migration `20260415000011_add_preferences_to_profiles.sql`):

- `hydrationTargetMl`
- `hydrationIncrementMl`
- `sleepTargetHours`

`src/lib/adminConfig.js` exports `getEffectiveConfig(profile)` which merges the global config with a whitelisted, range-checked slice of `profile.preferences`. The whitelist is `PERSONALISABLE_KEYS` — any other key in a preferences blob is stripped by `sanitisePreferences`. So even if someone hand-crafts a preferences value trying to override `challengeDays`, the app will ignore it.

**When to call `getEffectiveConfig` vs `getConfig`:**
- User-facing surfaces (CheckIn's hydration card, Progress page's sleep target band) use `getEffectiveConfig(profile)` so the user's own preferences win
- The Admin page still reads the raw global via `getConfig()` — the admin UI is about the global defaults, not any one user's override

**Adding a new personalisable field later:**
1. Add it to `DEFAULT_CONFIG` with a sensible default
2. Add it to `PERSONALISABLE_KEYS`
3. Add a range check to `PREFERENCE_RANGES` in `sanitisePreferences`
4. Add a field to `FIELD_META` in `src/pages/MyPreferences.jsx` so the form renders it
5. Update `CheckIn.jsx` (or wherever it's read) to use the effective config
