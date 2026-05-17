# Public IELTS Writing Datasets — Catalogue

All datasets discovered across HuggingFace, Kaggle, and GitHub during research. Schemas captured verbatim where the dataset card or viewer was accessible.

---

## Hugging Face datasets

### 1. chillies/IELTS-writing-task-2-evaluation ★ (most reused)

- **URL:** https://huggingface.co/datasets/chillies/IELTS-writing-task-2-evaluation
- **Rows:** 10,324 (train 9,830 / test 491). 46.7 MB. Format CSV (auto-Parquet).
- **Splits:** train, test
- **License:** Not specified
- **Schema:**
  ```
  prompt:     string  (68–493 chars)         # IELTS Task 2 question
  essay:      string  (6–12.3k chars)        # student response
  evaluation: string  (689–9.3k chars)       # multi-paragraph rubric breakdown
  band:       string  (252 unique values)    # "7.5", "5.0", "<4", "8.5", ...
  ```
- **Sample row (truncated):**
  ```
  prompt:  "Interviews form the basic criteria for most large companies..."
  essay:   "It is believed by some experts that the traditional approach..."
  evaluation: "**Task Achievement: [7]** The essay effectively addresses..."
  band:    "7.5"
  ```
- **Notes:** Evaluation strings include nested rubric scores in [brackets]. The single `band` field is overall.

### 2. chillies/IELTS_essay_human_feedback (DPO-style)

- **URL:** https://huggingface.co/datasets/chillies/IELTS_essay_human_feedback
- **Rows:** 1,762 — single test split. CSV/Parquet.
- **Schema:**
  ```
  prompt:   string  (13–579 chars)
  essay:    string  (314–3.5k chars)
  chosen:   string  (1–7.41k chars)   # higher-quality feedback
  rejected: string  (325–8.43k chars) # lower-quality feedback
  ```
- **Use:** preference learning / DPO; pairs two competing critiques per essay.

### 3. chillies/DPO_ielts_writing

- **URL:** https://huggingface.co/datasets/chillies/DPO_ielts_writing
- **Rows:** 768
- **Use:** Direct Preference Optimization training data.

### 4. btnotpt/ielts_task_2 ★ (best schema)

- **URL:** https://huggingface.co/datasets/btnotpt/ielts_task_2
- **Rows:** 10,200 (train 8,180 / test 2,040). 17.9 MB.
- **License:** Apache 2.0
- **Format:** Parquet
- **Schema:**
  ```
  topic:    string  (6–1000 chars)
  essay:    string  (405–8,860 chars)
  TR:       float64  # Task Response (Band 5–9)
  CC:       float64  # Coherence & Cohesion
  LR:       float64  # Lexical Resource
  GRA:      float64  # Grammatical Range & Accuracy
  Overall:  float64
  feedback: string  (119–2,380 chars)
  ```
- **Why notable:** First-class numeric sub-band columns *plus* a feedback string. Best target schema for our own corpus.
- **Sample row:**
  ```
  topic:   "Finding job satisfaction is considered luxury in some developing countries..."
  essay:   "Finding an ideal job and being contended with the it is every individual's need..."
  TR: 8.0  CC: 8.0  LR: 8.0  GRA: 8.0  Overall: 8.0
  feedback:"Task Response: Band 8.0 - Addresses both questions clearly..."
  ```

### 5. TraTacXiMuoi/Ielts_writing_task1_academic ★ (Task 1, with images)

- **URL:** https://huggingface.co/datasets/TraTacXiMuoi/Ielts_writing_task1_academic
- **Rows:** 13,900 (train 11,100 / val 1,390 / test 1,390)
- **Format:** Parquet (multi-modal: image + text)
- **Schema:**
  ```
  topic:               stringclasses (7 values: Line Graph, Bar Chart,
                        Pie Chart, Table, Map, Process Diagram, Multiple Graphs)
  subject:             stringclasses (329 values)
  image:               image (225×512 px)
  content:             string (491–2.89k chars)
  overall_band_score:  stringclasses (11 values, 4–9)
  evaluation:          string (408–2.2k chars)
  ```
