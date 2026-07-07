#!/usr/bin/env bash
#
# scan-sensitive.sh — sensitive-term gate for the public Claude Knowledge Portal.
#
# This repo is PUBLIC. Its content was copied out of a private repo whose history
# contains pricing, client PII, and internal business vocabulary. This script is
# the standing tripwire: it greps every tracked file for a blocklist covering
# those term classes and exits non-zero (printing the hits) on any match.
#
# Zero-dependency: bash + grep + git only. Run from anywhere inside the repo.
# Used by .githooks/pre-commit (advisory) and .github/workflows/scan.yml (enforced).
#
set -uo pipefail

cd "$(git rev-parse --show-toplevel)" || { echo "not inside a git repo"; exit 2; }

fail=0
report() {
  printf '\n>>> BLOCKED SENSITIVE TERM [%s]\n' "$1"
  printf '%s\n' "$2"
  fail=1
}

# git grep scans tracked files (including anything staged/added), skips binaries
# with -I, is case-insensitive with -i, and OR's the -e patterns. Fast, no deps.
#
# This script's own source necessarily contains every blocklist term (it IS the
# blocklist), so it must be excluded from the scan or it would flag itself. The
# hook and workflow contain no literal terms, so they stay in scope.
SELF=':(exclude)scripts/scan-sensitive.sh'

# --- Pricing -----------------------------------------------------------------
# Specific dollar amounts (3+ digits, or $N,NNN) plus fee/guarantee vocab.
# NB: we deliberately do NOT block the bare phrase "pricing tier" — it appears
# benignly in the find-first-10 skill and is not itself a leak. Amounts are.
pricing=$(git grep -nIiE -e '\$[0-9]{3}' -e '\$[0-9]+,[0-9]{3}' \
                         -e 'setup fee' -e 'money.?back' -- . "$SELF" 2>/dev/null || true)
[ -n "$pricing" ] && report "pricing / dollar amount" "$pricing"

# --- Private-business vocabulary ---------------------------------------------
biz=$(git grep -nIiE -e 'allconvos' -e 'awe2m8' -e 'gohighlevel' -e '\bGHL\b' \
                     -e '\btwilio\b' -e 'reactivation' -e '\bGTM\b' -e '\bJesse\b' -- . "$SELF" 2>/dev/null || true)
[ -n "$biz" ] && report "private-business vocabulary" "$biz"

# --- Client / project identifiers --------------------------------------------
clients=$(git grep -nIiE -e 'pirisk' -e 'meriton' -e 'robgardens' -e 'robs?.?gardens' \
                         -e '\bfsca\b' -e 'vonnies' -e 'moving4u' -e '\bleadgen' \
                         -e 'lily.?health' -e 'sprint.?tracker' -e 'resume.?builder' \
                         -e 'whole.?life.?challenge' -e '\bWLC\b' \
                         -e 'parnellsystems-platform' -- . "$SELF" 2>/dev/null || true)
[ -n "$clients" ] && report "client / project identifier" "$clients"

# --- PII: AU phones + specific address token ---------------------------------
pii=$(git grep -nIiE -e '\+61[0-9]' -e '\b04[0-9]{2} ?[0-9]{3} ?[0-9]{3}\b' \
                     -e 'elanora' -- . "$SELF" 2>/dev/null || true)
[ -n "$pii" ] && report "PII (AU phone / address)" "$pii"

# --- PII: email addresses (minus known-benign example/vendor domains) --------
# The generic email regex is deliberately NOT run over docs/pagefind/*: those are
# vendored, minified third-party search-library assets whose only email is the
# library author's public attribution (jan@cloudcannon.com), which is noise, not
# our PII. Any real email in OUR content is still caught in its source HTML/MD
# file (not excluded here), and the pagefind content fragments were verified
# clean of sensitive terms by the other pattern classes, which DO scan them.
emails=$(git grep -nIiE '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' \
             -- . "$SELF" ':(exclude)docs/pagefind/*' 2>/dev/null \
         | grep -viE '@(example\.(com|org|net)|anthropic\.com|users\.noreply\.github\.com)|noreply@' || true)
[ -n "$emails" ] && report "email address" "$emails"

# --- Secrets / config --------------------------------------------------------
secrets=$(git grep -nIiE -e 'ANTHROPIC_API_KEY' -e 'AUTH_SECRET' -e 'RESEND_API_KEY' \
                         -e '\bsk-[A-Za-z0-9]{16}' -e 'AKIA[0-9A-Z]{8}' \
                         -e 'ghp_[A-Za-z0-9]{16}' -e 'pk_live_' \
                         -e '[a-z0-9]{20}\.supabase\.co' -e 'hooks\.slack\.com' \
                         -e '\bngrok\b' -- . "$SELF" 2>/dev/null || true)
[ -n "$secrets" ] && report "secret / config" "$secrets"

# --- Internal structure / local filesystem paths -----------------------------
internal=$(git grep -nIiE -e '/Users/gilesparnell' -e '~/Documents/VSStudio' \
                          -e '~/Projects' -e 'claude-artefacts' -e 'claude-ops' \
                          -e 'private-ops' -- . "$SELF" 2>/dev/null || true)
[ -n "$internal" ] && report "internal structure / local path" "$internal"

# --- ADR references ----------------------------------------------------------
# Real ADR references (ADR-001, ADR-042 ...) leak the private decision log's
# structure and are blocked. NARROW, DOCUMENTED EXCEPTION: the file
# skills/project-docs-standard/SKILL.md teaches the industry ADR-NNN *format
# placeholder* (literally the letters "NNN", no real number/title/content). We
# strip ONLY that file's ADR-NNN lines. The ADR- pattern stays strong globally:
# a real ADR-123 anywhere, or ADR-NNN in any OTHER file, still fails.
# Case-SENSITIVE and suffix-restricted on purpose: a real ADR ref is uppercase
# "ADR-" + a digit (ADR-042) or the literal "NNN" placeholder. This avoids the
# lowercase CSS class names (adr-card, adr-num, adr-grid...) used by the diagram
# pages, which are layout classes, not decision records.
adr=$(git grep -nIE 'ADR-([0-9]|NNN)' -- . "$SELF" 2>/dev/null \
      | grep -vE '^skills/project-docs-standard/SKILL\.md:[0-9]+:.*ADR-NNN' || true)
[ -n "$adr" ] && report "ADR reference" "$adr"

if [ "$fail" -ne 0 ]; then
  printf '\nscan-sensitive: FAILED — sensitive terms found above. Commit/push blocked.\n' >&2
  exit 1
fi

echo "scan-sensitive: OK — no sensitive terms in tracked files."
exit 0
