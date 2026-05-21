# Speaking corpus audit

_Merged from codex + claude crawls on 2026-05-19T08:20:00Z._

## Summary

The speaking corpus contains 11 curated `final.md` files (topics 01–11), roughly
5,048 lines / ~702 KB of dense merged-crawl prose covering the official IELTS
Speaking band descriptors, the three test sections, the Band-6→7 boundary,
tutor/examiner feedback voice, adjacent scoring tools/repos, vocabulary &
grammar, instructor tips, pronunciation features, and fluency markers. Every
topic is a prior codex-plus-claude merge and follows the same skeleton
(Summary → Authoritative material → Country-specific prep → Open-source tools
& code → Practical signals for an LLM judge → Sources → Crawl notes), so the
corpus already documents its own provenance and conflicts.

The corpus's strongest property is convergence on the official four-criterion,
best-fit, whole-test scoring frame, combined with extraordinary cross-regional
reach (Korea, China/HK, Vietnam, Iran, India, Pakistan, Indonesia,
Russia/Kazakhstan, plus partial Japan, Brazil, Saudi/Gulf, Philippines, Turkey,
Spanish-speaking, Malaysia, Switzerland/Germany, Nepal, Bangladesh, UK/AU/CA)
anchored against official IELTS / British Council / Cambridge descriptors. Its
weakest property is the proliferation of "Band 7 vs Band 6" numeric coaching
heuristics (idiom density, discourse-marker counts, pause-length thresholds,
wpm targets, error-free-sentence ratios, hedge density) that are quoted across
topics with **mutually inconsistent numbers** and only sometimes flagged as
non-official priors — a judge that mechanically applies them produces false
precision the official descriptors explicitly reject. Net: usable as raw judge
context, but not paste-ready; the eight contradictions catalogued below must
be resolved into a single conflict-resolved rubric before shipping.

## Criterion coverage matrix

Legend: `strong` = direct scoring evidence; `incidental` = mentioned or usable
as a secondary cue; `absent` = little or no scoring evidence. Cells flagged
`†` show a disagreement between the two audits (codex/claude reading is given
in the footnote); the table records the more conservative reading.

| Criterion / Part | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | 11 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Fluency & Coherence | strong | strong | strong | strong | strong | strong | strong† | incidental | strong | incidental | strong |
| Lexical Resource | strong | incidental | strong | strong | strong | strong | strong† | strong | strong | absent | incidental |
| Grammatical Range & Accuracy | strong | incidental | strong† | strong | strong | strong† | strong† | strong | strong† | absent | incidental |
| Pronunciation | strong | incidental | incidental | incidental | strong | incidental | strong† | absent | strong† | strong | incidental† |
| Part 1 (interview) | incidental | strong | absent | absent | incidental | incidental | incidental | incidental | strong† | incidental† | incidental |
| Part 2 (long turn) | incidental | absent | strong | incidental | strong† | incidental | incidental | incidental | strong | incidental | incidental |
| Part 3 (discussion) | incidental | absent | incidental | strong | strong† | incidental | incidental | incidental | strong† | incidental | incidental |

Disagreement footnotes:
- Topic 07 FC/LR/Pron/GRA: codex reads `strong` (tooling repos with explicit
  scoring grids), claude reads `incidental` (tooling repos aren't IELTS
  authority). Both defensible — codex weighs tool design as scoring evidence;
  claude weighs descriptor authority.
- Topic 03 GRA, topic 06 GRA, topic 09 GRA: codex reads `strong`, claude reads
  `incidental`. Reflects how much weight each audit gave to grammar treatment
  that is deferred to topic 08.
- Topic 11 Pron, topic 10 Part 1, topic 09 Part 1/3, topic 05 Part 2/3: codex
  more often reads `strong`, claude more often reads `incidental`. Codex's
  threshold for `strong` is looser.

Thin spots common to both audits: transcript-only Pronunciation remains
low-confidence despite topic 10 being strong; Part 1 has one dedicated file
but weaker LR/GRA stress-testing than Parts 2/3 (topic 02 defers GRA to topic
08); Part 3 register/grammar coverage outside topic 04 is shallow; topic 10
deliberately scopes to pronunciation and provides no LR/GRA cross-reference
(so reading topic 10 in isolation misleads); and topics 08 and 11 essentially
omit pronunciation, which matters because GRA "spoken sentences" depend on
chunking and stress.

## Country / region coverage matrix

The union of every region either audit found is preserved.

