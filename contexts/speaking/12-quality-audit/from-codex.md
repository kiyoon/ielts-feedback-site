# Speaking corpus audit

_Audited by codex on 2026-05-19T08:18:18Z._

## Overview

The speaking corpus contains 11 curated `final.md` files, about 5,048 lines / 702 KB total, spanning official IELTS Speaking band descriptors, the three test sections, Band 6-to-7 tactics, tutor feedback voice, adjacent scoring tools/repos, vocabulary/grammar, instructor tips, pronunciation features, and fluency markers. The corpus is organised consistently by topic into summary, authoritative material, country-specific material, tools/code, operational LLM-judge signals, sources, and crawl notes. Its strongest feature is repeated convergence on the official four-criterion, best-fit, whole-test scoring frame; its weakest feature is that many operational thresholds are recycled coaching heuristics, often duplicated or conflicting, so a judge prompt must filter them into soft evidence rather than hard rules.

## Criterion coverage matrix

Legend: `strong` = direct scoring evidence; `incidental` = mentioned or usable as a secondary cue; `absent` = little or no scoring evidence.

| Criterion / section | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | 11 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Fluency & Coherence | strong | strong | strong | strong | strong | strong | strong | incidental | strong | incidental | strong |
| Lexical Resource | strong | incidental | strong | strong | strong | strong | strong | strong | strong | absent | incidental |
| Grammatical Range & Accuracy | strong | incidental | strong | strong | strong | strong | strong | strong | strong | absent | incidental |
| Pronunciation | strong | incidental | incidental | incidental | strong | incidental | strong | absent | strong | strong | absent |
| Part 1 | incidental | strong | absent | absent | incidental | incidental | incidental | incidental | strong | absent | incidental |
| Part 2 | incidental | absent | strong | incidental | strong | incidental | incidental | incidental | strong | incidental | incidental |
| Part 3 | incidental | absent | incidental | strong | strong | incidental | incidental | incidental | strong | incidental | incidental |

Thin spots: transcript-only Pronunciation remains low-confidence despite strong topic 10 evidence; Part 1 has one dedicated file but weaker LR/GRA stress-testing than Parts 2/3; the section files are strong, but the judge still needs a single hierarchy for resolving duplicate numeric heuristics.

## Country / region coverage matrix

| Country / region | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | 11 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Korea | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| China / Hong Kong | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| Vietnam | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| Iran / Persian | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| India | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| Pakistan | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| Nepal | covered | covered | absent | absent | absent | absent | covered | covered | absent | absent | absent |
| Bangladesh | absent | absent | absent | absent | absent | absent | absent | absent | absent | absent | covered |
| Indonesia | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| Russia / Kazakhstan / CIS | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| UK / Australia / Canada | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered | covered |
| New Zealand | covered | absent | absent | absent | absent | absent | absent | absent | absent | absent | absent |
| US | absent | absent | absent | covered | absent | absent | absent | covered | absent | absent | absent |
| Japan | absent | covered | absent | absent | absent | absent | absent | absent | absent | covered | absent |
| Brazil / Lusophone | absent | covered | absent | absent | absent | absent | absent | absent | absent | absent | absent |
| Saudi / Gulf / Arabic-speaking | absent | covered | absent | absent | absent | absent | covered | absent | absent | covered | absent |
| Philippines / Cebu | absent | absent | covered | absent | covered | covered | absent | absent | absent | absent | covered |
| Switzerland / Germany | absent | absent | absent | absent | absent | covered | absent | absent | absent | absent | absent |
| Spanish-speaking regions | absent | absent | absent | absent | absent | absent | covered | absent | absent | covered | absent |
| Turkey | absent | absent | absent | absent | absent | absent | absent | absent | absent | covered | absent |
| Malaysia / Malay | absent | absent | absent | absent | absent | absent | absent | absent | absent | covered | absent |
| Thailand | absent | absent | absent | absent | absent | absent | absent | absent | absent | absent | absent |

