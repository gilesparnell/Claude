---
name: separation-disclosure-project
description: "Giles is going through amicable separation from Lisa (initiated Dec 2024). Active work in May 2026 is the financial disclosure pack for Lisa's solicitor. 55/45 split agreed (in Lisa's favour). Personal context exists; Giles has explicitly invited Claude to engage with it."
metadata: 
  node_type: memory
  type: project
  originSessionId: 562910d3-d90b-4e1f-947c-106c09f7bb2e
---

## Snapshot (21 May 2026, AEST)

Three active life threads Giles is juggling:
1. **Sell house** — 44 Koorangi Avenue, on market 3 months, new estate agent and renovations underway
2. **New job** — CV + Obsidian vault work in progress
3. **Financial separation** — THIS thread, the bulk of recent work

**Why this work:** Giles's solicitor (Melissa) needs the disclosure pack before financial settlement can complete. Lisa's solicitor has provided a list of requested items. Property pool ~$1.71M net.

**How to apply:**
- Default to practical/logistics support for the disclosure work
- Giles has explicitly invited Claude to engage with the personal/emotional context. Do NOT read the "My Story" folder uninvited but DO hold that context when he raises it
- Four core wounds + SA-return vision + 4-year transition plan are documented (Conscious Uncoupling course, Circuit Breakers course)
- Do NOT push him toward disclosure-to-Lisa decisions about Jackie or prior infidelity — that's for him and a counsellor, not Claude
- When AU-family-law convention matters, default to "ask Melissa" rather than asserting

---

## Settlement convention (LOAD-BEARING)

- **55% Lisa / 45% Giles applied to the NET property pool** (not asymmetrically on assets vs liabilities)
- Both assets AND liabilities split at same 45/55 ratio in each row; this is the only way the % applies correctly to net. Giles asked about asymmetric split and we confirmed it would over-distribute to Lisa
- Every row in the spreadsheet splits financially 45/55 in columns D and E
- Physical custody is a SEPARATE decision tracked in column G
- Column H ("Cash to Lisa") translates custody into the actual cash settlement amount
- Positive H = Giles pays Lisa; Negative H = Lisa pays Giles

---

## Master Property Pool spreadsheet (Melissa's template)

**ID:** `1AASgOZ82YlLYML1VhwGWTKDSbZc9oz_4S5mVpJ10WFc`
**Tab name:** `'PTY. FORMAT'` (note the space and period)

**Column layout (current):**
| Col | Header | Purpose |
|---|---|---|
| A | Item | Description |
| B | Full value (100%) | Gross amount (raw number, no formula) |
| C | Ownership / Allocation | Legal + financial split description |
| D | Giles Value (45%) | `=B*0.45` formula (or `=B` / `0` for special rows) |
| E | Lisa Value (55%) | `=B*0.55` formula |
| F | Other's value | Trust etc |
| G | Custody | Joint / Giles / Lisa / Sold / TBD |
| H | Cash to Lisa | Formula derived from G + D/E (signs flip between asset and liability sections) |

**Row layout (current):**
- Rows 6-12: Property data (7 items)
- Row 14: Property Total
- Rows 18-24: Liabilities data (7 items)
- Row 25: Liabilities Total
- Row 26: Net (Property - Liabilities)
- Rows 30-33: Superannuation data (4 items)
- Row 34: Super Total
- Row 38: SA Family Trust (Financial Resources)
- Row 39: FR Total
- Row 41: GRAND TOTAL
- Rows 43-50: Proposed 55/45 Settlement block (live formulas referencing row 41)
- Row 54: TOTAL CASH SETTLEMENT (=H41)

**H column formulas:**
- Asset rows: `=IF(G="Giles", E, IF(G="Lisa", -D, 0))`
- Liability rows: `=IF(G="Giles", -E, IF(G="Lisa", D, 0))`

**Current numbers (21 May 2026):**
- Combined net pool: $1,713,543
- Giles target (45%): $771,094
- Lisa target (55%): $942,449
- Variance from target: $0 (math balanced)
- **Total cash settlement (Giles → Lisa): $195,102**
  - Property: +$79,157 (Lisa receives — Giles keeping NS&I, Tesla shares, Crypto)
  - Liabilities: -$46,030 (Lisa pays — sharing Tesla finance, Phone, Discovery that Giles physically pays)
  - Super: +$161,975 (Lisa receives — each keeps own super, Giles pays Lisa cash equivalent)
  - FR: $0

