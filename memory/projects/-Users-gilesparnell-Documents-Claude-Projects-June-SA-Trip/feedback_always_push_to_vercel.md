---
name: Always push HTML changes to Vercel
description: Any edits to the June SA Trip HTML must always be committed and pushed to GitHub (which triggers Vercel deploy)
type: feedback
originSessionId: e71c2c85-95de-4f94-af56-ec590c47e809
---
After every HTML edit in the June SA Trip project, always:
1. Copy `index.html` → `road_trip_itinerary.html` (keep them in sync)
2. `git add`, `git commit`, `git push` to trigger the Vercel deploy

**Why:** The site is live at https://june-sa-road-trip.vercel.app and shared with others. Local edits that aren't pushed leave the live site out of date.

**How to apply:** Never finish an HTML editing task in this project without the git commit + push step. No exceptions, even for small changes.
