---
title: Verification Before Completion
scope: global
category: code
icon: ✅
description: Prevents premature completion claims. Use before claiming work is done, fixed, or passing — requires running verification commands and confirming output before making any success assertions. Evidence before claims, always. Adapted from obra/superpowers.
triggers:
  - done
  - fixed
  - tests pass
  - it works
  - ready for review
  - complete
  - all good
checks-label: Rules
checks:
  - No completion claims without fresh verification evidence
  - Run the actual verification command in this message before claiming success
  - Read full output and check exit code
  - Never use "should", "probably", or "seems to" for status claims
  - No expressing satisfaction before verification
  - Verify agent-delegated work independently
  - Check requirements line-by-line, not just test results
version: 1.0
---
