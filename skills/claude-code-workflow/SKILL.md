---
name: claude-code-workflow
description: >
  Visual guide to structuring your Claude Code development environment with tmux,
  git worktrees, and Agent Teams. Use when setting up parallel sessions, onboarding
  to Claude Code workflows, or when terminal tabs are getting chaotic.
  Triggers on 'set up my dev environment', 'tmux workflow', 'parallel sessions',
  'worktree setup', 'agent teams setup', 'too many tabs'.
---

# Claude Code Workflow — Structured Parallel Development

A visual guide to replacing chaotic terminal tabs with structured, named, isolated Claude Code sessions using tmux + git worktrees + Agent Teams.

---

## The Problem

```
┌──────────────────────────────────────────────────────────────┐
│  Ghostty Tab Bar                                             │
│                                                              │
│  [Tab 1]  [Tab 2]  [Tab 3]  [Tab 4]  [Tab 5]               │
│    ???      ???      ???      ???      ???                    │
│                                                              │
│  - No labels                                                 │
│  - All editing the same files                                │
│  - Can't remember what each is doing                         │
│  - Context bleeding between sessions                         │
│  - Files conflict when two agents edit the same thing        │
└──────────────────────────────────────────────────────────────┘
```

## The Solution — Three Layers

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   Layer 1: tmux          → Named windows, persistent         │
│   Layer 2: Worktrees     → Isolated file systems per agent   │
│   Layer 3: Agent Teams   → Coordinated multi-agent work      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Layer 1: tmux — Replace Tabs with Named Windows

### What it gives you
- **Named windows** — not "Tab 3" but "claude" or "dev-server"
- **Persistent sessions** — close Ghostty, come back later, everything's still running
- **Split panes** — see two things at once in one window
- **Keystroke switching** — `Ctrl+B` then `1`, `2`, `3`

### Install

```bash
brew install tmux    # macOS
```

### Visual: tmux session layout

```
┌──────────────────────────────────────────────────────────────┐
│ [parnell] 1:dev*  2:claude  3:agent2              13:42      │
├─────────────────────────┬────────────────────────────────────┤
│                         │                                    │
│  VITE v6.0.0 ready      │  ~/parnellsystems                 │
│                         │  $ git status                      │
│  > Local:               │  On branch main                    │
│    localhost:8080        │  nothing to commit                 │
│                         │  $ _                               │
│  (dev server running)   │  (general terminal)                │
│                         │                                    │
├─────────────────────────┴────────────────────────────────────┤
│ Window 1: "dev" — split into server + terminal               │
│ Window 2: "claude" — primary Claude Code session             │
│ Window 3: "agent2" — parallel work with --worktree           │
└──────────────────────────────────────────────────────────────┘
```

### Launch script

Create `scripts/tmux-dev.sh` in your project:

```bash
#!/bin/bash
SESSION="${1:-parnell}"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

tmux has-session -t "$SESSION" 2>/dev/null && tmux kill-session -t "$SESSION"

# Window 1: Dev server + terminal
tmux new-session -d -s "$SESSION" -n "dev" -c "$PROJECT_DIR"
tmux send-keys -t "$SESSION:dev" "npm run dev" C-m
tmux split-window -h -t "$SESSION:dev" -c "$PROJECT_DIR"

# Window 2: Primary Claude session
tmux new-window -t "$SESSION" -n "claude" -c "$PROJECT_DIR"

# Window 3: Parallel agent slot
tmux new-window -t "$SESSION" -n "agent2" -c "$PROJECT_DIR"

tmux select-window -t "$SESSION:claude"
tmux attach-session -t "$SESSION"
```

```bash
chmod +x scripts/tmux-dev.sh
./scripts/tmux-dev.sh
```

### Key bindings cheat sheet

```
┌─────────────────────┬────────────────────────────────────────┐
│ Ctrl+B → 1          │ Switch to dev server window             │
│ Ctrl+B → 2          │ Switch to primary Claude session        │
│ Ctrl+B → 3          │ Switch to secondary agent (worktree)    │
│ Ctrl+B → d          │ Detach — session stays alive            │
│ Ctrl+B → ←/→        │ Switch between split panes              │
│ tmux attach -t name │ Reattach to a session later             │
│ tmux ls             │ List all active sessions                 │
└─────────────────────┴────────────────────────────────────────┘
```

---

## Layer 2: Git Worktrees — Isolated File Systems

### The problem worktrees solve

```
  Without worktrees:
  ┌─────────────────────┐
  │ ~/parnellsystems/   │ ← BOTH agents edit this
  │                     │
  │ Agent A: editing    │ ← Conflict!
  │   src/pages/...     │
  │ Agent B: editing    │ ← Conflict!
  │   src/pages/...     │
  └─────────────────────┘

  With worktrees:
  ┌─────────────────────┐     ┌──────────────────────────────┐
  │ ~/parnellsystems/   │     │ ~/parnellsystems-wt-a3f/     │
  │                     │     │                              │
  │ Agent A: landing    │     │ Agent B: auth feature        │
  │ Branch: main        │     │ Branch: feature/auth-flow    │
  │                     │     │                              │
  │ (isolated)          │     │ (isolated)                   │
  └─────────────────────┘     └──────────────────────────────┘
          ↓                              ↓
      No conflicts — completely separate file systems
```

### How to use

```bash
# Start an isolated Claude session with its own worktree
claude --worktree

# Claude creates a separate directory + branch automatically
# When done, changes merge back via PR
```

### When to use worktrees vs direct editing

