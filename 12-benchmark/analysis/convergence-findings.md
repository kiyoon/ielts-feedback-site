# Convergence findings

_When does refinement plateau?_

## task1

- Iterations parsed: **49** (plus baseline iter 0).
- First iteration where Overall band is stable for ≥3 in a row: **iter 1**.
- First iteration where Jaccard(rewrites) ≥ 0.80 for ≥3 in a row: **never reached at 0.8**.
- (Looser: Jaccard ≥ 0.60 for ≥3 in a row first hit at: **iter 4**.)
- Same-tool Jaccard ≥ 0.60 sustained from: **iter 5** (comparing each iter to the previous iter from the *same* tool removes codex↔claude churn).
- Citation churn first runs ≤1 new citation/iter for ≥3 in a row at: **iter 7**.
- Convergence verdicts (parsed from the markdown): {'UNKNOWN': 5, 'REFINING': 45}.
- Latency (mean wall-clock per iteration): codex 4.3 min, claude 75s.
- Total wall-clock for the chain: 2.30 h.

## task2

- Iterations parsed: **41** (plus baseline iter 0).
- First iteration where Overall band is stable for ≥3 in a row: **iter 8**.
- First iteration where Jaccard(rewrites) ≥ 0.80 for ≥3 in a row: **never reached at 0.8**.
- (Looser: Jaccard ≥ 0.60 for ≥3 in a row first hit at: **iter 35**.)
- Same-tool Jaccard ≥ 0.60 sustained from: **iter 3** (comparing each iter to the previous iter from the *same* tool removes codex↔claude churn).
- Citation churn first runs ≤1 new citation/iter for ≥3 in a row at: **iter 7**.
- Convergence verdicts (parsed from the markdown): {'UNKNOWN': 1, 'REFINING': 41}.
- Latency (mean wall-clock per iteration): codex 4.5 min, claude 2.6 min.
- Total wall-clock for the chain: 2.58 h.

## Caveats

1. **Every iteration self-reports `REFINING`.** The agents' own `CONVERGENCE` line is a poor signal here because each iteration treats the prior chain as effectively empty (the iter ≥5 prompt feeds the agent depth-3 prior chains, but the agents nonetheless write "no prior feedback was supplied" or treat each pass as a fresh calibration). We therefore rely on quantitative similarity (Jaccard on rewrites, citation churn, score stability) rather than the self-reported verdict.
2. **Tool oscillation dominates the late-stage signal.** codex and claude alternate on every iteration, and they disagree on the same script: in task 1, claude tends to score GRA at 5.5 while codex scores it at 6.0; in task 2, codex scores LR at 7.0 (overall 6.5) while claude scores LR at 6.0 (overall 6.0). The 'plateau iteration' for the *combined* series can look unstable when in fact each tool has already individually converged. The same-tool Jaccard plateau in the table above isolates this effect.
3. **Iter 34 (task 1, claude) was truncated by the harness** — the markdown contains a literal `<truncated 26797 chars>` placeholder where the score table and rewrites should be. That iteration is parsed as empty.
4. **Iters 34, 36, 38, 40, 42, 44, 46, 48, 50 are missing for task 2.** Inspection of the iteration log shows the claude attempts repeatedly retried and never produced a markdown file; only the odd-numbered codex iterations from 35 onwards exist. This biases the late-stage Jaccard upward (codex is comparing to its own earlier output, two iterations back).
5. The early baseline iter 0 uses a different table format (numbered list, no corpus citations); it is included for the score row but its rewrites/citations are not directly comparable to iters 1+.
6. Wall-clock is derived from successive `starting` log lines; for the final iteration we cannot measure its end (no following `starting`), so its wall time is omitted.
7. Rewrite extraction lower-cases and trims the *Original phrase* cell. Two iterations that re-quote the same essay phrase with extra/less context still count as the same target via the fuzzy matcher (substring match OR token-Jaccard ≥ 0.5 on content words). The unit of interest is "which essay span did the examiner choose to fix."