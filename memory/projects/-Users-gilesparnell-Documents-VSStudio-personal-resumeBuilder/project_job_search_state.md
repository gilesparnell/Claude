---
name: project-job-search-state
description: "Current state of Giles's 2026 job search — active pipeline, in-flight decisions, recently-passed roles. Snapshot as of 2026-05-28; goes stale fast — check the handoff log for newer state before acting."
metadata: 
  node_type: memory
  type: project
  originSessionId: f84e286d-b1c4-475a-ab1d-f25fd73beb52
---

Snapshot as of **2026-05-28 AEST**. For latest state always read `docs/handoff/handoff.md` first — that's the live thread.

**Active pipeline**
- **V2 AI — Director, AI Engineering (Sydney)**: status `Considering`. Cover letter rewritten + technical retune feedback drafted (in `~/Downloads/2026-05-26-v2ai-application-feedback.html`). Direction-pushback file flags conflict with hard-pass on Director roles (in `~/Downloads/2026-05-26-direction-pushback.html`). **Decision still pending** — Giles has the rewrite but hasn't sent it.
- **Rosewood / climate-tech BA/PO**: `Passed` — comp ceiling ~$130–180k vs his $298k floor.

**Tracking spreadsheet (REPLACES the earlier one)**
- URL: https://docs.google.com/spreadsheets/d/1PKSjBCxYoJ-RdQ2E4gHqz5hOauhS39fohC3MwmjDAm8/edit
- Old URL (`1Env6dGLx9yUQPCPjiYENjvkjBEwlsrhR4ihHdCzU8CE`) is DEPRECATED — do not use, do not reference
- **TAB STRUCTURE MATTERS** (got this wrong once — Giles corrected it):
  - **`status`** tab = the application log. **ADD NEW ROLES HERE.** Giles actively reorganises columns — READ THE TAB LIVE for current structure rather than trusting a pinned column order. As of 2026-05-28 it had: Date submitted · Role · Org · Status · Notes · Latest update date · Contact · Number · Comp · Bucket.
  - **`AI's`** tab = Action Items (A.I. = Action Items, NOT AI roles). Do NOT put roles here. Holds Giles's own follow-up tasks.
- **Dates are real date values** (ISO/serial), NOT text — converted 2026-05-28 so the column is filterable/sortable. Preserve this; don't write text dates like "28th May".
- **Role cells are hyperlinks** to the job posting where a URL exists (`=HYPERLINK(url, role)`). The standalone Link column was removed. New roles: put the posting URL as a hyperlink on the Role cell, not a separate column.
- Newest-first ordering: new roles go at row 2 (top). Considering/unsubmitted rows may have a blank Date submitted (open question whether to use a proxy pipeline-entry date).

**Pipeline gaps still to work**
- The career-direction plan's top targets (Operating Partner at AU VCs, Strategic TAM at AI labs, AI PM at later-stage) have NOT been worked yet — these are the lanes that match comp floor + role shape. Open thread #4 from `docs/plans/2026-04-29-002-career-progression-options.md`. (Field CTO removed from targets 2026-05-28 — now a hard pass.)
- Manual logged-in sweep needed for: AGL Workday, Origin LinkedIn, EnergyAustralia careers, AEMO SuccessFactors — gated boards that likely have Head-of-Product seats in the $298k+ band but didn't surface through scripted scans.

**Hard pass list (per career-direction plan)** — do not recommend these:
Director/Head/VP Engineering · manager-of-managers eng roles · pre-sales SE/SA at quota-carrying enterprise software · FDE / Senior IC at AI-first cos · Customer Engineer at AI infra · Implementation Lead at AI-app cos · quota-carrying Sales Eng · Big-4 consulting · bootcamp educator · **Field CTO / Office of the CTO** (reversed 2026-05-28, was top target #2 — doesn't want to own technical strategy for a host of customer companies; also customer-facing-heavy vs his internal-systems background).

Related: [[project-comp-floor]] for the comp maths; [[feedback-gmail-no-send]] for the Gmail scope rule.
