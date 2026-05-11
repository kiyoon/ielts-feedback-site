#!/bin/bash
# Top-level driver: run baseline + 50-iteration refinement for both essays.
# Usage: run-all.sh [N]
# (defaults to 50 iterations per essay)

set -uo pipefail
N=${1:-50}
HERE=$(cd "$(dirname "$0")" && pwd)
BENCH=$(cd "$HERE/.." && pwd)
LOG=$BENCH/logs/run-all.log

mkdir -p "$BENCH/logs"

echo "[$(date +%T) run-all] starting N=$N" | tee -a "$LOG"

for task in task1 task2; do
  echo "[$(date +%T) run-all] === baseline $task ===" | tee -a "$LOG"
  bash "$HERE/run-baseline.sh" "$task" | tee -a "$LOG"
done

for task in task1 task2; do
  echo "[$(date +%T) run-all] === iterations $task (N=$N) ===" | tee -a "$LOG"
  bash "$HERE/run-iterations.sh" "$task" "$N" | tee -a "$LOG"
done

echo "[$(date +%T) run-all] complete." | tee -a "$LOG"
