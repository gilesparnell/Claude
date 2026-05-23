---
name: feedback-verify-pinned-lib-api
description: "When writing a design that references an external library API, verify the surface against the pinned version's actual source, not against plan/brainstorm notes that may be stale."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 93044e95-1c35-440a-a90b-cf1a21efc33f
---

When a design or codex prompt references an external library's API
(method names, property vs function, event hooks, etc.), verify the
surface against **the actually-pinned version's source**, not the
plan/brainstorm/research notes that captured it.

**Why:** On 2026-05-23, F5 (game modal) shipped a `k.audioCtx().resume()`
audio-unlock call because the plan's research insight (line 240) used
that syntax. Kaplay 3001.0.19 exposes `audioCtx` as a plain
AudioContext **property** — calling it as a function threw mid-tap and
broke the user-facing flow. A 30-second `curl unpkg.com/kaplay@<pin>/dist/kaplay.mjs | grep audioCtx`
would have caught it before codex implemented.

**How to apply:**
- For any library API call in a design doc or codex prompt, do a quick
  source-grep against the pinned version's CDN URL (or `npm view` if
  on a registry).
- Especially important when the plan/brainstorm research is more than a
  couple of weeks old — APIs drift.
- When in doubt: pin the version (we do), and verify once, in the design
  pass, against that pinned source. Don't propagate the version's
  research without re-verifying the specific surfaces being used.

Related: [[feedback_credit_efficiency]] — the cheapest verification at
design time saves the most expensive re-work at integration time.
