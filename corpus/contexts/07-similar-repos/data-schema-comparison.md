# Data Schema Comparison Across IELTS Projects/Datasets

A field-by-field comparison of what each dataset/project tracks. ✅ = present, ◐ = derived/embedded inside another field, ✖ = absent.

## Core fields

| Project / Dataset | prompt/topic | essay | task type (1/2) | overall band | TR | CC | LR | GRA | feedback prose | corrections / rewrite | image (Task 1) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| chillies/IELTS-writing-task-2-evaluation (HF) | ✅ `prompt` | ✅ `essay` | implicit T2 | ✅ `band` | ◐ in eval | ◐ | ◐ | ◐ | ✅ `evaluation` | ✖ | ✖ |
| chillies/IELTS_essay_human_feedback (HF) | ✅ | ✅ | implicit T2 | ◐ | ◐ | ◐ | ◐ | ◐ | ✅ chosen + rejected | ✖ | ✖ |
| btnotpt/ielts_task_2 (HF) ★ | ✅ `topic` | ✅ | implicit T2 | ✅ `Overall` | ✅ `TR` | ✅ `CC` | ✅ `LR` | ✅ `GRA` | ✅ `feedback` | ✖ | ✖ |
| TraTacXiMuoi/Ielts_writing_task1_academic (HF) | ✅ `subject` | ✅ `content` | T1 | ✅ | ◐ in eval | ◐ | ◐ | ◐ | ✅ `evaluation` | ✖ | ✅ image |
| hai2131/IELTS-essays-task-1 (HF) ★★ | ✅ `subject` | ✅ `content` | T1 | ✅ | ✅ score+desc | ✅ | ✅ | ✅ | ✅ split per-criterion | ✖ | ◐ id + caption |
| KevSun/IELTS_essay_scoring (HF model) | n/a (input) | input | n/a | ✅ output | ✅ | ✅ | ✅ (Vocab) | ✅ | ✖ | ✖ | ✖ |
| 123Harr/IELTS-WT2-LLaMa3-1k (HF) | ◐ in `formatted` | ◐ | T2 | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| duwuonline/task2_ielts (HF) | ✅ `question` | ✅ `paragraph` | T2 | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| jassiyu/ielts_writing_cleaned (HF) | ✖ | ✅ `essay` | ? | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| iamketan25/essay-instructions-dataset (HF) | ✅ `prompt` | ✅ `chosen` | n/a (generic) | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ | ✖ |
| Kaggle mazlumi/ielts-writing-scored-essays-dataset | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✖ | ✖ | ✖ |
| ELLIPSE Corpus | ✖ (29 prompts ID-only) | ✅ | ✖ | ✅ holistic | n/a | ✅ cohesion | ✅ vocab | ✅ grammar | ✖ | ✖ | ✖ |
| ASAP-AES (Kaggle 2012) | ✅ prompt id | ✅ | n/a | ✅ holistic | trait scores in ASAP++ | trait | trait | trait | ✖ | ✖ | ✖ |

★ = recommended schema for our project. ★★ = ideal granularity (per-criterion score *and* description).

## Implementation/tool feature comparison

| Project | Stack | Model(s) | Returns improved essay? | OCR? | Knowledge files? | License |
|---|---|---|---|---|---|---|
| chillestt/Automated-IELTS-essay-evaluation | Python/Jupyter | Mistral-7B / Llama2-7B / Gemma-7B (QLoRA + DPO) | ✖ | ✖ | ✖ | unspecified |
| Pouyaexe/IELTS-Writing-Examinier (IELTSEvaL) | Streamlit + LangChain | Google Gemini (PaLM) | ✖ | ✖ | ✅ encrypted JSON band descriptors | MIT |
| araloak/ieltsGPT | Python | GPT-4 | ✖ | ✖ | ◐ `/prompts` folder | unspecified |
| BaixuanLi/IELTS-Prompt | Pure prompt | Any GPT | ✅ side-by-side rewrite | ✖ | ✖ | unspecified |
| Logisx/DeepEssay | Flask + TF + HF + Azure | Fine-tuned BERT | ✖ | ✖ | ✖ | unspecified |
| lengvietcuong/examinai | Next.js 16 + Supabase | Fireworks AI (Vercel AI SDK) | ✅ corrected + improved | ✖ | ✅ RAG knowledge base | unspecified |
| ZainabZaman/IELTS_PracticeAndEvaluation | Python | OpenAI GPT-3.5 + Azure Speech | ✖ | ✖ | ✖ | unspecified |
| nhanluongoe/ielts-writing-buddy | Next.js 14 | Google Gemini Flash | ✅ "enhanced answer to target band" | ✖ | ✖ | MIT |
| elderbug0/IELTS.Examiner | Flask | OpenAI GPT-3.5 + EdenAI/Google Vision | ✅ model answer | ✅ handwritten | ✖ | unspecified |
| hung20gg/ielts_w2 | Jupyter | Llama 3 8B / Phi-3 / Phi-3-Vision | ✖ | ◐ vision for charts | ◐ tried RAG | unspecified |
| yosuke-homma/gpt-ielts | Rails + Docker | OpenAI | ✖ | ✖ | ✖ | unspecified |
| Arittra95/computer-based-ielts-writing-test-interface | HTML | none (UI clone) | ✖ | ✖ | ✖ | Apache-2.0 |

## Most common combined schema (recommendation)

Based on what works best across the highest-quality datasets:

```
{
  "id": "uuid",
  "task_type": "task1_academic" | "task1_general" | "task2",
  "prompt": "string",                 // the question
  "image_url": "string | null",       // for Task 1 only
  "image_caption": "string | null",   // describing the chart
  "essay": "string",
  "scores": {
    "task_response": 7.0,
    "coherence_cohesion": 7.5,
    "lexical_resource": 7.0,
    "grammatical_range_accuracy": 7.0,
    "overall": 7.0
  },
  "feedback": {
    "task_response": "...",
    "coherence_cohesion": "...",
    "lexical_resource": "...",
    "grammatical_range_accuracy": "...",
    "summary": "...",
    "improvements": ["...", "..."]
  },
  "corrections": [
    {"original": "...", "improved": "...", "reason": "..."}
  ],
  "rewrite_target_band_8": "string | null"
}
```

This is essentially `btnotpt/ielts_task_2` augmented with `hai2131`'s per-criterion descriptions and `nhanluongoe/ielts-writing-buddy`'s rewrite functionality.
