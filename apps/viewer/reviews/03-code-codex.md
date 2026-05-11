# Code review — codex

_Generated 2026-05-09T15:41:51Z, read-only._

---

**Bugs**

1. **Severity:** High  
   **File:line:** `src/App.tsx:100`  
   **Bug:** `index.tasks[task]` is dereferenced after earlier code treats it as optional. If `index.json` is missing `task1` or `task2`, or task changes while old `selectedId`/`feedback` are still set, render crashes.  
   **Fix:** Guard before dereference:
   ```ts
   const taskData = index.tasks[task];
   if (!taskData) return <ErrorScreen message={`index.json is missing ${task}`} />;
   const { essay, iterations } = taskData;
   ```

2. **Severity:** Medium  
   **File:line:** `src/App.tsx:38-40`, `src/App.tsx:98`, `public/data/index.json:10`  
   **Bug:** Empty `iterations` leaves the app permanently on “loading feedback…”. The checked-in placeholder index triggers this immediately.  
   **Fix:** Add an explicit empty state after `index` loads:
   ```ts
   if (iterations.length === 0) return <NoIterationsScreen task={task} />;
   ```

3. **Severity:** High  
   **File:line:** `src/lib/data.ts:5-17`  
   **Bug:** `loadIndex`/`loadFeedback` trust raw JSON via return typing/cast. `null`, missing `rewrites`, missing `scores`, or malformed `tasks` crash later in components.  
   **Fix:** Parse as `unknown` and validate before returning:
   ```ts
   const payload: unknown = await r.json();
   if (!isFeedbackPayload(payload)) throw new Error(`${id} payload is invalid`);
   return payload;
   ```

4. **Severity:** Medium  
   **File:line:** `src/App.tsx:45-48`, `src/App.tsx:56-59`  
   **Bug:** Async payload loads are not cancelled or ignored when `selectedId`/`baselineId` changes. Rapid navigation can display feedback for the wrong iteration/task.  
   **Fix:** Clear stale state and ignore late promises:
   ```ts
   useEffect(() => {
     if (!selectedId) { setFeedback(null); return; }
     let cancelled = false;
     setFeedback(null);
     loadFeedback(selectedId)
       .then((p) => { if (!cancelled) setFeedback(p); })
       .catch((e) => { if (!cancelled) setError(String(e)); });
     return () => { cancelled = true; };
   }, [selectedId]);
   ```

5. **Severity:** Medium  
   **File:line:** `src/App.tsx:21-23`, `src/App.tsx:45-48`  
   **Bug:** `activeRewriteId` and compare state survive iteration/task changes. Selecting rewrite `#3`, then switching iterations, marks rewrite `#3` in the new payload even though the user did not select it.  
   **Fix:** Reset selection on payload change:
   ```ts
   useEffect(() => {
     setActiveRewriteId(null);
     setUnmatchedIds(new Set());
   }, [selectedId]);
   ```

6. **Severity:** Medium  
   **File:line:** `src/components/CitationSheet.tsx:21-29`  
   **Bug:** Citation loads have no `catch` and no stale-result guard. Network failure creates an unhandled rejection; clicking citation A then B can let A overwrite B.  
   **Fix:** Clear content, catch failures, and ignore late promises:
   ```ts
   let cancelled = false;
   setLoading(true);
   setContent("");
   loadCorpusFile(cleanPath)
     .then((text) => { if (!cancelled) setContent(text); })
     .catch((e) => { if (!cancelled) setContent(`_(failed to load ${cleanPath}: ${String(e)})_`); })
     .finally(() => { if (!cancelled) setLoading(false); });
   return () => { cancelled = true; };
   ```

