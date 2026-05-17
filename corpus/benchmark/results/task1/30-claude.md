# Iteration 30 — claude

_Generated 2026-05-09T16:13:58Z. Prior chain depth: up to 3. Manifest: 99 files._

---# Iteration 1 — Examiner feedback

## Per-criterion scores
| Criterion | Band | Descriptor evidence (file path) |
|---|---|---|
| Task Achievement              | 6.0 | `contexts/01-band-descriptors/task1-academic-band-descriptors.md` §Band 6 (overview present but lacks clear comparative summary; key features covered with some inaccuracy) |
| Coherence and Cohesion        | 6.0 | `contexts/01-band-descriptors/task1-academic-band-descriptors.md` §Band 6 (linkers used mechanically: "However", "After this", "In contrast"; some referencing problems) |
| Lexical Resource              | 6.0 | `contexts/01-band-descriptors/task1-academic-band-descriptors.md` §Band 6 ("the figure of USA/India" misuse; repetition of "consumption", "increase/grew") |
| Grammatical Range & Accuracy  | 5.5 | `contexts/01-band-descriptors/task1-academic-band-descriptors.md` §Band 5–6 (subject-verb errors: "consumption increase", "decrease", "had reach"; tense slips) |
| **Overall**                   | 6.0 | rounded per `contexts/01-band-descriptors/scoring-rules.md` (avg 5.875 → 6.0; GRA pulled by frequent finite-verb errors but other criteria are stable Band 6) |

## What changed from prior feedback
This is iteration 1, so there is no prior to compare against. Per the harness rules, this iteration is REFINING by definition. I have prioritised: (a) calibrating against `contexts/01-band-descriptors/task1-academic-band-descriptors.md` and the audited Band-6.0 exemplars in `contexts/02-task1-academic/samples-band-6_0.md` (cross-checked with `contexts/11-quality-audit/03-task1-academic-sample-audit.md`); (b) listing GRA finite-verb errors verbatim; (c) supplying band-7 rewrites grounded in `contexts/09-instructor-tips/03-trend-language-bank.md`, `contexts/09-instructor-tips/04-passive-voice-patterns.md`, `contexts/09-instructor-tips/05-superlative-and-comparative-upgrades.md`, and `contexts/09-instructor-tips/07-band7-grammar-showcases.md`.

## Per-criterion justification

**Task Achievement — 6.0.** The candidate identifies the three trends and the country ranking, satisfying Band 6 ("presents an overview with information appropriately selected"). However, the overview — *"electricity consumption in all three countries had a growth … the figure of USA stayed the highest, while India had the lowest"* — misses the magnitude contrast (USA's plateau-then-fall vs. India's acceleration after 2000) which Band 7 requires as "a clear overview of main trends, differences or stages" (`contexts/05-band-6-to-7/band-6-vs-7-criterion-by-criterion.md` §Task Achievement). Data is mostly accurate but *"four times higher than 1990"* is a comparison error: 1,200 vs 300 is four times *as high as*, not *higher than* (`contexts/08-vocabulary-grammar/02-vocabulary-error-correction-bank.md` §multiples).

**Coherence and Cohesion — 6.0.** Paragraphing is logical (intro / overview / USA+Germany / India), and linkers signpost the structure, but they are mechanical: *"After this"*, *"However, then"*, *"In contrast, India is different"* (the last is tautological). Reference is occasionally weak — *"the figure of USA"*, *"the figure of India"* — instead of pronouns or "this figure" (`contexts/05-band-6-to-7/cohesion-upgrades.md` §reference-chains). Band 7 requires "a range of cohesive devices … with some flexibility" (`contexts/01-band-descriptors/task1-academic-band-descriptors.md`).

**Lexical Resource — 6.0.** Adequate topic vocabulary (*consumption, per person, peak, decline*) but repetitive: *consumption* appears 5×, *grew/increase* 4×. Errors: *"the figure of USA/India"* (should be *"the figure for"*), *"grew slow"* (adverb), *"reach to"* (no preposition with *reach*) — all listed in `contexts/08-vocabulary-grammar/02-vocabulary-error-correction-bank.md`. Lacks the variety expected at Band 7 (e.g. *use, demand, usage*; passive figure verbs from `contexts/09-instructor-tips/04-passive-voice-patterns.md`).

**Grammatical Range & Accuracy — 5.5.** Multiple finite-verb errors in main clauses: *"USA's consumption increase steadily"*, *"it slightly decrease"*, *"the figure of India had reach to 1,200"*. Tense control is unstable: present *"is much higher"*, *"India is different"* mixed with past narrative. Range is limited — almost entirely simple SVO + one subordinate *which*-clause. Per `contexts/01-band-descriptors/task1-academic-band-descriptors.md` §Band 5, "frequent grammatical errors … cause some difficulty for the reader" — these errors do recur, pulling GRA below 6.

