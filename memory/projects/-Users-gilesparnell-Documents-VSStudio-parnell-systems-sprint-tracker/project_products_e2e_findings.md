---
name: Products feature e2e findings
description: E2E test findings from products/issue-types feature — all bugs fixed, uncommitted
type: project
---

## E2E Test Findings (2026-04-01)

### All Bugs Fixed (uncommitted)

1. **`revalidateTag("sidebar", "seconds")` → `{ expire: 0 }`** — Invalid cache profile was breaking sidebar revalidation. Initially fixed to `"max"` but E2E testing revealed `"max"` uses stale-while-revalidate (serves stale on first request after invalidation). Changed to `{ expire: 0 }` for immediate cache expiry so `router.refresh()` picks up fresh sidebar data. Fixed in 7 files (9 occurrences).

2. **Products management UI added** — Created `ProductManager` component following `CustomerManager` pattern with full CRUD. Added Products tab to Settings page. Created `/api/products/[id]/stories` endpoint for delete confirmation. Added `getStoriesForProduct` action. E2E tested: 16/16 tests pass (create, edit, delete, validation, edge cases, backend state).

### Other Uncommitted Changes
- **Dev auth bypass** — Credentials provider gated on `NODE_ENV === "development"` in `src/lib/auth.ts` + "Dev Login" button on login page.
- **Lazy-loaded QuickSubmit and LoveNotes** — `src/components/features/lazy-widgets.tsx` with `next/dynamic` + `ssr: false`.
- **SidebarNavLink wrapped in React.memo** — Prevents re-render cascade from `usePathname()`.

### Turso Production Migration
- Migration `0004_sudden_catseye.sql` was manually applied to Turso production via `turso db shell sprint-tracker`.
