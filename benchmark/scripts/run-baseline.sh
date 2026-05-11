#!/bin/bash
# Run a single codex baseline review with NO access to the repo.
# Usage: run-baseline.sh <task1|task2>
#
# The codex agent is launched from a fresh tmpdir, with the essay text
# inlined into the prompt. The prompt also explicitly forbids external reads.

set -uo pipefail

TASK=${1:?usage: run-baseline.sh <task1|task2>}
REPO=/Users/kiyoon/project/ielts-feedback
BENCH=$REPO/benchmark
ESSAY_FILE=$BENCH/essays/$TASK-essay.md
PROMPT_FILE=$BENCH/prompts/baseline.md
OUT_DIR=$BENCH/results/$TASK
LOG=$BENCH/logs/$TASK-baseline.log
OUT=$OUT_DIR/00-baseline-codex.md

mkdir -p "$OUT_DIR" "$BENCH/logs"

if [ -s "$OUT" ]; then
  echo "[baseline:$TASK] $OUT already exists ($(wc -l <"$OUT") lines), skipping."
  exit 0
fi

ESSAY=$(cat "$ESSAY_FILE")
PROMPT=$(cat "$PROMPT_FILE")
FULL=$(printf '%s\n\n=== INPUT ===\n%s\n' "$PROMPT" "$ESSAY")

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

LAST_MSG=$WORK/last-msg.txt

echo "[$(date +%T) baseline:$TASK] starting codex exec from $WORK" | tee -a "$LOG"

# Run codex from the empty tmpdir so it has no repo to read.
# `-s read-only` minimises any side effects.
# `--skip-git-repo-check` because $WORK is not a git repo.
# Output the final assistant message to LAST_MSG; full transcript to log.
printf '%s' "$FULL" \
  | codex exec \
      -C "$WORK" \
      -s read-only \
      --skip-git-repo-check \
      --color never \
      -o "$LAST_MSG" \
      - \
  >>"$LOG" 2>&1

if [ -s "$LAST_MSG" ]; then
  {
    printf '# Baseline (codex, no repo)\n\n'
    printf '_Generated %s by codex exec, run from `%s` with read-only sandbox._\n\n' \
           "$(date -u +%FT%TZ)" "$WORK"
    printf -- '---\n\n'
    cat "$LAST_MSG"
  } > "$OUT"
  echo "[$(date +%T) baseline:$TASK] saved $OUT ($(wc -l <"$OUT") lines)" | tee -a "$LOG"
else
  echo "[$(date +%T) baseline:$TASK] FAILED — no output" | tee -a "$LOG"
  exit 2
fi
