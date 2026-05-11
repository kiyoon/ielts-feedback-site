import { useEffect, useState } from "react";
import * as RD from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownView } from "@/components/MarkdownView";
import { loadCorpusFile } from "@/lib/data";
import { X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResizable } from "@/lib/useResizable";

const STORAGE_KEY = "citation-panel-width";
const MIN_WIDTH = 360;

function defaultWidth(): number {
  if (typeof window === "undefined") return 760;
  // Half the viewport, clamped to a comfortable reading column.
  return Math.min(1100, Math.max(640, Math.round(window.innerWidth * 0.5)));
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
  const { width, startResize, onResizeKey } = useResizable({
    storageKey: STORAGE_KEY,
    defaultWidth,
    min: MIN_WIDTH,
    max: () => Math.max(MIN_WIDTH, window.innerWidth - 200),
    edge: "left",
  });

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
            onMouseDown={(e) => {
              e.preventDefault();
              startResize(e.clientX);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              if (touch) startResize(touch.clientX);
            }}
            onKeyDown={onResizeKey}
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
