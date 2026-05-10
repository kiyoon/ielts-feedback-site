# IELTS General Training Writing Task 1 — Sample Corpus Index

This folder collects **graded GT Task 1 letter responses** with band scores, examiner feedback, and corrections. The corpus is intended to train an LLM marker focused on students sitting at Band 6 and aiming for Band 7.

## Files in this folder

| File | Description | Sample count |
|---|---|---|
| `letter-types-overview.md` | Tone, register, structure, vocabulary by letter type (formal/semi-formal/informal) | n/a (reference) |
| `samples-band-5_5.md` | Sub-Band-6 letters showing register/length/register errors that prevent reaching 6 | 6 |
| `samples-band-6_0.md` | Typical Band 6 — bullets covered but tone slips and basic vocabulary | 8 |
| `samples-band-6_5.md` | The bridge — generally appropriate register but lacking specific detail or variety | 7 |
| `samples-band-7_0.md` | Target band — sustained register, specific detail, varied cohesion, accurate grammar | 10 |

## Letter types covered

| Type | Bands covered |
|---|---|
| Formal complaint | 5.5, 6.0, 6.5, 7.0 |
| Formal application | 5.5, 6.0, 7.0 |
| Formal inquiry | 6.0, 6.5 |
| Formal request | 5.5, 6.0, 6.5, 7.0 |
| Semi-formal complaint to landlord | 5.5, 6.0, 6.5, 7.0 |
| Semi-formal job application to manager | 6.0 |
| Semi-formal compliment / thank-you | 6.5 |
| Informal invitation | 6.5, 7.0 |
| Informal apology | 5.5, 6.0, 7.0 |
| Informal request (favour) | 6.5, 7.0 |
| Informal advice | 6.5 |

## Key sources used

- writing9.com (user-graded letter samples with auto per-criterion scoring)
- ieltschamp.com (band-tagged letter library)
- ieltsjuice.com (graded letter samples with band-up upgrades)
- ieltsadvantage.com (formal/informal letter Band 8/9 model collection)
- ieltsliz.com (Band 9 model letters used as Band 7+ targets)
- ieltsbuddy.com (10 letter samples across all letter types)
- ielts-mentor.com (GT Task 1 letter library)
- engnovate.com (user-written Band 6/7 letter samples)
- ieltspodcast.com (sample letter pack)

## How to use this corpus

1. **For training a marker:** feed the prompt + answer + scores + feedback to the model so it learns the alignment between observable letter features (register match, bullet coverage, specific detail) and Band level.
2. **For training a feedback generator:** "Specific Issues" sections are pre-formatted by criterion and ready to be reused for new student letters.
3. **For Band-6-to-7 coaching:** focus on the contrast between `samples-band-6_0.md` and `samples-band-7_0.md`. The "Common Profile" section at the end of each file summarises the gap.

## The big rules of GT Task 1 (synthesised across all samples)

1. **Match the register to the recipient.** Friend = informal. Boss/manager = formal. Landlord/colleague/tutor = semi-formal. Mismatched register caps Task Achievement at 5.
2. **Hit 160–190 words.** Below 150 caps TA at 5; above 220 increases error rate.
3. **Cover all three bullets equally.** Missing one is an automatic TA cap.
4. **Use specific concrete detail.** Dates, names, amounts, places, durations.
5. **Match opening + closing + sign-off** to the register (Dear Sir/Madam → Yours faithfully; Dear Mr X → Yours sincerely; Hi John → Take care / Lots of love).
6. **Proofread.** Spelling and basic grammar errors are the most common Band-6-cap.

## Cross-references

- `01-band-descriptors/` — official IELTS GT Task 1 band descriptors.
- `02-task1-academic/` — Academic Task 1 chart-description samples (paired corpus).
- `04-task2-essays/` — Task 2 essay samples.
- `05-band-6-to-7/` — synthesised Band 6 → 7 upgrade strategies (cross-task).
- `06-feedback-patterns/` — common examiner feedback patterns.
- `08-vocabulary-grammar/` — letter-type-specific lexical lists.
