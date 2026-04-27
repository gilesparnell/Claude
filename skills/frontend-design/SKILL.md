---
name: frontend-design
description: Use this skill when building UI components, designing layouts, or making frontend styling decisions. Triggers on 'build this UI', 'style this component', 'make this look good', 'improve the design', 'create a landing page'.
---

# Frontend Design Skill

This skill guides Claude toward high-quality, opinionated frontend design that avoids generic AI aesthetics.

## Design Principles

- **Whitespace is not wasted space** — generous padding and breathing room signals quality
- **Typography does the heavy lifting** — a well-set type scale makes everything look better
- **Fewer colours, more intentionality** — a 2-3 colour palette used consistently beats 8 colours used loosely
- **Hierarchy through contrast** — use size, weight, and colour to guide the eye, not just position

## What to Avoid (The AI Clichés)

- ❌ Inter font as the default choice — try Geist, Plus Jakarta Sans, or DM Sans instead
- ❌ Purple/violet as the primary brand colour — it's the most overused gradient in AI products
- ❌ Cards with `rounded-2xl` shadow everywhere — not everything needs to be a card
- ❌ Gradient hero text — use it very sparingly or not at all
- ❌ "Glassy" / frosted glass effects unless they genuinely add depth
- ❌ Loading spinners in the centre of the page — prefer skeleton screens

## Tailwind Guidelines

Key rules:
- Use spacing scale consistently — don't mix `p-3` and `p-[14px]` arbitrarily
- Prefer `gap-` over manual margins in flex/grid layouts
- Use semantic colour names via CSS variables, not arbitrary values

## Component Patterns

- Buttons: always have a clear hover and focus state
- Forms: labels above inputs (not placeholder-only), clear error states
- Lists: consider if a grid would communicate better than a vertical list
- Empty states: design them — they're the first thing new users see

## Responsive Design

- Mobile-first always
- Test at 375px, 768px, 1280px as a minimum
- Don't hide important content on mobile — rethink the layout instead

## Deployment Verification (MANDATORY for visual changes)

After pushing CSS, colour, or layout changes to production:

1. **Fetch the live HTML** — confirm the correct Tailwind classes are in the rendered output
2. **Fetch the compiled CSS file** — confirm CSS variable values match what you set
3. **Check for known-bad patterns** — e.g. `backdrop-blur` on cards over dark backgrounds

Never tell the user "it should work now" based on code alone. The only reliable check is what the browser actually receives. If the project has a `scripts/verify-deploy.sh`, run it and report the pass/fail results.

## Gotchas

- Don't add animation to everything — motion should have meaning
- Dark mode: if you add it, make sure contrast ratios pass WCAG AA
- Don't use colour alone to convey information (accessibility)
- Test with real content, not lorem ipsum — layouts break with real data
- **`backdrop-blur` on cards over dark/image backgrounds turns everything grey** — the blur averages the background pixels into a neutral grey that bleeds through regardless of card colour or opacity. Only use `backdrop-blur` on overlays (lightboxes, modals) where the grey effect is intentional
- **OKLCH chroma below 0.03 is visually imperceptible** — if you set a "dark red" card to `oklch(0.14 0.02 350)` it will look grey. Use chroma >= 0.04 for any colour that needs to be visible
