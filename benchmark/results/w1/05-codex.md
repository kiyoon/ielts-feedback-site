# Iteration 05 — codex

_Generated 2026-05-10T10:15:58Z. Prior chain depth: up to 3. Manifest: 462 files._

---## Per-criterion scores
| Criterion | Band | Descriptor evidence (file path) |
|---|---|---|
| Task Response / Achievement | 5.0 | `contexts/01-band-descriptors/task2-band-descriptors.md` §Band 5 |
| Coherence and Cohesion       | 5.0 | `contexts/01-band-descriptors/task2-band-descriptors.md` §Band 5 |
| Lexical Resource             | 6.0 | `contexts/01-band-descriptors/task2-band-descriptors.md` §Band 6 |
| Grammatical Range & Accuracy | 5.0 | `contexts/01-band-descriptors/task2-band-descriptors.md` §Band 5 |
| **Overall**                  | 5.5 | rounded per `contexts/01-band-descriptors/scoring-rules.md` |

## What changed from prior feedback
No prior feedback chain was supplied, so this is an early calibrated iteration rather than a true refinement. I am scoring the visible essay as written: it is about 232 words, has no conclusion, and appears truncated. I also avoided inflating the score from sample labels, in line with the caution in `contexts/11-quality-audit/07-summary-of-source-reliability.md`.

## Structural feedback
Assuming the reconstructed prompt is accurate, the essay addresses the broad topic but does not fully explain the influence of mathematics on computer science. The introduction says, “I will discuss how mathematics influenced computer science,” but it does not give a clear claim about what that influence was. Body 1 moves from Mesopotamia to Morse code to computers, but the mathematical link is not explained strongly enough. Body 2 is the best paragraph because binary representation is directly relevant, but it stops before giving a developed example or final link. There is no conclusion, so the response feels unfinished. The single highest-impact fix here is completing Body 2 as a PEEL paragraph and adding a synthesis conclusion, not upgrading individual words; see `contexts/05-band-6-to-7/paragraph-structure-band7.md`.

## Focus areas
- **Complete Task 2 architecture** — Band 7 needs an introduction with a thesis, developed body paragraphs, and a conclusion. Drill: `contexts/05-band-6-to-7/task-response-upgrades.md`, `contexts/05-band-6-to-7/paragraph-structure-band7.md`.
- **PEEL development for technical claims** — Your best ideas need explanation, example, and link, not just assertion. Drill: `contexts/10-task2-topic-banks/topic-03-technology.md`, `contexts/10-task2-topic-banks/topic-17-science-and-research.md`.
- **Cohesion through clear reference** — Phrases like “that,” “it,” and “by doing that” are often unclear. Drill: `contexts/05-band-6-to-7/cohesion-upgrades.md`, `contexts/08-vocabulary-grammar/03-cohesion-error-correction-bank.md`.
- **Precise computing collocations** — Replace “new logics,” “single hardware,” and “first ever information” with natural technical language. Drill: `contexts/05-band-6-to-7/vocabulary-upgrades.md`, `contexts/09-instructor-tips/09-topic-vocabulary-clusters.md`.
- **Articles, countability, and passive forms** — Errors such as “a single hardware” and “dove needed” block Band 7 accuracy. Drill: `contexts/08-vocabulary-grammar/01-grammar-error-correction-bank.md`, `contexts/05-band-6-to-7/grammar-upgrades.md`.

## What's working
You choose promising technical examples: “base-60 for timekeeping,” “Morse code in 1844,” “binary digits,” and “every letter is actually a number.” These are much stronger than vague claims like “math is important.” Keep them, but make each example prove a clear point about mathematics: logic, encoding, binary representation, or algorithms.

## Per-criterion justification
**Task Response:** The essay has relevant ideas, especially binary digits and numerical representation, but the response is incomplete. The prompt asks about mathematics and computer science, while much of Body 1 is really about communication history: “People wanted to deliver their messages only.” There is no conclusion, and the essay does not clearly evaluate how important mathematics was. This fits Band 5 because ideas are present but limited and insufficiently developed; see `contexts/01-band-descriptors/task2-band-descriptors.md` §Band 5.

