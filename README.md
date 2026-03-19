# Claude Config & Skills

This repo contains all of Giles' Claude Code configuration files, global instructions, and reusable skills.

## Structure

```
Claude/
├── global/          # Global CLAUDE.md — symlinked to ~/.claude/CLAUDE.md
├── skills/          # Reusable Claude Code skills (each is a folder)
├── project-templates/  # Per-project CLAUDE.md templates
├── shared/          # Reusable fragments referenced across files
└── scripts/         # install.sh to wire everything up
```

## Setup

```bash
chmod +x scripts/install.sh
./scripts/install.sh
```

This symlinks `global/CLAUDE.md` → `~/.claude/CLAUDE.md` so it applies to all Claude Code sessions.

## Adding a Skill to a Project

Copy or symlink the skill folder into your project:
```bash
ln -sf ~/Projects/Claude/skills/code-quality .claude/skills/code-quality
```

## Philosophy

Based on Anthropic's own lessons from building Claude Code:
- Skills are **folders**, not just markdown files
- The **Gotchas section** is the highest-signal content — keep it updated
- Use **progressive disclosure** — split detail into subfiles Claude reads on demand
- The **description field** is for the model, not humans — write it as a trigger condition
