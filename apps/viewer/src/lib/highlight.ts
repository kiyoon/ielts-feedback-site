import type { Rewrite } from "@/types";

export interface HighlightSpan {
  start: number;
  end: number;
  rewriteId: number;
  category: Rewrite["category"];
  // "primary": this rewrite was located cleanly and owns the whole range.
  // "overlap-ghost": a fragment of an overlap rewrite, visible only in the
  // gap between claimed neighbors. Defaults to "primary" when absent.
  kind?: "primary" | "overlap-ghost";
}

export interface NestedInfo {
  parentId: number;
  // Absolute position in the essay where the child phrase sits. Used to
  // render an inline "child marker" inside the parent mark so the user can
  // see WHERE the nested suggestion applies.
  start: number;
  end: number;
}

export interface OverlapInfo {
  start: number;
  end: number;
  withIds: number[];
}

export interface HighlightResult {
  spans: HighlightSpan[];
  // Rewrite ids whose `original` is not a substring of the essay at all.
  unmatched: number[];
  // Rewrite ids whose `original` IS in the essay but is fully contained in
  // another rewrite's already-claimed span.
  nested: Record<number, NestedInfo>;
  // Rewrite ids whose `original` is present but partially crosses another
  // located rewrite, so rendering it as a nested child would be misleading.
  overlaps: Record<number, OverlapInfo>;
}

interface LocatedSpan {
  start: number;
  end: number;
  rewriteId: number;
}

// For each rewrite, locate `original` in the essay text. If offset is
// preprovided in the payload, use it; otherwise fall back to substring search.
export function buildSpans(essay: string, rewrites: Rewrite[]): HighlightResult {
  const claimed: boolean[] = Array(essay.length).fill(false);
  const spans: HighlightSpan[] = [];
  const unmatched: number[] = [];
  const nested: Record<number, NestedInfo> = {};
  const overlaps: Record<number, OverlapInfo> = {};
  const located: LocatedSpan[] = [];
  // Containers that the renderer is able to nest something inside: primary
  // spans, and nested spans whose ancestor chain bottoms out at a primary.
  // Sub-nesting (A⊃B⊃C) is correctly attributed by searching this list for
  // the tightest container of C — picking B over A. Overlap-located spans
  // are intentionally NOT renderable containers, since their text isn't
  // owned by a single shell that can host a child marker.
  const renderableContainers: LocatedSpan[] = [];

  // Process longer `original` strings first so a parent rewrite that arrives
  // AFTER its child in input order still claims its full range and the child
  // becomes nested under it. Without this, the parent fails findFreeSpan
  // (child has already claimed the inner pixels) and gets misrendered as a
  // partial-overlap with two ghost fragments. Stable tiebreak on input order.
  const ordered = rewrites
    .map((r, i) => ({ r, i }))
    .sort((a, b) => b.r.original.trim().length - a.r.original.trim().length || a.i - b.i)
    .map((x) => x.r);

  for (const r of ordered) {
    if (!substringExists(essay, r)) {
      unmatched.push(r.id);
      continue;
    }
    const span = findFreeSpan(essay, claimed, r);
    if (span) {
      spans.push({ ...span, rewriteId: r.id, category: r.category });
      located.push({ ...span, rewriteId: r.id });
      renderableContainers.push({ ...span, rewriteId: r.id });
      for (let i = span.start; i < span.end; i++) {
        claimed[i] = true;
      }
    } else {
      const occ = findAnyOccurrence(essay, r);
      if (occ) {
        // Find the tightest renderable container — a primary span or another
        // nested span whose ancestor chain reaches a primary. With A⊃B⊃C
        // ordered longest-first, B is already in this list when C arrives, so
        // C correctly attaches to B (not A). The renderer recurses the
        // hierarchy so grand-children stay visible inside their parent.
        const parent = findTightestContainer(renderableContainers, occ.start, occ.end);
        if (parent) {
          const crossing = findCrossingLocations(located, occ.start, occ.end);
          if (crossing.length > 0) {
            recordOverlap(overlaps, r.id, occ.start, occ.end, crossing);
            for (const crossed of crossing) {
              recordOverlap(overlaps, crossed.rewriteId, crossed.start, crossed.end, [
                { start: occ.start, end: occ.end, rewriteId: r.id },
              ]);
            }
          }
          nested[r.id] = { parentId: parent.rewriteId, start: occ.start, end: occ.end };
          located.push({ ...occ, rewriteId: r.id });
          renderableContainers.push({ ...occ, rewriteId: r.id });
          continue;
        }
        const blockers = findOverlappingLocations(located, occ.start, occ.end);
        if (blockers.length > 0) {
          recordOverlap(overlaps, r.id, occ.start, occ.end, blockers);
          for (const blocker of blockers) {
            recordOverlap(overlaps, blocker.rewriteId, blocker.start, blocker.end, [
              { start: occ.start, end: occ.end, rewriteId: r.id },
            ]);
          }
          located.push({ ...occ, rewriteId: r.id });
          // Render the visible (still-unclaimed) sub-ranges of [occ] as
          // "ghost" spans so the user can see WHERE the overlap reaches
          // beyond its blocker(s). Mark those positions claimed so later
          // rewrites don't land on the same pixels.
          for (const sub of freeSubRanges(claimed, occ.start, occ.end)) {
            spans.push({
              start: sub.start,
              end: sub.end,
              rewriteId: r.id,
              category: r.category,
              kind: "overlap-ghost",
            });
            for (let i = sub.start; i < sub.end; i++) claimed[i] = true;
          }
        } else {
          unmatched.push(r.id);
        }
      } else {
        unmatched.push(r.id);
      }
    }
  }
  spans.sort((a, b) => a.start - b.start);
  return { spans, unmatched, nested, overlaps };
}