| Country / region | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | 11 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Korea | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| China / Hong Kong | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| Vietnam | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| Iran / Persian | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| India | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| Pakistan | covered | covered | covered | covered | covered | covered | covered† | covered | covered | covered | covered |
| Indonesia | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| Russia / Kazakhstan / CIS | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| UK / Australia / Canada (native) | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| Nepal (codex) / Nepal–Sri Lanka (claude) | covered | covered | absent/covered | absent | absent | absent | covered | covered/absent | absent | absent | absent |
| Bangladesh | absent | absent | absent | absent | absent | absent | absent | absent | absent | absent | covered |
| Japan | absent | covered | absent | absent | absent | absent | absent | absent | absent | covered | absent |
| Brazil / Lusophone | absent | covered | absent | absent | absent | absent | absent | absent | absent | absent | absent |
| Saudi Arabia / Gulf / Arabic-speaking | absent | covered | absent | absent | absent | absent | covered (codex) | absent | absent | covered | absent |
| Philippines / Cebu | absent | absent | covered | absent | covered (codex) | covered | absent | absent | absent | absent | covered (codex) |
| Switzerland / Germany | absent | absent | absent | absent | absent | covered | absent | absent | absent | absent | absent |
| Spanish-speaking regions | absent | absent | absent | absent | absent | absent | covered (codex) | absent | absent | covered | absent |
| Turkey | absent | absent | absent | absent | absent | absent | absent | absent | absent | covered | absent |
| Malaysia / Malay | absent | absent | absent | absent | absent | absent | absent | absent | absent | covered | absent |
| New Zealand | covered (codex) | absent | absent | absent | absent | absent | absent | absent | absent | absent | absent |
| US (as distinct dialect) | absent | absent | absent | covered (codex) | absent | absent | absent | covered (codex) | absent | absent | absent |
| Thailand | absent | absent | absent | absent | absent | absent | absent | absent | absent | absent | absent |

Under-cited regions both audits agree on: Thailand has no explicit coverage
anywhere; Bangladesh appears only in fluency markers; Malaysia/Malay appears
only in pronunciation; Brazil, Japan, Turkey, Spanish-speaking, Saudi/Gulf,
Philippines/Cebu are sparse and topic-specific. The topics that would most
benefit from added country sourcing are **02/03/04** (non-core-market
part-specific prep), **05 band-6-to-7** (the central 6→7 boundary has no
Japan/Saudi/Brazil/Spanish material — a Brazilian candidate gets no
diagnostic), **06 feedback-patterns** (cross-regional feedback-voice table
incomplete without Japan/Brazil/Saudi), **08** (non-core LR/GRA transfer
evidence beyond idiom lists), and **10** (L1-specific pronunciation beyond
East/South/Southeast Asia and Persian/Russian blocks).

## Contradictions and conflicts

The two audits identify the same shape of conflict but quote slightly
different signal numbers and reach different reconciliations in places. Each
conflict is preserved with both readings where they diverge.

- **Idiom-density target for Band 7.** Conflicting numbers across topics:
  `01-band-descriptors/final.md → ## Practical signals` sets "1–2
  well-collocated idiomatic chunks per ~90-second Part 2 turn" as Band 7 LR
  floor (≥4–5 reads as memorised);
  `02-part1-interview/final.md → ## Practical signals #15` and
  `11-fluency-markers/final.md → ## Practical signals #11` target ~1 natural
  idiom per ~90 s; `03-part2-cue-card/final.md → ## Practical signals` says
  "≥ 2 idiomatic expressions per 2-minute turn";
  `04-part3-discussion/final.md → ## Practical signals #13` says 1–3 idiomatic
  chunks per Part 3 answer; `08-vocabulary-grammar/final.md → ## Practical
  signals #1` cites IELTS Advantage's empirical Band-9 observation of 1.2
  idioms on average with many at zero. **Reconciliation:** topic 08's
  empirical figure is the most credible; the safe rule is idiomatic-language
  *breadth and collocation quality*, not a required idiom count.
- **Idiom-density cap (zero-idiom ceiling).**
  `01-band-descriptors/final.md → ## Practical signals #11` says "zero
  idiomatic items across the whole test caps LR at Band 6";
  `08-vocabulary-grammar/final.md → ## Practical signals #1` says cap only
  when there is "zero idiomatic *language* of any type" (idiom + phrasal verb
  + fixed expression + conventional metaphor). The topic-08 framing is closer
  to descriptor wording.
- **Discourse-marker count for Band 7.** Sprawl across topics: `01-band-descriptors → #9` ≥5 distinct markers; `03-part2-cue-card → #8` ≥4 per 90s; `05-band-6-to-7 → #4` 4–6 across test; `09-instructor-tips → #8` 0 markers ≈ B5–6 but ">5 crammed" flags memorisation; `11-fluency-markers → #6` ≥6 distinct across ≥3 categories. **Reconciliation:** topic 11's count-plus-category framing best captures the descriptor "flexibility" requirement.
- **Maximum acceptable pause length.** No descriptor cutoff exists.
  `02-part1-interview → ## Practical signals` cites silent-pause threshold
  ≥250 ms for fluency analysis (a feature, not a band cutoff);
  `09-instructor-tips → ## Practical signals #4` says mid-clause unfilled
  pauses >2 s cap FC at Band 6;
  `11-fluency-markers → ### Conflicts and contested heuristics` lays out
  regional thresholds — Chinese prep ≥3 s, Iranian prep ≥5 s, British Council
  classroom drill ≥10 s. Only the BC 10 s figure has a primary source (and is
  a classroom-game stop condition, not a band cutoff). **Reconciliation:**
  use pause *placement and burden* as evidence; treat any numeric cutoff as
  soft prior.