Under-cited regions: Thailand has no explicit coverage; Bangladesh appears only in fluency; Malaysia appears only as `Malay` in pronunciation; Brazil, Japan, Turkey, Spanish-speaking regions, Saudi/Gulf, Philippines/Cebu, Switzerland/Germany, New Zealand and the US are sparse and topic-specific. The topics that would most benefit from extra country sourcing are 02/03/04 for non-core markets' part-specific prep, 08 for non-core LR/GRA transfer patterns, and 10 for L1-specific pronunciation coverage beyond the currently strong East/South/Southeast Asia and Persian/Russian blocks.

## Contradictions and conflicts

- Idiom-rate targets conflict across topics. `01-band-descriptors/final.md -> ## Practical signals for an LLM judge` sets "1-2 well-collocated idiomatic chunks per ~90-second Part 2 turn" as a Band 7 LR floor; `03-part2-cue-card/final.md -> ## Practical signals for an LLM judge` says ">=2 idiomatic expressions per 2-minute turn"; `08-vocabulary-grammar/final.md -> ## Practical signals for an LLM judge` cites IELTS Advantage's Band 9 observation of 1.2 idioms on average with many at zero. The 08 evidence is more credible for preventing quota scoring; the safe rule is idiomatic language breadth and collocation quality, not a required idiom count.
- Pause thresholds conflict. `02-part1-interview/final.md -> ## Practical signals for an LLM judge` cites a silent-pause threshold of `>= 250 ms` for fluency analysis; `09-instructor-tips/final.md -> ## Practical signals for an LLM judge` says mid-clause unfilled pauses over 2 seconds cap FC at Band 6; `11-fluency-markers/final.md -> ### Conflicts and contested heuristics across regions` lists 3 s, 5 s, and 10 s regional thresholds. The 11 conflict note is most credible because it labels all numeric cutoffs as non-official; use pause placement and burden as evidence, not a single cutoff.
- Speech-rate targets do not align cleanly. `02-part1-interview/final.md -> ## Practical signals for an LLM judge` uses syllables/sec and MLR; `07-similar-repos/final.md -> ## Practical signals for an LLM judge` cites Speechace/SpeechRater wpm thresholds; `09-instructor-tips/final.md -> ## Practical signals for an LLM judge` uses 130-160 wpm; `11-fluency-markers/final.md -> ## Practical signals for an LLM judge` uses 130-150 wpm, with below 100 and above 170 as warning zones. The official IELTS/research position is more credible: rate is a supporting feature inside a cluster.
- Part 1 answer-length advice varies. `02-part1-interview/final.md -> ## Crawl notes` lists 10-15 s, 10-20 s, 1-3 sentences, 2-3 sentences, 4-5 sentences / >=20 s, and 5 sentences by region; `05-band-6-to-7/final.md -> ## Practical signals for an LLM judge` says Part 1 answers consistently 2-3 sentences are Band 7 and one-sentence answers cap Band 6. The 02 reconciliation is more credible: use ~2-3 sentences / ~10-30 seconds as a norm, but avoid hard caps from regional teaching advice.
- Part 3 hypothetical frequency is over-weighted by prep taxonomies. `04-part3-discussion/final.md -> ### Canonical Part 3 question-type taxonomy` preserves prep-blog taxonomies including hypothetical prompts; `04-part3-discussion/final.md -> ## Crawl notes` reports the UsingEnglish analysis of official Cambridge books found only 3/365 pure hypothetical questions. The Cambridge-book count is more credible for frequency; the taxonomy is still useful for grammar matching when hypotheticals occur.
- Transcript-only pronunciation handling has a mild tension, not a direct contradiction. `01-band-descriptors/final.md -> ## Practical signals for an LLM judge` says to default Pronunciation toward LR/GRA best-fit when no transcript evidence exists; `10-pronunciation-features/final.md -> ## Practical signals for an LLM judge` says not to score transcript-only Pronunciation in isolation above 7. Topic 10 is more credible for high-band caution; combine them by marking P evidence low-confidence and capping high claims without audio.

No direct contradiction was found in the official scoring frame: all topics agree on four equally weighted criteria, best-fit scoring, accent neutrality, and whole-test aggregation. The real conflicts are local prep-market heuristics.

## Operational-signal review

