#!/usr/bin/env python3
"""
Parse W1/W2 iteration markdown files (12-benchmark/results/{w1,w2}/*.md)
into the FeedbackPayload JSON schema the viewer expects, and rebuild
13-viewer/public/data/index.json.

Pure stdlib. Best-effort regex parsing; missing sections become empty strings
or omitted fields per the schema.
"""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path
from datetime import datetime

REPO = Path("/Users/kiyoon/project/ielts-feedback")
BENCH = REPO / "12-benchmark"
VIEWER_DATA = REPO / "13-viewer" / "public" / "data"

CRITERIA_KEYS = [
    ("task_response", ["Task Response", "Task Achievement", "Task Response / Achievement"]),
    ("coherence", ["Coherence and Cohesion", "Coherence & Cohesion"]),
    ("lexical", ["Lexical Resource"]),
    ("grammar", ["Grammatical Range and Accuracy", "Grammatical Range & Accuracy"]),
]

# Heuristic mapping from cited corpus path → category for rewrites.
def categorise_from_citations(citations: list[str], reason: str) -> str:
    blob = (" ".join(citations) + " " + reason).lower()
    if any(s in blob for s in ["task-response", "task1-academic-band-descriptors", "task2-band-descriptors", "samples-band-7", "paragraph-structure", "topic-banks", "sentence-frames"]):
        return "task_response"
    if any(s in blob for s in ["cohesion-upgrades", "cohesion-error", "linker", "reference"]):
        return "coherence"
    if any(s in blob for s in ["spelling-and-mechanics", "punctuation", "spelling"]):
        return "spelling"
    if any(s in blob for s in ["grammar-error", "grammar-upgrades", "passive-voice", "grammar-showcases", "common-korean-chinese-speaker-errors"]):
        return "grammar"
    if any(s in blob for s in ["paraphrase-banks", "vocabulary-error", "vocabulary-upgrades", "trend-language", "superlative", "topic-vocabulary", "paraphrase-quick-lookup", "user-shared-feedback"]):
        return "lexical"
    return "lexical"  # default

def split_section(md: str, title: str, until: list[str] | None = None) -> str:
    """Return text under ##/### `title` heading, stopping at next heading or any in `until`.
    Uses a non-anchored match so headings that follow `---` on the same line
    (codex sometimes outputs `---## Per-criterion scores`) are still detected."""
    # Normalise: insert newline after `---` if a heading immediately follows.
    md = re.sub(r"---(##+\s)", r"---\n\1", md)
    pattern = rf"##+\s+{re.escape(title)}\s*\n(.+?)(?=\n##+\s+|\Z)"
    m = re.search(pattern, md, re.MULTILINE | re.DOTALL)
    if not m:
        return ""
    return m.group(1).strip()


def split_section_prefix(md: str, prefix: str) -> str:
    """Return text under any ##/### heading that STARTS WITH `prefix`."""
    md = re.sub(r"---(##+\s)", r"---\n\1", md)
    pattern = rf"##+\s+{re.escape(prefix)}[^\n]*\n(.+?)(?=\n##+\s+|\Z)"
    m = re.search(pattern, md, re.MULTILINE | re.DOTALL)
    if not m:
        return ""
    return m.group(1).strip()

def parse_score_table(md: str) -> tuple[dict, float, str]:
    """Extract per-criterion bands + overall from the first markdown table."""
    section = split_section(md, "Per-criterion scores")
    scores: dict[str, dict] = {}
    overall = None
    overall_evidence = ""
    for line in section.splitlines():
        line = line.strip()
        if not line.startswith("|") or "---" in line or line.lower().startswith("| criterion"):
            continue
        cols = [c.strip().strip("`") for c in line.strip("|").split("|")]
        if len(cols) < 2:
            continue
        crit_name = cols[0].strip().strip("*").strip()
        band_str = cols[1].strip().strip("*").strip()
        evidence = cols[2].strip() if len(cols) > 2 else ""
        try:
            band = float(re.search(r"[-+]?\d*\.?\d+", band_str).group())
        except (AttributeError, ValueError):
            continue
        if "overall" in crit_name.lower():
            overall = band
            overall_evidence = evidence
            continue
        for key, names in CRITERIA_KEYS:
            if any(n.lower() in crit_name.lower() or crit_name.lower() in n.lower() for n in names):
                scores[key] = {
                    "band": band,
                    "descriptor_evidence": evidence,
                    "justification": "",
                }
                break
    if overall is None and scores:
        overall = round(sum(s["band"] for s in scores.values()) / len(scores) * 2) / 2
    return scores, overall or 0.0, overall_evidence

