# IELTS Academic Writing Task 1 — Sample Corpus Index

This folder collects **graded Task 1 Academic responses** with band scores, examiner feedback, and corrections. The corpus is intended to train an LLM marker focused on students sitting at Band 6 and aiming for Band 7.

## Files in this folder

| File | Description | Sample count |
|---|---|---|
| `chart-types-overview.md` | Language, structure, tense and vocabulary by chart type (line/bar/pie/table/mixed/process/map) | n/a (reference) |
| `samples-band-5_5.md` | Sub-Band-6 responses showing the errors that prevent scoring 6 | 6 |
| `samples-band-6_0.md` | Typical Band 6 — task done, but lexical/grammar issues | 11 |
| `samples-band-6_5.md` | The bridge — strong organisation, but vocabulary repetition and minor errors | 7 |
| `samples-band-7_0.md` | Target band — grouped data, varied vocabulary, accurate grammar | 10 |

## Key sources used

- ieltschamp.com (band-tagged Task 1 samples)
- writing9.com (user submissions with auto-graded per-criterion scores)
- ieltsliz.com (Band 9 model answers — useful as Band 7+ targets)
- ieltspodcast.com (ex-examiner reviewed essays)
- engnovate.com (user-written Band 6 / Band 6.5 essays)
- ieltsjuice.com (band-graded samples with upgrade versions)
- ieltsadvantage.com (process and map model answers)
- ieltsbuddy.com (pie chart model answers)
- paramountielts.com (Band 5.5 / 4.5 samples)

## Chart types covered

| Type | Bands covered |
|---|---|
| Line graph | 5.5, 6.0, 6.5, 7.0 |
| Bar chart | 5.5, 6.0, 6.5, 7.0 |
| Pie chart | 5.5, 6.0, 7.0 |
| Table | 6.0, 6.5, 7.0 |
| Mixed (line+bar / table+pie) | 6.0, 6.5, 7.0 |
| Process diagram | 5.5, 6.5, 7.0 |
| Map (changes over time) | 5.5, 6.0, 7.0 |

## How to use this corpus

1. **For training a marker:** feed the prompt + answer + scores + feedback to the model so it learns the alignment between Band level and observable features (overview presence, comparator language, error density).
2. **For training a feedback generator:** the "Specific Issues" sections are pre-formatted by criterion (TA / CC / LR / GRA) and ready to be reproduced for new student responses.
3. **For Band-6-to-7 coaching:** focus on the contrast between `samples-band-6_0.md` and `samples-band-7_0.md`. The "Common Profile" sections at the end of each file summarise the gap.

## Cross-references

- See `contexts/01-band-descriptors/` for the official IELTS band descriptors.
- See `contexts/04-task2-essays/` for Task 2 paired samples.
- See `contexts/05-band-6-to-7/` for synthesised upgrade strategies.
- See `contexts/08-vocabulary-grammar/` for chart-type-specific lexical lists.
