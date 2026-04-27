---
name: Obsidian Knowledge Base Vaults
description: Two Obsidian vaults set up as AI second brain — Business and Personal, using Karpathy wiki architecture
type: reference
---

## Obsidian Vault Locations
- **Business**: `/Users/gilesparnell/Documents/ObsidianVault/Business/`
- **Personal**: `/Users/gilesparnell/Documents/ObsidianVault/Personal/`

## Architecture (Karpathy-style)
Each vault has three layers:
1. `raw/` — immutable source documents (never modify)
2. `wiki/` — LLM-maintained markdown wiki with cross-references
3. `CLAUDE.md` — schema defining operations (ingest, query, lint)

## How to Use
- Point Claude Code at a vault folder to work with it
- **Ingest**: drop files in `raw/`, tell Claude to process them
- **Query**: ask questions, Claude reads wiki index and synthesises
- **Lint**: periodic health-check for orphans, contradictions, stale info

## Setup Date
2026-04-12
