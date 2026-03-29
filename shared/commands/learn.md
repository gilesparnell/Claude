Analyse the current session and extract any reusable patterns worth saving.

## What to Extract

Look for:

1. **Error Resolution Patterns** — root cause + fix + reusability
2. **Debugging Techniques** — non-obvious steps, tool combinations
3. **Workarounds** — library quirks, API limitations, version-specific fixes
4. **Project-Specific Patterns** — conventions, architecture decisions, integration patterns

## Process

1. Review the session for extractable patterns
2. Identify the most valuable/reusable insight

3. **Determine save location:**
   - Ask: "Would this pattern be useful in a different project?"
   - **Global skill** (`~/.claude/skills/learned/`): Generic patterns usable across 2+ projects
   - **Project skill** (`.claude/skills/learned/` in current project): Project-specific knowledge
   - **Memory** (`~/.claude/projects/.../memory/`): If it's context about the user/project rather than a technique
   - When in doubt, choose global (moving global to project is easier than the reverse)

4. **Quality gate — before saving, check:**
   - [ ] Search existing skills (`~/.claude/skills/` and project `.claude/skills/`) for overlap
   - [ ] Check MEMORY.md for overlap
   - [ ] Confirm this is a reusable pattern, not a one-off fix
   - [ ] Could this be appended to an existing skill instead?

5. **Verdict** — choose one:

   | Verdict | Meaning | Action |
   |---------|---------|--------|
   | **Save** | Unique, specific, well-scoped | Create new skill file |
   | **Absorb** | Should be appended to existing skill | Show target + additions |
   | **Memory** | Context/preference, not technique | Save as memory entry |
   | **Drop** | Trivial, redundant, or too abstract | Explain and stop |

6. **If saving as a skill**, use this format:

```markdown
---
name: pattern-name
title: Descriptive Pattern Name
scope: global (or project)
category: learned
description: "Under 130 characters"
triggers:
  - relevant trigger phrases
version: 1.0
---

# Descriptive Pattern Name

**Extracted:** YYYY-MM-DD
**Context:** Brief description of when this applies

## Problem
What problem this solves — be specific.

## Solution
The pattern/technique/workaround — with code examples.

## When to Use
Trigger conditions — what should activate this skill.
```

7. Present the draft and verdict rationale. Save only after user confirms.

## Notes

- Don't extract trivial fixes (typos, simple syntax errors)
- Don't extract one-off issues (specific API outages, etc.)
- Focus on patterns that will save time in future sessions
- Keep skills focused — one pattern per skill
- One extraction per `/learn` invocation — keep it focused
