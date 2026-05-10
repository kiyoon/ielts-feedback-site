import type { Rewrite } from "@/types";

export interface HighlightSpan {
  start: number;
  end: number;
  rewriteId: number;
  category: Rewrite["category"];
}

export interface HighlightResult {
  spans: HighlightSpan[];
  // Rewrite ids whose `original` is not a substring of the essay at all.
  // These are real bugs — either the LLM paraphrased the candidate's phrase
  // or the extractor parsed the row incorrectly.
  unmatched: number[];
  // Rewrite ids whose `original` IS in the essay but is fully contained in
  // another rewrite's already-claimed span. The phrase is real; we just
  // can't draw two overlapping marks. Maps rewrite id → containing rewrite id.
  nested: Record<number, number>;
}

// For each rewrite, locate `original` in the essay text. If offset is
// preprovided in the payload, use it; otherwise fall back to substring search.
export function buildSpans(essay: string, rewrites: Rewrite[]): HighlightResult {
  const claimed: boolean[] = Array(essay.length).fill(false);
  const claimedBy: (number | undefined)[] = Array(essay.length).fill(undefined);
  const spans: HighlightSpan[] = [];
  const unmatched: number[] = [];
  const nested: Record<number, number> = {};

  for (const r of rewrites) {
    // Step 1 — does `original` appear in the essay AT ALL?
    if (!substringExists(essay, r)) {
      unmatched.push(r.id);
      continue;
    }
    // Step 2 — try to claim a non-overlapping span.
    const span = findFreeSpan(essay, claimed, r);
    if (span) {
      spans.push({ ...span, rewriteId: r.id, category: r.category });
      for (let i = span.start; i < span.end; i++) {
        claimed[i] = true;
        claimedBy[i] = r.id;
      }
    } else {
      // Step 3 — the substring exists but only inside an already-claimed
      // region. Record which rewrite owns the containing span.
      const occ = findAnyOccurrence(essay, r);
      if (occ) {
        // pick the claimedBy id at the start of the occurrence as the parent
        const parent = claimedBy[occ.start] ?? -1;
        if (parent > 0) nested[r.id] = parent;
        else unmatched.push(r.id); // shouldn't happen but safe fallback
      } else {
        unmatched.push(r.id);
      }
    }
  }
  spans.sort((a, b) => a.start - b.start);
  return { spans, unmatched, nested };
}

function substringExists(essay: string, r: Rewrite): boolean {
  const needle = r.original.trim();
  if (!needle) return false;
  return (
    essay.includes(needle) ||
    essay.toLowerCase().includes(needle.toLowerCase())
  );
}

function findAnyOccurrence(
  essay: string,
  r: Rewrite,
): { start: number; end: number } | null {
  const needle = r.original.trim();
  if (!needle) return null;
  let i = essay.indexOf(needle);
  if (i < 0) i = essay.toLowerCase().indexOf(needle.toLowerCase());
  if (i < 0) return null;
  return { start: i, end: i + needle.length };
}

function findFreeSpan(
  essay: string,
  claimed: boolean[],
  r: Rewrite,
): { start: number; end: number } | null {
  if (r.offset) {
    const { start, end } = r.offset;
    if (
      start >= 0 &&
      end <= essay.length &&
      start < end &&
      !rangeClaimed(claimed, start, end) &&
      essay.slice(start, end).trim() === r.original.trim()
    ) {
      return { start, end };
    }
  }
  const exact = locate(essay, claimed, r.original.trim(), false);
  if (exact) return exact;
  return locate(essay, claimed, r.original.trim(), true);
}

function locate(
  essay: string,
  claimed: boolean[],
  needle: string,
  caseInsensitive: boolean,
): { start: number; end: number } | null {
  if (!needle) return null;
  const hay = caseInsensitive ? essay.toLowerCase() : essay;
  const ndl = caseInsensitive ? needle.toLowerCase() : needle;
  let idx = 0;
  while (true) {
    const found = hay.indexOf(ndl, idx);
    if (found < 0) return null;
    const end = found + ndl.length;
    if (!rangeClaimed(claimed, found, end)) return { start: found, end };
    idx = found + 1;
  }
}

function rangeClaimed(claimed: boolean[], a: number, b: number): boolean {
  for (let i = a; i < b; i++) if (claimed[i]) return true;
  return false;
}

export interface Segment {
  text: string;
  span?: HighlightSpan;
}

export function segmentize(essay: string, spans: HighlightSpan[]): Segment[] {
  const out: Segment[] = [];
  let cursor = 0;
  for (const s of spans) {
    if (s.start > cursor) out.push({ text: essay.slice(cursor, s.start) });
    out.push({ text: essay.slice(s.start, s.end), span: s });
    cursor = s.end;
  }
  if (cursor < essay.length) out.push({ text: essay.slice(cursor) });
  return out;
}
