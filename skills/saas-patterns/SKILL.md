---
name: saas-patterns
description: Use this skill when designing or building SaaS product features - multi-tenancy, subscription flows, onboarding, usage tracking, permissions, or API design. Triggers on 'add a new feature', 'design this API', 'how should I structure this', 'build the onboarding flow', 'add usage limits', 'set up billing'.
---

# SaaS Patterns Skill

This skill guides Claude toward production-grade SaaS patterns for Giles' AllConvos platform - an AI-powered SaaS for SMEs. Apply these patterns to every new feature.

---

## Core SaaS Principles

### 1. Tenant Isolation First
Every data model and query must be scoped to a tenant (organisation/account).

- Every table that holds tenant data MUST have an orgId column
- Every query MUST filter by orgId - never trust a client-supplied ID without verifying it belongs to the authenticated user's org
- Never expose one tenant's data to another - treat cross-tenant leaks as P0 bugs

### 2. Feature Flags & Plan Gates
New features should ship behind a plan gate from day one - even if all plans currently have access. It costs almost nothing to add and saves a painful retrofit later.

See lib/plans.ts as the central source of truth for what each plan unlocks:
- starter:    maxAgents 1,  smsEnabled false, voiceEnabled false
- growth:     maxAgents 5,  smsEnabled true,  voiceEnabled false
- pro:        maxAgents 20, smsEnabled true,  voiceEnabled true
- enterprise: maxAgents -1 (unlimited), smsEnabled true, voiceEnabled true

### 3. Usage Tracking
Track usage at the point of consumption, not as an afterthought. Increment counters atomically using DB transactions. Store usage per billing period - reset on renewal. Emit usage events for analytics even if you don't act on them yet.

### 4. Idempotent Operations
Webhooks and background jobs WILL be delivered more than once. Design for it.
- Stripe webhooks: always check event.id against a processed-events table before acting
- Background jobs: make the operation safe to run twice
- API endpoints: accept and ignore duplicate requests with the same idempotency key

---

## AllConvos-Specific Patterns

### AI Agent Calls
Always go through lib/ai.ts - never call Anthropic/OpenAI SDK directly in features.

### Twilio (SMS/Voice)
Always via lib/twilio-helpers.ts. This layer handles logging, plan limits, and retries. Never import the Twilio SDK directly in features.

### API Route Structure
POST /api/[resource]        create
GET  /api/[resource]        list (always paginated)
GET  /api/[resource]/[id]   get one
PUT  /api/[resource]/[id]   update
DELETE /api/[resource]/[id] soft delete (set deletedAt, never hard delete)

Rules:
- Route handlers are thin - validate input, call a service, return the result
- All business logic lives in services/ - never inline in route handlers
- Always validate with Zod at the route boundary
- Soft-delete by default (deletedAt timestamp) - hard deletes need explicit approval

### Error Handling
Use a consistent error envelope across all API responses:
{ "error": { "code": "PLAN_LIMIT_EXCEEDED", "message": "Upgrade to send more SMS" } }

---

## Onboarding Patterns

Good onboarding = time-to-value, not time-to-completion.
1. Collect the minimum - ask for what you need to show value, defer everything else
2. Show a win immediately - the first screen after signup should feel useful, not empty
3. Empty states are CTAs - every empty state should explain what goes there and have a clear action
4. Progress is not steps - a progress bar through 7 setup steps is friction, not help

---

## Checklist: Before Shipping a New SaaS Feature

- [ ] Data is scoped to orgId - no cross-tenant leaks possible
- [ ] Plan gate is in place - even if all plans have access today
- [ ] Usage is tracked if the feature has limits or costs money per-use
- [ ] Operations are idempotent if called from webhooks or background jobs
- [ ] Errors use the standard envelope shape
- [ ] Soft-delete used (not hard delete) if data has any audit/compliance value
- [ ] Route handler is thin - business logic is in a service
- [ ] AI/Twilio called through their respective helper libs, not directly

---

## Gotchas

- Don't build a custom roles/permissions system until you have a real customer asking for it - start with owner/member
- Billing webhooks are the most important events in your system - test them in staging with actual Stripe test events
- Free tier users are real users - don't treat free accounts as second-class in the code
- Multi-tenancy is hard to retrofit - get the orgId scoping right from the start