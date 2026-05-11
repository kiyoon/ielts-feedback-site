# 07 — Source Reliability Summary

This document rolls up audit verdicts per source domain so users can apply appropriate skepticism. The earlier discussion classified sources into three tiers; this audit confirms that classification with one refinement.

## Methodology

- "Audited samples" means real candidate samples (not composites, not Band 9 models, not 404'd entries) where the audit returned a verdict.
- "Broadly accurate" includes both High and Medium confidence.
- "Questionable / inflated" combines all flag categories from `06-flagged-samples.md` except composite/non-real-sample entries.

Counts are approximate — some samples fall into multiple flag categories.

---

## Per-source audit results

### British Council Sample Scripts

| Audited samples | Broadly accurate | Questionable / inflated |
|---|---|---|
| 3 | 3 | 0 |

**Verdict:** Tier 1 confirmed. Certified examiner ratings; commentary is verbatim from British Council. Best calibration anchors in the dataset for Band 5 and Band 6. The handwritten transcription artefact is the only minor caveat.

---

### IELTS Liz / ieltsliz.com

| Audited samples | Broadly accurate | Questionable / inflated |
|---|---|---|
| 4 | 4 | 0 |

**Verdict:** Tier 1 confirmed. All entries are explicit Band 9 models, not candidate writing. They are excellent anchors **for Band 9** but should not be used to define Band 7. The repo's labelling sometimes places these models inside Band 7 files, which can confuse users.

---

### IELTS Advantage / ieltsadvantage.com

| Audited samples | Broadly accurate | Questionable / inflated |
|---|---|---|
| 3 | 3 | 0 |

**Verdict:** Tier 1 confirmed. Same caveat as ieltsliz: explicit Band 8/9 models used as Band 7+ targets. Calibration is correct relative to claimed band.

---

### ieltspodcast.com

| Audited samples | Broadly accurate | Questionable / inflated |
|---|---|---|
| 2 | 2 | 0 |

**Verdict:** Tier 1 confirmed. Ex-examiner reviewed; documents the precise upgrade pathway between bands. Useful for diagnostic teaching.

---

### ieltsbuddy.com

| Audited samples | Broadly accurate | Questionable / inflated | Likely deflated |
|---|---|---|---|
| 5 | 4 | 0 | 1 (Improved Medical Care) |

**Verdict:** Tier 2 confirmed. Per-criterion scores are sensible; commentary is examiner-styled. The "Improved Medical Care" sample is mis-labelled at Band 6 when descriptor evidence supports 6.5 — a rare deflation. Other samples are well-calibrated. Very usable.

---

### ieltsfocus.com

| Audited samples | Broadly accurate | Questionable / inflated |
|---|---|---|
| 1 | 1 | 0 |

**Verdict:** Tier 2 confirmed. Limited dataset (only one sample) but the calibration was honest.

---

### ieltschamp.com

| Audited samples | Broadly accurate | Questionable / inflated |
|---|---|---|
| 2 | 2 | 0 |

**Verdict:** Tier 2 confirmed. Per-criterion scores match descriptors; commentary points to specific gaps. Small sample size in this dataset.

---

### ieltsjuice.com

| Audited samples | Broadly accurate | Questionable / inflated |
|---|---|---|
| 6 | 6 | 0 |

**Verdict:** Tier 2 confirmed. **Best Tier-2 source in the dataset.** Per-criterion scores are sensible across multiple bands; documents specific error inventories that map cleanly to descriptors; provides paired Band 5.5 → Band 7+ rewrites. Highly usable.

---

### writing9.com

| Audited samples | Broadly accurate (overall) | Per-criterion incoherent | Likely inflated overall |
|---|---|---|---|
| ~14 | ~10 (overall) | ~11 | 2 (UK shop closures, Faulty WFH) |

**Verdict:** Tier 3 confirmed (with refinement).

- **Overall band labels** from writing9 are usually within ±0.5 of descriptor evidence. Rough trust at the overall level: ~70%.
- **Per-criterion sub-scores** are systematically broken. The recurring pattern TA=9 / CC=9 / LR=4 / GRA=4 with overall 6.0 is mathematically possible (average 6.5) but the criteria are clearly not independent — strong scores on TA inflate when grammar errors are heavy.
- **Specific recurring artefact:** writing9 awards LR=9 / GRA=9 to short, error-flagged letters and never seems to award LR or GRA scores between 5 and 7.

**Refined recommendation:** Treat writing9 **overall** as a soft guide; **discard per-criterion** sub-scores entirely when teaching descriptors. Apply a 0.5-band haircut as a default skepticism stance.

---

### engnovate.com

| Audited samples | Broadly accurate | Likely inflated | Heavily inflated |
|---|---|---|---|
| ~30 | ~22 | ~7 | 0 |

**Verdict:** Tier 3 confirmed but **better than writing9 at per-criterion**.

- **TR sub-scores are systematically generous** by 0.5–1.0. The pattern TR=8 on essays with garbled clauses (Streaming Services) or TR=6.5 on Band-5 essays with mismatched format (Cooperation vs Competition) is consistent.
- **GRA sub-scores are fairly honest** — engnovate gives 3.5–6 to error-heavy essays, which is descriptor-appropriate.
- **LR sub-scores are roughly honest** — typically 5–7.
- **Overall labels** are within ±0.5 of descriptor evidence ~75% of the time.
- **Examples and statistics in Band 7+ samples are concrete** (Forbes 2011, Earth Hour, COVID-19) — engnovate Band 7+ samples are the strongest writing in the dataset for that range.

**Refined recommendation:** Treat engnovate overall as a soft guide; apply skepticism to TR sub-score specifically. The Band 7.0 and Band 7.5 engnovate samples are largely well-calibrated and form the bulk of the calibration exemplars in `05-calibration-exemplars.md`.

---

### paramountielts.com

| Audited samples | Broadly accurate | Questionable / inflated |
|---|---|---|
| 1 (text not reproduced) | — | — |

**Verdict:** Insufficient data. Limited to one summarised sample; cannot tier confidently. Treat as Tier 2/3 unsure.

---

## Refined source-tier classification

| Tier | Sources | Trust level (overall) | Trust level (per-criterion) | Use as |
|---|---|---|---|---|
| **1** | British Council, IELTS Liz, IELTS Advantage, ieltspodcast | High | High where given | Calibration anchors; descriptor teaching |
| **2** | ieltsbuddy, ieltsfocus, ieltschamp, ieltsjuice | Medium-High | Medium | Calibration anchors with second-opinion check |
| **3a** | engnovate | Medium | Medium-Low (TR generous) | Volume of examples; apply 0.5 haircut on TR |
| **3b** | writing9 | Low-Medium | **Discard** | Volume only; ignore per-criterion entirely |

The earlier classification correctly identified writing9 and engnovate as Tier 3, but engnovate is meaningfully better than writing9 at the per-criterion level and should be treated as 3a vs 3b.

---

## Per-band trust roll-up

Combining all sources, here is the audit's verdict on per-band reliability of the sample files:

### Task 2

| Band | Real samples | Trust score |
|---|---|---|
| 5 / 5.5 | 8 | High — British Council anchors are gold; engnovate inflation on TR is documented |
| 6.0 | ~12 | High — ieltsbuddy/British Council/engnovate samples mostly honest |
| 6.5 | ~6 | Medium — Streaming Services is mis-claimed; rest honest |
| 7.0 | ~11 | High — engnovate Band 7 samples are the strongest in the dataset |
| 7.5 | 7 | High — most samples are well-calibrated; one (Tech & Environment) reads upper-7 |

### Task 1 Academic

| Band | Real samples | Trust score |
|---|---|---|
| 5.5 | ~3 (rest composite) | Medium — small real-sample base |
| 6.0 | ~9 | Medium — overall labels OK, per-criterion broken |
| 6.5 | ~7 | Medium-Low — multiple writing9 entries with broken per-criterion; one heavy-inflation outlier |
| 7.0 | ~3 (rest models or composites) | Medium — real candidate samples are few; Band 9 models dominate |

### Task 1 General Training

| Band | Real samples | Trust score |
|---|---|---|
| 5.5 | 1 (rest composite) | Low — only 1 real sample auditable |
| 6.0 | ~3 (rest composite) | Medium — real samples honest |
| 6.5 | ~4 (rest composite) | High — best-calibrated GT band |
| 7.0 | ~3 (rest models or composites) | Medium — real candidate samples are few; Band 8/9 models dominate |

---

## Top-line guidance for an LLM marker

1. **Anchor primarily on Tier 1 sources** (British Council, IELTS Liz, IELTS Advantage, ieltspodcast) — these are the safest descriptor-aligned anchors.
2. **Use Tier 2 sources** (ieltsbuddy, ieltsjuice, ieltschamp, ieltsfocus) as second-tier anchors with light skepticism.
3. **Use engnovate Band 7.0 / 7.5 samples** as anchors for those specific bands — they are the strongest body of writing in the dataset at that level. **Discount engnovate TR sub-scores** by 0.5.
4. **Discount writing9 per-criterion sub-scores entirely.** Use only the overall band, and even then apply a 0.5 skepticism haircut on samples flagged in `06-flagged-samples.md`.
5. **Treat the GT Band 5.5 file with caution** — almost all entries are composite illustrations, not real candidate writing.
6. **Treat Band 7.0 file entries that come from ieltsliz / ieltsadvantage as Band 9 models, not Band 7 anchors.** This is true in both Task 1 Academic and GT.
