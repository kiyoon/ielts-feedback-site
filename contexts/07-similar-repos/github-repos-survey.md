# GitHub Repos — IELTS Writing Feedback / Scoring

Survey of 18+ notable repositories. Each entry covers what it does, what data/context they ship, scoring criteria, and useful insights for our project.

---

## 1. chillestt / Automated-IELTS-essay-evaluation

- **URL:** https://github.com/chillestt/Automated-IELTS-essay-evaluation
- **Stars / Activity:** 9 stars, 1 fork (Dec 2023 – Mar 2024)
- **Language:** Jupyter Notebook (99.4%) + Python
- **What it does:** Automated Writing Evaluation system for IELTS Task 2. Fine-tunes Mistral-7b, Llama-2-7b, and Gemma-7b with QLoRA on a curated essay corpus, then refines with DPO on preference data.
- **Data shipped:**
  - SFT: 9,000+ essays with real band scores + evaluation feedback (released as `chillies/IELTS-writing-task-2-evaluation`)
  - Preference: 768 essays with `chosen` / `rejected` feedback pairs (`chillies/IELTS_essay_human_feedback`)
- **Format:** CSV (HF auto-converts to Parquet)
- **Sources of data:** Web scraping + synthetic data generation via Gemini API, GPT-3.5-Turbo, and Groq
- **Models released:** `chillies/IELTS-fighter`, `chillies/DPO_ielts_fighter`, `chillies/mistral-7b-ielts-evaluator-q4`
- **Useful insights:** Demonstrates the "scrape + synthesize + DPO" pipeline. Confirms 4-criterion rubric is the de-facto standard. Their best-performing setup combines SFT + DPO.

## 2. chillies / IELTS-writing-task-2-evaluation (HF)

- **URL:** https://huggingface.co/datasets/chillies/IELTS-writing-task-2-evaluation
- **Format:** CSV (10,324 rows; 9,830 train / 491 test)
- **Schema:** `prompt`, `essay`, `evaluation`, `band` (e.g. "7.5", "<4")
- **Insight:** The most reused IELTS Task 2 dataset on Hugging Face. Evaluation field is a multi-paragraph rubric breakdown.

## 3. KevSun / IELTS_essay_scoring (HF model)

- **URL:** https://huggingface.co/KevSun/IELTS_essay_scoring
- **What it does:** Fine-tuned RoBERTa scoring IELTS essays on 5 dimensions
- **Training data:** 18,000 real IELTS essays with official human scores (largest seen)
- **Output:** `Task Achievement`, `Coherence and Cohesion`, `Vocabulary`, `Grammar`, `Overall` — each on 0–9 scale in 0.5 increments
- **Performance:** Accuracy 0.82, F1 0.81
- **Citation:** Sun & Wang (2024) ArXiv 2406.01198 "Automatic Essay Multi-dimensional Scoring with Fine-tuning and Multiple Regression"
- **Insight:** Confirms five-output regression is a viable formulation; scaffolding for our own labelling guidelines.

## 4. Logisx / DeepEssay

- **URL:** https://github.com/Logisx/DeepEssay
- **Stars:** 35
- **Language:** Python
- **What it does:** Web app (Flask + Azure) using BERT to predict IELTS essay band scores
- **Training data:** Kaggle `mazlumi/ielts-writing-scored-essays-dataset`
- **Models tested:** BERT-only, BERT + numerical features, BERT + numerical + binary features. Deployed simplest to minimize latency.
- **Stack:** Flask, TensorFlow, HuggingFace Transformers, Docker, Microsoft Azure
- **Insight:** Pragmatic deployment trade-off—accuracy vs. latency.

## 5. Pouyaexe / IELTS-Writing-Examinier (IELTSEvaL)

- **URL:** https://github.com/Pouyaexe/IELTS-Writing-Examinier
- **License:** MIT
- **Language:** Python (100%)
- **Stack:** Streamlit + LangChain + Google Gemini (PaLM)
- **What it ships:** Encrypted JSON files holding band descriptors for Academic Task 1, GT Task 1, Task 2 (the rubric is the "context" the LLM receives)
- **Criteria:** Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy
- **Insight:** Officially loads band descriptors as JSON knowledge files — strongly suggests our band-descriptor folder should also be JSON (not just markdown).

