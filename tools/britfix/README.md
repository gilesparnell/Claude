# Britfix — British English Hook

Automatically converts American spellings to British English in Claude Code output. Context-aware: only converts comments and docstrings in code files, never identifiers or string literals.

## Installation

Cloned to `~/.claude/tools/britfix/` and configured as a PostToolUse hook on Write|Edit operations.

```bash
git clone https://github.com/Talieisin/britfix.git ~/.claude/tools/britfix
cd ~/.claude/tools/britfix && uv sync
chmod +x run-hook.sh
```

## Hook Configuration (in ~/.claude/settings.json)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "/Users/gilesparnell/.claude/tools/britfix/run-hook.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

## Customisation

- `.britfixignore` in the britfix directory to prevent specific words from being converted
- `~/.config/britfix/ignore` for user-level ignore rules

## Source

- Repo: https://github.com/Talieisin/britfix
- From: [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
