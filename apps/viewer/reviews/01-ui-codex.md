# UI/UX review — codex

_Generated 2026-05-09T15:24:39Z by codex exec, read-only sandbox._

---

**Findings**

1. **Severity:** High  
   **Workflow affected:** W1, W6  
   **Issue:** Initial selection uses the numerically latest iteration, not the latest `CONVERGED` iteration, and both iteration lists start at baseline. With 50+ iterations, the selected item can be off-screen. See [App.tsx:36](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/App.tsx:36), [Sidebar.tsx:49](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/Sidebar.tsx:49), [IterationScrubber.tsx:54](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/IterationScrubber.tsx:54).  
   **Proposed fix:** Default to the last `CONVERGED` iteration, falling back to latest. Auto-scroll the selected sidebar row and scrubber dot into view. Add quick jumps: `Baseline`, `First converged`, `Latest converged`, `Latest`.  
   **Rationale:** The primary workflow is deciding what to read; the UI should answer that immediately.

2. **Severity:** High  
   **Workflow affected:** W6  
   **Issue:** Convergence is shown as isolated dots/badges, not as a chain state. The convergence note is buried after rewrites. See [Sidebar.tsx:74](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/Sidebar.tsx:74), [IterationScrubber.tsx:57](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/IterationScrubber.tsx:57), [FeedbackPane.tsx:92](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/FeedbackPane.tsx:92).  
   **Proposed fix:** Add a `ConvergenceSummary` above or inside `IterationScrubber`: “First converged: iter N”, “Score stable since: iter N”, “Latest status: converged/refining”. Move the selected iteration’s convergence note near the `Feedback` header.  
   **Rationale:** The user needs to know when the chain stopped changing, not just the verdict of one item.

3. **Severity:** High  
   **Workflow affected:** W2, W5  
   **Issue:** Per-criterion descriptor evidence and justification are hidden in tooltips. See [ScoresCard.tsx:41](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/ScoresCard.tsx:41). The source data contains substantive criterion explanations, e.g. [04-claude.md:21](/Users/kiyoon/project/ielts-feedback/benchmark/results/task1/04-claude.md:21).  
   **Proposed fix:** Make each score row expandable or visibly two-line by default: band, descriptor evidence, justification, and citation/source link. Keep tooltip only for secondary detail.  
   **Rationale:** Criterion rationale is primary content for IELTS study; hover-only content fails mobile and screen-reader workflows.

4. **Severity:** Blocker  
   **Workflow affected:** W3, accessibility  
   **Issue:** Core correction interactions are not keyboard accessible. Essay marks are clickable `<span>`s, and rewrite cards are clickable `<div>` cards. See [EssayPane.tsx:96](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/EssayPane.tsx:96), [RewriteCard.tsx:34](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/RewriteCard.tsx:34), [card.tsx:4](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/ui/card.tsx:4).  
   **Proposed fix:** Render marks and rewrite cards as real buttons, or add `role="button"`, `tabIndex`, `onKeyDown`, visible focus rings, and clear `aria-label`s. Add an explicit `Locate in essay` icon button on `RewriteCard`.  
   **Rationale:** “Click rewrite → locate phrase” is a primary workflow and must work without a mouse.

5. **Severity:** High  
   **Workflow affected:** W3  
   **Issue:** Rewrite-to-essay matching can silently fail. `buildSpans` drops unmatched rewrites without surfacing them, while the essay pane still reports total suggestions. See [highlight.ts:18](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/lib/highlight.ts:18), [EssayPane.tsx:44](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/EssayPane.tsx:44).  
   **Proposed fix:** Show `located N / total M` in `EssayPane`; mark unmatched `RewriteCard`s with “not found in essay”; add a fallback “search phrase” action.  
   **Rationale:** If “the figure of USA” does not highlight, the user needs to know whether it is missing, duplicated, or just off-screen.