- **Speech-rate / wpm targets.** Not aligned cleanly.
  `02-part1-interview → #10` uses syllables/sec and MLR (Band-7-ish ≈ 3.5–4.5
  syll/sec); `03-part2-cue-card → #12` cites native-norm 130–160 wpm
  (>180 wpm = loses pronunciation);
  `07-similar-repos → #2` cites Speechace's commercial threshold ≥120 wpm as
  "fluent" (vendor floor, not Band 7); `09-instructor-tips → #7` and
  `11-fluency-markers → ## Practical signals` use 130–160 wpm with <100 / >170
  as warning zones. **Reconciliation:** 130–160 wpm is the consistent coaching
  range; the Speechace number is a vendor lower bar; rate is a *supporting*
  feature inside a cluster, not a Band 7 floor.
- **Part 1 answer length.** `02-part1-interview → ## Crawl notes` enumerates
  regional advice ranging 10–15 s, 10–20 s, 1–3 sentences, 2–3 sentences, 4–5
  sentences / ≥20 s, and 5 sentences. `05-band-6-to-7 → ## Practical signals`
  says consistent 2–3 sentences = Band 7 and one-sentence answers cap Band 6.
  **Reconciliation:** ~2–3 sentences / ~10–30 s is the cross-regional norm;
  avoid hard caps from teaching advice.
- **Part 3 answer length.** `04-part3-discussion → ## Practical signals #8`
  flags this as explicitly unresolved: Korean ed:m says 2–3 sentences, Chinese
  New Oriental says 4–5, Western coaching (Keith/Speechful) says 30–60 s /
  70–150 words. The reconciliation in that same signal ("answer fully, don't
  pad") is the correct read.
- **Self-correction cadence.** `01-band-descriptors → #7` ≤2 self-corrections
  per Part 2 turn = Band 7 compatible, ≥4 = coherence cost;
  `08-vocabulary-grammar → #11` cites Liz Ferguson's "one per 30–45 s" cadence
  cap; `11-fluency-markers → #4` ≥3 *language-related* corrections per Part-2
  turn caps at Band 6. Roughly compatible (≈2–3 per 2-min turn) but published
  as independent numbers across topics — a judge applying all three will
  double-count.
- **Error-free sentence ratio for Band 7.** `01-band-descriptors → #13` says
  ≥~50 % of complex sentences error-free → Band 7-compatible, under 30 % →
  Band 6; `05-band-6-to-7 → #8` says ~30–40 % of clauses across the transcript
  should contain subordination and ~80 % error-free speech (from DOL Vietnam).
  The 50 % and 80 % targets measure different things (error-free *complex*
  sentences vs overall error-free clauses); a mechanical judge will
  double-count.
- **Part 3 hypothetical-question frequency.**
  `04-part3-discussion → ### Canonical Part 3 question-type taxonomy`
  preserves prep-blog taxonomies including hypothetical prompts, but the same
  topic's crawl notes record the UsingEnglish 365-question analysis of
  official Cambridge books finding only 3/365 (~1 %) pure hypotheticals. The
  Cambridge-book count is the only empirical number; coaching emphasis is
  over-weighted.
- **Transcript-only Pronunciation handling.** Mild tension, not direct
  contradiction. `01-band-descriptors → ## Practical signals` says default
  Pronunciation toward LR/GRA best-fit when no transcript evidence exists;
  `10-pronunciation-features → ## Practical signals #2` says do not score
  transcript-only Pronunciation in isolation higher than 7. **Reconciliation:**
  mark Pron evidence low-confidence without audio and cap high claims; both
  audits agree.
- **"That's an interesting question" stalling phrases (speaker asymmetry).**
  `04-part3-discussion → ## Practical signals` permits this as a
  content-bearing stall for the *candidate*;
  `06-feedback-patterns → ## Practical signals #14` forbids the same kind of
  motivational/stalling formula in the *judge's* output voice. These address
  different speakers and are not in conflict, but topics 04 and 09 don't flag
  the asymmetry.

Both audits confirm: **no direct contradiction in the official scoring frame.**
All topics agree on four equally weighted criteria, best-fit scoring, accent
neutrality, and whole-test aggregation. The real conflicts are local
prep-market heuristics.

## Operational-signal review

- **Total `Practical signals for an LLM judge` bullets across 11 topics:** ≈211
  (claude counted per-topic: 01=21, 02=18, 03=19, 04=22, 05=18, 06=21, 07=18,
  08=17, 09=20, 10=17, 11=20; codex counted 211 total).
- **Exact-duplicate bullets by title/text:** 0 (codex).
- **Near-duplicate restatements:** ~70–80 bullets across ~16 recurring rule
  clusters. Recurring restatements include: "accent not penalised,
  intelligibility is" (10+ topics); "do not infer pronunciation from a clean
  transcript without audio" (01, 02, 04, 06, 07, 10, 11); "memorisation is
  detected and downgraded" (01, 02, 03, 04, 05, 06, 08, 09); "score the four
  official criteria, do not invent labels like confidence" (06, 07, 09);
  "Band 7 = sustained, Band 6 = intermittent" (01, 05, 09); "do not auto-deduct
  for examiner interruption" (02, 04, 09); "L1 fillers penalised harder than
  English ones" (06, 08, 09, 11); "report sub-scores then round" (01 only —
  oddly not echoed). Net non-overlapping operational guidance is ~50–60
  distinct rules wearing different labels.
