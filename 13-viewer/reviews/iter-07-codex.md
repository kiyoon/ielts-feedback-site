# Iteration 07 — codex

_Generated 2026-05-10T14:29:18Z by codex (took 156s)._

---

# Iter 7 — codex

## What I changed
- 13-viewer/src/lib/useResizable.ts:57-60 — removed the global `TouchEvent` dependency from drag handling and guarded empty touch events, so mouse drag does not break in browsers/environments without `TouchEvent`.
- 13-viewer/src/components/Sidebar.tsx:88-96, 13-viewer/src/components/CitationSheet.tsx:78-86 — prevent default selection/scroll behavior when starting resize drags and guard missing touch points.

## Verified
- bun build passes
- Real W1/W2 locator check: `checked=22 additions_filtered=7 unmatched=0 nested=3 overlaps=0`
- Synthetic matcher checks pass for partial overlap, A⊃B⊃C sub-nesting, and sibling overlap inside a parent
- `git diff --check` passes for touched files

## What's left
- Browser/Playwright visual verification is still blocked here: Vite cannot bind locally (`listen EPERM 127.0.0.1:5173`), so gutter bracket alignment, console errors, and live resize drag behavior still need browser confirmation.
- Storybook scaffold under `13-viewer/src/stories/` remains unused.

## CONVERGENCE: REFINING