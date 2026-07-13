---
title: Visualise
scope: global
category: workflow
icon: &#128506;
description: Diagram-first explanations — whenever a process, architecture, plan status, or data flow is being explained, produce a rendered Mermaid diagram alongside the prose.
triggers:
  - diagram this
  - visualise
  - map this
  - show me the flow
  - where are we in the plan
checks-label: Rules
checks:
  - Source of truth is a .mmd file committed with the project (design/ folder)
  - Status is visual — solid = in place, dashed amber = planned
  - Terminal sessions render via local HTML opened in the browser (no side panel in a CLI)
  - Max ~15 nodes per diagram; split rather than cram
version: 1.0
---

# Visualise

Giles is a visual person. When an explanation describes structure — a process, a pipeline, an architecture, plan progress, how components relate — draw it. Prose carries the reasoning; the diagram carries the shape.

## When to fire

- Explaining any multi-step process, workflow, pipeline, or data flow
- Plan status and "where are we" answers — render workstreams/phases as a diagram, not only a table
- Architecture explanations: how services, repos, or components relate
- Triage/decision outcomes with structure worth seeing (accept/reject flows, routing splits)
- Explicit asks: "diagram", "visualise", "map", "show me"

Skip when the content is genuinely linear or trivial (a 3-item list does not need a flowchart).

## Conventions

1. **Source of truth is a `.mmd` file**, committed with the project — in the project's `design/` folder if one exists, otherwise the scratchpad. The reference example is `claude/claude-radar/design/process-map.mmd`.
2. **Status encoding (Deep Ocean palette):** solid nodes = in place/done; dashed amber = planned (`classDef planned stroke-dasharray:5 5,stroke:#d9a441`); teal `#38bfa0` for emphasis edges and loops. Existing vs planned must be visually distinct — gaps read as choices.
3. **Keep it scannable:** ~15 nodes max per diagram. Split into multiple diagrams rather than cramming one.
4. Normal commit gates apply — never auto-commit the files.

## Delivery — pick by environment

- **Terminal CLI session (ghostty etc.) — the default:** terminals cannot render diagrams and there is no side panel. Wrap the Mermaid source in an HTML template with the Mermaid CDN module, save it next to the `.mmd`, run `open <file>.html` (macOS) so it opens in the browser, and say so in the reply.
- **Claude Code web / desktop app / IDE extension:** a side panel exists there — `SendUserFile` with `display: render` on the `.mmd` works directly.
- **Durable or shareable page** (capability maps, dashboards): publish an Artefact instead. The Artefact CSP blocks the Mermaid CDN — pre-render to SVG first (`npx -y @mermaid-js/mermaid-cli -i in.mmd -o out.svg`) and inline the SVG, or hand-build the page.

## HTML preview template

```html
<!doctype html>
<meta charset="utf-8">
<title>DIAGRAM TITLE</title>
<style>
  body { margin: 0; background: #0a0c10; min-height: 100vh; display: grid;
         place-items: center; padding: 32px; box-sizing: border-box; }
  .mermaid { max-width: 100%; }
</style>
<pre class="mermaid">
%% paste the .mmd content here
</pre>
<script type="module">
  import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
  mermaid.initialize({ startOnLoad: true, theme: "dark" });
</script>
```