- **Operational contradictions to carry into a judge prompt:** idiom quotas;
  pause thresholds; wpm/articulation-rate thresholds; Part 1 answer-length
  norms; Part 3 hypothetical frequency; transcript-only pronunciation caps;
  discourse-marker count; self-correction cadence. All should be labelled
  *soft priors* unless anchored in official IELTS descriptors or IELTS-funded
  research.

### Top non-overlapping operational signals for a master rubric

Quoting source signal label and lead sentence verbatim:

1. `01-band-descriptors/final.md → ## Practical signals for an LLM judge`:
   "**Score only candidate speech.** IELTS Speaking is an interview, but the
   score is awarded for the test taker's performance across the full test."
2. `01-band-descriptors/final.md → ## Practical signals for an LLM judge #2`:
   "**Average across all three parts.** Treat descriptors as 'average
   performance across all parts' — do not let one strong answer dominate."
3. `01-band-descriptors/final.md → ## Practical signals for an LLM judge`:
   "**Best-fit, not penalty-counting.** Place the candidate at the band where
   the bulk of evidence sits per criterion; do not deduct from a Band 7
   transcript every time a feature dips into Band 6."
4. `01-band-descriptors/final.md → ## Practical signals for an LLM judge #4`:
   "**Sustained vs intermittent is the single most reliable Band 6 ↔ 7
   discriminator.** Do the desirable features (range, complexity, idiomaticity,
   prosody) appear throughout the transcript or only in flashes? Intermittent
   → Band 6; sustained → Band 7."
5. `01-band-descriptors/final.md → ## Practical signals for an LLM judge #5`:
   "**Cluster scoring, not one hard rule.** IELTS research found overlap
   between candidates at the same level and no single feature that separates
   all bands; combine pause burden, coherence, vocabulary flexibility, grammar
   range/accuracy and pronunciation evidence."
6. `11-fluency-markers/final.md → ## Practical signals for an LLM judge #1`:
   "**Hesitation type triage.** Tag every hesitation as content-related ('hmm,
   let me think… I suppose…') or language-related ('the… er… the thing… that
   I…'). Heuristic: content:language ratio ≥ 4:1 supports Band 8+; ≤ 1:1
   supports Band 6 or below."
7. `11-fluency-markers/final.md → ## Practical signals for an LLM judge`:
   "**Pause placement, not just count.** Clause-boundary pauses that mark
   stages in narration/argument can be coherent; mid-clause pauses while the
   candidate searches for a word are negative fluency evidence."
8. `11-fluency-markers/final.md → ## Practical signals for an LLM judge #3`:
   "**L1 filler check.** Any non-English filler (음, 那个, ano, эээ, چی بگم,
   anu, eee) is a hard penalty — caps F&C at Band 6 even when other features
   are stronger."
9. `01-band-descriptors/final.md → ## Practical signals for an LLM judge`:
   "**Lexical Resource: appropriacy > rarity.** Do not reward rare words by
   themselves; reward precise, appropriate, collocationally natural choices and
   effective paraphrase."
10. `08-vocabulary-grammar/final.md → ## Practical signals for an LLM judge`:
    "**Collocation accuracy.** Penalise wrong verb+noun partnerships (*do a
    research, say lies, make a decision* correct vs *do a decision* wrong)
    more than simple-but-correct wording."
11. `04-part3-discussion/final.md → ## Practical signals for an LLM judge #1`:
    "**Answer-the-exact-question discipline.** Seedhouse and Harris:
    high-scoring candidates understand the question, answer it, identify its
    inherent topic, and develop that topic. A fluent but off-question response
    should lower FC."
12. `04-part3-discussion/final.md → ## Practical signals for an LLM judge #2`:
    "**Personal vs. general framing.** If Part 3 answers contain ≥50 %
    first-person personal-narrative content … cap FC and LR at Band 6
    regardless of vocabulary, unless the question explicitly invited it."
13. `04-part3-discussion/final.md → ## Practical signals for an LLM judge #3`:
    "**Question-type ↔ grammar match.** Reward when a *future* question
    elicits modal/future forms (`will / is likely to / I would expect`);
    *hypothetical* elicits conditionals; *past-vs-present* elicits present
    perfect or `used to`; *comparison* elicits `whereas / while / by
    contrast`. Mismatches flag GRA at Band 6."
14. `03-part2-cue-card/final.md → ## Practical signals for an LLM judge #2`:
    "**Duration as a hard prior on Fluency & Coherence.** <60 s of candidate
    speech is strong negative evidence (≈ Band ≤5); 60–90 s is acceptable but
    often thin (≈ Band 6 with prompting); sustained 90–120 s with no examiner
    re-prompt is a Band 7+ precondition. Do **not** penalise the candidate
    merely for being stopped at two minutes."
