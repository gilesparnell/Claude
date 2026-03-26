---
title: Skill Publisher
scope: global
category: workflow
icon: &#128230;
description: Mandatory workflow for publishing skills, walkthroughs, decisions, and templates to the GitHub Pages knowledge portal with correct structure, cards, and git push.
triggers:
  - publish this skill
  - create a walkthrough
  - add to the portal
  - publish this walkthrough
checks-label: Rules
checks:
  - Every skill needs runtime SKILL.md + portal stub + git push
  - Walkthroughs need detail page + card in walkthroughs.html + stat update
  - All portal content uses docs/portal.css — no custom CSS
  - Nothing is done until committed and pushed to gilesparnell/Claude
version: 2.0
---
