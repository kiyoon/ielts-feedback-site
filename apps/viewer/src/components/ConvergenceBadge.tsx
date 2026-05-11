import { Badge } from "@/components/ui/badge";
import type { Convergence } from "@/types";
import { Check, Loader2, HelpCircle } from "lucide-react";

export function ConvergenceBadge({ verdict, compact }: { verdict: Convergence; compact?: boolean }) {
  if (verdict === "CONVERGED")
    return (
      <Badge variant="success" className="gap-1">
        <Check className="h-3 w-3" /> {compact ? "OK" : "converged"}
      </Badge>
    );
  if (verdict === "REFINING")
    return (
      <Badge variant="warning" className="gap-1">
        <Loader2 className="h-3 w-3" /> {compact ? "···" : "refining"}
      </Badge>
    );
  return (
    <Badge variant="outline" className="gap-1 text-muted-foreground">
      <HelpCircle className="h-3 w-3" /> {compact ? "?" : "unknown"}
    </Badge>
  );
}

// Color-blind-safe shape glyph for tight spaces (sidebar rows, scrubber dots)
export function ConvergenceGlyph({ verdict }: { verdict: Convergence }) {
  if (verdict === "CONVERGED") return <span aria-label="converged" className="shape-converged inline-block" />;
  if (verdict === "REFINING") return <span aria-label="refining" className="shape-refining inline-block" />;
  return <span aria-label="unknown" className="shape-unknown inline-block" />;
}
