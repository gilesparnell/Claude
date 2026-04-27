#!/bin/bash
# install.sh — Bootstrap Claude global config on a new machine / new account.
#
# What it does:
#   - Symlinks global/CLAUDE.md → ~/.claude/CLAUDE.md
#   - Symlinks each skill → ~/.claude/skills/<name>
#   - Copies memory files → ~/.claude/projects/<workspace>/memory/
#   - Copies hooks → ~/.claude/hooks/
#   - Copies global/settings.json → ~/.claude/settings.json
#
# Usage:
#   cd ~/path/to/claude-artefacts
#   bash scripts/install.sh

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.."
CLAUDE_DIR="$HOME/.claude"

echo "Installing Claude config from: $REPO_DIR"
echo "Target: $CLAUDE_DIR"
echo ""

mkdir -p "$CLAUDE_DIR/skills" "$CLAUDE_DIR/hooks" "$CLAUDE_DIR/identity"

# ── CLAUDE.md ────────────────────────────────────────────────────────────────
TARGET="$CLAUDE_DIR/CLAUDE.md"
SOURCE="$REPO_DIR/global/CLAUDE.md"
if [ -f "$TARGET" ] && [ ! -L "$TARGET" ]; then
  BACKUP="$TARGET.backup.$(date +%Y%m%d%H%M%S)"
  echo "Backing up existing CLAUDE.md → $BACKUP"
  mv "$TARGET" "$BACKUP"
fi
ln -sf "$SOURCE" "$TARGET"
echo "✓ CLAUDE.md symlinked"

# ── Identity files ───────────────────────────────────────────────────────────
for f in "$REPO_DIR/identity/"*.md; do
  name=$(basename "$f")
  ln -sf "$f" "$CLAUDE_DIR/identity/$name"
done
echo "✓ Identity files symlinked"

# ── Skills ───────────────────────────────────────────────────────────────────
for skill_dir in "$REPO_DIR/skills/"/*/; do
  name=$(basename "$skill_dir")
  # Skip README if accidentally in skills/
  [ "$name" = "README.md" ] && continue
  mkdir -p "$CLAUDE_DIR/skills/$name"
  ln -sf "$skill_dir" "$CLAUDE_DIR/skills/$name"
done
echo "✓ Skills symlinked"

# ── Learned patterns ─────────────────────────────────────────────────────────
mkdir -p "$CLAUDE_DIR/skills/learned"
for f in "$REPO_DIR/learned/"*.md; do
  name=$(basename "$f")
  cp "$f" "$CLAUDE_DIR/skills/learned/$name"
done
echo "✓ Learned patterns copied"

# ── Hooks ────────────────────────────────────────────────────────────────────
for f in "$REPO_DIR/hooks/"*.sh; do
  name=$(basename "$f")
  cp "$f" "$CLAUDE_DIR/hooks/$name"
  chmod +x "$CLAUDE_DIR/hooks/$name"
done
echo "✓ Hooks installed"

# ── Memory ───────────────────────────────────────────────────────────────────
# Memory lives under the VSStudio workspace project path.
# Adjust WORKSPACE_KEY if your VSStudio folder is in a different location.
WORKSPACE_KEY="-Users-$(whoami)-Documents-VSStudio"
MEMORY_DIR="$CLAUDE_DIR/projects/$WORKSPACE_KEY/memory"
mkdir -p "$MEMORY_DIR"
for f in "$REPO_DIR/memory/"*.md; do
  name=$(basename "$f")
  # Don't overwrite existing memory — copy only if not present
  if [ ! -f "$MEMORY_DIR/$name" ]; then
    cp "$f" "$MEMORY_DIR/$name"
  fi
done
echo "✓ Memory files installed (existing files preserved)"

# ── settings.json ────────────────────────────────────────────────────────────
SETTINGS_TARGET="$CLAUDE_DIR/settings.json"
SETTINGS_SOURCE="$REPO_DIR/global/settings.json"
if [ -f "$SETTINGS_TARGET" ]; then
  BACKUP="$SETTINGS_TARGET.backup.$(date +%Y%m%d%H%M%S)"
  echo "Backing up existing settings.json → $BACKUP"
  cp "$SETTINGS_TARGET" "$BACKUP"
fi
cp "$SETTINGS_SOURCE" "$SETTINGS_TARGET"
echo "✓ settings.json installed"

echo ""
echo "════════════════════════════════════════════════"
echo " Bootstrap complete. Manual steps needed:"
echo "════════════════════════════════════════════════"
echo ""
echo " 1. Re-authenticate plugins in Claude Code:"
echo "    /telegram:access  (Telegram remote control)"
echo "    Compound Engineering plugin — re-enable in settings"
echo ""
echo " 2. britfix tool needs its own setup:"
echo "    cd ~/.claude/tools/britfix && uv sync"
echo "    (or copy the tools/ folder from the old machine)"
echo ""
echo " 3. session-hooks (pre-compact.js, session-end.js) need"
echo "    to be copied manually from the old machine:"
echo "    ~/.claude/tools/session-hooks/"
echo ""
echo " 4. Verify: claude --version && open Claude Code"
echo ""
