---
name: No retry loops on failing tools
description: Stop after 1-2 failures instead of retrying the same broken command — diagnose and pivot
type: feedback
---

When a tool (like agent-browser) fails or hangs, do NOT retry the same command repeatedly. After 1 failure, try a different approach. After 2 failures, stop and tell the user. The agent-browser headed mode loop on 2026-04-01 wasted 6+ minutes retrying the same hanging command.
