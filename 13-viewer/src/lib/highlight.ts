import type { Rewrite } from "@/types";

export interface HighlightSpan {
  start: number;
  end: number;
  rewriteId: number;
  category: Rewrite["category"];
}

export interface HighlightResult {
  spans: HighlightSpan[];
  unmatched: number[]; // rewrite ids that could not be located in the essay
}

// For each rewrite, locate `original` in the essay text. If offset is
// preprovided in the payload, use it; otherwise fall back to substring search.
// If the same phrase appears multiple times, only the first unclaimed
// occurrence is highlighted (so a duplicate suggestion doesn't double-mark
// the same span).
//
// Returns the matched spans AND a list of rewrite ids that could not be
// matched, so the UI can surface this cleanly instead of silently dropping.
export function buildSpans(essay: string, rewrites: Rewrite[]): HighlightResult {
  const claimed: boolean[] = Array(essay.length).fill(false);
  const spans: HighlightSpan[] = [];
  const unmatched: number[] = [];
  for (const r of rewrites) {
    const span = findFreeSpan(essay, claimed, r);
    if (!span) {
      unmatched.push(r.id);
      continue;
    }
    spans.push({ ...span, rewriteId: r.id, category: r.category });
    for (let i = span.start; i < span.end; i++) claimed[i] = true;
  }
  spans.sort((a, b) => a.start - b.start);
  return { spans, unmatched };
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
      // Validate the precomputed offset still corresponds to the original
      // phrase. A stale offset (essay edited after extraction) would otherwise
      // happily highlight the wrong text.
      essay.slice(start, end).trim() === r.original.trim()
    ) {
      return { start, end };
    }
  }
  const needle = r.original.trim();
  if (!needle) return null;
  // Try exact match first, then a case-insensitive fallback.
  const exact = locate(essay, claimed, needle, false);
  if (exact) return exact;
  return locate(essay, claimed, needle, true);
}

function locate(
  essay: string,
  claimed: boolean[],
  needle: string,
  caseInsensitive: boolean,
): { start: number; end: number } | null {
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

// Split an essay into segments alternating "plain" and "mark" so the renderer
// can wrap marks without DOM-mutating innerHTML.
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
