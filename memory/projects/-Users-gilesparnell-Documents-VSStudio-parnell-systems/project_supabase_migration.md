---
name: Firebase to Supabase migration
description: Platform is migrating from Firebase/Firestore (awe2m8-sales project) to Supabase/Prisma/PostgreSQL. Phase 2 of the parnellsystems rebrand.
type: project
---

User wants to migrate from Firebase to Supabase as part of the parnellsystems rebrand. This is Phase 2 — after the repo rename, domain setup, and Google Workspace are complete (Phase 1).

Key context from Firebase audit (2026-03-30):
- 12 Firestore collections: activities, agents, tasks (with sub-collections: logs, investigations, considerations, deliverables), admin_users, clients, ghl_triggers, agent_tasks, areas_of_investigation, user_stories
- Dual auth: NextAuth v5 + Firebase Anonymous Auth for client-side reads
- Heavy onSnapshot real-time usage in Mission Control hooks
- 16+ files directly import Firebase (hooks, API routes, components, scripts)
- Firebase project: awe2m8-sales (under awe2m8 Google account)
- CLAUDE.md already lists Firebase → PostgreSQL/Prisma as priority migration

User preference: go slowly, validate things still work at each step.
