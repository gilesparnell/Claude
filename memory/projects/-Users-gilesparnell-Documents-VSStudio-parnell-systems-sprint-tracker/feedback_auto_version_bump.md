---
name: Auto version bump
description: Bump package.json version on feature commits — user will forget, Claude should do it
type: feedback
---

When committing a feature (feat() commit), bump the minor version in package.json (e.g. 0.9.0 → 0.10.0). The version displays in the sidebar via `import pkg from "../../../package.json"` in the dashboard layout. User explicitly asked Claude to handle this because they'll forget.
