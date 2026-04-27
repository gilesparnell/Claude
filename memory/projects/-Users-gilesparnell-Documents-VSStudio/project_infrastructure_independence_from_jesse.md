---
name: Infrastructure Independence from Jesse (W0)
description: Parnell Systems is mid-migration off shared Twilio + GoHighLevel infrastructure with ex-partner Jesse. W0 in master GTM plan, blocks W1+.
type: project
originSessionId: e5724829-649a-4138-8ae7-65147c9dc3bb
---
As of 2026-04-16, Parnell Systems is running a P0 migration off all infrastructure shared with ex-partner Jesse. This is the new **W0** in the master GTM plan at `parnell-systems/website/docs/plans/2026-03-31-001-feat-gtm-acceleration-revenue-growth-plan.md`. Full checklist at `parnell-systems/website/docs/plans/2026-04-16-001-ops-infrastructure-independence-from-jesse.md`.

**Why:** Two existential risks sit on shared infra with a disengaging ex-partner — accidental decommission of shared assets could take customers offline, and Google Ads (W3) can't turn on until new leads land on Parnell Systems' own infrastructure. Jesse is cooperative but disengaging ("moving onto other things, wants shared things shut down"), so the window to execute clean handover is now while he's still responsive.

**How to apply:** When Giles says "where are we on the Jesse migration", "what's next on W0", or asks about Twilio/GHL/customer-migration status, read the ops plan file (not this memory) for live checkbox state. Before suggesting anything in W1/W2/W3 that touches customer-facing infra, confirm W0 is done first — W3 Google Ads is explicitly gated on W0 completion.

**Key constraints:**
- GHL Starter Pack ($97/mo via HighLevelWizard affiliate) is hard-capped at 3 sub-accounts: Customer 1, Customer 2, Parnell Systems Marketing. Zero headroom. A 3rd customer forces either a GHL upgrade to $297/mo Unlimited, or moving Parnell Systems marketing off GHL.
- Twilio AU regulatory bundle approval can take hours to days — it's Step 2b in the ops plan and must be submitted first because it's a background clock.
- New Twilio numbers (not ports) — customers will see a phone number change, mitigated by a 14-day call-forwarding bridge on the old numbers (requires Jesse's cooperation, ~10 min of his time to set the forwarding config).
- Jesse's written agreement to a 14-day no-touch window is Step 0 of the ops plan — non-negotiable before any technical work starts.

**Related memory:** `allconvos/` is Jesse's separate business and is NOT part of this migration — do not touch. See existing memory.