- **Notes:** Rare dataset that includes the actual chart image, not just a text description. Excellent for vision-language models.

### 6. hai2131/IELTS-essays-task-1 ★ (Task 1, fully decomposed scores)

- **URL:** https://huggingface.co/datasets/hai2131/IELTS-essays-task-1
- **Rows:** 13,900 (single train split). Parquet.
- **Schema:**
  ```
  topic:                                  stringclasses (7 values)
  subject:                                stringclasses (329 values)
  image:                                  stringclasses (340 values)
  image_description:                      stringclasses (340 values)
  content:                                string  (491–2,890 chars)
  overall_band_score:                     stringclasses (11 values)
  task_response_score:                    stringclasses (11 values)
  task_response_description:              string
  coherence_cohesion_score:               stringclasses (13 values)
  coherence_cohesion_description:         string
  lexical_resource_score:                 stringclasses (13 values)
  lexical_resource_description:           string
  grammatical_range_accuracy_score:       stringclasses (13 values)
  grammatical_range_accuracy_description: string
  ```
- **Notes:** Most granular schema seen — each criterion has its own score *and* description. Closest match to formal IELTS public band descriptors.

### 7. 123Harr/IELTS-WT2-LLaMa3-1k

- **URL:** https://huggingface.co/datasets/123Harr/IELTS-WT2-LLaMa3-1k
- **Rows:** 1,000. 4.78 MB. CSV/Parquet.
- **Schema:** Single column `formatted` (length 2.54k–8.82k chars)
- **Format:** Pre-rendered LLaMa3 chat template:
  ```
  <|begin_of_text|><|start_header_id|>system<|end_header_id|>
  You are an IELTS exam examiner expert.<|eot_id|>
  <|start_header_id|>user<|end_header_id|>
  [IELTS Writing Task 2 Prompt]<|eot_id|>
  ```
- **Source:** Reformatted from `chillies/IELTS-writing-task-2-evaluation`.

### 8. duwuonline/task2_ielts

- **URL:** https://huggingface.co/datasets/duwuonline/task2_ielts
- **Rows:** 1,912. CSV/Parquet.
- **Schema:** `Unnamed: 0` (int), `question` (string 6–449), `paragraph` (string 66–4,270)
- **Notes:** Mixed-quality, includes some Task-1 style entries despite filename.

### 9. duwuonline/ielts_science1_v1 / v2

- **Rows:** 73.9k (v1), 242k (v2). Heavier, science-themed content.

### 10. iamketan25/essay-instructions-dataset

- **URL:** https://huggingface.co/datasets/iamketan25/essay-instructions-dataset
- **Rows:** 2,064 (train 1,864 / test 207). 11.9 MB. Parquet.
- **Schema:** `prompt` (134–1450), `chosen` (925–129k chars), `__index_level_0__` (int)
- **Notes:** Generic essay instruction-tuning, not IELTS-specific. Useful for instruction-following.

### 11. jassiyu/ielts_writing_cleaned

- **URL:** https://huggingface.co/datasets/jassiyu/ielts_writing_cleaned
- **Rows:** 541. Single column `essay` (1.43k–2.93k chars). 509 kB.
- **Notes:** Just essays, no scores.

### 12. binhng/scoring_ielts_dataset_v1 / v2

- **Rows:** 4,360 each.
- **Use:** Scoring dataset (schema not enumerated in research, treat as moderate-quality alternative to chillies).

### 13. mshojaei77/ielts-practice-sentences

- **Rows:** 45,700. Sentence-level rather than essay-level.

### 14. lijinyang0226/IELTS_dataset_5000_v2

- **Rows:** 5,000.

### 15. vietanh0802/ielts_writing_task_2_mismatches_filtered

