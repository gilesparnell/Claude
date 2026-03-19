#!/bin/bash
# install.sh — Sets up Claude global config by symlinking CLAUDE.md

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.."
CLAUDE_DIR="$HOME/.claude"
TARGET="$CLAUDE_DIR/CLAUDE.md"
SOURCE="$REPO_DIR/global/CLAUDE.md"

echo "🔧 Installing Claude global config..."

# Create ~/.claude if it doesn't exist
mkdir -p "$CLAUDE_DIR"

# Backup existing CLAUDE.md if it exists and isn't already a symlink
if [ -f "$TARGET" ] && [ ! -L "$TARGET" ]; then
  BACKUP="$TARGET.backup.$(date +%Y%m%d%H%M%S)"
  echo "📦 Backing up existing CLAUDE.md to $BACKUP"
  mv "$TARGET" "$BACKUP"
fi

# Create symlink
ln -sf "$SOURCE" "$TARGET"

echo "✅ Symlinked: $TARGET → $SOURCE"
echo ""
echo "To use a project-specific template, copy from project-templates/:"
echo "  cp ~/Projects/Claude/project-templates/default/CLAUDE.md ./CLAUDE.md"
echo ""
echo "To add a skill to a project:"
echo "  ln -sf ~/Projects/Claude/skills/<skill-name> .claude/skills/<skill-name>"
