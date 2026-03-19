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

See `references/tailwind-patterns.md` for preferred Tailwind patterns.

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

## References

See `references/` folder for:
- `tailwind-patterns.md` — preferred utility class patterns
- `examples.md` — component examples to reference

## Gotchas

- Don't add animation to everything — motion should have meaning
- Dark mode: if you add it, make sure contrast ratios pass WCAG AA
- Don't use colour alone to convey information (accessibility)
- Test with real content, not lorem ipsum — layouts break with real data
