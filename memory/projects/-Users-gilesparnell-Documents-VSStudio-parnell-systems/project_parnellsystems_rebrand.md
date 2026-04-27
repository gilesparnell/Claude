---
name: awe2m8 to parnellsystems rebrand
description: Rebranding from awe2m8 to parnellsystems — repo rename, new domain, Google Workspace, and eventually full infrastructure migration.
type: project
---

Two-phase rebrand in progress (started 2026-03-30):

Phase 1 (active): Repo rename + domain + Google Workspace
- GitHub: gilesparnell/awe2m8 → gilesparnell/parnellsystems
- Domain: internal.parnellsystems.com (keeping internal.awe2m8.ai as fallback)
- Google Workspace Business Starter for parnellsystems.com (giles@parnellsystems.com)
- New Google OAuth credentials for the new domain
- Plan: docs/plans/2026-03-30-001-refactor-repo-rename-and-domain-setup-plan.md

Phase 2 (next): Firebase → Supabase migration (separate plan to be created)

Twilio references are intentionally left as-is for now.
Firebase continues to work during Phase 1 — it's domain-agnostic.