## Top 10 concrete rewrites
| # | Original phrase from essay | Improved (band-7 target) | Reason | Corpus citation |
|---|---|---|---|---|
| 1 | "had a growth during this time period" | "rose over the three-decade period" | Replace empty noun *growth* + past-perfect misuse with a precise trend verb. | `contexts/09-instructor-tips/03-trend-language-bank.md` §rise/climb |
| 2 | "the figure of USA stayed the highest" | "the USA remained by far the largest consumer throughout" | Fix preposition (*for* not *of*); upgrade *stayed* → *remained*; add intensifier *by far*. | `contexts/09-instructor-tips/05-superlative-and-comparative-upgrades.md` §by far |
| 3 | "USA's consumption increase steadily and reached a peak about 13,500 kWh in 2000" | "US consumption climbed steadily, peaking at roughly 13,500 kWh in 2000" | Fix finite-verb agreement; replace *reached a peak about* with verbal *peaking at*; add *roughly* for approximation. | `contexts/09-instructor-tips/07-band7-grammar-showcases.md` §participle clauses; `contexts/09-instructor-tips/03-trend-language-bank.md` §peak |
| 4 | "However, then it started to decline and in 2020 it became around 12,000 kWh" | "It then fell back to approximately 12,000 kWh by 2020" | Remove redundant *however+then*; replace *became* (wrong verb for figures) with *fell back to*. | `contexts/08-vocabulary-grammar/02-vocabulary-error-correction-bank.md` §became-vs-stood-at |
| 5 | "Germany had a similar pattern: it grew from 6,000 to 7,500 kWh in 2010, and after that it slightly decrease" | "Germany followed a similar trajectory, rising from 6,000 to 7,500 kWh by 2010 before easing slightly" | Upgrade *had a similar pattern* → *followed a similar trajectory*; fix *decrease* finite verb; *before*-clause is a Band-7 staple. | `contexts/09-instructor-tips/07-band7-grammar-showcases.md` §before-clauses |
| 6 | "In contrast, India is different" | "India, by contrast, displayed a markedly different pattern" | Remove tautology; *by contrast* + *markedly* upgrades cohesion and lexis. | `contexts/09-instructor-tips/08-cohesion-upgrades-instructor.md` §contrast |
| 7 | "Its consumption grew slow until 2000, but then increased rapidly" | "Its consumption grew slowly until 2000, after which it accelerated sharply" | Fix adverb *slow→slowly*; *after which* relative clause showcases Band-7 grammar. | `contexts/09-instructor-tips/07-band7-grammar-showcases.md` §after-which-relatives |
| 8 | "the figure of India had reach to 1,200 kWh" | "the Indian figure had reached approximately 1,200 kWh" | Fix preposition (*for* implied by adjective *Indian*); *reach* takes no preposition; correct past-participle *reached*. | `contexts/08-vocabulary-grammar/01-grammar-error-correction-bank.md` §past-participle |
| 9 | "which is four times higher than 1990" | "roughly quadruple the 1990 level" | Fix multiple-comparison error (*X times higher than* implies +X×); compress with *quadruple*. | `contexts/08-vocabulary-grammar/02-vocabulary-error-correction-bank.md` §multiples; `contexts/09-instructor-tips/05-superlative-and-comparative-upgrades.md` §multiples |
| 10 | (overview, second sentence) | "Overall, while per-capita consumption rose in all three countries, the USA remained by far the highest user despite a post-2000 dip, and India — though still the lowest — was the only country to see sustained growth." | Replace mechanical overview with one sentence covering ranking + trend + contrast (Band-7 overview requirement). | `contexts/05-band-6-to-7/task-response-upgrades.md` §overview-clear-and-comparative |

## Overall band rationale
Average 5.875 rounds to 6.0 per `contexts/01-band-descriptors/scoring-rules.md` (.875 rounds up). Task Achievement and CC sit on the Band-6 boundary; LR is mid-Band 6; GRA is Band 5.5 due to repeated finite-verb and preposition errors in main clauses, but does not pull the overall down to 5.5.

## CONVERGENCE: REFINING
This is iteration 1 with no prior feedback to compare against, so per the harness rule it is REFINING by definition. A second pass should re-examine whether GRA is genuinely 5.5 or a high-5.5/low-6 borderline, and tighten any rewrites that overlap with cohesion vs. lexis advice.
