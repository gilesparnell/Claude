# Skills Index

Skills are folders that give Claude Code reusable instructions, scripts, and context for specific tasks.

## Available Skills

| Skill | Trigger Conditions | Description |
|-------|-------------------|-------------|
| `code-quality` | "review this code", "audit this", "make production-ready" | Systematic code quality review checklist |
| `git-conventions` | "commit this", "write commit message", "create a PR" | Conventional commits, branch naming, PR templates |
| `testing-practices` | "write tests", "add coverage", "how to test" | Testing philosophy, patterns, naming conventions |
| `frontend-design` | "build this UI", "style this", "make this look good" | Anti-cliché design principles, Tailwind patterns |
| `code-review` | "review this PR", "adversarial review", "fresh eyes" | PR review checklist, feedback tone guidelines |

## Installing a Skill in a Project

Option 1 — Symlink (stays in sync with this repo):
```bash
ln -sf ~/Projects/Claude/skills/<skill-name> .claude/skills/<skill-name>
```

Option 2 — Copy (project-specific, won't auto-update):
```bash
cp -r ~/Projects/Claude/skills/<skill-name> .claude/skills/<skill-name>
```

## Adding a New Skill

1. Create a new folder: `skills/<skill-name>/`
2. Add a `SKILL.md` with frontmatter (`name`, `description`)
3. Add subfolders as needed: `references/`, `scripts/`, `assets/`
4. Update this README table
5. Commit with: `chore(skills): add <skill-name> skill`
