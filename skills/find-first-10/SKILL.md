---
name: find-first-10
description: Build a concrete plan to manually find and personally close the first 10 customers for a new product, feature, or pricing tier. Includes the Sean Ellis "would be devastated" test. Triggers on 'find first 10', 'first 10 customers', 'who do I sell this to first', 'sean ellis test', 'manual customer acquisition plan'.
---

# Find Your First 10 Customers

A concrete plan-builder for manually finding and personally closing the first 10 customers for a new product, feature, or pricing tier — *before* you scale paid acquisition.

## When to use

- About to launch (or just launched) something and you don't yet have 10 paying customers using it.
- About to spend money on paid ads, SEO, or any scalable channel and you haven't proven the product manually.
- Stuck on "how do I get my first customers" — this gives you a concrete 2-week plan, not a strategy doc.

## When NOT to use

- You already have 50+ paying customers and want to scale. Go to a growth-engine prompt instead.
- You're in pure ideation with no product. Use `validate-problem` first.
- You're in a market where manual outreach genuinely doesn't work (e.g. mass consumer with $5 ARPU). Rare — usually it's an excuse.

## How to use

Paste the prompt below into Claude. Replace the bracketed fields. The output is a concrete plan you should be able to start executing the same day.

## The Prompt

```
Act as a hands-on early-stage GTM coach. I'm trying to manually find and
personally close the first 10 paying customers for the following product.
Forget paid ads, SEO, and content marketing. I want a concrete 2-week
plan I can start executing today.

Product: [one-sentence description]
Who it's for: [specific role + industry + business size]
Price point: [$X/month or $X one-time]
What I have already: [demo? landing page? working product? testimonials?]
Time available: [hours per day I can spend on outreach]

Give me:

1. THE TEN — Ten specific places (communities, directories, sub-niches,
   events, partner lists, marketplaces) where I can find people who
   match the target customer THIS WEEK. Be specific — not "LinkedIn" but
   "search LinkedIn for [exact query]" or "post in [specific subreddit]".

2. THE OUTREACH — A short, non-cringe outreach message I can send to a
   stranger. No "hope you're well", no "quick question", no fake
   compliments. Plain language, leads with the problem, ends with a
   single low-commitment ask.

3. THE WEEK-1 PLAN — Day-by-day what I should do to get 5 conversations
   booked in the first week. Be specific about volumes and timing.

4. THE CONVERSION PATH — How I turn a conversation into a paying
   customer in one or two follow-ups, without coming across as pushy.

5. THE SEAN ELLIS TEST — How and when to run the "how would you feel if
   you could no longer use this product" survey on the first 10 once
   they're using it. What threshold counts as product-market fit signal.

6. KILL CRITERIA — If I do all this for 2 weeks and hit X result, I
   should kill the product. Define X.

Be specific. Be concrete. Refuse to give me generic "build in public"
advice. If you don't know my niche well enough to be specific, ask me
two clarifying questions first and then give me the plan.
```

## Reading the output

- **The Ten** is the section that matters most. If it's vague ("LinkedIn", "Reddit", "communities"), push back and re-prompt with more niche detail.
- **The outreach message** — rewrite it in your own voice before sending. The LLM version will sound like an LLM.
- **Sean Ellis test threshold:** 40%+ of users saying "very disappointed" if the product disappeared is the canonical PMF threshold. Below that, keep iterating.
- **Kill criteria** is the section founders ignore. Don't ignore it.

## Anti-patterns

- Generating the plan and never executing it.
- Skipping the manual phase and going straight to paid ads "because manual doesn't scale". You're not trying to scale yet — you're trying to learn.
- Sending the LLM-generated outreach message verbatim. Always rewrite.
- Running this prompt for an existing successful product. It's for the *first 10*, not the next 10,000.
