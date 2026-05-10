import { useEffect, useMemo, useRef } from "react";
import type { EssayDoc, FeedbackPayload, Rewrite } from "@/types";
import { CATEGORY_SHORT, CATEGORY_TOKEN } from "@/types";
import { buildSpans, segmentize } from "@/lib/highlight";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowRight, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function EssayPane({
  essay,
  feedback,
  activeRewriteId,
  onMarkClick,
  scrollKey,
  onUnmatchedReport,
  promptOpen,
  setPromptOpen,
}: {
  essay: EssayDoc;
  feedback: FeedbackPayload;
  activeRewriteId: number | null;
  onMarkClick: (rw: Rewrite) => void;
  scrollKey: number;
  onUnmatchedReport: (ids: number[]) => void;
  promptOpen: boolean;
  setPromptOpen: (b: boolean) => void;
}) {
  const { spans, unmatched } = useMemo(
    () => buildSpans(essay.text, feedback.rewrites),
    [essay.text, feedback.rewrites],
  );
  const segments = useMemo(() => segmentize(essay.text, spans), [essay.text, spans]);
  const rwById = useMemo(
    () => new Map(feedback.rewrites.map((r) => [r.id, r])),
    [feedback.rewrites],
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onUnmatchedReport(unmatched);
  }, [unmatched, onUnmatchedReport]);

  // Scroll the active mark into view, but DO NOT call .focus(). The right-pane
  // RewriteCard owns focus when activated from there; stealing focus would
  // dueling-focus with that card and break keyboard navigation.
  useEffect(() => {
    if (activeRewriteId == null) return;
    const node = containerRef.current?.querySelector(
      `[data-rewrite-id="${activeRewriteId}"]`,
    ) as HTMLElement | null;
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeRewriteId, scrollKey]);

  const located = feedback.rewrites.length - unmatched.length;

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-baseline justify-between gap-2">
          <span>Candidate response</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {essay.word_count} words ·{" "}
            <Badge variant={unmatched.length === 0 ? "outline" : "warning"} className="text-[10px]">
              {located}/{feedback.rewrites.length} located
            </Badge>
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
            <article ref={containerRef} className="text-base leading-7 whitespace-pre-wrap">
              {segments.map((seg) =>
                seg.span ? (
                  <MarkSpan
                    key={`m-${seg.span.rewriteId}-${seg.span.start}`}
                    text={seg.text}
                    rewrite={rwById.get(seg.span.rewriteId)!}
                    active={seg.span.rewriteId === activeRewriteId}
                    onClick={onMarkClick}
                  />
                ) : (
                  <span key={`p-${seg.text.length}-${seg.text.slice(0, 8)}`}>{seg.text}</span>
                ),
              )}
            </article>
            {unmatched.length > 0 && (
              <div className="rounded-md border border-dashed border-[hsl(var(--warning)/0.5)] bg-[hsl(var(--warning)/0.06)] p-2 text-xs">
                <div className="flex items-center gap-1 font-semibold">
                  <Search className="h-3 w-3" /> {unmatched.length} suggestion
                  {unmatched.length === 1 ? "" : "s"} could not be located in the essay
                </div>
                <div className="mt-1 text-muted-foreground">
                  The candidate's exact phrase wasn't found. Either the LLM paraphrased before
                  proposing the rewrite, or the extractor parsed the row incorrectly. Open the
                  Raw markdown tab to see the original suggestion text.
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function MarkSpan({
  text,
  rewrite,
  active,
  onClick,
}: {
  text: string;
  rewrite: Rewrite;
  active: boolean;
  onClick: (rw: Rewrite) => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="essay-mark"
          data-cat={rewrite.category}
          data-active={active || undefined}
          data-rewrite-id={rewrite.id}
          onClick={() => onClick(rewrite)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClick(rewrite);
            }
          }}
          aria-label={`Mark: "${rewrite.original}". Suggested rewrite: "${rewrite.improved}". Click to open feedback.`}
        >
          {text}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {CATEGORY_SHORT[rewrite.category]} · #{rewrite.id}
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
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
