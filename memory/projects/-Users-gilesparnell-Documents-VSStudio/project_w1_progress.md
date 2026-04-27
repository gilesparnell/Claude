---
name: W1 GTM Execution Progress
description: Tracks what's been completed in Week 1 of the GTM plan execution. Resume from here in new sessions.
type: project
---

## W1 GTM Plan Execution — Progress as of 2026-04-01

### Plan file
`parnell-systems/website/docs/plans/2026-03-31-001-feat-gtm-acceleration-revenue-growth-plan.md`

### Execution approach
- GTM plan executed week-by-week, each week as independent /ce:work scope (ADR-015)
- Giles completes his manual tasks first, then Claude runs all code tasks in one pass with real values

### COMPLETED

**GST Registration**
- Registered for GST via myGov/ATO on 2026-04-01
- Simpler BAS method, quarterly, cash basis
- ABN: 39 171 610 698 (sole trader, NSW 2101)

**ASIC Business Name**
- "Parnell Systems" registration submitted to ASIC, awaiting confirmation email

**Stripe Setup (TEST MODE)**
- Stripe CLI installed and authenticated (account: acct_1TGevo3ImpXttIUF)
- Statement descriptor: PARNELL SYSTEMS / PARNELL
- 4 products created:
  - Starter (prod_UFYnqi25X9sIC8)
  - Business (prod_UFYnX5ucPPpPij)
  - Professional (prod_UFYnt2qClefY0Q)
  - Setup & Installation (prod_UFYnZV1ayaBmid)

**Active Prices (11× monthly for annual = 1 month free):**
- Starter Monthly: price_1TH3fa3ImpXttIUFQ6qbEQ6L ($399/mo)
- Starter Annual: price_1TH3oW3ImpXttIUFcXHqIuUx ($4,389/yr)
- Business Monthly: price_1TH3fm3ImpXttIUFkOhuCqje ($599/mo)
- Business Annual: price_1TH3oX3ImpXttIUFLzkU0tvF ($6,589/yr)
- Professional Monthly: price_1TH3fx3ImpXttIUFbzuPZRrD ($799/mo)
- Professional Annual: price_1TH3oY3ImpXttIUFSVbq3mNG ($8,789/yr)
- Setup Full: price_1TH3g93ImpXttIUF5kyRJ0uS ($2,000)
- Setup 50% Off: price_1TH3gA3ImpXttIUFv3tHn4Fw ($1,000)

**Active Payment Links (test mode):**
1. Starter Monthly: https://buy.stripe.com/test_4gM7sE8Tl2SXdTrewA3gk00
2. Starter Annual: https://buy.stripe.com/test_14AcMYb1t9hldTragk3gk06
3. Business Monthly: https://buy.stripe.com/test_7sY00cedF3X13eNagk3gk02
4. Business Annual: https://buy.stripe.com/test_5kQ8wId9B9hl3eN1JO3gk07
5. Professional Monthly: https://buy.stripe.com/test_5kQ9AM2uX1OTcPn1JO3gk04
6. Professional Annual: https://buy.stripe.com/test_eVq4gsglN515eXv88c3gk08

**Old prices (archived):** price_1TH3fb, price_1TH3fm (qk718), price_1TH3fy (10× annual — replaced by 11×)

**Tested:** Business Annual payment link — checkout flow confirmed working.

**ADRs Created/Updated:**
- ADR-009: Updated — $2,000 setup, 1 month free annual (11×), tiered setup discounts
- ADR-014: 90-day pro-rata money-back guarantee, excludes setup fee
- ADR-015: Execute GTM plan week-by-week
- ADR-004 through ADR-013: Backfilled 10 decisions from prior 3 weeks

**Portal:** All ADRs pushed to gilesparnell/Claude, portal rebuilt.

**Walkthrough:** `claude-artefacts/docs/walkthrough-decisions-vs-learnings.md` — pushed to portal.

**GTM Plan (.docx):** Polished version at `docs/plans/GTM-Acceleration-Revenue-Growth-Plan.docx` + shared via Proof.

### WAITING ON GILES (circle back)

- **Meta Business Manager** — giles@parnellsystems.com account permanently banned by Meta's automated system (2026-04-01). Appeal rejected same day.
  - Plan: Create new FB account with personal email, let it warm up 1-2 days, then create Business Manager. Don't rush to ID verification.
  - Need: Facebook Pixel ID (format: 123456789012345)
  - CIRCLE BACK: Add Pixel integration once new account is set up
- **ASIC** — Giles cannot log into ASIC portal as of 2026-04-01. Confirmation still pending.
  - CIRCLE BACK: Confirm business name registration
- **Stripe live mode** — replicate test products + payment links when ready to go live

### COMPLETED (GA4)
- GA4 property created: Measurement ID `G-W5KLWM7QB0`
- Enhanced measurement: all toggles ON
- Data retention: set to 14 months
- Google Signals: enabled

### CODE TASKS (starting now with GA4 ID, Pixel deferred)

- B2: Create /privacy and /terms pages
- B3: Add /demos route
- B4: Remove placeholder testimonials
- B5: UTM parameter passthrough
- B6: Update index.html OG tags
- W1.1: Facebook Pixel integration — DEFERRED (no Pixel ID yet)
- W1.2: GA4 integration (G-W5KLWM7QB0) ✅ ready
- W1.3: useSEO hook + per-page meta tags
- W1.3b: @prerenderer/rollup-plugin + structured data (JSON-LD)
- W1.4: Sitemap + robots.txt
- W1.6: Branded OG image
- Update Pricing.tsx with $399/$599/$799 tiers, annual toggle, setup fee anchoring

### Confirmed Pricing Model

| Tier | Monthly | Annual (11×) | Setup (monthly) | Setup (annual) |
|---|---|---|---|---|
| Starter | $399/mo | $4,389/yr | $2,000 | $2,000 |
| Business | $599/mo | $6,589/yr | $2,000 | $1,000 (50% off) |
| Professional | $799/mo | $8,789/yr | $2,000 | $0 (waived) |

90-day pro-rata money-back guarantee on subscription. Setup fee non-refundable.
