# Skills — Global vs Repo-Scoped

Skills exist in **two formats** and **two scopes**. Understanding both is important.

---

## Two Formats

Every skill has two files serving different purposes:

| Format | Location | Purpose |
|---|---|---|
| **Portal stub** | `~/Documents/VSStudio/Claude/skills/<slug>/SKILL.md` | Frontmatter-only. Rendered as a card on the GitHub Pages portal. |
| **Runtime content** | `~/.claude/skills/<slug>/SKILL.md` or `<project>/.claude/skills/<slug>/SKILL.md` | Full markdown. What Claude reads when the skill is invoked. |

The files in **this folder** are portal stubs. The runtime content lives elsewhere (see below).

---

## Two Scopes

### GLOBAL skills → `~/.claude/skills/`
Generic enough to apply on any project. Loaded in every Claude Code session regardless of which repo you're in.

| Skill | Why global |
|---|---|
| `code-quality` | Applies to any codebase |
| `code-review` | Applies to any PR |
| `frontend-design` | Generic UI principles (lean version) |
| `git-conventions` | Conventional Commits applies everywhere |
| `testing-practices` | Testing philosophy is language/framework agnostic |
| `skill-publisher` | Meta-skill for managing skills — useful globally |

### REPO-SCOPED skills → `<project>/.claude/skills/`
Reference a specific tech stack, client, workflow, or internal system. Should NOT be in `~/.claude/skills/` — they'd trigger incorrectly on unrelated projects.

| Skill | Scope | Reason |
|---|---|---|
| `github-pages-portal` | This repo (`Claude`) | Specific to the Claude portal infrastructure |
| `saas-automation-engagement` | AllConvos / client projects | Engagement playbook for AllConvos SaaS clients |
| `saas-patterns` | AllConvos | AllConvos platform architecture patterns |
| `frontend-design` (rich) | `fsca/.claude/skills/` | FSCA brand standards and component conventions |

---

## Decision Rule

Ask: *"Would this skill give correct, useful guidance on a completely unrelated project?"*

- **Yes** → Global (`~/.claude/skills/`)
- **No** → Repo-scoped (`<project>/.claude/skills/`)

When in doubt, start repo-scoped. Promote to global only when you've confirmed it's truly project-agnostic.

---

## Adding a New Skill

Use the `skill-publisher` skill. It walks through writing both the runtime version and the portal stub, deciding scope, and pushing to this repo.

Trigger: `add this as a skill` / `save this as a skill` / `publish this skill`
