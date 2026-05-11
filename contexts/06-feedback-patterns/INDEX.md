# IELTS Feedback Patterns — Research Index

Research on how IELTS examiners and teachers give written feedback on Writing tasks, so an LLM agent can mimic the style and structure.

## Files in this folder

| File | Purpose |
|------|---------|
| `feedback-structure.md` | Anatomy of a typical piece of IELTS feedback (intro, scores, per-criterion, summary, action items). |
| `examiner-phrases-bank.md` | Large catalogue of stock phrases per criterion and per band, with band context. |
| `error-correction-conventions.md` | How errors are flagged: codes (sp, gr, ww, wf, etc.), inline corrections, vs categorized lists. |
| `feedback-template-band6-to-7.md` | A master, reusable LLM prompt template for giving feedback to a band-6 student aiming for band 7. |
| `tone-and-register.md` | Encouraging-but-honest examiner tone and register guidance. |
| `model-feedback-examples.md` | Full real examples of feedback given to band-6 essays, drawn verbatim from sources. |
| `actionable-suggestions-patterns.md` | How examiners phrase "what to do next" suggestions (rewrite, expand, replace). |

## Primary sources used

- **writing9.com** — automated band feedback, sub-score rubric, repetition/linking word counts.
- **ieltsadvantage.com** — band 6 student answer with full examiner's report.
- **ieltspodcast.com** — band 6.5 essay with examiner commentary.
- **howtodoielts.com** — band 6 / 6.5 corrected essays with comments.
- **ielts-blog.com** — teacher comments on band 6 essays (strengths/weaknesses lists).
- **ieltsbuddy.com** — band 6 worked essays with criterion-by-criterion scores.
- **ielts-simon.com / ielts-simon.study** — rewriting feedback approach.
- **British Council / IELTS.org** — official sample candidate writing scripts and examiner comments PDFs.
- **ieltscharlie.com** — task response and band 6 vs band 7 comparisons.
- **ieltsetc.com** — feedback vocabulary glossary, prompt-style feedback questions ("which means…?", "So..?").
- **academic-englishuk.com / TeachingEnglish (British Council)** — full error correction code list.
- **ielts.idp.com** — official band 6 vs band 7 differences.
- **simplyielts.com / babycode.org** — common band 6 mistake patterns.
- **allearsenglish.com** — IELTS writing feedback checklist.
- **rupielts.com / ieltswritinganalytics.com** — band 6 vs 7 vs 8 descriptor verbatim phrasings.
- **ieltsonlinetests.com** — sample examiner-style criterion comments.
- **cathoven.com** — sample AI tutor feedback ("Your essay demonstrates a clear position…").
- **ieltsluminary.com / ieltsanswers.com** — examiner-led correction service feedback structure.

## Quick-reference: structure of typical IELTS feedback

1. Greeting / one-line orientation (sometimes skipped).
2. Overall band score (e.g., "Overall Band: 6.5").
3. Per-criterion sub-scores (TR, CC, LR, GRA), each with 1–4 sentences of comment.
4. Inline / margin error annotations on the essay text (codes or strikethroughs).
5. Strengths bullet list.
6. Weaknesses bullet list.
7. Top 2–3 actionable next steps.
8. (Optional) Model rewrite of one paragraph or "Band 7 sample answer" link.

## Quick-reference: how Writing9 structures feedback

Writing9 (the de-facto reference for automated IELTS feedback) decomposes each criterion into 3–5 micro-scores out of 9:

- **Coherence and Cohesion**: logical structure, intro & conclusion present, supported main points, accurate linking words, variety in linking words.
- **Lexical Resource**: varied vocabulary, accurate spelling & word formation.
- **Grammatical Range**: mix of complex & simple sentences, clear and correct grammar.
- **Task Achievement**: complete response, clear & comprehensive ideas, relevant & specific examples, appropriate word count.

It also surfaces hard counts: word-repetition instances (goal ≤ 3), grammar mistakes (counted), linking-word instances (goal ≥ 7).
