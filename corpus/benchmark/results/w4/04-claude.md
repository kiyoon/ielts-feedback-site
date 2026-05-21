# Iteration 04 — claude

_Generated 2026-05-21T16:12:10Z. Prior chain depth: up to 3. Manifest: 168 files._

---I've now read the decisive corpus across descriptors, scoring rules, band-6→7 levers, the Band-7 model, travel topic bank, grammar showcases/error bank, sentence frames, paragraph structure, and the full prior chain. One thing every prior iteration — and the original single-shot feedback — missed jumps out, so I'll refine rather than rubber-stamp iter 03's CONVERGED.

---

## Per-criterion scores
| Criterion | Band | Descriptor evidence (file path) |
|---|---|---|
| Task Response / Achievement | 6.0 | `contexts/01-band-descriptors/task2-band-descriptors.md` §Band 6 ("conclusions… repetitive"; "some… insufficiently developed") + `contexts/01-band-descriptors/scoring-rules.md` §4 (under 250 words caps TR by content) |
| Coherence and Cohesion       | 6.0 | `contexts/01-band-descriptors/task2-band-descriptors.md` §Band 6 ("cohesion… mechanical"; reference "may lack clarity") |
| Lexical Resource             | 6.0 | `contexts/01-band-descriptors/task2-band-descriptors.md` §Band 6 ("risk-taker… higher degrees of inaccuracy") |
| Grammatical Range & Accuracy | 6.0 | `contexts/01-band-descriptors/task2-band-descriptors.md` §Band 6 ("mix of simple and complex… flexibility is limited") |
| **Overall**                  | 6.0 | average 6.00 → 6.0 per `contexts/01-band-descriptors/scoring-rules.md` §1 |

## What changed from prior feedback
The 6/6/6/6 calibration is correct and I keep it — iters 01–03 nailed that. But iter 03 declared CONVERGED while overlooking a concrete, descriptor-grounded fact none of the three iterations (or the single-shot W4 feedback) noticed: **the essay is 246 words — under the 250-word Task 2 minimum** (`contexts/01-band-descriptors/scoring-rules.md` §4). This is not cosmetic: §4 states that under-length scripts make Band 6+ TR "mathematically harder to satisfy" because ideas cannot be extended in the space, which reframes the highest-impact fix. I also tightened iter 03's grammar diagnosis with a *positive* fresh lever (concessive `Adj + as + S + V` inversion) the chain kept naming as "absent" without ever supplying the easiest drop-in. Everything else overlaps the prior ~75%.

## Structural feedback
Your four-paragraph shape and consistently-held thesis ("the benefits outweigh the drawbacks") are genuine Band-6 foundations. But two structural facts cap you. **First, the essay is under length** (246 < 250); the body paragraphs end at "Point + brief explanation" with no example, so you literally run out of words before developing anything — the direct cause of the Band-6 TR ceiling per `contexts/05-band-6-to-7/paragraph-structure-band7.md` §3 (a body paragraph needs 5–7 sentences / 80–110 words). **Second, this is an *outweigh* question, and your structure lists rather than weighs.** Body 1 spends a whole paragraph on disadvantages you never rebut, while Body 2 drifts from the promised "new experience / raise revenue" into *air travel being easier* — which explains access, not why benefits win. The single highest-impact fix is therefore one move that solves both problems at once: **compress the disadvantages into one short concession ("Admittedly… these can be managed…") and expand into two fully-developed PEEL advantage paragraphs — one on cultural exposure, one on host-country revenue — taking the essay to ~280 words**, exactly as the model at `real-essays/W4-T2-international-travel.model-band7.md` does. That fixes length, development, and weighing in a single rewrite, which no lexical swap below can match.

