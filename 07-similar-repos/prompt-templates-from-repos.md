# Prompt Templates Found in IELTS-AI Repos

Verbatim or near-verbatim prompt content extracted from research. Each block names its source. Use these as references for what other tools tell their LLM to do.

---

## 1. BaixuanLi / IELTS-Prompt — Three-Section Structure

Source: https://github.com/BaixuanLi/IELTS-Prompt (40 stars; v0.1 April 2024)

This is the cleanest example of an IELTS LLM prompt found. The repo splits its system prompt into three named sections.

### Role Prompt (verbatim)

> "I am now a tutor for the IELTS Academic Writing Test. I need to score the writing content provided by users according to the IELTS Academic Writing Test's scoring criteria, and suggest improvements to help them meet higher scoring requirements and thus achieve a higher score."

### Scoring Standard Prompt

Four equally-weighted criteria, each 25%:
- Task Achievement / Response
- Coherence and Cohesion
- Lexical Resource
- Grammatical Range and Accuracy

Task weighting: **Task 1 = 1/3 of total writing score; Task 2 = 2/3.**
Band scale: 1 (lowest) to 9 (highest), with detailed descriptors per criterion per band.

### Action Prompt

The tutor:
1. First asks whether the submission is Task 1 (requires image upload) or Task 2.
2. Returns scored feedback per criterion.
3. On revision request, returns a side-by-side **two-column markdown** before/after comparison.
4. Emphasises: accuracy, task completion, clarity, paragraphing, vocabulary appropriateness, error reduction.

---

## 2. docsbot.ai — Generic IELTS Writing Evaluation Prompt

Source: https://docsbot.ai/prompts/education/ielts-writing-evaluation

### Verbatim opening line

> "You are tasked with generating detailed evaluations and scores for IELTS writing tasks as an examiner would."

### Required output structure

For each criterion:
1. Task Achievement — "Assess how effectively the writing fulfills the task requirements"
2. Coherence and Cohesion — "Evaluate the organization and logical flow of ideas"
3. Lexical Resource — "Look at the range of vocabulary used, including the use of less common lexical items"
4. Grammar and Accuracy — "Examine grammatical range and accuracy, looking for sentence variety"

Output must include:
- Individual band scores 1–9 for each of the 4 categories
- An overall band score
- A summary assessment synthesising all evaluations

---

## 3. 123Harr / IELTS-WT2-LLaMa3-1k — Pre-rendered LLaMa3 Chat Template

Source: https://huggingface.co/datasets/123Harr/IELTS-WT2-LLaMa3-1k

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are an IELTS exam examiner expert.<|eot_id|>
<|start_header_id|>user<|end_header_id|>
[IELTS Writing Task 2 Prompt]<|eot_id|>
```

Minimal "system" prompt: just `You are an IELTS exam examiner expert.` Used for instruction-tuning/SFT in LLaMa3 format.

---

## 4. chillies/IELTS_essay_human_feedback — Sample feedback structure

Source: https://huggingface.co/datasets/chillies/IELTS_essay_human_feedback

The "chosen" feedback samples follow this implicit template (extracted from a sample row):

```markdown
## Task Achievement:
- The response adequately addresses [the prompt] ...
- [Specific examples from essay]
- Suggested band: X

## Coherence and Cohesion:
- [Analysis]
- Suggested band: X

## Lexical Resource:
- [Vocabulary observations]
- Suggested band: X

## Grammatical Range and Accuracy:
- [Grammar observations]
- Suggested band: X

## Overall Band Score: X
```

Reused convention: `##` heading per criterion, bullet-pointed observations, suggested per-criterion band, final overall.

---

## 5. chillies/IELTS-writing-task-2-evaluation — Inline-bracketed scores

Source: https://huggingface.co/datasets/chillies/IELTS-writing-task-2-evaluation

Sample evaluation field begins:

> "**Task Achievement: [7]** The essay effectively addresses the given task. The candidate clearly states their position in the introduction and provides relevant arguments and evidence to support their stance. However, the essay lacks depth in exploring the opposing viewpoint, which could have strengthened the argument..."

Pattern: `**<Criterion>: [<band>]** <prose paragraph>`. Embeds machine-extractable score in `[ ]` braces. Cleaner for downstream parsing than a markdown subsection.

---

## 6. araloak / ieltsGPT — Per-task prompts in `/prompts` folder

Source: https://github.com/araloak/ieltsGPT

The repo has a dedicated `/prompts/` directory with per-task templates (separate IELTS vs. TOEFL). Output is written as `feedback.md`. The exact prompt files were not fetchable via the public web (404 on raw paths), but the structure indicates a one-file-per-prompt convention.

---

## 7. araloak/ieltsGPT — feedback.md output convention

The tool produces markdown feedback that can be converted to .docx using `md2doc.bat`. Implies prompts target markdown formatting explicitly.

---

## 8. Pouyaexe / IELTS-Writing-Examinier — Knowledge JSON loaded into prompt

Source: https://github.com/Pouyaexe/IELTS-Writing-Examinier

While the actual LLM prompt is in `secrets.toml` (not exposed), the code loads three encrypted-JSON knowledge files into context:

- Academic Task 1 Band Descriptors
- General Training Task 1 Band Descriptors
- Task 2 Band Descriptors

Implicates a RAG-style approach where official band descriptors are injected into the LLM prompt verbatim.

---

## 9. Generic ChatGPT IELTS Mentor Pattern (community pattern)

Across multiple community resources (AIPRM, ChatGPT GPT Store "IELTS Writing Mentor", and Mohammad Hoseini Rad's Medium tutorial), the dominant pattern is:

```
You are an IELTS Writing examiner. Your job is to evaluate a candidate's
essay against the four official band descriptors:
1. Task Response / Task Achievement
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

For each criterion, give a band score from 1 to 9, justify the score with
specific evidence from the essay, and then compute an overall band as the
mean rounded to nearest 0.5. Conclude with 3 concrete improvement
suggestions.
```

(This is a synthesised distillation rather than a single source.)

---

## Common patterns observed

1. **Role first.** Almost every prompt opens with "You are an IELTS examiner expert".
2. **Four named criteria.** Always Task Response/Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.
3. **Per-criterion band + justification.** Never a single overall score with no breakdown.
4. **Final overall band** computed at the end.
5. **Markdown output** dominant. `##` headings or `**bold**` labels.
6. **Bracketed inline scores** (`Task Achievement: [7]`) used by the largest dataset for easy regex extraction.
7. **Improvement suggestions** appended after the score breakdown.
8. **Task 1 vs Task 2 differentiation** is usually explicit in the system prompt.
9. **Side-by-side rewrite** (two-column markdown) is a less common but powerful UX feature.
