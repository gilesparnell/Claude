---
name: Always do a UI consistency pass after multi-surface integrations
description: When rolling out a shared UI component to multiple pages, do a deliberate polish pass covering typography, placement, escape handling, and desktop/mobile parity before calling it done
type: feedback
originSessionId: f2c9c203-7bd5-4b04-8015-f60825c399a7
---
When wiring a single component into 4+ surfaces in one PR, do not ship without a deliberate style-consistency pass. Things Giles caught in PR #5 that should have been caught before merge:

- **JSX text unicode escapes don't process.** `<p>How\u2019s your mood</p>` renders the literal six characters. Use `&rsquo;` or actual Unicode in JSX text — not `\u2019`. Only string literals (attributes, JS expressions) process escapes.
- **Desktop typography diverged from the rest of the app.** The Help sheet shipped with 15px body / 22px title while the app's body convention is 13–14px. Sample a few existing components (sections, cards, labels) and match, don't guess.
- **Icon placement inconsistency across surfaces.** Some Help icons floated right (`marginLeft: auto`), some sat adjacent to labels. Decision must be made ONCE and applied everywhere. Default: adjacent-to-label with a 4–6px gap.
- **Centred headings + inline affordance breaks symmetry.** When the title is centred (`h2 { text-align: center }`) and an icon sits next to it via flex, the title's visual centre line shifts. Fix: use an invisible left-side spacer (`<span style="width: 24px" aria-hidden />`) the same size as the icon, so the title stays centred.
- **-N margin hacks to "cancel hit-area expansion" cause overlap.** A 44×44 tap target with `margin: -12` to visually shrink back to 20×20 means the hit box overlaps neighbours. For inline affordances next to text, use a smaller visual button (~24×24) — 44×44 is for standalone primary buttons, not inline indicators. iOS Safari itself uses ~24×24 for inline info buttons in forms.
- **Modals and dialogues must be rendered via React portal** (`createPortal(..., document.body)`), not as children of whatever DOM element opens them. `position: fixed` only fixes visual layout — CSS inheritance still flows through the DOM tree. A dialogue rendered inside a `<p style="text-transform: uppercase; letter-spacing: 2">` will have ALL its text rendered uppercase with tracked letters, even though visually it's floating over the whole page. Portal to body for bulletproof separation. See PR #7 for the Progress-page regression this caused.

**Why:** Giles reviewed the first Help rollout and found six separate polish issues across pages. The concept was right but the integration was sloppy. His exact words: "Overall a pretty poor quality update." He values polish and wants a deliberate consistency pass before declaring a multi-surface feature done.

**How to apply:** Before committing a multi-page integration PR:
1. Start the dev server and literally click through every surface on a mobile viewport AND a desktop viewport.
2. Check: icon placement (adjacent? floated?), icon size (dominant? proportional?), typography (matches surrounding text?), unicode escapes (`\u` in JSX text is always a bug), margin hacks (any negative margin that could overlap neighbours?).
3. Assume any pattern you copy across surfaces needs a variant for centred vs left-aligned parents.
4. Do not ship a style refactor without sampling the existing visual vocabulary first — look at at least three similar components before introducing new font sizes, paddings, or colours.
