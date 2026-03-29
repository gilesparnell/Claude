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
