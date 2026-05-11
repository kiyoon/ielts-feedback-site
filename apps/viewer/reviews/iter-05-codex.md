# Iteration 05 — codex

_Generated 2026-05-10T14:16:31Z by codex (took 139s)._

---

# Iter 5 — codex

## What I changed
- apps/viewer/src/lib/highlight.ts:83-104,283-300 — overlap recording is now symmetric, so sibling overlaps inside a parent flag both affected children instead of only whichever child was processed later.
- apps/viewer/src/components/EssayPane.tsx:11-17,65-82,319-334 — removed the duplicate `ChildMarker` type declaration and reused the single interface.

## Verified
- bun build passes
- Real W1/W2 matcher check: `checked=21 additions_filtered=7 unmatched=0 nested=3 overlaps=0`
- Synthetic overlap checks: sub-nesting maps C under B; partial overlaps flag both affected rewrites with ghost rendering; sibling overlap inside a parent flags both children.
- `git diff --check` passes

## What's left
- Browser/Playwright visual verification for gutter bracket alignment and resize-handle drag/keyboard behavior is still worth doing in a browser-capable environment.
- Storybook scaffold under `apps/viewer/src/stories/` still appears unused but was left untouched.

## CONVERGENCE: REFINING