7. **Severity:** High  
   **File:line:** `src/components/RewriteCard.tsx:31-106`  
   **Bug:** A `<button>` wraps focusable citation controls (`span role="button" tabIndex={0}`). This is invalid nested interactive content and breaks keyboard/screen-reader semantics.  
   **Fix:** Make the card container non-interactive and put citations outside the main activation button:
   ```tsx
   <article className={...}>
     <button ref={ref} type="button" onClick={onActivate}>...</button>
     {rewrite.citations.map((c, i) => (
       <button type="button" key={`${c}-${i}`} onClick={(e) => { e.stopPropagation(); onCiteClick?.(c); }}>
         {c}
       </button>
     ))}
   </article>
   ```

8. **Severity:** Medium  
   **File:line:** `src/components/ui/badge.tsx:26-31`, `src/components/FeedbackPane.tsx:151`, `src/components/FeedbackPane.tsx:166`  
   **Bug:** `Badge` renders a `<div>`, and `FilterBar` renders badges inside `<Button>`, producing invalid `<div>` inside `<button>`.  
   **Fix:** Render badges as spans:
   ```ts
   export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}
   export function Badge({ className, variant, ...props }: BadgeProps) {
     return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
   }
   ```

9. **Severity:** Medium  
   **File:line:** `src/components/FeedbackPane.tsx:44`, `src/components/ScoresCard.tsx:31`  
   **Bug:** `CardTitle` renders an `h3`, but these titles put `<div>` children inside it, producing invalid heading markup.  
   **Fix:** Change those inner wrappers from `div` to `span`:
   ```tsx
   <span className="flex items-center gap-2 text-sm">...</span>
   <span className="flex items-baseline gap-2">...</span>
   ```

10. **Severity:** Medium  
    **File:line:** `src/lib/highlight.ts:45-53`, `extract/payload.schema.json:46-53`, `src/types.ts:73-75`  
    **Bug:** Payloads may include `offset`, but the renderer trusts any bounded offset without checking it matches `rewrite.original`. A stale or malformed offset highlights the wrong essay text.  
    **Fix:** Validate the slice before accepting the offset:
    ```ts
    const actual = essay.slice(start, end).trim();
    const expected = r.original.trim();
    if (start >= 0 && end <= essay.length && start < end && actual === expected && !rangeClaimed(claimed, start, end)) {
      return { start, end };
    }
    ```

11. **Severity:** High  
    **File:line:** `extract/extract-payloads.sh:7`, `extract/extract-payloads.sh:79-93`  
    **Bug:** Extraction failures are logged but do not fail the script because `set -e` is absent and `run_task` does not propagate `extract_one` failures. The script can exit 0 after producing partial data.  
    **Fix:** Fail fast:
    ```bash
    set -euo pipefail
    ...
    extract_one "$task" "$(basename "$f")" || return 1
    ...
    all) run_task task1 && run_task task2;;
    ```

12. **Severity:** Medium  
    **File:line:** `tailwind.config.js:65`  
    **Bug:** The package is ESM (`"type": "module"`), but the Tailwind config uses `require`. Native ESM import fails with `ReferenceError: require is not defined`.  
    **Fix:** Use ESM import:
    ```js
    import animate from "tailwindcss-animate";
    ...
    plugins: [animate],
    ```

13. **Severity:** Medium  
    **File:line:** `extract/extract-prompt.md:37-38`, `extract/extract-prompt.md:64-65`  
    **Bug:** The prompt only preserves `convergence_note` under `## CONVERGENCE: ...`; inputs with `## Convergence note` but no verdict get `convergence_note: ""`, losing useful data.  
    **Fix:** Update the hard rule:
    ```md
    If `## CONVERGENCE: X` appears, use X and the section body.
    If only `## Convergence note` appears, set convergence to "UNKNOWN" and copy that section body into convergence_note.
    ```

**Top 5 Must-Fix**

1. `extract/extract-payloads.sh` silently succeeds after extraction failures.  
2. `App.tsx` crashes or misrenders when `index.tasks[task]` is missing.  
3. `loadIndex`/`loadFeedback` accept null or malformed JSON as typed payloads.  
4. `App.tsx` async feedback loads can race and display the wrong iteration.  
5. `RewriteCard.tsx` nests interactive citation controls inside a button.