- **Rows:** 9,660. Filtered by score-feedback mismatch. Possibly useful for noise removal experiments.

### 16. NicholasHuang/ieltsmaptask

- **Rows:** 2,190.

### 17. karanzrk/ielts

- **Rows:** 1,440. Generic.

### 18. qwertyuiopasdfg/IELTs-Speaking-answer

- **Rows:** 216. (Speaking, not writing — listed for completeness.)

---

## Kaggle datasets

### K1. mazlumi / IELTS Writing Scored Essays Dataset ★ (most reused on GitHub)

- **URL:** https://www.kaggle.com/datasets/mazlumi/ielts-writing-scored-essays-dataset
- **Title:** "A Comprehensive Dataset for IELTS Writing Tasks: Sample Essays and Scores"
- **Used by:** Logisx/DeepEssay, several Kaggle notebooks (e.g. `logisx/ielts-grading-with-bert`, `shefiyyahaurellia/ielts-score-prediction-from-writing-0-86-val-mse`)
- **Schema (per typical use):** essay text, band score, task type (1 or 2), per-criterion scores
- **License:** Check Kaggle page directly.

### K2. japkeeratsingh / ielts-writing

- **URL:** https://www.kaggle.com/datasets/japkeeratsingh/ielts-writing
- **Notes:** Schema not retrievable via public crawler — Kaggle page requires login.

### K3. zakirkhanaleemi / IELTS Success Stories Dataset

- **URL:** https://www.kaggle.com/datasets/zakirkhanaleemi/ielts-success-stories-dataset
- **Notes:** Test-taker narratives, not essay scoring.

### K4. davidcrawell / Writing a Strong IELTS Dissertation

- **URL:** https://www.kaggle.com/datasets/davidcrawell/writing-a-strong-ielts-dissertation
- **Notes:** Dissertation-style guidance text.

---

## Adjacent / non-IELTS academic datasets

### A1. ASAP — Hewlett Foundation Automated Student Assessment Prize (Kaggle 2012)

- Most-used essay-scoring dataset overall (not IELTS, English learner essays). 8 prompt sets.
- File: `training_set_rel3.tsv`
- Used by `nusnlp/nea`, `sankalpjain99/Automatic-Essay-Scoring`, `Turanga1/Automated-Essay-Scoring`, etc.

### A2. ASAP++

- **URL:** https://lwsam.github.io/ASAP++/
- Adds attribute-specific (trait) scores on top of holistic ASAP scores.

### A3. ELLIPSE Corpus (scrosseye/ELLIPSE-Corpus)

- **License:** CC BY-NC-SA 4.0
- **Rows:** ~6,500 essays final, ~9,000 raw with rater-level scores
- **Schema:** essay + holistic score + analytic scores (cohesion, syntax, vocabulary, phraseology, grammar, conventions) + demographics (economic status, gender, grade 8–12, race/ethnicity)
- **Files:** `ELLIPSE_Final_github_train.csv`; test/raw zips password-protected (`ellipse_test`, `ellipse_raw_data`)
- **Citation:** Crossley et al. 2023, *Int. J. of Learner Corpus Research*

### A4. Feedback Prize (Kaggle, Learning Agency Lab)

- **URL:** https://the-learning-agency-lab.com/the-feedback-prize-overview/
- ELL writers' essays with proficiency scores. Strong overlap with ELLIPSE schema.

---

## Aggregate observations

- Most popular schema: `(prompt | topic, essay, band)` plus optional 4 sub-bands `TR / CC / LR / GRA` and optional `feedback` text.
- Public band-score distribution is skewed; many datasets carry `<4` and rare `8.5/9.0` entries (long tail).
- Image-bearing datasets are rare. Only `TraTacXiMuoi/Ielts_writing_task1_academic` and `hai2131/IELTS-essays-task-1` carry chart images (or descriptions).
- License clarity is poor: most HF datasets have no license field. ELLIPSE is the main one with explicit CC.