// LLMs sometimes abbreviate the original quote with an ellipsis, e.g.
// `"In this essay, I will discuss…"` or `"To sum up… every problem"`.
// We accept these as legitimate quotes by anchoring on the longest
// segment(s). Strategy:
//   1. If the needle has no ellipsis, do an exact substring lookup.
//   2. Otherwise, split on ellipsis. For each non-trivial segment (≥10 chars
//      after trim), try to locate it. If at least one segment matches, use
//      its position as a synthetic anchor (start of first matched, end of
//      last matched in essay order). All cases also try a case-insensitive
//      fallback.
const ELLIPSIS_RE = /\s*(?:…|\.{2,4})\s*/;
const MIN_ANCHOR_LEN = 10;

function findAnyOccurrence(
  essay: string,
  r: Rewrite,
): { start: number; end: number } | null {
  const needle = r.original.trim();
  if (!needle) return null;
  // Exact / case-insensitive substring
  let i = essay.indexOf(needle);
  if (i >= 0) return { start: i, end: i + needle.length };
  i = essay.toLowerCase().indexOf(needle.toLowerCase());
  if (i >= 0) return { start: i, end: i + needle.length };
  // Ellipsis-shorthand: anchor on segments
  if (!/[…]|\.{2,}/.test(needle)) return null;
  const segs = needle
    .split(ELLIPSIS_RE)
    .map((s) => s.trim().replace(/^["“'‘]|["”'’]$/g, "").trim())
    .filter((s) => s.length >= MIN_ANCHOR_LEN);
  if (segs.length === 0) return null;
  const positions: { start: number; end: number }[] = [];
  let cursor = 0;
  for (const seg of segs) {
    let p = essay.indexOf(seg, cursor);
    if (p < 0) p = essay.toLowerCase().indexOf(seg.toLowerCase(), cursor);
    if (p >= 0) {
      positions.push({ start: p, end: p + seg.length });
      cursor = p + seg.length;
    }
  }
  if (positions.length === 0) return null;
  return { start: positions[0].start, end: positions[positions.length - 1].end };
}

function substringExists(essay: string, r: Rewrite): boolean {
  return findAnyOccurrence(essay, r) !== null;
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
  const needle = r.original.trim();
  // Try direct & case-insensitive match first
  const exact = locate(essay, claimed, needle, false);
  if (exact) return exact;
  const ci = locate(essay, claimed, needle, true);
  if (ci) return ci;
  // Ellipsis-shorthand: synthesize a span from first→last segment positions
  if (/[…]|\.{2,}/.test(needle)) {
    const segs = needle
      .split(ELLIPSIS_RE)
      .map((s) => s.trim().replace(/^["“'‘]|["”'’]$/g, "").trim())
      .filter((s) => s.length >= MIN_ANCHOR_LEN);
    if (segs.length > 0) {
      const positions: { start: number; end: number }[] = [];
      let cursor = 0;
      for (const seg of segs) {
        const p = locate(essay, claimed, seg, false) ?? locate(essay, claimed, seg, true);
        if (p && p.start >= cursor) {
          positions.push(p);
          cursor = p.end;
        }
      }
      if (positions.length > 0) {
        const start = positions[0].start;
        const end = positions[positions.length - 1].end;
        if (!rangeClaimed(claimed, start, end)) return { start, end };
      }
    }
  }
  return null;
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

function findTightestContainer(
  located: LocatedSpan[],
  start: number,
  end: number,
): LocatedSpan | null {
  let best: LocatedSpan | null = null;
  for (const loc of located) {
    if (loc.start > start || loc.end < end) continue;
    if (!best) {
      best = loc;
      continue;
    }
    const locLen = loc.end - loc.start;
    const bestLen = best.end - best.start;
    if (locLen < bestLen || (locLen === bestLen && loc.start > best.start)) {
      best = loc;
    }
  }
  return best;
}

function findOverlappingLocations(
  located: LocatedSpan[],
  start: number,
  end: number,
): LocatedSpan[] {
  return located.filter((loc) => loc.start < end && start < loc.end);
}

function recordOverlap(
  overlaps: Record<number, OverlapInfo>,
  rewriteId: number,
  start: number,
  end: number,
  withSpans: LocatedSpan[],
) {
  const existing = overlaps[rewriteId] ?? { start, end, withIds: [] };
  const ids = new Set(existing.withIds);
  for (const span of withSpans) {
    if (span.rewriteId !== rewriteId) ids.add(span.rewriteId);
  }
  overlaps[rewriteId] = {
    start: existing.start,
    end: existing.end,
    withIds: [...ids].sort((a, b) => a - b),
  };
}

function findCrossingLocations(
  located: LocatedSpan[],
  start: number,
  end: number,
): LocatedSpan[] {
  return findOverlappingLocations(located, start, end).filter(
    (loc) =>
      !containsRange(loc.start, loc.end, start, end) &&
      !containsRange(start, end, loc.start, loc.end),
  );
}

function containsRange(containerStart: number, containerEnd: number, start: number, end: number) {
  return containerStart <= start && end <= containerEnd;
}

function freeSubRanges(
  claimed: boolean[],
  start: number,
  end: number,
): { start: number; end: number }[] {
  const out: { start: number; end: number }[] = [];
  let i = start;
  while (i < end) {
    while (i < end && claimed[i]) i++;
    if (i >= end) break;
    const s = i;
    while (i < end && !claimed[i]) i++;
    out.push({ start: s, end: i });
  }
  return out;
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