**Big lever to flag:** $161,975 of the $195k is Super. If Super uses Splitting Orders (joint legal mechanism), all four Super rows flip to `Joint` and settlement drops to ~$33,127. Pending Melissa's input.

---

## Items removed from the pool (per Giles's decisions)

| Item | Reason |
|---|---|
| 38 Flamingo Villas, SA | $0 pending valuation; removed for now |
| 16 Donkin Drive, SA | $0 pending valuation; sole Giles |
| Jayco trailer | Already sold $5k, distributed 50/50 |
| Amazon shares | Sold/spent prior to disclosure — separate note in 06 folder |
| Household contents | TBD, not in current pool |
| Solar loan | Paid off |

---

## Disclosure folder structure

**Root folder ID:** `1EYmev62tNustsfay3rcHdBed_qF1kDA0` (owned by giloandloops@gmail.com, shared with both giles accounts)

Subfolders (all created):
- `00 — Disclosure Index` (Google Doc, v2 clean) — `1sHWo-4BJhajRhC9411B6lR-0jsffDZHqqHz9eXRCDbo`
- `00 — Disclosure Index` (old v1 with `[⧗]` notation — Giles to trash when ready)
- `02 — Identity` — Passport Giles, Citizenship, Marriage cert ✅; Passport Lisa ⏳
- `03 — Real Estate` — 44 Koorangi mortgage stmt ✅; titles/valuations ⏳
- `04 — Vehicles` — Landcruiser valuation ✅; Patriot/Jayco/Tesla ⏳
- `05 — Liabilities & Loans` — all ⏳
- `06 — Shares & Crypto` — all ⏳; Amazon disposal note inside (`1mTkrNwDgoX0dCDZN41lVmahkyu4FEhYW`)
- `07 — Super & Pensions` — all ⏳
- `08 — Bank Accounts & Statements` — all ⏳
- `09 — Tax` — all ⏳
- `10 — Household Contents` — ⏳
- `11 — Mobile phone (Vodafone)` — added 21 May

---

## Open questions / pending with Melissa

1. **Super mechanism** — splitting orders vs cash offset (big impact on settlement number)
2. **Lyn & Alan loan ($500k)** — hard loan vs soft family loan; written documentation needed
3. **Capital gains on 44 Koorangi sale** — calculation worksheet
4. **18 Copenhagen Way intent** — sold (default assumed) or retained?
5. **Cost of sale (~$85k)** — Giles's view: absorbed by sale proceeds; Melissa to confirm
6. **SA Family Trust** — contested whether part of pool; classification needed
7. **Lisa's UK pension** — TBC if applicable
8. **Tax obligations** — Giles 2024-25 + outstanding share-disposal CGT
9. **Cash flows tab vs same sheet** — Giles chose same sheet (G + H columns added)

---

## Two Google accounts in play

- **giles@parnellsystems.com** (Workspace) — for google-workspace MCP; can read/write disclosure folder, master spreadsheet, index doc
- **gilesparnell@gmail.com** — for claude_ai_Google_Drive MCP; owns personal docs in My Story folder

---

## Tool gotchas learned

- `modify_doc_text` requires character indices; no native find-and-replace. For doc rewrites, prefer `import_to_google_doc` (preserves markdown formatting)
- No "move file" or "trash file" tools — Giles does these manually
- `create_doc` lands in workspace user's root; use `create_drive_file` with `folder_id` for direct placement
- HTML-escape ampersands in folder names cause `&amp;` to render literally — pass raw `&` instead
- `import_to_google_doc` creates a new doc with new ID (changes link)
- Spreadsheet currency formatting doesn't propagate to formulas that use multiplication; Giles applies via Format menu manually

---

## Key references

- **Disclosure folder:** https://drive.google.com/drive/folders/1EYmev62tNustsfay3rcHdBed_qF1kDA0
- **Master Property Pool (Melissa's template):** https://docs.google.com/spreadsheets/d/1AASgOZ82YlLYML1VhwGWTKDSbZc9oz_4S5mVpJ10WFc
- **Working spreadsheet (Giles's, with notes):** https://docs.google.com/spreadsheets/d/1xzCdwBTnp0Lc0MlgNl14rO3BJf-EpAaUYKbrDpuSSTY
- **Disclosure Index doc v2:** https://docs.google.com/document/d/1sHWo-4BJhajRhC9411B6lR-0jsffDZHqqHz9eXRCDbo
- **My Story folder (DO NOT READ UNINVITED):** https://drive.google.com/drive/folders/1Vs8Cys9_wjbxbRG_cCzBR8TrzsfrGSRP