15. `03-part2-cue-card/final.md → ## Practical signals for an LLM judge #4`:
    "**The rounding-off question is the candour test.** Compare fluency
    between the main turn and the 1–2 short follow-ups: a large drop suggests
    the long turn was rehearsed, and the speaking score should anchor closer
    to the round-off / Part 3 performance."
16. `03-part2-cue-card/final.md → ## Practical signals for an LLM judge #6`:
    "**Tense control across the talk.** Person/place/event cards typically
    need past-tense narrative + present-tense reflection + a hypothetical/
    future closing. A turn locked in a single tense throughout caps
    Grammatical Range below Band 7."
17. `04-part3-discussion/final.md → ## Practical signals for an LLM judge #16`
    (≈ `09-instructor-tips/final.md`):
    "**Memorised-chunk detection.** Watch for register-incongruent fluent
    bursts: sudden flawless multi-clause sentences with low-frequency
    vocabulary that don't match surrounding speech texture." Cadence also
    "breaks when the candidate 'drops' out of a recited block back into
    natural speech."
18. `10-pronunciation-features/final.md → ## Practical signals for an LLM judge #2`:
    "**Without audio, do not score pronunciation in isolation higher than 7.**
    A clean transcript cannot verify a 'wide range of pronunciation features.'
    Cap at 7 unless transcribed prosodic cues (caps for stress, ellipses for
    pauses, contractions, weak-form spellings) explicitly show stress, weak
    forms, chunking, or contrastive intonation."
19. `10-pronunciation-features/final.md → ## Practical signals for an LLM judge`:
    "**Separate accent from intelligibility.** An L1 accent with clear
    pronunciation, natural rhythm, and effective stress/intonation should not
    be penalised simply for sounding Korean, Chinese, Indian, Spanish, Arabic,
    Russian, etc."
20. `09-instructor-tips/final.md → ## Practical signals for an LLM judge`:
    "**Verify diarization before judging turns.** Confirm examiner prompts and
    candidate turns are separated correctly before judging turn length,
    interruptions, clarification requests, or overlap."
21. `06-feedback-patterns/final.md → ## Practical signals for an LLM judge #1`:
    "**Use the official four-criterion frame in fixed order: Fluency &
    Coherence → Lexical Resource → Grammatical Range & Accuracy →
    Pronunciation.** Never collapse, re-order, or invent labels such as
    'confidence', 'ideas', 'delivery', or 'speaking skill'."
22. `06-feedback-patterns/final.md → ## Practical signals for an LLM judge #3`:
    "**Anchor every error claim to a specific transcript span** in the format
    `Q<n> '<verbatim candidate phrase>' should be '<correction>'` or
    `Q<n> '<verbatim>' → '<better>'`. No anonymous 'you sometimes…' without
    an example."
23. `06-feedback-patterns/final.md → ## Practical signals for an LLM judge #5`:
    "**Hedge band predictions with 'estimated'** ('Your estimated score:
    Band 7') in the prose; commit to an integer only inside the JSON score
    field."
24. `01-band-descriptors/final.md → ## Practical signals for an LLM judge #21`:
    "**Report sub-scores then round.** Report all four sub-scores separately
    and compute the rounded overall (nearest half band) from the unrounded
    average — do not pre-round per criterion. Worked example: 7/7/6/7 → 6.75
    → **7.0**; 7/6/6/7 → 6.5."

## Source quality audit

URLs were sampled by domain/context, not fetched. Both audits agree the
corpus is disciplined about descriptor provenance: **no topic that quotes
band-descriptor wording fails to cite an official IELTS, British Council, or
Cambridge PDF.**

