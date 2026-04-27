---
name: Documentation Standard Enforcement
description: Project docs go in each project's docs/ folder (GitHub Pages), NOT the Claude knowledge portal, NOT Proof. Follow SprintTracker exemplar exactly.
type: feedback
---

## Critical Feedback (corrected twice)

The user has corrected documentation placement TWICE in this project:

1. **First correction:** Created docs/PROJECT-STATUS.md and uploaded to Proof. User said: "no no...you should be referencing https://github.com/gilesparnell/Claude for our project status documentation."

2. **Second correction:** Put PiTime docs in the Claude knowledge portal (claude-artefacts repo). User said: "I don't understand why you've not remembering how we do documentation. You should be using the following skill called: 'Project Documentation Standard'" and pointed to the SprintTracker exemplar.

## The Correct Pattern
- Each project has **its own docs/ folder** served via GitHub Pages
- Follow the **SprintTracker exemplar** (gilesparnell.github.io/SprintTracker/)
- Three files: `docs/index.html`, `docs/diagrams/plan-progress.html`, `docs/user-guide.html`
- Hub page (gilesparnell.github.io/) card links to the project's docs site
- The Claude knowledge portal is for skills/walkthroughs/decisions — NOT project docs

## Why This Matters
The user has an established documentation system across multiple projects and was frustrated that this pattern wasn't being followed. This is a high-priority memory to check before any documentation work.
