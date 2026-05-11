# Error Correction Conventions

How IELTS teachers, examiners, and grading services flag errors. There are three dominant conventions; pick one consistently or hybridise (writing9 / IELTS Luminary use a hybrid).

---

## 1. The three conventions

### Convention A — Margin codes (most common in classrooms)

The teacher writes a short code in the margin, on the line above, or directly above the offending word. The student must self-correct.

This is the standard British Council / Cambridge ESOL approach used in most teacher training. Sources:

- https://teachingenglish.org.uk/professional-development/teachers/knowing-subject/c/correction-code
- https://academic-englishuk.com/error-correction/
- https://ieltsetc.com/2020/03/ielts-writing-correction/

### Convention B — Inline strikethrough + replacement

The teacher strikes through the wrong word and writes the correct one above it (in pen) or in [brackets] / *italics*. Used by online correction services and ChatGPT-style automated graders.

Example (synthesised):

> She has been working there ~~since~~ **for** five years.

### Convention C — Categorised error list at the end

A standalone "Errors found" section at the bottom of the feedback, grouping issues by type. Used by IELTS Answers, IELTS-up, IELTS Luminary, and Writing9's hover-card system.

Example:

> **Grammar (3 issues):** "before decide" → "before deciding"; "for the couple" → "by"; "the couple limits" — possessive form.
> **Vocabulary (4 issues):** "contributing for" → "contributing to"; "convicts of" → "convinced of"; "dreams of constitute a family" → "dreams of having a family"; "loads" — informal.

---

## 2. The full standard correction-code list

Compiled from academic-englishuk.com and TeachingEnglish (British Council). This is the de-facto code set IELTS teachers use.

| Code | Meaning | Example |
|------|---------|---------|
| √ | "good point / good idea" | (margin tick on a strong sentence) |
| √√ | "very good point" | (double tick on best sentence) |
| ? | "confusing — meaning unclear" | written next to muddled sentence |
| ^ | "missing word" | between the two words a word is missing from |
| **T** | Tense | "She *go* yesterday." → T |
| **Gr** | Grammar (general) | catch-all when more specific code doesn't fit |
| **A** | Article (a, an, the, ∅) | "*The* education is important." → A |
| **WW** | Wrong word | "I like very much this movie." → WW |
| **WF** | Word form (prefix/suffix) | "It was very *succeed*." → WF (success / successful) |
| **Coll** | Collocation | "*do* damage" → Coll (make/cause damage) |
| **WO** | Word order | "I yesterday went…" → WO |
| **Inf** | Informal | "kids", "loads", "stuff" → Inf |
| **Prep** | Preposition | "depend *of*" → Prep (on) |
| **P** | Punctuation | comma splice, missing full stop |
| **R** | Repetition | same word used too often |
| **Sp** | Spelling | "politice" → Sp |
| **RC** | Relative clause (which/that/who/where/when/whom) | misuse of relative pronoun |
| **Ref** | Referencing problem | "this", "they" with unclear antecedent |
| **Cau** | Caution / overstatement | "All people are X" → soften with may/might |
| **Frag** | Sentence fragment | "Whereas a singer earns double." → Frag |
| **CS** | Comma splice | "Cars pollute, we should ban them." → CS |
| **SVA** | Subject–verb agreement | "He go" → SVA |

### How the cycle works

The standard "dialogic feedback" cycle, per Academic English UK:

1. Teacher marks errors with codes only (no corrections).
2. Student corrects all errors **in a different colour pen** and resubmits.
3. Teacher verifies corrections and provides the answer only on persistent errors.

Research-backed rationale: "having the students do something with the error correction besides simply receiving it" produces better long-term retention (ieltsetc.com).

---

## 3. How automated graders flag errors (Writing9 model)

Writing9 and similar tools (cathoven, lexibot, ieltspodcast) layer error display on top of the rendered essay:

- **Highlighted words/phrases** — the offending span is underlined in red/yellow/blue depending on type.
- **Hover/tap to expand** — shows error type and a short suggestion (e.g., "Use synonym", "Wrong collocation — try 'cause damage'").
- **Numeric counters above the essay**:
  - Word repetition: `5 instances detected (goal: ≤ 3)`.
  - Grammar mistakes: `3 issues flagged`.
  - Linking words: `6 / 7+ goal`.
