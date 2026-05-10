# Iteration 26 — claude

_Generated 2026-05-09T16:29:57Z. Prior chain depth: up to 3. Manifest: 99 files._

---I've read all 99 corpus files. Producing the iteration-1 feedback now.

## Per-criterion scores
| Criterion | Band | Descriptor evidence (file path) |
|---|---|---|
| Task Response | 6.0 | `01-band-descriptors/task2-band-descriptors.md` §Band 6 — "main parts addressed (though some may be more fully covered than others)"; "conclusions may be unclear, unjustified or repetitive" |
| Coherence and Cohesion | 6.0 | `01-band-descriptors/task2-band-descriptors.md` §Band 6 — "cohesive devices… faulty or mechanical due to misuse" |
| Lexical Resource | 7.0 | `01-band-descriptors/task2-band-descriptors.md` §Band 7 — "some ability to use less common items"; "awareness of style and collocation… though inappropriacies occur" |
| Grammatical Range & Accuracy | 6.0 | `01-band-descriptors/task2-band-descriptors.md` §Band 6 — "complex structures… not marked by the same level of accuracy as in simple structures" |
| **Overall** | **6.5** | (6+6+7+6)/4 = 6.25; .25 rounds **up** per `01-band-descriptors/scoring-rules.md` §3. The source's published 6.0 reflects an unofficial round-down. |

## What changed from prior feedback
Prior chain is empty; this is iteration 1. The headline correction relative to the source label is the rounding: `01-band-descriptors/scoring-rules.md` §3 makes 6.25 → 6.5 (the round-down convention is explicitly flagged as a misreading). The audit at `11-quality-audit/02-task2-sample-audit.md` Band-6 §Sample 2 already calls the per-criterion mix "broadly accurate"; I retain those four sub-scores but report the canonically rounded overall.

## Per-criterion justification

**Task Response — 6.** The candidate addresses the prompt and presents a relevant partial-disagreement position: *"I believe good balance of both is needed."* However, the introduction sprawls to seven sentences before stating the thesis, while the body paragraphs are only three to four sentences each — a Band-6 imbalance flagged at `05-band-6-to-7/task-response-upgrades.md` §5 (a body paragraph needs PEEL: claim + reasoning + concrete example + link). The reading example (*"if students come across unknown words, they can search…"*) is generic; the writing claim (*"writing skills need to be improved by lots of handwritten works"*) has no example at all. The conclusion is the longest paragraph and partly introduces a new directive (*"teachers need to come up with how to use it effectively"*), violating the Band-7 rule in `05-band-6-to-7/paragraph-structure-band7.md` §5 ("conclusion don'ts: don't introduce a new argument").

**Coherence and Cohesion — 6.** Paragraphing is logical (intro / pro / con / conclusion) and the topic sentences are visible (*"Computers can help students with reading"; "writing skills need to be improved by lots of handwritten works"*). But linkers are mechanical — *"For example… Therefore… On the other hands… However… Rather than"* — and *"On the other hands"* is the canonical Band-6 marker (`06-feedback-patterns/examiner-phrases-bank.md` §2b: "linking words used mechanically"). Reference is thin: *"them"* (paragraph 1) and *"it"* (conclusion) shift between *computers* and *use of computers* without anchoring (cf. `05-band-6-to-7/cohesion-upgrades.md` §3, "Pillar 1 — Reference").

**Lexical Resource — 7.** This is the strongest criterion. *"utilise the computers"*, *"autocorrection"*, *"come up with"*, *"enhance students' … skills"* show flexibility and "awareness of style and collocation" per the Band-7 descriptor. Inappropriacies are present but not impeding: *"lots of handwritten works"* (informal quantifier + miscount of *work*), *"unknow"* (spelling). Heavy repetition of *computers* (≈10×) shrinks the LR ceiling — `09-instructor-tips/12-chinese-instructor-tips-collected.md` §1 notes that band 7 expects ≤2 repetitions of a content keyword. Borderline 6.5/7; I keep 7 to match descriptor evidence.

**Grammatical Range & Accuracy — 6.** Subject-verb agreement breaks on the headline noun: *"School age children is no exception"* (`08-vocabulary-grammar/01-grammar-error-correction-bank.md` §2 row 1). Articles are omitted on at least four high-visibility nouns: *"From young age"*, *"good balance"*, *"play positive role"*, *"the use of computer"* — Band-6 leak documented in `09-instructor-tips/10-common-korean-chinese-speaker-errors.md` §A1. The conditional in *"If it was not for the computers, they have to find someone…"* mixes a second-conditional protasis with a present-tense apodosis (`08-vocabulary-grammar/01-grammar-error-correction-bank.md` §5 row 4). *"On the other hands"* and *"a great help if they use it effectively"* (pronoun-antecedent number mismatch) further confirm "complex structures not marked by the same level of accuracy as simple ones".

