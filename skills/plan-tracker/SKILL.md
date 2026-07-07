---
title: Plan Progress Tracker
scope: global
category: workflow
icon: &#128506;
description: >
  Generates a visual HTML progress diagram for active project plans. Reads plan
  markdown files, extracts workstreams and tasks, determines completion status,
  and outputs a self-contained HTML diagram to docs/diagrams/. Use when the user
  asks to see plan progress, wants a visual overview of where a project stands,
  or after executing a batch of plan tasks.
triggers:
  - show me plan progress
  - where are we in the plan
  - plan tracker
  - visual progress
  - update the plan diagram
  - how are we tracking
checks-label: Process
checks:
  - Read the plan markdown file and extract all workstreams, tasks, and completion markers
  - Cross-reference with memory files for any completed items not yet checked off in the plan
  - Generate a self-contained HTML file in docs/diagrams/ following the existing dark-theme diagram pattern
  - Each workstream is a coloured phase card showing task count, completion percentage, and individual task status
  - Use green for done, amber for in-progress, and slate for not-started
  - Include a summary bar at the top with overall completion percentage
  - Commit and push to update the portal automatically
  - After generating, use the skill-publisher skill to update the portal
version: 1.0
---
