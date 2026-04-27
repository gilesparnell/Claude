---
name: Progress visibility during long autonomous sessions
description: When working uninterrupted for long periods (e.g. overnight), Giles needs visible progress pings to the screen so he can tell work is still happening — short is fine, but silent is not
type: feedback
originSessionId: 5c5a53b8-92f7-4413-a393-c86715523846
---
When Giles hands off a task to work on uninterrupted (e.g. "I'm going to bed, please work on this"), he needs short, visible progress updates between tool calls, even though reducing overall verbosity is welcome. Silent runs of many tool calls make it look like Claude has stalled or crashed, especially when he checks the screen hours later from a phone or fresh window.

**Why:** Prior incident — during an earlier long-running task, Claude stopped surfacing any text between tool calls and Giles couldn't tell whether progress was being made. He said it was "very hard to see whether you actually were doing anything".

**How to apply:**
- For autonomous / overnight work, still print a one-line status before each major step (e.g. "Unit 10 start: installing prerenderer", "Unit 10 build test passed, moving to Unit 11").
- Status pings should reference the plan unit and whether it's start/progress/done, so Giles can orient himself instantly when he checks back.
- Reducing detail ≠ going silent. Keep the lines short but frequent.
- If running as a single long turn with many tool calls, inject text between tool-call groups so the transcript doesn't look like one empty block.
- A visible running checklist ("Phase 2: [x] Unit 10  [ ] Unit 11  [ ] Unit 12 in-progress") is ideal for tracking progress against a plan.
