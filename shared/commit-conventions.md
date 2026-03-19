# Commit Conventions

Use Conventional Commits format: https://www.conventionalcommits.org

## Format

```
<type>(<optional scope>): <description>

[optional body]

[optional footer]
```

## Types

| Type | When to use |
|------|-------------|
| `feat` | New feature for the user |
| `fix` | Bug fix for the user |
| `chore` | Build process, tooling, dependencies |
| `docs` | Documentation only |
| `refactor` | Code change that doesn't fix a bug or add a feature |
| `test` | Adding or updating tests |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration changes |
| `revert` | Reverting a previous commit |

## Rules

- Subject line max 72 characters
- Use imperative mood: "Add" not "Added" or "Adding"
- No period at end of subject line
- Body explains *why*, not *what* (the diff shows what)
- Reference issues in footer: `Fixes #123`, `Closes #456`

## Examples

```
feat(auth): add magic link email login

Adds passwordless login via magic link as an alternative to
email/password. Uses the existing email sending infrastructure.

Fixes #234
```

```
fix(checkout): prevent duplicate order submission on slow networks

The submit button was not disabled during the async request,
allowing users to click multiple times and create duplicate orders.
```

```
chore: upgrade Next.js to 14.2.0
```
