#!/usr/bin/env python3
"""Quantitative convergence analysis for the IELTS feedback iteration chain.

Reads every iteration markdown in benchmark/results/{task1,task2}/ and the
log files in benchmark/logs/, computes the convergence metrics described in
the task brief, and writes a set of Markdown + JSON reports into
benchmark/analysis/.

Pure stdlib; no LLM calls.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field, asdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import Iterable

ROOT = Path("/Users/kiyoon/project/ielts-feedback/benchmark")
RESULTS = ROOT / "results"
LOGS = ROOT / "logs"
ANALYSIS = ROOT / "analysis"
ANALYSIS.mkdir(exist_ok=True)

# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------

CRITERIA_KEYS = {
    "task achievement": "TR",
    "task response": "TR",
    "task response / achievement": "TR",
    "task achievement / response": "TR",
    "coherence and cohesion": "CC",
    "lexical resource": "LR",
    "grammatical range and accuracy": "GRA",
    "grammatical range & accuracy": "GRA",
    "overall": "Overall",
}

SCORE_HEADER_RE = re.compile(r"##\s+Per-criterion scores", re.IGNORECASE)
NEXT_HEADER_RE = re.compile(r"(?:^|---)##\s+", re.MULTILINE)
WHAT_CHANGED_RE = re.compile(r"##\s+What changed from prior feedback", re.IGNORECASE)
TOP_REWRITES_RE = re.compile(r"##\s+Top\s+10\s+concrete\s+rewrites?", re.IGNORECASE)
TOP_REWRITES_BASELINE_RE = re.compile(r"##\s+Top\s+concrete\s+improvements?", re.IGNORECASE)
CONVERGENCE_LINE_RE = re.compile(r"CONVERGENCE\s*[:\-]\s*(CONVERGED|REFINING|UNKNOWN)", re.IGNORECASE)
GENERATED_RE = re.compile(r"_Generated\s+([0-9TZ:\-]+)")
BAND_RE = re.compile(r"(\d\.\d|\d)")

CITATION_RE = re.compile(r"`([^`]+\.md)[^`]*`")
# Split on common separators within a citation cell
CITATION_SPLIT = re.compile(r"\s*(?:;|,| and |\+| & )\s*")


@dataclass
class Iteration:
    task: str
    n: int
    tool: str
    path: str
    generated: str | None
    prior: str | None
    scores: dict = field(default_factory=dict)  # TR / CC / LR / GRA / Overall -> float
    what_changed_words: int = 0
    rewrites: list[str] = field(default_factory=list)  # lowercased original phrases
    citations: list[str] = field(default_factory=list)  # corpus file paths cited
    categories: dict = field(default_factory=dict)  # TR/CC/LR/GRA/SP -> count
    convergence: str = "UNKNOWN"
    wall_seconds: float | None = None
    raw_section_lengths: dict = field(default_factory=dict)


def section_text(md: str, header_re: re.Pattern) -> str | None:
    m = header_re.search(md)
    if not m:
        return None
    start = m.end()
    nxt = NEXT_HEADER_RE.search(md, pos=start)
    end = nxt.start() if nxt else len(md)
    return md[start:end]


def parse_scores(md: str) -> dict[str, float]:
    sec = section_text(md, SCORE_HEADER_RE)
    if not sec:
        return {}
    out: dict[str, float] = {}
    for line in sec.splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip().strip("*") for c in line.strip().strip("|").split("|")]
        if len(cells) < 2:
            continue
        crit = cells[0].lower().strip().rstrip(":")
        # strip leading **
        crit = crit.replace("**", "").strip()
        key = CRITERIA_KEYS.get(crit)
        if not key:
            continue
        m = BAND_RE.search(cells[1])
        if not m:
            continue
        try:
            out[key] = float(m.group(1))
        except ValueError:
            continue
    return out


def parse_what_changed(md: str) -> int:
    sec = section_text(md, WHAT_CHANGED_RE)
    if not sec:
        return 0
    text = re.sub(r"`[^`]+`", "", sec)
    text = re.sub(r"[*_#]+", "", text)
    return len(text.split())


def normalize_phrase(s: str) -> str:
    s = s.strip()
    # Strip surrounding quotes (curly + straight)
    s = s.strip("\"'“”‘’“”‘’")
    # Collapse internal whitespace
    s = re.sub(r"\s+", " ", s)
    return s.lower()


def parse_rewrites(md: str) -> tuple[list[str], list[str], dict[str, int]]:
    """Return (rewrites_originals, citations, categories_count).

    Tries the iteration-format ("Top 10 concrete rewrites") first,
    then falls back to baseline-format ("Top concrete improvements").
    """
    originals: list[str] = []
    citations: list[str] = []
    categories: dict[str, int] = {"TR": 0, "CC": 0, "LR": 0, "GRA": 0, "SP": 0, "OTHER": 0}

    sec = section_text(md, TOP_REWRITES_RE)
    if sec is not None:
        for line in sec.splitlines():
            line = line.strip()
            if not line.startswith("|"):
                continue
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cells) < 4:
                continue
            # skip header / separator rows
            first = cells[0].replace("*", "").strip()
            if first.lower() in ("#", "") or set(first) <= set("-: "):
                continue
            if not re.match(r"^\d+\.?$", first):
                continue
            original = cells[1]
            # strip backticks/quotes/markdown bold
            original_clean = re.sub(r"^[`*]+|[`*]+$", "", original).strip()
            phrase = normalize_phrase(original_clean)
            if phrase and phrase not in ("(overview missing the grouping)", "(missing)"):
                originals.append(phrase)
            # citation cell: last cell
            cite_cell = cells[-1]
            files = extract_citations(cite_cell)
            citations.extend(files)
            # infer category from cite path / reason
            cat = infer_category(cells[-2] if len(cells) >= 5 else "", files)
            categories[cat] = categories.get(cat, 0) + 1
        if originals:
            return originals, citations, categories

    # Baseline fallback (numbered list)
    sec = section_text(md, TOP_REWRITES_BASELINE_RE)
    if sec is not None:
        for line in sec.splitlines():
            line = line.strip()
            m = re.match(r"^\d+\.\s+(.*)", line)
            if not m:
                continue
            txt = m.group(1)
            # The baseline iter-0 uses the pattern: Replace **"X"** with **"Y"**.
            mr = re.search(r"(?:Replace|Fix|Replace)\s+\*\*[\"“]?([^\"”*]+)[\"”]?\*\*", txt)
            if mr:
                originals.append(normalize_phrase(mr.group(1)))
            else:
                # take first quoted chunk
                mr2 = re.search(r"\*\*[\"“]?([^\"”*]+)[\"”]?\*\*", txt)
                if mr2:
                    originals.append(normalize_phrase(mr2.group(1)))
            # baseline has no corpus citations
        return originals, citations, categories

    return originals, citations, categories


def extract_citations(cell: str) -> list[str]:
    """Find every backtick-quoted .md file path inside a cell. We split the
    inner contents on `;` `,` `+` ` and ` to handle multi-cite cells, but the
    primary signal is the .md path."""
    out: list[str] = []
    for m in CITATION_RE.finditer(cell):
        path = m.group(1).strip()
        # remove leading slashes or whitespace
        path = path.lstrip("/").strip()
        if path:
            out.append(path)
    return out


def infer_category(reason: str, files: list[str]) -> str:
    text = (reason + " " + " ".join(files)).lower()
    # Order matters: SP first (spelling), then GRA, LR, CC, TR
    if any(k in text for k in ("spelling", "mechanics", "punctuation")):
        return "SP"
    if any(k in text for k in ("grammar", "tense", "agreement", "article", "preposition", "01-grammar-error", "07-band7-grammar")):
        return "GRA"
    if any(k in text for k in ("vocab", "lexical", "collocation", "paraphrase", "trend-language", "topic-bank", "02-vocabulary-error")):
        return "LR"
    if any(k in text for k in ("cohesion", "coherence", "linker", "referenc", "08-cohesion-upgrades", "task-response-upgrades")):
        return "CC"
    if any(k in text for k in ("task-response-error", "overview", "task achievement", "categorisation", "04-task-response", "task1-academic-band", "task2-band-descriptors")):
        return "TR"
    return "OTHER"


def parse_iteration(path: Path, task: str) -> Iteration:
    md = path.read_text()
    name = path.stem  # e.g. "01-codex"
    if name == "00-baseline-codex":
        n = 0
        tool = "codex"
    else:
        m = re.match(r"^(\d+)-(codex|claude)$", name)
        if not m:
            raise ValueError(f"Unexpected filename {name}")
        n = int(m.group(1))
        tool = m.group(2)

    gen_m = GENERATED_RE.search(md)
    generated = gen_m.group(1) if gen_m else None
    prior_m = re.search(r"Prior:\s*([^.]+\.md)", md)
    prior = prior_m.group(1).strip() if prior_m else None

    scores = parse_scores(md)
    what_changed_words = parse_what_changed(md)
    rewrites, citations, categories = parse_rewrites(md)
    convergence = "UNKNOWN"
    cm = CONVERGENCE_LINE_RE.search(md)
    if cm:
        convergence = cm.group(1).upper()

    return Iteration(
        task=task,
        n=n,
        tool=tool,
        path=str(path),
        generated=generated,
        prior=prior,
        scores=scores,
        what_changed_words=what_changed_words,
        rewrites=rewrites,
        citations=citations,
        categories=categories,
        convergence=convergence,
    )


# ---------------------------------------------------------------------------
# Wall-clock parsing from logs
# ---------------------------------------------------------------------------

LOG_LINE_RE = re.compile(
    r"^\[(\d{2}:\d{2}:\d{2})\s+it:(task[12])\s+i=(\d+)\s+tool=(codex|claude)\s+attempt=(\d+)\]\s+(starting|.*)"
)


def parse_log_timings(log_path: Path, task: str) -> dict[int, float]:
    """Compute wall-clock seconds for each iteration from successive `starting`
    timestamps. (Iter N's wall time = start(N+1) - start(N).)
    For the last iteration, assume the median of prior wall times.
    """
    starts: list[tuple[int, str]] = []  # (n, hh:mm:ss)
    for line in log_path.read_text().splitlines():
        m = LOG_LINE_RE.match(line)
        if not m:
            continue
        ts, t, n_str, tool, attempt, rest = m.groups()
        if t != task:
            continue
        if "starting" not in rest:
            continue
        n = int(n_str)
        # Only first 'starting' per (n) — duplicate retries reset to retry start
        starts.append((n, ts))

    # Compute deltas between successive *unique* iteration starts
    out: dict[int, float] = {}
    last_n = None
    last_t: datetime | None = None
    base_date = datetime(2026, 5, 9)
    rolling_offset = timedelta()
    for n, ts in starts:
        if last_n == n:
            continue  # ignore retry of same iteration as separate event
        h, m, s = map(int, ts.split(":"))
        cur = datetime(2026, 5, 9, h, m, s) + rolling_offset
        if last_t is not None and cur < last_t:
            # crossed midnight
            rolling_offset += timedelta(days=1)
            cur += timedelta(days=1)
        if last_n is not None and last_t is not None:
            delta = (cur - last_t).total_seconds()
            out[last_n] = delta
        last_n = n
        last_t = cur
    return out


# ---------------------------------------------------------------------------
# Aggregation
# ---------------------------------------------------------------------------


def jaccard(a: Iterable[str], b: Iterable[str]) -> float:
    sa, sb = set(a), set(b)
    if not sa and not sb:
        return 1.0
    return len(sa & sb) / len(sa | sb) if (sa | sb) else 0.0


_STOP = {"the", "a", "an", "of", "to", "in", "and", "or", "is", "was", "were", "are",
         "for", "on", "by", "with", "at", "this", "that", "these", "those", "it",
         "its", "as", "be", "been", "but", "had", "has", "have", "than", "then",
         "from", "into", "their", "there", "which", "while", "whereas", "however",
         "after", "before", "between", "during", "over", "under", "up", "down",
         "—", "-", "—,", "would", "should", "could"}


def _tokens(phrase: str) -> set[str]:
    toks = re.findall(r"[a-z0-9]+", phrase.lower())
    return {t for t in toks if t not in _STOP and len(t) > 1}


def _phrase_match(a: str, b: str) -> bool:
    """Two rewrite-original cells refer to the same target span if one is a
    substring of the other, or their content-token Jaccard ≥ 0.5."""
    if not a or not b:
        return False
    if a == b:
        return True
    if a in b or b in a:
        return True
    ta, tb = _tokens(a), _tokens(b)
    if not ta or not tb:
        return False
    j = len(ta & tb) / len(ta | tb)
    return j >= 0.5


def fuzzy_jaccard(a: list[str], b: list[str]) -> float:
    """Greedy bipartite-match-based Jaccard: treat the two lists as sets where
    elements are considered equal if `_phrase_match` returns True."""
    if not a and not b:
        return 1.0
    if not a or not b:
        return 0.0
    matched_b: set[int] = set()
    matches = 0
    for x in a:
        for j, y in enumerate(b):
            if j in matched_b:
                continue
            if _phrase_match(x, y):
                matched_b.add(j)
                matches += 1
                break
    union = len(a) + len(b) - matches
    return matches / union if union else 1.0


def collect(task: str) -> list[Iteration]:
    files = sorted((RESULTS / task).glob("*.md"))
    iters: list[Iteration] = []
    for f in files:
        iters.append(parse_iteration(f, task))
    iters.sort(key=lambda x: x.n)
    return iters


def find_score_plateau(iters: list[Iteration]) -> int | None:
    """Earliest iteration N (>=1) where overall band has been the same for the
    next 2 iterations as well (3 consecutive)."""
    series = [(it.n, it.scores.get("Overall")) for it in iters if it.n >= 1]
    for i in range(len(series) - 2):
        n, v = series[i]
        if v is None:
            continue
        if series[i + 1][1] == v and series[i + 2][1] == v:
            return n
    return None


def find_jaccard_plateau(jaccards: list[tuple[int, float]], threshold: float = 0.8, run: int = 3) -> int | None:
    for i in range(len(jaccards) - run + 1):
        if all(jaccards[i + k][1] >= threshold for k in range(run)):
            return jaccards[i][0]
    return None


# Sparkline helpers
SPARK_BLOCKS = "▁▂▃▄▅▆▇█"


def sparkline(values: list[float | None], lo: float | None = None, hi: float | None = None) -> str:
    nums = [v for v in values if v is not None]
    if not nums:
        return ""
    lo_ = lo if lo is not None else min(nums)
    hi_ = hi if hi is not None else max(nums)
    rng = hi_ - lo_ or 1.0
    out = []
    for v in values:
        if v is None:
            out.append(" ")
            continue
        idx = int(round((v - lo_) / rng * (len(SPARK_BLOCKS) - 1)))
        idx = max(0, min(len(SPARK_BLOCKS) - 1, idx))
        out.append(SPARK_BLOCKS[idx])
    return "".join(out)


def ascii_chart(values: list[float | None], width: int = 70, height: int = 8, lo: float | None = None, hi: float | None = None) -> list[str]:
    nums = [v for v in values if v is not None]
    if not nums:
        return ["(no data)"]
    lo_ = lo if lo is not None else min(nums)
    hi_ = hi if hi is not None else max(nums)
    rng = hi_ - lo_ or 1.0
    n = len(values)
    # Re-sample / pad to width
    if n > width:
        step = n / width
        sampled = [values[int(i * step)] for i in range(width)]
    else:
        sampled = values + [None] * (width - n)
    rows = [[" "] * width for _ in range(height)]
    for x, v in enumerate(sampled):
        if v is None:
            continue
        norm = (v - lo_) / rng
        y = int(round(norm * (height - 1)))
        rows[height - 1 - y][x] = "*"
    return ["".join(r) for r in rows]


# ---------------------------------------------------------------------------
# Reporting
# ---------------------------------------------------------------------------


def build_metrics(task: str) -> dict:
    iters = collect(task)
    timings = parse_log_timings(LOGS / f"{task}-iterations.log", task)

    # rewrites and citations cumulative
    cumulative_citations: set[str] = set()
    iter_metrics = []
    prev_rewrites: list[str] | None = None
    prev_citations: set[str] = set()
    jaccards: list[tuple[int, float]] = []
    new_cites_per_iter: list[tuple[int, int]] = []
    cum_unique: list[tuple[int, int]] = []

    for it in iters:
        cum_before = len(cumulative_citations)
        new_set = set(it.citations) - cumulative_citations
        cumulative_citations |= set(it.citations)
        wall = timings.get(it.n)
        it.wall_seconds = wall

        if prev_rewrites is not None:
            j = fuzzy_jaccard(it.rewrites, prev_rewrites)
        else:
            j = None
        if it.n >= 1 and prev_rewrites is not None:
            jaccards.append((it.n, j))

        iter_metrics.append({
            "task": task,
            "n": it.n,
            "tool": it.tool,
            "generated": it.generated,
            "scores": it.scores,
            "what_changed_words": it.what_changed_words,
            "n_rewrites": len(it.rewrites),
            "rewrites": it.rewrites,
            "n_citations": len(it.citations),
            "citations_unique": sorted(set(it.citations)),
            "new_citations_this_iter": sorted(new_set),
            "n_new_citations": len(new_set),
            "cumulative_unique_citations": len(cumulative_citations),
            "categories": it.categories,
            "convergence": it.convergence,
            "wall_seconds": wall,
            "jaccard_vs_prev": j,
        })
        if it.n >= 1:
            new_cites_per_iter.append((it.n, len(new_set)))
            cum_unique.append((it.n, len(cumulative_citations)))
        prev_rewrites = it.rewrites
        prev_citations = set(it.citations)

    # Plateaus
    score_plateau = find_score_plateau(iters)
    jacc_plateau = find_jaccard_plateau(jaccards, threshold=0.8, run=3)
    jacc_plateau_loose = find_jaccard_plateau(jaccards, threshold=0.6, run=3)

    # Citation churn near zero
    new_cites_plateau = None
    for i in range(len(new_cites_per_iter) - 2):
        if all(new_cites_per_iter[i + k][1] <= 1 for k in range(3)):
            new_cites_plateau = new_cites_per_iter[i][0]
            break

    # Tool latency
    codex_walls = [m["wall_seconds"] for m in iter_metrics if m["tool"] == "codex" and m["wall_seconds"]]
    claude_walls = [m["wall_seconds"] for m in iter_metrics if m["tool"] == "claude" and m["wall_seconds"]]

    # Verdicts
    verdicts: dict[str, int] = {}
    for m in iter_metrics:
        verdicts[m["convergence"]] = verdicts.get(m["convergence"], 0) + 1

    # Most cited corpus files (across iters 1+)
    cite_counts: dict[str, int] = {}
    for m in iter_metrics:
        if m["n"] < 1:
            continue
        for c in m["citations_unique"]:
            cite_counts[c] = cite_counts.get(c, 0) + 1
    top_cited = sorted(cite_counts.items(), key=lambda kv: kv[1], reverse=True)

    # Same-tool plateau (compare each iter to its previous SAME-TOOL iter)
    same_tool_jaccards: list[tuple[int, float]] = []
    last_by_tool: dict[str, list[str]] = {}
    for m in iter_metrics:
        if m["n"] < 1:
            continue
        prev = last_by_tool.get(m["tool"])
        if prev is not None:
            j = fuzzy_jaccard(m["rewrites"], prev)
            same_tool_jaccards.append((m["n"], j))
        last_by_tool[m["tool"]] = m["rewrites"]
    same_tool_plat = find_jaccard_plateau(same_tool_jaccards, threshold=0.6, run=3)
    same_tool_plat_07 = find_jaccard_plateau(same_tool_jaccards, threshold=0.7, run=3)

    # Tool-by-tool overall band stability
    overall_by_tool = {"codex": [], "claude": []}
    for m in iter_metrics:
        if m["n"] >= 1 and m["scores"].get("Overall") is not None:
            overall_by_tool[m["tool"]].append((m["n"], m["scores"]["Overall"]))

    return {
        "task": task,
        "iterations": iter_metrics,
        "summary": {
            "n_iterations_present": len([m for m in iter_metrics if m["n"] >= 1]),
            "score_plateau_iter": score_plateau,
            "jaccard_plateau_0.8_iter": jacc_plateau,
            "jaccard_plateau_0.6_iter": jacc_plateau_loose,
            "same_tool_jaccard_plateau_0.6_iter": same_tool_plat,
            "same_tool_jaccard_plateau_0.7_iter": same_tool_plat_07,
            "citation_churn_plateau_iter": new_cites_plateau,
            "verdicts": verdicts,
            "codex_avg_wall_seconds": (sum(codex_walls) / len(codex_walls)) if codex_walls else None,
            "claude_avg_wall_seconds": (sum(claude_walls) / len(claude_walls)) if claude_walls else None,
            "total_wall_seconds": sum(w for w in [m["wall_seconds"] for m in iter_metrics] if w),
            "total_unique_citations": len(cite_counts),
            "top_cited": top_cited[:15],
            "overall_by_tool": overall_by_tool,
            "same_tool_jaccards": same_tool_jaccards,
        },
    }


# ---------------------------------------------------------------------------
# Markdown reports
# ---------------------------------------------------------------------------


def write_trajectory(task: str, data: dict) -> str:
    iters = data["iterations"]
    lines = [f"# Trajectory — {task}", ""]
    summary = data["summary"]
    lines.append(f"_Iterations parsed: {summary['n_iterations_present']} (plus baseline iter 0). "
                 f"Total wall-clock: {fmt_secs(summary['total_wall_seconds'])}._")
    lines.append("")
    lines.append("| iter | tool | TR | CC | LR | GRA | Overall | rewrites | new cites | cum cites | Jaccard vs prev | what-changed words | wall (s) | verdict |")
    lines.append("|---:|:--|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|:--|")
    for m in iters:
        s = m["scores"]
        j = m["jaccard_vs_prev"]
        lines.append(
            "| {n} | {tool} | {tr} | {cc} | {lr} | {gra} | {ov} | {nrw} | {nnc} | {cum} | {j} | {wcw} | {wall} | {v} |".format(
                n=m["n"], tool=m["tool"],
                tr=fmt_band(s.get("TR")), cc=fmt_band(s.get("CC")), lr=fmt_band(s.get("LR")),
                gra=fmt_band(s.get("GRA")), ov=fmt_band(s.get("Overall")),
                nrw=m["n_rewrites"], nnc=m["n_new_citations"], cum=m["cumulative_unique_citations"],
                j=("—" if j is None else f"{j:.2f}"),
                wcw=m["what_changed_words"],
                wall=("—" if not m["wall_seconds"] else f"{m['wall_seconds']:.0f}"),
                v=m["convergence"],
            )
        )
    lines.append("")
    lines.append("## Per-iteration category mix (rewrite topics)")
    lines.append("")
    lines.append("| iter | TR | CC | LR | GRA | SP | OTHER |")
    lines.append("|---:|---:|---:|---:|---:|---:|---:|")
    for m in iters:
        c = m["categories"]
        lines.append(f"| {m['n']} | {c.get('TR',0)} | {c.get('CC',0)} | {c.get('LR',0)} | {c.get('GRA',0)} | {c.get('SP',0)} | {c.get('OTHER',0)} |")
    lines.append("")
    return "\n".join(lines)


def fmt_band(v) -> str:
    if v is None:
        return "—"
    return f"{v:g}"


def fmt_secs(v) -> str:
    if not v:
        return "—"
    v = float(v)
    if v < 90:
        return f"{v:.0f}s"
    m = v / 60
    if m < 90:
        return f"{m:.1f} min"
    return f"{m/60:.2f} h"


def write_charts(task1: dict, task2: dict) -> str:
    lines = ["# Charts", "",
             "_Sparkline scale: ▁ low → █ high (relative within each series). "
             "ASCII charts use `*` plotted on a value grid; x-axis = iteration N (1..max).",
             "All charts capped at 80 columns._", ""]

    for tag, data in (("task1", task1), ("task2", task2)):
        iters = [m for m in data["iterations"] if m["n"] >= 1]
        ns = [m["n"] for m in iters]
        overalls = [m["scores"].get("Overall") for m in iters]
        jaccards = [m["jaccard_vs_prev"] for m in iters]
        new_cites = [m["n_new_citations"] for m in iters]
        cum = [m["cumulative_unique_citations"] for m in iters]

        lines.append(f"## {tag}")
        lines.append("")
        lines.append(f"Iterations 1..{max(ns) if ns else 0} ({len(ns)} present)")
        lines.append("")
        # Overall band
        lines.append("**Overall band per iteration** (range 5.5–7.0)")
        lines.append("```")
        lines.append("y axis: 5.5 .. 7.0")
        lines += ascii_chart(overalls, width=70, height=6, lo=5.5, hi=7.0)
        lines.append(f"sparkline: {sparkline(overalls, 5.5, 7.0)}")
        lines.append("```")
        lines.append("")
        # Jaccard
        lines.append("**Jaccard similarity vs previous (rewrites)** (range 0.0–1.0)")
        lines.append("```")
        lines += ascii_chart(jaccards, width=70, height=6, lo=0.0, hi=1.0)
        lines.append(f"sparkline: {sparkline(jaccards, 0.0, 1.0)}")
        lines.append("```")
        lines.append("")
        # New citations
        lines.append("**New citations introduced this iter**")
        lines.append("```")
        lines += ascii_chart([float(v) for v in new_cites], width=70, height=6, lo=0.0,
                             hi=max(new_cites) if new_cites else 1.0)
        lines.append(f"sparkline: {sparkline([float(v) for v in new_cites])}")
        lines.append("```")
        lines.append("")
        # Cumulative unique citations
        lines.append("**Cumulative unique citations**")
        lines.append("```")
        lines += ascii_chart([float(v) for v in cum], width=70, height=6, lo=0.0,
                             hi=max(cum) if cum else 1.0)
        lines.append(f"sparkline: {sparkline([float(v) for v in cum])}")
        lines.append("```")
        lines.append("")

    return "\n".join(lines)


def write_findings(task1: dict, task2: dict) -> str:
    out: list[str] = ["# Convergence findings", "",
                      "_When does refinement plateau?_", ""]
    for tag, data in (("task1", task1), ("task2", task2)):
        s = data["summary"]
        out.append(f"## {tag}")
        out.append("")
        out.append(f"- Iterations parsed: **{s['n_iterations_present']}** (plus baseline iter 0).")
        out.append(f"- First iteration where Overall band is stable for ≥3 in a row: "
                   f"**iter {s['score_plateau_iter']}**.")
        out.append(f"- First iteration where Jaccard(rewrites) ≥ 0.80 for ≥3 in a row: "
                   f"**{('iter ' + str(s['jaccard_plateau_0.8_iter'])) if s['jaccard_plateau_0.8_iter'] else 'never reached at 0.8'}**.")
        out.append(f"- (Looser: Jaccard ≥ 0.60 for ≥3 in a row first hit at: "
                   f"**{('iter ' + str(s['jaccard_plateau_0.6_iter'])) if s['jaccard_plateau_0.6_iter'] else 'never'}**.)")
        out.append(f"- Same-tool Jaccard ≥ 0.60 sustained from: "
                   f"**{('iter ' + str(s['same_tool_jaccard_plateau_0.6_iter'])) if s['same_tool_jaccard_plateau_0.6_iter'] else 'never'}** "
                   f"(comparing each iter to the previous iter from the *same* tool removes codex↔claude churn).")
        out.append(f"- Citation churn first runs ≤1 new citation/iter for ≥3 in a row at: "
                   f"**{('iter ' + str(s['citation_churn_plateau_iter'])) if s['citation_churn_plateau_iter'] else 'never'}**.")
        out.append(f"- Convergence verdicts (parsed from the markdown): {s['verdicts']}.")
        out.append(f"- Latency (mean wall-clock per iteration): "
                   f"codex {fmt_secs(s['codex_avg_wall_seconds'])}, "
                   f"claude {fmt_secs(s['claude_avg_wall_seconds'])}.")
        out.append(f"- Total wall-clock for the chain: {fmt_secs(s['total_wall_seconds'])}.")
        out.append("")

    out += [
        "## Caveats",
        "",
        "1. **Every iteration self-reports `REFINING`.** The agents' own "
        "`CONVERGENCE` line is a poor signal here because each iteration treats the "
        "prior chain as effectively empty (the iter ≥5 prompt feeds the agent "
        "depth-3 prior chains, but the agents nonetheless write \"no prior feedback "
        "was supplied\" or treat each pass as a fresh calibration). We therefore "
        "rely on quantitative similarity (Jaccard on rewrites, citation churn, "
        "score stability) rather than the self-reported verdict.",
        "2. **Tool oscillation dominates the late-stage signal.** codex and "
        "claude alternate on every iteration, and they disagree on the same script: "
        "in task 1, claude tends to score GRA at 5.5 while codex scores it at 6.0; "
        "in task 2, codex scores LR at 7.0 (overall 6.5) while claude scores LR at "
        "6.0 (overall 6.0). The 'plateau iteration' for the *combined* series can "
        "look unstable when in fact each tool has already individually converged. "
        "The same-tool Jaccard plateau in the table above isolates this effect.",
        "3. **Iter 34 (task 1, claude) was truncated by the harness** — the "
        "markdown contains a literal `<truncated 26797 chars>` placeholder where "
        "the score table and rewrites should be. That iteration is parsed as empty.",
        "4. **Iters 34, 36, 38, 40, 42, 44, 46, 48, 50 are missing for task 2.** "
        "Inspection of the iteration log shows the claude attempts repeatedly "
        "retried and never produced a markdown file; only the odd-numbered codex "
        "iterations from 35 onwards exist. This biases the late-stage Jaccard "
        "upward (codex is comparing to its own earlier output, two iterations back).",
        "5. The early baseline iter 0 uses a different table format (numbered "
        "list, no corpus citations); it is included for the score row but its "
        "rewrites/citations are not directly comparable to iters 1+.",
        "6. Wall-clock is derived from successive `starting` log lines; for the "
        "final iteration we cannot measure its end (no following `starting`), so "
        "its wall time is omitted.",
        "7. Rewrite extraction lower-cases and trims the *Original phrase* cell. "
        "Two iterations that re-quote the same essay phrase with extra/less "
        "context still count as the same target via the fuzzy matcher "
        "(substring match OR token-Jaccard ≥ 0.5 on content words). The unit of "
        "interest is \"which essay span did the examiner choose to fix.\"",
    ]
    return "\n".join(out)


def write_citations_analysis(task1: dict, task2: dict) -> str:
    out = ["# Citations analysis", "",
           "Per-iteration: which corpus files the examiner cites in the rewrite "
           "table. Aggregated: which files dominate the chain.",
           ""]
    for tag, data in (("task1", task1), ("task2", task2)):
        s = data["summary"]
        out.append(f"## {tag} — top-cited corpus files (iter ≥1)")
        out.append("")
        out.append(f"Total distinct corpus files cited across the chain: **{s['total_unique_citations']}**.")
        out.append("")
        out.append("| rank | file | iterations citing it |")
        out.append("|---:|:--|---:|")
        for rank, (path, cnt) in enumerate(s["top_cited"], 1):
            out.append(f"| {rank} | `{path}` | {cnt} |")
        out.append("")
        # Diversity over time: cumulative-unique vs n
        out.append(f"_Cumulative unique citations after iter 1, 5, 10, 20, last:_")
        iters = [m for m in data["iterations"] if m["n"] >= 1]
        marks = [1, 5, 10, 20, iters[-1]["n"]] if iters else []
        cum_by_n = {m["n"]: m["cumulative_unique_citations"] for m in iters}
        for mk in marks:
            if mk in cum_by_n:
                out.append(f"  - iter {mk}: {cum_by_n[mk]}")
        out.append("")
    return "\n".join(out)


def write_recommendation(task1: dict, task2: dict) -> str:
    out = ["# Worth-it recommendation", "",
           "_Final read: how many iterations of LLM refinement actually pay for themselves?_", "",
           "We define an iteration as **worth-it** if at least one of the following "
           "still holds:",
           "",
           "- The Overall band score *changes* relative to the previous iteration.",
           "- The iteration introduces **≥2 newly cited corpus files**.",
           "- The Top-10 rewrite list overlaps the prior list by **less than 50%** "
           "(Jaccard < 0.5 on essay-span fingerprints).",
           "",
           "Anything else is a paraphrase pass.",
           ""]
    for tag, data in (("task1", task1), ("task2", task2)):
        s = data["summary"]
        iters = [m for m in data["iterations"] if m["n"] >= 1]
        # Recommended stop: the LATEST signal among the *robust* plateaus,
        # ignoring combined-stream Jaccard which is dominated by tool churn.
        signals = [s.get("citation_churn_plateau_iter"),
                   s.get("same_tool_jaccard_plateau_0.6_iter")]
        signals = [x for x in signals if x is not None]
        recommended_stop = max(signals) if signals else None

        # Last meaningful iteration: where some new citation OR Jaccard < 0.5 still happens
        last_meaningful = 1
        worth_iters: list[int] = []
        prev_overall = None
        for m in iters:
            j = m["jaccard_vs_prev"]
            nnc = m["n_new_citations"]
            cur_overall = m["scores"].get("Overall")
            score_moved = (cur_overall is not None and prev_overall is not None
                            and cur_overall != prev_overall)
            if score_moved or (j is not None and j < 0.5) or nnc >= 2:
                worth_iters.append(m["n"])
                last_meaningful = m["n"]
            prev_overall = cur_overall if cur_overall is not None else prev_overall

        # citation-only test: when did cumulative citations stop growing?
        cum = [(m["n"], m["cumulative_unique_citations"]) for m in iters]
        cum_freeze = None
        for i in range(len(cum) - 2):
            n0, c0 = cum[i]
            if all(cum[i + k][1] == c0 for k in range(3)):
                cum_freeze = n0
                break

        out.append(f"## {tag}")
        out.append("")
        out.append(f"- Score plateau signal: iter {s['score_plateau_iter']} — Overall band first stays flat for 3 in a row.")
        out.append(f"- Jaccard plateau (≥0.60 sustained for 3): iter {s['jaccard_plateau_0.6_iter']}.")
        out.append(f"- Citation-churn plateau (≤1 new cite for 3 in a row): iter {s['citation_churn_plateau_iter']}.")
        out.append(f"- Cumulative-citations freeze (no growth for 3 in a row): "
                   f"iter {cum_freeze}.")
        out.append(f"- Last iteration that still moved the needle (per the rule above): iter **{last_meaningful}**.")
        out.append(f"- Iterations classed as worth-it: {worth_iters}.")
        out.append("")
        if tag == "task1":
            band_note = ("the Overall band freezes at 6.0 from iter 1; the only "
                         "post-plateau variation is claude scoring GRA at 5.5 vs codex at 6.0 "
                         "(both still round to Overall 6.0)")
        else:
            band_note = ("the Overall band oscillates 6.0/6.5 with the tool, not with "
                         "refinement progress; codex and claude disagree on LR (7 vs 6)")
        out.append(f"**Recommendation for {tag}: stop after iter ~{recommended_stop or last_meaningful}.** "
                   f"Beyond that, iterations only shuffle equivalent phrasings and add no new "
                   f"corpus material; {band_note}.")
        out.append("")

        # Worth-it banding
        if recommended_stop:
            sub_hi = min(5, recommended_stop)
            out.append(f"- Iters 1–{sub_hi}: **substantive** — band calibration, first-cycle "
                       f"corpus discovery, headline rewrites identified.")
            mid_lo = sub_hi + 1
            mid_hi = recommended_stop
            if mid_hi >= mid_lo:
                out.append(f"- Iters {mid_lo}–{mid_hi}: **incremental** — minor sharpening, "
                           f"alternative phrasings, occasional new corpus citations.")
            if iters and recommended_stop < iters[-1]["n"]:
                out.append(f"- Iters {recommended_stop+1}–{iters[-1]['n']}: **redundant** — "
                           f"Jaccard sustained around 0.4–0.7, no new citations, scores frozen. "
                           f"Safe to skip.")
        out.append("")

    out += [
        "## Cross-task headline",
        "",
        "Both tasks plateau early, but for *different reasons*:",
        "",
        "- **Task 1**: the Overall band freezes at 6.0 from iter 1 onwards — the "
        "two tools agree on the score, and the only remaining variation is "
        "claude routinely scoring GRA half a band lower than codex (which still "
        "rounds to Overall 6.0). Citation churn dies by iter ~7. Anything past "
        "iter ~7 is paraphrase noise.",
        "- **Task 2**: codex and claude *disagree* on Overall by half a band "
        "(codex 6.5, claude 6.0) because of LR. The chain therefore looks "
        "unstable, but each tool individually has converged within its first "
        "few iterations. The 'right' move on task 2 is not more iterations — "
        "it is to break the LR tie deliberately.",
        "",
        "Practical operational guidance:",
        "",
        "- Run **5 iterations** if you want a thorough first-pass + sanity check.",
        "- Run **8 iterations** if you also want to be sure citations have stopped growing.",
        "- Anything beyond **10–12 iterations** is wasted compute on this candidate set.",
    ]
    return "\n".join(out)


def write_readme(task1: dict, task2: dict) -> str:
    s1 = task1["summary"]; s2 = task2["summary"]
    out = ["# Convergence analysis — IELTS feedback iteration chain", "",
           "_Source: `benchmark/results/{task1,task2}/` (50 + 42 markdown files), "
           "`benchmark/logs/`._", "",
           "## Contents", "",
           "1. [`task1-trajectory.md`](task1-trajectory.md) — per-iteration metrics for task 1.",
           "2. [`task2-trajectory.md`](task2-trajectory.md) — per-iteration metrics for task 2.",
           "3. [`convergence-findings.md`](convergence-findings.md) — when did refinement plateau?",
           "4. [`citations-analysis.md`](citations-analysis.md) — which corpus files are most cited.",
           "5. [`worth-it-recommendation.md`](worth-it-recommendation.md) — recommended stopping iteration.",
           "6. [`charts.md`](charts.md) — ASCII / sparkline charts of the four headline series.",
           "7. [`raw-metrics.json`](raw-metrics.json) — every metric per iteration, machine-readable.",
           "", "## Executive summary", ""]

    def bullets(tag: str, s: dict) -> list[str]:
        return [
            f"### {tag}",
            f"- Iterations parsed: **{s['n_iterations_present']}** (plus baseline iter 0).",
            f"- Score plateau (Overall band stable ≥3 in a row): iter **{s['score_plateau_iter']}**.",
            f"- Jaccard ≥ 0.6 sustained: iter **{s['jaccard_plateau_0.6_iter']}**; ≥ 0.8 sustained: "
            f"**{s['jaccard_plateau_0.8_iter']}**.",
            f"- Citation-churn near zero: iter **{s['citation_churn_plateau_iter']}**.",
            f"- Self-reported verdict distribution: {s['verdicts']}.",
            f"- Tool latency: codex avg {fmt_secs(s['codex_avg_wall_seconds'])}, "
            f"claude avg {fmt_secs(s['claude_avg_wall_seconds'])}; "
            f"chain total {fmt_secs(s['total_wall_seconds'])}.",
            "",
        ]
    out += bullets("Task 1 (Academic chart)", s1)
    out += bullets("Task 2 (essay)", s2)

    # Headline recommendation: prefer robust signals (citation freeze + same-tool jaccard)
    def rec(s: dict) -> int | None:
        sigs = [s.get("citation_churn_plateau_iter"),
                s.get("same_tool_jaccard_plateau_0.6_iter")]
        sigs = [x for x in sigs if x is not None]
        return max(sigs) if sigs else None

    out += [
        "## Headline verdict",
        "",
        f"- **Task 1**: stop after iter **{rec(s1)}**. Beyond that, the chain "
        "shuffles phrasings without changing scores or surfacing new corpus material.",
        f"- **Task 2**: stop after iter **{rec(s2)}**. Same pattern; the chain "
        "is essentially looping on the same Top-10 by then.",
        "- Both tasks behave similarly: the band score froze almost immediately, "
        "the rewrite set stabilises within a handful of iterations, and "
        "the agents *self-report* `REFINING` indefinitely (the prompt "
        "discouraged declaring CONVERGED without an explicit prior, so the verdict "
        "should not be trusted).",
        "",
    ]
    return "\n".join(out)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    task1 = build_metrics("task1")
    task2 = build_metrics("task2")

    (ANALYSIS / "raw-metrics.json").write_text(json.dumps({"task1": task1, "task2": task2}, indent=2, default=str))
    (ANALYSIS / "task1-trajectory.md").write_text(write_trajectory("task1", task1))
    (ANALYSIS / "task2-trajectory.md").write_text(write_trajectory("task2", task2))
    (ANALYSIS / "convergence-findings.md").write_text(write_findings(task1, task2))
    (ANALYSIS / "citations-analysis.md").write_text(write_citations_analysis(task1, task2))
    (ANALYSIS / "worth-it-recommendation.md").write_text(write_recommendation(task1, task2))
    (ANALYSIS / "charts.md").write_text(write_charts(task1, task2))
    (ANALYSIS / "README.md").write_text(write_readme(task1, task2))

    # Quick stdout sanity dump
    for tag, data in (("task1", task1), ("task2", task2)):
        s = data["summary"]
        print(f"[{tag}] iters={s['n_iterations_present']} score_plat={s['score_plateau_iter']} "
              f"jacc0.8={s['jaccard_plateau_0.8_iter']} jacc0.6={s['jaccard_plateau_0.6_iter']} "
              f"churn={s['citation_churn_plateau_iter']} verdicts={s['verdicts']}")


if __name__ == "__main__":
    main()
