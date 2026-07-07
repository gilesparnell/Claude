# Project: Next.js App Template

## Overview

A starting-point CLAUDE.md for a modern Next.js SaaS application: App Router,
TypeScript, a service layer for business logic, and AI features behind a thin
wrapper. Copy this into a new project and adjust the stack rows to match reality.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + clsx + tailwind-merge
- **Icons:** Lucide React
- **Animations:** Framer Motion (use sparingly — only for meaningful motion)
- **Database:** PostgreSQL via Prisma
- **Auth:** NextAuth v5
- **AI:** Vercel AI SDK → your chosen LLM provider (wrapped in `lib/ai.ts`)
- **Third-party services:** wrapped in a service layer — never call a vendor SDK directly from routes
- **Email:** Resend
- **Hosting:** Vercel

## Project Structure

src/
├── app/                    # App Router
│   ├── (auth)/             # Auth pages (login, signup)
│   ├── (dashboard)/        # Protected app pages
│   ├── api/                # Route handlers — keep thin, logic lives in services
│   └── layout.tsx
├── components/
│   ├── ui/                 # Primitive components (Button, Input, Modal)
│   └── features/           # Feature-specific components
├── lib/
│   ├── db.ts               # Prisma client singleton
│   ├── auth.ts             # Auth config and helpers
│   ├── ai.ts               # Vercel AI SDK setup
│   └── utils.ts
├── services/               # Business logic — imported by API routes and server components
├── hooks/                  # Custom React hooks (client-side only)
└── types/                  # Shared TypeScript types and Zod schemas

## Key Architecture Rules

- **API routes are thin** — validate input (Zod), call a service, return a response. No business logic in routes.
- **Server Components by default** — only add `use client` when you need hooks or browser APIs.
- **Third-party SDKs go through a service layer** — wrap each vendor SDK in `lib/<vendor>.ts`; never import a vendor SDK directly in routes or components.
- **AI calls go through `lib/ai.ts`** — use the Vercel AI SDK, never call a provider SDK directly in routes.

## Active Skills

Install these from your Claude skills directory into `.claude/skills/`:
- code-quality
- git-conventions
- testing-practices
- frontend-design
- code-review
