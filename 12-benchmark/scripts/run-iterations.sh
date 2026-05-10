#!/bin/bash
# Iteratively refine feedback for one essay across N alternating codex/claude calls.
# Usage: run-iterations.sh <task1|task2> [N]
#
# Iteration i (1-indexed) uses codex if i is odd, claude if even.
# Each iteration is REQUIRED (by prompt) to read every corpus file in the manifest
# generated below. Each iteration's output is saved as 01-codex.md, 02-claude.md, …
#
# Early-stopping: each iteration must end with `## CONVERGENCE: CONVERGED` or
# `## CONVERGENCE: REFINING`. After CONVERGE_K (default 3) consecutive iterations
# report CONVERGED, the loop halts.
#
# Resumes safely: existing non-empty outputs are kept and skipped.
# A "real" iteration must produce at least $MIN_BYTES of agent content; smaller
# outputs are treated as silent failures and the slot is cleared for retry.

set -uo pipefail

TASK=${1:?usage: run-iterations.sh <task1|task2> [N]}
N=${2:-50}
MIN_BYTES=${MIN_BYTES:-500}      # agent content (excl. our header) must be >= this
RETRIES=${RETRIES:-1}            # retry an empty/short call this many times
CONVERGE_K=${CONVERGE_K:-3}      # stop after this many consecutive CONVERGED reports
PRIOR_DEPTH=${PRIOR_DEPTH:-3}    # number of recent priors to pass to the agent

REPO=/Users/kiyoon/project/ielts-feedback
BENCH=$REPO/12-benchmark
ESSAY_FILE=$BENCH/essays/$TASK-essay.md
PROMPT_FILE=$BENCH/prompts/iteration.md
OUT_DIR=$BENCH/results/$TASK
LOG=$BENCH/logs/$TASK-iterations.log

mkdir -p "$OUT_DIR" "$BENCH/logs"

ESSAY=$(cat "$ESSAY_FILE")
TPL=$(cat "$PROMPT_FILE")

# Build a manifest of EVERY .md in the repo, except the benchmark harness itself.
MANIFEST=$(cd "$REPO" && find . -name '*.md' \
                          -not -path './.git/*' \
                          -not -path './12-benchmark/*' \
            | sort | sed 's|^\./||')
MANIFEST_COUNT=$(printf '%s\n' "$MANIFEST" | wc -l | tr -d ' ')
echo "[$(date +%T) it:$TASK] manifest=$MANIFEST_COUNT files; CONVERGE_K=$CONVERGE_K; PRIOR_DEPTH=$PRIOR_DEPTH" | tee -a "$LOG"

write_with_header() {
  local out=$1 header=$2 content_file=$3
  { printf '%s' "$header"; cat "$content_file"; } > "$out"
}

# Find file at slot j (returns empty if missing or below MIN_BYTES)
slot_file() {
  local j=$1
  local pad=$(printf '%02d' "$j")
  local f
  for f in "$OUT_DIR"/$pad-*.md; do
    [ -f "$f" ] || continue
    [ -s "$f" ] || continue
    local sz; sz=$(wc -c <"$f" | tr -d ' ')
    [ "$sz" -ge $((MIN_BYTES + 200)) ] || continue
    printf '%s' "$f"
    return 0
  done
  return 1
}

