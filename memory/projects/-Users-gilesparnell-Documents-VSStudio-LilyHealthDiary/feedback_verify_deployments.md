---
name: Verify deployments before declaring done
description: Always fetch live deployed HTML/CSS from Vercel and run assertions before telling user a visual change is live
type: feedback
---

After pushing visual/CSS changes to Vercel, NEVER tell the user "it should work now" based on hope. Instead:

1. Wait for deployment status to be READY
2. Fetch the live page HTML via `web_fetch_vercel_url`
3. Fetch the deployed CSS file and check variable values
4. Run explicit assertions: correct class names in HTML, correct CSS variable values, absence of problematic classes (like backdrop-blur on cards)
5. Report pass/fail results to the user

This was learned after 3 rounds of "it should work" that didn't — the root cause was `backdrop-blur` on cards turning everything gray, which could have been caught by checking the deployed HTML for the class.
