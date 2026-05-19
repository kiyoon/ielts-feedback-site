#!/bin/bash
# Crawl IELTS Speaking material for the evaluation corpus.
#
# Each topic is researched twice in parallel — once by `codex exec`, once by
# `claude -p` — then a third pass (claude -p) merges the two crawls into a
# curated final.md.
#
# Usage:
#   ./build.sh             # run all topics
#   ./build.sh <topic-id>  # run a single topic, e.g. ./build.sh 01-band-descriptors
#   ./build.sh smoke       # run only the smallest topic for pipeline validation
#
set -uo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$HERE/../.." && pwd)
PROMPTS=$HERE/prompts
LOG=$HERE/run.log

# ---------------------------------------------------------------------------
# Topic catalog. Format: id|title|hint
# `id` becomes the directory name. Topics are deliberately broad — each agent
# is instructed to expand subtopics within its file as it sees fit.
# ---------------------------------------------------------------------------
TOPICS=(
  "01-band-descriptors|Band descriptors (0–9) for all four speaking criteria, plus Band 6 vs 7 deltas and examiner perspective|Official public-version descriptors from IELTS.org/British Council/IDP; how examiners apply them; what separates Band 6 from Band 7 on each criterion."
  "02-part1-interview|Part 1 (4–5 min interview) — format, topic categories, examiner question banks|Part 1 covers familiar topics (work/study, hometown, hobbies, family, food, weather, technology). 3 topic sets, ~4 questions each. Short, fluent answers expected."
  "03-part2-cue-card|Part 2 (long turn) — cue card format, prep strategies, recent cue card banks|1 min prep, 1–2 min monologue from a printed cue card. Recent and historical cue card banks; how to structure a 2-minute talk; tactics for the 1-minute prep."
  "04-part3-discussion|Part 3 (abstract discussion) — structure, expected register, common follow-up patterns|4–5 min abstract discussion following Part 2's theme. Higher cognitive load, more complex grammar expected. Examiner probes for opinions, comparisons, predictions, hypotheticals."
  "05-band-6-to-7|Concrete tactics to lift each speaking criterion from Band 6 to Band 7|This is the user's target band jump. Per-criterion upgrade tactics, anti-patterns to drop, drills."
  "06-feedback-patterns|How experienced tutors phrase speaking feedback (voice & structure for the LLM judge)|Sample examiner/tutor feedback texts so our LLM judge produces feedback that reads like a real teacher's, not generic AI output."
  "07-similar-repos|Open-source IELTS speaking evaluators, scoring code, related research|GitHub repos, papers, APIs (Azure Pronunciation Assessment, Speechace, GOP scoring, wav2vec-based pronunciation models). What they evaluate and how."
  "08-vocabulary-grammar|Speaking-specific lexical resource and grammar — idiomatic chunks, collocations, paraphrase banks, fillers to drop|Idioms and natural collocations expected at Band 7+; topic-specific vocabulary banks; complex grammar structures (conditionals, cleft sentences, inversion, modal hedging); filler words and self-correction phrases that are *acceptable* vs *penalised*."
  "09-instructor-tips|Cram-school and YouTube examiner tips across Korea, China, Vietnam, Iran, India, Pakistan, Indonesia, plus native-speaker test-prep channels|We explicitly want international diversity. Korean 해커스/파고다, Chinese 新东方/雅思哥, Vietnamese IELTS Fighter, Iranian academies, Indian/Pakistani prep, Indonesian; plus E2 IELTS, IELTS Liz, IELTS Advantage, Cambridge English."
  "10-pronunciation-features|Pronunciation criteria — segmental and suprasegmental features, common L1-specific errors|Stress (word + sentence), intonation (rising/falling, contrastive), connected speech (linking, weak forms, elision, assimilation), individual phonemes, rhythm. L1-specific common errors — especially Korean speakers, plus Chinese, Vietnamese, Japanese, Spanish, Arabic, Hindi/Urdu."
  "11-fluency-markers|Fluency & coherence — discourse markers, natural hesitation patterns, what counts as fluent vs hesitant|Discourse markers (well, you know, I mean, actually, the thing is, on top of that). Acceptable vs penalised hesitation. Self-correction patterns. Cohesion devices specific to spoken English (different from written)."
  "12-quality-audit|Audit of the speaking corpus once 01–11 are written|Read all final.md files, flag gaps, contradictions, regions under-represented, criteria under-served. Output an audit report and a TODO list for follow-up crawls."
)

mkdir -p "$HERE"
: > "$LOG"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
log() { echo "[$(date +%T)] $*" | tee -a "$LOG"; }