**Coherence and Cohesion:** There is basic paragraphing, but progression is loose: ancient systems, Morse code, computers, switches, letters, emojis. References such as “that,” “this,” “it,” and “by doing that” are sometimes unclear. The repetition of “people wanted” also makes the argument feel circular. Band 7 requires logical sequencing and flexible reference, as described in `contexts/05-band-6-to-7/cohesion-upgrades.md`.

**Lexical Resource:** Topic vocabulary is a relative strength: “electronic signals,” “binary digits,” “hardware,” and “base-60” show some range. However, several phrases are inaccurate or unnatural: “new logics,” “mathematics is inevitable,” “the first ever information,” and “a single hardware.” This is Band 6 rather than Band 5 because meaning is generally clear despite restricted precision. See `contexts/05-band-6-to-7/vocabulary-upgrades.md`.

**Grammatical Range & Accuracy:** The essay uses some complex structures, but many are faulty: “Computers consist of a full of small switches,” “the first ever information which only used electronic signals,” and “so that no physical objects such as people or dove needed.” Simple sentences are often clearer than complex ones. Band 7 needs frequent error-free sentences and a variety of controlled complex structures; see `contexts/05-band-6-to-7/grammar-upgrades.md`.

## Top concrete rewrites (5–10, ranked by band uplift)
| # | Original phrase from essay | Improved (band-7 target) | Reason | Corpus citation |
|---|---|---|---|---|
| 1 | “In this essay, I will discuss how mathematics influenced computer science.” | “This essay argues that mathematics shaped computer science through formal logic, binary representation and algorithms.” | Gives a thesis and roadmap. | `contexts/09-instructor-tips/06-task2-sentence-frames.md` |
| 2 | “The graphic on the screen is just a number as well.” | “Taken together, these examples show that mathematics gave computers a way to store, transmit and process information.” | Turns the abrupt ending into synthesis. | `contexts/05-band-6-to-7/paragraph-structure-band7.md` |
| 3 | “People have built up mathematical rules by defining new logics to solve problems.” | “Over time, mathematicians developed systems of logic to define problems precisely and solve them step by step.” | Fixes collocation and clarifies mechanism. | `contexts/08-vocabulary-grammar/02-vocabulary-error-correction-bank.md` |
| 4 | “mathematics is inevitable” | “mathematical reasoning is essential” | More natural academic collocation. | `contexts/05-band-6-to-7/vocabulary-upgrades.md` |
| 5 | “the first ever information which only used electronic signals” | “one of the earliest systems for transmitting information electronically” | Corrects word choice and relative-clause control. | `contexts/08-vocabulary-grammar/01-grammar-error-correction-bank.md` |
| 6 | “so that no physical objects such as people or dove needed” | “so that messages no longer had to be carried by people or carrier pigeons” | Fixes passive form and countability. | `contexts/08-vocabulary-grammar/01-grammar-error-correction-bank.md` |
| 7 | “Computers consist of a full of small switches which can turn on and off.” | “Computers consist of countless tiny switches that can be either on or off.” | Removes faulty phrase and adds a clean relative clause. | `contexts/05-band-6-to-7/grammar-upgrades.md` |
| 8 | “By doing that, it can calculate in binary digits.” | “By combining these on/off states, a computer can perform calculations in binary.” | Makes the reference specific and improves technical precision. | `contexts/08-vocabulary-grammar/03-cohesion-error-correction-bank.md` |
| 9 | “a machine which can do several things in a single hardware” | “a machine that can perform several functions within a single piece of hardware” | Fixes countability and improves verb choice. | `contexts/08-vocabulary-grammar/02-vocabulary-error-correction-bank.md` |

## Overall band rationale
The four criteria average to 5.25, which rounds to 5.5 under `contexts/01-band-descriptors/scoring-rules.md`. Lexis reaches Band 6 in places, but incomplete task response, weak progression, and frequent grammar problems keep the visible essay below Band 6 overall.

## CONVERGENCE: REFINING
No prior feedback chain was supplied, so the convergence rules require `REFINING`. Future iterations could still improve calibration if the complete original prompt or the missing conclusion becomes available.