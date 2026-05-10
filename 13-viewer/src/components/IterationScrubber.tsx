import { useMemo } from "react";
import type { IterationSummary, TaskKey } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { fmtBand, cn } from "@/lib/utils";

export function IterationScrubber({
  task,
  iterations,
  selectedId,
  onSelect,
}: {
  task: TaskKey;
  iterations: IterationSummary[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const ordered = useMemo(
    () => [...iterations].sort((a, b) => a.iteration - b.iteration),
    [iterations],
  );

  // Sparkline path of overall scores. Auto-range to actual data with a small
  // pad so a baseline score of 4.5 isn't silently clipped.
  const path = useMemo(() => {
    if (ordered.length === 0) return "";
    const w = 100;
    const h = 16;
    const ys = ordered.map((it) => it.overall);
    const min = Math.max(0, Math.min(...ys) - 0.5);
    const max = Math.min(9, Math.max(...ys) + 0.5);
    const range = Math.max(0.5, max - min);
    return ordered
      .map((it, i) => {
        const x = ordered.length === 1 ? 0 : (i / (ordered.length - 1)) * w;
        const y = h - ((it.overall - min) / range) * h;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [ordered]);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {task} · {ordered.length} iteration{ordered.length === 1 ? "" : "s"}
        </h2>
        <div className="text-[11px] text-muted-foreground">
          baseline (left) → latest refinement (right)
        </div>
      </div>
      <div className="relative">
        <svg
          viewBox="0 0 100 16"
          preserveAspectRatio="none"
          className="absolute inset-x-0 -top-1 h-7 opacity-40"
          aria-hidden
        >
          <path d={path} fill="none" stroke="currentColor" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
        </svg>
        <div
          role="radiogroup"
          aria-label="iteration scrubber"
          className="relative flex items-center gap-1 overflow-x-auto pb-1"
        >
          {ordered.map((it) => {
            const selected = it.id === selectedId;
            const isBaseline = it.iteration === 0;
            const ariaLabel = `iteration ${it.iteration}, ${it.tool}, band ${fmtBand(it.overall)}, ${it.convergence.toLowerCase()}`;
            return (
              <Tooltip key={it.id}>
                <TooltipTrigger asChild>
                  <button
                    role="radio"
                    aria-checked={selected}
                    aria-label={ariaLabel}
                    onClick={() => onSelect(it.id)}
                    className={cn(
                      "shrink-0 transition-all border focus-visible:outline-none",
                      selected
                        ? "h-3.5 w-3.5 ring-2 ring-ring border-foreground/30"
                        : "h-2.5 w-2.5 border-transparent hover:scale-125",
                      shapeClass(it),
                      isBaseline ? "rounded-none" : "rounded-full",
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-0.5 text-xs">
                    <div className="font-semibold">
                      {isBaseline ? "Baseline (no repo)" : `Iter ${String(it.iteration).padStart(2, "0")}`}
                    </div>
                    <div className="text-muted-foreground">{it.tool}</div>
                    <div>
                      band <span className="tabular-nums">{fmtBand(it.overall)}</span>
                    </div>
                    <div className="text-muted-foreground">{it.convergence.toLowerCase()}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function shapeClass(it: IterationSummary): string {
  if (it.iteration === 0) return "bg-muted-foreground"; // square baseline
  if (it.convergence === "CONVERGED") return "bg-[hsl(var(--success))]";
  if (it.convergence === "REFINING") return "bg-[hsl(var(--warning))]";
  return "bg-muted-foreground";
}