def parse_per_criterion_justification(md: str, scores: dict) -> None:
    """Pull each criterion's justification paragraph and stuff it into scores[k]['justification']."""
    section = split_section(md, "Per-criterion justification")
    if not section:
        return
    # Pattern: **<crit name>[ — band]** <body until next ** or end>
    blocks = re.split(r"\n\s*\*\*([^*]+?)\*\*[\s.—:-]*", section)
    # blocks[0] is preamble; then alternating name, body, name, body...
    for i in range(1, len(blocks) - 1, 2):
        name = blocks[i].strip()
        body = blocks[i + 1].strip()
        for key, names in CRITERIA_KEYS:
            if any(n.lower() in name.lower() or name.lower().startswith(n.lower()) for n in names):
                if key in scores:
                    scores[key]["justification"] = body
                break

def parse_what_changed(md: str) -> str:
    return split_section(md, "What changed from prior feedback") or ""

def parse_structural(md: str) -> str:
    return split_section(md, "Structural feedback") or ""

def parse_whats_working(md: str) -> str:
    return split_section(md, "What's working") or split_section(md, "What is working") or ""

def parse_focus_areas(md: str) -> list[dict]:
    section = split_section(md, "Focus areas")
    if not section:
        return []
    out = []
    # Each bullet: - **Area name** — rationale. Drill: `path1`, `path2`.
    for line in section.splitlines():
        m = re.match(r"^\s*[-*]\s+\*\*([^*]+?)\*\*\s*[—\-:]+\s*(.+?)(?:\s+Drill:\s*(.+))?\.?$", line.strip())
        if not m:
            continue
        area = m.group(1).strip()
        rationale = m.group(2).strip().rstrip(".")
        drill_str = (m.group(3) or "").strip()
        # Extract backtick-quoted paths
        paths = re.findall(r"`([^`]+)`", drill_str)
        out.append({"area": area, "rationale": rationale, "corpus_drill": paths})
    return out

def parse_baseline_numbered(section: str) -> list[dict]:
    """Baselines use a numbered list. Two formats observed:
       (A) `**"original" → "improved"**` followed by a reason paragraph
       (B) `**Original:** "..."` followed by `**Rewrite:** "..."`
    """
    out = []
    QUOTE = "\"“”'‘’"
    # Format A: numbered item with quoted original → improved, optionally
    # bolded, optionally followed by a reason. The reason can come (i) inline
    # after a second → arrow, or (ii) on indented lines below.
    pat_a = re.compile(
        rf"\d+\.\s*\*?\*?\s*[{QUOTE}]([^{QUOTE}]+)[{QUOTE}]\s*→\s*"
        rf"[{QUOTE}]([^{QUOTE}]+)[{QUOTE}]\s*\*?\*?"
        rf"(?:\s*→\s*(.+?))?"           # inline reason after second arrow
        rf"(?:[ \t]*\n+(?:[ \t]+(.+?))?)?"  # OR indented continuation reason
        rf"(?=\n\s*\d+\.\s|\n##\s|\Z)",
        re.DOTALL,
    )
    matches = list(pat_a.finditer(section))
    if matches:
        for i, m in enumerate(matches, start=1):
            original = m.group(1).strip()
            improved = m.group(2).strip()
            inline_reason = (m.group(3) or "").strip()
            block_reason = (m.group(4) or "").strip().replace("\n", " ")
            reason = inline_reason or block_reason
            if not original:
                continue
            out.append({
                "id": i,
                "original": original,
                "improved": improved,
                "reason": reason or "(baseline — no-repo codex; reason not captured)",
                "citations": [],
                "category": "lexical",
            })
        return out

    # Format B: **Original:** "..."  ...  **Rewrite:** "..."
    pat_b = re.compile(
        rf"\d+\.\s*[\s\S]*?\*\*Original:\*\*\s*[{QUOTE}]([^{QUOTE}]+)[{QUOTE}]"
        rf"[\s\S]*?\*\*Rewrite:\*\*\s*[{QUOTE}]([^{QUOTE}]+)[{QUOTE}]",
        re.DOTALL,
    )
    for i, m in enumerate(pat_b.finditer(section), start=1):
        out.append({
            "id": i,
            "original": m.group(1).strip(),
            "improved": m.group(2).strip(),
            "reason": "(baseline — no-repo codex; reason not captured)",
            "citations": [],
            "category": "lexical",
        })
    return out


