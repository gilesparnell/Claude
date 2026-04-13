---
title: Validate the Problem
scope: global
category: engagement
icon: &#128269;
description: Customer-discovery prompt template for pressure-testing whether a problem is real before building a feature, product, or campaign. Steve Blank / Mom Test tradition. Output is a discovery script, not a verdict — surfaces the questions you should be asking real people.
triggers:
  - validate the problem
  - is this a real problem
  - pressure test this idea
  - painkiller or vitamin
  - discovery questions for
checks-label: Use when
checks:
  - About to build a feature, product, or campaign with no recent customer evidence
  - You have a niche hypothesis but no proof the pain is acute
  - Tempted to skip discovery because "it's obvious"
  - Need a 5-question script for prospect calls
version: 1.0
---

# Validate the Problem

A structured customer-discovery prompt for pressure-testing whether a problem is real *before* building a feature, product, or campaign.

## When to use

- About to build a new product, feature, or paid campaign and you haven't talked to a real customer about the underlying pain in the last 90 days.
- You have a hypothesis about a niche but no evidence the problem is acute.
- You're tempted to skip discovery because "it's obvious" — that's exactly when to use this.

## When NOT to use

- The product is already in customers' hands and you have real usage data — go look at the data instead.
- You're polishing a feature you already validated. This is for *upstream* validation, not late-stage refinement.
- You've already done customer interviews recently and the answer was clear.

## How to use

Paste the prompt below into Claude (or run it inline). Replace the bracketed fields. **Treat the output as a discovery template, not a verdict.** The point is to surface the questions you should be asking real people, not to let an LLM substitute for those conversations.

## The Prompt

```
Act as a customer-discovery coach in the Steve Blank / "Mom Test" tradition.
I'm validating whether the following problem is real and acute enough to
build for.

Problem hypothesis: [one sentence — what hurts, for whom]
Target customer: [specific role + industry + business size]
My current evidence: [what makes me think this is a real problem — be honest if it's just a hunch]

Walk me through:

1. PAINKILLER OR VITAMIN — Is this a problem people will pay to solve, or
   a nice-to-have? What's the single tightest test I can run to find out?

2. WHO HURTS THE MOST — Who is the early-adopter sub-segment, narrower
   than my "target customer" above? Describe them in one sentence so I
   could find 5 of them on LinkedIn this afternoon.

3. FIVE DISCOVERY QUESTIONS — Five open-ended questions I should ask real
   prospects in a 20-minute call. Questions must be about their past
   behaviour and current pain, NOT about my proposed solution. No leading
   questions. No "would you use…?".

4. RED FLAGS — Three responses from prospects that should make me kill
   this idea immediately, even if they're polite about it.

5. GREEN FLAGS — Three behavioural signals (not opinions) that prove the
   problem is real and acute.

Be brutally honest. If my problem hypothesis is vague, fluffy, or
obviously a vitamin, say so first and refuse to proceed until I sharpen it.
```

## Reading the output

- **Treat the 5 questions as a script for real calls.** If you don't book at least 3 conversations off the back of this prompt, you wasted the prompt.
- **Red flags are the most valuable section.** They're the cheap kills — pay attention if any prospect gives you one.
- **Behavioural green flags > opinion green flags.** "Yes I'd buy that" means nothing. "I'm currently paying $X/month for [hacky workaround]" means everything.

## Anti-patterns

- Running this prompt and treating the output as validation. It is not.
- Running this prompt and never making the calls.
- Tweaking the prompt until the LLM tells you the idea is good. That's the opposite of validation.
