---
name: cloudflare-access-via-api
title: Cloudflare Access via API, Not Dashboard
scope: global
category: learned
description: "Set up Cloudflare Access gates (per-client path policies, OTP login) via the REST API — the dashboard UI reshuffles constantly; the API is stable and verifiable."
triggers:
  - cloudflare access setup
  - gate a static site by email
  - protect a pages.dev site
  - client portal login
  - zero trust application
version: 1.0
---

# Cloudflare Access via API, Not Dashboard

**Extracted:** 2026-07-08
**Context:** Gating per-client status pages on Cloudflare Pages behind email one-time-PIN login. Two dashboard attempts failed on UI churn; the API path worked first time and is fully machine-verifiable.

## Problem

Cloudflare's dashboard reorganises constantly (Pages → Workers merge, Zero Trust → "Cloudflare One" rebrand). UI instructions rot within months, and some controls (the Pages "Enable Access policy" toggle) have been removed entirely. Meanwhile client-gating needs to be *provably* correct — a mis-scoped policy exposes client data.

## Solution

**1. Scoped token** (the token-creation UI is stable): My Profile → API Tokens → Custom token → `Account / Access: Apps and Policies / Edit`. Add `Access: Organizations, Identity Providers, and Groups / Edit` if the account has no One-time PIN provider yet. Short TTL (1 day).

**2. Ensure the OTP identity provider exists** (NOT on by default for all accounts — a login page showing only a "Cloudflare" button means it's missing):

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCT/access/identity_providers" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"One-time PIN","type":"onetimepin","config":{}}'
```

**3. One path-scoped app per client + exact-email policy:**

```bash
# App scoped to the client's path
curl -X POST ".../accounts/$ACCT/access/apps" -d '{
  "name":"clientname-status","type":"self_hosted",
  "domain":"myproject.pages.dev/clientname","session_duration":"24h"}'
# Policy: exactly one email, nothing broader
curl -X POST ".../accounts/$ACCT/access/apps/$APP_ID/policies" -d '{
  "name":"client-only","decision":"allow","precedence":1,
  "include":[{"email":{"email":"client@example.com"}}]}'
```

**4. Wildcard app for preview deployments** — Pages generates per-branch preview URLs that would expose everything: app with `"domain":"*.myproject.pages.dev"`, policy allowing only the owner's email.

**5. Machine-verify (no incognito windows needed):**

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}" https://myproject.pages.dev/clientname/
# PASS = 302 to <team>.cloudflareaccess.com. Public paths must stay 200.
```

## Gotchas (each cost real debugging)

- **The dashboard's default "Create" flow makes a Worker-with-static-assets, not a Pages project.** Only classic Pages gets a `pages.dev` URL; Git-connect via the de-emphasised "Pages" tab. A `workers.dev` URL means you're on the wrong product — delete and redo.
- **OTP rejection is silence, not a message.** Unauthorised emails get NO code email (anti-enumeration) — the code-entry screen appears identically for everyone. Verify with a positive control: test an *authorised* address and confirm its code arrives; the unauthorised address's missing email is the rejection.
- **Deploy-then-gate ordering:** put the Access app on a placeholder BEFORE real content exists behind it, and re-check the 302 immediately after every content deploy.

## When to Use

Any "give this one person a login to this one page" requirement on static hosting; any Cloudflare Zero Trust setup where dashboard instructions don't match what you see; verifying an Access gate actually enforces before content ships.
