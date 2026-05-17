# Iteration 28 — claude

_Generated 2026-05-09T16:08:37Z. Prior chain depth: up to 3. Manifest: 99 files._

------ ITERATION 1 ---

## Per-criterion scores
| Criterion | Band | Descriptor evidence (file path) |
|---|---|---|
| Task Achievement             | 6.0 | contexts/01-band-descriptors/task1-academic-band-descriptors.md §Band 6 |
| Coherence and Cohesion       | 6.0 | contexts/01-band-descriptors/task1-academic-band-descriptors.md §Band 6 |
| Lexical Resource             | 6.0 | contexts/01-band-descriptors/task1-academic-band-descriptors.md §Band 6 |
| Grammatical Range & Accuracy | 5.5 | contexts/01-band-descriptors/task1-academic-band-descriptors.md §Band 6 / 5 boundary |
| **Overall**                  | 6.0 | rounded per `contexts/01-band-descriptors/scoring-rules.md` |

## What changed from prior feedback
First iteration — no prior to compare against. Establishing baseline calibration: bands set against the official Task 1 Academic descriptors with reference to the writing9-style band-6 exemplars in `contexts/02-task1-academic/samples-band-6_0.md`. GRA pulled to 5.5 because three subject–verb/tense slips ("USA's consumption increase", "Germany ... slightly decrease", "had reach") cluster densely in a 178-word script — `contexts/05-band-6-to-7/grammar-upgrades.md` flags this density as a 5.5 marker. Suggestions target the four highest-leverage upgrades for crossing into Band 7: data-selective overview, passive figure verbs, comparative precision, and the missing article on country names.

## Per-criterion justification
**Task Achievement (6.0).** All key features are mentioned and broadly accurate, but the overview ("electricity consumption in all three countries had a growth ... USA stayed the highest, while India had the lowest level") only states the obvious ranking and misses the crossover/turning-point pattern (US peak ~2000 then decline; India's acceleration after 2000). Per `contexts/02-task1-academic/samples-band-6_0.md`, band-6 overviews "state the obvious but miss the most striking comparison" — exactly this case. Figures are mostly cited but "four times higher than 1990" omits the unit and is mathematically loose (1,200 vs 300 = 4×, fine, but phrasing is band-6).

**Coherence and Cohesion (6.0).** Paragraphing is logical (intro / overview / USA+Germany / India). Linkers are present but mechanical: "However", "After this", "In contrast", "However, then". Reference is occasionally clumsy ("the figure of USA", "the figure of India" — `contexts/08-vocabulary-grammar/03-cohesion-error-correction-bank.md` lists "the figure of X" as a band-6 stock phrase to upgrade to "the US figure" or "consumption in India").

**Lexical Resource (6.0).** Range is adequate but repetitive: "consumption" appears 5×, "electricity" 3×, "kWh per person" mechanically. Trend verbs are basic ("grew", "increase", "decline", "slightly decrease"). No collocations like "rose steadily", "levelled off", "surged", "plateaued" from `contexts/09-instructor-tips/03-trend-language-bank.md`. "India is different" is informal/vague.

**Grammatical Range & Accuracy (5.5).** Three tense/agreement errors in a short essay: "USA's consumption increase steadily" (missing -d), "it slightly decrease" (missing -d), "had reach" (past participle missing -ed). Article omission: "the USA" is correct in the intro but later "USA's" / "figure of USA" drop the article. Range is narrow — almost entirely simple past + one past perfect attempt that fails. Per `contexts/05-band-6-to-7/grammar-upgrades.md`, this density of slips in <200 words sits at the 5.5/6.0 boundary; I lean 5.5 because the participle error ("had reach") is a clear band-5 marker.

## Top 10 concrete rewrites
| # | Original phrase from essay | Improved (band-7 target) | Reason | Corpus citation |
|---|---|---|---|---|
| 1 | "had a growth during this time period" | "rose overall, though the US figure peaked around 2000 before edging down" | Overview must capture the turning point, not just direction | `contexts/09-instructor-tips/03-trend-language-bank.md` |
| 2 | "the figure of USA stayed the highest" | "the US recorded by far the highest per-capita consumption throughout" | Idiomatic; "by far" adds comparative precision | `contexts/09-instructor-tips/05-superlative-and-comparative-upgrades.md` |
| 3 | "USA's consumption increase steadily and reached a peak about 13,500 kWh" | "US consumption climbed steadily, peaking at roughly 13,500 kWh in 2000" | Fixes tense; "peaking at" is a band-7 participial reduction | `contexts/09-instructor-tips/07-band7-grammar-showcases.md` |
| 4 | "then it started to decline and in 2020 it became around 12,000 kWh" | "thereafter it fell back to around 12,000 kWh by 2020" | "fell back to" + "by [year]" is a trend-bank collocation | `contexts/09-instructor-tips/03-trend-language-bank.md` |
| 5 | "Germany had a similar pattern" | "Germany followed a comparable trajectory" | Upgrades vague "had a … pattern" | `contexts/08-vocabulary-grammar/02-vocabulary-error-correction-bank.md` |
| 6 | "it slightly decrease" | "edged down slightly" / "slipped marginally" | Fixes -s/-d agreement; idiomatic micro-trend verb | `contexts/09-instructor-tips/03-trend-language-bank.md` |
| 7 | "In contrast, India is different" | "India, by contrast, displayed a markedly different trajectory" | Removes informal "is different"; adds adverb | `contexts/06-feedback-patterns/examiner-phrases-bank.md` |
| 8 | "Its consumption grew slow until 2000" | "Consumption grew sluggishly until 2000" | Adverb form; "sluggishly" is a band-7 trend adverb | `contexts/08-vocabulary-grammar/01-grammar-error-correction-bank.md` |
| 9 | "the figure of India had reach to 1,200 kWh per person" | "the Indian figure had reached approximately 1,200 kWh per capita" | Fixes participle; "per capita" upgrades "per person" | `contexts/09-instructor-tips/04-passive-voice-patterns.md` |
| 10 | "four times higher than 1990" | "roughly quadrupling the 1990 level" | Participial phrase + precise multiplier verb | `contexts/09-instructor-tips/07-band7-grammar-showcases.md` |

## Overall band rationale
Three 6.0s and one 5.5 average to 5.875, which rounds up to 6.0 per `contexts/01-band-descriptors/scoring-rules.md` (band averages of .25 round down, .75 round up; .5 rounds to nearest even but .875 → 6.0). This matches the benchmark target.

## CONVERGENCE: REFINING
First iteration — by the harness rule a single short prior cannot constitute convergence. Future iterations should pressure-test whether GRA is really 5.5 (the participle error is decisive but only one of three slips) and whether the overview-rewrite citation should pull from the calibration exemplars in `contexts/11-quality-audit/05-calibration-exemplars.md` rather than the trend bank.
