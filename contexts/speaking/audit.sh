#!/bin/bash
# Re-run the 12-quality-audit topic against the 11 already-crawled final.md
# files. The standard build.sh treats each topic as an independent web crawl;
# this audit instead reads the corpus and reports on it.
#
# Usage: ./audit.sh
set -uo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$HERE/../.." && pwd)
PROMPTS=$HERE/prompts
LOG=$HERE/run.log
DIR=$HERE/12-quality-audit
CODEX_OUT=$DIR/from-codex.md
CLAUDE_OUT=$DIR/from-claude.md
FINAL_OUT=$DIR/final.md

mkdir -p "$DIR"
rm -f "$CODEX_OUT" "$CLAUDE_OUT" "$FINAL_OUT"

log() { echo "[$(date +%T)] $*" | tee -a "$LOG"; }

# Build the input list as repo-relative paths to the 11 final.md files.
INPUT_LIST=$(
  cd "$HERE" && \
  ls 0[1-9]-*/final.md 1[01]-*/final.md 2>/dev/null \
    | sed 's|^|contexts/speaking/|' \
    | awk '{print "- " $0}'
)

render() {
  # render <template> <output_path> <agent_label>
  local tpl_path=$1 out_path=$2 agent=$3
  local tpl
  tpl=$(cat "$tpl_path")
  tpl=${tpl//\{\{INPUT_LIST\}\}/$INPUT_LIST}
  tpl=${tpl//\{\{OUTPUT_PATH\}\}/$out_path}
  tpl=${tpl//\{\{AGENT\}\}/$agent}
  printf '%s' "$tpl"
}

run_codex() {
  log "[start codex] 12-quality-audit"
  local prompt
  prompt=$(render "$PROMPTS/audit.md" "$CODEX_OUT" "codex")
  printf '%s' "$prompt" \
    | codex exec \
        -C "$REPO" \
        -s workspace-write \
        --skip-git-repo-check \
        --color never \
        - \
    >>"$LOG" 2>&1
  local rc=$?
  if [ -s "$CODEX_OUT" ]; then
    log "[done  codex] 12-quality-audit ($(wc -c <"$CODEX_OUT") B)"
  else
    log "[FAIL  codex] 12-quality-audit rc=$rc"
  fi
}

run_claude() {
  log "[start claude] 12-quality-audit"
  local prompt
  prompt=$(render "$PROMPTS/audit.md" "$CLAUDE_OUT" "claude")
  printf '%s' "$prompt" \
    | claude -p \
        --add-dir "$REPO" \
        --permission-mode bypassPermissions \
        --allowedTools "Read,Write,Bash,Grep,Glob" \
        --model opus \
    >>"$LOG" 2>&1
  local rc=$?
  if [ -s "$CLAUDE_OUT" ]; then
    log "[done  claude] 12-quality-audit ($(wc -c <"$CLAUDE_OUT") B)"
  else
    log "[FAIL  claude] 12-quality-audit rc=$rc"
  fi
}

run_merge() {
  log "[start merge] 12-quality-audit"
  local tpl
  tpl=$(cat "$PROMPTS/merge.md")
  tpl=${tpl//\{\{TOPIC_ID\}\}/12-quality-audit}
  tpl=${tpl//\{\{TOPIC_TITLE\}\}/Speaking corpus audit}
  tpl=${tpl//\{\{OUTPUT_PATH\}\}/$FINAL_OUT}
  tpl=${tpl//\{\{CODEX_PATH\}\}/$CODEX_OUT}
  tpl=${tpl//\{\{CLAUDE_PATH\}\}/$CLAUDE_OUT}
  printf '%s' "$tpl" \
    | claude -p \
        --add-dir "$REPO" \
        --permission-mode bypassPermissions \
        --allowedTools "Read,Write,Bash,Grep,Glob" \
        --model opus \
    >>"$LOG" 2>&1
  local rc=$?
  if [ -s "$FINAL_OUT" ]; then
    log "[done  merge] 12-quality-audit ($(wc -c <"$FINAL_OUT") B)"
  else
    log "[FAIL  merge] 12-quality-audit rc=$rc"
  fi
}

log "=== audit re-run: 12-quality-audit ==="
run_codex  &
PID_C=$!
run_claude &
PID_L=$!
wait $PID_C
wait $PID_L
run_merge
log "=== audit done ==="