| Tier | URL sample | Topic(s) | Judgement |
| --- | --- | --- | --- |
| Authoritative | `https://cdn.ielts.org/ielts-guides/ielts-speaking-band-descriptors.pdf` and `https://ielts.org/cdn/ielts-guides/ielts-speaking-band-descriptors.pdf` | 01, 04, 06, 07, 09, 10 | Official IELTS descriptor PDF; primary authority. |
| Authoritative | `https://ielts.org/cdn/ielts-guides/ielts-speaking-key-assessment-criteria.pdf` | 01, 02, 06, 08, 10, 11 | Official key indicators / construct definitions. |
| Authoritative | `https://takeielts.britishcouncil.org/sites/default/files/ielts_speaking_band_descriptors.pdf` | all | British Council mirror; authoritative. |
| Authoritative | `https://assets.cambridgeenglish.org/webinars/ielts-speaking-band-descriptors.pdf` | 01, 07, 10, 11 | Cambridge mirror/training material; authoritative. |
| Research | `https://ielts.org/researchers/our-research/research-reports/the-relationship-between-speaking-features-and-band-descriptors-a-mixed-methods-study` | 01, 04, 11 | Seedhouse et al. 2014 mixed-methods IELTS research report. |
| Research | `https://cdn.ielts.org/Research/topic-development-in-ielts-speaking-test-seedhouse-et-al-2011.pdf` | 02, 03, 04 | Seedhouse 2011 peer-reviewed research. |
| Research | `https://journals.sagepub.com/doi/10.1177/02655322221086211` | 02 | Read 2022, *Language Testing* (SAGE). |
| Research | `https://www.tandfonline.com/doi/full/10.1080/15434303.2023.2283839` | 01 | Suzuki & Kormos 2023, *Language Assessment Quarterly*. |
| Research | `https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/disfluency-doesnt-happen-in-isolation/` | 04 | Cambridge *SSLA*. |
| Official-adjacent | `https://ielts.idp.com/prepare/article-understanding-the-ielts-speaking-band-descriptors` | 01, 06, 07 | IDP co-owner explainer; authoritative but secondary to the PDFs. |
| Official-adjacent | `https://ielts.com.au/australia/about/news-and-articles/article-speaking-band-6-vs-band-7` | 01, 05, 09, 10 | IELTS Australia/IDP; strong official-adjacent prep source. |
| Secondary (ex-examiner blogs) | `https://ieltsliz.com/...`, `https://www.ielts-simon.com/...`, `https://keithspeakingacademy.com/...`, `https://www.ieltsadvantage.com/...` | multiple | Established ex-examiner/coach blogs; widely cited and broadly accurate; useful secondary sources, not official. |
| Tooling (reputable, not IELTS authority) | `https://github.com/m-bain/whisperX`, `https://github.com/pyannote/pyannote-audio` | 01, 09, 11 | Reputable ASR/diarisation toolkits. |
| Regional cram-school (low-to-medium authority) | `https://zhuanlan.zhihu.com/p/268284465`, `https://ielts-fighter.com/...`, `https://3d-universal.com/...` | 08, 09, 03 | Useful for local market norms and scaffolds; not authoritative for scoring thresholds. |
| Weak / mirror | `https://ieltsagape.wordpress.com/ielts-speaking-band-descriptors/` | 01, 08, 10, 11 | WordPress "verbatim transcription" of descriptors; convenient mirror but weak authority; should be replaced with official PDF citation. |
| Blog-spam / content-mill / vendor blog | `https://terratern.com/...`, `https://www.kanan.co/ielts/...`, `https://leapscholar.com/...`, `https://www.gradding.com/...`, `https://www.shiksha.com/...`, `https://airfindia.com/makkar-ielts/`, `https://ieltsfever.org/...`, `https://allthingsielts.com/...`, `https://entri.app/...`, `https://www.geeksforgeeks.org/ielts/...`, `https://trainerjames.edu.np/...`, `https://edubenchmark.com/...`, `https://practiceme.app/...`, `https://speechful.ai/...`, `https://smalltalk2.me/...`, `https://www.cathoven.com/...`, `https://upscore.ai/...` | 03, 07, 08, others | Indian/SEO study-abroad aggregators and AI-scorer vendor blogs. Useful for topic taxonomy and market signal; their "Band 7+ samples" and "100+ idioms" pages are coaching content, not authority. |

Source-concentration concerns (cross-audit agreement):

- No topic is truly single-source — every file has many URL mentions — but
  several topics lean on a narrow tier.
- **Topic 09** is inherently low-authority-heavy (cram-school + YouTube-style
  advice).
- **Topic 10** leans heavily on `pronunciationstudio.com`, `boldvoice.com`,
  `blog.talk.edu` and similar accent-coaching content sites for L1-error
  catalogues — not peer-reviewed phonetics.
- **Topic 07** is heavy on GitHub/arXiv/commercial APIs — strong for tooling,
  weak as IELTS scoring validation.
- **Topic 06** relies on unofficial examiner-report examples for feedback
  voice.
- **Topic 02/03** contain many unofficial question/cue-card banks because
  official recent banks are not public; topic 03's
  `## Practical signals #19` correctly flags this.
- **Topic 04** has strong IELTS research anchors (Seedhouse 2011/2014) and is
  one of the best-sourced files.
- Topic 07 cites a "2026 *Language Testing* meta-analysis"
  (`https://journals.sagepub.com/doi/10.1177/02655322251387816`) — plausible
  given the May 2026 audit date; should be verified.
