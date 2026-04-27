---
name: skill-publishing-mandatory
description: Every new skill must be committed to gilesparnell/Claude git repo AND have a portal stub — no exceptions
type: feedback
---

Every time a skill is created, downloaded, installed, or modified — it MUST be:
1. Committed and pushed to the `gilesparnell/Claude` GitHub repo (`~/Documents/VSStudio/Claude/`)
2. Have a portal stub (frontmatter-only) in `~/Documents/VSStudio/Claude/skills/<slug>/SKILL.md`

The skill-publisher skill (`~/.claude/skills/skill-publisher/SKILL.md`) has been updated to enforce this as mandatory. A skill creation task is not considered complete until both git push and portal stub are done.

This applies to ALL skill origins: hand-written, plugin-installed, downloaded, AI-generated, or modified.
