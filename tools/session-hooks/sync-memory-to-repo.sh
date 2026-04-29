#!/bin/bash
# sync-memory-to-repo.sh — Auto-sync Claude config to GitHub on session end.
# Runs as a Stop hook. Copies memory, skills, and CLAUDE.md to claude-artefacts, commits if changed.

set -euo pipefail

REPO="$HOME/Documents/VSStudio/parnell-systems/claude-artefacts"
PROJECTS_DIR="$HOME/.claude/projects"
GLOBAL_WORKSPACE="-Users-$(whoami)-Documents-VSStudio"

# Bail if repo doesn't exist
[ -d "$REPO" ] || exit 0

# ── CLAUDE.md ────────────────────────────────────────────────────────────────
cp "$HOME/.claude/CLAUDE.md" "$REPO/global/CLAUDE.md" 2>/dev/null || true

# ── Global workspace memory ──────────────────────────────────────────────────
GLOBAL_MEM="$PROJECTS_DIR/$GLOBAL_WORKSPACE/memory"
if [ -d "$GLOBAL_MEM" ] && ls "$GLOBAL_MEM"/*.md &>/dev/null; then
  cp "$GLOBAL_MEM"/*.md "$REPO/memory/"
fi

# ── Project-specific memory ──────────────────────────────────────────────────
for mem_dir in "$PROJECTS_DIR"/*/memory; do
  ls "$mem_dir"/*.md &>/dev/null || continue
  project=$(basename "$(dirname "$mem_dir")")
  [ "$project" = "$GLOBAL_WORKSPACE" ] && continue
  dest="$REPO/memory/projects/$project"
  mkdir -p "$dest"
  cp "$mem_dir"/*.md "$dest/"
done

# ── Skills ───────────────────────────────────────────────────────────────────
for skill_dir in "$HOME/.claude/skills/"/*/; do
  name=$(basename "$skill_dir")
  dest="$REPO/skills/$name"
  mkdir -p "$dest"
  cp "$skill_dir"*.md "$dest/" 2>/dev/null || true
done
# learned/ patterns live under skills/learned/ locally but repo/learned/
if ls "$HOME/.claude/skills/learned/"*.md &>/dev/null 2>&1; then
  mkdir -p "$REPO/learned"
  cp "$HOME/.claude/skills/learned/"*.md "$REPO/learned/" 2>/dev/null || true
fi

# ── Commit and push if anything changed ─────────────────────────────────────
cd "$REPO"
git add memory/ global/CLAUDE.md skills/ learned/ 2>/dev/null || true

if git diff --staged --quiet; then
  exit 0
fi

TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
git commit -m "chore(auto-sync): session end $TIMESTAMP"
git push origin main 2>/dev/null || true

exit 0
