import type { IterationSummary } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Check, GitMerge, AlertCircle } from "lucide-react";
import { fmtBand } from "@/lib/utils";

// Pre-computes "first converged at iter X", "stable since iter Y" so the UI
// can answer the W6 workflow ("when did the chain stop changing?") at a glance.
export function chainState(iters: IterationSummary[]) {
  const ordered = [...iters].filter((i) => i.iteration > 0).sort((a, b) => a.iteration - b.iteration);
  const firstConverged = ordered.find((i) => i.convergence === "CONVERGED");
  // "stable since": walk back from the latest iteration; the answer is the
  // earliest iteration whose score still matches the latest (i.e. the score
  // hasn't drifted since then). Stops at the first divergent neighbour.
  let stableSince: IterationSummary | null = ordered[ordered.length - 1] ?? null;
  for (let i = ordered.length - 1; i > 0; i--) {
    if (Math.abs(ordered[i].overall - ordered[i - 1].overall) > 0.01) break;
    stableSince = ordered[i - 1];
  }
  const latest = ordered[ordered.length - 1] ?? null;
  const totalConverged = ordered.filter((i) => i.convergence === "CONVERGED").length;
  return { firstConverged, stableSince, latest, totalConverged, total: ordered.length };
}

export function ConvergenceSummary({
  iterations,
  onJump,
}: {
  iterations: IterationSummary[];
  onJump: (id: string) => void;
}) {
  const s = chainState(iterations);
  if (s.total === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        no iterations yet — run the benchmark and `bun run extract`.
      </p>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <Badge variant="outline" className="gap-1">
        chain length <span className="font-semibold">{s.total}</span>
      </Badge>
      {s.firstConverged ? (
        <button
          onClick={() => onJump(s.firstConverged!.id)}
          className="inline-flex items-center gap-1 rounded-md border border-transparent bg-[hsl(var(--success)/0.15)] px-2 py-0.5 text-[hsl(var(--success))] hover:border-[hsl(var(--success)/0.5)] focus-visible:outline-none"
        >
          <Check className="h-3 w-3" /> first converged · iter {s.firstConverged.iteration}
        </button>
      ) : (
        <Badge variant="warning" className="gap-1">
          <AlertCircle className="h-3 w-3" /> not converged yet
        </Badge>
      )}
      {s.stableSince && (
        <button
          onClick={() => onJump(s.stableSince!.id)}
          className="inline-flex items-center gap-1 rounded-md border bg-secondary px-2 py-0.5 hover:bg-accent focus-visible:outline-none"
        >
          <GitMerge className="h-3 w-3" /> stable since · iter {s.stableSince.iteration} ({fmtBand(s.stableSince.overall)})
        </button>
      )}
      {s.latest && (
        <button
          onClick={() => onJump(s.latest!.id)}
          className="inline-flex items-center gap-1 rounded-md border bg-secondary px-2 py-0.5 hover:bg-accent focus-visible:outline-none"
        >
          latest · iter {s.latest.iteration} ({fmtBand(s.latest.overall)})
        </button>
      )}
      <span className="text-muted-foreground">
        {s.totalConverged}/{s.total} CONVERGED
      </span>
    </div>
  );
}
