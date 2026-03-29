# Session Hooks — Context Persistence

Standalone hooks that preserve session context across Claude Code sessions and compaction events. Adapted from everything-claude-code, rewritten with zero external dependencies.

## What They Do

| Hook | Event | Purpose |
|------|-------|---------|
| `session-start.js` | Session start | Loads the most recent session summary into context |
| `session-end.js` | Stop | Extracts tasks, files modified, and tools used from the transcript |
| `pre-compact.js` | Pre-compaction | Logs compaction and annotates the session file |

Session files are saved to `~/.claude/sessions/` as dated markdown files.

## Installation

Files live at `~/.claude/tools/session-hooks/`. Hook configuration in `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /Users/gilesparnell/.claude/tools/session-hooks/session-end.js",
            "timeout": 15
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "node /Users/gilesparnell/.claude/tools/session-hooks/pre-compact.js",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

## Source

- Adapted from: https://github.com/affaan-m/everything-claude-code
- From: [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
