# 08 — Vocabulary & Grammar Error-Correction Bank

> **Purpose:** atomic, machine-parseable error → correction reference for IELTS Writing band 6 → 7. Every entry is a single row in a markdown table that an LLM marker can quote directly as an actionable suggestion, and that a student can scan when they need the exact word/structure swap.
>
> Designed to **complement**, not duplicate, the strategy-and-showcase content in `05-band-6-to-7/` and the instructor patterns in `09-instructor-tips/`.

---

## Files in this folder

| # | File | Purpose | What's inside |
|---|---|---|---|
| 01 | [`01-grammar-error-correction-bank.md`](./01-grammar-error-correction-bank.md) | Atomic grammar errors → corrections | 14 categorised tables (articles, S-V agreement, tense, prepositions, conditionals, modals, passive, reported speech, relative clauses, participle clauses, conjunctions, word order, inversion/cleft, parallel connectors). ~270 rows. |
| 02 | [`02-vocabulary-error-correction-bank.md`](./02-vocabulary-error-correction-bank.md) | Atomic vocabulary errors → corrections | 11 tables (word form, false friends/Konglish/Chinglish, collocations, register, repetition upgrades, phrasal-verb upgrades, clichés, direct-translation issues, quantifiers, pronouns, spelling traps). ~240 rows. |
| 03 | [`03-cohesion-error-correction-bank.md`](./03-cohesion-error-correction-bank.md) | Cohesion errors → corrections | 7 tables (mechanical linker overuse, linker misuse, reference errors, substitution/ellipsis, lexical chains, paragraphing, sentence flow). ~95 rows. |
| 04 | [`04-task-response-error-correction-bank.md`](./04-task-response-error-correction-bank.md) | Task Response / Task Achievement errors | 9 tables (full-prompt coverage, position, off-topic body, underdeveloped ideas, weak conclusions, memorised phrases, Task 1 overview, Task 1 grouping, Task 1 tense). ~100 rows. |
| 05 | [`05-spelling-and-mechanics.md`](./05-spelling-and-mechanics.md) | Spelling, punctuation, capitalisation, numbers, hyphenation | 6 tables (40 misspellings, 15 punctuation, 10 capitalisation, 10 number, 15 hyphenation, BrE/AmE quick reference). ~95 rows. |
| 06 | [`06-paraphrase-quick-lookup.md`](./06-paraphrase-quick-lookup.md) | Alphabetical word → 3–5 academic alternatives + collocation tips | 26 alphabet sections + topic-anchored swaps. ~230 rows. |

**Total: ~1,000+ atomic rows.**

---

## Reading order

If you have **5 minutes** before a practice essay:
1. Skim `06-paraphrase-quick-lookup.md` — pick 3 high-frequency words you over-use (*good, important, help, many, big, get, make, very, people, thing*) and memorise 2 swaps each.
2. Read the top row of every section in `02-vocabulary-error-correction-bank.md § 5` (repetition / overused words).

If you have **30 minutes** for self-diagnosis after a marked essay:
1. Identify your error type → look it up in `01-grammar-error-correction-bank.md` or `02-vocabulary-error-correction-bank.md`.
2. Find the specific row → read the **Reason** and **Frequency** columns.
3. Drill the same category (e.g., articles) by re-reading 5–10 rows.

If you are **building an LLM marker** (the original use case):
1. Use `01–05` as a prompt-database: when the model detects a band-6 pattern, it can quote the exact "Original" string and offer the "Improved" string + Reason.
2. Use `06` as the synonym source for paraphrase suggestions.
3. Cross-reference with `09-instructor-tips/00-user-shared-feedback*.md` for real-world examples.

---

## How this complements `05-band-6-to-7/`

| `05-band-6-to-7/` provides… | `08-vocabulary-grammar/` provides… |
|---|---|
| **Strategy** (what is band 7 vs band 6, why) | **Atomic rules** (what to write instead) |
| **Showcases** (one full Band-7 example sentence per concept) | **Many-to-many tables** (all common error → all common fixes) |
| **Topic clusters** (environment, education, health vocabulary) | **Form-based clusters** (articles, prepositions, register, etc.) |
| **Reading-style prose** | **Lookup-style tables** |

