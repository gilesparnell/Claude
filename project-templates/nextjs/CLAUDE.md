# Project: AllConvos — Next.js Template

## Overview

AllConvos is an AI-powered SaaS platform for SMEs, built around conversational AI agents,
mission control dashboards, and multi-channel communication (SMS, voice, messaging).

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + clsx + tailwind-merge
- **Icons:** Lucide React
- **Animations:** Framer Motion (use sparingly — only for meaningful motion)
- **Database:** PostgreSQL via Prisma (migrate away from Firebase)
- **Auth:** NextAuth v5
- **AI:** Vercel AI SDK → Anthropic Claude (primary), OpenAI (fallback)
- **SMS/Voice:** Twilio (wrapped in service layer — never call SDK directly from routes)
- **Email:** Resend
- **Hosting:** Vercel
- **Agent Orchestration:** OpenClaw

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
│   ├── twilio.ts           # Twilio service layer (all Twilio calls go through here)
│   └── utils.ts
├── services/               # Business logic — imported by API routes and server components
├── hooks/                  # Custom React hooks (client-side only)
└── types/                  # Shared TypeScript types and Zod schemas

## Key Architecture Rules

- **API routes are thin** — validate input (Zod), call a service, return a response. No business logic in routes.
- **Server Components by default** — only add use client when you need hooks or browser APIs
- **Twilio goes through lib/twilio.ts** — never import the Twilio SDK directly in routes or components
- **AI calls go through lib/ai.ts** — use Vercel AI SDK, never call Anthropic/OpenAI SDK directly in routes
- **OpenClaw is for agent orchestration** — do not replicate its functionality in Next.js API routes

## Active Skills

Install these from ~/Projects/Claude/skills/ into .claude/skills/:
- code-quality
- git-conventions
- testing-practices
- frontend-design
- code-review
