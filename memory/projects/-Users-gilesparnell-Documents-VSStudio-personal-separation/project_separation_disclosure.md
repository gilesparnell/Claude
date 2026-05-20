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
1. **Sell house** — 44 Koorangi Avenue, on market 3 months
2. **New job** — CV + Obsidian vault work in progress
3. **Financial separation** — THIS thread

**Solicitor arrangement (LOAD-BEARING):**
- Lisa's solicitor is **driving** the process (name unknown to Giles)
- Melissa is Giles's solicitor but used as **sanity check only** — single-solicitor approach to reduce costs
- Giles is collecting everything Lisa's solicitor requests; cross-checking with Melissa before sending

**How to apply:**
- Default to practical/logistics support for the disclosure work
- Giles has explicitly invited Claude to engage with the personal/emotional context. Do NOT read "My Story" folder uninvited but DO hold that context when he raises it
- Four core wounds + SA-return vision + 4-year transition plan documented (Conscious Uncoupling course, Circuit Breakers course)
- Do NOT push him toward disclosure-to-Lisa decisions about Jackie or prior infidelity — that's for him and a counsellor, not Claude
- When AU-family-law convention matters, default to "ask Melissa" rather than asserting

---

## Settlement convention (LOAD-BEARING)

- **55% Lisa / 45% Giles applied to the NET property pool** (not asymmetrically on assets vs liabilities)
- Both assets AND liabilities split at 45/55 in each row; this is the only way the % correctly applies to net
- Every row in the spreadsheet splits financially 45/55 in columns D and E
- Physical custody is a SEPARATE decision in column G
- Column H ("Cash to Lisa") translates custody into actual cash settlement
- Positive H = Giles pays Lisa; Negative H = Lisa pays Giles

## Bank disclosure principle

- Spirit: transparency / access — proving accounts exist, are in his name, other party can see them
- Practical requirement: **12 months of statements per account**, plus account confirmation letters
- Don't soften the "12 months" framing in disclosure docs

---

## Master Property Pool spreadsheet (Melissa's template)

**ID:** `1AASgOZ82YlLYML1VhwGWTKDSbZc9oz_4S5mVpJ10WFc`
**Tab name:** `'PTY. FORMAT'`

