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
import {
  GitCompare,
  GripVertical,
  Sun,
  Moon,
} from "lucide-react";
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
  usePanelRef,
  type Layout,
  type PanelSize,
} from "react-resizable-panels";

export default function App() {
  const [index, setIndex] = useState<IndexPayload | null>(null);
  // Default to w4 (the most recent real essay) when present; the snap-to-existing
  // effect below promotes the first available key if w4 isn't in the index.
  const [task, setTask] = useState<TaskKey>("w4");
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
  const [overlapMap, setOverlapMap] = useState<Record<number, number[]>>({});
  const [locationFilter, setLocationFilter] = useState<"unmatched" | "nested" | "overlap" | null>(null);
  const [promptOpen, setPromptOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("sidebar-collapsed") === "true";
  });
  const [essayCollapsed, setEssayCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("essay-pane-collapsed") === "true";
  });
  const [feedbackCollapsed, setFeedbackCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("feedback-pane-collapsed") === "true";
  });
  const sidebarPanelRef = usePanelRef();
  const essayPanelRef = usePanelRef();
  const feedbackPanelRef = usePanelRef();
  const { defaultLayout: shellDefaultLayout, onLayoutChanged: onShellLayoutChanged } = useDefaultLayout({
    id: "viewer-sidebar-layout",
    panelIds: ["viewer-sidebar", "viewer-main"],
  });
  const { defaultLayout: contentDefaultLayout, onLayoutChanged: onContentLayoutChanged } = useDefaultLayout({
    id: "viewer-content-layout",
    panelIds: ["essay-pane", "feedback-pane"],
  });

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
    setNestedMap({});
    setOverlapMap({});
    setLocationFilter(null);
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

  useEffect(() => {
    window.localStorage.setItem("sidebar-collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    window.localStorage.setItem("essay-pane-collapsed", String(essayCollapsed));
  }, [essayCollapsed]);

  useEffect(() => {
    window.localStorage.setItem("feedback-pane-collapsed", String(feedbackCollapsed));
  }, [feedbackCollapsed]);

  const handleSidebarLayoutChanged = useCallback(
    (layout: Layout) => {
      onShellLayoutChanged?.(layout);
      const sidebarSize = layout["viewer-sidebar"];
      if (typeof sidebarSize === "number") setSidebarCollapsed(sidebarSize <= 0.5);
    },
    [onShellLayoutChanged],
  );

  const handleSidebarResize = useCallback((size: PanelSize) => {
    const nextCollapsed = size.inPixels <= 1 || size.asPercentage <= 0.5;
    setSidebarCollapsed((current) => (current === nextCollapsed ? current : nextCollapsed));
  }, []);

  const handleContentLayoutChanged = useCallback(
    (layout: Layout) => {
      onContentLayoutChanged?.(layout);
      const essaySize = layout["essay-pane"];
      const feedbackSize = layout["feedback-pane"];
      if (typeof essaySize === "number") setEssayCollapsed(essaySize <= 0.5);
      if (typeof feedbackSize === "number") setFeedbackCollapsed(feedbackSize <= 0.5);
    },
    [onContentLayoutChanged],
  );

  const handleEssayResize = useCallback((size: PanelSize) => {
    const nextCollapsed = size.inPixels <= 1 || size.asPercentage <= 0.5;
    setEssayCollapsed((current) => (current === nextCollapsed ? current : nextCollapsed));
  }, []);

  const handleFeedbackResize = useCallback((size: PanelSize) => {
    const nextCollapsed = size.inPixels <= 1 || size.asPercentage <= 0.5;
    setFeedbackCollapsed((current) => (current === nextCollapsed ? current : nextCollapsed));
  }, []);

  const handleMarkClick = useCallback((rw: Rewrite) => {
    setActiveRewriteId(rw.id);
  }, []);
  const handleSetActive = useCallback((id: number | null) => {
    setActiveRewriteId(id);
    setScrollKey((k) => k + 1);
  }, []);
  const onLocationReport = useCallback(
    (info: {
      unmatched: number[];
      nested: Record<number, number>;
      overlaps: Record<number, number[]>;
    }) => {
      setUnmatchedIds(new Set(info.unmatched));
      setNestedMap(info.nested);
      setOverlapMap(info.overlaps);
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
        <Group
          id="viewer-shell"
          orientation="horizontal"
          defaultLayout={shellDefaultLayout}
          onLayoutChanged={handleSidebarLayoutChanged}
          resizeTargetMinimumSize={{ fine: 12, coarse: 36 }}
          className="h-screen w-full"
        >
          <Panel
            id="viewer-sidebar"
            panelRef={sidebarPanelRef}
            collapsible
            collapsedSize="0px"
            defaultSize={sidebarCollapsed ? "0px" : "200px"}
            minSize="120px"
            maxSize="28%"
            groupResizeBehavior="preserve-pixel-size"
            onResize={handleSidebarResize}
            className="h-full min-h-0 min-w-0"
            style={{ overflow: "hidden" }}
          >
            {!sidebarCollapsed && (
              <Sidebar
                index={index}
                iterations={taskBundle.iterations}
                task={task}
                selectedId={selectedId ?? ""}
                onSelect={setSelectedId}
                onTaskChange={setTask}
              />
            )}
          </Panel>
          <SidebarResizeHandle />
          <Panel
            id="viewer-main"
            minSize="180px"
            className="h-full min-h-0 min-w-0"
            style={{ overflow: "hidden" }}
          >
            <main className="relative flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
              <div className="max-w-md space-y-2 text-center">
                <p className="font-semibold text-foreground">No iterations for {task} yet.</p>
                <p>
                  Run <code className="rounded bg-muted px-1">bun run extract</code> after the
                  benchmark has produced markdown for this task, then{" "}
                  <code className="rounded bg-muted px-1">bun run rebuild-index</code>.
                </p>
              </div>
            </main>
          </Panel>
        </Group>
      </TooltipProvider>
    );
  if (!selectedId || !feedback) return <SplashScreen index={index} />;

  const { essay, iterations } = taskBundle;
  const inCompare = compareWithBaseline && baseline && baselineId !== selectedId;

  return (
    <TooltipProvider delayDuration={200}>
      <Group
        id="viewer-shell"
        orientation="horizontal"
        defaultLayout={shellDefaultLayout}
        onLayoutChanged={handleSidebarLayoutChanged}
        resizeTargetMinimumSize={{ fine: 12, coarse: 36 }}
        className="h-screen w-full"
      >
        <Panel
          id="viewer-sidebar"
          panelRef={sidebarPanelRef}
          collapsible
          collapsedSize="0px"
          defaultSize={sidebarCollapsed ? "0px" : "200px"}
          minSize="120px"
          maxSize="28%"
          groupResizeBehavior="preserve-pixel-size"
          onResize={handleSidebarResize}
          className="h-full min-h-0 min-w-0"
          style={{ overflow: "hidden" }}
        >
          {!sidebarCollapsed && (
            <Sidebar
              index={index}
              iterations={iterations}
              task={task}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onTaskChange={setTask}
            />
          )}
        </Panel>
        <SidebarResizeHandle />
        <Panel
          id="viewer-main"
          minSize="180px"
          className="h-full min-h-0 min-w-0"
          style={{ overflow: "hidden" }}
        >
          <main className="h-full flex flex-col overflow-hidden">
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
            <div className="flex-1 overflow-hidden p-3">
              <Group
                id="viewer-content"
                orientation="horizontal"
                defaultLayout={contentDefaultLayout}
                onLayoutChanged={handleContentLayoutChanged}
                resizeTargetMinimumSize={{ fine: 12, coarse: 36 }}
                className="h-full w-full"
              >
                <Panel
                  id="essay-pane"
                  panelRef={essayPanelRef}
                  collapsible
                  collapsedSize="0px"
                  defaultSize={essayCollapsed ? "0px" : "50%"}
                  minSize="110px"
                  onResize={handleEssayResize}
                  className="h-full min-h-0 min-w-0"
                  style={{ overflow: "hidden" }}
                >
                  {!essayCollapsed && (
                    <EssayPane
                      essay={essay}
                      feedback={feedback}
                      activeRewriteId={activeRewriteId}
                      onMarkClick={handleMarkClick}
                      scrollKey={scrollKey}
                      onLocationReport={onLocationReport}
                      promptOpen={promptOpen}
                      setPromptOpen={setPromptOpen}
                      onSetLocationFilter={setLocationFilter}
                    />
                  )}
                </Panel>
                <PaneResizeHandle />
                <Panel
                  id="feedback-pane"
                  panelRef={feedbackPanelRef}
                  collapsible
                  collapsedSize="0px"
                  defaultSize={feedbackCollapsed ? "0px" : "50%"}
                  minSize="150px"
                  onResize={handleFeedbackResize}
                  className="h-full min-h-0 min-w-0"
                  style={{ overflow: "hidden" }}
                >
                  {!feedbackCollapsed &&
                    (inCompare && baseline ? (
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
                        overlapMap={overlapMap}
                        locationFilter={locationFilter}
                        setLocationFilter={setLocationFilter}
                      />
                    ))}
                </Panel>
              </Group>
            </div>
          </main>
        </Panel>
      </Group>
      <CitationSheet path={citation} onClose={() => setCitation(null)} />
    </TooltipProvider>
  );
}

function SidebarResizeHandle() {
  return (
    <Separator
      id="viewer-sidebar-resize"
      aria-label="Resize or collapse sidebar (drag, or use ArrowLeft and ArrowRight keys)"
      className="group relative z-20 flex w-2 cursor-col-resize items-center justify-center border-x bg-muted shadow-[inset_1px_0_0_hsl(var(--background)/0.45),inset_-1px_0_0_hsl(var(--background)/0.45)] hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
    >
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
      <GripVertical className="relative h-3.5 w-3.5 opacity-80 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
    </Separator>
  );
}

function PaneResizeHandle() {
  return (
    <Separator
      id="viewer-content-resize"
      aria-label="Resize or collapse essay and feedback panes (drag, or use ArrowLeft and ArrowRight keys)"
      className="group relative z-20 mx-0.5 flex w-2 cursor-col-resize items-center justify-center rounded-sm border bg-muted shadow-[inset_1px_0_0_hsl(var(--background)/0.45),inset_-1px_0_0_hsl(var(--background)/0.45)] hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
    >
      <span className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-border" />
      <GripVertical className="relative h-3.5 w-3.5 opacity-85 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
    </Separator>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl space-y-3">
        <h1 className="text-lg font-semibold">Failed to load index</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="text-sm">
          Run <code className="rounded bg-muted px-1 py-0.5">bun run extract</code> from{" "}
          <code className="rounded bg-muted px-1 py-0.5">apps/viewer/</code> after the benchmark
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
