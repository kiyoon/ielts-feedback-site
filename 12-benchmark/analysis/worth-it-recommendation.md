# Worth-it recommendation

_Final read: how many iterations of LLM refinement actually pay for themselves?_

We define an iteration as **worth-it** if at least one of the following still holds:

- The Overall band score *changes* relative to the previous iteration.
- The iteration introduces **≥2 newly cited corpus files**.
- The Top-10 rewrite list overlaps the prior list by **less than 50%** (Jaccard < 0.5 on essay-span fingerprints).

Anything else is a paraphrase pass.

## task1

- Score plateau signal: iter 1 — Overall band first stays flat for 3 in a row.
- Jaccard plateau (≥0.60 sustained for 3): iter 4.
- Citation-churn plateau (≤1 new cite for 3 in a row): iter 7.
- Cumulative-citations freeze (no growth for 3 in a row): iter 8.
- Last iteration that still moved the needle (per the rule above): iter **47**.
- Iterations classed as worth-it: [1, 2, 4, 5, 6, 9, 10, 11, 14, 15, 16, 19, 25, 26, 27, 28, 32, 33, 34, 35, 37, 39, 40, 41, 42, 44, 46, 47].

**Recommendation for task1: stop after iter ~7.** Beyond that, iterations only shuffle equivalent phrasings and add no new corpus material; the Overall band freezes at 6.0 from iter 1; the only post-plateau variation is claude scoring GRA at 5.5 vs codex at 6.0 (both still round to Overall 6.0).

- Iters 1–5: **substantive** — band calibration, first-cycle corpus discovery, headline rewrites identified.
- Iters 6–7: **incremental** — minor sharpening, alternative phrasings, occasional new corpus citations.
- Iters 8–49: **redundant** — Jaccard sustained around 0.4–0.7, no new citations, scores frozen. Safe to skip.

## task2

- Score plateau signal: iter 8 — Overall band first stays flat for 3 in a row.
- Jaccard plateau (≥0.60 sustained for 3): iter 35.
- Citation-churn plateau (≤1 new cite for 3 in a row): iter 7.
- Cumulative-citations freeze (no growth for 3 in a row): iter 6.
- Last iteration that still moved the needle (per the rule above): iter **47**.
- Iterations classed as worth-it: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33, 35, 37, 45, 47].

**Recommendation for task2: stop after iter ~7.** Beyond that, iterations only shuffle equivalent phrasings and add no new corpus material; the Overall band oscillates 6.0/6.5 with the tool, not with refinement progress; codex and claude disagree on LR (7 vs 6).

- Iters 1–5: **substantive** — band calibration, first-cycle corpus discovery, headline rewrites identified.
- Iters 6–7: **incremental** — minor sharpening, alternative phrasings, occasional new corpus citations.
- Iters 8–49: **redundant** — Jaccard sustained around 0.4–0.7, no new citations, scores frozen. Safe to skip.

## Cross-task headline

Both tasks plateau early, but for *different reasons*:

- **Task 1**: the Overall band freezes at 6.0 from iter 1 onwards — the two tools agree on the score, and the only remaining variation is claude routinely scoring GRA half a band lower than codex (which still rounds to Overall 6.0). Citation churn dies by iter ~7. Anything past iter ~7 is paraphrase noise.
- **Task 2**: codex and claude *disagree* on Overall by half a band (codex 6.5, claude 6.0) because of LR. The chain therefore looks unstable, but each tool individually has converged within its first few iterations. The 'right' move on task 2 is not more iterations — it is to break the LR tie deliberately.

Practical operational guidance:

- Run **5 iterations** if you want a thorough first-pass + sanity check.
- Run **8 iterations** if you also want to be sure citations have stopped growing.
- Anything beyond **10–12 iterations** is wasted compute on this candidate set.