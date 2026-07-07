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
