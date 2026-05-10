import type { FeedbackPayload, IndexPayload } from "@/types";

const cache = new Map<string, FeedbackPayload>();
const inflight = new Map<string, Promise<FeedbackPayload>>();

function isIndex(p: unknown): p is IndexPayload {
  if (!p || typeof p !== "object") return false;
  const o = p as Record<string, unknown>;
  return typeof o.tasks === "object" && o.tasks !== null;
}

function isFeedback(p: unknown): p is FeedbackPayload {
  if (!p || typeof p !== "object") return false;
  const o = p as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.task === "string" &&
    typeof o.iteration === "number" &&
    Array.isArray(o.rewrites) &&
    typeof o.scores === "object" &&
    o.scores !== null &&
    typeof o.raw_markdown === "string"
  );
}

export async function loadIndex(): Promise<IndexPayload> {
  const r = await fetch("/data/index.json");
  if (!r.ok) throw new Error(`index.json missing — run \`npm run extract\``);
  const json: unknown = await r.json();
  if (!isIndex(json)) throw new Error("index.json shape is invalid");
  return json;
}

export async function loadFeedback(id: string): Promise<FeedbackPayload> {
  const hit = cache.get(id);
  if (hit) return hit;
  const live = inflight.get(id);
  if (live) return live;
  const promise = (async () => {
    try {
      const r = await fetch(`/data/${id}.json`);
      if (!r.ok) throw new Error(`${id} payload missing`);
      const json: unknown = await r.json();
      if (!isFeedback(json)) throw new Error(`${id} payload shape is invalid`);
      cache.set(id, json);
      return json;
    } finally {
      inflight.delete(id);
    }
  })();
  inflight.set(id, promise);
  return promise;
}

export async function loadCorpusFile(path: string): Promise<string> {
  // The corpus lives one level up from /13-viewer; vite serves it via a
  // symlink at /public/corpus → ../ ; if that symlink isn't present, the
  // dev server returns 404 and the citation panel shows a placeholder.
  const r = await fetch(`/corpus/${path}`);
  if (!r.ok) return `_(corpus file ${path} not available — symlink ./public/corpus → .. is missing)_`;
  return r.text();
}
