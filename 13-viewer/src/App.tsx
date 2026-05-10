import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import type { IndexPayload, FeedbackPayload, TaskKey, Rewrite } from "@/types";
import { loadIndex, loadFeedback } from "@/lib/data";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import { IterationScrubber } from "@/components/IterationScrubber";
import { ConvergenceSummary } from "@/components/ConvergenceSummary";
import { EssayPane } from "@/components/EssayPane";
import { FeedbackPane } from "@/components/FeedbackPane";
import { CompareDiff } from "@/components/CompareDiff";
import { CitationSheet } from "@/components/CitationSheet";
import { Button } from "@/components/ui/button";
import { GitCompare, Sun, Moon } from "lucide-react";

export default function App() {
  const [index, setIndex] = useState<IndexPayload | null>(null);
  const [task, setTask] = useState<TaskKey>("task1");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackPayload | null>(null);
  const [baseline, setBaseline] = useState<FeedbackPayload | null>(null);
  const [activeRewriteId, setActiveRewriteId] = useState<number | null>(null);
  const [scrollKey, setScrollKey] = useState(0);
  const [compareWithBaseline, setCompareWithBaseline] = useState(false);
  const [citation, setCitation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [unmatchedIds, setUnmatchedIds] = useState<Set<number>>(new Set());
  const [nestedMap, setNestedMap] = useState<Record<number, number>>({});
  const [promptOpen, setPromptOpen] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    loadIndex()
      .then((idx) => { if (!cancelled) setIndex(idx); })
      .catch((e) => { if (!cancelled) setError(String(e)); });
    return () => { cancelled = true; };
  }, []);

  // Default to latest CONVERGED iteration when task changes; clear selection if empty.
  useEffect(() => {
    if (!index) return;
    const its = index.tasks[task]?.iterations ?? [];
    if (its.length === 0) {
      setSelectedId(null);
      setFeedback(null);
      return;
    }
    const ordered = [...its].sort((a, b) => b.iteration - a.iteration);
    const latestConverged = ordered.find((i) => i.convergence === "CONVERGED");
    setSelectedId((latestConverged ?? ordered[0]).id);
  }, [task, index]);

  // Reset per-iteration UI state on payload change so #3 isn't "active" in the next iter.
  useEffect(() => {
    setActiveRewriteId(null);
    setUnmatchedIds(new Set());
  }, [selectedId]);

  // Cancellable feedback loader
  useEffect(() => {
    if (!selectedId) { setFeedback(null); return; }
    let cancelled = false;
    loadFeedback(selectedId)
      .then((p) => { if (!cancelled) setFeedback(p); })
      .catch((e) => { if (!cancelled) setError(String(e)); });
    return () => { cancelled = true; };
  }, [selectedId]);

  const baselineId = useMemo(() => {
    if (!index) return null;
    const its = index.tasks[task]?.iterations ?? [];
    return its.find((i) => i.iteration === 0)?.id ?? null;
  }, [index, task]);

  // Cancellable baseline loader
  useEffect(() => {
    if (!baselineId) { setBaseline(null); return; }
    let cancelled = false;
    loadFeedback(baselineId)
      .then((p) => { if (!cancelled) setBaseline(p); })
      .catch(() => { if (!cancelled) setBaseline(null); });
    return () => { cancelled = true; };
  }, [baselineId]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleMarkClick = useCallback((rw: Rewrite) => {
    setActiveRewriteId(rw.id);
  }, []);
  const handleSetActive = useCallback((id: number | null) => {
    setActiveRewriteId(id);
    setScrollKey((k) => k + 1);
  }, []);
  const onLocationReport = useCallback(
    (info: { unmatched: number[]; nested: Record<number, number> }) => {
      setUnmatchedIds(new Set(info.unmatched));
      setNestedMap(info.nested);
    },
    [],
  );

  // Keyboard shortcuts via stable listener (don't re-bind on every j/k press).
  const navState = useRef({
    ordered: [] as { id: string }[],
    selectedId,
    baselineId,
    citation,
  });
  navState.current = useMemo(() => {
    const its = index?.tasks[task]?.iterations ?? [];
    const ordered = [...its].sort((a, b) => a.iteration - b.iteration).map((i) => ({ id: i.id }));
    return { ordered, selectedId, baselineId, citation };
  }, [index, task, selectedId, baselineId, citation]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      )
        return;
      const { ordered, selectedId, baselineId, citation } = navState.current;
      const idx = ordered.findIndex((i) => i.id === selectedId);
      if (e.key === "j" && idx >= 0 && idx < ordered.length - 1) setSelectedId(ordered[idx + 1].id);
      if (e.key === "k" && idx > 0) setSelectedId(ordered[idx - 1].id);
      if (e.key === "c" && baselineId) setCompareWithBaseline((v) => !v);
      if (e.key === "Escape" && citation) setCitation(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (error) return <ErrorScreen message={error} />;
  if (!index) return <SplashScreen index={index} />;

  const taskBundle = index.tasks[task];
  if (!taskBundle) return <ErrorScreen message={`index.json is missing key "${task}"`} />;
  if (taskBundle.iterations.length === 0)
    return (
      <TooltipProvider delayDuration={200}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            iterations={taskBundle.iterations}
            task={task}
            selectedId={selectedId ?? ""}
            onSelect={setSelectedId}
            onTaskChange={setTask}
            tasks={["task1", "task2"]}
          />
          <main className="flex-1 flex items-center justify-center p-8 text-sm text-muted-foreground">
            <div className="max-w-md space-y-2 text-center">
              <p className="font-semibold text-foreground">No iterations for {task} yet.</p>
              <p>
                Run <code className="rounded bg-muted px-1">npm run extract</code> after the
                benchmark has produced markdown for this task, then{" "}
                <code className="rounded bg-muted px-1">npm run rebuild-index</code>.
              </p>
            </div>
          </main>
        </div>
      </TooltipProvider>
    );
  if (!selectedId || !feedback) return <SplashScreen index={index} />;

  const { essay, iterations } = taskBundle;
  const inCompare = compareWithBaseline && baseline && baselineId !== selectedId;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          iterations={iterations}
          task={task}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onTaskChange={setTask}
          tasks={["task1", "task2"]}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b px-4 py-2 flex items-center gap-3">
            <h1 className="text-sm font-semibold tracking-tight">IELTS Feedback Viewer</h1>
            <div className="text-xs text-muted-foreground">{feedback.id}</div>
            <div className="ml-auto flex items-center gap-2 text-xs">
              <span className="text-muted-foreground hidden md:inline">
                <kbd className="rounded border bg-muted px-1 text-[10px]">j</kbd>/<kbd className="rounded border bg-muted px-1 text-[10px]">k</kbd> nav · <kbd className="rounded border bg-muted px-1 text-[10px]">c</kbd> compare
              </span>
              <Button
                size="sm"
                variant={inCompare ? "secondary" : "ghost"}
                onClick={() => setCompareWithBaseline((v) => !v)}
                disabled={!baseline || baselineId === selectedId}
                aria-pressed={!!inCompare}
              >
                <GitCompare className="h-3.5 w-3.5" />
                {inCompare ? "exit compare" : "compare to baseline"}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                aria-label="toggle theme"
              >
                {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </header>
          <div className="px-4 pt-3 pb-2 border-b space-y-2">
            <ConvergenceSummary iterations={iterations} onJump={setSelectedId} />
            <IterationScrubber
              task={task}
              iterations={iterations}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          <div className="flex-1 grid gap-3 p-3 overflow-hidden grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <EssayPane
              essay={essay}
              feedback={feedback}
              activeRewriteId={activeRewriteId}
              onMarkClick={handleMarkClick}
              scrollKey={scrollKey}
              onLocationReport={onLocationReport}
              promptOpen={promptOpen}
              setPromptOpen={setPromptOpen}
            />
            {inCompare && baseline ? (
              <CompareDiff selected={feedback} baseline={baseline} />
            ) : (
              <FeedbackPane
                feedback={feedback}
                baseline={baseline}
                activeRewriteId={activeRewriteId}
                setActiveRewriteId={handleSetActive}
                onCiteClick={setCitation}
                unmatchedIds={unmatchedIds}
                nestedMap={nestedMap}
              />
            )}
          </div>
        </main>
        <CitationSheet path={citation} onClose={() => setCitation(null)} />
      </div>
    </TooltipProvider>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl space-y-3">
        <h1 className="text-lg font-semibold">Failed to load index</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="text-sm">
          Run <code className="rounded bg-muted px-1 py-0.5">npm run extract</code> from{" "}
          <code className="rounded bg-muted px-1 py-0.5">13-viewer/</code> after the benchmark
          finishes to populate <code className="rounded bg-muted px-1 py-0.5">public/data/</code>.
        </p>
      </div>
    </div>
  );
}

function SplashScreen({ index }: { index: IndexPayload | null }) {
  return (
    <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
      {index ? "loading feedback…" : "loading index…"}
    </div>
  );
}
