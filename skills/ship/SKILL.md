---
title: /ship
scope: global
category: workflow
icon: 🚢
description: Verified PR ship procedure — tests, lint, commit, push, open PR, then verify merge before claiming done. Terminates the "claimed merged but wasn't" failure mode.
triggers:
  - ship this
  - push and PR
  - wrap up and ship
  - ready to ship
checks-label: Steps
checks:
  - Run tests sequentially (no --watch); halt on failure
  - Lint + typecheck; never --no-verify to bypass
  - Commit via git-conventions, push, open PR with gh
  - Verify merge via gh pr view before claiming done
version: 1.0
---
