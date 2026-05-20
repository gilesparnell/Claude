---
name: separation-disclosure-project
description: "Giles is going through amicable separation from Lisa (initiated Dec 2024). Active work in May 2026 is the financial disclosure pack. 55/45 split agreed (in Lisa's favour). Single-solicitor approach: Lisa's solicitor is driving; Melissa (Giles's) is sanity-checking only. Personal context exists; Giles has explicitly invited Claude to engage with it."
metadata: 
  node_type: memory
  type: project
  originSessionId: 562910d3-d90b-4e1f-947c-106c09f7bb2e
---

## Snapshot (21 May 2026, AEST)

Three active life threads Giles is juggling:
1. **Sell house** — 44 Koorangi Avenue, on market 3 months, new estate agent and renovations underway
2. **New job** — CV + Obsidian vault work in progress
3. **Financial separation** — THIS thread

**Solicitor arrangement (LOAD-BEARING):**
- Lisa's solicitor is **driving** the process (don't know name yet)
- Melissa is Giles's solicitor but used as **sanity check only** — they're using a single-solicitor approach to reduce costs
- Giles is collecting everything Lisa's solicitor requests; cross-checking with Melissa before sending

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

## Bank disclosure principle (LOAD-BEARING)

- For separation in AU family law, bank disclosure is about **proving access and transparency** (showing the account exists, is in his name, and he can access it) — NOT about disclosing balances or full transaction history.
- **Account confirmation letters** are the primary requirement (e.g. "Proof of FNB" letter).
- **Statements** are supplementary (useful for spotting hidden income/assets), not the minimum bar.
- Don't over-engineer "12 months of statements" pressure for bank accounts that only need a confirmation letter.

---

## Master Property Pool spreadsheet (Melissa's template)

**ID:** `1AASgOZ82YlLYML1VhwGWTKDSbZc9oz_4S5mVpJ10WFc`
**Tab name:** `'PTY. FORMAT'` (note the space and period)

