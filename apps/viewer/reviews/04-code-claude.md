# Code review — claude

_Generated 2026-05-09T15:40:27Z, read-only._

---

Reviewed all files. Below is the bugs-only list.

---

## Bugs

### 1. **High** — `src/App.tsx:36-43, 100-101`
**Bug:** When the user switches to a task with `iterations.length === 0`, the effect early-returns (line 39) and `selectedId` keeps pointing at the previous task's iteration. The render path (`if (!index || !selectedId || !feedback)` at line 98) does *not* fail, so line 100-101 read `index.tasks[task].essay` / `.iterations` for the new task while `feedback` still belongs to the old task. The right-hand essay pane then shows an empty `essay.text` with the previous task's rewrites all marked "not in essay". Also, if `index.tasks[task]` itself were `undefined` (stale/hand-edited index), line 100 would throw.

**Fix:**
```ts
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
```
And replace lines 100-101 with a guarded read:
```ts
const taskBundle = index.tasks[task];
if (!taskBundle || taskBundle.iterations.length === 0) {
  return <EmptyTaskScreen task={task} />; // or reuse SplashScreen
}
const { essay, iterations } = taskBundle;
```

---

### 2. **High** — `src/components/CitationSheet.tsx:21-29`
**Bug:** Async race. If `path` changes from A → B before A's `loadCorpusFile` resolves, the late A response overwrites the in-progress B render via `setContent`. Also, when `path` becomes `null` (close) then opens again to a new path, the previous corpus body is still in `content` state and flashes during loading.

**Fix:**
```ts
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
    .finally(() => { if (!cancelled) setLoading(false); });
  return () => { cancelled = true; };
}, [path]);
```

---

### 3. **High** — `src/App.tsx:45-48` and `56-59`
**Bug:** Same async race for `loadFeedback`. Spamming `j`/`k` (or rapid sidebar clicks) on a slow network can cause an older request to resolve last and replace `feedback` for a newer `selectedId`. Same applies to baseline reloads on task change.

**Fix:** Add a cancellation flag identical to fix #2:
```ts
useEffect(() => {
  if (!selectedId) return;
  let cancelled = false;
  loadFeedback(selectedId)
    .then((p) => { if (!cancelled) setFeedback(p); })
    .catch((e) => { if (!cancelled) setError(String(e)); });
  return () => { cancelled = true; };
}, [selectedId]);
```
Apply the same pattern to the `baselineId` effect.

---

### 4. **High** — `src/components/EssayPane.tsx:45-55` ↔ `src/components/RewriteCard.tsx:25-29`
**Bug:** Both components call `.focus()` whenever `activeRewriteId` (or `active`) flips. Clicking a `RewriteCard` triggers `App.handleSetActive` → bumps `scrollKey` → `EssayPane` effect runs and steals focus to the `essay-mark <button>`. Result: keyboard focus jumps off the card the user just clicked, breaks subsequent Tab order, and on long essays scrolls the essay pane every time even when the user only wants to read the right pane. The two effects fight depending on render order.

**Fix:** Choose one focus owner. A safe rule is: scroll the essay span into view but do **not** steal focus from `RewriteCard`. Drop the `node.focus()` call in `EssayPane`:
```ts
useEffect(() => {
  if (activeRewriteId == null) return;
  const node = containerRef.current?.querySelector(
    `[data-rewrite-id="${activeRewriteId}"]`,
  ) as HTMLElement | null;
  node?.scrollIntoView({ behavior: "smooth", block: "center" });
}, [activeRewriteId, scrollKey]);
```
Equivalently, drop `RewriteCard`'s auto-focus effect and let only the essay mark take focus when navigating from the essay side. Either way, only one side calls `.focus()`.

---

### 5. **Medium** — `extract/extract-payloads.sh:31-38`
**Bug:** Only `00-baseline-codex` is hardcoded to `tool=baseline`. A baseline file named `00-baseline-claude.md` (or any other `00-…`) falls through to the wildcard branch, producing `iter=0` but `tool=baseline-claude`. The `payload.schema.json` enum (`codex|claude|baseline`) then rejects the JSON, the script logs `[fail] invalid JSON` (or codex output gets dropped), and that iteration silently disappears from the index.

