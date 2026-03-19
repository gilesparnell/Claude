# Project: [Next.js App Name]

## Overview

[Describe the app]

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** [e.g. PostgreSQL via Prisma]
- **Auth:** [e.g. NextAuth.js / Clerk]
- **Deployment:** Vercel

## Project Structure

```
src/
├── app/              # App router — pages, layouts, API routes
│   ├── (auth)/       # Auth-related pages
│   ├── api/          # API route handlers
│   └── layout.tsx    # Root layout
├── components/       
│   ├── ui/           # Primitive UI components
│   └── features/     # Feature-specific components
├── lib/              
│   ├── db.ts         # Database client
│   ├── auth.ts       # Auth utilities
│   └── utils.ts      # General utilities
├── types/            # Shared TypeScript types
└── hooks/            # Custom React hooks
```

## Next.js Conventions

- Use Server Components by default — only add `'use client'` when you need interactivity or browser APIs
- Prefer `fetch` with `cache` options over third-party data fetching in server components
- Use `loading.tsx` and `error.tsx` at the route level
- Keep API routes thin — move logic to service functions in `lib/`
- Use `next/image` for all images, `next/font` for fonts

## TypeScript Rules

- Strict mode is on — no `any` without a comment explaining why
- Prefer `type` over `interface` for simple types; use `interface` for extensible shapes
- Always type function return values explicitly
- Use Zod for runtime validation of external data

## Active Skills

- `code-quality`
- `git-conventions`
- `testing-practices`
- `frontend-design`
