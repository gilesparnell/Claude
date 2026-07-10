---
name: skill-publisher
title: Skill Publisher
scope: global
category: tooling
icon: 📡
version: 2.0
triggers:
  - add this as a skill
  - save this as a skill
  - publish this skill
  - create a walkthrough
  - add to the portal
checks:
  - Every new or modified skill is committed AND added to the portal
  - Portal SKILL.md = frontmatter + full body; the Action renders the page
  - Never hand-edit the generated index or detail pages
  - Preview with npm test + npm run build before pushing
description: >
  The workflow for turning a reusable pattern into a published portal skill.
  Use whenever a skill or walkthrough is created, installed, or modified and needs
  to appear on the knowledge portal. Triggers on 'add this as a skill', 'publish
  this skill', 'add to the portal', 'create a walkthrough'.
---

# Skill Publisher

The workflow for turning a reusable pattern into a published portal skill.

## What it does

Every skill that is created, installed, or modified is committed and given a page on the
portal. A skill lives in two places: the **runtime `SKILL.md`** Claude reads when the skill
fires, and the **portal `SKILL.md`** (frontmatter + full body) that this site renders into a
detail page.

## The flow

1. **Draft the runtime SKILL.md** — write it as instructions to yourself: principles,
   checklist, examples, gotchas.
2. **Pick a slug** — lowercase, hyphenated, descriptive.
3. **Add the portal SKILL.md** — frontmatter (title, scope, category, icon, triggers, and up
   to four `checks`) followed by the full body.
4. **Preview locally** — run the portal's `npm test` and `npm run build`, then check the
   generated detail page looks right.
5. **Commit and push the source.** A GitHub Action regenerates the searchable index and the
   detail page automatically — the generated files are never edited by hand.
6. **Verify** the skill appears in Claude Code and its page is live on the portal.

Walkthroughs and templates follow the same spirit: author the source, push, and the portal
rebuilds itself.