## 6. araloak / ieltsGPT

- **URL:** https://github.com/araloak/ieltsGPT
- **Language:** Python (98.7%) + batchfile
- **What it does:** Wraps GPT-4 to evaluate IELTS / TOEFL writing tasks
- **Prompt assets:** `/prompts` folder containing per-task templates (separate IELTS vs. TOEFL); output is markdown `feedback.md`, convertible to .docx via `md2doc.bat`
- **Insight:** Markdown-as-feedback-format is a recurring pattern; persisting feedback as both markdown (review) and docx (delivery) is sensible.

## 7. BaixuanLi / IELTS-Prompt

- **URL:** https://github.com/BaixuanLi/IELTS-Prompt
- **Stars:** 40 (5 forks)
- **What it ships:** Pure-prompt repo (no model). Three distinct prompt segments: (a) Role definition, (b) Scoring framework w/ Task 1 = 1/3, Task 2 = 2/3 weighting, (c) Action/response guidance.
- **Side-by-side revisions:** Output uses Markdown 2-column comparison
- **Insight:** Best example of how to structure a multi-section IELTS examiner prompt. Verbatim text in `prompt-templates-from-repos.md`.

## 8. lengvietcuong / examinai

- **URL:** https://github.com/lengvietcuong/examinai
- **Stars:** 14 | **Language:** TypeScript
- **Stack:** Next.js 16 + React 19 + Vercel AI SDK v6, Fireworks AI, Deepgram TTS, Supabase + Drizzle ORM
- **Features:** Timed Writing Task 1 & 2 with multi-expert AI feedback (TR, CC, LR, GRA), corrected + improved essays, AI Speaking examiner, IELTS knowledge RAG assistant
- **Live:** examinai.vercel.app
- **Insight:** "Multi-expert" approach (one LLM call per criterion?) and "improved essay" output are design patterns worth considering.

## 9. ZainabZaman / IELTS_PracticeAndEvaluation

- **URL:** https://github.com/ZainabZaman/IELTS_PracticeAndEvaluation
- **Stars:** 26 | **Language:** Python
- **Scope:** All four IELTS modules (L/R/W/S)
- **Writing returns:** Task achievement, coherence/cohesion, lexical resource, grammar; threshold of 10 entries per user before band emitted
- **Image task evaluation:** relevancy_score, grammar_errors, grammar_correctness_score, lexical_diversity_score
- **Stack:** OpenAI GPT-3.5-turbo + Azure Speech SDK
- **Insight:** Their image-task fields suggest using a vision model for Task 1 chart/graph relevancy is feasible.

## 10. nhanluongoe / ielts-writing-buddy

- **URL:** https://github.com/nhanluongoe/ielts-writing-buddy
- **Stars:** 8 | **License:** MIT
- **Language:** TypeScript (Next.js 14, TanStack Form, Tailwind)
- **AI:** Google Gemini Flash
- **Features:** Generates Task 1/2 answers, suggests improvements, estimates band, produces "enhanced answer toward target score"
- **Insight:** "Score targeting" feature (rewrite to hit Band 7.5) is an interesting product angle.

## 11. elderbug0 / IELTS.Examiner

- **URL:** https://github.com/elderbug0/IELTS.Examiner
- **Stack:** OpenAI GPT-3.5 Turbo + EdenAI OCR + Google Vision OCR + spell-check
- **Features:** Auto band score, model answer generation, improvement suggestions
- **Insight:** OCR-from-handwritten-essay is an underused but useful UX feature.

## 12. hung20gg / ielts_w2

- **URL:** https://github.com/hung20gg/ielts_w2
- **Language:** Jupyter Notebook (99.2%)
- **Models:** Llama 3 8B, Phi-3-Small 7B, Phi-3-Vision (for Task 1 charts)
- **Architecture:** Multi-agent — separate agents for Task 1 / Task 2; self-understanding & self-correction loops; tried RAG + chain-of-thought
- **Repo layout:** `data/`, `legacy/`, `prompt/`, `sample/`, `test_infer/`, `utils/`, plus `agent.py`, `writing.py`, `writing_task_1.py`
- **Reported correlation (Task 2):** ChatGPT 3.5 = 0.46–0.70 vs. their model = 0.25–0.31 (still below ChatGPT)
- **Insight:** Confirms ChatGPT/GPT-4-class models still beat tuned 7B models out of the box on this task.

