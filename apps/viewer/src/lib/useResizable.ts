import { useEffect, useRef, useState } from "react";

export interface ResizableOptions {
  storageKey: string;
  defaultWidth: number | (() => number);
  min: number;
  /** Optional max width (or a function returning it, e.g. based on viewport) */
  max?: number | (() => number);
  /** Which side of the panel has the drag handle. */
  edge: "left" | "right";
}

/**
 * Generic horizontal-resize hook used by both Sidebar (handle on the right
 * edge — drag right to widen) and CitationSheet (handle on the left edge —
 * drag left to widen). Persists the chosen width to localStorage and
 * re-clamps when the viewport resizes.
 */
export function useResizable(opts: ResizableOptions) {
  const [width, setWidth] = useState<number>(() => {
    const fallback =
      typeof opts.defaultWidth === "function" ? opts.defaultWidth() : opts.defaultWidth;
    if (typeof window === "undefined") return fallback;
    const saved = window.localStorage.getItem(opts.storageKey);
    const n = saved ? parseInt(saved, 10) : NaN;
    if (Number.isFinite(n) && n >= opts.min) return n;
    return fallback;
  });
  const dragging = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(opts.storageKey, String(width));
    }
  }, [width, opts.storageKey]);

  useEffect(() => {
    const onResize = () => {
      const max =
        typeof opts.max === "function" ? opts.max() : opts.max ?? Number.MAX_SAFE_INTEGER;
      setWidth((w) => Math.max(opts.min, Math.min(max, w)));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.min]);

  const startResize = (clientX: number) => {
    dragging.current = true;
    const startX = clientX;
    const startWidth = width;
    const max =
      typeof opts.max === "function" ? opts.max() : opts.max ?? Number.MAX_SAFE_INTEGER;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const move = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const x = "touches" in e ? e.touches[0]?.clientX : e.clientX;
      if (x === undefined) return;
      const delta = opts.edge === "left" ? startX - x : x - startX;
      setWidth(Math.max(opts.min, Math.min(max, startWidth + delta)));
    };
    const up = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", move as EventListener);
      document.removeEventListener("mouseup", up);
      document.removeEventListener("touchmove", move as EventListener);
      document.removeEventListener("touchend", up);
    };
    document.addEventListener("mousemove", move as EventListener);
    document.addEventListener("mouseup", up);
    document.addEventListener("touchmove", move as EventListener);
    document.addEventListener("touchend", up);
  };

  const onResizeKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const step = e.shiftKey ? 96 : 32;
    const max =
      typeof opts.max === "function" ? opts.max() : opts.max ?? Number.MAX_SAFE_INTEGER;
    const delta =
      opts.edge === "left"
        ? e.key === "ArrowLeft"
          ? +step
          : -step
        : e.key === "ArrowLeft"
          ? -step
          : +step;
    setWidth((w) => Math.max(opts.min, Math.min(max, w + delta)));
  };

  return { width, startResize, onResizeKey };
}