- Total count of `Practical signals for an LLM judge` bullets across all 11 topics: 211.
- Exact duplicate bullets by title/text: 0.
- Near-duplicate restatements: approximately 70 across 16 recurring rules. The most repeated clusters are official four-criterion anchoring, whole-test averaging, hesitation type, self-correction, discourse-marker control, memorisation detection, transcript-only pronunciation caveats, accent neutrality, Part 2 sustainment, paraphrase, idiom density, complex structures, speech rate, Part 3 abstraction, response length, and diarization/candidate-only scoring.
- Operational contradictions to carry into a judge prompt: idiom quotas; pause thresholds; wpm/articulation-rate thresholds; Part 1 answer-length norms; Part 3 hypothetical frequency; transcript-only pronunciation caps. All should be labelled soft priors unless anchored in official IELTS descriptors or IELTS-funded research.

Strongest non-overlapping operational signals for a master rubric, quoting the source signal label and lead sentence verbatim:

1. `01-band-descriptors/final.md -> ## Practical signals for an LLM judge`: "Score only candidate speech. IELTS Speaking is an interview, but the score is awarded for the test taker's performance across the full test."
2. `01-band-descriptors/final.md -> ## Practical signals for an LLM judge`: "Average across all three parts. Treat descriptors as "average performance across all parts" — do not let one strong answer dominate"
3. `01-band-descriptors/final.md -> ## Practical signals for an LLM judge`: "Best-fit, not penalty-counting. Place the candidate at the band where the bulk of evidence sits per criterion; do not deduct from a Band 7 transcript every time a feature dips into Band 6"
4. `01-band-descriptors/final.md -> ## Practical signals for an LLM judge`: "Sustained vs intermittent is the single most reliable Band 6 ↔ 7 discriminator. Do the desirable features (range, complexity, idiomaticity, prosody) appear throughout the transcript or only in flashes?"
5. `11-fluency-markers/final.md -> ## Practical signals for an LLM judge`: "Hesitation type triage. Tag every hesitation as content-related ("hmm, let me think… I suppose…") or language-related ("the… er… the thing… that I…")."
6. `11-fluency-markers/final.md -> ## Practical signals for an LLM judge`: "Pause placement, not just count. Clause-boundary pauses that mark stages in narration/argument can be coherent; mid-clause pauses while the candidate searches for a word are negative fluency evidence"
7. `04-part3-discussion/final.md -> ## Practical signals for an LLM judge`: "Discourse-marker control, not density. Look for *appropriate* markers across functions (adding, contrasting, exemplifying, concluding)."
8. `01-band-descriptors/final.md -> ## Practical signals for an LLM judge`: "Lexical Resource: appropriacy > rarity. Do not reward rare words by themselves; reward precise, appropriate, collocationally natural choices and effective paraphrase."
9. `08-vocabulary-grammar/final.md -> ## Practical signals for an LLM judge`: "Collocation accuracy. Penalise wrong verb+noun partnerships (*do a research, say lies, make a decision* correct vs *do a decision* wrong) more than simple-but-correct wording"
10. `08-vocabulary-grammar/final.md -> ## Practical signals for an LLM judge`: "Paraphrase quality. Reward paraphrase when the candidate preserves meaning and avoids long hesitation around a lexical gap"
11. `05-band-6-to-7/final.md -> ## Practical signals for an LLM judge`: "GRA — error-free-sentence frequency. Look for runs of 3+ consecutive sentences with no grammar error (agreement, tense, articles, prepositions)."
12. `04-part3-discussion/final.md -> ## Practical signals for an LLM judge`: "Question-type ↔ grammar match. Reward when a *future* question elicits modal/future forms (`will / is likely to / I would expect`); *hypothetical* elicits conditionals"
13. `03-part2-cue-card/final.md -> ## Practical signals for an LLM judge`: "Duration as a hard prior on Fluency & Coherence. <60s of candidate speech is strong negative evidence (≈ Band ≤5); 60–90s is acceptable but often thin"
14. `03-part2-cue-card/final.md -> ## Practical signals for an LLM judge`: "Bullet coverage as a coherence proxy, not a checklist. A response that skips 2+ bullets typically reads as poorly organised even when fluent."
15. `09-instructor-tips/final.md -> ## Practical signals for an LLM judge`: "Use Part 3 as the main stress-test for Band 7+ abstraction. Candidates should justify opinions, analyse, discuss, and speculate, not only give short personal anecdotes"
16. `09-instructor-tips/final.md -> ## Practical signals for an LLM judge`: "Memorisation tells. Cadence breaks when the candidate "drops" out of a recited block back into natural speech"
17. `10-pronunciation-features/final.md -> ## Practical signals for an LLM judge`: "Without audio, do not score pronunciation in isolation higher than 7. A clean transcript cannot verify a "wide range of pronunciation features.""
18. `10-pronunciation-features/final.md -> ## Practical signals for an LLM judge`: "Separate accent from intelligibility. An L1 accent with clear pronunciation, natural rhythm, and effective stress/intonation should not be penalised simply for sounding Korean, Chinese, Indian, Spanish, Arabic, Russian, etc."
19. `09-instructor-tips/final.md -> ## Practical signals for an LLM judge`: "Verify diarization before judging turns. Confirm examiner prompts and candidate turns are separated correctly before judging turn length, interruptions, clarification requests, or overlap"
20. `06-feedback-patterns/final.md -> ## Practical signals for an LLM judge`: "Anchor every error claim to a specific transcript span in the format `Q<n> '<verbatim candidate phrase>' should be '<correction>'` or `Q<n> '<verbatim>' → '<better>'`."

