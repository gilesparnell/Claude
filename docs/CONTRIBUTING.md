# Contributing to gilesparnell/Claude

This repo is a living knowledge base. Every project you ship should feed back into it.
The goal: get smarter with each engagement, not just with each conversation.

---

## What Goes Where

```
global/CLAUDE.md          - Your identity as a developer + AllConvos stack rules
skills/                   - Reusable Claude Code instructions, one folder per skill
project-templates/        - Starter CLAUDE.md files for new project types
shared/                   - Reference docs used across skills (checklists, conventions)
docs/                     - Visual diagrams and index page (GitHub Pages)
scripts/                  - Setup/install automation
```

---

## Adding a New Skill

Skills are how you teach Claude to do something well - once, permanently.

### When to add a skill
- You find yourself giving Claude the same context at the start of sessions
- Claude made a mistake you had to correct - and you want to prevent it next time
- You learned a new pattern on a project that should apply everywhere

### Steps

```bash
mkdir -p ~/Projects/Claude/skills/<skill-name>
touch ~/Projects/Claude/skills/<skill-name>/SKILL.md
```

Every SKILL.md must start with this frontmatter:

```
---
name: <skill-name>
description: >
  Use this skill when... [describe trigger conditions clearly].
  Triggers on '[example phrase]', '[example phrase]'.
---
```

The description field is what Claude reads to decide whether to load the skill.
Write it as a trigger condition, not a definition.

### Skill Quality Checklist
- [ ] Frontmatter has name and description
- [ ] Description lists explicit trigger phrases
- [ ] Content is actionable - rules, not explanations
- [ ] Includes a 'What to Avoid' or failure modes section
- [ ] Under 300 lines (if longer, split into sub-skills)

### Commit convention

```bash
git add skills/<skill-name>/
git commit -m 'chore(skills): add <skill-name> skill'
git push
```

---

## Adding a Diagram to the Docs

When Claude explains a concept visually, it should live in docs/.

### Steps
1. Claude creates the diagram as an .html file in docs/diagrams/
2. Claude updates docs/index.html - adds a card in the correct theme section
3. Commit and push both files together

### Card themes

| Theme     | What goes here |
|-----------|----------------|
| technical | Architecture, code patterns, system design, data models |
| saas      | Product patterns, multi-tenancy, billing, onboarding flows |
| claude    | How Claude works, prompting, MCP, skills system |
| workflow  | Dev process, git flow, review process, skill lifecycle |
| allconvos | AllConvos platform specifics, agent flows, integrations |
| tooling   | MCP servers, Claude Code setup, IDE config, dev tooling |

### Commit convention

```bash
git add docs/
git commit -m 'docs: add <diagram-name> diagram'
git push
```

---

## Updating global/CLAUDE.md

This is your global system prompt - it loads in every Claude Code session.

Add to it when:
- Your stack changes (new tool, library decision, deprecated pattern)
- You establish a new 'never do this' rule
- A new project introduces context that applies everywhere

Keep it under 500 lines. If it grows beyond that, extract sections into skills.

```bash
git add global/CLAUDE.md
git commit -m 'chore(global): update stack rules - [what changed]'
git push
```

---

## End-of-Project Ritual

After each project or significant feature, do a 5-minute debrief:

1. What did I correct Claude on? Add to a skill or global/CLAUDE.md
2. What pattern worked well? Document in a skill
3. Did I explain any concept visually? Add to docs/
4. Is there a new project type? Add to project-templates/

This is how the repo compounds. One project at a time.

---

## Install Skills into a Project

```bash
# Symlink (stays in sync - recommended)
ln -sf ~/Projects/Claude/skills/<skill-name> <project>/.claude/skills/<skill-name>

# Copy (project-specific, won't auto-update)
cp -r ~/Projects/Claude/skills/<skill-name> <project>/.claude/skills/<skill-name>
```

---

Small consistent contributions beat big occasional ones. After every session, ask:
'Did I learn something Claude should remember?' If yes, add it here.
