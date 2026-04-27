---
name: Resume Builder — project state
description: Browser-based CV editor with AI job profile generation. Tracks build status, stack, key decisions, and what's left.
type: project
originSessionId: 036b297e-720a-463b-a8bf-240cfb43a787
---
## What it is
A Next.js 15 web app that lets Giles manage job-targeted CV profiles. Left pane: profile list + YAML editor. Right pane: live CV iframe preview. AI generation: paste a job posting URL, Claude tailors the CV to the spec.

**Repo:** `gilesparnell/resume-builder` (GitHub)  
**Local:** `/Users/gilesparnell/Documents/VSStudio/personal/resume/`  
**Branch:** `feat/browser-ui-cv-editor`  
**Vercel:** linked (auto-deploys from branch)  
**Supabase project:** `wqmpbujmdgikrpnlclwl` (gilesparnell69@gmail.com account)

## Stack
- Next.js 15 App Router, TypeScript
- Supabase (Postgres, RLS, SSR auth via @supabase/ssr, Google OAuth)
- shadcn/ui + Tailwind, parnellsystems.com design tokens (navy #0a0c15, purple accent)
- @sparticuz/chromium-min + puppeteer-core for serverless PDF
- @anthropic-ai/sdk — claude-opus-4-7 for AI profile generation
- Vitest for TS unit tests (`npm run test:ts` — 18 tests, all passing)
- node:test for existing .mjs CLI tests (`npm test` — 34 tests, always passing)

## Build status (as of 2026-04-24)
All units COMPLETE and pushed:
- Scaffold, DB schema, OAuth middleware, TS library ports
- All API routes: /api/jobs (CRUD), /api/resume, /api/preview, /api/pdf, /api/generate-profile
- Landing page, app shell, ProfileList, ProfileEditor, CVPreview, GenerateProfileDialog
- Vitest config + 18 unit tests for generate.ts pure functions
- Vercel config

## Key files
- `lib/generate.ts` — extractTextFromHtml, sanitizeProfileName, buildProfileYaml, generateProfileFromSpec
- `lib/generate.test.ts` — 18 Vitest tests
- `app/api/generate-profile/route.ts` — server route: fetch URL → Claude → insert profile
- `components/GenerateProfileDialog.tsx` — URL input dialogue
- `app/app/AppShell.tsx` — split-pane shell with "Generate from URL" button
- `supabase/migrations/001_initial_schema.sql` — idempotent DDL + seed

## One thing still needed to make AI generation work
`ANTHROPIC_API_KEY` must be added to `.env.local` (blank placeholder is there) and to Vercel env vars. The route returns a 500 "ANTHROPIC_API_KEY not configured" until this is done.

**Why:** The generate-profile API route calls `generateProfileFromSpec()` which instantiates the Anthropic SDK with `process.env.ANTHROPIC_API_KEY`. The key was intentionally not committed.

**How to apply:** When user says "the generate button isn't working" or "AI generation fails", check for missing API key first.

## Key architectural decisions
- Profiles stored in Supabase `profiles` table (yaml_content column) — avoids Vercel ephemeral filesystem
- Resume stored in `resume_content` table (single fixed UUID row) — editable in-browser
- No SSE: `refreshKey` prop on CVPreview iframe (increments on save) triggers reload — simpler than SSE within Vercel function timeout
- PDF: `new Uint8Array(pdfBuffer)` return type fixes `Buffer not assignable to BodyInit` error
- Pills in YAML are unquoted (`- LLM orchestration` not `- "LLM orchestration"`) — matched by test spec
- AI no-hallucination enforced in system prompt: "Do NOT invent skills, experience, or achievements not present in the CV"
- Name deduplication in generate-profile route: appends -2, -3 etc. on collision
