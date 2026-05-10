#!/bin/bash
# Code-quality review: codex + claude run in parallel, each independently
# critiquing the (already-UI-fixed) viewer code.
set -uo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$HERE/../.." && pwd)
PROMPT_FILE=$HERE/code-review-prompt.md
OUT_CODEX=$HERE/03-code-codex.md
OUT_CLAUDE=$HERE/04-code-claude.md
LOG=$HERE/round-code.log

PROMPT=$(cat "$PROMPT_FILE")

# Run codex in background
(
  echo "[$(date +%T) code-review:codex] starting" >> "$LOG"
  LAST=$(mktemp)
  printf '%s' "$PROMPT" \
    | codex exec \
        -C "$REPO" \
        -s read-only \
        --skip-git-repo-check \
        --color never \
        -o "$LAST" \
        - \
    >>"$LOG" 2>&1
  {
    printf '# Code review — codex\n\n_Generated %s, read-only._\n\n---\n\n' "$(date -u +%FT%TZ)"
    cat "$LAST"
  } > "$OUT_CODEX"
  rm -f "$LAST"
  echo "[$(date +%T) code-review:codex] done -> $OUT_CODEX ($(wc -c <"$OUT_CODEX") B)" >> "$LOG"
) &
CODEX_PID=$!

# Run claude in parallel
(
  echo "[$(date +%T) code-review:claude] starting" >> "$LOG"
  CLAUDE_OUT=$(mktemp)
  ( cd "$REPO" && \
      printf '%s' "$PROMPT" \
        | claude -p \
            --dangerously-skip-permissions \
            --add-dir "$REPO" \
            --output-format text \
        > "$CLAUDE_OUT" 2>>"$LOG"
  )
  {
    printf '# Code review — claude\n\n_Generated %s, read-only._\n\n---\n\n' "$(date -u +%FT%TZ)"
    cat "$CLAUDE_OUT"
  } > "$OUT_CLAUDE"
  rm -f "$CLAUDE_OUT"
  echo "[$(date +%T) code-review:claude] done -> $OUT_CLAUDE ($(wc -c <"$OUT_CLAUDE") B)" >> "$LOG"
) &
CLAUDE_PID=$!

echo "[$(date +%T) code-review] waiting on codex=$CODEX_PID claude=$CLAUDE_PID" >> "$LOG"
wait "$CODEX_PID" "$CLAUDE_PID"
echo "[$(date +%T) code-review] BOTH DONE" >> "$LOG"