def parse_rewrites(md: str, essay: str) -> list[dict]:
    # Section heading varies between iterations of the prompt; use a prefix
    # match to accept any "## Top concrete rewrites …" or "## Top 10 …" or
    # "## Top concrete improvements" variant.
    section = (
        split_section_prefix(md, "Top concrete rewrites")
        or split_section_prefix(md, "Top 10 concrete rewrites")
        or split_section_prefix(md, "Top concrete improvements")
    )
    if not section:
        return []
    # Baseline format detection: no markdown-table separator row
    if "|---|" not in section:
        return parse_baseline_numbered(section)
    out = []
    rid = 0
    for raw_line in section.splitlines():
        line = raw_line.strip()
        if not line.startswith("|") or "---" in line:
            continue
        # Skip header rows
        if re.search(r"\|\s*#\s*\|", line, re.IGNORECASE) or "original" in line.lower() and "improved" in line.lower():
            continue
        cols = [c.strip() for c in line.strip("|").split("|")]
        if len(cols) < 4:
            continue
        # cols: # | Original | Improved | Reason | Citation
        try:
            int(cols[0].strip("*"))
        except ValueError:
            continue
        if len(cols) >= 5:
            num, original, improved, reason, citation_blob = cols[0], cols[1], cols[2], cols[3], cols[4]
        else:
            num, original, improved, reason = cols[0], cols[1], cols[2], cols[3]
            citation_blob = ""
        # Strip surrounding quotes AND markdown emphasis (asterisks, underscores)
        # — codex/claude sometimes wrap originals in *italic* or **bold**.
        def clean(s: str) -> str:
            s = s.strip()
            for _ in range(3):  # peel possibly nested wrappers
                s = s.strip().strip("“”‘’\"'*_`")
            return s
        original = clean(original)
        improved = clean(improved)
        # Skip placeholder rows
        if not original or original == "..." or original == "…":
            continue
        # Substring check — skip if original isn't in essay (the viewer flags these anyway)
        # Don't skip; the viewer handles "not found" cases. But we'll still include it.
        citations = re.findall(r"`([^`]+)`", citation_blob)
        if not citations and citation_blob:
            citations = [citation_blob]
        rid += 1
        out.append({
            "id": rid,
            "original": original,
            "improved": improved,
            "reason": reason,
            "citations": citations,
            "category": categorise_from_citations(citations, reason),
        })
    return out

def parse_overall_rationale(md: str) -> str:
    return split_section(md, "Overall band rationale") or split_section(md, "Overall band") or ""

def parse_convergence(md: str) -> tuple[str, str]:
    m = re.search(r"^##+\s+CONVERGENCE:\s+(CONVERGED|REFINING)\s*\n+(.*?)(?=\n##+\s|\Z)", md, re.MULTILINE | re.DOTALL)
    if m:
        return m.group(1), m.group(2).strip()
    if re.search(r"^##+\s+Convergence note", md, re.MULTILINE):
        body = split_section(md, "Convergence note")
        return "UNKNOWN", body
    return "UNKNOWN", ""

def file_to_payload(md_path: Path, essay_text: str, task: str) -> dict:
    md = md_path.read_text()
    fname = md_path.stem  # e.g. "04-claude" or "00-baseline-codex"
    if fname.startswith("00-baseline"):
        iteration = 0
        tool = "baseline"
    else:
        m = re.match(r"(\d+)-(.+)", fname)
        iteration = int(m.group(1))
        tool = m.group(2)

    scores, overall, overall_evidence = parse_score_table(md)
    parse_per_criterion_justification(md, scores)
    # Ensure all 4 keys exist (viewer requires them)
    for key, _ in CRITERIA_KEYS:
        scores.setdefault(key, {"band": overall, "descriptor_evidence": overall_evidence, "justification": ""})
    convergence, convergence_note = parse_convergence(md)

    payload = {
        "id": f"{task}/{fname}",
        "task": task,
        "iteration": iteration,
        "tool": tool,
        "generated_at": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "scores": scores,
        "overall": overall,
        "overall_rationale": parse_overall_rationale(md),
        "what_changed": parse_what_changed(md),
        "rewrites": parse_rewrites(md, essay_text),
        "convergence": convergence,
        "convergence_note": convergence_note,
        "raw_markdown": md,
    }
    structural = parse_structural(md)
    if structural:
        payload["structural_feedback"] = structural
    focus = parse_focus_areas(md)
    if focus:
        payload["focus_areas"] = focus
    working = parse_whats_working(md)
    if working:
        payload["whats_working"] = working
    return payload


