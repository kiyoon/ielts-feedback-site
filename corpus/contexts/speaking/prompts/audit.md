# Task: Audit the IELTS Speaking corpus

Eleven topics have already been crawled into curated `final.md` files. Your
job is to read all eleven, treat them as a body of evidence, and write a
structured audit report.

## Inputs (read all of these in full before writing)

{{INPUT_LIST}}

These paths are relative to `contexts/speaking/` (repo-relative paths shown
in the list itself for clarity). Read every file before writing — do not
guess from filenames.

## What to produce

Write a markdown audit to:

```
{{OUTPUT_PATH}}
```

Structure:

```markdown
# Speaking corpus audit

_Audited by {{AGENT}} on <UTC timestamp>._

## Overview
<1 paragraph: total file count, approximate total size, span of topics, how
the corpus is organised, and the single most important strength / weakness
you spotted.>

## Criterion coverage matrix
<A table whose rows are the four speaking criteria (Fluency & Coherence,
Lexical Resource, Grammatical Range & Accuracy, Pronunciation) plus the
three test sections (Part 1, Part 2, Part 3) — seven rows total. Columns are
the eleven topics (01..11). In each cell, mark coverage as one of:
"strong" / "incidental" / "absent". The goal is to identify which
criterion/part has thin evidence so a judge prompted with this corpus
wouldn't know how to score it.>

## Country / region coverage matrix
<A second table. Rows = countries or regions explicitly cited in at least
one topic (Korea, China, Vietnam, India, Pakistan, Iran, Indonesia, Japan,
Bangladesh, Thailand, Malaysia, Philippines, UK, Australia, Canada,
US, Russia/Kazakhstan, Turkey, Brazil, Saudi Arabia, …). Columns = the
eleven topics. Cells mark "covered" / "absent". Identify regions that are
under-cited and which topics would most benefit from extra country sourcing.>

## Contradictions and conflicts
<Bulleted list of factual disagreements between topics. For each: cite the
two file:section locations and one sentence on which is more credible. If
you find no real contradictions, say so explicitly.>

## Operational-signal review
- Total count of "Practical signals for an LLM judge" bullets across all 11
  topics.
- Number of duplicates and near-duplicates (same rule restated).
- List of contradictions (e.g. "topic A says ≥2 idioms/minute supports Band
  7, topic B says ≥4").
- Identify the 10–20 strongest, non-overlapping operational signals across
  the whole corpus — these become the master rubric the judge should
  actually apply. Quote each signal verbatim with its source file.

## Source quality audit
- Sample 10–15 URLs from across topics and check whether they look
  authoritative vs blog-spam (do not actually fetch — judge by domain and
  context).
- Flag any topic that leans heavily on a single source or thin sourcing.
- Flag any topic that quotes the band descriptors without citing the
  official IELTS / British Council / Cambridge PDF.

## Gaps and follow-up TODOs
<Concrete, actionable items for a follow-up crawl. Each item: "Add to
topic NN: …" or "New topic: …". Prefer specificity over volume.>

## Judge-prompt readiness verdict
<One paragraph. Is this corpus fit for purpose as judge context for grading
a diarized speaking transcript? Where will the judge struggle?>
```

## Rules

- **Read all 11 files in full.** Do not skim, do not infer from filenames.
- **Cite by file:section** when making claims, e.g.
  `01-band-descriptors/final.md → ## Authoritative material`.
- **Be honest about gaps.** This audit feeds the next round of crawls — a
  reassuring-but-vague report is worse than a critical one.
- **No fluff.** No preamble, no meta-commentary, no "Hope this helps".
- **Markdown only.**
- **Write to `{{OUTPUT_PATH}}`** — do not print to stdout, do not write to
  any other path. Use the Write tool (claude) or the file-write capability
  (codex).
