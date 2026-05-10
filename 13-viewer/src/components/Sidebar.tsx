import { useEffect, useMemo, useRef, useState } from "react";
import type { TaskKey, IterationSummary, Tool } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConvergenceGlyph } from "@/components/ConvergenceBadge";
import { fmtBand, cn } from "@/lib/utils";

type FilterTool = "all" | Tool;
type FilterStatus = "all" | "converged";

export function Sidebar({
  iterations,
  task,
  selectedId,
  onSelect,
  onTaskChange,
  tasks,
}: {
  iterations: IterationSummary[];
  task: TaskKey;
  selectedId: string;
  onSelect: (id: string) => void;
  onTaskChange: (t: TaskKey) => void;
  tasks: TaskKey[];
}) {
  const [filterTool, setFilterTool] = useState<FilterTool>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const ref = useRef<HTMLLIElement>(null);

  const filtered = useMemo(() => {
    return [...iterations]
      .sort((a, b) => b.iteration - a.iteration) // descending — latest at top
      .filter((it) => filterTool === "all" || it.tool === filterTool)
      .filter((it) => filterStatus === "all" || it.convergence === "CONVERGED");
  }, [iterations, filterTool, filterStatus]);

  // Auto-scroll the selected row into view whenever it changes OR when the
  // filtered list changes (e.g. user clears a filter that was hiding the row).
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "nearest" });
  }, [selectedId, filtered]);

  return (
    <aside className="flex flex-col h-full w-60 shrink-0 border-r bg-card">
      <div className="p-3 border-b space-y-2">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">essay</div>
        <div className="flex gap-1">
          {tasks.map((t) => (
            <button
              key={t}
              onClick={() => onTaskChange(t)}
              className={cn(
                "flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none",
                t === task
                  ? "bg-secondary text-secondary-foreground border-foreground/20"
                  : "hover:bg-accent",
              )}
              aria-pressed={t === task}
            >
              {t === "task1" ? "Task 1" : "Task 2"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 py-2 border-b space-y-1.5 text-[11px]">
        <div className="text-muted-foreground uppercase tracking-wider">filter</div>
        <div className="flex flex-wrap gap-1">
          {(["all", "codex", "claude", "baseline"] as FilterTool[]).map((t) => (
            <button
              key={t}
              onClick={() => setFilterTool(t)}
              className={cn(
                "rounded-md border px-1.5 py-0.5 capitalize focus-visible:outline-none",
                filterTool === t ? "bg-secondary border-foreground/20" : "hover:bg-accent",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {(["all", "converged"] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "rounded-md border px-1.5 py-0.5 capitalize focus-visible:outline-none",
                filterStatus === s ? "bg-secondary border-foreground/20" : "hover:bg-accent",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wider text-muted-foreground">
        iterations · showing {filtered.length}/{iterations.length}
      </div>
      <ScrollArea className="flex-1">
        <ul className="px-1 pb-3" role="listbox" aria-label="iterations">
          {filtered.map((it) => {
            const isSelected = it.id === selectedId;
            const isBaseline = it.iteration === 0;
            return (
              <li key={it.id} ref={isSelected ? ref : undefined}>
                <button
                  onClick={() => onSelect(it.id)}
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors focus-visible:outline-none",
                    isSelected ? "bg-secondary" : "hover:bg-accent",
                  )}
                >
                  <span
                    className={cn(
                      "tabular-nums w-7 text-center font-mono text-[11px]",
                      isBaseline ? "text-muted-foreground" : "",
                    )}
                  >
                    {String(it.iteration).padStart(2, "0")}
                  </span>
                  <span className="text-muted-foreground capitalize w-12 truncate">
                    {it.tool === "baseline" ? "base" : it.tool}
                  </span>
                  <span className="tabular-nums font-medium ml-auto">{fmtBand(it.overall)}</span>
                  <ConvergenceGlyph verdict={it.convergence} />
                </button>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
      <div className="border-t p-3 text-[11px] text-muted-foreground space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="shape-converged" /> CONVERGED
        </div>
        <div className="flex items-center gap-1.5">
          <span className="shape-refining" /> refining
        </div>
        <div className="flex items-center gap-1.5">
          <span className="shape-unknown" /> unknown
        </div>
      </div>
    </aside>
  );
}
