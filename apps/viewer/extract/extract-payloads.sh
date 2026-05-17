#!/bin/bash
# Convert every feedback markdown in benchmark/results/ into a JSON payload.
# Usage: extract-payloads.sh [task-key|all]
#   - default: all
#   - re-run is idempotent: existing JSON payloads are skipped unless STALE=1.

set -euo pipefail
TARGET=${1:-all}
STALE=${STALE:-0}

HERE=$(cd "$(dirname "$0")" && pwd)
VIEWER=$(cd "$HERE/.." && pwd)
REPO=$(cd "$VIEWER/../.." && pwd)
BENCH=$REPO/benchmark
PROMPT_FILE=$HERE/extract-prompt.md
DATA=$VIEWER/public/data
LOG=$VIEWER/extract/extract.log

mkdir -p "$VIEWER/extract"

extract_one() {
  local task=$1 fname=$2
  local md=$BENCH/results/$task/$fname
  local id=${fname%.md}
  local out=$DATA/$task/$id.json
  mkdir -p "$DATA/$task"
  if [ -s "$out" ] && [ "$STALE" != 1 ]; then
    echo "[skip] $task/$id"
    return 0
  fi

  local iter tool
  case $id in
    # Treat ANY 00-baseline-* as a baseline (e.g. 00-baseline-codex, 00-baseline-claude)
    00-baseline-*|00-baseline) iter=0; tool=baseline;;
    *)
      iter=$(echo "$id" | sed -E 's/^([0-9]+)-.*/\1/' | sed 's/^0*//;s/^$/0/')
      tool=$(echo "$id" | sed -E 's/^[0-9]+-(.*)/\1/')
      ;;
  esac

  local essay_path=$BENCH/essays/$task-essay.md
  local essay; essay=$(awk '/^## Essay/{flag=1; next} /^## /{flag=0} flag' "$essay_path")

  local prompt
  prompt=$(printf '%s\n\nPAYLOAD_ID="%s/%s"\nPAYLOAD_TASK="%s"\nPAYLOAD_ITER=%s\nPAYLOAD_TOOL="%s"\n\n=== ESSAY_TEXT ===\n%s\n\n=== INPUT_MARKDOWN ===\n%s\n' \
    "$(cat "$PROMPT_FILE")" "$task" "$id" "$task" "$iter" "$tool" "$essay" "$(cat "$md")")

  echo "[extract] $task/$id (iter=$iter tool=$tool)"
  local tmp; tmp=$(mktemp)
  if ! printf '%s' "$prompt" \
       | codex exec \
           -C "$REPO" \
           -s read-only \
           --skip-git-repo-check \
           --color never \
           --output-schema "$HERE/payload.schema.json" \
           -o "$tmp" \
           - \
       >>"$LOG" 2>&1
  then
    echo "[fail] codex exec returned non-zero for $id, see $LOG" | tee -a "$LOG"
    rm -f "$tmp"
    return 1
  fi

  if [ ! -s "$tmp" ]; then
    echo "[fail] empty output for $id" | tee -a "$LOG"
    rm -f "$tmp"
    return 1
  fi

  if ! python3 -c "import json,sys; json.load(open('$tmp'))" 2>/dev/null; then
    echo "[fail] invalid JSON for $id" | tee -a "$LOG"
    rm -f "$tmp"
    return 1
  fi
  mv "$tmp" "$out"
  echo "[done] $task/$id → $(wc -c <"$out") B"
}

run_task() {
  local task=$1
  local rc=0
  for f in "$BENCH/results/$task"/*.md; do
    [ -f "$f" ] || continue
    if ! extract_one "$task" "$(basename "$f")"; then
      rc=1
    fi
  done
  return "$rc"
}

case $TARGET in
  all)
    for dir in "$BENCH/results"/*; do
      [ -d "$dir" ] || continue
      run_task "$(basename "$dir")"
    done
    ;;
  *)
    if [ -d "$BENCH/results/$TARGET" ]; then
      run_task "$TARGET"
    else
      echo "usage: $0 [task-key|all] (unknown task: $TARGET)"
      exit 2
    fi
    ;;
esac

# Rebuild index after extraction (only if any new payloads exist)
node "$HERE/rebuild-index.mjs"
echo "[ok] index rebuilt"