**Fix:**
```bash
case $id in
  00-baseline-*|00-baseline) iter=0; tool=baseline;;
  *)
    iter=$(echo "$id" | sed -E 's/^([0-9]+)-.*/\1/' | sed 's/^0*//;s/^$/0/')
    tool=$(echo "$id" | sed -E 's/^[0-9]+-(.*)/\1/')
    ;;
esac
```

---

### 6. **Medium** — `extract/rebuild-index.mjs:17-23`
**Bug:** Both regexes require a trailing `\n##\s+` header. If the essay file ends with `## Essay …` and no further `## ` heading (e.g. the word-count header is missing or uses `###`), `essayMatch` is `null` and `text` becomes `""`. `prompt` has the same problem. The fallback word count of `"".split(/\s+/).length` then reports `1`, not 0. Silent corruption of the index.

**Fix:** allow EOF as a terminator:
```js
const promptMatch = md.match(/##\s+Prompt\s+([\s\S]*?)(?:\n##\s+|$)/);
const essayMatch  = md.match(/##\s+Essay\s+([\s\S]*?)(?:\n##\s+|$)/);
…
const word_count = wcDigits ? parseInt(wcDigits[1], 10)
                            : (text ? text.split(/\s+/).filter(Boolean).length : 0);
```

---

### 7. **Medium** — `src/components/EssayPane.tsx:88-100`
**Bug:** `key={i}` for `segments`. When `feedback.rewrites` change (j/k navigation across iterations), segment count and order shift. React reuses prior `<MarkSpan>` DOM nodes by index, so the focused/active mark and any tooltip portal can latch onto the wrong rewrite mid-transition. With portaled tooltips this also produces brief stale tooltip content.

**Fix:** Generate a stable key per segment:
```tsx
seg.span ? (
  <MarkSpan key={`m-${seg.span.rewriteId}-${seg.span.start}`} … />
) : (
  <span key={`p-${i}-${seg.text.length}`}>{seg.text}</span>
)
```

---

### 8. **Medium** — `src/components/ConvergenceSummary.tsx:13-21`
**Bug:** `stableSince` logic is off-by-one and inverted in the empty case.
- The loop starts at `i = ordered.length - 1` and walks down. It records `ordered[Math.min(i + 1, ordered.length - 1)]` — for `i = ordered.length - 1`, that resolves to the **last** iteration, not the iteration where the score first stabilised. The intended semantic ("oldest iteration whose score has stayed flat through the latest") is not what's computed.
- When the chain is fully flat (no diff > 0.01 anywhere), the loop never assigns `stableSince`, so it falls into `if (!stableSince && ordered.length) stableSince = ordered[0]` — i.e. the *baseline-after* iteration, contradicting "stable since" if the user expects the latest.
- For `ordered.length === 1`, the loop condition `i > 0` is false on entry, so `stableSince = ordered[0]` — correct only by accident.

**Fix:** Walk forward from the latest, and stop when scores diverge:
```ts
let stableSince: IterationSummary | null = ordered[ordered.length - 1] ?? null;
for (let i = ordered.length - 1; i > 0; i--) {
  if (Math.abs(ordered[i].overall - ordered[i - 1].overall) > 0.01) break;
  stableSince = ordered[i - 1];
}
```

---

### 9. **Medium** — `src/components/Sidebar.tsx:37-39`
**Bug:** `useEffect [selectedId]` runs `ref.current?.scrollIntoView`, but `ref` is conditionally bound only when the selected row is in `filtered`. If the user has `filterTool="claude"` and a baseline iteration is selected programmatically (e.g. by `ConvergenceSummary` "first converged"), the row isn't rendered, `ref.current` is `null`, scrolling doesn't happen, and the user can't see why their click "did nothing". After they then clear the filter, the row re-renders but the effect doesn't re-fire because `selectedId` didn't change in the interim.

**Fix:** Either (a) clear filters when `onSelect` is called from outside, or (b) re-run when `filtered` changes:
```ts
useEffect(() => {
  ref.current?.scrollIntoView({ block: "nearest" });
}, [selectedId, filtered]);
```

---

### 10. **Medium** — `src/lib/highlight.ts:22-38`
**Bug:** `Array(essay.length).fill(false)` allocates one boolean per character of the essay, and `rangeClaimed` is O(span length) on every probe. For very long manifests where many rewrites near the end overlap with claimed regions, the inner `locate` loop calls `rangeClaimed` repeatedly, so worst-case is O(R · E) per essay (R rewrites, E essay length). For typical IELTS 250-word essays this is fine; for the benchmark long-form prompts (~5K chars × 30 rewrites) it's still well under a frame, but a regex-bashed `claimed` ranges array (interval list) would be cleaner. Not a crasher.

