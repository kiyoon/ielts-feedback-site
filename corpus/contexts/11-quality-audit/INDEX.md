# 11 — Quality Audit (INDEX)

This folder contains a sample-by-sample audit of the ~90 IELTS Writing samples in `contexts/02-task1-academic/`, `contexts/03-task1-general/`, and `contexts/04-task2-essays/` against the official band descriptors in `contexts/01-band-descriptors/`. The goal is to flag samples whose claimed band is in tension with descriptor evidence, so a downstream LLM marker can apply appropriate skepticism.

This audit is performed by an LLM and is a **second-opinion flag**, not authoritative re-banding. See `01-audit-method.md` for limits.

## Contents

| File | Purpose |
|---|---|
| [`01-audit-method.md`](./01-audit-method.md) | Methodology: rubric, confidence levels, LLM judgment limits, source-tier classification, how to read this audit |
| [`02-task2-sample-audit.md`](./02-task2-sample-audit.md) | Per-sample audit of all Task 2 essays (Bands 5.5 / 6.0 / 6.5 / 7.0 / 7.5) |
| [`03-task1-academic-sample-audit.md`](./03-task1-academic-sample-audit.md) | Per-sample audit of Task 1 Academic samples (Bands 5.5 / 6.0 / 6.5 / 7.0) |
| [`04-task1-general-sample-audit.md`](./04-task1-general-sample-audit.md) | Per-sample audit of GT letter samples (Bands 5.5 / 6.0 / 6.5 / 7.0) |
| [`05-calibration-exemplars.md`](./05-calibration-exemplars.md) | The best-calibrated samples per band per task — the anchors an LLM marker should use |
| [`06-flagged-samples.md`](./06-flagged-samples.md) | Samples to use with caution: inflation, deflation, per-criterion incoherence, composites, 404s |
| [`07-summary-of-source-reliability.md`](./07-summary-of-source-reliability.md) | Per-source roll-up; refined Tier 1/2/3 classification |

## Quick-look summary

- **~80% of audited Task 2 samples** are broadly accurate against the descriptors.
- **~70% of audited Task 1 Academic samples** are broadly accurate at the *overall* band level; per-criterion scores from writing9.com are systematically broken.
- **~92% of audited GT samples** are broadly accurate, but ~half of GT entries are composite typical-patterns rather than real candidate writing.
- **Inflation pattern:** writing9 reports incoherent per-criterion scores (TA=9 + LR=4 + GRA=4); engnovate is generous on TR by 0.5–1.0.
- **One heavy-inflation outlier:** the "Asian urbanisation" line graph claimed at Band 7.5 with LR=4 in source — descriptor-incompatible.
- **One deflation case:** the "Improved Medical Care" essay is filed at Band 6 but reads more like Band 6.5.
- **Source tiering confirmed** with one refinement: engnovate (3a) is meaningfully better than writing9 (3b) at the per-criterion level.

## Recommended workflow for an LLM marker

1. Read `01-audit-method.md` to understand the rubric and limits.
2. When marking fresh student writing, anchor on samples in `05-calibration-exemplars.md`.
3. Avoid anchoring on samples in `06-flagged-samples.md`.
4. Apply the per-source skepticism guidance from `07-summary-of-source-reliability.md` (section "Top-line guidance for an LLM marker").
5. For samples not on either list, treat the claimed band as a soft guide — descriptor evidence is the source of truth.
