---
name: security-review
title: Security Review
scope: global
category: code
icon: 🔒
description: Comprehensive security review for web applications. Use when implementing auth, handling user input, working with secrets, creating API endpoints, or touching sensitive features. Covers OWASP Top 10, secrets management, input validation, SQL injection, XSS, CSRF, and rate limiting. Adapted from everything-claude-code.
triggers:
  - security review
  - is this secure
  - authentication
  - handling user input
  - API endpoint
  - secrets
  - vulnerability
  - OWASP
checks-label: Rules
checks:
  - No hardcoded secrets — all in environment variables
  - All user inputs validated with schemas (whitelist, not blacklist)
  - All database queries use parameterised queries — no string concatenation
  - Tokens stored in httpOnly cookies, not localStorage
  - Authorisation checks before every sensitive operation
  - User-provided HTML sanitised before rendering
  - CSRF tokens on state-changing operations
  - Rate limiting on all API endpoints
  - Error messages never expose internal details
  - No secrets or sensitive data in logs
  - Dependencies checked for known vulnerabilities
version: 1.0
---

# Security Review

## When to Activate

- Implementing authentication or authorisation
- Handling user input or file uploads
- Creating new API endpoints
- Working with secrets or credentials
- Implementing payment features
- Storing or transmitting sensitive data
- Integrating third-party APIs

## Security Checklist

### 1. Secrets Management

**NEVER** hardcode API keys, tokens, or passwords. All secrets must live in environment variables. Verify:
- `.env.local` is in `.gitignore`
- No secrets in git history (`git log -p --all -S 'password'`)
- Production secrets in hosting platform (Vercel, Railway, etc.)

### 2. Input Validation

Always validate user input with schemas (e.g. Zod, Joi). Use whitelist validation, not blacklist.

**File uploads**: Restrict size, MIME type, and extension. Never trust the client's `Content-Type`.

**Error messages**: Never leak internal details. Return generic messages to users; log details server-side.

### 3. SQL Injection Prevention

All database queries MUST use parameterised queries or an ORM. Never concatenate user input into SQL strings.

```
WRONG:  `SELECT * FROM users WHERE email = '${userEmail}'`
RIGHT:  db.query('SELECT * FROM users WHERE email = $1', [userEmail])
RIGHT:  supabase.from('users').select('*').eq('email', userEmail)
```

### 4. Authentication and Authorisation

- Store tokens in `httpOnly; Secure; SameSite=Strict` cookies — never `localStorage`
- Verify authorisation before every sensitive operation (don't just check auth)
- Enable Row Level Security on all database tables (Supabase)
- Implement role-based access control

### 5. XSS Prevention

- Sanitise all user-provided HTML before rendering (`DOMPurify` with explicit allowlists)
- Configure Content Security Policy headers
- Use framework-provided XSS protection (React auto-escapes by default)
- Never use `dangerouslySetInnerHTML` without sanitisation

### 6. CSRF Protection

- CSRF tokens on all state-changing operations (POST, PUT, DELETE)
- `SameSite=Strict` on all cookies
- Consider double-submit cookie pattern

### 7. Rate Limiting

- Rate limit all API endpoints (e.g. 100 requests per 15 minutes)
- Stricter limits on expensive operations (search, auth attempts)
- Both IP-based and user-based limiting

### 8. Sensitive Data Exposure

- Never log passwords, tokens, API keys, or PII
- Generic error messages for users; detailed errors only in server logs
- No stack traces exposed to users in production
- Audit log output before deploying

### 9. Dependency Security

- Run `npm audit` (or equivalent) regularly
- Commit lock files
- Enable Dependabot or similar automated security updates
- Use `npm ci` in CI/CD for reproducible builds

### 10. Security Headers

Configure in production:
- `Content-Security-Policy` — restrict script/style/image sources
- `X-Frame-Options: DENY` — prevent clickjacking
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` — enforce HTTPS
- `Referrer-Policy: strict-origin-when-cross-origin`

## Pre-Deployment Checklist

Before ANY production deployment, verify:

- [ ] No hardcoded secrets; all in env vars
- [ ] All user inputs validated with schemas
- [ ] All queries parameterised
- [ ] User content sanitised (XSS)
- [ ] CSRF protection enabled
- [ ] Proper token handling (httpOnly cookies)
- [ ] Authorisation checks in place
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] No sensitive data in error messages or logs
- [ ] Dependencies up to date; no known vulnerabilities
- [ ] Row Level Security enabled (if using Supabase)
- [ ] CORS properly configured
- [ ] File uploads validated (size, type)

## Security Testing

Write automated tests for:
- Unauthenticated access returns 401
- Unauthorised access returns 403
- Invalid input returns 400
- Rate limits enforce 429
- SQL injection attempts are rejected
- XSS payloads are sanitised

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy](https://portswigger.net/web-security)
