# Iteration 44 — claude

_Generated 2026-05-09T16:46:58Z. Prior chain depth: up to 3. Manifest: 99 files._

------ ITERATION 1 (oldest in chain) ---
I'll read the corpus before writing feedback.

## Per-criterion scores
| Criterion | Band | Descriptor evidence (file path) |
|---|---|---|
| Task Achievement              | 6.0 | contexts/01-band-descriptors/task1-academic-band-descriptors.md §Band 6 |
| Coherence and Cohesion        | 6.0 | contexts/01-band-descriptors/task1-academic-band-descriptors.md §Band 6 / contexts/05-band-6-to-7/cohesion-upgrades.md |
| Lexical Resource              | 5.5 | contexts/01-band-descriptors/task1-academic-band-descriptors.md §Band 5–6 (limited range, repetition of "consumption/figure/kWh") |
| Grammatical Range & Accuracy  | 5.5 | contexts/01-band-descriptors/task1-academic-band-descriptors.md §Band 5–6 (frequent tense/agreement errors: "consumption increase", "decrease", "had reach") |
| **Overall**                   | 6.0 | rounded down per `contexts/01-band-descriptors/scoring-rules.md` (5.5+5.5+6+6 = 23 → 5.75 → 6.0 with half-up; see scoring-rules) |

## What changed from prior feedback
This is iteration 1, so there is no prior to correct. I have grounded every band judgment in the official Task-1 descriptor file and the band-6-vs-7 comparison, and used the audit warning in `contexts/11-quality-audit/06-flagged-samples.md` to avoid over-rewarding the essay's surface fluency. Two sub-skill scores (LR, GRA) sit at 5.5 because the error density and repetition exceed what `contexts/02-task1-academic/samples-band-6_0.md` tolerates at a clean 6.0.

## Per-criterion justification
**Task Achievement — 6.0.** All key features are present (start values, USA peak ~2000, Germany peak ~2010 then dip, India late surge) and the overview separates trend from ranking ("electricity consumption in all three countries had a growth ... USA stayed the highest, while India had the lowest"). However, no exact end values for the USA/Germany are given alongside India's, and the comparison "four times higher than 1990" is mathematically wrong (1,200 ÷ 300 = 4×, so it is four times AS HIGH, not "four times higher"; see `contexts/08-vocabulary-grammar/02-vocabulary-error-correction-bank.md` and `contexts/09-instructor-tips/05-superlative-and-comparative-upgrades.md`). This caps Achievement at 6 per `contexts/05-band-6-to-7/task-response-upgrades.md`.

**Coherence & Cohesion — 6.0.** Paragraphing is logical (intro/overview/USA+Germany/India) and linkers signal stages ("Overall", "However", "After this", "In contrast"). But linkers are mechanical and sometimes mis-used: "After this, USA's consumption increase steadily" treats "after this" as a connector where a time phrase ("Between 1990 and 2000") would be sharper (`contexts/05-band-6-to-7/cohesion-upgrades.md` §"Replace mechanical linkers"). Reference is also weak — "the figure of USA / the figure of India" repeats instead of pronouns or "this country's figure".

**Lexical Resource — 5.5.** Range is narrow: "consumption" appears 5×, "figure" 3×, "kWh" 6×, with no synonyms ("usage", "demand for electricity", "power use per capita"). Trend verbs are basic ("grew", "increase", "decline", "decrease") and missing the band-7 register from `contexts/09-instructor-tips/03-trend-language-bank.md` (e.g. "rose markedly", "levelled off", "edged downward"). Comparative phrasing is also imprecise ("much higher than", "slightly decrease"). Per `contexts/01-band-descriptors/band-6-vs-7-comparison.md` and `contexts/11-quality-audit/03-task1-academic-sample-audit.md`, this density of repetition + flat trend verbs is a 5.5, not a clean 6.

**Grammatical Range & Accuracy — 5.5.** Multiple basic errors: "consumption increase steadily" (S-V agreement), "it slightly decrease" (S-V agreement), "had reach to 1,200" (past participle + redundant "to"), "Its consumption grew slow" (adv form), "which is much higher" (tense — should be "was" in 1990 context). Sentence variety is limited: almost all main clauses are SVO with one "while/however" linker. Per `contexts/09-instructor-tips/10-common-korean-chinese-speaker-errors.md`, this cluster of S-V agreement + article/preposition errors is a textbook 5.5 GRA.

