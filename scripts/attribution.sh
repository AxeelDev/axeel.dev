#!/usr/bin/env bash
# Keeps AI agents out of this repository's commit history.
#   attribution.sh strip <message-file>   remove agent trailers from a commit message (commit-msg hook)
#   attribution.sh ident                  reject an agent author/committer identity (commit-msg hook)
#   attribution.sh check <rev-range>      fail if any commit in the range carries agent attribution (CI)
set -euo pipefail

# People allowed in Co-authored-by trailers. Every other co-author is removed or rejected.
ALLOWED_COAUTHORS='realgoatzy@gmail\.com|axel@casfyre\.com'
# Identities and phrases agents use when they credit themselves.
AGENT_PATTERN='claude|anthropic|cursor|copilot|codex|openai|chatgpt|gemini|devin|aider|windsurf|codeium|tabnine|amazon ?q|codewhisperer|jules|sweep|\[bot\]|noreply@(anthropic\.com|cursor\.com|aider\.chat|openai\.com)'
# Footer lines such as "🤖 Generated with [Claude Code](...)" or "Made with Cursor".
FOOTER_PATTERN='^[^[:alnum:]]*(generated|made|created|written|built) (with|by|using) .*('"$AGENT_PATTERN"')'

coauthor_lines() { grep -iE '^[[:space:]]*co-authored-by:' || true; }
disallowed_coauthors() { coauthor_lines | grep -viE "<($ALLOWED_COAUTHORS)>" || true; }
footer_lines() { grep -iE "$FOOTER_PATTERN" || true; }

case "${1:-}" in
  strip)
    file="$2"
    kept=$(grep -viE '^[[:space:]]*co-authored-by:' "$file" | grep -viE "$FOOTER_PATTERN" || true)
    allowed=$(coauthor_lines < "$file" | grep -iE "<($ALLOWED_COAUTHORS)>" || true)
    # Rebuild the message and drop the blank lines the removed trailers leave behind.
    { printf '%s\n' "$kept" | awk 'NF { while (gap-- > 0) print ""; gap = 0; print; next } { gap++ }'; if [ -n "$allowed" ]; then printf '\n%s\n' "$allowed"; fi; } > "$file.tmp"
    mv "$file.tmp" "$file"
    ;;
  ident)
    for who in "$(git var GIT_AUTHOR_IDENT)" "$(git var GIT_COMMITTER_IDENT)"; do
      if printf '%s' "${who% * *}" | grep -qiE "$AGENT_PATTERN"; then
        echo "Commit refused: '${who% * *}' looks like an AI agent identity. Commit as yourself." >&2
        exit 1
      fi
    done
    ;;
  check)
    status=0
    for sha in $(git rev-list "$2"); do
      body=$(git log -1 --format=%B "$sha")
      people=$(git log -1 --format='%an <%ae>%n%cn <%ce>' "$sha" | grep -v '^GitHub <noreply@github.com>$' || true)
      problems=$( { printf '%s\n' "$body" | disallowed_coauthors; printf '%s\n' "$body" | footer_lines; printf '%s\n' "$people" | grep -iE "$AGENT_PATTERN" || true; } | sed '/^$/d')
      if [ -n "$problems" ]; then
        echo "::error::Commit $(git log -1 --format='%h %s' "$sha") credits an AI agent:"
        printf '  %s\n' "$problems"
        status=1
      fi
    done
    [ "$status" -eq 0 ] && echo "No AI agent attribution in $2."
    exit "$status"
    ;;
  *)
    echo "usage: $0 strip <message-file> | ident | check <rev-range>" >&2
    exit 2
    ;;
esac
