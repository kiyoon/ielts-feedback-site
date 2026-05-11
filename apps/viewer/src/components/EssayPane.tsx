import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { EssayDoc, FeedbackPayload, Rewrite } from "@/types";
import { CATEGORY_SHORT, CATEGORY_TOKEN, isAdditionRewrite } from "@/types";
import { buildSpans, segmentize } from "@/lib/highlight";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowRight, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChildMarker {
  id: number;
  start: number; // absolute essay position
  end: number;
  rewrite: Rewrite;
  overlapIds: number[];
}

const GUTTER_EDGE_REM = 0.2;
const GUTTER_LANE_STEP_REM = 1.9;
const GUTTER_HANDLE_WIDTH_REM = 1.35;
const ESSAY_SEGMENT_SELECTOR = '[data-essay-segment="true"]';

interface OverlapMarkerInfo {
  id: number;
  start: number;
  end: number;
  rewrite: Rewrite;
}

interface RangeRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

function buildOverlapMarkers(
  overlaps: Record<number, { start: number; end: number; withIds: number[] }>,
  rewritesById: Map<number, Rewrite>,
): OverlapMarkerInfo[] {
  return Object.entries(overlaps)
    .map(([id, info]) => {
      const rewriteId = Number(id);
      const rewrite = rewritesById.get(rewriteId);
      if (!rewrite || info.start >= info.end) return null;
      return { id: rewriteId, start: info.start, end: info.end, rewrite };
    })
    .filter((m): m is OverlapMarkerInfo => m !== null)
    .sort((a, b) => a.start - b.start || b.end - a.end || a.id - b.id);
}

function makeTextRange(root: HTMLElement, start: number, end: number): Range | null {
  if (start < 0 || end <= start) return null;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.parentElement?.closest(ESSAY_SEGMENT_SELECTOR)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });
  const range = document.createRange();
  let offset = 0;
  let started = false;

  while (true) {
    const node = walker.nextNode() as Text | null;
    if (!node) break;
    const nextOffset = offset + node.data.length;

    if (!started && start >= offset && start <= nextOffset) {
      range.setStart(node, start - offset);
      started = true;
    }

    if (started && end >= offset && end <= nextOffset) {
      range.setEnd(node, end - offset);
      return range;
    }

    offset = nextOffset;
  }

  return null;
}

function measureTextRange(
  root: HTMLElement,
  rootRect: DOMRect,
  start: number,
  end: number,
): { top: number; height: number } | null {
  const range = makeTextRange(root, start, end);
  if (!range) return null;
  const rects = Array.from(range.getClientRects()).filter(
    (rect) => rect.width > 0 && rect.height > 0,
  );
  const firstRect = rects[0];
  const lastRect = rects[rects.length - 1];
  range.detach?.();
  if (!firstRect || !lastRect) return null;
  return {
    top: firstRect.top - rootRect.top,
    height: lastRect.bottom - firstRect.top,
  };
}

function measureTextRangeRects(
  root: HTMLElement,
  containerRect: DOMRect,
  start: number,
  end: number,
): RangeRect[] {
  const range = makeTextRange(root, start, end);
  if (!range) return [];
  const rects = Array.from(range.getClientRects())
    .filter((rect) => rect.width > 0 && rect.height > 0)
    .map((rect) => ({
      left: rect.left - containerRect.left,
      top: rect.top - containerRect.top,
      width: rect.width,
      height: rect.height,
    }));
  range.detach?.();
  return mergeLineRects(rects);
}

function mergeLineRects(rects: RangeRect[]): RangeRect[] {
  const sorted = [...rects].sort((a, b) => a.top - b.top || a.left - b.left);
  const lines: RangeRect[] = [];
  for (const rect of sorted) {
    const last = lines[lines.length - 1];
    const rectRight = rect.left + rect.width;
    if (
      last &&
      Math.abs(last.top - rect.top) <= 3 &&
      Math.abs(last.height - rect.height) <= 3 &&
      rect.left <= last.left + last.width + 4
    ) {
      const left = Math.min(last.left, rect.left);
      const right = Math.max(last.left + last.width, rectRight);
      last.top = Math.min(last.top, rect.top);
      last.height = Math.max(last.height, rect.height);
      last.left = left;
      last.width = right - left;
    } else {
      lines.push({ ...rect });
    }
  }
  return lines;
}

