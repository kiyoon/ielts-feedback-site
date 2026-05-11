# Code-quality review — IELTS Feedback Viewer

You are a senior frontend engineer doing a CODE-quality review of `/Users/kiyoon/project/ielts-feedback/apps/viewer/`. A separate UI/UX review has already been applied — those concerns are out of scope. Focus on:

- TypeScript correctness (any unused imports, weak types, casts, optional chains that hide bugs?)
- React correctness (effect dependencies, stale closures, render performance, key warnings, accidental re-renders)
- Hook usage (custom hooks needed? `useCallback`/`useMemo` placement)
- Edge cases (empty arrays, null payloads, very long essays, very long manifests, network failure paths)
- Memory/event-listener leaks (especially the keydown handler in `App.tsx`)
- Accessibility correctness at the code level (aria attributes, focus management bugs, click handler on non-interactive elements that survived)
- Build correctness (paths, glob patterns, vite alias usage, imports inside `extract/` running under node)
- Schema mismatch between `extract-prompt.md`, `payload.schema.json`, and `src/types.ts`
- Anything that would crash at runtime when `index.tasks[task]` is missing or `iterations` is empty

## What to read

1. `apps/viewer/package.json` (deps + scripts)
2. `apps/viewer/vite.config.ts`, `tsconfig*.json`
3. `apps/viewer/src/types.ts`
4. `apps/viewer/src/lib/utils.ts`, `data.ts`, `highlight.ts`
5. `apps/viewer/src/App.tsx`
6. `apps/viewer/src/components/*.tsx` (Sidebar, IterationScrubber, ConvergenceSummary, EssayPane, FeedbackPane, RewriteCard, ScoresCard, ConvergenceBadge, MarkdownView, CompareDiff, CitationSheet)
7. `apps/viewer/src/components/ui/*.tsx`
8. `apps/viewer/styles.css`
9. `apps/viewer/extract/extract-prompt.md`, `extract-payloads.sh`, `rebuild-index.mjs`, `payload.schema.json`

## What to produce

A **bugs-list-only** review. No nitpicks, no style preferences, no "consider doing X". Each item:

- **Severity:** Blocker / High / Medium
- **File:line**
- **Bug:** what's wrong, what triggers it
- **Fix:** concrete patch (paste the corrected lines or describe the diff)

End with a "Top 5 must-fix" prioritised list.

## Anti-rules

- Do NOT propose architectural rewrites. Existing components stay.
- Do NOT propose adding new dependencies unless one is necessary to fix a bug.
- Do NOT comment on visual design (covered by the UI/UX review).
- Do NOT critique benchmark code in `benchmark/` — out of scope.

If you find no bugs, say so explicitly per file and return a one-line "no blocking issues" verdict.
