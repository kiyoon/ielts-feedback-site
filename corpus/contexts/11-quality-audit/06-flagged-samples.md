# 06 — Flagged Samples (use with caution)

These samples are flagged for one or more of:
- **Likely score inflation** — claimed band is 0.5+ above descriptor evidence.
- **Likely score deflation** — claimed band is below descriptor evidence.
- **Per-criterion incoherence** — overall band may be defensible but the per-criterion sub-scores from the source platform should not be used to teach the descriptors.
- **Composite / non-real-sample** — entry is a "typical Band X pattern" rather than real candidate writing.
- **Source 404 / unrecoverable** — source is dead, only score + topic captured.

> **Reading rule:** When using any of these samples in feedback or LLM-marker training, attach an explicit caveat. Do **not** anchor calibration on them.

---

## High-confidence inflation (re-band recommended)

| Sample | File location | Claimed band | Suggested re-band | Why | Confidence |
|---|---|---|---|---|---|
| Asian urbanisation (line graph) | `contexts/02-task1-academic/samples-band-6_5.md` §Sample 5 | 7.5 (per source); filed under 6.5 | **6.5** | Source claims 7.5 with LR=4 reported — descriptor incompatibility. The repo file already shifts it down to the 6.5 file but the per-criterion still claims 7.5. | High |
| Streaming Services and Inequality | `contexts/04-task2-essays/samples-band-6_5.md` §Sample 1 | 6.5 (TR 8 / CC 6 / LR 6 / GRA 5) | **6.0** | TR=8 is implausibly generous — "not everyone are capable of accessing to a reliable Internet connect or even afford-subscription fees" is garbled. Multiple typos ("Consequenty / ta / peopte / expeniencing"). Cross-listed in samples-band-6_0.md §Sample 12 with the same issue. | High |
| Films vs Literature/Art | `contexts/04-task2-essays/samples-band-6_0.md` §Sample 6 | 6.5 (per-criterion: TR 7 / CC 6 / LR 6 / GRA 6) | **6.0** | Lower-case "i", "a lot of films was based" SVA, "due to the the fact that" double article, "the affect younger generations" affect/effect — at least four obvious errors plus repetitive conclusion. Filed correctly under 6.0 but the per-criterion summary claims 6.5. | Medium |
| UK shop closures (line graph) | `contexts/02-task1-academic/samples-band-6_0.md` §Sample 10 | 6.0–6.5 | **5.5–6.0** | 35 grammar mistakes flagged in 166 words means error-free sentences are not frequent — Band 6 GRA cap broken. Should be 5.5 or low 6, not 6.5. | High |
| Cooperation vs Competition | `contexts/04-task2-essays/samples-band-5_5.md` §Sample 7 | 5.5 (TR 6.5 / CC 5.5 / LR 6 / GRA 4) | **5.0** | Misspellings 4-5× ("compititive", "coopration"); lower-case "i"; SVA errors. Honest call: TR=5.5, LR=5; overall closer to 5.0 than 5.5. | Medium |
| Sports — Adv/Disadv | `contexts/04-task2-essays/samples-band-5_5.md` §Sample 8 | 5.5 (TR 6.5 / CC 5.5 / LR 6 / GRA 4) | **5.0–5.5** | Heavy repetition (sports/physical/playing 7-9× each) caps LR at 5. TR=6.5 generous. Borderline 5/5.5. | Medium |
| Brain Drain | `contexts/04-task2-essays/samples-band-5_5.md` §Sample 4 | 5 (TR 6 / CC 5.5 / LR 4.5 / GRA 4.5) | Overall 5 OK; TR sub-score down to **5.5** | TR=6 is generous given drift and "this problem can be posed by the help of a government" unclear position. Overall 5 is fine. | Medium |
| Dangerous Sports | `contexts/04-task2-essays/samples-band-7_0.md` §Sample 2 | 7.0 (7/7/7/7) | **6.5–7.0 borderline** | "Despite of these facts", "its proven", "stimulation among many players", "deemed hundred per cent competence" — 6.5 LR/GRA frequency. Sit at 7.0 ceiling, not 7.0 centre. | Medium |
| Technology and Environmental Problems | `contexts/04-task2-essays/samples-band-7_5.md` §Sample 2 | 7.5 | **7.0** | LR feels 7 not 7.5 — "technological advancements" 4×, "this is due to the fact that" recycled phrasing, fewer integrated examples than other 7.5 entries. Reads like upper-7. | Medium |

