---
name: Google identities for Parnell Systems infra
description: Which Google accounts own which services for Parnell Systems — use the Workspace account for business infra, not personal Gmail
type: reference
originSessionId: b9ac413b-e558-4c42-8067-df36b8a14e30
---
# Google identities for Parnell Systems infra

Giles has (at least) four Google identities available in his browser:

1. **`giles@parnellsystems.com`** — Google Workspace account for Parnell Systems. **This is the canonical account for all Parnell Systems business infrastructure** (Google Ads, GA4, Google Search Console, Google Business Profile, Google Cloud if ever needed). Confirmed 2026-04-13 to have access to the GA4 property `G-W5KLWM7QB0` ("Parnell Systems Website").
2. **`gilesparnell@gmail.com`** — personal Gmail. Was used as the git author email on the W1 SEO commit that added the GA4 tag to `parnell-systems/website`, but the GA4 property itself lives on the Workspace account, not this one. Git author email ≠ Google account used for service creation.
3. **`giles@allconvos.ai`** — AllConvos account. Belongs to the (separate, Jesse-owned) AllConvos project. **Do not use for Parnell Systems infra.**
4. **`gilosofloops@gmail.com`** ("Gilo and Loops") — personal / creative project Gmail. Not business infra.

**Default rule:** For any new Parnell Systems service (Google Ads, Stripe ↔ Google link, etc.), assume `giles@parnellsystems.com` is the right identity unless Giles says otherwise. If a service already exists and you don't know who owns it, ask Giles to check `analytics.google.com` or the service admin panel — don't guess.

**Still to verify (as of 2026-04-13):** Whether `giles@parnellsystems.com` has the Administrator role (not just Editor/Viewer) on the GA4 property. Needed before linking Google Ads. Check via GA4 Admin → Property access management.

## How this came up

When scoping the Google Ads setup for the W3 pivot (see `ai-os/decisions/2026-04-13-001-google-ads-over-meta-for-paid-acquisition.md` in the website repo), the question was which Google account to sign into `ads.google.com` with. The recommendation is "same account that owns the GA4 property" because it gives one-click GA4 linking — so nailing down the Workspace-vs-Gmail question matters for any Google service work going forward, not just this one pivot.
