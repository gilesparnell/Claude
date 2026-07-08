---
name: repo-rename-leak-closure
title: Repo Rename Leak-Vector Closure
scope: global
category: learned
description: "When renaming a GitHub repo to free its name for a new public repo, re-point every remote and hook BEFORE the new repo claims the name — or auto-pushes leak private content publicly."
triggers:
  - rename github repo
  - reuse repo name
  - split repo public private
  - gh repo rename
version: 1.0
---

# Repo Rename Leak-Vector Closure

**Extracted:** 2026-07-08
**Context:** Splitting a private repo into a private operations repo plus a fresh-history public repo while keeping the original repo name (and its GitHub Pages URL) for the public one.

## Problem

GitHub leaves a redirect after `gh repo rename`, so every local remote, script, and hook pointing at the old `owner/name` keeps working silently. The moment a **new** repo claims that name, the redirect dies and all those un-repointed references push to the NEW repo instead. If the old repo held private content and the new one is public, any auto-firing push (a session-end memory-sync hook, a CI job, a cron script) becomes a silent data leak to a public repo. The redirect makes this failure *invisible* until it's too late — nothing errors in between.

## Solution

Strict ordering — the closure happens **between** the rename and the new repo's creation:

```bash
# 1. Rename
gh repo rename new-private-name --repo owner/OldName --yes

# 2. CLOSE THE VECTOR (gated step — nothing proceeds until clean)
git -C /path/to/local/checkout remote set-url origin https://github.com/owner/new-private-name.git
# Hunt every hardcoded reference — hooks are the killers (they fire unattended):
grep -rn "owner/OldName" ~/.claude/settings*.json ~/.claude/hooks/ ~/.claude/skills/ \
    /path/to/checkout/{scripts,tools,hooks,.github} 2>/dev/null
# Fix every hit. Documentation-only refs can wait; anything that PUSHES cannot.

# 3. Only now create the new repo that claims the name
gh repo create owner/OldName --private ...

# 4. Verify empirically: watch the next auto-push land on the RENAMED repo
git -C /path/to/checkout log origin/main --oneline -1   # after the next hook firing
```

## When to Use

Any repo rename where the old name will be reused; any private→public repo split that keeps a name or URL; before creating a fresh-history public twin of a private repo. Ask: "what pushes to this name unattended?" — session hooks, CI, cron, supervisor scripts — and re-point all of them first.
