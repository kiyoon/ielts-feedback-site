import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { FocusArea } from "@/types";
import { Target } from "lucide-react";

// Pattern-level error categories the candidate should drill, ranked by uplift.
// Each item is rendered with a "drill" row of clickable corpus citations.
export function FocusAreasCard({
  areas,
  onCiteClick,
}: {
  areas: FocusArea[];
  onCiteClick: (path: string) => void;
}) {
  if (areas.length === 0) return null;
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
          <Target className="h-3.5 w-3.5" /> Focus areas — drill these first
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-1">
        {areas.map((a, i) => (
          <div key={`${i}-${a.area}`} className="border-l-2 border-foreground/15 pl-2.5">
            <div className="text-sm font-medium">
              <span className="text-muted-foreground tabular-nums mr-1.5">{i + 1}.</span>
              {a.area}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{a.rationale}</p>
            {a.corpus_drill.length > 0 && (
              <div className="mt-1 flex flex-wrap items-center gap-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">drill:</span>
                {a.corpus_drill.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onCiteClick(c)}
                    className="rounded border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