**Column layout:**
| Col | Header | Purpose |
|---|---|---|
| A | Item | Description (includes account #s and key identifying info) |
| B | Full value (100%) | Gross amount (raw number, no formula) |
| C | Ownership / Allocation | Legal + financial split description |
| D | Giles Value (45%) | `=B*0.45` formula |
| E | Lisa Value (55%) | `=B*0.55` formula |
| F | Other's value | Trust etc |
| G | Custody | Joint / Giles / Lisa / Sold / TBD |
| H | Cash to Lisa | Asset rows: `=IF(G="Giles", E, IF(G="Lisa", -D, 0))`; Liability rows: `=IF(G="Giles", -E, IF(G="Lisa", D, 0))` |

**Row layout:**
- Rows 6-12: Property data (7 items)
- Row 14: Property Total
- Rows 18-24: Liabilities data (7 items)
- Row 25: Liabilities Total
- Row 26: Net
- Rows 30-33: Super data (4 items)
- Row 34: Super Total
- Row 38: Financial Resources (SA Trust)
- Row 39: FR Total
- Row 41: GRAND TOTAL
- Rows 43-50: Proposed 55/45 Settlement block
- Row 54: TOTAL CASH SETTLEMENT (=H41)

**Current values (21 May 2026, after extracting from uploaded docs):**

Property:
- 44 Koorangi Avenue (sale price estimate): $2,800,000
- 18 Copenhagen Way, UK: $610,972
- Landcruiser Prado: $36,000
- Patriot X1: $41,000
- NS&I Bonds (£16,525 @ 1.88 FX): $31,067
- Tesla shares (260.7971 shares on Stake): $151,030
- Crypto: $3,000

Liabilities:
- 44 Koorangi mortgage (ANZ acct 733021765): $1,262,142
- 18 Copenhagen Way mortgage: $430,501
- Lyn & Alan loan: $500,000
- Tesla finance (Plenti loan H235171971076): $72,841 (+$1,396 arrears flagged)
- Fridge (ZipMoney): $1,846
- Phone (Vodafone iPhone 16 Pro, 8/24 months left): $900
- SA Discovery: $0 (PAID OFF, now positive R4,042 balance)

Super:
- AMP SignatureSuper acct CN959826565 (Giles): $277,604
- AU Super (Lisa): $23,811
- UK Pension Giles (Standard Life £61,646 @ 1.88): $115,894
- SA Pension (Giles): $16,902

Financial Resources:
- SA Family Trust (Giles 25%, contested): $0

---

## Items removed from the pool

| Item | Reason |
|---|---|
| 38 Flamingo Villas, SA | $0 pending valuation; removed |
| 16 Donkin Drive, SA | $0 pending valuation; sole Giles |
| Jayco trailer | Already sold $5k, distributed 50/50 |
| Amazon shares | Sold/spent — Morgan Stanley confirms $0 available (April 2026 sales) |
| Household contents | TBD |
| Solar loan | Paid off |
| SA Discovery card | Paid off (now positive R4,042 — no longer a liability) |

---

## Disclosure folder structure

**Root folder ID:** `1EYmev62tNustsfay3rcHdBed_qF1kDA0` (owned by giloandloops@gmail.com, shared with both giles accounts)

Subfolders + status (as of 21 May 2026):
- `00 — Disclosure Index (v3)` — most recent clean version; older versions to trash
- `02 — Identity` — 3/4 ✅ (Passport Giles, Citizenship, Marriage cert); ⏳ Passport Lisa
- `03 — Real Estate / 44 Koorangi Avenue` — ✅ ANZ Loan Details
- `04 — Vehicles / Patriot, Tesla, Prado` — ✅ Prado brochure, Patriot brochure + selling research, Tesla loan schedule + remaining
- `05 — Liabilities & Loans` — empty by design (files cross-referenced from 03, 04, 08, 11)
- `06 — Shares & Crypto / Tesla, Amazon, NS&I, Bitcoin Etherium, Doge Shiba` — ✅ all uploaded
- `07 — Super & Pensions / UK, AU` — ✅ UK (Standard Life), AU (AMP); ⏳ AU Lisa, SA Giles, UK Lisa
- `08 — Bank Accounts / SA (FNB, Discovery), AU, UK` — ✅ SA done; AU and UK empty
- `09 — Tax / Giles` — empty
- `10 — Household Contents` — empty
- `11 — Mobile phone (Vodafone)` — ✅ Vodafone bill

---

## Open questions / pending with Lisa's solicitor and Melissa

1. **Super mechanism** — splitting orders vs cash offset (big impact on settlement number)
2. **Lyn & Alan loan ($500k)** — hard loan vs soft family loan; written documentation needed
3. **Capital gains on 44 Koorangi sale** — calculation worksheet
4. **18 Copenhagen Way intent** — sold or retained?
5. **Cost of sale (~$85k)** — Giles's view: absorbed by sale proceeds; needs confirm
6. **SA Family Trust** — contested whether part of pool; classification needed
7. **Lisa's UK pension** — TBC if applicable
8. **Tax obligations** — Giles 2024-25 + outstanding share-disposal CGT
9. **Lisa's solicitor name** — not yet known to Giles

---

## Two Google accounts in play

- **giles@parnellsystems.com** (Workspace) — for google-workspace MCP; can read/write disclosure folder, master spreadsheet, index doc
- **gilesparnell@gmail.com** — for claude_ai_Google_Drive MCP; owns personal docs in My Story folder

---

## Tool gotchas learned

- `modify_doc_text` requires character indices; no native find-and-replace. For doc rewrites, prefer `import_to_google_doc` (preserves markdown formatting). Creates new doc with new ID; user trashes old version manually.
- No "move file" or "trash file" tools — Giles does these manually
- `create_doc` lands in workspace user's root; use `create_drive_file` with `folder_id` for direct placement
- HTML-escape ampersands in folder names cause `&amp;` to render literally — pass raw `&` instead
- Spreadsheet currency formatting doesn't propagate to formulas that use multiplication
- For PDFs in Drive: use `get_drive_file_content` which extracts text via pypdf

---

## Key references

- **Disclosure folder:** https://drive.google.com/drive/folders/1EYmev62tNustsfay3rcHdBed_qF1kDA0
- **Master Property Pool (Melissa's template):** https://docs.google.com/spreadsheets/d/1AASgOZ82YlLYML1VhwGWTKDSbZc9oz_4S5mVpJ10WFc
- **Working spreadsheet (Giles's, with notes):** https://docs.google.com/spreadsheets/d/1xzCdwBTnp0Lc0MlgNl14rO3BJf-EpAaUYKbrDpuSSTY
- **Disclosure Index doc v3 (latest):** https://docs.google.com/document/d/1Z_QeHqhVmt-K9F7-oLgIeoT_5A9f-EINjL87UsRQPQg
- **My Story folder (DO NOT READ UNINVITED):** https://drive.google.com/drive/folders/1Vs8Cys9_wjbxbRG_cCzBR8TrzsfrGSRP