## Top 10 concrete rewrites

| # | Original phrase from essay | Improved (band-7 target) | Reason | Corpus citation |
|---|---|---|---|---|
| 1 | "From young age" | "From an early age" | Missing article on countable singular noun | `08-vocabulary-grammar/01-grammar-error-correction-bank.md` §1 row 4 |
| 2 | "School age children is no exception to the use of computers" | "School-age children are no exception to this trend" | SVA + hyphenated compound modifier + reference upgrade ("this trend") | `08-vocabulary-grammar/01-grammar-error-correction-bank.md` §2 row 1; `05-band-6-to-7/cohesion-upgrades.md` §3 Pillar 1 |
| 3 | "computers, iPad, and TV" | "computers, tablets and televisions" | Plural countables; *iPad* is brand, prefer category nouns in academic register | `09-instructor-tips/10-common-korean-chinese-speaker-errors.md` §B1 |
| 4 | "I believe good balance of both is needed" | "I would argue that a measured balance between the two approaches is preferable" | Article + hedged thesis verb + complex noun phrase | `09-instructor-tips/02-paraphrase-banks-task2.md` §8 (replace *I believe*); `05-band-6-to-7/grammar-upgrades.md` §5 |
| 5 | "On the other hands, writing skills need to be improved by lots of handwritten works" | "By contrast, writing competence is honed primarily through extensive handwritten practice" | Fixed-expression error; informal quantifier; uncountable *work*; passive figure verb | `06-feedback-patterns/examiner-phrases-bank.md` §2b; `08-vocabulary-grammar/02-vocabulary-error-correction-bank.md` §4 row 5 |
| 6 | "if students come across unknown words, they can search the unknow words and hear the pronunciation" | "when learners encounter unfamiliar vocabulary, they can look it up and hear it pronounced almost instantly" | Spelling fix + reference (*it*) replacing repeated noun + lexical chain | `05-band-6-to-7/cohesion-upgrades.md` §3 Pillar 3 |
| 7 | "If it was not for the computers, they have to find someone who knows how to pronounce the words for them" | "Were it not for such tools, they would have to rely on a knowledgeable peer or teacher" | Inverted second conditional — a single drop-in band-7 grammar showcase | `09-instructor-tips/07-band7-grammar-showcases.md` §9 ("Inverted conditionals") |
| 8 | "computers can play positive role" | "computers can play a constructive role" | Missing indefinite article + collocation precision | `08-vocabulary-grammar/01-grammar-error-correction-bank.md` §1 row 19 |
| 9 | "If students are using computers all the time and getting the help of autocorrection, they will not improve their writing skills" | "Students who rely on autocorrection at every turn rarely develop the editorial judgement that strong writing requires" | Reduced relative clause + idea extension (the *why*) | `05-band-6-to-7/grammar-upgrades.md` §2.4; `05-band-6-to-7/task-response-upgrades.md` §5 |
| 10 | "teachers need to come up with how to use it effectively to enhance students' reading and writing skills" | "teachers must devise effective strategies for harnessing these tools to enhance literacy" | Phrasal verb → Latinate verb + complex noun phrase; *literacy* upgrades repeated *reading and writing skills* | `08-vocabulary-grammar/02-vocabulary-error-correction-bank.md` §6 row 7; `10-task2-topic-banks/topic-01-education.md` C1 cluster (*literacy*) |

## Overall band rationale
Three Band-6 criteria with one Band-7 (LR) yields an arithmetic mean of 6.25; per the official rounding rule in `01-band-descriptors/scoring-rules.md` §3, *.25 rounds up*, giving an overall of 6.5. The script is therefore best described as a low Band 6.5 — Band 7 lexis carrying a Band 6 grammar profile and an under-developed Band 6 task response.

## CONVERGENCE: REFINING

This is iteration 1 with an empty prior chain, so per the harness's hard constraint I report REFINING. Subsequent iterations should recheck (a) whether the 6.5 vs 6.0 rounding call is endorsed, (b) whether LR genuinely sits at 7 given the dense *computers* repetition, and (c) whether further high-yield rewrites can be drawn from `09-instructor-tips/04-passive-voice-patterns.md` (passive figure verbs the candidate did not attempt).
