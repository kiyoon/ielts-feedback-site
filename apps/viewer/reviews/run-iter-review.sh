#!/bin/bash
# Iterative codex/claude reviewer loop on the viewer.
# Each iter: agent reads current code + prior summaries, makes targeted edits,
# runs `bun run build`, writes a summary. Loop alternates codex/claude.
# Halts after 3 consecutive CONVERGED, OR after MAX iters.

set -uo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$HERE/../.." && pwd)
VIEWER=$REPO/apps/viewer
PROMPT_FILE=$HERE/iter-review-prompt.md
LOG=$HERE/iter-review.log
MAX=${MAX:-10}
CONVERGE_K=${CONVERGE_K:-3}

PROMPT=$(cat "$PROMPT_FILE")
streak=0
last_path=""

for i in $(seq 1 "$MAX"); do
  if [ $((i % 2)) -eq 1 ]; then TOOL=codex; else TOOL=claude; fi
  out=$HERE/$(printf 'iter-%02d-%s.md' "$i" "$TOOL")

  if [ -s "$out" ] && [ "${RESUME:-1}" = 1 ]; then
    echo "[$(date +%T) iter:$i] $out exists, skip" | tee -a "$LOG"
    last_path=$out
    if grep -q '^## CONVERGENCE: CONVERGED' "$out"; then streak=$((streak+1)); else streak=0; fi
    if [ "$streak" -ge "$CONVERGE_K" ]; then echo "[$(date +%T)] CONVERGED streak hit, halt" | tee -a "$LOG"; break; fi
    continue
  fi

  prior=""
  if [ -n "$last_path" ] && [ -s "$last_path" ]; then prior=$(cat "$last_path"); fi
  if [ -z "$prior" ]; then prior="(no prior iteration; you are iter 1 — focus on the highest-priority items in the prompt)"; fi

  full=$(printf '%s\n\n=== PRIOR ITERATION SUMMARY ===\n%s\n\n=== YOU ARE ITER %d, TOOL=%s ===\n' "$PROMPT" "$prior" "$i" "$TOOL")

  echo "[$(date +%T) iter:$i tool=$TOOL] starting" | tee -a "$LOG"
  start=$(date +%s)
  last_msg=$(mktemp)

  if [ "$TOOL" = codex ]; then
    printf '%s' "$full" \
      | codex exec \
          -C "$REPO" \
          -s workspace-write \
          --skip-git-repo-check \
          --color never \
          -o "$last_msg" \
          - \
      >>"$LOG" 2>&1
  else
    ( cd "$REPO" && \
        printf '%s' "$full" \
          | claude -p \
              --dangerously-skip-permissions \
              --add-dir "$REPO" \
              --output-format text \
          > "$last_msg" 2>>"$LOG"
    )
  fi

  end=$(date +%s)
  sz=$(wc -c <"$last_msg" | tr -d ' ')
  if [ "$sz" -ge 200 ]; then
    {
      printf '# Iteration %02d — %s\n\n_Generated %s by %s (took %ds)._\n\n---\n\n' \
             "$i" "$TOOL" "$(date -u +%FT%TZ)" "$TOOL" "$((end-start))"
      cat "$last_msg"
    } > "$out"
    echo "[$(date +%T) iter:$i] OK ($((end-start))s, $(wc -c <"$out") B)" | tee -a "$LOG"
    last_path=$out
    if grep -q '^## CONVERGENCE: CONVERGED' "$out"; then
      streak=$((streak + 1))
      echo "[$(date +%T) iter:$i] CONVERGED (streak=$streak)" | tee -a "$LOG"
    else
      streak=0
    fi
    if [ "$streak" -ge "$CONVERGE_K" ]; then
      echo "[$(date +%T)] EARLY STOP at i=$i: $CONVERGE_K consecutive CONVERGED" | tee -a "$LOG"
      break
    fi
  else
    echo "[$(date +%T) iter:$i] EMPTY/short output ($sz B), giving up this iter" | tee -a "$LOG"
  fi
  rm -f "$last_msg"
done

echo "[$(date +%T) iter-review] complete." | tee -a "$LOG"
