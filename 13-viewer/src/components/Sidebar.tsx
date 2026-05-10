import { useEffect, useMemo, useRef, useState } from "react";
import type { TaskKey, IterationSummary, Tool, IndexPayload } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConvergenceGlyph } from "@/components/ConvergenceBadge";
import { fmtBand, cn } from "@/lib/utils";
import { FileText } from "lucide-react";

type FilterTool = "all" | Tool;
type FilterStatus = "all" | "converged";

export function Sidebar({
  index,
  iterations,
  task,
  selectedId,
  onSelect,
  onTaskChange,
}: {
  index: IndexPayload;
  iterations: IterationSummary[];
  task: TaskKey;
  selectedId: string;
  onSelect: (id: string) => void;
  onTaskChange: (t: TaskKey) => void;
}) {
  const [filterTool, setFilterTool] = useState<FilterTool>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const ref = useRef<HTMLLIElement>(null);

  const filtered = useMemo(() => {
    return [...iterations]
      .sort((a, b) => b.iteration - a.iteration)
      .filter((it) => filterTool === "all" || it.tool === filterTool)
      .filter((it) => filterStatus === "all" || it.convergence === "CONVERGED");
  }, [iterations, filterTool, filterStatus]);

  useEffect(() => {
    ref.current?.scrollIntoView({ block: "nearest" });
  }, [selectedId, filtered]);

  // Build a per-essay summary for the chat-style list at the top
  const essayList = useMemo(() => {
    return Object.entries(index.tasks).map(([key, bundle]) => {
      const its = bundle.iterations;
      const ordered = [...its].sort((a, b) => b.iteration - a.iteration);
      const latest = ordered[0];
      const title =
        bundle.title ||
        bundle.label ||
        (key === "task1" ? "Task 1" : key === "task2" ? "Task 2" : key.toUpperCase());
      return {
        key,
        title,
        sublabel: bundle.label && bundle.label !== title ? bundle.label : "",
        wordCount: bundle.essay.word_count,
        iterCount: its.length,
        latestBand: latest?.overall,
      };
    });
  }, [index]);

  return (
    <aside
      id="viewer-sidebar-content"
      className="relative flex h-full w-full flex-col border-r bg-card"
    >
      {/* Chat-style essay list */}
      <div className="px-2 py-2 border-b">
        <div className="flex items-center justify-between gap-2 px-2 pb-1.5">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            essays
          </div>
        </div>
        <ul className="space-y-0.5">
          {essayList.map((e) => {
            const active = e.key === task;
            return (
              <li key={e.key}>
                <button
                  onClick={() => onTaskChange(e.key)}
                  aria-pressed={active}
                  className={cn(
                    "w-full text-left rounded-md px-2 py-1.5 transition-colors focus-visible:outline-none",
                    active
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-accent",
                  )}
                  title={e.title}
                >
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm font-medium">{e.title}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 pl-[1.05rem] text-[10px] text-muted-foreground">
                    {e.sublabel && <span>{e.sublabel}</span>}
                    <span>{e.wordCount}w</span>
                    <span>{e.iterCount} iter{e.iterCount === 1 ? "" : "s"}</span>
                    {e.latestBand !== undefined && (
                      <span className="ml-auto tabular-nums font-medium text-foreground">
                        {fmtBand(e.latestBand)}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Iteration filter chips */}
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