---

## Per-criterion incoherence (overall band defensible; per-criterion not trustworthy)

These are samples where the overall band is plausible but the per-criterion sub-scores from the source (typically writing9.com) cannot be reconciled with the descriptors. **Use overall only; ignore per-criterion.**

| Sample | File location | Reported per-criterion | Why incoherent |
|---|---|---|---|
| Line graph — US household tech | `contexts/02-task1-academic/samples-band-6_0.md` §Sample 1 | TA 9 / CC 9 / LR 4 / GRA 4 | Under-150 word count cannot coexist with TA=9. Real per-criterion likely 6/6/5/5. |
| Map — Canterbury school | `contexts/02-task1-academic/samples-band-6_0.md` §Sample 2 | TA 6 / CC 9 / LR 4 / GRA 4 | 23 grammar mistakes cannot coexist with CC=9. |
| Bar chart — Secondary education | `contexts/02-task1-academic/samples-band-6_0.md` §Sample 3 | TA 9 / CC 7 / LR 4 / GRA 4 | Repetitive linkers + LR=4 cannot give TA=9. |
| Line graph — CO2 emissions | `contexts/02-task1-academic/samples-band-6_0.md` §Sample 4 | TA 9 / CC 9 / LR 4 / GRA 4 | Same writing9 artefact. |
| Bar chart — Tourist leisure | `contexts/02-task1-academic/samples-band-6_0.md` §Sample 7 | TA 9 / CC 9 / LR 4 / GRA 4 | 26 grammar mistakes + LR=4 inconsistent with CC=9. |
| Mixed — Memphis Museum | `contexts/02-task1-academic/samples-band-6_0.md` §Sample 9 | TA 9 / CC 8 / LR 4 / GRA 4 | Same artefact. |
| Line graph — UK shop closures | `contexts/02-task1-academic/samples-band-6_0.md` §Sample 10 | TA 9 / CC 9 / LR 4 / GRA 4 | Already flagged for inflation above. |
| Wheat exports | `contexts/02-task1-academic/samples-band-6_5.md` §Sample 2 | TA 9 / CC 8 / LR 4 / GRA 4 | 18 grammar mistakes + LR=4 cannot give 6.5. Closer to 6.0. |
| NZ imports (mixed) | `contexts/02-task1-academic/samples-band-6_5.md` §Sample 3 | TA 9 / CC 8 / LR 4 / GRA 4 | Same artefact. |
| Country export values | `contexts/02-task1-academic/samples-band-6_5.md` §Sample 4 | TA 9 / CC 8 / LR 4 / GRA 4 | Same artefact. Closer to 6.0. |
| Faulty WFH equipment | `contexts/03-task1-general/samples-band-7_0.md` §Sample 1 | TA 7 / CC 7 / LR 9 / GRA 9 | LR=9 + GRA=9 with feedback "could elaborate / could use more polite phrasing" is implausible. Real LR/GRA likely 7/7. |

---

## Composite / pattern entries (not real candidate samples)

These should not be cited as "what Band X candidate writing looks like". They are descriptive aids only.

### Task 1 Academic
- `samples-band-5_5.md` §Sample 4 (Pie chart — generic)
- `samples-band-5_5.md` §Sample 5 (Process diagram — typical)
- `samples-band-5_5.md` §Sample 6 (Line graph — generic)
- `samples-band-6_0.md` §Sample 6 (Pie chart — Energy production)
- `samples-band-6_0.md` §Sample 11 (Pie chart — Household income)
- `samples-band-7_0.md` §Sample 8 (Mixed bar+pie composite)
- `samples-band-7_0.md` §Sample 9 (Table composite)

