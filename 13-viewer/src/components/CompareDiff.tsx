import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FeedbackPayload, Rewrite, Category } from "@/types";
import { CATEGORY_SHORT, CATEGORY_TOKEN } from "@/types";
import { fmtBand, bandDelta, cn } from "@/lib/utils";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { MarkdownView } from "@/components/MarkdownView";
import { useMemo } from "react";

// Diff view for compare mode. Instead of stacking two full feedback panes
// vertically, we surface what's actually different:
//   - per-criterion score deltas
//   - new (in selected, not in baseline) rewrites
//   - removed (in baseline, not in selected) rewrites
//   - what_changed prose at the top
// Uses the existing fields in the payload — no new schema needed.
export function CompareDiff({
  selected,
  baseline,
}: {
  selected: FeedbackPayload;
  baseline: FeedbackPayload;
}) {
  const newRewrites = useMemo(
    () => diffRewrites(selected.rewrites, baseline.rewrites),
    [selected.rewrites, baseline.rewrites],
  );
  const removedRewrites = useMemo(
    () => diffRewrites(baseline.rewrites, selected.rewrites),
    [selected.rewrites, baseline.rewrites],
  );
  const overlapCount = selected.rewrites.length - newRewrites.length;
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-baseline justify-between gap-2">
          <span>Diff vs baseline</span>
          <span className="text-xs text-muted-foreground">
            <span className="mr-2">selected: <code>{selected.id}</code></span>
            <span>baseline: <code>{baseline.id}</code></span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-3">
        {/* Score deltas */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
              Score deltas
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
            <Delta label="Task Response" a={selected.scores.task_response.band} b={baseline.scores.task_response.band} />
            <Delta label="Coherence"     a={selected.scores.coherence.band}     b={baseline.scores.coherence.band} />
            <Delta label="Lexical"       a={selected.scores.lexical.band}       b={baseline.scores.lexical.band} />
            <Delta label="Grammar"       a={selected.scores.grammar.band}       b={baseline.scores.grammar.band} />
            <Delta label="Overall" big a={selected.overall} b={baseline.overall} />
          </CardContent>
        </Card>

        {/* what_changed */}
        {selected.what_changed && (
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                Selected iteration says it changed:
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <MarkdownView>{selected.what_changed}</MarkdownView>
            </CardContent>
          </Card>
        )}

        {/* New rewrites */}
        <RewriteDiffSection
          title={`Added (${newRewrites.length})`}
          subtitle="present in selected iteration, missing from baseline"
          icon={<ChevronUp className="h-3 w-3 text-[hsl(var(--success))]" />}
          rewrites={newRewrites}
        />

        {/* Removed rewrites */}
        <RewriteDiffSection
          title={`Dropped (${removedRewrites.length})`}
          subtitle="present in baseline, no longer flagged in selected"
          icon={<ChevronDown className="h-3 w-3 text-[hsl(var(--warning))]" />}
          rewrites={removedRewrites}
          tone="muted"
        />

        <p className="text-[11px] text-muted-foreground">
          {overlapCount}/{selected.rewrites.length} suggestions overlap with the baseline.
          Equality is computed by the candidate's original phrase, case-insensitive.
        </p>
      </CardContent>
    </Card>
  );
}

function Delta({ label, a, b, big }: { label: string; a: number; b: number; big?: boolean }) {
  const d = a - b;
  const same = Math.abs(d) < 0.01;
  return (
    <div className={cn(big ? "col-span-2 border-t pt-2 mt-1" : "")}>
      <div className="flex items-baseline justify-between">
        <span className={cn(big ? "font-semibold" : "text-muted-foreground")}>{label}</span>
        <span className="tabular-nums">
          <span className="text-muted-foreground">{fmtBand(b)}</span>
          <ArrowRight className="inline h-3 w-3 mx-1 text-muted-foreground" />
          <span className="font-semibold">{fmtBand(a)}</span>
          <span
            className={cn(
              "ml-2 text-xs",
              same ? "text-muted-foreground" : d > 0 ? "text-[hsl(var(--success))]" : "text-[hsl(var(--warning))]",
            )}
          >
            {same ? "±0" : bandDelta(a, b)}
          </span>
        </span>
      </div>
    </div>
  );
}

function RewriteDiffSection({
  title,
  subtitle,
  icon,
  rewrites,
  tone,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  rewrites: Rewrite[];
  tone?: "muted";
}) {
  if (rewrites.length === 0)
    return (
      <Card className={cn(tone === "muted" && "opacity-70")}>
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
            {icon} {title}
          </CardTitle>
          <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">none</CardContent>
      </Card>
    );
  return (
    <Card className={cn(tone === "muted" && "opacity-80")}>
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
          {icon} {title}
        </CardTitle>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {rewrites.map((r) => (
          <div key={r.id} className="text-sm flex items-baseline gap-2">
            <Badge
              variant="outline"
              className="text-[10px] shrink-0"
              style={{
                background: `hsl(var(--cat-${CATEGORY_TOKEN[r.category as Category]}) / 0.15)`,
                borderColor: `hsl(var(--cat-${CATEGORY_TOKEN[r.category as Category]}) / 0.5)`,
              }}
            >
              {CATEGORY_SHORT[r.category as Category]}
            </Badge>
            <span className="line-through text-muted-foreground">{r.original}</span>
            <ArrowRight className="h-3 w-3 mt-1 shrink-0 text-muted-foreground" />
            <span className="font-medium">{r.improved}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function diffRewrites(a: Rewrite[], b: Rewrite[]): Rewrite[] {
  const bSet = new Set(b.map((r) => norm(r.original)));
  return a.filter((r) => !bSet.has(norm(r.original)));
}
function norm(s: string) {
  return s.trim().toLowerCase();
}