- Descriptor-citation caveat: topic 10's `### Official band descriptors
  (public version)` uses `ieltsagape.wordpress.com` for at least one lower-band
  wording while also citing official PDFs; follow-up should replace mirror-only
  lower-band quotes with official-PDF citations. Topics 08 and 11 also lean on
  the same WordPress mirror alongside the official PDF; harmless but the
  mirror should be dropped.

## Gaps and follow-up TODOs

Union of both audits' TODOs, deduped and grouped by target:

- **Topic 02 (part1-interview):** add Japan, Brazil, Saudi/Gulf, Turkey,
  Spanish-speaking, Thailand, Malaysia Part 1 prep sections with answer-length
  norms, memorisation warnings, common L1 grammar leaks.
- **Topic 03 (part2-cue-card):** add Thailand/Malaysia/Arabic/Brazil/Japan
  cue-card ecosystems — whether local prep uses topic-bank recall, PPF, mind
  maps, or memorised openers.
- **Topic 04 (part3-discussion):** add non-core-market Part 3 material
  (Japan, Brazil, Saudi/Gulf, Turkey, Spanish-speaking, Thailand, Malaysia),
  especially abstraction, hedging, and question-type grammar; add worked
  transcript exemplars at Band 5/6/7/8 showing question-type ↔ grammar match
  (current treatment is taxonomic, not exemplar-driven; the Oxford Online
  English Band-7 demo is referenced but not transcribed).
- **Topic 05 (band-6-to-7):** add Japan, Saudi, Brazil, Spanish-speaking 6→7
  prep sections — central topic of the corpus, currently silent on these L1s.
- **Topic 06 (feedback-patterns):** add Japan, Brazil, Saudi/Gulf country
  sections; add a worked Band-7 examiner-style feedback report **on a
  transcript with no audio** (every existing exemplar
  Misato/Alina/Rafael/Joanne appears to be from an audio-bearing test, but the
  user's intended use case is diarized-transcript-only); add more
  official-style or Cambridge/British-Council-style feedback so the voice
  doesn't lean on IELTS-Blog/OneIELTS examples.
- **Topic 07 (similar-repos):** add a validation inventory of human-rated
  IELTS-style speaking audio/transcript datasets — licenses, L1 coverage,
  spontaneous-vs-read speech, real-vs-synthetic band labels.
- **Topic 08 (vocabulary-grammar):** add Bangladesh, Turkey, Arabic/Saudi,
  Japanese, Spanish, Brazilian Portuguese, Thai, Malay LR/GRA transfer
  evidence (prioritise collocation and tense/aspect research over idiom-list
  blogs); add an explicit L1-collocation-error catalogue per region (wrong
  collocations like "do a research", "make exam" with L1 attribution).
- **Topic 10 (pronunciation-features):** add Thailand, Malaysia/Malay,
  Brazil/Portuguese, Filipino, Bangladesh pronunciation profiles from
  academic phonology or official IDP/British Council sources; add a
  transcript-only L1-inference reference table mapping spelling-level hints
  (`berry/very`, `sink/think`, `ship/sheep`) to L1 hypotheses with confidence
  levels.
- **Topic 11 (fluency-markers):** add a normalised fluency feature spec
  (words/min, articulation rate, mid-clause pauses per 100 words, filled
  pauses per 100 words, repair rate) mapped to descriptors without hard
  cutoffs; close the Indonesian discourse-marker analysis gap (topic 11
  itself notes "No strong Indonesian prep article on 'well / you know / I
  mean' use was found").
- **Topic 01 (band-descriptors):** add a compact "source hierarchy" section
  ranking official descriptors, Key Assessment Criteria, IELTS research,
  IDP/British Council explainers, ex-examiner blogs, cram-school heuristics,
  and AI-tool metrics.
- **New topic — transcript-only vs audio-enabled scoring protocol:** explicit
  confidence labels for Pronunciation and Fluency features.
- **New topic — memorisation/template detector:** regional examples of
  over-formal Part 1 openings, cue-card recitations, Part 2-to-follow-up
  fluency drops, and Part 3 abstraction collapse.
- **New topic — final judge-prompt synthesis:** deduplicate the 211 signals
  into a single ordered rubric and mark every numeric threshold as official /
  research / commercial / coaching / anecdotal.
- **New topic — cross-criterion conflict resolution:** a single page
  resolving the catalogued numeric heuristic conflicts into one consistent
  rubric with explicit "use this number when audio is available / use this
  when transcript-only" forks.
- **New topic — band-anchored transcript exemplars:** 10–20 short anonymised
  transcripts (Parts 1, 2, 3) at known band levels with line-by-line judge
  commentary (the corpus is heavy on rules and very light on labelled
  examples).
- **New topic — diarisation quality and judge-side fallbacks:** the corpus
  repeatedly says "verify diarisation before judging turns" but gives no
  judge-side rule for what to do when diarisation is bad (e.g. examiner
  turns merged with candidate turns). Topic 09 signal #20 names the problem;
  a fallback protocol is missing.
- **Cross-topic edit:** standardise the discourse-marker count threshold
  (current sprawl 4 / 5 / 6 / 4–6 across topics 01, 03, 05, 09, 11) and the
  idiom-density threshold (current sprawl 1.2 / 1–2 / 1–3 / 2 / ≥2 / ≤2 per
  Part 2 turn across topics 01, 03, 04, 08, 11). Pick one number per
  criterion, attribute it, and reference it from each topic rather than
  restating with different numbers.
- **Cross-topic edit:** mark every numeric heuristic explicitly as
  `[coaching prior, not official IELTS cutoff]` — topics 03, 05, 09, 11 do
  this; topics 01, 02, 04, 07, 08, 10 sometimes don't.

## Judge-prompt readiness verdict

The corpus is fit as **raw judge context** for grading a diarized IELTS
Speaking transcript, but **not fit to paste wholesale** into a judge prompt.
It has enough official-descriptor, section-specific, country-specific,
feedback-style, and tooling evidence to support criterion-by-criterion
scoring, especially for FC, LR, GRA, and Parts 2/3. The corpus's
*examiner-style feedback voice* (topic 06) is the strongest single asset for
an LLM judge that needs to emit feedback in a believable Cambridge register
— that topic alone is high enough quality to anchor the judge's writing
voice.

The judge will struggle where the corpus is noisy: Pronunciation without
audio, conflicting numeric heuristics (idiom density, discourse-marker count,
pause-length threshold, speech rate, Part 3 answer length, self-correction
cadence, error-free sentence ratio), repeated versions of the same rule,
unofficial recent-question banks, and regional coaching advice that may
overstate answer length, idiom counts, or pause cutoffs. It will also
struggle on Part 3 register decisions for Japanese, Brazilian, Saudi,
Turkish, and Spanish-speaking candidates because the regional 6→7 deltas for
those L1s are simply absent.

A production judge should:

1. Consume a **distilled master rubric** (not the raw 211 signals).
2. Privilege the **cluster-scoring framing** from
   `01-band-descriptors → ## Practical signals #5` over any parade of
   numeric heuristics.
