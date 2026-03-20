---
title: Skill Publisher
category: workflow
icon: &#128640;
description: Use this skill whenever you have identified a new reusable skill and need to add it to the Claude repo, publish it to the portal, and make it available for future projects. Covers the complete end-to-end process: writing the SKILL.md with correct frontmatter, pushing to the repo, and verifying the portal updates.
triggers:
  - add this as a skill
  - save this as a skill
  - publish this skill
  - add to the portal
  - create a skill for this
checks-label: Steps
checks:
  - Write SKILL.md with correct frontmatter schema
  - Create skill folder in skills/ with correct slug
  - Push to gilesparnell/Claude repo
  - Verify portal auto-updates via GitHub Action
version: 1.0
---

# Skill: Skill Publisher

## Overview

Every time a new reusable pattern, playbook, or set of rules is identified, it should
be captured as a skill and published to the portal. This skill defines the complete
end-to-end process — from writing the SKILL.md to verifying it appears on the portal.

---

## Trigger phrases

Use this skill when you hear:
- "Add this as a skill"
- "Save this as a skill"
- "Publish this skill"
- "Add to the portal"
- "Create a skill for this"
- "We should capture this pattern"

---

## Step 1 — Choose a skill slug

The slug is the folder name in `skills/`. Rules:
- Lowercase, hyphen-separated, no spaces
- Descriptive but concise: `saas-automation-engagement`, not `new-client-automation-for-saas-companies`
- Check existing skills first to avoid duplicates:
  ```bash
  ls ~/Documents/VSStudio/Claude/skills/
  ```

---

## Step 2 — Write the SKILL.md frontmatter

Every SKILL.md MUST begin with this frontmatter block. Without it the skill
exists in the repo but does not appear as a card on the portal.

### Frontmatter schema

```yaml
---
title: Human-readable skill name
category: code | frontend | workflow | saas | engagement | tooling
icon: HTML entity for the icon (e.g. &#128640; &#128196; &#9989;)
description: One or two sentences. What this skill does and when to use it.
triggers:
  - trigger phrase one
  - trigger phrase two
  - trigger phrase three
  - trigger phrase four
checks-label: Key rules | Phases | Checks | Principles
checks:
  - First key point or phase
  - Second key point or phase
  - Third key point or phase
  - Fourth key point or phase
version: 1.0
---
```

### Category and colour mapping

| Category   | Colour on portal | Use for                               |
|------------|-----------------|---------------------------------------|
| code       | Blue            | Code quality, review, testing         |
| frontend   | Coral           | UI, design, components                |
| workflow   | Amber           | Git, process, dev workflow            |
| saas       | Green           | SaaS patterns, multi-tenancy, billing |
| engagement | Navy            | Client work, proposals, specs         |
| tooling    | Purple          | MCP, Claude Code, portal, infra       |

### Icon reference (HTML entities)

| Icon | Entity      | Good for              |
|------|-------------|-----------------------|
| 🚀   | &#128640;   | SaaS, deployment      |
| 📄   | &#128196;   | Documents, engagement |
| 🔍   | &#128269;   | Code review, search   |
| ✅   | &#9989;     | Testing, checks       |
| 🎨   | &#127912;   | Frontend, design      |
| 🍁   | &#127809;   | Git, workflow         |
| 🌐   | &#127760;   | Portal, web, tooling  |
| 👁   | &#128065;   | Review, observation   |
| 📋   | &#128203;   | Templates, lists      |
| ⚙   | &#9881;     | Config, settings      |

---

## Step 3 — Write the skill body

After the frontmatter closing `---`, write the full skill content in markdown.
Structure it as:

```markdown
# Skill: [Title]

## Overview
[What this skill covers and when to use it]

---

## [Phase/Section 1]
[Content]

## [Phase/Section 2]
[Content]

## Common pitfalls to avoid
[Lessons learned]

## Reuse checklist
- [ ] Item 1
- [ ] Item 2
```

---

## Step 4 — Create the folder and file

### Using Claude Code (preferred)
```bash
cd ~/Documents/VSStudio/Claude
mkdir -p skills/your-skill-slug
# Claude Code writes the SKILL.md content directly
```

### Using Control your Mac (for simple skills)
Use base64-encoding for file content to avoid osascript quoting issues:
```python
import base64, os
content = "your skill content here"
encoded = base64.b64encode(content.encode()).decode()
# Then decode and write in osascript python call
```

---

## Step 5 — Run generate-stats.js locally to verify

Before pushing, confirm the frontmatter parses correctly:

```bash
cd ~/Documents/VSStudio/Claude
/opt/homebrew/bin/node scripts/generate-stats.js
```

Check output for:
- Your skill slug appears in "Skills found:" list
- No WARNING messages about missing frontmatter
- Skill count increments by 1

If the skill is missing from the list, check:
1. Frontmatter starts on line 1 (no blank lines before `---`)
2. All required fields are present: title, category, icon, description, triggers, checks
3. Arrays use proper YAML format (each item on its own line with `  - ` prefix)

---

## Step 6 — Commit and push

```bash
cd ~/Documents/VSStudio/Claude
git add skills/your-skill-slug/
git add docs/skills.html docs/index.html  # regenerated by generate-stats.js
git commit -m "feat: add your-skill-slug skill"
git pull --rebase origin main
git push
```

Always pull --rebase before push to avoid conflicts with GitHub Action auto-commits.

---

## Step 7 — Verify on the portal

After pushing, wait 30-60 seconds for GitHub Action to run, then check:
- https://gilesparnell.github.io/Claude/skills.html
- Your new skill card should appear
- Click the category filter to confirm it appears in the right category
- Skill count in hero stats should have incremented

If the card does not appear after 2 minutes:
1. Check GitHub Actions tab in the repo for errors
2. Run generate-stats.js locally and check for warnings
3. Verify the AUTO-GENERATED SKILLS markers exist in docs/skills.html

---

## Step 8 — Update project CLAUDE.md (optional)

If this skill should be active for the current project, add it to the
Active Skills section in CLAUDE.md:

```markdown
## Active Skills
- `your-skill-slug` — brief description of what it does here
```

Then symlink it into the project's .claude/skills/ folder:
```bash
ln -sf ~/Documents/VSStudio/Claude/skills/your-skill-slug \
       .claude/skills/your-skill-slug
```

---

## Frontmatter validation checklist

Before pushing, verify:
- [ ] File starts with `---` on line 1 (no blank lines above)
- [ ] `title` — human readable, title case
- [ ] `category` — exactly one of: code, frontend, workflow, saas, engagement, tooling
- [ ] `icon` — valid HTML entity (test in browser if unsure)
- [ ] `description` — 1-2 sentences, no emoji
- [ ] `triggers` — 3-5 phrases, each starting with lowercase verb or noun
- [ ] `checks-label` — one of: Checks, Phases, Principles, Key rules, Steps
- [ ] `checks` — 3-5 items, each a short phrase
- [ ] `version` — 1.0 for new skills
- [ ] Closing `---` after frontmatter
- [ ] Blank line between frontmatter and body

---

## Common mistakes

1. **Skill missing from portal** — frontmatter not on line 1, or missing required field
2. **Push rejected** — forgot to pull --rebase first; another commit landed since last pull
3. **Wrong category colour** — typo in category field; must match exactly
4. **Icon not rendering** — HTML entity is wrong; check the reference table above
5. **Merge conflict on docs/** — GitHub Action auto-committed between your local run and push;
   resolve by `git checkout --theirs docs/skills.html docs/index.html` then re-run generate-stats.js
