---
title: Grilling
scope: global
category: workflow
icon: &#128293;
description: Relentless one-question-at-a-time interview to stress-test a plan or design until shared understanding is reached.
triggers:
  - grill me
  - grill this plan
  - stress-test this design
checks-label: Rules
checks:
  - One question at a time — never a bewildering batch
  - Facts get looked up in the codebase; decisions get put to the user
  - Every question comes with a recommended answer
  - Nothing is enacted until shared understanding is confirmed
version: 1.1
---

# Grilling

Installed from [mattpocock/skills](https://github.com/mattpocock/skills) v1.1.0, unmodified. Part of the Wayfinder cluster.

Interview the user relentlessly about every aspect of a plan until shared understanding is reached. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide a recommended answer.

Ask questions one at a time, waiting for feedback on each before continuing. If a *fact* can be found by exploring the codebase, look it up rather than asking. The *decisions* are the user's — put each one to them and wait.

Do not enact the plan until the user confirms shared understanding.
