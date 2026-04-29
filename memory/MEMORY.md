# VSStudio Workspace Memory

## Project Location Rule
All projects MUST live in `/Users/gilesparnell/Documents/VSStudio/`. Never create projects in `~/Projects/` or any other location. This was enforced after a cleanup on 2026-03-29 where stray files in `~/Projects/` had to be consolidated back.

## Directory Structure (reorganised 2026-03-29)

```
~/Documents/VSStudio/
├── parnell-systems/
│   ├── parnellsystems-platform/   (was awe2m8-local)
│   ├── website/                   (was parnellsystems)
│   ├── allconvos/                 (was allconvos-main) — Jesse's. Don't touch.
│   ├── voice-sms/                 (was googleVoiceAiDemo)
│   ├── claude-artefacts/          (was Claude)
│   ├── sprint-tracker/            (moved here from /personal; Vercel-linked)
│   └── google-drive-migration/    (was google-drive-copy)
├── client-sites/
│   ├── robs-gardens/
│   ├── vonnies/                   (was Vonnies)
│   ├── moving4u/
│   ├── fsca/
│   └── leadgen-site/
├── personal/
│   ├── lily-health-diary/         (was LilyHealthDiary)
│   └── pool-game/
└── archive/
    ├── pirisk/
    ├── automaker/                 (third-party tool, not ours)
    └── mission-control/
```

## Key Memories
- [Project Folder Structure Standard](feedback_project_folder_structure.md) — enforce full structure at day one: root=config only, scripts/, content/, exports/, design/, __tests__/, docs/plans|decisions|handoff/
- [Resume Builder](project_resume_builder.md) — Next.js CV editor + AI profile generation from job URLs. Branch `feat/browser-ui-cv-editor`, all units complete. Needs `ANTHROPIC_API_KEY` in env to activate AI generation.
- [Garion (assistant name)](user_garion_name.md) — Giles calls me Garion (after Belgariad). Whole David Eddings universe is fair shorthand.
- [Giles Profile](user_giles_profile.md) — solopreneur, AU-based, voice AI SaaS
- [Voice Product Targets US Market](project_voice_product_us_target_market.md) — US is the target, AU customers are proof points. Do NOT lean on AU compliance moat in US-facing pitches.
- [Ship Fast Philosophy](feedback_ship_fast.md) — core belief: ship fast, deliver value, never sacrifice quality
- [Credit Efficiency](feedback_credit_efficiency.md) — ALWAYS challenge expensive skills (/deepen-plan, /document-review, /ce-review). Push back when simpler approaches work. Never silently comply with costly commands.
- [Claude vs Codex Routing](feedback_claude_codex_routing.md) — Claude for thinking, Codex for build. Every plan unit needs `Execution target:` tag. Every code-producing response states `Runner:` at the top.
- [Plan Execution Continuity](feedback_plan_execution_continuity.md) — maintain `docs/decisions/decisions.md` + `docs/handoff/handoff.md` (folder pattern) incrementally during plan work. Lets fresh Claude or Codex sessions resume.
- [Proactive Decisions & Learning](feedback_proactive_decisions_and_learning.md) — MUST proactively identify decisions worth recording as ADRs and suggest `/learn` for reusable patterns. Never let significant choices pass undocumented.
- [AllConvos Demo Migration](project_allconvos_demo_migration.md) — demos must migrate off AllConvos before full separation
- [Infrastructure Independence from Jesse (W0)](project_infrastructure_independence_from_jesse.md) — P0 migration off shared Twilio + GHL, blocks W1+ in master GTM plan. Active as of 2026-04-16.
- [Voice Product Brand TBD](project_allconvos_demo_migration.md) — do NOT hardcode any brand name (not "ZingCall")
- [TDD Mandatory Workflow](feedback_tdd_mandatory_workflow.md) — TDD-first is NON-NEGOTIABLE during dev. E2E feature test is the post-build acceptance gate, not a replacement.
- [Claude Brain Repo](reference_claude_brain_repo.md) — ALL docs, walkthroughs, skills go in gilesparnell/Claude (claude-artefacts/), NEVER in project repos. No project-specific docs or skills.
- [Google Identities](reference_google_identities.md) — `giles@parnellsystems.com` is the canonical Workspace account for ALL Parnell Systems business infra (Ads, GA4, Search Console). Don't use personal Gmail.
- [Claude Portal Skill Schema](reference_claude_portal_skill_schema.md) — portal mirror SKILL.md uses different frontmatter (title/scope/category/icon/triggers/checks) than runtime. Wrong schema = silently dropped on next push.
- [Obsidian Vault](reference_obsidian_vault.md) — `/Users/gilesparnell/Documents/ObsidianVault/`. Job Hunt folder has dashboard + 3 complete STAR stories. 6,375 raw AWS Evernote notes in `Personal/Evernote/notes/AWS/`.

## Migration Plan Location
The AWE2M8 to ParnellSystems migration plan lives at:
`parnell-systems/website/docs/plans/awe2m8-to-parnellsystems-migration.md`

## Strategy Documents
All strategy docs (AWE2M8 era + OffGHL LiveKit plan) consolidated at:
`parnell-systems/parnellsystems-platform/docs/plans/Strategy/`
