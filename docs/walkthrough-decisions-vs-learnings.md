# Decisions vs Learnings: When & How We Capture Knowledge

## The Two Systems at a Glance

```
                    KNOWLEDGE CAPTURED DURING A SESSION
                                  |
                    +-------------+-------------+
                    |                           |
              DECISION (ADR)              LEARNING (/learn)
              "Why we chose"             "How we solved"
                    |                           |
          claude-artefacts/            ~/.claude/skills/learned/
            decisions/                   or project skills/
                    |                           |
          Portal: decisions.html        Loaded into future
          (visible, searchable)         sessions automatically
```

---

## What Triggers Each?

```
SESSION EVENTS
==============

  "Let's use Vite instead of Next.js"
  "Pricing should be $399/$599/$799"                    ──►  DECISION (ADR)
  "We'll do two-stage reactivation for compliance"           Why A over B
  "Stripe Payment Links, not embedded checkout"              Strategic choice
                                                             Affects direction

  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─

  "Oh, you have to set multiline: true for that regex"
  "GHL webhooks need X-Header for auth"                 ──►  LEARNING (/learn)
  "The pre-renderer needs routes listed explicitly"          How to do X
  "Framer Motion layoutId breaks with React Router"          Technique/workaround
                                                             Saves future time
```

---

## Decision Flow

```
  You say something       I recognise a        I propose at a
  or we agree on     ──►  strategic choice ──►  natural pause
  an approach              was made              point

                                                    │
                                                    ▼
                                        "That's a decision worth
                                         recording — [description].
                                         Want me to add ADR-NNN?"
                                                    │
                                          ┌─────────┴─────────┐
                                          │                     │
                                       You: "yes"           You: "no"
                                          │                  or "not now"
                                          ▼                     │
                                    Write ADR file              │
                                    Push to portal              ▼
                                    Portal rebuilds           (dropped)
                                          │
                                          ▼
                                  ┌─────────────────┐
                                  │  ADR-014.md      │
                                  │  ───────────     │
                                  │  title: ...      │
                                  │  status: accepted│
                                  │  category: ...   │
                                  │  date: ...       │
                                  │  tags: [...]     │
                                  │                  │
                                  │  2-4 sentences:  │
                                  │  what, why,      │
                                  │  tradeoffs,      │
                                  │  migration path  │
                                  └─────────────────┘
```

### Decision Examples from Our Work

| # | Decision | Why It Matters |
|---|----------|---------------|
| ADR-004 | Vite + React over Next.js | Sets the frontend architecture for 6-12 months |
| ADR-005 | GHL native voice agents | Prevents marketing LiveKit/Vapi as current capability |
| ADR-009 | $399/$599/$799 pricing | Revenue model — gets baked into Stripe, website, sales materials |
| ADR-010 | Two-stage reactivation | Legal compliance — getting this wrong means fines |
| ADR-012 | No brand name commitment | Prevents hardcoding a name across code, config, and marketing |

### What Makes Something a Decision?

Ask: **"If we reversed this next month, would it be painful?"**

- Yes = decision, write an ADR
- No = just a choice, move on

---

## Learning Flow

```
  We solve a tricky      I recognise a         I suggest at
  problem or discover ►  reusable pattern  ──► session end or
  a non-obvious fix      worth preserving      after the solve

                                                    │
                                                    ▼
                                        "There's a reusable pattern
                                         here — [description].
                                         Want me to run /learn?"
                                                    │
                                          ┌─────────┴─────────┐
                                          │                     │
                                       You: "yes"           You: "no"
                                          │                     │
                                          ▼                     ▼
                                    /learn analyses          (dropped)
                                    the session
                                          │
                                ┌─────────┴─────────┐
                                │                     │
                          Reusable across        Project-specific
                          projects?              only?
                                │                     │
                                ▼                     ▼
                      ~/.claude/skills/      .claude/skills/
                        learned/               learned/
                                │                     │
                                └─────────┬───────────┘
                                          ▼
                                  ┌─────────────────┐
                                  │  pattern-name.md │
                                  │  ───────────     │
                                  │  Problem:        │
                                  │  what went wrong │
                                  │                  │
                                  │  Solution:       │
                                  │  exact fix +     │
                                  │  code examples   │
                                  │                  │
                                  │  When to Use:    │
                                  │  trigger conds   │
                                  └─────────────────┘
```