## 13. yosuke-homma / gpt-ielts

- **URL:** https://github.com/yosuke-homma/gpt-ielts
- **Stack:** Ruby on Rails + Docker + OpenAI API
- **Scope:** Writing Task 2 only
- **Insight:** Rare non-Python implementation; useful as proof-of-concept for any web stack.

## 14. Arittra95 / computer-based-ielts-writing-test-interface

- **URL:** https://github.com/Arittra95/computer-based-ielts-writing-test-interface
- **License:** Apache-2.0
- **Language:** HTML 100%
- **Features:** Faithful clone of IDP/British Council computer-delivered exam UI (split-screen, 60-minute timer, no autocorrect, word counter)
- **Insight:** Good reference if we want a "real exam conditions" practice mode.

## 15. sunnypranay / ielts-writing-text-editor

- **URL:** https://github.com/sunnypranay/ielts-writing-text-editor (8 stars)
- **Language:** CSS / JS
- **Features:** Timer, word count, disabled autocorrect, Grammarly extension support
- **Insight:** Lightweight cousin of #14.

## 16. langkhachhoha / JihanBot_Ielts

- **URL:** https://github.com/langkhachhoha/JihanBot_Ielts (2 stars)
- **Language:** Python
- **Stack:** LangGraph (agentic flow)
- **Features:** Generate essays + extract vocabulary and collocations
- **Insight:** Notable for using a graph/agent framework rather than monolithic prompts.

## 17. nusnlp / nea — Neural Essay Assessor (broad AES, not IELTS-only)

- **URL:** https://github.com/nusnlp/nea
- **License:** GPL v3
- **Architecture:** CNN + GRU/LSTM
- **Dataset:** Hewlett ASAP-AES `training_set_rel3.tsv`, 5-fold CV
- **Citation:** Taghipour & Ng 2016
- **Insight:** Foundational baseline for any AES system. Useful if we want a non-LLM scoring head as a backup.

## 18. sankalpjain99 / Automatic-Essay-Scoring (broad AES)

- **URL:** https://github.com/sankalpjain99/Automatic-Essay-Scoring
- **Dataset:** Kaggle ASAP
- **Pipeline:** TF-IDF / CountVectorizer + Linear Reg / SVR / RF, then Word2Vec + 2× LSTM (300→64) + Dense
- **Insight:** Shows ML baselines. Largely outclassed by transformer methods now.

## 19. siyuanzhao / automated-essay-grading (broad AES)

- **URL:** https://github.com/siyuanzhao/automated-essay-grading (121 stars)
- **What it does:** Memory-Augmented Neural Model for AES (paper implementation). GloVe + memory net.
- **Insight:** Memory-augmented architectures over typical LSTM — possibly relevant if we explore retrieval-conditioned scoring.

## 20. scrosseye / ELLIPSE-Corpus (academic, not IELTS but adjacent)

- **URL:** https://github.com/scrosseye/ELLIPSE-Corpus
- **License:** CC BY-NC-SA 4.0
- **Data:** ~6,500 essays (ELL writers grades 8–12), six analytic dimensions: cohesion, syntax, vocabulary, phraseology, grammar, conventions + overall + demographics
- **Insight:** Different rubric structure (six analytic + holistic) but same essay-AES paradigm. Would be useful for transfer learning.

---

## Other repos noted but lower priority

- **shah0150/awesome-IELTS** (curated list, no AI/data)
- **ucatal/awesome-ielts** (similar curated list)
- **hefengxian/my-ielts** (1.9k stars, Vue, prep materials, no AI)
- **tim-hub/ielts-notes** (Markdown notes, Chinese)
- **Brandon-HY-Lin/ielts_statistics** (demographic t-SNE, no essay data)
- **Hazrat-Ali9/IELTS-Grammar** (grammar lessons, JS)
- **Hazrat-Ali9/Oxford-Cambridge-IELTS** (textbook materials)
