---
name: no-browser-refresh
description: Never require browser refresh after any data mutation — page must update immediately after modal close or data change
type: feedback
---

After any modal closes or data is added/updated/deleted, the page must reflect the change immediately without a manual browser refresh. Always call `router.refresh()` or use optimistic UI updates after mutations. Decision documented in `decisions/001-no-browser-refresh.md`.
