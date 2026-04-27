---
name: User's permission mode baseline is bypassPermissions
description: User runs all Claude Code sessions with defaultMode=bypassPermissions globally, including remote/Telegram surfaces. Don't treat this as unusual or warn about it as if it were.
type: feedback
originSessionId: aad14fff-c167-4ad9-bb79-5a3b6e343e58
---
User's `~/.claude/settings.json` has `permissions.defaultMode: "bypassPermissions"` set globally. Every CC session — local terminal, remote control, Telegram channels listener under launchd — inherits this and runs with tool calls auto-approved.

**Why:** This is a deliberate, considered choice. User values flow and speed over per-tool confirmation prompts. When explicitly asked on 2026-04-12 whether they wanted to override it for the remote/Telegram surface specifically (where risk profile is higher due to lost phones, phishing, fat-finger input from a small keyboard), they chose to keep it consistent: "option 1, proceed." They understand the implication that any allowlisted Telegram message runs commands with zero confirmation.

**How to apply:**

1. **Don't warn about bypassPermissions / auto-accept as if it's unusual.** It's their normal. Generic "are you sure you want auto-accept on?" nagging is noise.
2. **DO still flag individually-risky specific commands** when they come up — `rm -rf`, `git reset --hard`, `git push --force`, `kill -9` on unknown PIDs, destructive SQL, migrations, things that touch shared state. Ask before doing those even though the harness won't prompt. The rule "blast-radius triggers confirmation" still applies; the harness just doesn't enforce it automatically.
3. **Don't propose `--permission-mode default` / `acceptEdits` as fixes** for remote-surface concerns. They break the flow (prompts pause at an invisible launchd TTY, messages hang). User has rejected this path.
4. When discussing security posture of new integrations (new channels, new remote surfaces), mention the bypass-permissions reality as a factor in the risk analysis rather than as a surprise or a thing to "fix."