> Use `05` to understand the gap; use `08` to fix specific instances.

---

## How this complements `09-instructor-tips/`

| `09-instructor-tips/` provides… | `08-vocabulary-grammar/` provides… |
|---|---|
| **Real, personally-received instructor feedback** with concrete band-7 patterns | **Generalised reference tables** built from cross-validated public sources |
| **Topic-specific gold** (population/city Task 1; education Task 2; trend language; passive voice) | **All-topic atomic rules** that can be applied to any prompt |
| **L1-specific instructor tips** (Korean, Chinese, Vietnamese) | **Generic L1-transfer rows** integrated into the broader bank |

> Use `09` for the **best-quality patterns** you can imitate verbatim; use `08` for **breadth of coverage**.

---

## Cross-reference quick map

| If you spot this error… | Best file to consult |
|---|---|
| *Many people thinks…* | `01 § 2 Subject-verb agreement` |
| *the amount of students* | `02 § 9 Quantifiers` |
| *make a research* | `02 § 3 Collocations` |
| *In the modern era of globalisation…* | `02 § 7 Clichés` and `04 § 6 Memorised phrases` |
| *Firstly… Secondly… Finally…* at every paragraph start | `03 § 1 Mechanical linker overuse` |
| Comma splices | `01 § 11 Conjunctions` and `05 § 2 Punctuation` |
| Position not stated in essay | `04 § 2 Position` |
| Missing Task 1 overview | `04 § 7 Task 1 overview` |
| *helps* / *makes* / *gets* used 5+ times | `02 § 5 Repetition` and `06 Paraphrase lookup` |
| Wrong tense for past chart | `01 § 3 Tense` and `04 § 9 Task 1 tense` |
| *staffs / informations / advices* | `02 § 9 Quantifiers (countability)` and `09-instructor-tips/00-user-shared-feedback-2.md` |
| Konglish / Chinglish words | `02 § 2 False friends` |
| Spelling: accommodation, environment, etc. | `05 § 1 Spelling` |

---

## Format conventions used throughout

- **Frequency** column: H = High, M = Medium, L = Low — based on how often the error appears in real band-6 essays (cross-validated across BabyCode, IELTS Liz, IELTS Advantage, IDP, British Council error logs).
- **Reason** column tags:
  - `[rule]` — strict grammar rule (always wrong)
  - `[style]` — preference / register issue (acceptable but caps your score)
  - `[reg]` — register / formality
  - `[coll]` — collocation
  - `[count]` — countability
  - `[L1]` — L1-transfer error (Korean / Chinese / Vietnamese)
  - `[form]` — word-form error
  - `[lex]` — lexical choice (vague / wrong word)
  - `[mech]` — mechanical / overused
  - `[wrong]` — wrong linker / connector for the relation
  - `[ref]` — referencing
  - `[para]` — paragraphing
  - `[flow]` — sentence-to-sentence flow
  - `[scope]` / `[pos]` / `[dev]` / `[mem]` / `[t1]` — Task Response error subtypes
  - `[sp]` / `[punct]` / `[cap]` / `[num]` / `[hyph]` / `[var]` — mechanics subtypes

---

## Source-verification policy

Each row was cross-checked against at least one of these source families:
- **Style references** (`09-instructor-tips/00-user-shared-feedback*.md`, `05-band-6-to-7/*.md`) — for the density and format target.
- **Public IELTS error references** (Cambridge *IELTS Common Mistakes*, IELTS Liz, IELTS Advantage, IDP, British Council, BabyCode error logs).
- **Academic / TEFL references** (Coxhead AWL 2000, Murphy *English Grammar in Use*, Swan *Practical English Usage*, Cambridge Dictionary, Oxford Learner's Dictionary collocations).
- **L1-transfer corpora** (academic papers on Korean and Chinese L1 errors, Konglish/Chinglish lexicons).

Sources are cited at the bottom of each file.
