---
name: Claude Portal skill frontmatter schema
description: The claude-artefacts portal mirror of a skill uses a DIFFERENT YAML frontmatter schema than the runtime ~/.claude/skills/ copy. Using the wrong schema silently drops the skill from skills.html on the next push.
type: reference
originSessionId: 058cbc6a-779b-41bc-9f74-fc5ef7bf0b2c
---
# Claude Portal skill frontmatter schema

The `claude-artefacts` repo (gilesparnell/Claude) auto-regenerates `docs/skills.html` on every push via `.github/workflows/build-portal.yml` → `scripts/generate-stats.js`. The script reads each `skills/<slug>/SKILL.md`, parses its YAML frontmatter, and **filters out any skill that lacks a `title` field**.

## The two schemas

**Runtime — `~/.claude/skills/<slug>/SKILL.md`** (what Claude Code actually loads):
```yaml
---
name: <slug>
description: <one-line description with trigger phrases mentioned>
---
```

**Portal mirror — `claude-artefacts/skills/<slug>/SKILL.md`** (what the generator reads):
```yaml
---
title: <Human Readable Title>
scope: global | project
category: code | frontend | workflow | saas | engagement | tooling | testing
icon: &#128269;    # HTML entity
description: <one-line description>
triggers:
  - trigger phrase 1
  - trigger phrase 2
checks-label: Use when | Checks | Key rules
checks:
  - short bullet 1
  - short bullet 2
version: 1.0
---
```

## When adding a new skill

1. Create the runtime copy at `~/.claude/skills/<slug>/SKILL.md` with the **runtime schema**
2. Create the portal mirror at `claude-artefacts/skills/<slug>/SKILL.md` with the **portal schema** — the body content can be the same, but the frontmatter is different
3. Optionally run `node scripts/generate-stats.js` locally from the artefacts repo before pushing to verify the generator picks it up — if the card count doesn't go up, the frontmatter is wrong
4. Push. CI will regenerate `docs/skills.html` and auto-commit with `[skip ci]`

## Failure mode

If you use the runtime schema in the portal mirror, the skill will appear to commit and push fine, but on the **next push to the repo** (even an unrelated one), the auto-update bot will regenerate skills.html without your card, silently deleting it. The only signal is that `docs/skills.html` card count drops or stays flat.

## Category colour map (in generate-stats.js)

| category | band colour |
|---|---|
| code | blue |
| frontend | coral |
| workflow | amber |
| saas | green |
| engagement | navy |
| tooling | purple |
| testing | teal |

## Reference files

- Generator: `claude-artefacts/scripts/generate-stats.js`
- Workflow: `claude-artefacts/.github/workflows/build-portal.yml`
- Reference skill with full portal schema: `claude-artefacts/skills/code-review/SKILL.md`
