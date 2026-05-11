#!/bin/bash
# UI/UX review: codex first, then claude reads codex's output and synthesises.
set -uo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$HERE/../.." && pwd)
PROMPT_FILE=$HERE/ui-review-prompt.md
OUT_CODEX=$HERE/01-ui-codex.md
OUT_CLAUDE=$HERE/02-ui-claude.md
LOG=$HERE/round-ui.log

PROMPT=$(cat "$PROMPT_FILE")

echo "[$(date +%T) ui-review] codex starting" | tee -a "$LOG"
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
  printf '# UI/UX review — codex\n\n_Generated %s by codex exec, read-only sandbox._\n\n---\n\n' "$(date -u +%FT%TZ)"
  cat "$LAST"
} > "$OUT_CODEX"
rm -f "$LAST"
echo "[$(date +%T) ui-review] codex done -> $OUT_CODEX ($(wc -c <"$OUT_CODEX") B)" | tee -a "$LOG"

# Build the synthesis prompt: original task + codex output + new instruction
SYNTH=$(mktemp)
{
  cat "$PROMPT_FILE"
  printf '\n\n=== ROUND-1 CRITIQUE FROM CODEX REVIEWER ===\n'
  cat "$OUT_CODEX"
  cat <<'EOF'

=== YOUR TASK (claude, second reviewer) ===

You are the second reviewer. Read the same code AND the codex critique above. Then produce a SYNTHESIS document with these sections:

1. Items you AGREE with codex on (cite codex's wording briefly)
2. Items you DISAGREE with (and why)
3. Items codex MISSED that matter
4. Final priority-ranked top 8 changes both reviewers should agree to apply

Keep the synthesis concrete and short. Do NOT repeat codex's full text.
EOF
} > "$SYNTH"

echo "[$(date +%T) ui-review] claude starting" | tee -a "$LOG"
CLAUDE_OUT=$(mktemp)
( cd "$REPO" && \
    cat "$SYNTH" \
      | claude -p \
          --dangerously-skip-permissions \
          --add-dir "$REPO" \
          --output-format text \
      > "$CLAUDE_OUT" 2>>"$LOG"
)
{
  printf '# UI/UX review — claude (synthesis)\n\n_Generated %s by claude -p, with codex output as input._\n\n---\n\n' "$(date -u +%FT%TZ)"
  cat "$CLAUDE_OUT"
} > "$OUT_CLAUDE"
rm -f "$CLAUDE_OUT" "$SYNTH"
echo "[$(date +%T) ui-review] claude done -> $OUT_CLAUDE ($(wc -c <"$OUT_CLAUDE") B)" | tee -a "$LOG"
echo "[$(date +%T) ui-review] BOTH ROUNDS COMPLETE" | tee -a "$LOG"
