# agnix — Claude Code Config Linter

Validates CLAUDE.md, SKILL.md, hooks, MCP, and other agent config files. 385 rules with auto-fix support.

## Installation

```bash
npm install -g agnix
```

## Usage

```bash
agnix .                         # Validate current directory
agnix --fix .                   # Apply HIGH/MEDIUM confidence fixes
agnix --fix-safe .              # Apply only HIGH confidence fixes
agnix --dry-run --show-fixes .  # Preview changes
agnix --strict .                # Treat warnings as errors
```

## Source

- Repo: https://github.com/agent-sh/agnix
- From: [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
