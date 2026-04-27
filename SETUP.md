# Setting Up Claude on a New Machine / Account

This repo is the source of truth for Giles Parnell's Claude configuration. Running `install.sh` gives a new Claude instance full context: global rules, identity, skills, memory, and hooks.

## Step 1 — Clone the repo

```bash
git clone https://github.com/gilesparnell/Claude ~/Documents/VSStudio/parnell-systems/claude-artefacts
```

## Step 2 — Run install

```bash
cd ~/Documents/VSStudio/parnell-systems/claude-artefacts
bash scripts/install.sh
```

This installs:
- `~/.claude/CLAUDE.md` — global rules (timezone, compute efficiency, shipping discipline, etc.)
- `~/.claude/identity/` — who Giles is, voice profile, anti-AI writing rules
- `~/.claude/skills/` — all skills (tdd-first, verification-before-completion, ship, e2e-feature-test, etc.)
- `~/.claude/hooks/` — skill evaluation hook (fires on every prompt)
- `~/.claude/projects/.../memory/` — auto-memory (feedback, user profile, project context, references)
- `~/.claude/settings.json` — permissions, model preference, enabled plugins

## Step 3 — Manual steps (can't be automated)

### Re-authenticate plugins
These use OAuth and need re-auth on each account:
- **Telegram**: run `/telegram:access` in Claude Code terminal
- **Compound Engineering**: re-enable in Claude Code Settings → Plugins

### Restore custom tools
Copy these from the old machine (they're not in the repo due to size/complexity):
```bash
# From old machine:
rsync -av ~/.claude/tools/ newmachine:~/.claude/tools/

# Or manually copy:
# ~/.claude/tools/britfix/      — British English spell-fix hook
# ~/.claude/tools/session-hooks/ — pre-compact.js, session-end.js
```

Then set up britfix:
```bash
cd ~/.claude/tools/britfix && uv sync
```

## What you get out of the box

| Category | Contents |
|---|---|
| **Global rules** | Timezone, compute efficiency, TDD mandate, shipping discipline, versioning, Claude vs Codex routing, plan continuity |
| **Identity** | Role (solopreneur, AU-based, voice AI SaaS), voice profile, anti-AI writing rules |
| **Skills** | 17 skills including tdd-first, verification-before-completion, ship, e2e-feature-test, systematic-debugging, security-review, code-review |
| **Memory** | Feedback patterns, user profile, active project context, reference locations |
| **Hooks** | Mandatory skill evaluation on every prompt |

## Keeping it in sync

When CLAUDE.md or a skill changes locally, push back to the repo:

```bash
cd ~/Documents/VSStudio/parnell-systems/claude-artefacts

# Sync CLAUDE.md
cp ~/.claude/CLAUDE.md global/CLAUDE.md

# Sync a specific skill
cp -r ~/.claude/skills/<skill-name>/ skills/<skill-name>/

# Sync memory
cp ~/.claude/projects/-Users-$(whoami)-Documents-VSStudio/memory/*.md memory/

git add -A
git commit -m "chore: sync local claude config"
git push
```
