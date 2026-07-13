---
title: Prototype
scope: global
category: code
icon: &#9889;
description: Build a throwaway prototype to answer a design question — an interactive terminal app for logic/state questions, or multiple switchable UI variations for look-and-feel questions.
triggers:
  - prototype this
  - does this state model feel right
  - what should this look like
  - sanity-check this logic
checks-label: Rules
checks:
  - Throwaway from day one, clearly named as a prototype
  - One command to run; no persistence; skip the polish
  - Surface the full state after every action or variant switch
  - Capture the verdict, commit the prototype to a throwaway branch, keep only the decision on main
version: 1.1
---

# Prototype

Installed from [mattpocock/skills](https://github.com/mattpocock/skills) v1.1.0, unmodified. Part of the Wayfinder cluster. Branch guides ship with the runtime skill: `LOGIC.md`, `UI.md`.

A prototype is **throwaway code that answers a question**. The question decides the shape: "does this logic/state model feel right?" → tiny interactive terminal app pushing the state machine through hard cases; "what should this look like?" → several radically different UI variations on one route, switchable via URL param.

Note for this setup: prototypes are explicit spike/throwaway work — the recognised exemption from tdd-first. The validated decision folds into real code (which does get TDD); the prototype itself is committed to a throwaway branch and linked from the relevant issue as a primary source.

Full text at `~/.claude/skills/prototype/SKILL.md`.
