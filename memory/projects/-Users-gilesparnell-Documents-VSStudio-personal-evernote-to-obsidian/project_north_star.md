---
name: project-north-star
description: The two outcomes this project exists to deliver — drives every scope/categorisation/deletion judgement call
metadata: 
  node_type: memory
  type: project
  originSessionId: f2fe18f7-9242-4e41-b6c1-ba2af1316591
---

The evernote-to-obsidian project exists to deliver two outcomes:

1. **Fully process Evernote imports into Obsidian with categorisation that supports interview roleplay preparation.** Categories must be useful for the operator preparing for interviews — surfacing relevant past work, lessons, STAR stories, AWS LP examples, technical deep-dives. Categorisation that doesn't serve that goal is overhead.

2. **Hard-delete irrelevant / temporary / rubbish notes outright.** The vault should end up as a curated knowledge brain, not an archive of every scrap the user ever captured in Evernote. When in doubt between "keep but tag as low-value" vs "delete", **lean delete**. The operator explicitly opted into hard-deletion on 2026-05-26 for tiny-body notes; that bias applies to other low-value clusters too (likely candidates: image-only Skitch screencaps with no contextual value, duplicate `.N.md` imports where the body matches the original, web-clippings the operator hasn't revisited in years).

**Why:** Two goals together = a knowledge graph dense with interview-relevant signal and free of noise. Either goal alone would fail — full categorisation of rubbish is wasted effort; deletion without surfacing the interview-relevant content leaves the operator without prep material.

**How to apply:**

- When deciding what new MOCs / types / tags to add: ask "does this help the operator find interview material?" If yes, build it. If it's organisational housekeeping with no retrieval use, skip.
- When deciding whether a cluster of notes should be classified, quarantined, or deleted: default to deletion for anything that looks like an import artefact, throwaway capture, or pre-2018 work-context note that has no career signal. Default to classification for anything with a clear interview / lessons / STAR / technical-deep-dive shape.
- When the user asks "what's next" mid-project: frame options in terms of (a) what would lift interview-prep readiness, (b) what would reduce noise. Pure operational metrics (rules-catch %, auto-rate) matter but should be reported as instruments toward those two goals, not as goals themselves.
- The 566-note review queue analysis (2026-05-26) found 75 tiny-body notes worth purging and 332 single-embed clippings worth classifying. That ratio is informative for future chunks — expect ongoing deletion alongside classification, not just classification.

Related: [[feedback-handoff-runner-tag]] — the operator runs classifier batches manually, so destructive decisions stay reviewable.