## Focus areas
- **Hit the word count by developing, not padding** — at 246 words you are below the minimum; the cure is a real example per body paragraph, not longer sentences. Drill: `contexts/01-band-descriptors/scoring-rules.md` §4, `contexts/05-band-6-to-7/paragraph-structure-band7.md` §1.
- **Weighing, not listing, in "outweigh" essays** — concede disadvantages, then rebut, so the verdict is *argued*. Drill: `contexts/05-band-6-to-7/task-response-upgrades.md` §8.3, `real-essays/W4-T2-international-travel.model-band7.md`.
- **PEEL with one concrete example each** — every idea is named, none illustrated (Venice/Barcelona overtourism; tourism as top employer). Drill: `contexts/10-task2-topic-banks/topic-14-travel-and-tourism.md`, `contexts/05-band-6-to-7/task-response-upgrades.md` §6.
- **Complex-structure range** — your subordination is all "although/because/while"; add one participle clause and one concessive `Adj + as + S + V`. Drill: `contexts/09-instructor-tips/07-band7-grammar-showcases.md` §4,7; `contexts/05-band-6-to-7/grammar-upgrades.md` §2,4.
- **Flexible cohesion + clear reference** — replace "First and foremost / Secondly" and the vague "this tactic." Drill: `contexts/05-band-6-to-7/cohesion-upgrades.md` §3,9.
- **Tourism collocation & register** — "target nation," "exotic values," "I opine." Drill: `contexts/10-task2-topic-banks/topic-14-travel-and-tourism.md`.

## What's working
Your position is clear and held end-to-end — "I opine that the benefits outweigh the drawbacks" and "it is more beneficial to travellers and countries" — which is the gating Band-7 TR feature you already meet (`contexts/05-band-6-to-7/task-response-upgrades.md` §4). You select relevant, on-topic ideas: "overtourism," "traffic jams," "pickpockets," "domestic travel," "generate revenue." You also already attempt a reduced relative ("the country visited") — keep that instinct; the fix is making such structures frequent and clean, not adding them from scratch.

## Per-criterion justification
**Task Response — 6.0.** The stance is consistent and both sides are addressed, satisfying part of Band 7. But the script is **under length (246 words)**, which `scoring-rules.md` §4 flags as a structural reason ideas cannot be extended — and indeed "they might want to alleviate the issue of traffic jams" stops before any example, while Body 2's "advent of the aeroplane" proves access, not the promised benefit. The conclusion restates the intro almost verbatim — the Band-6 marker "conclusions… may be repetitive." Development, not relevance, holds this at 6.

**Coherence and Cohesion — 6.0.** Clear four-paragraph progression, but "First and foremost," "Secondly," "Nevertheless," "Furthermore" carry all the linking — the mechanical pattern in `contexts/05-band-6-to-7/cohesion-upgrades.md` §2. "use **this tactic**" has an unclear referent (tourism is not a tactic). No flexible reference/substitution yet → 6.

**Lexical Resource — 6.0.** You take risks with less-common items ("merits and demerits," "overtourism," "alleviate") but inaccuracy follows — the Band-6 risk-taker profile. Collocation slips: "target nation," "different and exotic values," "seeking for a help"; "I **opine** that" is register-odd; "revenue" repeats three times unvaried. Meaning is clear, precision short of 7.

**Grammatical Range & Accuracy — 6.0.** A mix of simple and complex sentences ("although/because/while/since/when"), and accuracy is actually fair — but range is the binding limit: subordination is the *only* complex tool, with no participle clauses, conditionals, or showcase structures (`contexts/05-band-6-to-7/grammar-upgrades.md` §1). Local slips persist: "seeking for **a** help," "due to **the** overtourism." Error-free sentences exist but range caps you at 6.

