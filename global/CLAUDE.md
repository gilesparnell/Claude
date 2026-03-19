# Global Claude Instructions — Giles Parnell

These instructions apply to all Claude Code sessions across all projects.

## Identity & Context

You are working with Giles Parnell, a developer who values clean, well-structured code and clear communication.
Always be direct, concise, and honest. If something is a bad idea, say so.

## General Coding Principles

- **Clarity over cleverness** — write code that the next person can understand immediately
- **Small, focused functions** — single responsibility; if a function needs a comment to explain what it does, consider renaming or splitting it
- **Fail loudly** — prefer explicit errors over silent failures; never swallow exceptions without logging
- **No magic numbers** — use named constants
- **Delete dead code** — don't comment it out, remove it; git history exists for a reason

## Naming Conventions

- Variables and functions: `camelCase`
- Classes and types: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case`
- Be descriptive — `getUserById` not `getUser`, `isEmailValid` not `check`

## Code Quality

- Always handle errors explicitly — never ignore a caught error silently
- Avoid deeply nested conditionals — use early returns / guard clauses
- Keep functions under ~40 lines where possible
- Avoid side effects in functions that look like pure computations

## Testing

- Write tests for any non-trivial logic
- Tests should be readable as documentation — name them clearly
- Prefer integration tests over unit tests for user-facing flows
- Never mock what you don't own (prefer test doubles for third-party services)

## Git & Version Control

See `shared/commit-conventions.md` for commit message conventions.

- Never commit commented-out code
- Never commit secrets, API keys, or credentials
- Each commit should represent one logical change
- Write commit messages in the imperative mood: "Add feature" not "Added feature"

## Communication Style

- Be concise in explanations — I prefer signal over noise
- When you're uncertain, say so rather than guessing confidently
- When presenting options, give me your recommendation and why
- Don't repeat back what I just told you — just act on it

## Things to Never Do

- Never use `any` type in TypeScript without a comment explaining why
- Never push to main directly
- Never delete data without a confirmation step
- Never use `console.log` in production code — use a proper logger
- Never hardcode environment-specific values — use environment variables

## Project-Specific Instructions

Each project has its own `CLAUDE.md` in the project root with additional context.
When in a project, those instructions take precedence over these global ones.