**Column layout:**
| Col | Header | Purpose |
|---|---|---|
| A | Item | Description (incl. account #s) |
| B | Full value (100%) | Gross amount |
| C | Ownership / Allocation | Legal + financial split |
| D | Giles Value (45%) | `=B*0.45` |
| E | Lisa Value (55%) | `=B*0.55` |
| F | Other's value | Trust etc |
| G | Custody | Joint / Giles / Lisa / Sold / TBD |
| H | Cash to Lisa | Asset rows: `=IF(G="Giles", E, IF(G="Lisa", -D, 0))`; Liability: `=IF(G="Giles", -E, IF(G="Lisa", D, 0))` |

**Row layout (current as of 21 May 2026):**
- Rows 6-12: Property data (7 items)
- Row 14: Property Total
- Rows 18-24: Liabilities data (7 items)
- Row 25: Liabilities Total
- Row 26: Net
- Rows 30-32: Super data (3 items — AU Giles, AU Lisa, UK Giles. SA Pension removed)
- Row 33: BLANK (SA Pension removed)
- Row 34: Super Total
- Row 38: BLANK (SA Family Trust removed)
- Row 39: FR Total (= 0)
- Row 41: GRAND TOTAL
- Rows 43-50: Proposed Settlement block
- Row 54: TOTAL CASH SETTLEMENT (=H41)

**Current pool figures (post-removal of SA Pension and SA Trust):**
- Combined net pool: $1,823,058
- Giles target (45%): $820,376
- Lisa target (55%): $1,002,682
- Variance: $0
- Total cash settlement (Giles → Lisa): ~$250,755

---

## Items removed from the pool entirely

| Item | Reason |
|---|---|
| Solar loan | Paid off |
| SA Discovery credit card | Paid off (now positive R4,042) |
| Amazon shares | Sold/spent |
| Jayco trailer | Sold $5k, distributed 50/50 |
| 38 Flamingo Villas, SA | Removed by agreement |
| 16 Donkin Drive, SA | Removed by agreement |
| Household contents | Inventory TBD |
| **SA Pension (Giles)** | Removed from pool |
| **SA Family Trust** | Removed completely from pool AND discussion |
| **ANZ ONE transactional account** | Provided as disclosure for transparency only; will be ~$0 shortly (drawn down on property maintenance); NOT in pool |

---

## Disclosure folder structure

**Root folder ID:** `1EYmev62tNustsfay3rcHdBed_qF1kDA0`

Top-level subfolders (02-10; no folder 11 anymore — Mobile was moved INTO 10):
- `00 — Disclosure Index (v6)` — latest; older versions to trash
- `02 — Identity` — 3/4 ✅; Passport Lisa ⏳ from Lisa
- `03 — Real Estate / 44 Koorangi Avenue` — ✅ ANZ Loan Details; rest pending. 18 Copenhagen now Lisa's responsibility
- `04 — Vehicles / Patriot, Tesla, Prado` — all ✅ including new Tesla valuation
- `05 — Liabilities & Loans` — empty (cross-referenced from 03, 04, 10)
- `06 — Shares & Crypto / Tesla, Amazon, NS&I, Bitcoin Etherium, Doge Shiba` — all ✅
- `07 — Super & Pensions / UK, AU` — Giles ✅; Lisa items 👤
- `08 — Bank Accounts / SA (FNB, Discovery), AU (Bankwest, ANZ), UK` — SA + AU mostly done; UK Lloyds pending
- `09 — Tax / Giles` — empty
- `10 — Household Contents` — contains: Mobile phone (Vodafone) ✅, Fridge Loan ⏳, inventory ⏳

---

## Open questions / pending

1. **Super mechanism** — splitting orders vs cash offset
2. **Lyn & Alan loan ($500k)** — hard loan vs soft family loan; documentation
3. **Capital gains on 44 Koorangi sale** — calculation worksheet
4. **18 Copenhagen Way** — Lisa providing specifics
5. **Cost of sale (~$85k)** — Giles's view: absorbed by sale proceeds
6. **Lisa's solicitor name** — not yet known
7. **NAB and UK Lloyds 12 months of statements** — Giles to gather

---

## Two Google accounts in play

- **giles@parnellsystems.com** (Workspace) — google-workspace MCP; read/write disclosure folder + spreadsheets + docs
- **gilesparnell@gmail.com** — Claude AI Drive MCP; owns personal docs in My Story folder

---

## Tool gotchas learned

- `modify_doc_text` requires character indices; no native find-and-replace. Use `import_to_google_doc` for rewrites (creates new doc with new ID; user trashes old version)
- No "move file" or "trash file" tools for Drive — Giles does manually
- `create_doc` lands in workspace user's root; use `create_drive_file` with `folder_id` for direct placement
- HTML-escape ampersands in folder names cause `&amp;` literal — pass raw `&` instead
- For PDFs in Drive: use `get_drive_file_content` (pypdf text extraction)
- For LOCAL PDFs: can use Read tool (extracts as images) + Bash `mv` for renaming

---

## Key references

- **Disclosure folder:** https://drive.google.com/drive/folders/1EYmev62tNustsfay3rcHdBed_qF1kDA0
- **Master Property Pool (Melissa's template):** https://docs.google.com/spreadsheets/d/1AASgOZ82YlLYML1VhwGWTKDSbZc9oz_4S5mVpJ10WFc
- **Working spreadsheet (Giles's, with notes):** https://docs.google.com/spreadsheets/d/1xzCdwBTnp0Lc0MlgNl14rO3BJf-EpAaUYKbrDpuSSTY
- **Disclosure Index doc (latest):** Index v6 — `1dWJsW5ZBCRwbWNT_F8tcDctV6d4yH0cGL1Xx0yAMGrE` (or check folder for latest version)
- **My Story folder (DO NOT READ UNINVITED):** https://drive.google.com/drive/folders/1Vs8Cys9_wjbxbRG_cCzBR8TrzsfrGSRP
