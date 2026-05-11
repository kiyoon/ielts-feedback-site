#!/bin/bash
# One-shot feedback generator for the real student essays in this folder.
# Uses the iteration prompt (so the new Structural/Focus/Strengths sections
# are produced) but does NOT chain — each essay gets a single codex call.
set -uo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$HERE/.." && pwd)
PROMPT_FILE=$REPO/benchmark/prompts/iteration.md
LOG=$HERE/run.log

mkdir -p "$HERE/feedback"

# Build the corpus manifest. Prefer ripgrep because it respects .gitignore;
# find is only a fallback.
if command -v rg >/dev/null 2>&1; then
  MANIFEST=$(cd "$REPO" && rg --files -g '*.md' \
                             -g '!benchmark/**' \
                             -g '!apps/viewer/**' \
                             -g '!real-essays/feedback/**' \
              | sort)
else
  MANIFEST=$(cd "$REPO" && find . -name '*.md' \
                           -not -path './.git/*' \
                           -not -path '*/node_modules/*' \
                           -not -path '*/dist/*' \
                           -not -path './benchmark/*' \
                           -not -path './apps/viewer/*' \
                           -not -path './real-essays/feedback/*' \
              | sort | sed 's|^\./||')
fi
MANIFEST_COUNT=$(printf '%s\n' "$MANIFEST" | wc -l | tr -d ' ')

run_one() {
  local essay_md=$1
  local essay_id; essay_id=$(basename "$essay_md" .md)
  local out=$HERE/feedback/$essay_id.md
  local last; last=$(mktemp)

  if [ -s "$out" ]; then
    echo "[skip] $essay_id (already exists)" | tee -a "$LOG"
    return 0
  fi

  local essay_text; essay_text=$(cat "$essay_md")
  local tpl; tpl=$(cat "$PROMPT_FILE")

  echo "[$(date +%T) start] $essay_id" | tee -a "$LOG"
  local full
  full=$(printf '%s\n\n=== CORPUS MANIFEST (read EVERY file before writing — %d files total) ===\n%s\n\n=== CANDIDATE PROMPT + ESSAY (%s) ===\n%s\n\n=== PRIOR FEEDBACK CHAIN (oldest → newest, up to 3 iterations) ===\n(none — this is a one-shot evaluation; produce the best initial feedback)\n' \
                "$tpl" "$MANIFEST_COUNT" "$MANIFEST" "$essay_md" "$essay_text")

  printf '%s' "$full" \
    | codex exec \
        -C "$REPO" \
        -s workspace-write \
        --skip-git-repo-check \
        --color never \
        -o "$last" \
        - \
    >>"$LOG" 2>&1
  rc=$?

  if [ -s "$last" ]; then
    {
      printf '# Feedback — %s\n\n_Generated %s by codex exec, single-shot (no iteration chain)._\n\n---\n\n' \
             "$essay_id" "$(date -u +%FT%TZ)"
      cat "$last"
    } > "$out"
    echo "[$(date +%T) done] $essay_id ($(wc -c <"$out") B)" | tee -a "$LOG"
  else
    echo "[$(date +%T) FAIL] $essay_id rc=$rc" | tee -a "$LOG"
  fi
  rm -f "$last"
}

for f in "$HERE"/W*.md; do
  [ -f "$f" ] || continue
  run_one "$f" &
done
wait
echo "[$(date +%T) all done]" | tee -a "$LOG"
