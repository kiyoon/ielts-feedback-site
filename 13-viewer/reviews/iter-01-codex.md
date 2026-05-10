# Iteration 01 — codex

_Generated 2026-05-10T13:55:22Z by codex (took 307s)._

---

# Iter 1 — codex

## What I changed
- 13-viewer/src/lib/highlight.ts:19-91,216-243 — track all located ranges, choose the tightest nested parent, and classify partial cross-range hits as overlaps instead of nested/unmatched.
- 13-viewer/src/components/EssayPane.tsx:27-114,171-290,338-370 — report overlap status to the app, fix nested scroll fallback to use `parentId`, add overlap filter UI, and clip overlapping nested-child rendering.
- 13-viewer/src/App.tsx:31-112,251-255 — store and reset overlap maps alongside unmatched/nested state.
- 13-viewer/src/components/FeedbackPane.tsx:37-65,167-188,216-292 and 13-viewer/src/components/RewriteCard.tsx:23-31,55-89 — filter/show overlap cards separately with “overlaps #…” instead of “covered by #…”.

## Verified
- bun build passes
- Synthetic matcher check: sub-nesting now reports C covered by B; partial A/B overlap reports `overlaps`, not `nested` or `unmatched`
- Real W1/W2 data check: `{"files":21,"unmatched":0,"overlaps":2}`

## What's left
- Browser-level visual verification of gutter bracket alignment and hover/focus behavior would still be useful.
- The two real overlap cases are now surfaced, but their inline text is not drawn as a second overlapping highlight.

## CONVERGENCE: REFINING