# 07-similar-repos — Research Index

Survey of public IELTS Writing AI / dataset / feedback projects on GitHub, HuggingFace, and Kaggle. Goal: enrich our own context corpus by understanding what data, schemas, prompts, and rubrics other projects rely on.

Compiled: 2026-05-09. Methodology: 25+ web searches/fetches across GitHub, Hugging Face, and Kaggle. No code was cloned; only public README, dataset cards, and metadata were inspected.

## Files

| File | Description |
|------|-------------|
| `github-repos-survey.md` | Detailed write-ups of 18+ GitHub repos building IELTS writing feedback / scoring tools |
| `datasets-found.md` | Catalogue of public IELTS writing datasets (HF, Kaggle, GitHub) with schemas |
| `prompt-templates-from-repos.md` | LLM system prompts and templates extracted from IELTS-AI tools (verbatim where available) |
| `data-schema-comparison.md` | Comparison table of fields tracked across projects/datasets |
| `lessons-learned.md` | Synthesis: what our repo should contain, gaps in the ecosystem, things to imitate or avoid |

## Quick stats

- GitHub repos profiled: **18+**
- HuggingFace datasets catalogued: **20+**
- Kaggle datasets noted: **3**
- Verbatim prompt templates collected: **5**
- Largest IELTS-specific dataset found: **18,000 essays** (KevSun/IELTS_essay_scoring)
- Most-used schema fields: `prompt/topic`, `essay`, `band`, plus four sub-band scores `TR / CC / LR / GRA`

## Ecosystem in one sentence

IELTS-AI projects converge on the same four-criterion rubric (Task Response/Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy) and almost universally reuse data scraped from `writing9.com`, `ielts-mentor`, `ieltsbuddy.com`, or sourced from the Kaggle `mazlumi/ielts-writing-scored-essays-dataset`. Quality and per-criterion granularity vary widely; the strongest signal-to-noise data is `chillies/IELTS-writing-task-2-evaluation`, `btnotpt/ielts_task_2`, and `TraTacXiMuoi/Ielts_writing_task1_academic`.