```
┌──────────────────────────────┬───────────────────────────────┐
│ ✅ USE A WORKTREE             │ ⬜ SKIP THE WORKTREE           │
├──────────────────────────────┼───────────────────────────────┤
│ New feature (multi-file)     │ Quick copy/content edit       │
│ Bug fix while feature WIP    │ Running commands (build/test) │
│ Refactoring that might break │ Research / asking questions   │
│ Anything you'll PR separately│ Business ops (ai-os/)        │
└──────────────────────────────┴───────────────────────────────┘
```

---

## Layer 3: Agent Teams — Coordinated Parallel Agents

### Enable it

```bash
echo 'export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1' >> ~/.zshrc
source ~/.zshrc
```

### How it works

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    ┌─────────────────┐                       │
│                    │   Lead Agent    │                       │
│                    │ Plans, delegates│                       │
│                    └───────┬─────────┘                       │
│                            │                                 │
│              ┌─────────────┼─────────────┐                   │
│              │             │             │                   │
│     ┌────────▼──────┐ ┌───▼──────────┐ ┌▼───────────────┐   │
│     │  Frontend     │ │  Content     │ │  Infra         │   │
│     │  Agent        │ │  Agent       │ │  Agent         │   │
│     │              │ │              │ │                │   │
│     │ Components,  │ │ Copy, pages, │ │ Build, deploy, │   │
│     │ styling      │ │ training     │ │ config         │   │
│     └──────────────┘ └──────────────┘ └────────────────┘   │
│                                                              │
│     Agents communicate via shared task list                  │
│     Each gets its own tmux pane                              │
│     Lead coordinates and resolves conflicts                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Prompt example

```
> Create an agent team with 3 members:
> 1. Frontend agent — update landing page components
> 2. Content agent — rewrite training page copy
> 3. Test agent — add Vitest coverage for changed components
```

### When to use Agent Teams vs manual sessions

```
┌──────────────────────────────┬───────────────────────────────┐
│ ✅ AGENT TEAMS                │ ⬜ MANUAL SESSIONS             │
├──────────────────────────────┼───────────────────────────────┤
│ Multi-part feature build     │ Independent, unrelated tasks  │
│ Agents need to coordinate    │ Simple single-file edits      │
│ Backend depends on frontend  │ Research + one implementation │
│ Full-stack implementation    │ Exploratory / uncertain scope │
└──────────────────────────────┴───────────────────────────────┘
```

---

## Session Scoping Rules

Every Claude Code session gets ONE clear purpose. Name it. Scope it.

```
┌────────────────────┬──────────────────────┬───────────┐
│ Session Name       │ Scope                │ Worktree? │
├────────────────────┼──────────────────────┼───────────┤
│ feature-[name]     │ New feature dev      │ Yes       │
│ bugfix-[name]      │ Single bug fix       │ Yes       │
│ landing-page       │ Marketing site edits │ Optional  │
│ training           │ Course content       │ Optional  │
│ refactor-[scope]   │ Code cleanup         │ Yes       │
│ ops                │ Business operations  │ No        │
└────────────────────┴──────────────────────┴───────────┘
```

### The three rules

```
 ┌─ Rule 1: Max 2 parallel coding sessions
 │          (avoids rate-limit thrashing)
 │
 ├─ Rule 2: Never edit the same file in two sessions
 │          (finish one first, or use worktrees)
 │
 └─ Rule 3: One session = one task
            (don't reuse sessions for different work)
```

---

## Daily Workflow — The Complete Picture

```
┌──────────────────────────────────────────────────────────────┐
│  MORNING                                                     │
│                                                              │
│  $ cd ~/Documents/VSStudio/parnellsystems                    │
│  $ ./scripts/tmux-dev.sh                                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ tmux: [parnell]  1:dev*  2:claude  3:agent2            │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  Ctrl+B → 2 (switch to claude window)                        │
│  $ claude                                                    │
│  > Update the hero section copy on the landing page          │
│                                                              │
│  Ctrl+B → 3 (switch to agent2 window)                        │
│  $ claude --worktree                                         │
│  > Add authentication flow to the dashboard                  │
│                                                              │
│  ── Both agents work in parallel, isolated ──                │
│                                                              │
│  Ctrl+B → 1 (check dev server anytime)                       │
│  Ctrl+B → d (detach — go get coffee)                         │
│  $ tmux attach -t parnell (come back later)                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Tools Worth Knowing

| Tool | What | Install |
|------|------|---------|
| **tmux** | Terminal multiplexer — named windows, persistent sessions | `brew install tmux` |
| **workmux** | Couples git worktrees with tmux windows automatically | GitHub binary |
| **muxtree** | Dead-simple worktree + tmux launcher (single bash script) | Copy to `/usr/local/bin` |
| **dmux** | Full dev agent multiplexer (11+ agents, hooks, CI/CD) | GitHub / npm |
| **claude-esp** | TUI to monitor Claude's hidden thinking across sessions | GitHub |

**Recommendation:** Start with raw tmux + `claude --worktree`. Graduate to dmux when you're regularly running 3+ parallel agents.

---

## Quick Reference

```
tmux new -s parnell          # Create named session
tmux attach -t parnell       # Reattach
tmux ls                      # List sessions
Ctrl+B d                     # Detach
Ctrl+B 1/2/3                 # Switch windows
Ctrl+B %                     # Split pane vertical
Ctrl+B "                     # Split pane horizontal
claude --worktree            # Isolated parallel session
claude --resume              # Resume named session
claude --continue            # Continue most recent session
```
