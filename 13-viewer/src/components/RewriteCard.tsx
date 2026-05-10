import { useEffect, useRef } from "react";
import type { Rewrite } from "@/types";
import { CATEGORY_LABEL, CATEGORY_SHORT, CATEGORY_TOKEN } from "@/types";
import { ArrowRight, Quote, AlertTriangle, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Rewrite card uses a div with role="button" for the activation surface, so
// the inner citation chips can be real <button>s without nesting interactive
// content (HTML disallows that).
export function RewriteCard({
  rewrite,
  active,
  unmatched,
  nestedIn,
  onActivate,
  onCiteClick,
}: {
  rewrite: Rewrite;
  active?: boolean;
  unmatched?: boolean;
  nestedIn?: number;       // id of the larger rewrite whose span covers this one
  onActivate: () => void;
  onCiteClick?: (path: string) => void;
}) {
  const tok = CATEGORY_TOKEN[rewrite.category];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active && ref.current) {
      ref.current.focus({ preventScroll: false });
    }
  }, [active]);

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      data-active={active || undefined}
      data-rwcard-id={rewrite.id}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      aria-label={`Rewrite ${rewrite.id}: replace "${rewrite.original}" with "${rewrite.improved}". Category ${CATEGORY_LABEL[rewrite.category]}.`}
      className={cn(
        "group block w-full text-left rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none cursor-pointer",
        active && "ring-2 ring-ring shadow-md animate-pulse-once",
        unmatched && "opacity-70 border-dashed",
        nestedIn !== undefined && "border-dashed",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Badge
          variant="outline"
          className="text-[10px]"
          style={{
            background: `hsl(var(--cat-${tok}) / 0.15)`,
            borderColor: `hsl(var(--cat-${tok}) / 0.5)`,
          }}
        >
          {CATEGORY_SHORT[rewrite.category]} · {CATEGORY_LABEL[rewrite.category].split(" ")[0]}
        </Badge>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          {unmatched && (
            <span className="inline-flex items-center gap-0.5 text-[hsl(var(--warning))]">
              <AlertTriangle className="h-3 w-3" />
              not in essay
            </span>
          )}
          {!unmatched && nestedIn !== undefined && (
            <span className="inline-flex items-center gap-0.5 text-muted-foreground">
              <Layers className="h-3 w-3" />
              covered by #{nestedIn}
            </span>
          )}
          <span>#{rewrite.id}</span>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-[auto_1fr] items-start gap-x-2 gap-y-1 text-sm">
        <Quote className="h-3 w-3 mt-1 text-muted-foreground" />
        <div className="line-through decoration-[hsl(var(--cat-gra))]/70 decoration-2 text-muted-foreground">
          {rewrite.original}
        </div>
        <ArrowRight className="h-3 w-3 mt-1 text-muted-foreground" />
        <div className="font-medium">{rewrite.improved}</div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{rewrite.reason}</p>
      {rewrite.citations && rewrite.citations.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {rewrite.citations.map((c, i) => (
            <button
              type="button"
              key={`${c}-${i}`}
              onClick={(e) => {
                e.stopPropagation();
                onCiteClick?.(c);
              }}
              onKeyDown={(e) => {
                // Stop the event from bubbling up to the card's keydown handler
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                }
              }}
              className="rounded border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
              aria-label={`Open corpus citation ${c}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