3. Use the **qualitative descriptor language** from
   `06-feedback-patterns → ## Authoritative material` over commercial-vendor
   thresholds.
4. Apply the **transcript-only pronunciation cap** from
   `10-pronunciation-features → ## Practical signals #2`.
5. **Cite confidence per criterion** and treat country material as
   diagnostic context, not different scoring standards.
6. For each retained numeric heuristic, **explain why that number was
   chosen** instead of averaging across topics, and label it official /
   research / commercial / coaching / anecdotal.

Net: usable with care; rewrite the numeric heuristics into a single
conflict-resolved table before shipping.

## Crawl notes

- **Both crawls converge** on: 11-topic corpus, ~5,050 lines, identical
  topic skeleton, ~211 operational signals, four-criterion/best-fit/
  whole-test/accent-neutral scoring frame, and the eight numeric-heuristic
  conflict clusters listed above. Both also agree topic 06's feedback voice
  is the corpus's strongest single asset, topic 04 is the best-sourced for
  research anchors, and `ieltsagape.wordpress.com` should be replaced with
  official PDF citations.
- **Codex contributed uniquely:** an explicit Practical-signal review with
  duplicate counts (211 bullets, 0 exact duplicates, ~70 near-duplicates
  across 16 clusters); finer-grained region tags (Nepal, New Zealand, US as
  distinct dialect, Cebu, Switzerland/Germany, Spanish-speaking, Turkey,
  Malaysia/Malay) — these are kept in the merged country matrix;
  conservative reading of topic 07 as `strong` evidence for FC/LR/GRA/Pron;
  and a top-20 verbatim signal list anchored more heavily on topics 01, 08,
  11.
- **Claude contributed uniquely:** per-topic signal counts (01=21, 02=18,
  …); explicit catalogue of the "speaker-asymmetry" non-conflict between
  topic 04 (candidate stall) and topic 06 (judge voice) "That's an
  interesting question"; explicit unresolved conflict on Part 3 answer
  length and on self-correction cadence; the "report sub-scores then round"
  signal isn't echoed elsewhere; concrete content-mill source list
  (terratern, leapscholar, gradding, makkar, ieltsfever, allthingsielts,
  practiceme, speechful, smalltalk2, cathoven, upscore); proposal of new
  topics 12–14 (cross-criterion conflict resolution; band-anchored
  transcript exemplars; diarisation fallbacks).
- **Flagged conflicts between the two audits themselves** (not between
  source topics):
  - Criterion coverage matrix cells differ at topic 07 (codex `strong` vs
    claude `incidental` for FC/LR/Pron/GRA), topic 03 GRA, topic 06 GRA,
    topic 09 GRA/Pron/Part 1/Part 3, topic 11 Pron, topic 10 Part 1, topic
    05 Part 2/Part 3 — codex has a looser threshold for `strong`. Merged
    matrix takes the conservative reading and footnotes the disagreements.
  - Country-coverage shape: codex lists 22 regions; claude lists 19. The
    merge takes the union and tags the codex-only or claude-only cells.
  - Reconciliation of the pause-length threshold conflict: both audits
    reach the same answer (no descriptor cutoff exists; use placement and
    burden), but cite different leading signals.
  - Numeric reconciliations broadly agree (idiom density → topic 08
    empirical figure; discourse markers → topic 11 count+category framing;
    Part 1 length → ~2–3 sentences / 10–30 s; speech rate → 130–160 wpm as
    coaching range, not Band 7 floor).
- **Sections one crawl missed:** codex did not separately enumerate the
  "candidate vs. judge speaker asymmetry" non-conflict; claude did not
  separately call out the Nepal / New Zealand / US-dialect / Switzerland-
  Germany regional cells. Both are preserved in the merge.
