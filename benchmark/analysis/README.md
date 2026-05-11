# Convergence analysis — IELTS feedback iteration chain

_Source: `benchmark/results/{task1,task2}/` (50 + 42 markdown files), `benchmark/logs/`._

## Contents

1. [`task1-trajectory.md`](task1-trajectory.md) — per-iteration metrics for task 1.
2. [`task2-trajectory.md`](task2-trajectory.md) — per-iteration metrics for task 2.
3. [`convergence-findings.md`](convergence-findings.md) — when did refinement plateau?
4. [`citations-analysis.md`](citations-analysis.md) — which corpus files are most cited.
5. [`worth-it-recommendation.md`](worth-it-recommendation.md) — recommended stopping iteration.
6. [`charts.md`](charts.md) — ASCII / sparkline charts of the four headline series.
7. [`raw-metrics.json`](raw-metrics.json) — every metric per iteration, machine-readable.

## Executive summary

### Task 1 (Academic chart)
- Iterations parsed: **49** (plus baseline iter 0).
- Score plateau (Overall band stable ≥3 in a row): iter **1**.
- Jaccard ≥ 0.6 sustained: iter **4**; ≥ 0.8 sustained: **None**.
- Citation-churn near zero: iter **7**.
- Self-reported verdict distribution: {'UNKNOWN': 5, 'REFINING': 45}.
- Tool latency: codex avg 4.3 min, claude avg 75s; chain total 2.30 h.

### Task 2 (essay)
- Iterations parsed: **41** (plus baseline iter 0).
- Score plateau (Overall band stable ≥3 in a row): iter **8**.
- Jaccard ≥ 0.6 sustained: iter **35**; ≥ 0.8 sustained: **None**.
- Citation-churn near zero: iter **7**.
- Self-reported verdict distribution: {'UNKNOWN': 1, 'REFINING': 41}.
- Tool latency: codex avg 4.5 min, claude avg 2.6 min; chain total 2.58 h.

## Headline verdict

- **Task 1**: stop after iter **7**. Beyond that, the chain shuffles phrasings without changing scores or surfacing new corpus material.
- **Task 2**: stop after iter **7**. Same pattern; the chain is essentially looping on the same Top-10 by then.
- Both tasks behave similarly: the band score froze almost immediately, the rewrite set stabilises within a handful of iterations, and the agents *self-report* `REFINING` indefinitely (the prompt discouraged declaring CONVERGED without an explicit prior, so the verdict should not be trusted).