### Learning Examples (Hypothetical — We Haven't Run /learn Yet)

| Pattern | Problem | Reusable? |
|---------|---------|-----------|
| GHL webhook auth headers | Webhooks silently fail without X-Header | Project-specific |
| Vite pre-renderer route config | Pre-renderer misses dynamic routes unless explicitly listed | Global |
| Framer Motion + React Router | `layoutId` animations break on route transitions | Global |
| useSEO hook pattern | Zero-dep meta tag management for SPAs with pre-rendering | Global |

### What Makes Something a Learning?

Ask: **"Would this save me 30+ minutes if I hit it again?"**

- Yes = learning, run `/learn`
- No = just a fix, move on

---

## Side by Side

```
         DECISION                          LEARNING
         ════════                          ════════

    "We chose Vite over              "Here's how to configure
     Next.js because..."              Vite's pre-renderer for
                                      dynamic routes..."

    Strategic / directional           Tactical / technical
    Affects project trajectory        Saves time on repeat encounters
    Reversal would be painful         Forgetting means debugging again

    ADR in claude-artefacts/          Skill in .claude/skills/learned/
    Visible on portal                 Auto-loaded into future sessions
    Human-readable reference          Machine-readable trigger

    Proposed at pause points          Proposed after solves
    Batched at session end            One per /learn invocation

    Lives forever (or until           Lives until superseded
    status changes to                 by a better pattern
    "superseded")
```

---

## When I'll Prompt You

```
DURING A SESSION
================

  Building / discussing                 Solving a problem
        │                                      │
        ▼                                      ▼
  ┌─────────────┐                     ┌─────────────────┐
  │ Choice made? │──── no ──────────► │ Non-obvious fix? │── no ──► (continue)
  └──────┬──────┘                     └────────┬────────┘
         │ yes                                  │ yes
         ▼                                      ▼
  ┌──────────────┐                    ┌──────────────────┐
  │ Painful to   │                    │ Would hit this   │
  │ reverse?     │── no ──► (skip)    │ again?           │── no ──► (skip)
  └──────┬───────┘                    └────────┬─────────┘
         │ yes                                  │ yes
         ▼                                      ▼
  ┌──────────────┐                    ┌──────────────────┐
  │ Note it.     │                    │ Note it.         │
  │ Propose ADR  │                    │ Suggest /learn   │
  │ at next      │                    │ at session end   │
  │ pause point. │                    │ or after solve.  │
  └──────────────┘                    └──────────────────┘


AT SESSION END
==============

  ┌─────────────────────────────────────────────────┐
  │  "This session we made N decisions and solved    │
  │   M non-trivial problems. Want me to:            │
  │                                                   │
  │   1. Write ADRs for: [list]                       │
  │   2. Run /learn to extract: [pattern description] │
  │   3. Both                                         │
  │   4. Skip — nothing worth capturing"              │
  └─────────────────────────────────────────────────┘
```

---

## Where Everything Lives

```
claude-artefacts/                        ~/.claude/
├── decisions/                           ├── commands/
│   ├── ADR-001.md  ◄── portal reads     │   └── learn.md  ◄── /learn skill
│   ├── ADR-002.md      these and        ├── skills/
│   ├── ...             generates        │   └── learned/   ◄── global patterns
│   └── ADR-013.md      decisions.html   └── projects/
├── docs/                                    └── .../memory/
│   └── decisions.html  ◄── auto-built       ├── MEMORY.md
└── .github/workflows/                       └── feedback_proactive_decisions
    └── build-portal.yml                         _and_learning.md  ◄── THIS RULE


project/.claude/skills/learned/  ◄── project-specific patterns
```