# Walk back from i-1 collecting up to PRIOR_DEPTH non-empty slots.
# Outputs them oldest → newest, separated by --- markers.
build_prior_chain() {
  local i=$1
  local found=0
  local oldest=()
  local j=$((i - 1))
  while [ "$j" -ge 1 ] && [ "$found" -lt "$PRIOR_DEPTH" ]; do
    local f
    if f=$(slot_file "$j"); then
      oldest=("$j:$f" "${oldest[@]}")
      found=$((found + 1))
    fi
    j=$((j - 1))
  done
  if [ "${#oldest[@]}" -eq 0 ]; then
    printf '(none — this is the first repo-informed iteration; produce the best initial feedback and output ## CONVERGENCE: REFINING)'
    return
  fi
  local entry
  for entry in "${oldest[@]}"; do
    local idx=${entry%%:*}
    local fpath=${entry#*:}
    printf -- '--- PRIOR ITERATION %02d (%s) ---\n' "$idx" "$(basename "$fpath")"
    cat "$fpath"
    printf '\n'
  done
}

# Extract the convergence verdict from a finished iteration file.
# Echoes CONVERGED, REFINING, or UNKNOWN (e.g. for old files without the marker).
read_convergence() {
  local f=$1
  if grep -qE '^##[[:space:]]+CONVERGENCE:[[:space:]]+CONVERGED' "$f"; then
    echo CONVERGED
  elif grep -qE '^##[[:space:]]+CONVERGENCE:[[:space:]]+REFINING' "$f"; then
    echo REFINING
  else
    echo UNKNOWN
  fi
}

run_codex_once() {
  local content_out=$1 prompt_text=$2
  printf '%s' "$prompt_text" \
    | codex exec \
        -C "$REPO" \
        -s workspace-write \
        --skip-git-repo-check \
        --color never \
        -o "$content_out" \
        - \
    >>"$LOG" 2>&1
}

run_claude_once() {
  local content_out=$1 prompt_text=$2
  ( cd "$REPO" && \
      printf '%s' "$prompt_text" \
        | claude -p \
            --dangerously-skip-permissions \
            --add-dir "$REPO" \
            --output-format text \
        > "$content_out" 2>>"$LOG"
  )
}

prior_path=""           # most-recent successful prior (drives the chain handoff)
converged_streak=0      # consecutive CONVERGED iterations

for i in $(seq 1 "$N"); do
  if [ $((i % 2)) -eq 1 ]; then TOOL=codex; else TOOL=claude; fi
  out_name=$(printf '%02d-%s.md' "$i" "$TOOL")
  out_path=$OUT_DIR/$out_name

  # If slot already complete, count its convergence and continue.
  if [ -s "$out_path" ]; then
    sz=$(wc -c <"$out_path" | tr -d ' ')
    if [ "$sz" -ge $((MIN_BYTES + 200)) ]; then
      verdict=$(read_convergence "$out_path")
      case $verdict in
        CONVERGED) converged_streak=$((converged_streak + 1));;
        *)         converged_streak=0;;
      esac
      echo "[$(date +%T) it:$TASK i=$i] $out_name complete ($sz B) verdict=$verdict streak=$converged_streak" | tee -a "$LOG"
      prior_path=$out_path
      if [ "$converged_streak" -ge "$CONVERGE_K" ]; then
        echo "[$(date +%T) it:$TASK] EARLY STOP at i=$i: CONVERGED $converged_streak times in a row." | tee -a "$LOG"
        break
      fi
      continue
    else
      echo "[$(date +%T) it:$TASK i=$i] $out_name was a stub ($sz B), redoing" | tee -a "$LOG"
      rm -f "$out_path"
    fi
  fi

  PRIOR_CHAIN=$(build_prior_chain "$i")

  FULL=$(printf '%s\n\n=== CORPUS MANIFEST (read EVERY file before writing — %d files total) ===\n%s\n\n=== CANDIDATE PROMPT + ESSAY (%s) ===\n%s\n\n=== PRIOR FEEDBACK CHAIN (oldest → newest, up to %d iterations) ===\n%s\n' \
                "$TPL" "$MANIFEST_COUNT" "$MANIFEST" "$ESSAY_FILE" "$ESSAY" "$PRIOR_DEPTH" "$PRIOR_CHAIN")

  HEADER=$(printf '# Iteration %02d — %s\n\n_Generated %s. Prior chain depth: up to %d. Manifest: %d files._\n\n---\n\n' \
                  "$i" "$TOOL" "$(date -u +%FT%TZ)" "$PRIOR_DEPTH" "$MANIFEST_COUNT")

  attempt=0
  success=0
  while [ "$attempt" -le "$RETRIES" ]; do
    [ "$attempt" -gt 0 ] && echo "[$(date +%T) it:$TASK i=$i tool=$TOOL] retry $attempt" | tee -a "$LOG"
    echo "[$(date +%T) it:$TASK i=$i tool=$TOOL attempt=$attempt] starting" | tee -a "$LOG"
    start=$(date +%s)
    CONTENT=$(mktemp)

    if [ "$TOOL" = codex ]; then
      run_codex_once "$CONTENT" "$FULL"
    else
      run_claude_once "$CONTENT" "$FULL"
    fi

    end=$(date +%s)
    sz=$(wc -c <"$CONTENT" | tr -d ' ')

    if [ "$sz" -ge "$MIN_BYTES" ]; then
      write_with_header "$out_path" "$HEADER" "$CONTENT"
      rm -f "$CONTENT"
      verdict=$(read_convergence "$out_path")
      case $verdict in
        CONVERGED) converged_streak=$((converged_streak + 1));;
        *)         converged_streak=0;;
      esac
      echo "[$(date +%T) it:$TASK i=$i tool=$TOOL] OK in $((end-start))s; agent=$sz B; verdict=$verdict streak=$converged_streak" | tee -a "$LOG"
      prior_path=$out_path
      success=1
      break
    else
      echo "[$(date +%T) it:$TASK i=$i tool=$TOOL] short/empty ($sz B) after $((end-start))s" | tee -a "$LOG"
      rm -f "$CONTENT"
      attempt=$((attempt + 1))
    fi
  done

  if [ "$success" -ne 1 ]; then
    echo "[$(date +%T) it:$TASK i=$i tool=$TOOL] GAVE UP after $((RETRIES + 1)) attempts; leaving slot empty" | tee -a "$LOG"
    rm -f "$out_path"
    continue
  fi

  if [ "$converged_streak" -ge "$CONVERGE_K" ]; then
    echo "[$(date +%T) it:$TASK] EARLY STOP at i=$i: CONVERGED $converged_streak times in a row." | tee -a "$LOG"
    break
  fi
done

echo "[$(date +%T) it:$TASK] complete." | tee -a "$LOG"