## Source quality audit

Sampled by domain/context only; URLs were not fetched.

| URL sample | Topic(s) | Quality judgement |
| --- | --- | --- |
| `https://ielts.org/cdn/ielts-guides/ielts-speaking-band-descriptors.pdf` | 01, 04, 06, 07, 09, 10 | Official IELTS descriptor PDF; primary authority. |
| `https://ielts.org/cdn/ielts-guides/ielts-speaking-key-assessment-criteria.pdf` | 01, 08, 11 | Official construct-definition source; primary authority. |
| `https://takeielts.britishcouncil.org/sites/default/files/ielts_speaking_band_descriptors.pdf` | 04, 06, 08, 10, 11 | British Council mirror; authoritative. |
| `https://assets.cambridgeenglish.org/webinars/ielts-speaking-band-descriptors.pdf` | 01, 07, 10, 11 | Cambridge mirror/training material; authoritative. |
| `https://ielts.org/researchers/our-research/research-reports/the-relationship-between-speaking-features-and-band-descriptors-a-mixed-methods-study` | 01, 04, 11 | IELTS research report; high authority. |
| `https://ielts.idp.com/prepare/article-understanding-the-ielts-speaking-band-descriptors` | 01, 06, 07 | IDP co-owner explainer; authoritative but secondary to PDFs. |
| `https://ielts.com.au/australia/about/news-and-articles/article-speaking-band-6-vs-band-7` | 01, 05, 09, 10 | IELTS Australia/IDP; strong official-adjacent prep source. |
| `https://github.com/m-bain/whisperX` | 01, 11 | Reputable tool repo for ASR/timestamps; not a scoring authority. |
| `https://github.com/pyannote/pyannote-audio` | 01, 09, 11 | Reputable diarization toolkit; not IELTS authority. |
| `https://ieltsliz.com/ielts-speaking-self-correction/` | 11 | Established examiner-style prep blog; useful secondary source, not official. |
| `https://www.ieltsadvantage.com/idioms-for-ielts-speaking/` | 08 | Strong commercial prep blog; useful for anti-idiom-quota warning, but secondary. |
| `https://zhuanlan.zhihu.com/p/268284465` | 08, 09 | User-generated Chinese prep content; useful for market norms, low authority for scoring thresholds. |
| `https://ielts-fighter.com/tin-tuc/Phuong-phap-luyen-thi-IELTS-Speaking_c1448358933.html` | 09 | Regional cram-school material; useful for local scaffolds, not authoritative. |
| `https://3d-universal.com/en/blogs/ielts-speaking-part-2-cue-card-step-by-step-strategy.html` | 03 | Academy marketing/prep content; low-to-medium authority, useful only as country-market evidence. |
| `https://ieltsagape.wordpress.com/ielts-speaking-band-descriptors/` | 10, 11 | WordPress descriptor transcription; convenient mirror but weak authority; should not replace official IELTS/British Council/Cambridge PDFs. |