def extract_essay(task: str) -> tuple[str, str, int]:
    p = BENCH / "essays" / f"{task}-essay.md"
    md = p.read_text()
    prompt_m = re.search(r"##\s+Prompt\s+([\s\S]*?)(?=\n##\s+|$)", md)
    essay_m = re.search(r"##\s+Essay\s+([\s\S]*?)(?=\n##\s+|$)", md)
    wc_m = re.search(r"##\s+Word Count\s+([^\n]*)", md, re.IGNORECASE)
    prompt = prompt_m.group(1).strip() if prompt_m else ""
    essay = essay_m.group(1).strip() if essay_m else ""
    wc = 0
    if wc_m:
        digits = re.search(r"(\d+)", wc_m.group(1))
        if digits:
            wc = int(digits.group(1))
    if wc == 0 and essay:
        wc = len([w for w in essay.split() if w])
    return prompt, essay, wc


TITLES = {
    "w1": "Mathematical influence on computer science",
    "w2": "Resource depletion and natural science",
    "task1": "Electricity consumption (line graph)",
    "task2": "Computers in the classroom",
}

def process_task(task: str, label: str) -> tuple[dict, list[dict]]:
    src_dir = BENCH / "results" / task
    out_dir = VIEWER_DATA / task
    out_dir.mkdir(parents=True, exist_ok=True)
    prompt, essay, wc = extract_essay(task)
    iter_summaries = []
    for md_path in sorted(src_dir.glob("*.md")):
        # Skip stub files. Real iterations are 6 KB+; baselines are 3 KB+.
        # Anything below 3 KB for an iteration is a failed/empty agent response.
        threshold = 1500 if "baseline" in md_path.stem else 3000
        if md_path.stat().st_size < threshold:
            print(f"  skip stub: {md_path.name} ({md_path.stat().st_size} B < {threshold})")
            continue
        try:
            payload = file_to_payload(md_path, essay, task)
        except Exception as e:
            print(f"  ERROR parsing {md_path.name}: {e}", file=sys.stderr)
            continue
        out_path = out_dir / f"{md_path.stem}.json"
        out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False))
        print(f"  {task}/{md_path.stem}.json — overall={payload['overall']} rewrites={len(payload['rewrites'])} structural={'y' if payload.get('structural_feedback') else 'n'} focus={len(payload.get('focus_areas', []))}")
        iter_summaries.append({
            "id": payload["id"],
            "iteration": payload["iteration"],
            "tool": payload["tool"],
            "overall": payload["overall"],
            "convergence": payload["convergence"],
            "generated_at": payload["generated_at"],
        })
    bundle = {
        "label": label,
        "title": TITLES.get(task, label),
        "essay": {"prompt": prompt, "text": essay, "word_count": wc},
        "iterations": sorted(iter_summaries, key=lambda x: x["iteration"]),
    }
    return bundle, iter_summaries


def main():
    out = {"generated_at": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"), "tasks": {}}

    # Preserve the existing demo data for task1/task2 (only update w1, w2)
    existing_index = json.loads((VIEWER_DATA / "index.json").read_text())
    for k, v in existing_index["tasks"].items():
        if k not in ("w1", "w2"):
            out["tasks"][k] = v

    for task, label in [("w1", "W1 (real)"), ("w2", "W2 (real)")]:
        print(f"=== {task} ===")
        bundle, _ = process_task(task, label)
        out["tasks"][task] = bundle

    # Write index ordered with w1/w2 first, then task1/task2
    keys = ["w1", "w2"] + [k for k in out["tasks"].keys() if k not in ("w1", "w2")]
    out["tasks"] = {k: out["tasks"][k] for k in keys if k in out["tasks"]}

    (VIEWER_DATA / "index.json").write_text(json.dumps(out, indent=2, ensure_ascii=False))
    print(f"\nindex.json updated: {list(out['tasks'].keys())}")
    for k, v in out["tasks"].items():
        print(f"  {k}: {len(v['iterations'])} iters")


if __name__ == "__main__":
    main()