## Top concrete rewrites (5–10, ranked by band uplift)
| # | Original phrase from essay | Improved (band-7 target) | Reason | Corpus citation |
|---|---|---|---|---|
| 1 | "international travel can offer different and exotic values from domestic travel to travellers" | "international travel lets visitors experience other cultures first-hand — different languages, cuisines and customs — which tends to make them more open-minded; a student who spends a summer abroad, for instance, often returns with a far broader perspective" | Develops the vague claim into a PEEL idea **and adds words toward the 250 floor** (TR) | `real-essays/W4-T2-international-travel.model-band7.md`; `contexts/05-band-6-to-7/task-response-upgrades.md` §6 |
| 2 | "although there are issues to tackle… I believe that it is more beneficial" | "while problems such as petty crime and congestion are real, they can largely be managed, whereas the cultural and economic gains are lasting" | Turns a repetitive conclusion into a genuine *weighing* (TR) | `real-essays/W4-T2-international-travel.model-band7.md`; `contexts/09-instructor-tips/06-task2-sentence-frames.md` §8 |
| 3 | "they might want to alleviate the issue of traffic jams" | "they often struggle with overcrowding, as residents of cities such as Venice and Barcelona, who have staged large protests, know all too well" | Adds a concrete example + a non-defining relative clause (TR + GRA range) | `contexts/10-task2-topic-banks/topic-14-travel-and-tourism.md` (AGAINST #1); `contexts/05-band-6-to-7/grammar-upgrades.md` §2 |
| 4 | "the government can effectively use this tactic to maximise the revenue" | "host governments can channel this rise in visitor numbers into tax income and support for local businesses" | Fixes the vague referent + unvaries "revenue" (CC + LR) | `contexts/05-band-6-to-7/cohesion-upgrades.md` §3 |
| 5 | "because of the advent of the aeroplane, they can save significant amounts of time as well as money" | "Drawn by cheaper flights and simpler visa procedures, far more people now travel abroad than ever before" | Replaces dated phrasing; adds a participle-clause opener (GRA range) | `contexts/09-instructor-tips/07-band7-grammar-showcases.md` §7 |
| 6 | "it is of note that there are a few challenges to tackle" | "Manageable as these challenges ultimately are, they deserve acknowledgement" | Drops in one concessive `Adj + as + S + V` inversion — the highest GRA-uplift-per-effort showcase | `contexts/09-instructor-tips/07-band7-grammar-showcases.md` §4 |
| 7 | "the target nation" / "the country visited" | "the host country" / "the destination" | Standard tourism collocation (LR) | `contexts/10-task2-topic-banks/topic-14-travel-and-tourism.md` (host community) |
| 8 | "seeking for a help can be difficult" | "asking for help can be difficult" | Removes wrong preposition + wrong article on an uncountable noun (GRA accuracy) | `contexts/08-vocabulary-grammar/01-grammar-error-correction-bank.md` §1 #13 |
| 9 | "I opine that the benefits outweigh the drawbacks" | "I firmly believe that the benefits outweigh the drawbacks" | "opine" is register-odd; natural Band-7 thesis verb | `contexts/09-instructor-tips/06-task2-sentence-frames.md` §2 |
| 10 | "due to the overtourism" | "because of overtourism" | Zero article with an abstract uncountable noun | `contexts/08-vocabulary-grammar/01-grammar-error-correction-bank.md` §1 #26 |

## Overall band rationale
All four criteria best-fit Band 6 (relevant and organised, but underdeveloped, under length, mechanically cohesive, imprecise in collocation, narrow in complex-structure range); the average is 6.00, which rounds to **6.0** per `contexts/01-band-descriptors/scoring-rules.md` §1.

## CONVERGENCE: REFINING
Scores are stable at 6/6/6/6 and the rewrite set overlaps iter 03 by ~75%, but iter 03's CONVERGED was premature: it missed that the essay is **under the 250-word minimum**, a descriptor-grounded TR fact that reframes the top-priority fix (develop *to length*, not merely develop) and was absent from all three priors. I also added a concrete positive GRA lever (concessive inversion) the chain only ever named in the negative. With those folded in, the next iteration has little substantive left to uncover and should converge.