**Fix:** Optional. If you hit this, replace `boolean[]` with a sorted `[start,end][]` interval list and binary-search.

---

### 11. **Medium** — `src/lib/data.ts:11-18`
**Bug:** No in-flight de-duplication. If two effects request the same `id` concurrently (e.g. baseline === selected on first render after switching tasks back), two `fetch()` calls go out and only the second populates the cache. Minor for static JSON over HTTP/2 multiplexing, but trivial to fix.

**Fix:**
```ts
const cache = new Map<string, FeedbackPayload>();
const inflight = new Map<string, Promise<FeedbackPayload>>();
export async function loadFeedback(id: string): Promise<FeedbackPayload> {
  const hit = cache.get(id);
  if (hit) return hit;
  const live = inflight.get(id);
  if (live) return live;
  const p = (async () => {
    const r = await fetch(`/data/${id}.json`);
    if (!r.ok) throw new Error(`${id} payload missing`);
    const payload = (await r.json()) as FeedbackPayload;
    cache.set(id, payload);
    inflight.delete(id);
    return payload;
  })();
  inflight.set(id, p);
  return p;
}
```

---

### 12. **Medium** — `src/components/RewriteCard.tsx:81-103`
**Bug:** Citation chips use `role="button"` + `tabIndex={0}` on a `<span>` nested inside an outer `<button>` (the card itself, line 32). HTML disallows nested interactive content; React will render it but browsers can split focus and screen readers announce the inner element as inert. On click, `e.stopPropagation()` correctly prevents the parent click, but keyboard `Enter`/`Space` while focused on the chip will both expand the chip handler *and* (in some browsers) bubble to the parent button despite the `stopPropagation`, since `preventDefault` isn't enough on Space for nested buttons.

**Fix:** Don't make the outer card a `<button>`. Use `<div role="button" tabIndex={0} onKeyDown={...}>` for the card, or move citation chips outside the card button. Simpler: change the outer to a `div` with the same key handler that's already on it.

---

### 13. **Low/Medium** — `src/App.tsx:78-95`
**Bug (not a leak):** The keydown listener is correctly added/removed (no leak). However it is re-bound on every change of `[index, task, selectedId, baselineId, citation]`, which churns event-listener registration during j/k mashing. `c` and `Escape` handlers use stale `baselineId`/`citation` only because of these deps; fold via refs to keep the listener stable.

**Fix (optional, perf):** Hold the latest values in `useRef` and bind once:
```ts
const latest = useRef({ ordered: [...], selectedId, baselineId, citation });
latest.current = { … };
useEffect(() => {
  const handler = (e: KeyboardEvent) => { /* read from latest.current */ };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, []);
```

---

### Files with no blocking issues found
- `src/main.tsx`
- `src/types.ts` (matches `payload.schema.json` and `extract-prompt.md`)
- `src/lib/utils.ts`
- `src/components/MarkdownView.tsx`
- `src/components/ScoresCard.tsx`
- `src/components/IterationScrubber.tsx`
- `src/components/ConvergenceBadge.tsx`
- `src/components/CompareDiff.tsx`
- All `src/components/ui/*.tsx`
- `vite.config.ts`, `tsconfig.*.json`, `index.html`, `styles.css`
- `extract/payload.schema.json`, `extract/extract-prompt.md`

---

## Top 5 must-fix

1. **#1 — App.tsx task-switch with empty iterations** renders the wrong essay against another task's feedback (corrupts the user's view; trivial fix).
2. **#2 — CitationSheet race** late-resolving fetches overwrite the visible citation (highly reproducible by clicking two chips quickly).
3. **#3 — App.tsx feedback/baseline race** late-resolving payloads desync `feedback` from `selectedId` during fast j/k navigation.
4. **#4 — Dueling focus between EssayPane and RewriteCard** breaks keyboard nav and pulls focus off the right pane on every click.
5. **#5 — extract-payloads.sh baseline parsing** silently drops any baseline file not named exactly `00-baseline-codex.md` because of the schema enum mismatch.