## Top 10 concrete rewrites
| # | Original phrase from essay | Improved (band-7 target) | Reason | Corpus citation |
|---|---|---|---|---|
| 1 | "had a growth during this time period" | "rose over the three-decade period" | Replace noun-heavy "had a growth" with a precise verb + period phrase. | `contexts/09-instructor-tips/03-trend-language-bank.md` |
| 2 | "the figure of USA stayed the highest, while India had the lowest level all over the period" | "the USA recorded the highest per-capita consumption throughout, whereas India remained the lowest" | "all over the period" is non-standard; "throughout/whereas" is the band-7 register. | `contexts/09-instructor-tips/05-superlative-and-comparative-upgrades.md`; `contexts/05-band-6-to-7/vocabulary-upgrades.md` |
| 3 | "USA's consumption increase steadily and reached a peak about 13,500 kWh in 2000" | "American per-capita use climbed steadily, peaking at roughly 13,500 kWh in 2000" | Fixes S-V agreement, adds "peaking at" + "roughly". | `contexts/09-instructor-tips/03-trend-language-bank.md`; `contexts/08-vocabulary-grammar/01-grammar-error-correction-bank.md` |
| 4 | "However, then it started to decline and in 2020 it became around 12,000 kWh" | "It then declined gradually, settling at approximately 12,000 kWh by 2020" | Removes redundant "However, then"; "settled at/by 2020" is examiner register. | `contexts/09-instructor-tips/03-trend-language-bank.md`; `contexts/05-band-6-to-7/cohesion-upgrades.md` |
| 5 | "Germany had a similar pattern: it grew from 6,000 to 7,500 kWh in 2010, and after that it slightly decrease" | "Germany followed a comparable trajectory, rising from 6,000 to a high of 7,500 kWh in 2010 before edging downward" | Adds "followed a trajectory", "before edging downward"; fixes tense. | `contexts/09-instructor-tips/03-trend-language-bank.md`; `contexts/09-instructor-tips/07-band7-grammar-showcases.md` |
| 6 | "In contrast, India is different" | "India, by contrast, exhibited a markedly different trend" | Removes tautology ("In contrast … is different"); adds "markedly". | `contexts/08-vocabulary-grammar/03-cohesion-error-correction-bank.md` |
| 7 | "Its consumption grew slow until 2000" | "Its consumption grew sluggishly until 2000" | "slow" → "sluggishly" (adverb + register). | `contexts/08-vocabulary-grammar/01-grammar-error-correction-bank.md` |
| 8 | "By 2020, the figure of India had reach to 1,200 kWh per person, which is four times higher than 1990" | "By 2020, India's figure had reached 1,200 kWh per capita — fourfold its 1990 level" | Past-participle fix; "four times higher" → "fourfold its 1990 level" (math + register). | `contexts/09-instructor-tips/05-superlative-and-comparative-upgrades.md`; `contexts/08-vocabulary-grammar/02-vocabulary-error-correction-bank.md` |
| 9 | (overview, weak) | "Overall, all three countries saw an upward movement in per-capita electricity use, though the gap between the USA and India narrowed substantially over the thirty-year span." | Adds the comparative takeaway examiners look for. | `contexts/05-band-6-to-7/task-response-upgrades.md` §"Overview must compare" |
| 10 | (no figure-passive used anywhere) | "It can be seen from the graph that …" / "A steady upward trend is observed for India after 2000." | Introduce one passive figure-verb sentence to lift GRA range. | `contexts/09-instructor-tips/04-passive-voice-patterns.md` |

## Overall band rationale
Two 5.5s and two 6.0s average to 5.75, which rounds to **6.0** under the half-up rule documented in `contexts/01-band-descriptors/scoring-rules.md`. The script is recognisably band-6 but borderline; tightening LR repetition and the four S-V agreement slips alone would lift it to a clean 6.5.

## CONVERGENCE: REFINING
This is iteration 1 of the chain, so by the harness rule the first iteration must report REFINING. Substantively, there are still meaningful upgrades a future pass could add: a sharper passive-voice/inversion showcase rewrite (per `contexts/09-instructor-tips/07-band7-grammar-showcases.md`) and a clearer mapping of which exact error types pull GRA below 6 — both worth at least one more pass.