6. **Severity:** High  
   **Workflow affected:** W4  
   **Issue:** Compare mode stacks two generic `Feedback` panes vertically, which halves reading space and does not directly answer “what did the corpus add?” See [App.tsx:136](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/App.tsx:136), [FeedbackPane.tsx:45](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/FeedbackPane.tsx:45).  
   **Proposed fix:** Add explicit pane labels: `Selected iteration` and `Baseline no-repo`. Add a `BaselineComparisonCard` with score deltas, new corpus-backed rewrites, changed rationale, and removed/unchanged advice. Change active button text to `Exit compare` and add `aria-pressed`.  
   **Rationale:** Stacked full feedback forces manual comparison; the workflow needs a diff summary first.

7. **Severity:** High  
   **Workflow affected:** W5  
   **Issue:** Corpus verification opens in a modal side dialog, separating the source from the rewrite being verified. See [RewriteCard.tsx:57](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/RewriteCard.tsx:57), [CitationSheet.tsx:28](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/CitationSheet.tsx:28). The benchmark often cites multiple files/sections per rewrite, e.g. [04-claude.md:34](/Users/kiyoon/project/ielts-feedback/benchmark/results/task1/04-claude.md:34).  
   **Proposed fix:** Replace modal-only access with a persistent `CitationInspector` side panel. Show the selected rewrite context at top, split multiple citations into chips, and scroll/highlight the cited section when possible.  
   **Rationale:** Verification needs side-by-side reading, not a context-stealing overlay.

8. **Severity:** Medium  
   **Workflow affected:** W1, W3, W6, accessibility  
   **Issue:** Several meanings are color-only: convergence mini dots, scrubber dots, and essay category marks. Some light-theme semantic colors are also likely low contrast, especially `text-emerald-300` and `text-amber-300`. See [Sidebar.tsx:91](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/Sidebar.tsx:91), [IterationScrubber.tsx:57](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/IterationScrubber.tsx:57), [badge.tsx:14](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/ui/badge.tsx:14), [styles.css:26](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/styles.css:26).  
   **Proposed fix:** Add text/icon backup for convergence in sidebar rows, visible category legend near the essay, and darker light-theme success/warning foregrounds.  
   **Rationale:** Color should reinforce meaning, not carry it alone.

9. **Severity:** High  
   **Workflow affected:** General, W1-W3, W5  
   **Issue:** The layout is effectively desktop-only: fixed sidebar, two equal columns, full-screen overflow hidden, no responsive breakpoints. See [App.tsx:84](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/App.tsx:84), [Sidebar.tsx:26](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/Sidebar.tsx:26), [App.tsx:128](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/App.tsx:128).  
   **Proposed fix:** Under `lg`, collapse sidebar into a task/iteration drawer, switch essay/feedback/corpus into tabs or vertical sections, and keep the iteration scrubber sticky.  
   **Rationale:** IELTS study and citation checking will happen on laptops and tablets; the current grid will crush content on narrow screens.

10. **Severity:** Medium  
    **Workflow affected:** W1, W2, W4  
    **Issue:** Pane headers lack enough state. Header shows app name, id, and tool, while both feedback panes say only `Feedback`. See [App.tsx:95](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/App.tsx:95), [FeedbackPane.tsx:45](/Users/kiyoon/project/ielts-feedback/apps/viewer/src/components/FeedbackPane.tsx:45).  
    **Proposed fix:** Give `FeedbackPane` props for `label` and `subtitle`, e.g. `Iter 04 · Claude · Band 6.0 · Converged` and `Baseline · No repo`. Pin that header inside each scroll area.  
    **Rationale:** Users comparing iterations should never have to infer which pane they are reading.

**Consensus Stance**

1. Make latest converged iteration the default, with visible convergence milestones.  
2. Expose criterion justifications without tooltips.  
3. Make essay marks and rewrite cards keyboard/screen-reader operable.  
4. Redesign compare mode around an explicit baseline-vs-selected diff summary.  
5. Replace modal-only citation viewing with a persistent side-by-side inspector.  
6. Surface failed or partial essay phrase matches.  
7. Add text/icon backups for color-coded convergence and categories.  
8. Add responsive layouts for narrow screens.  
9. Improve pane headers so iteration, tool, score, and baseline state are always visible.

No files changed; this was a UI/UX review only.