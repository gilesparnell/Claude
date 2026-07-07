---
title: SaaS Patterns
scope: project
category: saas
icon: &#128640;
description: Production-grade SaaS patterns. Tenant isolation, plan gating, usage tracking, idempotent ops, soft deletes, and onboarding principles.
triggers:
  - add a new feature
  - design this API
  - build the onboarding flow
  - add usage limits
checks-label: Core rules
checks:
  - Every query scoped to orgId
  - Feature flags from day one
  - Idempotent webhooks and jobs
  - Soft delete — never hard delete
version: 1.0
---