function assignGutterLanes<T extends { top: number; height: number }>(markers: T[]): (T & { lane: number })[] {
  const sorted = [...markers].sort((a, b) => a.top - b.top || b.height - a.height);
  const laneBottoms: number[] = [];
  return sorted.map((marker) => {
    const bottom = marker.top + marker.height;
    let lane = laneBottoms.findIndex((existingBottom) => marker.top >= existingBottom + 4);
    if (lane < 0) lane = laneBottoms.length;
    laneBottoms[lane] = bottom;
    return { ...marker, lane };
  });
}

export function EssayPane({
  essay,
  feedback,
  activeRewriteId,
  onMarkClick,
  scrollKey,
  onLocationReport,
  promptOpen,
  setPromptOpen,
  onSetLocationFilter,
}: {
  essay: EssayDoc;
  feedback: FeedbackPayload;
  activeRewriteId: number | null;
  onMarkClick: (rw: Rewrite) => void;
  scrollKey: number;
  onLocationReport: (info: {
    unmatched: number[];
    nested: Record<number, number>;
    overlaps: Record<number, number[]>;
  }) => void;
  promptOpen: boolean;
  setPromptOpen: (b: boolean) => void;
  onSetLocationFilter: (f: "unmatched" | "nested" | "overlap" | null) => void;
}) {
  // Rewrites with `original` like "(missing thesis)" or "(missing conclusion)"
  // aren't substring corrections — they're "add this" suggestions. Exclude
  // them from the substring search so they don't pollute the unmatched count.
  // FeedbackPane renders them as a dedicated "Suggested additions" card.
  const correctionRewrites = useMemo(
    () => feedback.rewrites.filter((r) => !isAdditionRewrite(r)),
    [feedback.rewrites],
  );
  const { spans, unmatched, nested, overlaps } = useMemo(
    () => buildSpans(essay.text, correctionRewrites),
    [essay.text, correctionRewrites],
  );
  const segments = useMemo(() => segmentize(essay.text, spans), [essay.text, spans]);
  const rwById = useMemo(
    () => new Map(feedback.rewrites.map((r) => [r.id, r])),
    [feedback.rewrites],
  );
  const overlapMarkers = useMemo(() => buildOverlapMarkers(overlaps, rwById), [overlaps, rwById]);
  // For each parent rewrite, the list of nested children (with their absolute
  // positions in the essay). The mark renderer uses these to (a) show a "+N"
  // badge on the parent, and (b) render an inline marker inside the parent's
  // text at the child's exact position so the nesting is visible.
  const childrenByParent = useMemo(() => {
    const m: Record<number, ChildMarker[]> = {};
    for (const [childStr, info] of Object.entries(nested)) {
      const childId = Number(childStr);
      const childRw = feedback.rewrites.find((r) => r.id === childId);
      if (!childRw) continue;
      if (!m[info.parentId]) m[info.parentId] = [];
      m[info.parentId].push({
        id: childId,
        start: info.start,
        end: info.end,
        rewrite: childRw,
        overlapIds: overlaps[childId]?.withIds ?? [],
      });
    }
    for (const k of Object.keys(m)) m[Number(k)].sort((a, b) => a.start - b.start);
    return m;
  }, [nested, overlaps, feedback.rewrites]);
  const containerRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const [previewRewriteId, setPreviewRewriteId] = useState<number | null>(null);

  // App expects nested as Record<childId, parentId>; flatten our richer
  // NestedInfo down to just parent ids for the cross-pane callback.
  const nestedParentMap = useMemo(() => {
    const out: Record<number, number> = {};
    for (const [k, v] of Object.entries(nested)) out[Number(k)] = v.parentId;
    return out;
  }, [nested]);
  const overlapMap = useMemo(() => {
    const out: Record<number, number[]> = {};
    for (const [k, v] of Object.entries(overlaps)) out[Number(k)] = v.withIds;
    return out;
  }, [overlaps]);
  useEffect(() => {
    onLocationReport({ unmatched, nested: nestedParentMap, overlaps: overlapMap });
  }, [unmatched, nestedParentMap, overlapMap, onLocationReport]);

  // Scroll the active mark into view, but DO NOT call .focus(). If the active
  // rewrite is *nested* inside another, fall back to scrolling the containing
  // rewrite's mark — the active state still pulses on the card on the right.
  useEffect(() => {
    if (activeRewriteId == null) return;
    let target = `[data-rewrite-id="${activeRewriteId}"]`;
    let node = containerRef.current?.querySelector(target) as HTMLElement | null;
    if (!node && nested[activeRewriteId] !== undefined) {
      const parent = nested[activeRewriteId].parentId;
      target = `[data-rewrite-id="${parent}"]`;
      node = containerRef.current?.querySelector(target) as HTMLElement | null;
    }
    if (!node && overlaps[activeRewriteId] !== undefined) {
      const parent = overlaps[activeRewriteId].withIds[0];
      target = `[data-rewrite-id="${parent}"]`;
      node = containerRef.current?.querySelector(target) as HTMLElement | null;
    }
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeRewriteId, scrollKey, nested, overlaps]);

  const nestedCount = Object.keys(nested).length;
  // Header shows N of (corrections only). Additions are reported separately.
  const total = correctionRewrites.length;

  // For deep nesting (A⊃B⊃C), the gutter bracket on A should reflect that
  // 2 things sit inside its region (B + C), not just the 1 direct child.
  // Walk the hierarchy to count all descendants under each parent id.
  const descendantsByParent = useMemo(() => {
    const out: Record<number, number> = {};
    const walk = (id: number): number => {
      if (out[id] !== undefined) return out[id];
      const direct = childrenByParent[id] ?? [];
      let total = direct.length;
      for (const c of direct) total += walk(c.id);
      out[id] = total;
      return total;
    };
    for (const k of Object.keys(childrenByParent)) walk(Number(k));
    return out;
  }, [childrenByParent]);

  // After every render, measure nested parents and partial-overlap feedbacks
  // to position right-margin "]" brackets aligned with their text ranges.
  // Re-runs on window resize and content change.
  type BaseGutterMarker = {
    key: string;
    kind: "nested" | "overlap";
    rewriteId: number;
    top: number;
    height: number;
    nestedCount?: number;
    category: Rewrite["category"];
    label: string;
  };
  type GutterMarker = BaseGutterMarker & { lane: number };
  type RangeOverlay = RangeRect & {
    key: string;
    rewriteId: number;
    category: Rewrite["category"];
  };
  const [gutterMarkers, setGutterMarkers] = useState<GutterMarker[]>([]);
  const [rangeOverlays, setRangeOverlays] = useState<RangeOverlay[]>([]);

  useLayoutEffect(() => {
    const measure = () => {
      const article = articleRef.current;
      const container = containerRef.current;
      if (!article || !container) return;
      const articleRect = article.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      // Each parent-shell is the non-interactive container around a region
      // that has nested children inside. Align the gutter bracket to the
      // first and last rendered line boxes for that inline range.
      const parents = article.querySelectorAll<HTMLElement>(".parent-shell");
      const out: BaseGutterMarker[] = [];
      parents.forEach((el) => {
        const id = Number(el.dataset.rewriteId);
        const cat = el.dataset.cat as Rewrite["category"];
        const rects = Array.from(el.getClientRects()).filter(
          (rect) => rect.width > 0 && rect.height > 0,
        );
        const firstRect = rects[0];
        const lastRect = rects[rects.length - 1];
        if (!firstRect || !lastRect) return;
        out.push({
          key: `nested-${id}`,
          kind: "nested",
          rewriteId: id,
          top: firstRect.top - articleRect.top,
          height: lastRect.bottom - firstRect.top,
          nestedCount: descendantsByParent[id] ?? childrenByParent[id]?.length ?? 0,
          category: cat,
          label: `#${id}`,
        });
      });
      for (const marker of overlapMarkers) {
        const rect = measureTextRange(article, articleRect, marker.start, marker.end);
        if (!rect) continue;
        out.push({
          key: `overlap-${marker.id}`,
          kind: "overlap",
          rewriteId: marker.id,
          top: rect.top,
          height: rect.height,
          category: marker.rewrite.category,
          label: `#${marker.id}`,
        });
      }
      setGutterMarkers(assignGutterLanes(out));

      const highlightedOverlapId = previewRewriteId ?? activeRewriteId;
      const highlightedOverlap =
        highlightedOverlapId == null
          ? null
          : overlapMarkers.find((marker) => marker.id === highlightedOverlapId);
      setRangeOverlays(
        highlightedOverlap
          ? measureTextRangeRects(
              article,
              containerRect,
              highlightedOverlap.start,
              highlightedOverlap.end,
            ).map((rect, i) => ({
              ...rect,
              key: `overlap-range-${highlightedOverlap.id}-${i}`,
              rewriteId: highlightedOverlap.id,
              category: highlightedOverlap.rewrite.category,
            }))
          : [],
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (articleRef.current) ro.observe(articleRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [
    segments,
    childrenByParent,
    descendantsByParent,
    overlapMarkers,
    feedback.rewrites,
    activeRewriteId,
    previewRewriteId,
  ]);

  const gutterLaneCount = gutterMarkers.reduce((max, g) => Math.max(max, g.lane + 1), 0);
  const gutterWidthRem =
    gutterLaneCount === 0
      ? 0
      : GUTTER_EDGE_REM + (gutterLaneCount - 1) * GUTTER_LANE_STEP_REM + GUTTER_HANDLE_WIDTH_REM;
  const renderedSegments = segments.map((seg, i) =>
    seg.span ? (
      <MarkSpan
        key={`m-${i}-${seg.span.rewriteId}-${seg.span.start}`}
        text={seg.text}
        spanStart={seg.span.start}
        rewrite={rwById.get(seg.span.rewriteId)!}
        active={seg.span.rewriteId === activeRewriteId}
        kind={seg.span.kind ?? "primary"}
        overlapParticipant={Boolean(overlaps[seg.span.rewriteId])}
        nestedChildren={
          seg.span.kind === "overlap-ghost"
            ? []
            : childrenByParent[seg.span.rewriteId] ?? []
        }
        childrenByParent={childrenByParent}
        onClick={onMarkClick}
        onHoverChange={setPreviewRewriteId}
      />
    ) : (
      <span key={`p-${i}`} data-essay-segment="true">
        {seg.text}
      </span>
    ),
  );

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-baseline justify-between gap-2">
          <span>Candidate response</span>
          <span className="text-xs text-muted-foreground tabular-nums flex items-baseline gap-1.5">
            {essay.word_count} words ·
            <Badge variant="outline" className="text-[10px]">
              {total} feedback{total === 1 ? "" : "s"}
            </Badge>
            {nestedCount > 0 && (
              <Badge variant="outline" className="text-[10px]">
                +{nestedCount} nested
              </Badge>
            )}
            {unmatched.length > 0 && (
              <Badge variant="warning" className="text-[10px]">
                {unmatched.length} not found
              </Badge>
            )}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="px-4 pb-4 space-y-3">
            <details
              className="text-sm"
              open={promptOpen}
              onToggle={(e) => setPromptOpen((e.currentTarget as HTMLDetailsElement).open)}
            >
              <summary className="cursor-pointer text-xs uppercase tracking-wide text-muted-foreground">
                prompt
              </summary>
              <p className="mt-1 italic text-muted-foreground whitespace-pre-wrap">
                {essay.prompt}
              </p>
            </details>
            <div
              className="relative"
              ref={containerRef}
              style={{ paddingRight: `${gutterWidthRem}rem` }}
            >
              <article
                ref={articleRef}
                className="text-base leading-7 whitespace-pre-wrap"
                children={renderedSegments}
              />
              {rangeOverlays.length > 0 && (
                <div className="essay-range-overlays" aria-hidden="true">
                  {rangeOverlays.map((overlay) => (
                    <span
                      key={overlay.key}
                      className="overlap-range-overlay"
                      data-cat={overlay.category}
                      data-rewrite-id={overlay.rewriteId}
                      style={{
                        left: `${overlay.left}px`,
                        top: `${overlay.top}px`,
                        width: `${overlay.width}px`,
                        height: `${overlay.height}px`,
                      }}
                    />
                  ))}
                </div>
              )}
              {gutterMarkers.length > 0 && (
                <div
                  className="essay-gutter"
                  aria-hidden="false"
                  style={{ width: `${gutterWidthRem}rem` }}
                >
                  {gutterMarkers.map((g) => {
                    const rw = rwById.get(g.rewriteId);
                    const isOverlap = g.kind === "overlap";
                    const isActive = g.rewriteId === activeRewriteId;
                    const nestedCount = g.nestedCount ?? 0;
                    return (
                      <button
                        key={g.key}
                        type="button"
                        className="gutter-bracket"
                        data-kind={g.kind}
                        data-cat={g.category}
                        data-active={isActive || undefined}
                        style={{
                          top: `${g.top}px`,
                          height: `${g.height}px`,
                          right: `${GUTTER_EDGE_REM + g.lane * GUTTER_LANE_STEP_REM}rem`,
                        }}
                        onClick={() => {
                          if (rw) onMarkClick(rw);
                        }}
                        onMouseEnter={() => {
                          if (isOverlap) setPreviewRewriteId(g.rewriteId);
                        }}
                        onMouseLeave={() => {
                          if (isOverlap) setPreviewRewriteId(null);
                        }}
                        onFocus={() => {
                          if (isOverlap) setPreviewRewriteId(g.rewriteId);
                        }}
                        onBlur={() => {
                          if (isOverlap) setPreviewRewriteId(null);
                        }}
                        aria-label={
                          isOverlap
                            ? `Overlapping suggestion #${g.rewriteId}: ${rw?.original ?? ""}. Click to open feedback.`
                            : `Suggestion #${g.rewriteId}, containing ${nestedCount} nested suggestion${nestedCount === 1 ? "" : "s"}: ${rw?.original ?? ""}. Click to open feedback.`
                        }
                      >
                        <span className="gutter-shape" />
                        <span className="gutter-count">{g.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {/* The nested-notice card is intentionally NOT rendered here.
                Nesting now renders fully in-band: the parent's region shows a
                ] bracket on the right gutter, and the nested child's phrase
                gets its own inline button at its exact position. The header
                still shows a compact "+N nested" badge for at-a-glance count.
                If a future case ever fails to render (e.g. a parent whose
                bracket can't be measured), we'd surface a notice here. */}
            {unmatched.length > 0 && (
              <button
                type="button"
                onClick={() => onSetLocationFilter("unmatched")}
                className="w-full text-left rounded-md border border-dashed border-[hsl(var(--warning)/0.5)] bg-[hsl(var(--warning)/0.06)] hover:bg-[hsl(var(--warning)/0.12)] p-2 text-xs transition-colors focus-visible:outline-none"
                aria-label={`Show only the ${unmatched.length} unmatched suggestion${unmatched.length === 1 ? "" : "s"} in the right pane`}
              >
                <div className="flex items-center gap-1 font-semibold">
                  <Search className="h-3 w-3" /> {unmatched.length} suggestion
                  {unmatched.length === 1 ? "" : "s"} could not be located in the essay →
                </div>
                <div className="mt-1 text-muted-foreground">
                  The candidate's exact phrase wasn't found.{" "}
                  <span className="underline decoration-dotted">Click to filter the right pane to just these</span>.
                </div>
              </button>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function MarkSpan({
  text,
  spanStart,
  rewrite,
  active,
  kind,
  overlapParticipant,
  nestedChildren,
  childrenByParent,
  onClick,
  onHoverChange,
}: {
  text: string;
  spanStart: number;
  rewrite: Rewrite;
  active: boolean;
  kind: "primary" | "overlap-ghost";
  overlapParticipant: boolean;
  nestedChildren: ChildMarker[];
  childrenByParent: Record<number, ChildMarker[]>;
  onClick: (rw: Rewrite) => void;
  onHoverChange: (id: number | null) => void;
}) {
  const isGhost = kind === "overlap-ghost";
  const overlapping = !isGhost && nestedChildren.length > 0;

  // Overlapping case (this span is the parent of nested children):
  //   The user said "+1 bracket and the highlight could just be completely
  //   independent." So we render the parent's text as a NON-INTERACTIVE
  //   shell — no click, no hover state, no tooltip. Just a positioning
  //   container so the gutter bracket on the right can measure its rect.
  //   The bracket on the right gutter is the only way to access the parent
  //   rewrite. Inside the shell, the nested child buttons are completely
  //   standalone. No state can leak from child up to parent because the
  //   parent has no interactive state to leak into.
  //
  //   Sub-nesting: when a child has its own descendants (A⊃B⊃C — see
  //   highlight.ts: tightest renderable container), recurse via
  //   `childrenByParent[c.id]`. The grandchild renders as a span[role="button"]
  //   inside its parent span[role="button"] — both are spans, not real
  //   <button>s, so this is legal HTML.
  if (overlapping) {
    const renderRange = (
      rangeStart: number,
      rangeEnd: number,
      kids: ChildMarker[],
      keyBase: string,
    ): React.ReactNode[] => {
      const pieces: React.ReactNode[] = [];
      let cursor = rangeStart;
      kids.forEach((c, i) => {
        const childStart = Math.max(c.start, rangeStart);
        const childEnd = Math.min(c.end, rangeEnd);
        if (childEnd <= childStart) return;
        if (childStart > cursor) {
          pieces.push(
            <span key={`${keyBase}-pre-${i}`}>{text.slice(cursor - spanStart, childStart - spanStart)}</span>,
          );
        }
        const visibleStart = Math.max(childStart, cursor);
        if (visibleStart >= childEnd) return;
        const overlapLabel =
          c.overlapIds.length > 0 ? ` Overlaps #${c.overlapIds.join(", #")}.` : "";
        const grand = childrenByParent[c.id] ?? [];
        const innerText = text.slice(visibleStart - spanStart, childEnd - spanStart);
        const innerContent = grand.length > 0
          ? renderRange(visibleStart, childEnd, grand, `${keyBase}-${c.id}`)
          : innerText;
        pieces.push(
          <span
            role="button"
            tabIndex={0}
            key={`${keyBase}-child-${c.id}`}
            className="nested-child"
            data-cat={c.rewrite.category}
            data-overlap={c.overlapIds.length > 0 || undefined}
            data-depth={grand.length > 0 ? "outer" : "leaf"}
            data-rewrite-id={c.id}
            aria-label={`Nested suggestion #${c.id}: ${c.rewrite.original} → ${c.rewrite.improved}.${overlapLabel}`}
            onClick={(e) => {
              e.stopPropagation();
              onClick(c.rewrite);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onClick(c.rewrite);
              }
            }}
          >
            {innerContent}
          </span>,
        );
        cursor = childEnd;
      });
      if (cursor < rangeEnd) {
        pieces.push(<span key={`${keyBase}-post`}>{text.slice(cursor - spanStart, rangeEnd - spanStart)}</span>);
      }
      return pieces;
    };

    return (
      <span
        className="parent-shell"
        data-essay-segment="true"
        data-rewrite-id={rewrite.id}
        data-cat={rewrite.category}
        data-active={active || undefined}
      >
        {renderRange(spanStart, spanStart + text.length, nestedChildren, "root")}
      </span>
    );
  }

  // Non-overlapping case: the standard interactive mark. Tooltip, click,
  // keyboard, hover — everything works because there are no nested children
  // to interfere with state. Overlap participants preview their full measured
  // range on hover/focus, because the visible clickable fragment may be only
  // part of the feedback's original quote.
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          className="essay-mark"
          data-essay-segment="true"
          data-cat={rewrite.category}
          data-kind={isGhost ? "overlap-ghost" : undefined}
          data-active={active || undefined}
          data-overlap-participant={overlapParticipant || undefined}
          data-rewrite-id={rewrite.id}
          onClick={() => onClick(rewrite)}
          onMouseEnter={() => {
            if (overlapParticipant) onHoverChange(rewrite.id);
          }}
          onMouseLeave={() => {
            if (overlapParticipant) onHoverChange(null);
          }}
          onFocus={() => {
            if (overlapParticipant) onHoverChange(rewrite.id);
          }}
          onBlur={() => {
            if (overlapParticipant) onHoverChange(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClick(rewrite);
            }
          }}
          aria-label={
            isGhost
              ? `Partial overlap: "${rewrite.original}" — visible fragment. Click to open feedback.`
              : `Mark: "${rewrite.original}". Suggested rewrite: "${rewrite.improved}". Click to open feedback.`
          }
        >
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {CATEGORY_SHORT[rewrite.category]} · #{rewrite.id}
            {isGhost && (
              <span className="ml-2 rounded bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))] px-1 py-0.5 text-[9px]">
                partial overlap
              </span>
            )}
          </div>
          <div className="line-through text-muted-foreground">{rewrite.original}</div>
          <div className="flex items-center gap-1">
            <ArrowRight className="h-3 w-3" />
            <span
              className="font-medium"
              style={{ color: `hsl(var(--cat-${CATEGORY_TOKEN[rewrite.category]}))` }}
            >
              {rewrite.improved}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground">{rewrite.reason}</div>
          {isGhost && (
            <div className="text-[11px] text-[hsl(var(--warning))] italic border-t pt-1 mt-1">
              This fragment is clickable; the bracket highlights the full
              overlapping range.
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
