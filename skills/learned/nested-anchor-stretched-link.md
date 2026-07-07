---
name: nested-anchor-stretched-link
title: Avoid Nested Anchors — Use Stretched Link Pattern
scope: global
category: learned
description: "Fix visual artefacts from nested <a> tags by using CSS stretched-link pattern on card components"
triggers:
  - card with multiple links
  - clickable card with inner links
  - nested anchor tags
  - card link and icon link
version: 1.0
---

# Avoid Nested Anchors — Use Stretched Link Pattern

**Extracted:** 2026-04-01
**Context:** Any card/tile UI where the whole card should be clickable AND contain a secondary link (e.g., GitHub icon)

## Problem

Wrapping a card in `<a>` and placing `<a>` links inside it creates **invalid nested `<a>` tags**. Browsers break them apart unpredictably, causing:
- Visual artefacts (floating box shapes, orphaned elements)
- Broken click targets
- Inconsistent behaviour across browsers

This is especially bad when card `<a>` wraps a `<ul>` with `<a>` links inside — the browser tears the DOM apart trying to fix the nesting.

## Solution

Use the **stretched-link pattern**:

```html
<div class="card">
  <div class="card-top">
    <h2><a href="/docs" class="card-title">Project Name</a></h2>
    <p>Description text</p>
  </div>
  <div class="card-footer">
    <a href="https://github.com/..." class="card-gh">GitHub icon</a>
  </div>
</div>
```

```css
/* The h2 link stretches to cover the whole card */
.card-title {
  color: inherit;
  text-decoration: none;
}
.card-title::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
}

/* Card content sits above the stretched link */
.card-top { position: relative; z-index: 2; }

/* Secondary links sit above everything */
.card-footer { position: relative; z-index: 3; }
.card-gh { position: relative; z-index: 4; }
```

## How It Works

1. The `<a class="card-title">` inside the `<h2>` has a `::after` pseudo-element that covers the entire card (`position: absolute; inset: 0`)
2. Clicking anywhere on the card hits this invisible overlay → navigates to the primary URL
3. The GitHub icon (`.card-gh`) has `z-index: 4`, sitting above the overlay → clicking it navigates to GitHub instead
4. No nested `<a>` tags — fully valid HTML

## When to Use

- Card components that need a primary click action AND a secondary link
- Tile grids where the whole tile should be clickable
- Any time you're tempted to wrap a `<div>` with `<a>` but need inner links too
