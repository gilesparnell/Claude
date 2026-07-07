# Claude Knowledge Portal

A public knowledge portal for Giles Parnell's Claude / AI engineering work:
reusable **skills**, visual **walkthroughs**, and project **templates** for
building with Claude Code.

## What's here

- **Skills** — engineering skills for Claude Code (code review, TDD, shipping,
  security review, systematic debugging, and more).
- **Walkthroughs** — architecture diagrams and mental models: workflow setup,
  memory sync, subagents vs. agent teams, wave execution, and others.
- **Templates** — starting `CLAUDE.md` files for new projects (generic,
  Next.js, and Python API).

## The portal site

The browsable portal is served from the [`/docs`](docs/) folder via GitHub
Pages. It is a set of self-contained static pages (`docs/portal.css` +
`docs/portal-shell.js`) that render a searchable index of everything in this
repo, with sidebar browsing, tag filters, and a command-palette search.

The index is generated into `docs/docs-index.json`; full-text search is powered
by a Pagefind index under `docs/pagefind/`.

## Sensitive-term scan

This is a public repo curated from private sources. `scripts/scan-sensitive.sh`
greps every tracked file for pricing, client, PII, secret, and internal-path
terms and fails on any match. It runs as an enforced check on every push and PR
(`.github/workflows/scan.yml`) and as an advisory local pre-commit hook. After
cloning, enable the hook with: `git config core.hooksPath .githooks`.
