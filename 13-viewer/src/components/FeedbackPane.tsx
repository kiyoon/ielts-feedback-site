import { useMemo, useState } from "react";
import type { FeedbackPayload, Category, Rewrite } from "@/types";
import { CATEGORIES, CATEGORY_SHORT, CATEGORY_TOKEN, isAdditionRewrite } from "@/types";
import { PlusCircle, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoresCard } from "@/components/ScoresCard";
import { RewriteCard } from "@/components/RewriteCard";
import { FocusAreasCard } from "@/components/FocusAreasCard";
import { MarkdownView } from "@/components/MarkdownView";
import { fmtBand } from "@/lib/utils";
import { Wrench, Sparkles } from "lucide-react";

export function FeedbackPane({
  feedback,
  baseline,
  activeRewriteId,
  setActiveRewriteId,
  onCiteClick,
  unmatchedIds,
  nestedMap,
  overlapMap,
  locationFilter,
  setLocationFilter,
  paneSubtitle,
}: {
  feedback: FeedbackPayload;
  baseline: FeedbackPayload | null;
  activeRewriteId: number | null;
  setActiveRewriteId: (id: number | null) => void;
  onCiteClick: (path: string) => void;
  unmatchedIds: Set<number>;
  nestedMap?: Record<number, number>;
  overlapMap?: Record<number, number[]>;
  locationFilter?: "unmatched" | "nested" | "overlap" | null;
  setLocationFilter?: (f: "unmatched" | "nested" | "overlap" | null) => void;
  paneSubtitle?: string;
}) {
  const [filter, setFilter] = useState<Category | "all">("all");
  // Split addition-suggestions ("missing thesis", "(missing conclusion)") out
  // of the rewrite list so they get their own card and don't pollute the
  // not-in-essay warnings. They aren't real corrections of existing text.
  const { corrections, additions } = useMemo(() => {
    const corr: Rewrite[] = [];
    const add: Rewrite[] = [];
    for (const r of feedback.rewrites) {
      (isAdditionRewrite(r) ? add : corr).push(r);
    }
    return { corrections: corr, additions: add };
  }, [feedback.rewrites]);
  const filtered = useMemo(() => {
    let out = corrections;
    if (locationFilter === "unmatched") {
      out = out.filter((r) => unmatchedIds.has(r.id));
    } else if (locationFilter === "nested") {
      out = out.filter((r) => nestedMap && nestedMap[r.id] !== undefined);
    } else if (locationFilter === "overlap") {
      out = out.filter((r) => overlapMap && overlapMap[r.id] !== undefined);
    }
    if (filter !== "all") out = out.filter((r) => r.category === filter);
    return out;
  }, [corrections, filter, locationFilter, unmatchedIds, nestedMap, overlapMap]);

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-baseline gap-2">
            <span className="text-base">Feedback</span>
            <span className="text-2xl font-bold tabular-nums">{fmtBand(feedback.overall)}</span>
            <span className="text-xs text-muted-foreground">/ 9</span>
          </span>
          {paneSubtitle && <span className="text-[11px] text-muted-foreground">{paneSubtitle}</span>}
        </CardTitle>
        {/*
          Iteration meta (id, tool, convergence, prior chain) is intentionally
          *not* shown here — it's harness noise from a student perspective.
          Power users can still see it via the Sidebar / Scrubber, the Raw
          markdown tab, and the iteration.json fields.
        */}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs defaultValue="structured" className="flex flex-col h-full">
          <div className="px-4 pb-2">
            <TabsList>
              <TabsTrigger value="structured">Structured</TabsTrigger>
              <TabsTrigger value="raw">Raw markdown</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="structured" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full">
              <div className="px-4 pb-4 space-y-3">
                <ScoresCard feedback={feedback} baseline={baseline} defaultExpanded={false} />

                {/* Structural feedback — essay-level shape critique. New schema field. */}
                {feedback.structural_feedback && (
                  <Card>
                    <CardHeader className="pb-1">
                      <CardTitle className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                        <Wrench className="h-3.5 w-3.5" /> Structural feedback
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <MarkdownView>{feedback.structural_feedback}</MarkdownView>
                    </CardContent>
                  </Card>
                )}

                {/* Focus areas — pattern-level drill recommendations. */}
                {feedback.focus_areas && feedback.focus_areas.length > 0 && (
                  <FocusAreasCard areas={feedback.focus_areas} onCiteClick={onCiteClick} />
                )}

                {/* What's working — anchor strengths so the student doesn't over-correct. */}
                {feedback.whats_working && (
                  <Card>
                    <CardHeader className="pb-1">
                      <CardTitle className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5" /> What's working — keep doing this
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <MarkdownView>{feedback.whats_working}</MarkdownView>
                    </CardContent>
                  </Card>
                )}

                {/*
                  "What changed from prior feedback" is intentionally not
                  rendered here — it's harness/iteration meta, not feedback the
                  student needs. It still ships in the JSON payload (so it can
                  be inspected via the Raw markdown tab) and is the basis of
                  the CompareDiff view.
                */}
                {/* Suggested additions — pieces the LLM thinks the candidate
                    should add (thesis, conclusion, transition). NOT highlighted
                    in the essay because there's nothing to highlight. */}
                {additions.length > 0 && (
                  <Card>
                    <CardHeader className="pb-1">
                      <CardTitle className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                        <PlusCircle className="h-3.5 w-3.5" /> Suggested additions ({additions.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-1">
                      {additions.map((a) => (
                        <div key={a.id} className="text-sm border-l-2 border-foreground/15 pl-2.5">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            #{a.id} · {a.original.replace(/^[\(\[]|[\)\]]$/g, "")}
                          </div>
                          <div className="mt-1 flex items-baseline gap-1">
                            <ArrowRight className="h-3 w-3 mt-0.5 shrink-0 text-muted-foreground" />
                            <span className="font-medium">{a.improved}</span>
                          </div>
                          {a.reason && (
                            <p className="mt-1 text-xs text-muted-foreground">{a.reason}</p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <FilterBar
                  filter={filter}
                  setFilter={setFilter}
                  feedback={feedback}
                  correctionsCount={corrections.length}
                  unmatchedCount={unmatchedIds.size}
                  overlapCount={Object.keys(overlapMap ?? {}).length}
                  locationFilter={locationFilter ?? null}
                  setLocationFilter={setLocationFilter}
                />

                <div className="space-y-2">
                  {filtered.map((rw) => (
                    <RewriteCard
                      key={rw.id}
                      rewrite={rw}
                      active={rw.id === activeRewriteId}
                      unmatched={unmatchedIds.has(rw.id)}
                      nestedIn={nestedMap?.[rw.id]}
                      overlapsWith={overlapMap?.[rw.id]}
                      onActivate={() => setActiveRewriteId(rw.id)}
                      onCiteClick={onCiteClick}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-sm text-muted-foreground py-3">
                      No rewrites in this category for this iteration.
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="raw" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full">
              <div className="px-4 pb-4">
                <MarkdownView>{feedback.raw_markdown}</MarkdownView>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function FilterBar({
  filter,
  setFilter,
  feedback,
  correctionsCount,
  unmatchedCount,
  overlapCount,
  locationFilter,
  setLocationFilter,
}: {
  filter: Category | "all";
  setFilter: (c: Category | "all") => void;
  feedback: FeedbackPayload;
  correctionsCount: number;
  unmatchedCount: number;
  overlapCount: number;
  locationFilter: "unmatched" | "nested" | "overlap" | null;
  setLocationFilter?: (f: "unmatched" | "nested" | "overlap" | null) => void;
}) {
  const counts = CATEGORIES.reduce(
    (acc, c) => ((acc[c] = feedback.rewrites.filter((r) => r.category === c && !isAdditionRewrite(r)).length), acc),
    {} as Record<Category, number>,
  );
  const total = correctionsCount;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Button
        size="sm"
        variant={filter === "all" ? "secondary" : "ghost"}
        onClick={() => setFilter("all")}
      >
        all <Badge variant="outline" className="ml-1.5 text-[10px]">{total}</Badge>
      </Button>
      {CATEGORIES.map((c) => (
        counts[c] > 0 && (
          <Button
            key={c}
            size="sm"
            variant={filter === c ? "secondary" : "ghost"}
            onClick={() => setFilter(c)}
          >
            <span
              className="inline-block w-2 h-2 rounded-full mr-1.5"
              style={{ background: `hsl(var(--cat-${CATEGORY_TOKEN[c]}))` }}
              aria-hidden
            />
            {CATEGORY_SHORT[c]} <Badge variant="outline" className="ml-1.5 text-[10px]">{counts[c]}</Badge>
          </Button>
        )
      ))}
      {locationFilter && (
        <Button
          size="sm"
          variant="warning"
          onClick={() => setLocationFilter?.(null)}
          className="ml-auto"
        >
          showing{" "}
          {locationFilter === "unmatched"
            ? "unmatched only"
            : locationFilter === "nested"
              ? "nested only"
              : "overlaps only"}{" "}
          ✕
        </Button>
      )}
      {!locationFilter && (unmatchedCount > 0 || overlapCount > 0) && (
        <div className="ml-auto flex items-center gap-1">
          {overlapCount > 0 && (
            <Badge variant="warning" className="text-[10px]">
              {overlapCount} overlap{overlapCount === 1 ? "" : "s"}
            </Badge>
          )}
          {unmatchedCount > 0 && (
            <Badge variant="warning" className="text-[10px]">
              {unmatchedCount} not in essay
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
