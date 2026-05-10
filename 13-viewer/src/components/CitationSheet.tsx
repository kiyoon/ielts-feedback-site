import { useEffect, useRef, useState } from "react";
import * as RD from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownView } from "@/components/MarkdownView";
import { loadCorpusFile } from "@/lib/data";
import { X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "citation-panel-width";
const MIN_WIDTH = 360;

function defaultWidth(): number {
  if (typeof window === "undefined") return 760;
  // Half the viewport, clamped to a comfortable reading column.
  return Math.min(1100, Math.max(640, Math.round(window.innerWidth * 0.5)));
}

function loadWidth(): number {
  if (typeof window === "undefined") return defaultWidth();
  const saved = window.localStorage.getItem(STORAGE_KEY);
  const n = saved ? parseInt(saved, 10) : NaN;
  if (!Number.isFinite(n) || n < MIN_WIDTH) return defaultWidth();
  return Math.min(window.innerWidth - 200, n);
}

// Persistent, non-modal side panel. Reading the cited corpus file should not
// dim or block the rest of the viewer. The panel is resizable: drag the left
// edge to change width; the size is persisted across reloads via localStorage.
export function CitationSheet({
  path,
  onClose,
}: {
  path: string | null;
  onClose: () => void;
}) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState<number>(() => loadWidth());
  const dragging = useRef(false);

  useEffect(() => {
    if (!path) {
      setContent("");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setContent("");
    const cleanPath = path.replace(/[#;§:].*$/, "").trim();
    loadCorpusFile(cleanPath)
      .then((c) => { if (!cancelled) setContent(c); })
      .catch((e) => {
        if (!cancelled)
          setContent(`_(failed to load \`${cleanPath}\`: ${String(e)})_`);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [path]);

  // Persist width when it changes (debounced via the drag-end commit below).
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, String(width));
  }, [width]);

  // Recompute clamping if the window resizes
  useEffect(() => {
    const onResize = () => {
      setWidth((w) => Math.min(window.innerWidth - 200, Math.max(MIN_WIDTH, w)));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const startResize = (clientX: number) => {
    dragging.current = true;
    const startX = clientX;
    const startWidth = width;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const x = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
      const next = Math.min(
        window.innerWidth - 200,
        Math.max(MIN_WIDTH, startWidth + (startX - x)),
      );
      setWidth(next);
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMove as EventListener);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove as EventListener);
      document.removeEventListener("touchend", onUp);
    };
    document.addEventListener("mousemove", onMove as EventListener);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onMove as EventListener);
    document.addEventListener("touchend", onUp);
  };

  // Keyboard resize: ←/→ shifts width by 32 px, ⇧+arrow by 96 px
  const onHandleKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const step = e.shiftKey ? 96 : 32;
    const delta = e.key === "ArrowLeft" ? +step : -step;
    setWidth((w) =>
      Math.min(
        window.innerWidth - 200,
        Math.max(MIN_WIDTH, w + delta),
      ),
    );
  };

  return (
    <RD.Root open={path !== null} onOpenChange={(o) => !o && onClose()} modal={false}>
      <RD.Portal>
        <RD.Content
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          aria-describedby={undefined}
          style={{ width: `${width}px` }}
          className={cn(
            "fixed right-0 top-0 z-40 h-full border-l bg-card shadow-xl flex outline-none",
            "animate-fade-in",
          )}
        >
          {/* Resize handle (left edge) */}
          <button
            type="button"
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize citation panel (drag, or ←/→ keys)"
            tabIndex={0}
            onMouseDown={(e) => startResize(e.clientX)}
            onTouchStart={(e) => startResize(e.touches[0].clientX)}
            onKeyDown={onHandleKey}
            className="group absolute left-0 top-0 z-10 flex h-full w-2 -translate-x-1/2 cursor-col-resize items-center justify-center bg-transparent hover:bg-foreground/10 focus-visible:bg-foreground/15 focus-visible:outline-none"
          >
            <GripVertical className="h-5 w-5 opacity-30 group-hover:opacity-80 group-focus-visible:opacity-90 transition-opacity" />
          </button>

          <div className="flex flex-1 flex-col gap-2 p-4 pl-5 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0">
                <RD.Title className="text-sm font-mono break-all">{path}</RD.Title>
                <RD.Description className="text-xs text-muted-foreground">
                  Corpus reference cited by the feedback. Drag the left edge (or ←/→) to resize.
                </RD.Description>
              </div>
              <button
                onClick={onClose}
                aria-label="close citation panel"
                className="rounded-sm p-1 text-muted-foreground hover:bg-accent focus-visible:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ScrollArea className="flex-1 -mx-2 px-2 border-t pt-2">
              {loading ? (
                <p className="text-xs text-muted-foreground">loading…</p>
              ) : (
                <MarkdownView>{content}</MarkdownView>
              )}
            </ScrollArea>
          </div>
        </RD.Content>
      </RD.Portal>
    </RD.Root>
  );
}
