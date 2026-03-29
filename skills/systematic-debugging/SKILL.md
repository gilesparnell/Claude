---
title: Systematic Debugging
scope: global
category: code
icon: 🔍
description: Root-cause-first debugging methodology. Use when encountering any bug, test failure, or unexpected behaviour — before proposing fixes. Enforces evidence gathering, pattern analysis, hypothesis testing, and defence-in-depth validation. Adapted from obra/superpowers.
triggers:
  - bug
  - test failure
  - unexpected behaviour
  - debugging
  - why is this broken
  - it doesn't work
  - fix this
checks-label: Rules
checks:
  - No fixes without root cause investigation first
  - Read error messages completely before acting
  - Reproduce consistently before hypothesising
  - One hypothesis at a time — smallest possible change
  - Create a failing test before implementing a fix
  - If 3+ fixes fail, question the architecture
  - Trace bugs backward through the call stack to find the source
  - Add defence-in-depth validation at every layer
version: 1.0
---
