---
name: git-conventions
description: Use this skill when creating commits, writing commit messages, preparing PRs, or when asked about git workflow. Triggers on 'commit this', 'write a commit message', 'create a PR', 'prepare for review'.
---

# Git Conventions Skill

Follow these conventions for all git operations in Giles' projects.

## Commit Message Format

Use Conventional Commits:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types
- `feat` — new feature
- `fix` — bug fix
- `chore` — maintenance, dependencies, config
- `docs` — documentation only
- `refactor` — code change that neither fixes a bug nor adds a feature
- `test` — adding or updating tests
- `perf` — performance improvement
- `ci` — CI/CD changes

### Rules
- Subject line: max 72 characters, imperative mood, no period at end
- Body: wrap at 72 chars, explain *why* not *what*
- Reference issues: `Fixes #123` or `Relates to #456`

### Examples
```
feat(auth): add OAuth2 login with Google

Adds Google OAuth2 as a login option alongside existing email/password.
Uses the existing session management system.

Fixes #89
```

```
fix(api): handle null response from payment provider

The Stripe webhook occasionally sends a null amount field for
disputed charges. This was causing an unhandled exception.
```

## Branch Naming

```
<type>/<short-description>
```

Examples:
- `feat/user-dashboard`
- `fix/login-redirect-bug`
- `chore/update-dependencies`

## PR Description Template

```markdown
## What
[Brief description of the change]

## Why
[Context and motivation]

## How
[Implementation approach, notable decisions]

## Testing
[How to verify this works]

## Screenshots (if UI change)
```

## Gotchas

- Never commit directly to `main` or `master`
- Never include secrets, API keys, or `.env` files
- Squash fixup commits before merging — don't leave "fix typo" commits in history
- If a commit message needs "and" to describe what it does, it probably should be two commits