### Task 1 General Training
- `samples-band-5_5.md` §Sample 2 (Informal — friend visit typical)
- `samples-band-5_5.md` §Sample 3 (Formal — Job application typical)
- `samples-band-5_5.md` §Sample 4 (Formal — Complaint without structure)
- `samples-band-5_5.md` §Sample 5 (Informal — Apology with wrong register)
- `samples-band-5_5.md` §Sample 6 (Semi-formal — Late rent typical)
- `samples-band-6_0.md` §Sample 4 (Informal — friend visit typical)
- `samples-band-6_0.md` §Sample 5 (representative pattern, not reproduced)
- `samples-band-6_0.md` §Sample 6 (Late rent typical)
- `samples-band-6_0.md` §Sample 7 (Apology to friend typical)
- `samples-band-6_0.md` §Sample 8 (Course inquiry typical)
- `samples-band-6_5.md` §Sample 5 (Sport advice typical)
- `samples-band-6_5.md` §Sample 6 (Noise complaint typical) — note this is a strong example, closer to 7 than 6.5
- `samples-band-6_5.md` §Sample 7 (Pet care request typical)
- `samples-band-7_0.md` §Sample 9 (Noise complaint composite)
- `samples-band-7_0.md` §Sample 10 (Apology composite)

---

## Model-vs-candidate confusion (Band 9 model labelled within Band 7 file)

The Band 7.0 file in both Task 1 Academic and Task 1 GT contains explicit Band 9 models from ieltsliz / ieltsadvantage. They are correctly tagged as Band 9 inside the entries, but should not be conflated with Band 7 candidate writing.

### Task 1 Academic — Band 9 models inside Band 7 file
- `samples-band-7_0.md` §Sample 4 (Bar chart — UK visits)
- `samples-band-7_0.md` §Sample 5 (Process diagram — Silk production)
- `samples-band-7_0.md` §Sample 6 (Map — Town development)
- `samples-band-7_0.md` §Sample 7 (Pie charts — Energy France)

### Task 1 GT — Band 8/9 models inside Band 7 file
- `samples-band-7_0.md` §Sample 2 (Late rent target — 8.0–8.5)
- `samples-band-7_0.md` §Sample 3 (Damaged road target — 8.0–8.5)
- `samples-band-7_0.md` §Sample 6 (Delayed reply — Band 9 model)
- `samples-band-7_0.md` §Sample 7 (Job application — Band 8 model)
- `samples-band-7_0.md` §Sample 8 (Dog-sitting — Band 8/9 model)

> **Recommendation:** When training an LLM marker, treat these as Band 8/9 anchors, not Band 7. Real Band 7 work in the same file (Samples 1, 4, 5 in GT; Sample 1 in Academic) has more errors and less idiomatic flexibility.

---

## Source 404 / unrecoverable

- `contexts/04-task2-essays/samples-band-6_5.md` §Sample 8 (Wide vs Narrow Subject Range) — engnovate URL returns 404; only "examiner themes from search snippets" reported; **cannot audit**. Recommend marking as placeholder or removing.
- `contexts/04-task2-essays/samples-band-5_5.md` §Sample 3 (Unethical Advertising — ieltsbuddy) — only score and topic captured; full essay not retrievable. Cannot independently verify.

---

## Likely deflation (sample reads stronger than label)

| Sample | File location | Claimed band | Suggested re-band | Why |
|---|---|---|---|---|
| Improved Medical Care / Longevity | `contexts/04-task2-essays/samples-band-6_0.md` §Sample 3 | 6 borderline 7 (TR 7 / CC 7 / LR 7 / GRA 6) | **6.5** | Three of four criteria at 7; clear position throughout; specific examples (heart attack, blood pressure); GRA fragment is the only drag. Honest 6.5 by descriptor maths and content; the 6.0 placement understates. |

(Deflation is rare in the dataset — only this one clear case.)