render_prompt() {
  # render_prompt <template_path> <topic_id> <topic_title> <topic_hint> <output_path> [<codex_path> <claude_path>]
  # Pure-bash substitution avoids sed's `&` / `/` escaping minefield.
  local tpl_path=$1 id=$2 title=$3 hint=$4 out=$5 codex_path=${6:-} claude_path=${7:-}
  local tpl
  tpl=$(cat "$tpl_path")
  tpl=${tpl//\{\{TOPIC_ID\}\}/$id}
  tpl=${tpl//\{\{TOPIC_TITLE\}\}/$title}
  tpl=${tpl//\{\{TOPIC_HINT\}\}/$hint}
  tpl=${tpl//\{\{OUTPUT_PATH\}\}/$out}
  tpl=${tpl//\{\{CODEX_PATH\}\}/$codex_path}
  tpl=${tpl//\{\{CLAUDE_PATH\}\}/$claude_path}
  printf '%s' "$tpl"
}

run_codex_crawl() {
  local id=$1 title=$2 hint=$3
  local dir=$HERE/$id
  local out=$dir/from-codex.md
  mkdir -p "$dir"

  if [ -s "$out" ]; then
    log "[skip codex] $id (already exists)"
    return 0
  fi

  log "[start codex] $id"
  local prompt
  prompt=$(render_prompt "$PROMPTS/crawl-codex.md" "$id" "$title" "$hint" "$out")

  printf '%s' "$prompt" \
    | codex exec \
        -C "$REPO" \
        -s workspace-write \
        --skip-git-repo-check \
        --color never \
        - \
    >>"$LOG" 2>&1
  local rc=$?

  if [ -s "$out" ]; then
    log "[done  codex] $id ($(wc -c <"$out") B)"
  else
    log "[FAIL  codex] $id rc=$rc"
  fi
}

run_claude_crawl() {
  local id=$1 title=$2 hint=$3
  local dir=$HERE/$id
  local out=$dir/from-claude.md
  mkdir -p "$dir"

  if [ -s "$out" ]; then
    log "[skip claude] $id (already exists)"
    return 0
  fi

  log "[start claude] $id"
  local prompt
  prompt=$(render_prompt "$PROMPTS/crawl-claude.md" "$id" "$title" "$hint" "$out")

  printf '%s' "$prompt" \
    | claude -p \
        --add-dir "$REPO" \
        --permission-mode bypassPermissions \
        --allowedTools "WebSearch,WebFetch,Read,Write,Bash,Grep,Glob" \
        --model opus \
    >>"$LOG" 2>&1
  local rc=$?

  if [ -s "$out" ]; then
    log "[done  claude] $id ($(wc -c <"$out") B)"
  else
    log "[FAIL  claude] $id rc=$rc"
  fi
}

run_merge() {
  local id=$1 title=$2 hint=$3
  local dir=$HERE/$id
  local codex_path=$dir/from-codex.md
  local claude_path=$dir/from-claude.md
  local out=$dir/final.md

  if [ -s "$out" ]; then
    log "[skip merge] $id (final.md exists)"
    return 0
  fi

  if [ ! -s "$codex_path" ] || [ ! -s "$claude_path" ]; then
    log "[skip merge] $id (need both from-codex.md and from-claude.md)"
    return 0
  fi

  log "[start merge] $id"
  local prompt
  prompt=$(render_prompt "$PROMPTS/merge.md" "$id" "$title" "$hint" "$out" "$codex_path" "$claude_path")

  printf '%s' "$prompt" \
    | claude -p \
        --add-dir "$REPO" \
        --permission-mode bypassPermissions \
        --allowedTools "Read,Write,Bash,Grep,Glob" \
        --model opus \
    >>"$LOG" 2>&1
  local rc=$?

  if [ -s "$out" ]; then
    log "[done  merge] $id ($(wc -c <"$out") B)"
  else
    log "[FAIL  merge] $id rc=$rc"
  fi
}

run_topic() {
  local entry=$1
  local id=${entry%%|*}
  local rest=${entry#*|}
  local title=${rest%%|*}
  local hint=${rest#*|}

  # Phase A: codex + claude in parallel
  ( run_codex_crawl  "$id" "$title" "$hint" ) &
  local pid_codex=$!
  ( run_claude_crawl "$id" "$title" "$hint" ) &
  local pid_claude=$!
  wait $pid_codex
  wait $pid_claude

  # Phase B: merge
  run_merge "$id" "$title" "$hint"
}

# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
target=${1:-all}

case "$target" in
  smoke)
    # Run a single small topic end-to-end for pipeline validation.
    log "=== smoke run: 11-fluency-markers ==="
    for entry in "${TOPICS[@]}"; do
      id=${entry%%|*}
      if [ "$id" = "11-fluency-markers" ]; then
        run_topic "$entry"
      fi
    done
    ;;
  all)
    log "=== full crawl: ${#TOPICS[@]} topics ==="
    # Run all topics in parallel. Each topic internally runs its codex+claude
    # in parallel and then a merge. So peak parallelism is 12*2 = 24 agents.
    for entry in "${TOPICS[@]}"; do
      ( run_topic "$entry" ) &
    done
    wait
    log "=== all topics done ==="
    ;;
  *)
    # Run one named topic
    for entry in "${TOPICS[@]}"; do
      id=${entry%%|*}
      if [ "$id" = "$target" ]; then
        log "=== single-topic run: $id ==="
        run_topic "$entry"
        exit 0
      fi
    done
    echo "Unknown topic: $target" >&2
    echo "Available topics:" >&2
    for entry in "${TOPICS[@]}"; do
      echo "  ${entry%%|*}" >&2
    done
    exit 2
    ;;
esac
