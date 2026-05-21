# How experienced tutors phrase speaking feedback (voice & structure for the LLM judge)

_Crawled by claude on 2026-05-19T16:35Z. Sources cited inline._

## Summary

This file captures the **register, structure, and recurring lexical chunks** that real IELTS examiners and experienced speaking tutors use when writing feedback. The LLM judge for our system should sound like a Cambridge-trained examiner writing a candidate report — not like a chatbot praising effort. That voice is descriptive ("speaks coherently and your speech flows well, though there is some over-repetition…"), criterion-by-criterion, and quote-anchored ("Q9 'all over world'"). It avoids motivational fluff, never says "great job," names specific errors with question numbers, and closes with a short "to get Band X" upgrade path.

## Authoritative material

### Cambridge / IELTS public band descriptors — the canonical phrasing pool

The four-criterion frame (Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation) is fixed and examiners' written comments are built almost entirely by paraphrasing or quoting the published Band Descriptors. The wording examiners reuse most often is preserved verbatim in the official UCLES descriptor table:

- **Fluency & Coherence (Band 9 → 6):** "speaks fluently with only rare repetition or self-correction; any hesitation is content-related rather than to find words or grammar" / "speaks fluently with only occasional repetition or self-correction; hesitation is usually content-related and only rarely to search for language" / "speaks at length without noticeable effort or loss of coherence; may demonstrate language-related hesitation at times, or some repetition and/or self-correction" / "is willing to speak at length, though may lose coherence at times due to occasional repetition, self-correction or hesitation; uses a range of connectives and discourse markers but not always appropriately." ([Cambridge/British Council speaking band descriptors via ielts.ch mirror](https://ielts.ch/wp-content/uploads/2021/04/assessing-IELTS-speaking.pdf))
- **Lexical Resource (Band 7 boilerplate):** "uses vocabulary resource flexibly to discuss a variety of topics; uses some less common and idiomatic vocabulary and shows some awareness of style and collocation, with some inappropriate choices; uses paraphrase effectively." (same source)
- **Grammar (Band 7):** "uses a range of complex structures with some flexibility; frequently produces error-free sentences, though some grammatical mistakes persist." (same source)
- **Pronunciation (Band 7):** "shows all the positive features of Band 6 and some, but not all, of the positive features of Band 8" — note the recursive comparative phrasing, which examiners actually reproduce in candidate reports. (same source)

Cambridge's own teacher-training pack tells examiners-in-training to "**highlight words which make one band different from another**" and then **"note down examples of performance in terms of the listed criteria"** before writing feedback — i.e. evidence-first, prose second. The pack also reminds teachers that band predictions "won't necessarily give … an accurate prediction" because nerves intrude, which is why real examiner feedback hedges with "**estimated** IELTS Speaking band" rather than a definite number. ([Assessing IELTS Speaking pack, UCLES 2011](https://ielts.ch/wp-content/uploads/2021/04/assessing-IELTS-speaking.pdf))

### IDP IELTS — descriptor restated for candidates

IDP rewrites the Band 8 descriptor as "speakers… demonstrate fluent delivery with minimal hesitation, speaking fluently and developing topics at length without needing prompts" — note the substitution of "minimal hesitation" for the official "occasional repetition," which propagates into tutor feedback worldwide. ([IDP — Understanding speaking band descriptors](https://ielts.idp.com/prepare/article-understanding-the-ielts-speaking-band-descriptors))

### Official IELTS examiner clips (ielts.org)

The IELTS organisation hosts examiner-commented speaking videos at <https://www.ielts.org/for-organisations/speaking-clips-examiner-comments>. The phrasing pattern in those clips is consistent: a one-sentence overall verdict, then four short paragraphs (one per criterion) where each paragraph starts with the *strength* and pivots on "**however**", "**but**", or "**though**" to the limitation.

### Worked verbatim examples from real examiner reports

These are the gold standard for voice and structure. The text below is reproduced verbatim from full PDF reports the examiner returned to candidates.

#### "Misato" — Band 6 overall (Crossroads Languages)

> "Misato speaks at length about the topics and is quite fluent. Her speech is not slow and she does not usually correct herself, but she hesitates quite a lot while she thinks about words or grammar (um; er; and then)."
> "She sometimes manages to link and organise her ideas well, but not always (The weather is nice and I could go anywhere else). She uses good discourse markers (well; actually; to be honest; especially) and basic linking words (connectives) (so; but; when), but these are sometimes inaccurate (because of we have children/because we have children…)."
> "She can only get a Band 6 for Fluency and Coherence because of her hesitation and her occasional difficulty in linking ideas."
> "…To get a higher band she needs to hesitate less and to have more range and accuracy in vocabulary and grammar."

Voice markers in this paragraph: third-person, present tense, *bracketed* in-line examples (`(um; er; and then)`), *bracketed corrections* (`because of we have children/because we have children`), and the closing "she can only get a Band X because…" formula. ([Crossroads Languages examiner comments PDF](https://www.crossroadslanguages.com/wp-content/uploads/2017/02/Examiners-comments-of-IELTS-sample-speaking.pdf))

#### "Alina" — Band 5 (IELTS-Blog)

> "You speak coherently and your speech flows well, though there is some over-repetition of expressions and fillers 'I don't know', 'it's about', etc."
> "You use an appropriate range of vocabulary … though there is some lack of precision when it comes to giving more detail. Q9 'not very useful', Q10 'not so huge'."
> "Q4 'family banding' should be 'family bonding'."
> "You tend to overuse 'a lot of' and 'it's about' — find alternatives like 'several' 'a large number' and 'it's to do with', 'it relates to', 'what I mean by this is'."
> Pronunciation comment: "Two main areas to work on: 1. Long vowels and diphthongs … pronounce these longer (Q5 'sweater' you pronounced as 'sweeter'). 2. Don't raise intonation after every clause."

Voice markers: **second-person** ("you"), question-number anchoring (`Q5`), `X should be Y` correction frame, and a closing two-block "Well done on / Suggestions for improvement" bulleted summary. ([Alina Band 5 examiner report PDF](https://www.ielts-blog.com/ielts-speaking-reports/alina-speaking-report-band-5.pdf))

#### "Rafael" — Band 8 (IELTS-Blog)

Examiner uses a three-column layout per criterion: **Well done / Errors / To improve**, then a side-by-side "Your estimated score: Band 8 | To get Band 9 (must get all points)" with bulleted descriptor checkboxes.

> Fluency: "Your speech is very fluent and coherent and all topics are well developed. At first you tended to overuse 'well' in the early questions. Partial repetition or paraphrase of the question might be appropriate in places, but make sure it continues to sound natural and **don't put in connecting phrases just for the sake of it.**"
> Lexis: "'the food was exactly as I asked them to do' — one of the very few expressions that does not sound like native English. The correct preposition/collocation should be 'make' not 'do' but other expressions would sound better — 'exactly as I had requested', 'exactly as I'd asked for' etc."
> Grammar: "Your grammar was very good in terms of range and accuracy, but you should pay close attention to preposition use. You could try recording yourself and I bet you would even catch your own small mistakes."
> Pronunciation: "With 't's push your tongue more firmly against the roof of your mouth and spit it out … you tend to slur some syllables especially those with 'i' or 't'."

Voice markers: **multiple-alternative rewrites** (`'X' or 'Y' or 'Z'`), articulatory-phonetics micro-coaching ("push your tongue more firmly"), and an offered upgrade path tied to the next-band descriptor. ([Rafael Band 8 examiner report PDF](https://www.ielts-blog.com/ielts-speaking-reports/rafael-speaking-report-band-8.pdf))

#### "Joanne" — Band 8.5 (IELTS-Blog HTML)

> Fluency note: "she spoke very fast and frenetically, and she only managed around 38 seconds of speaking, when she needed to produce between 1 to 2 minutes." (Pacing called out by absolute number, not adjectives.)
> Pronunciation note: "Joanne had no discernable Swedish accent and even had a slight U.S. accent."
> Lexis: "only rare instances of her using a mildly awkward expression" and "one slightly awkward collocation, 'so much effort.'" ([IELTS-Blog Band 8.5 report](https://www.ielts-blog.com/ielts-preparation-tips/speaking-tips/ielts-speaking-band-8-5-full-test-with-examiners-feedback/))

#### IELTS Assistance summary across all bands

Aggregated by [ieltsassistance.co.uk](https://ieltsassistance.co.uk/ielts-speaking-test/examples-with-examiners-comments/):
- Band 8: "speaks fluently and is able to give quite long and detailed responses; **hesitation is usually content-related**; vocabulary resource is wide; uses a wide range of structures with a high level of accuracy; only occasional minor errors."
- Band 7: "can speak at length without noticeable effort or loss of coherence; language-related hesitation, repetition and self correction; good vocabulary and shows some awareness of style; sometimes makes the wrong word choices; good grammatical control and produces many error-free sentences; some problems with tenses and articles."
- Band 6: "willing to give extended responses but there is occasional loss [of coherence]; **overuses certain fillers**; grammatical control of more complex structures is variable; intonation is somewhat flat; mechanical rhythm."
- Band 5: "able to keep going and is willing to give long answers; coherence is occasionally lost through hesitation; vocabulary is the strongest feature of her performance; errors do not interfere with communication; control of verb tenses is variable; has recurring difficulty with subject/verb agreement."
- Band 3.5: "unable to keep going without noticeable pauses; speech is slow with frequent repetition; some breakdowns in coherence; grammatical control is weak; errors frequent; understanding requires considerable effort."

### Ben Teaches English — five-bucket tutor template

UK tutor Ben's published template uses **five sub-criteria** (one beyond the four) and a one-line verdict for each: Communicative Effectiveness ("Very well done. I know the last section of the exam was difficult, but your hesitation was not a problem."), Pronunciation ("Very good. There were some isolated problems (foot and cook), but overall your accent is consistent, controlled and easy to understand."), Accuracy ("Good. Relatively few errors and they did not inhibit communication."), Range ("Very good. An impressive display of grammatical structures and vocabulary."), then Band Score: "7.5–8". Note the **adjective-band ladder** Ben uses internally: *Excellent / Very good / Good / OK / Needs work*. ([benteachesenglish.com sample feedback](http://benteachesenglish.com/do-a-speaking-test/sample-speaking-feedback/))

### My IELTS Classroom — ex-examiner cue-card feedback areas

Jessica (ex-examiner) commits her cue-card feedback to four diagnostic buckets that recur across submissions: "problems with past tenses when describing a past event", "high frequency of grammar errors", "giving examples to support adjectives when describing a person", "problems pronouncing single words". The framing is *patterns across the population* rather than one-off corrections — useful when the judge needs to make general comments. ([blog.myieltsclassroom.com cue card feedback](https://blog.myieltsclassroom.com/ielts-cue-card-feedback/))

### Academic research on tutor feedback voice

A 2023 study on IELTS speaking teachers' attitudes (Francis Academic Press) found OCF (oral corrective feedback) is "**guided by consideration for students' feelings**" — teachers temper accuracy-driven corrections to protect motivation. The study also flags that most IELTS speaking teachers "**lack systematic training and knowledge**" on which corrective strategy to apply, which is why feedback voice varies far more across tutors than across examiners. Useful for the judge: examiner-style feedback should be **dispassionate**, but tutor-style feedback usually **softens** the same content. ([Francis Academic Press, OCF study](https://francis-press.com/papers/11190))

## Country-specific prep material

### Vietnam — "Sandwich Feedback" is the textbook model

ETP TESOL (Vietnamese teacher-training arm) prescribes a three-part **Sandwich Feedback** structure: *Lời khen (praise) → Góp ý mang tính xây dựng (constructive criticism) → Lời động viên (encouragement)*. Sample: praise = "You're using past time markers like 'yesterday' correctly," critique = "The verb 'have went' should be 'went'," encouragement = "Keep practicing; your sentence structure is improving." ETP also explicitly tells teachers to **take notes silently** ("không gián đoạn") rather than interrupt, and to align corrections with the student's individual goal (IELTS vs interview vs daily). The praise→critique→encourage rhythm shows up in countless Vietnamese-language tutor reports. ([etp-tesol.edu.vn — 4 feedback strategies](https://etp-tesol.edu.vn/4-chien-thuat-danh-gia-feedback-ky-nang-speaking/))

### China — examiner-quote–heavy register

Chinese IELTS prep on Zhihu (知乎) and 新东方 (New Oriental) emphasises that students must **"研究考官评语" (study the examiner's comments)** for each official sample at every band from 3.5 to 9. Chinese tutor reports therefore tend to quote the public descriptors verbatim in English inside an otherwise Mandarin commentary. A typical 老烤鸭 (Lao Kaoya) Part 1 Teachers model answer ends with "**口语提分点** (scoring point): use idiomatic chunks like 'a tough cookie', 'on the same wavelength'." The expectation is that feedback names the *exact* idiom or collocation that would lift the score, not generic "use more idioms." ([知乎 — 雅思口语提分指南](https://zhuanlan.zhihu.com/p/197405982), [老烤鸭雅思 — Teachers Part 1](http://www.laokaoya.com/55958.html))

### Korea — recording-loop + line-edit voice

Korean cram-school reviews (시원스쿨랩, 슈퍼잉글리쉬, 파고다) describe their speaking feedback as "**스카이프로 수업 중에 채팅을 통해 선생님과 계속 피드백을 주고 받으며, 틀렸던 문구나 어색한 문장을 올바른 문장으로 만들어서 보여준다**" — i.e. the tutor pastes the candidate's wrong sentence in chat, then pastes a corrected version next to it. Korean tutors heavily weight **the recording + 20× shadowing loop** ("음독하면서 20번 반복"), so feedback is typically a script of clean rewrites rather than a discursive comment. ([Super English speaking reviews](https://m.super-english.co.kr/kwa-9550780-536), [Hackers IELTS speaking method](https://www.gohackers.com/?c=ielts/ielts_info2/ielts_method&type=url&uid=580926))

### Iran — bilingual scorecard + audio voice-note

Persian-language prep (مکتب‌خونه, ielts2, filmozaban) builds its speaking feedback around **15-mock-test packages** ("تصحیح اسپیکینگ آیلتس (15 تایی)") with both a numeric band per criterion and an audio voice-note ("فیدبک صوتی") that walks through the recording. The blended written-plus-audio model means Iranian tutor reports are short on prose; what they ship is bullet errors plus a 5-minute voice walkthrough. ([مکتب‌خونه — تصحیح اسپیکینگ ۱۵تایی](https://maktabkhooneh.org/course/%D8%AA%D8%B5%D8%AD%DB%8C%D8%AD-%D8%A7%D8%B3%D9%BE%DB%8C%DA%A9%DB%8C%D9%86%DA%AF-%D8%A2%DB%8C%D9%84%D8%AA%D8%B3-15-%D8%AA%D8%A7%DB%8C%DB%8C-mk856/), [filmozaban mock test + voice feedback](https://filmozaban.com/ielts-speaking-mock-test/))

### Russia / CIS — "former examiner" credentialism

Russian prep (profi.ru, ielts-school.ru, anglofeel.ru) sells feedback on the strength of the tutor being a **бывший экзаменатор (former examiner)**. Reviews emphasise "**подробные письменные комментарии**" (detailed written comments) and feedback that gives "**не только обратную связь, но и рекомендации**" (not only feedback, but recommendations) — i.e. Russian-market expectation is prose feedback + actionable next steps, mirroring the Cambridge "To improve" column. ([profi.ru IELTS tutors](https://profi.ru/repetitor/mezhdunarodnyie-ekzamenyi-i-testyi-angliyskiy/ielts/), [ielts-school.ru responses](https://ielts-school.ru/responses), [anglofeel.ru IELTS](https://anglofeel.ru/ielts/))

### Philippines — conversational-register coaching

IDP Philippines explicitly tells candidates examiners are "highly trained to spot memorised answers" and the standout advice is to be "conversational." The recommended self-rescue phrases when stuck — "I'm so sorry, my mind just went blank" and "I'm not really sure, but if I had to say…" — are themselves a model of how Filipino tutors phrase example *student* output in feedback (they show, not tell). Filipino tutoring chains (e.g. 3D Academy Cebu) market "cultural sensitivity" and direct, non-face-threatening corrections. ([IDP Philippines — 6 tips](https://www.idp.com/philippines/blog/how-to-ace-your-ielts-speaking-test/), [3D Academy Cebu — IELTS speaking](https://3d-universal.com/en/blogs/why-is-cebu-philippines-the-best-place-for-ielts-speaking-training.html), [IDP — Taking Feedback](https://www.idp.com/philippines/blog/taking-feedback/))

### India / Pakistan — band-descriptor-anchored tutor feedback

British Council India and Pakistan train tutors to give feedback "using public Band Descriptors" verbatim. Tutor reports follow a four-criterion grid with the descriptor quoted at the top of each box, then specific evidence underneath. The IELTS Coach product explicitly differentiates this from "language development" classes — the feedback is *score-oriented*, not pedagogic. ([British Council India IELTS Coach](https://englishonline.britishcouncil.org/ielts-coach/), [British Council India FAQs](https://www.britishcouncil.in/english/online/classes/ielts-preparation/faqs))

### Australia / UK / Canada — ex-examiner blog voice

Native-market sources (Sydney English Teacher, IELTSTutors, IELTS Liz, How to do IELTS) tend toward an **informal-but-precise** voice. Liz's typical feedback line is "the examiner is not trying to undermine confidence" — defusing student anxiety while keeping the focus on descriptor evidence. How to do IELTS publishes feedback like: "'used to' incorrectly used ('I used to know him' should be 'I knew him' or 'He has been my friend')" — same `X should be Y or Z` frame as ielts-blog. ([Sydney English Teacher feedback](https://www.sydneyenglishteacher.com.au/ielts-feedback), [IELTSTutors.org](https://ieltstutors.org/), [IELTS Liz — examiner interrupting](https://ieltsliz.com/why-the-ielts-speaking-examiner-stops-your-answer/), [How to do IELTS — Band 6.5 lesson](https://howtodoielts.com/ielts-speaking-test-and-lesson-band-6-6-5/))

### Switzerland / Germany — Cambridge house style

Continental European prep centres (e.g. ielts.ch) simply mirror the UCLES 2011 teacher pack, so feedback voice in this region is the most directly descriptor-aligned worldwide. Tutors there literally photocopy the band-descriptor table and write notes in the margin. ([ielts.ch — Assessing IELTS Speaking pack](https://ielts.ch/wp-content/uploads/2021/04/assessing-IELTS-speaking.pdf))

## Open-source tools and code

- **Speechful** (<https://speechful.ai/>) — AI IELTS grader producing four-criterion feedback. Useful as a competitor reference for the *kind of* sentence-level commentary an LLM judge should produce, though closed-source.
- **SmallTalk2Me** (<https://smalltalk2.me/ielts>) — free IELTS speaking mock with AI band feedback; produces criterion-by-criterion JSON output you can inspect at submission time for voice patterns.
- **Cathoven AI IELTS Speaking** (<https://www.cathoven.com/ielts/speaking/>) — instant AI feedback; same descriptor-mirroring voice.
- **GEL IELTS speaking feedback help docs** (<https://help.gelielts.com/hc/en-us/articles/26442761179284-How-can-I-get-feedback-on-Speaking>) — describes the operational flow tutors use, which is roughly what a judge agent should emulate.
- No notable open-source repos (MIT/Apache) ship pre-trained IELTS-speaking judges that we found; the closest open work is in the corrective-feedback NLP space (e.g. ResearchGate published reproductions of OCF studies, listed in Sources), not band-scored speaking.

## Practical signals for an LLM judge

Operational rules the judge should apply when **writing** feedback (separate from scoring):

1. **Use the second person ("you")** to the candidate by default, mirroring ielts-blog reports; switch to third person only when producing a *report about* the candidate for a teacher (e.g. Misato style). Pick one and hold it across all four criterion paragraphs.
2. **Write one paragraph per criterion, in the fixed order Fluency & Coherence → Lexical Resource → Grammatical Range & Accuracy → Pronunciation.** Never collapse them. Examiners never re-order.
3. **Anchor every error claim to a specific transcript span** in the format `Q<n> '<verbatim candidate phrase>' should be '<correction>'` or `Q<n> '<verbatim>' → '<better>'`. If the transcript is non-numbered, cite the candidate turn as `Turn N`. No anonymous "you sometimes…" without an example — this is the single biggest divergence between examiner voice and ChatGPT voice.
4. **Pivot on `though`, `however`, `but`** within each criterion paragraph: start with the strength (one short clause), then flip to the limitation. Worked template from Misato: `"X speaks at length about the topics and is quite fluent. … but she hesitates quite a lot while she thinks about words or grammar (um; er; and then)."`
5. **Quote fillers and discourse markers in brackets** when calling them out, e.g. `(well; like; 'cos; yeah)` for over-used; `(well; actually; to be honest; especially)` for good. Use semicolons inside the brackets — that is the Cambridge house style.
6. **Offer 2–3 alternatives, not a single rewrite,** when correcting a lexical inappropriacy. Example phrasing: `"'very glad' is not quite right here. Better: 'very happy to' / 'more than happy to' / 'more than willing to'."` This mirrors Rafael's report and reads as expert range, not pedantry.
7. **Hedge band predictions with "estimated"** ("Your estimated score: Band 7") and never claim certainty — the UCLES teacher pack itself warns that classroom predictions are unreliable. Drop a confident integer only inside the JSON score field, not the prose.
8. **Close with a single "To get Band X" paragraph** that lists the *next-band-up* descriptor features the candidate is missing. Use bullet points if there are three or more; otherwise a short sentence list. Pattern: "To reach Band 7 you would need to (a) speak at length without noticeable effort, (b) show some awareness of style and collocation, (c) frequently produce error-free sentences."
9. **Adjective ladder for impressionistic comments**, in descending order: *Excellent / Very good / Good / OK / Needs work* (Ben's ladder). Avoid "amazing," "fantastic," "awesome" — these never appear in real examiner reports.
10. **Forbid motivational closers.** Real examiner comments never include "Keep up the great work!", "You're doing amazing!", "I believe in you!" The closest the corpus comes is Vietnam's `Lời động viên` ("Keep practicing; your sentence structure is improving") — neutral and conditioned on observed progress, not unconditional praise.
11. **Cap praise at one clause per criterion.** Voice from Alina's report: `"speaking fluently and coherently and using good connecting words and phrases"` — five-to-twelve words, not a sentence.
12. **Name the *pattern*, then the *evidence*.** Examiner formula: "She also often leaves out words such as articles and verbs (eg I'm currently [a] housewife; I used to work in [an] office; so [there was] quite a lot of freedom for me)." The bracketed insertions are part of the house style — they show where the missing item belongs.
13. **For pronunciation, give articulatory micro-instructions, not adjectives.** Rafael's report: "With 't's push your tongue more firmly against the roof of your mouth and spit it out." Never just "improve your /t/."
14. **For fluency, cite measurable behaviour** (number of pauses, length of Part 2 answer in seconds, repetition counts) wherever the transcript allows. Joanne's Band 8.5 report flags "she only managed around 38 seconds of speaking, when she needed to produce between 1 to 2 minutes" — a specific number, not "you spoke too briefly."
15. **No meta-commentary about being an AI, and no questions back to the candidate.** Real examiner reports are a closed document: verdict in, no dialogue out.

## Sources

- [Cambridge UCLES — Assessing IELTS Speaking teacher pack (PDF)](https://ielts.ch/wp-content/uploads/2021/04/assessing-IELTS-speaking.pdf) — official band descriptors and example examiner-feedback methodology.
- [British Council — IELTS Speaking Band Descriptors (PDF)](https://takeielts.britishcouncil.org/sites/default/files/ielts_speaking_band_descriptors.pdf) — the canonical descriptor text examiners paraphrase.
- [IELTS.org — Speaking clips with examiner comments](https://www.ielts.org/for-organisations/speaking-clips-examiner-comments) — official video clips + four-criterion examiner commentary.
- [IDP — Understanding the IELTS Speaking Band Descriptors](https://ielts.idp.com/prepare/article-understanding-the-ielts-speaking-band-descriptors) — IDP's restated descriptors.
- [IELTS Assistance UK — Speaking test examples with examiners' comments](https://ieltsassistance.co.uk/ielts-speaking-test/examples-with-examiners-comments/) — aggregated verbatim feedback at every band 3.5–8.
- [IELTS-Blog — Alina Band 5 examiner report (PDF)](https://www.ielts-blog.com/ielts-speaking-reports/alina-speaking-report-band-5.pdf) — full four-criterion candidate report with question-number-anchored corrections.
- [IELTS-Blog — Rafael Band 8 examiner report (PDF)](https://www.ielts-blog.com/ielts-speaking-reports/rafael-speaking-report-band-8.pdf) — three-column Well done / Errors / To improve template plus next-band checklist.
- [IELTS-Blog — Joanne Band 8.5 full test + examiner feedback](https://www.ielts-blog.com/ielts-preparation-tips/speaking-tips/ielts-speaking-band-8-5-full-test-with-examiners-feedback/) — pacing called out by absolute seconds.
- [Crossroads Languages — Examiner comments on Misato Band 6 (PDF)](https://www.crossroadslanguages.com/wp-content/uploads/2017/02/Examiners-comments-of-IELTS-sample-speaking.pdf) — gold-standard third-person prose example.
- [Ben Teaches English — sample speaking feedback](http://benteachesenglish.com/do-a-speaking-test/sample-speaking-feedback/) — five-bucket UK tutor template with adjective ladder.
- [My IELTS Classroom — ex-examiner cue card feedback](https://blog.myieltsclassroom.com/ielts-cue-card-feedback/) — population-level pattern feedback.
- [Francis Academic Press — IELTS Speaking Teachers' Attitudes towards Oral Corrective Feedback](https://francis-press.com/papers/11190) — research showing tutor-vs-examiner voice divergence.
- [ResearchGate — Written Corrective Feedback in IELTS Writing Task 2: Teachers' Priorities, Practices, and Beliefs](https://www.researchgate.net/publication/323424811_Written_Corrective_Feedback_in_IELTS_Writing_Task_2_Teachers'_Priorities_Practices_and_Beliefs) — adjacent WCF research, relevant for tone calibration.
- [ETP TESOL Vietnam — 4 feedback strategies for speaking](https://etp-tesol.edu.vn/4-chien-thuat-danh-gia-feedback-ky-nang-speaking/) — Sandwich Feedback model.
- [Zhihu — 雅思口语提分指南 从5到7](https://zhuanlan.zhihu.com/p/197405982) — Chinese prep guidance to study examiner comments at every band.
- [老烤鸭雅思 — Teachers Part 1 model answer](http://www.laokaoya.com/55958.html) — Chinese tutor scoring-point format.
- [Super English Korea — speaking feedback reviews](https://m.super-english.co.kr/kwa-9550780-536) — Korean cram-school feedback voice and recording-loop method.
- [Hackers IELTS — speaking self-study method (Korean)](https://www.gohackers.com/?c=ielts/ielts_info2/ielts_method&type=url&uid=580926) — Korean tutor advice on shadowing and self-correction.
- [مکتب‌خونه — تصحیح اسپیکینگ آیلتس ۱۵ تایی](https://maktabkhooneh.org/course/%D8%AA%D8%B5%D8%AD%DB%8C%D8%AD-%D8%A7%D8%B3%D9%BE%DB%8C%DA%A9%DB%8C%D9%86%DA%AF-%D8%A2%DB%8C%D9%84%D8%AA%D8%B3-15-%D8%AA%D8%A7%DB%8C%DB%8C-mk856/) — Iranian 15-mock feedback package format.
- [filmozaban — ماک اسپیکینگ آیلتس با نمره دقیق + فیدبک صوتی](https://filmozaban.com/ielts-speaking-mock-test/) — Iranian bilingual scorecard + audio voice-note model.
- [highschool.su — 10 советов для подготовки к устной части IELTS](https://highschool.su/blog/ielts-speaking) — Russian-language IELTS speaking advice (10 tips, descriptor-anchored).
- [profi.ru — IELTS tutors directory](https://profi.ru/repetitor/mezhdunarodnyie-ekzamenyi-i-testyi-angliyskiy/ielts/) — Russian "former examiner" credentialism in feedback marketing.
- [ielts-school.ru — student reviews](https://ielts-school.ru/responses) — Russian-market expectations of feedback prose.
- [IDP Philippines — 6 tips for IELTS speaking](https://www.idp.com/philippines/blog/how-to-ace-your-ielts-speaking-test/) — Filipino conversational-register coaching.
- [IDP Philippines — Taking feedback along your IELTS prep journey](https://www.idp.com/philippines/blog/taking-feedback/) — how to process tutor feedback.
- [3D Academy Cebu — Why Cebu for IELTS speaking](https://3d-universal.com/en/blogs/why-is-cebu-philippines-the-best-place-for-ielts-speaking-training.html) — Filipino tutor selling points.
- [British Council India — IELTS Coach](https://englishonline.britishcouncil.org/ielts-coach/) — descriptor-anchored Indian tutor framework.
- [British Council India — IELTS Coach FAQs](https://www.britishcouncil.in/english/online/classes/ielts-preparation/faqs) — feedback delivery structure in India.
- [Sydney English Teacher — IELTS feedback](https://www.sydneyenglishteacher.com.au/ielts-feedback) — Australian tutor with Cambridge examiners on staff.
- [IELTSTutors.org — IELTS tuition from former examiners](https://ieltstutors.org/) — UK ex-examiner tutoring voice.
- [IELTS Liz — Why the speaking examiner stops your answer](https://ieltsliz.com/why-the-ielts-speaking-examiner-stops-your-answer/) — informal-precise native-market voice.
- [How to do IELTS — Band 6/6.5 speaking lesson](https://howtodoielts.com/ielts-speaking-test-and-lesson-band-6-6-5/) — `X should be Y` correction frame.
- [IELTS Online Tests — Part 1 Analysis Band 6.5](https://ieltsonlinetests.com/speaking-tips/ielts-speaking-test-part-1-analysis-band-65) — sentence-level analyst commentary.
- [Speechful.ai](https://speechful.ai/) — AI IELTS speaking grader for voice comparison.
- [SmallTalk2Me](https://smalltalk2.me/ielts) — AI mock test with criterion-by-criterion output.
- [Cathoven AI IELTS Speaking](https://www.cathoven.com/ielts/speaking/) — AI feedback tool.
- [GEL IELTS — How to get speaking feedback](https://help.gelielts.com/hc/en-us/articles/26442761179284-How-can-I-get-feedback-on-Speaking) — operational tutor flow.
