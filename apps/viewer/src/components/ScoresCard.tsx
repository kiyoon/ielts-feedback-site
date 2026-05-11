import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { FeedbackPayload } from "@/types";
import { CATEGORY_LABEL, CATEGORY_SHORT, CATEGORY_TOKEN, type Category } from "@/types";
import { fmtBand, bandDelta, clamp, cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const CRITERIA: Exclude<Category, "spelling">[] = [
  "task_response",
  "coherence",
  "lexical",
  "grammar",
];

const TARGET = 7.0;

export function ScoresCard({
  feedback,
  baseline,
  defaultExpanded = false,
}: {
  feedback: FeedbackPayload;
  baseline?: FeedbackPayload | null;
  defaultExpanded?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Scores</span>
          <span className="flex items-baseline gap-2">
            {baseline && Math.abs(baseline.overall - feedback.overall) > 0.01 && (
              <span
                className={cn(
                  "text-xs font-normal",
                  feedback.overall > baseline.overall
                    ? "text-[hsl(var(--success))]"
                    : "text-[hsl(var(--warning))]",
                )}
              >
                {bandDelta(feedback.overall, baseline.overall)} vs baseline
              </span>
            )}
            <span className="text-2xl font-bold">{fmtBand(feedback.overall)}</span>
          </span>
        </CardTitle>
        <p className="text-xs text-muted-foreground">{feedback.overall_rationale}</p>
      </CardHeader>
      <CardContent className="space-y-1">
        {CRITERIA.map((key) => (
          <Row
            key={key}
            criterion={key}
            score={feedback.scores[key]}
            baselineBand={baseline?.scores[key]?.band}
            defaultExpanded={defaultExpanded}
          />
        ))}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
          <span>0</span>
          <span className="tabular-nums">target = 7.0</span>
          <span>9</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({
  criterion,
  score,
  baselineBand,
  defaultExpanded,
}: {
  criterion: Exclude<Category, "spelling">;
  score: FeedbackPayload["scores"]["task_response"];
  baselineBand?: number;
  defaultExpanded: boolean;
}) {
  const [open, setOpen] = useState(defaultExpanded);
  const pct = clamp((score.band / 9) * 100, 0, 100);
  const targetPct = (TARGET / 9) * 100;
  const tok = CATEGORY_TOKEN[criterion];
  return (
    <div className="border-b last:border-b-0 py-1.5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 text-xs hover:bg-accent/40 rounded px-1 py-0.5 -mx-1 focus-visible:outline-none"
      >
        <span className="flex items-center gap-2 font-medium">
          <ChevronRight
            className={cn("h-3 w-3 transition-transform", open && "rotate-90")}
          />
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: `hsl(var(--cat-${tok}))` }}
            aria-hidden
          />
          <span className="inline-block w-7 text-muted-foreground">
            {CATEGORY_SHORT[criterion]}
          </span>
          {CATEGORY_LABEL[criterion]}
        </span>
        <span className="tabular-nums">
          {fmtBand(score.band)}
          {baselineBand !== undefined && Math.abs(baselineBand - score.band) > 0.01 && (
            <span
              className={cn(
                "ml-1",
                score.band > baselineBand
                  ? "text-[hsl(var(--success))]"
                  : "text-[hsl(var(--warning))]",
              )}
            >
              ({bandDelta(score.band, baselineBand)})
            </span>
          )}
        </span>
      </button>
      <div className="relative mt-1 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full"
          style={{
            width: `${pct}%`,
            opacity: 0.85,
            background: `hsl(var(--cat-${tok}))`,
          }}
        />
        <div
          className="absolute inset-y-0 w-px bg-foreground/40"
          style={{ left: `${targetPct}%` }}
          aria-label="band 7 target"
        />
      </div>
      {open && (
        <div className="mt-2 space-y-2 text-xs animate-fade-in">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
              descriptor evidence
            </div>
            <div className="font-mono text-[11px] break-words">{score.descriptor_evidence}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
              justification
            </div>
            <div>{score.justification}</div>
          </div>
        </div>
      )}
    </div>
  );
}
