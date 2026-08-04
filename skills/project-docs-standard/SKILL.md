---
title: Project Documentation Standard
scope: global
category: workflow
icon: &#128218;
description: Mandatory documentation standard v2 — full artefact set (use-case stories, domain model, sequence diagrams, API contracts, architecture overview, ADRs, runbook) canonical as markdown+SVG in the repo, rendered to a Deep Ocean HTML site by a tested build script.
triggers:
  - project docs
  - documentation site
  - documentation standard
  - plan-progress dashboard
  - ADR
  - runbook
  - doc standard
checks-label: Rules
checks:
  - Markdown + SVG in-repo are canonical; HTML is generated, never hand-edited
  - Reverse-engineer drafts from code; the owner supplies intent and rationale
  - Sequence diagrams draw known defects in — a diagram that hides them lies
  - Gate before content — never publish private docs before the access gate is verified
version: 2.0
---

# Project Documentation Standard v2

Every project gets a complete documentation set. **Markdown + SVG in the repo are canonical; HTML is generated output, never hand-edited** (a short list of hand-built exceptions: the architecture and domain-model SVGs, the plan-progress dashboard, the user guide).

## The artefact set

```
<repo>/
├── README.md                     # front door, ≤60 lines: one-liner, stack, quickstart,
│                                 # linked Documentation table. Nothing else.
├── CONTEXT.md                    # domain glossary
└── docs/
    ├── product/use-cases.md      # stories by actor, each traceable to shipped code or a plan
    ├── architecture/
    │   ├── overview.md           # narrative + architecture.svg + tech table w/ ADR links
    │   ├── domain-model.md/.svg  # business concepts — NOT the DB schema
    │   ├── data-model.md         # ERD + table notes, GENERATED from a captured schema snapshot
    │   ├── schema-snapshot.sql   # authoritative DDL with provenance header
    │   ├── sequences/NN-*.md     # 3–6 key flows, mermaid source, file:line cited
    │   └── api/                  # openapi.yaml + api-contracts.md (incl. RLS semantics
    │                             # when the database IS the API)
    ├── decisions/
    │   ├── decisions.md          # tactical in-flight log
    │   └── adr/NNNN-*.md         # promoted long-lived decisions + index
    ├── operations/runbook.md     # deploy, env, migrations, backup/restore, incidents
    ├── diagrams/plan-progress.html
    └── plans/ · handoff/
```

## Authoring rules (pilot-proven, Aug 2026)

1. **Reverse-engineer drafts from code**; the owner supplies intent. Observed derivability: schema→ERD ~100%, routes→OpenAPI ~90%, config→tech inventory ~80%, flows→sequences ~60%, domain model ~50%, stories ~30%, tech rationale 0% — that last one is an owner session, recorded in ADRs.
2. **Capture the schema from the live database**, not from migrations — migrations lie by omission (the pilot found four tables with no migration source). Commit the snapshot with a provenance header.
3. **Sequence diagrams draw defects in.** Known bugs and wrinkles appear on the diagram, marked as such.
4. **ADRs stay minimal** (1–3 sentences + optional consequences) and must pass a qualification test: hard to reverse, surprising without context, a real trade-off. Tactical calls stay in decisions.md.
5. **SVGs carry explicit width/height** — viewBox alone renders thumbnail-sized on GitHub.
6. **Render-verify every mermaid block** before commit (and never put `;` inside sequence-note text).
7. **Every artefact cites its sources** (file:line); every claim must be traceable.

## Publication rule

- Build script renders docs/ to a self-contained dark-theme HTML site (TDD'd; markdown via `marked`; mermaid pre-rendered to SVG; output gitignored and disposable).
- **Public repo → GitHub Pages** from /docs, sanitised.
- **Private repo → an access-gated internal portal.** In-repo markdown needs no gate — repo visibility is the protection; the gate is for the rendered site.

### ⛔ Gate before content

**Never push private content to a publicly-reachable host before the access gate over that exact path is created AND verified** (private window → login challenge; wrong-identity attempt rejected). A gate on one path proves nothing about a sibling path. Verify the gate against a placeholder, then deploy real content.

## Replication checklist

1. Snapshot schema → data model
2. Route/config extraction → API contracts + tech inventory
3. Flow traces → sequence diagrams (pick 3–6 by user value)
4. Stories draft → owner review gate
5. Domain model + architecture SVGs (hand-built)
6. ADR seed → owner rationale session gate
7. Runbook consolidation (the README often already holds pieces — move, don't duplicate)
8. README front door rewrite LAST, when link targets exist
9. Copy build script + tests; verify gate, then wire publication
10. plan-progress dashboard + correct stale plan frontmatter while there
