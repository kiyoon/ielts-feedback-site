# benchmark — Iterative refinement experiment

## Question

Does giving an LLM the curated IELTS context corpus in this repo, plus letting it iteratively refine its own feedback over many rounds, produce a meaningfully better band-6 → band-7 review than a single zero-context call?

## Setup

For each of two band-6.0 candidate essays (one Task 1 Academic, one Task 2):

- **Baseline** — one call to `codex exec`, run from a fresh tmpdir with `read-only` sandbox. The agent has the marker prompt + essay inline; the prompt explicitly forbids external reads. This isolates "training-data-only" judgment.

- **Iterations 1..N** — N=50 sequential calls alternating between `codex exec` (odd indexes) and `claude -p` (even indexes), each launched with full access to `/Users/kiyoon/project/ielts-feedback`. Each call reads:
  - the candidate essay,
  - the prior iteration's feedback file,
  - whatever corpus files it judges relevant (band descriptors, band-6→7 guide, instructor tips, atomic error tables, topic banks, etc.).
  Each call outputs a *refined* feedback intended to correct, sharpen, and add citations to the prior. Outputs are saved as `01-codex.md`, `02-claude.md`, `03-codex.md`, … in numerical order so any later iteration can reconstruct the chain.

## Layout

```
benchmark/
├── README.md                    # this file
├── essays/
│   ├── task1-essay.md           # Task 1 Academic band-6.0 input (line graph: electricity)
│   └── task2-essay.md           # Task 2 band-6.0 input (verbatim ieltsbuddy "computers in classroom")
├── prompts/
│   ├── baseline.md              # marker prompt — no external reads
│   └── iteration.md             # marker prompt — read repo + prior feedback, refine
├── scripts/
│   ├── run-baseline.sh          # codex baseline for one task
│   ├── run-iterations.sh        # 50-iteration alternating loop for one task
│   └── run-all.sh               # baseline + iterations for both tasks
├── results/
│   ├── task1/
│   │   ├── 00-baseline-codex.md
│   │   ├── 01-codex.md
│   │   ├── 02-claude.md
│   │   ├── 03-codex.md
│   │   └── …
│   └── task2/
│       └── (same structure)
└── logs/
    ├── task1-baseline.log
    ├── task1-iterations.log
    ├── task2-baseline.log
    ├── task2-iterations.log
    └── run-all.log
```

## Running

The harness is **idempotent and resumable** — existing non-empty result files are kept; only missing slots are re-run.

```bash
cd /Users/kiyoon/project/ielts-feedback/benchmark/scripts
chmod +x *.sh

# All-in-one (recommended). Will take hours for N=50.
./run-all.sh 50

# Or piecewise:
./run-baseline.sh task1
./run-baseline.sh task2
./run-iterations.sh task1 50
./run-iterations.sh task2 50
```

To run in the background and survive terminal close:

```bash
nohup ./run-all.sh 50 > logs/nohup.log 2>&1 &
echo $! > logs/run-all.pid
tail -f logs/run-all.log
```

## How to read results

After the run, compare:

1. `results/task1/00-baseline-codex.md` (no repo) vs `results/task1/50-claude.md` (final iteration after 50 refinements with full repo) — same for task2.
2. Walk the chain to see how the feedback evolves: do scores stabilise? do citations get more specific? does the suggestion list change in tone (generic → corpus-specific)?
3. Check `logs/*.log` for per-iteration timing and any failures (failed iterations leave their slot empty so a re-run picks them up).

## Constraints baked into the design

- **Baseline isolation** — codex runs from a tmpdir, `-s read-only`, prompt forbids external reads. Doesn't *prevent* the model from naming a path (no sandbox can prevent that), but minimises the surface.
- **Resume safety** — if the loop is interrupted, re-running picks up at the first missing slot.
- **Tool alternation** — codex on odd, claude on even, so any single-tool quirks (over-confident scoring, citation hallucinations, model-family blind spots) don't compound across the full chain.
- **Prior-feedback handoff** — passed inline in the prompt rather than by file path, so the iteration can refine it even if it skipped reading the corpus this round.

## Cost / time expectations

50 iterations × 2 essays = 100 long-context LLM calls. Each call reads ~10k+ lines of markdown. Expect **3–8 hours** wall-clock and a non-trivial API spend, depending on model defaults. The harness logs per-iteration latency in `logs/*-iterations.log`.

## Status

Scaffolding only. The actual benchmark run is **gated** until the three remaining context-corpus crawler agents (atomic error tables → `contexts/08-vocabulary-grammar/`; Task 2 topic banks → `contexts/10-task2-topic-banks/`; sample-band quality audit → `contexts/11-quality-audit/`) finish, so the iteration loop has the full corpus to draw on.