Source concentration: no topic is truly single-source; every file has hundreds of URL mentions. However, 09 is inherently low-authority-heavy because it samples cram-school and YouTube-style advice; 10 uses many pronunciation blogs for L1 error catalogues; 07 is heavy on GitHub/arXiv/commercial APIs and therefore strong for tooling but weak as IELTS scoring validation; 06 relies on unofficial examiner-report examples for feedback voice; 02/03 contain many unofficial question/cue-card banks because official recent banks are not public. Topic 04 has strong IELTS research anchors and is one of the best-sourced files.

Descriptor citation audit: no topic that materially quotes the band descriptors fails to cite an official IELTS, British Council, or Cambridge PDF. Caveat: `10-pronunciation-features/final.md -> ### Official band descriptors (public version)` uses `ieltsagape.wordpress.com` for at least one lower-band wording while also citing the official PDFs; follow-up should replace mirror-only lower-band quotes with official-PDF citations.

## Gaps and follow-up TODOs

- Add to topic 02: Japan, Brazil, Saudi/Gulf, Turkey, Spanish-speaking, Thailand, and Malaysia Part 1 prep sections with answer-length norms, memorisation warnings, and common L1 grammar leaks.
- Add to topic 03: Thailand/Malaysia/Arabic/Brazil/Japan cue-card ecosystems, including whether local prep uses topic-bank recall, PPF, mind maps, or memorised openers.
- Add to topic 04: non-core-market Part 3 material for Japan, Brazil, Saudi/Gulf, Turkey, Spanish-speaking regions, Thailand, and Malaysia, especially abstraction, hedging, and question-type grammar.
- Add to topic 08: Bangladesh, Turkey, Arabic/Saudi, Japanese, Spanish, Brazilian Portuguese, Thai, and Malay LR/GRA transfer evidence; prioritise collocation and tense/aspect research over idiom-list blogs.
- Add to topic 10: Thailand, Malaysia/Malay, Brazil/Portuguese, Filipino, and Bangladesh pronunciation profiles from academic phonology or official IDP/British Council sources.
- Add to topic 11: a normalized fluency feature spec: words/min, articulation rate, mid-clause pauses per 100 words, filled pauses per 100 words, repair rate, and how each maps to official descriptors without hard cutoffs.
- Add to topic 07: a validation inventory of human-rated IELTS-style speaking audio/transcript datasets; record licenses, L1 coverage, spontaneous-vs-read speech, and whether band labels are real or synthetic.
- Add to topic 06: more official or Cambridge/British-Council-style feedback examples, especially low-band and mid-band comments, so the feedback voice does not lean on IELTS-Blog/OneIELTS examples.
- Add to topic 01: a compact "source hierarchy" section ranking official descriptors, Key Assessment Criteria, IELTS research, IDP/British Council explainers, ex-examiner blogs, cram-school heuristics, and AI-tool metrics.
- New topic: transcript-only vs audio-enabled scoring protocol, with explicit confidence labels for Pronunciation and Fluency features.
- New topic: memorisation/template detector, with regional examples of over-formal Part 1 openings, cue-card recitations, Part 2-to-follow-up fluency drops, and Part 3 abstraction collapse.
- New topic: final judge prompt synthesis that deduplicates the 211 signals into a single ordered rubric and marks every numeric threshold as official / research / commercial / coaching / anecdotal.

## Judge-prompt readiness verdict

The corpus is fit as raw judge context for grading a diarized IELTS Speaking transcript, but not fit to paste wholesale into a judge prompt. It has enough official descriptor, section-specific, country-specific, feedback-style, and tooling evidence to support criterion-by-criterion scoring, especially for FC, LR, GRA, and Parts 2/3. The judge will struggle where the corpus is noisy: Pronunciation without audio, conflicting numeric heuristics, repeated versions of the same rule, unofficial recent-question banks, and regional coaching advice that may overstate answer length, idiom counts, or pause cutoffs. A production judge should consume a distilled master rubric, cite confidence per criterion, and treat the country material as diagnostic context rather than different scoring standards.
