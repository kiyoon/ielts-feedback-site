# Lessons Learned — Synthesis for Our Project

What we should imitate, avoid, and uniquely own based on the survey of 18+ repos and 20+ datasets.

---

## What the ecosystem does well

### 1. Universal four-criterion vocabulary

Every serious IELTS-AI project uses the same four criteria with the same names:

- **Task Response** (Task 2) / **Task Achievement** (Task 1)
- **Coherence and Cohesion**
- **Lexical Resource**
- **Grammatical Range and Accuracy**

➡ Our `01-band-descriptors/` folder must use these exact labels (and our schema's keys should as well: `task_response`, `coherence_cohesion`, `lexical_resource`, `grammatical_range_accuracy`).

### 2. Numeric per-criterion sub-bands as first-class columns

The best dataset (`btnotpt/ielts_task_2`) and the best model (`KevSun/IELTS_essay_scoring`) treat the four sub-bands as separate float fields. This makes downstream regression, evaluation, and analytics trivial.

➡ Our context corpus should record bands as floats per criterion + a derived `overall`, not as a single string like "Band 7.5 overall".

### 3. Granular per-criterion feedback prose

`hai2131/IELTS-essays-task-1` is the only dataset that has both a score *and* a free-text description per criterion, and that's the format human teachers actually produce. It's also the easiest to use for chain-of-thought-style prompting.

➡ Our feedback patterns folder (`06-feedback-patterns/`) should adopt the per-criterion-paragraph structure rather than a monolithic essay critique.

### 4. Prompt structure: Role / Standard / Action

`BaixuanLi/IELTS-Prompt` decomposes its examiner prompt into Role, Scoring Standard, and Action sections — clean, modular, and easy to update. Most other projects bundle everything into one mega-prompt.

➡ Our `01-band-descriptors/` content should be loadable as a "Scoring Standard" block in any prompt.

### 5. Side-by-side improvement rewrites

`BaixuanLi/IELTS-Prompt` and `nhanluongoe/ielts-writing-buddy` deliver before/after comparisons (two-column markdown or "rewrite to target band 8"). This is the most pedagogically useful output and most other projects skip it.

➡ Our `05-band-6-to-7/` folder is well-positioned to capture this; we should structure rewrite samples as `(original, improved, reason)` triples.

### 6. Markdown as the lingua franca

Both `araloak/ieltsGPT` (markdown→docx pipeline) and `chillies/IELTS-writing-task-2-evaluation` (markdown evaluation strings) use markdown for feedback. It's editable, diffable, and user-presentable.

➡ Our patterns/examples folder should be markdown native; we should also produce a JSON sidecar for machine consumption.

### 7. Loading band descriptors as knowledge files

`Pouyaexe/IELTS-Writing-Examinier` ships official band descriptors as JSON files that get injected into the prompt at runtime. This decouples scoring rules from the LLM.

➡ Strong argument that our `01-band-descriptors/` should also exist as JSON, not only as Markdown.

---

## What the ecosystem does poorly (gaps we can fill)

### G1. License clarity is awful

Most HuggingFace datasets list "license unspecified". Only ELLIPSE (CC BY-NC-SA 4.0) and `btnotpt/ielts_task_2` (Apache 2.0) are clear.

➡ Our repo should have explicit licensing per file/folder so others can reuse our context.

### G2. Task 1 receives 10× less attention than Task 2

Almost all projects — chillestt, ieltsGPT, BaixuanLi, examinai, Logisx — focus on Task 2. Only `TraTacXiMuoi/Ielts_writing_task1_academic` and `hai2131/IELTS-essays-task-1` build a real Task-1 corpus, and only one of them ships actual chart images.

➡ Our `02-task1-academic/` and `03-task1-general/` folders are competitive differentiators *if* we include realistic Task 1 prompts/images/feedback. Letter writing (GT Task 1) is even more under-served.

### G3. No project clearly distinguishes Academic vs. General Training Task 1

The chillies dataset family entirely misses the "general training" letter-writing format. Only `Pouyaexe/IELTS-Writing-Examinier` mentions both, and only as labels — no examples shown.

➡ Our `03-task1-general/` (letter writing — apology, complaint, request, formal/informal/semi-formal) is genuinely novel.

### G4. Feedback fields are dump-trucks of unstructured text

Even the best feedback strings (chillies/btnotpt) are wall-of-text markdown. None decompose feedback into actionable atomic suggestions (e.g. "replace `is good` with `is beneficial`").

➡ Our `08-vocabulary-grammar/` could ship error→correction tables (atomic, machine-readable). This is a real gap.

### G5. Band descriptors are usually paraphrased, not official

Most projects internalise *paraphrased* band descriptor language inside their prompt rather than quoting the British Council/IDP/Cambridge official descriptors. This is technically a copyright + accuracy risk.

➡ Our `01-band-descriptors/` should be the canonical, well-attributed reference (cite source explicitly, link to Cambridge/IDP PDFs).

### G6. Targeted score-jump corpora don't exist publicly

No public dataset I found focuses specifically on "what changes turn a Band 6 essay into a Band 7?" — this is exactly what test-takers ask for.

➡ Our `05-band-6-to-7/` folder is the differentiator. Couple it with similar 5→6 and 7→8 folders and we have a unique resource.

### G7. Mostly LLM-only, no graded baselines

Most repos either fine-tune one LLM and call it a day, or wrap GPT-4 with a prompt. Few include grading rubric *examples* showing why each band was awarded.

➡ Our exemplars folder (`04-task2-essays/`) should include not just the essay + band, but a worked rubric explanation: "This is Band 7 because (Task Response 7: ___; Coherence 7: ___ ...)".

### G8. Speaking/Writing crossover is muddled

Several "all-in-one" projects (ZainabZaman, examinai) blur Speaking and Writing rubrics. The two have *different* criteria sets (Speaking = Fluency/Coherence, Lexical Resource, Grammar, Pronunciation).

➡ Stay strictly Writing in our scope. Don't accept Speaking-flavoured criteria leaking into our descriptors.

---

## What our repo should contain (concrete)

Based on the gaps above, our `00..08` folders should include:

1. **`01-band-descriptors/`** — Markdown + JSON. Per task type (T1 Academic, T1 General, T2). Per criterion. Per band 0–9. Cite source.
2. **`02-task1-academic/`** — Sample prompts (line/bar/pie/table/map/process), with image references, with model answers at multiple bands, with per-criterion rubric explanations.
3. **`03-task1-general/`** — The most under-served: formal, semi-formal, informal letter samples with model answers and rubric explanations.
4. **`04-task2-essays/`** — Discussion/Opinion/Problem-Solution/Two-Question/Advantage-Disadvantage. Each prompt with model answers at Band 5/6/7/8 + rubric explanation.
5. **`05-band-6-to-7/`** — Original Band 6 essay → Band 7 rewrite, with diff and reason annotations. Also 5→6, 7→8.
6. **`06-feedback-patterns/`** — Templated examiner critiques per criterion. Bullet-form, atomic, copy-pasteable.
7. **`07-similar-repos/`** — This survey.
8. **`08-vocabulary-grammar/`** — Common error→correction pairs, collocations, linking phrases by function (contrast / addition / cause / example).

## Recommended schema for any examples we ship

Reuse the schema from `data-schema-comparison.md` §"Most common combined schema". JSON sidecar + Markdown human-readable, side by side.

## Recommended prompt template style

Adopt BaixuanLi's three-section structure (Role / Scoring Standard / Action). Keep the Scoring Standard section as a `{{include band-descriptors-task2.json}}` style insert so it's swappable.

## Things to actively avoid

- Don't paraphrase official band descriptors in our own words — quote and cite.
- Don't conflate TR (Task Response, T2) with TA (Task Achievement, T1) in schema keys.
- Don't ship a single huge `evaluation` text field; decompose to per-criterion.
- Don't bury images. If we describe a chart, also include the image (or an SVG) as an asset.
- Don't omit licenses. Each example file gets a license header or top-level LICENSE statement.
