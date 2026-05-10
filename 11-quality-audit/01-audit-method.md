# 01 — Audit Method

## Purpose

This audit assesses whether the band labels attached to ~90 IELTS Writing samples in `02-task1-academic/`, `03-task1-general/`, and `04-task2-essays/` are plausible against the official 2023 IELTS Writing band descriptors. The goal is **not** to overrule the source rating but to **flag** samples whose label is in tension with descriptor evidence so that downstream LLM markers do not anchor to mis-calibrated examples.

## Rubric used

For each sample I asked four questions, anchored in the descriptors loaded from `01-band-descriptors/`:

| Criterion | Band 6 marker | Band 7 marker | Band 8 marker |
|---|---|---|---|
| **TR/TA** | Prompt covered unevenly; conclusion unclear; ideas underdeveloped | All main parts addressed; clear developed position; extended ideas | Prompt sufficiently addressed; well-developed position; only occasional lapses |
| **CC** | Mechanical connectors; misuse/overuse; paragraphing not always logical | Logical organisation, flexible cohesion (incl. reference + substitution); effective paragraphing | Logical sequencing, well-managed cohesion, only occasional lapses |
| **LR** | Adequate but restricted; basic word choice | Some less common items; awareness of style/collocation | Wide resource, fluent and flexible; some skilful uncommon/idiomatic items |
| **GRA** | Mix simple/complex; complex less accurate; errors frequent but not impeding | Variety of complex structures; **error-free sentences are frequent**; few persisting errors | Wide range; majority of sentences error-free; non-systematic occasional errors |

I then computed a likely overall band by averaging the four estimated criterion scores (per the standard `(TR+CC+LR+GRA)/4` rule), with the standard half-band rounding rules. For Task 1 vs Task 2, the criteria are weighted equally **within** the task; the relevant question for this audit is "does this sample fit the claimed band's profile", not the cross-task average.

### Score-inflation thresholds

A sample was tagged **likely inflated** if the descriptor evidence supports a band that is **0.5 lower than the claimed band** (e.g. labelled 7.0 but reads 6.5). A sample was tagged **questionable** rather than inflated when:
- evidence is mixed (one strong criterion can support the higher band);
- length is non-conforming but other features fit;
- handwritten transcription artefacts may obscure judgment.

A sample was tagged **likely deflated** if descriptor evidence supports a band **0.5 higher than the claimed band**. This is rarer in the dataset.

A sample was rated **broadly accurate** if at least three of four criteria sit within the claimed band (with the fourth no more than ±0.5 away).

### Confidence levels

- **High** — full essay text is present, errors and lexical features are countable, and the verdict is grounded in concrete evidence (e.g. >5 SVA errors clearly indicate sub-7 GRA).
- **Medium** — evidence is partial (essay summarised, only key features quoted) but examiner notes corroborate the verdict; or full text but the call is genuinely borderline.
- **Low** — only a topic + score were captured (placeholder samples with no essay text), or the text is from handwritten transcription with obvious artefacts.

I refused to assign verdicts harsher than **±0.5 from the claimed band** unless the evidence was overwhelming (e.g. multi-error garbled text where a "Band 7" claim is plainly wrong).

## What "score inflation" looks like in practice

The dominant inflation pattern in this dataset is **engnovate.com / writing9.com algorithmic scoring being generous on Lexical Resource and Grammatical Range** because:

1. The algorithms reward *attempts* at less-common vocabulary even when collocation is wrong (e.g. "incredible downfall", "shoulder higher pressure", "stimulation among many players").
2. Per-criterion scores include LR=4 / GRA=4 alongside TA=9 / CC=9, then the platform reports an **overall** that is closer to the high than the low — but a human examiner would weight the lower scores more heavily.
3. Per-criterion sub-scores below 5 (e.g. GRA=3.5 or 4) typically pull the overall to high-5 / low-6, not 6.5.
4. The platforms list "Band 7" or "Band 7.5" as the user-claimed target while flagging "30+ grammar errors" in the same review, which is internally inconsistent against descriptor wording ("error-free sentences are frequent" at Band 7).

A smaller deflation pattern exists: ieltsbuddy.com Band-6 samples sometimes have TR=7 across the board, and the overall might be more like 6.5 than 6.

## Sources of bias and limits

This audit is performed by a language model and **must not** be treated as equivalent to certified examiner judgment.

### LLM strengths in this audit
- Consistent application of descriptor wording across many samples.
- Easy detection of countable surface features (SVA errors, repeated words, spelling slips, wrong articles).
- Pattern matching across many samples for "this looks like Band X profile".

### LLM weaknesses in this audit
- I cannot reliably distinguish "naturally sophisticated lexis" (Band 8) from "memorised template chunks" (Band 4 limiter) — a key real examiner judgment.
- I have a tendency to over-credit length and over-penalise minor grammar slips relative to a calibrated examiner.
- I have no access to certified examiner consensus marking on these specific essays — only the source platform's claim and the descriptor text.
- I judge handwritten transcripts where original layout/spelling is uncertain.
- For samples that are summarised rather than reproduced verbatim, I am partly trusting the source's summary, which may itself be biased.
- I cannot run a marking moderation discussion with another examiner.

For these reasons, the verdicts in this audit should be treated as **second-opinion flags** rather than authoritative re-bandings.

## How users should interpret this audit

| If a sample is tagged… | Treat it as… |
|---|---|
| **Broadly accurate (High)** | Safe to use as a calibration exemplar at the claimed band |
| **Broadly accurate (Medium/Low)** | Usable but not anchor-grade |
| **Likely inflated (High)** | Re-band 0.5 down before using; do **not** anchor "what Band 7 looks like" to it |
| **Likely inflated (Medium)** | Add a content warning; consider only as a "weak Band X" example |
| **Questionable (any)** | Use only with explicit caveat; show the audit row alongside |
| **Likely deflated** | Probably fine, but the examiner thresholds suggest the sample might be a stronger model than its label implies |

Where samples come from algorithmic scoring (writing9, engnovate), a 0.5-band haircut is a reasonable default skepticism stance — applied alongside this audit's per-sample notes.

## Source-tier classification used

For the per-source roll-up in `07-summary-of-source-reliability.md`:

| Tier | Sources | Why |
|---|---|---|
| **Tier 1 — high trust** | British Council Sample Scripts, IELTS Liz, IELTS Advantage, ieltspodcast | Authored or vetted by certified examiners or ex-examiners; explicit examiner commentary |
| **Tier 2 — medium trust** | ieltsbuddy.com, ieltsfocus.com, ieltschamp.com, ieltsjuice.com | Examiner-style commentary present; band labels generally consistent with descriptor wording |
| **Tier 3 — low trust** | writing9.com, engnovate.com | Algorithmic scoring; per-criterion scores often internally inconsistent (TA=9 + LR=4 reported as band 6.5/7); systematic LR/GRA inflation |

This tiering is confirmed/refined in section 07.

## Files in this audit

- `01-audit-method.md` — this document.
- `02-task2-sample-audit.md` — full audit of all Task 2 essays.
- `03-task1-academic-sample-audit.md` — full audit of Task 1 Academic samples.
- `04-task1-general-sample-audit.md` — full audit of GT letter samples.
- `05-calibration-exemplars.md` — the best-calibrated samples per band/task.
- `06-flagged-samples.md` — samples requiring caution, with suggested re-band.
- `07-summary-of-source-reliability.md` — per-source reliability roll-up.
- `INDEX.md` — table of contents.