- **Per-criterion sub-rubric** (3–5 micro-scores out of 9 per criterion — see `feedback-structure.md`).

This layered system is the *de-facto* template if an LLM is generating a writing9-style feedback report.

---

## 4. Inline-correction conventions used in correction services

When a service writes corrections back into the essay (ChatGPT-for-IELTS style), conventions are:

- **Strikethrough on the wrong word, replacement in bold/brackets**:
  > Many ~~peoples~~ **people** believe that…
- **Wrong word in {curly braces} with → arrow**:
  > Many {peoples → people} believe that…
- **Comments in [square brackets after the sentence]**:
  > Many peoples believe that… [WF: should be "people"; "peoples" only when referring to ethnic groups]
- **End-of-paragraph footnote-style** (Simon's rewriting approach, ielts-simon.com):
  > Original paragraph
  > ---
  > **Issues:** subject-verb agreement in sentence 2; collocation error in sentence 3.
  > **Rewritten paragraph** below.

---

## 5. Where to put what — decision rules

| Error type | Best convention |
|------------|-----------------|
| Spelling, simple grammar, single-word issues | **Inline** (Conv. B) — fastest for the student |
| Repeated patterns (same error 5×) | **Categorised list** (Conv. C) once + margin code on each |
| Complex grammar (sentence fragments, faulty parallelism) | **Margin code + comment** (Conv. A) — student needs to think |
| Lexical-range/collocation issues | **Categorised list with original → suggested column** |
| Cohesion / paragraphing issues | **Whole-essay note**, not inline |
| Task-response / off-topic content | **Per-criterion paragraph**, not inline; quote the offending span |

---

## 6. Worked sample — the same paragraph in three conventions

**Original (band-6 student):**

> In nowadays, alot of peoples thinks that childrens should learn computer in early age, because computer is very important in their future life. However, some peoples have different opinion about this issues.

### A — Margin code style

```
In nowadays, [P] alot [Sp] of peoples [WF] thinks [SVA] that childrens [WF]
should learn computer [A] in early age [A], because computer [A] is very
important in their future life. However, some peoples [WF] have different
opinion [A] about this issues [WF].
```

### B — Inline strikethrough style

> ~~In nowadays~~ **Nowadays**, ~~alot~~ **a lot** of ~~peoples~~ **people** ~~thinks~~ **think** that ~~childrens~~ **children** should learn ~~computer~~ **computers** ~~in early age~~ **at an early age**, because ~~computer~~ **the computer** is very important in their future life. However, some ~~peoples~~ **people** have ~~different opinion~~ **a different opinion** about ~~this issues~~ **these issues**.

### C — Categorised list style

> **Spelling (1):** "alot" → "a lot".
> **Word form (4):** "peoples" → "people" (×3); "childrens" → "children".
> **Articles (4):** "computer" → "computers" / "the computer"; "in early age" → "at an early age"; "different opinion" → "a different opinion"; "this issues" → "these issues".
> **Subject-verb agreement (1):** "peoples thinks" → "people think".
> **Punctuation/redundancy (1):** "In nowadays" → "Nowadays".

---

## 7. Sources

- https://academic-englishuk.com/error-correction/
- https://teachingenglish.org.uk/professional-development/teachers/knowing-subject/c/correction-code
- https://www.teachingenglish.org.uk/sites/teacheng/files/Writing%20correction%20code.pdf
- https://www.slm.uni-hamburg.de/iaa/studium/download-studium/materialien/correction-symbols.pdf
- https://ieltsetc.com/2020/03/ielts-writing-correction/
- https://writing9.com/text/62762401841b730018330e48-language-teachers-should-concentrate-on-giving-feedback-to-students-when
- https://www.ielts-simon.com/ielts-help-and-english-pr/2018/05/ielts-writing-task-2-rewriting.html
- https://3d-universal.com/en/blogs/chatgpt-for-error-correction-in-ielts-writing.html
- https://blog.babycode.org/ielts-writing-error-log-band-6-common-mistakes-solutions/
